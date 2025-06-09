<?php
/**
 * 共享的搜索函数
 */

/**
 * 搜索NCBI数据库
 */
function searchNCBI($database, $keyword, $retmax) {
    // 第一步：搜索获取ID列表
    $searchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
    $searchParams = [
        'db' => $database,
        'term' => $keyword,
        'retmax' => $retmax,
        'retmode' => 'xml',
        'sort' => 'relevance'
    ];

    $context = stream_context_create([
        'http' => [
            'timeout' => 15,
            'user_agent' => 'BioinfoSearch/1.0'
        ]
    ]);

    $searchXml = @file_get_contents($searchUrl . '?' . http_build_query($searchParams), false, $context);
    
    if ($searchXml === false) {
        throw new Exception('无法连接到NCBI服务器');
    }

    $searchData = simplexml_load_string($searchXml);
    if ($searchData === false) {
        throw new Exception('搜索结果解析失败');
    }

    $count = (int)$searchData->Count;
    $ids = [];
    
    if (isset($searchData->IdList->Id)) {
        foreach ($searchData->IdList->Id as $id) {
            $ids[] = (string)$id;
        }
    }

    if (empty($ids)) {
        return ['count' => 0, 'details' => []];
    }

    // 第二步：获取详细信息
    $details = fetchDetails($database, $ids);

    return [
        'count' => $count,
        'details' => $details
    ];
}

/**
 * 获取详细信息
 */
function fetchDetails($database, $ids) {
    $fetchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
    $fetchParams = [
        'db' => $database,
        'id' => implode(',', $ids),
        'retmode' => 'xml'
    ];

    $context = stream_context_create([
        'http' => [
            'timeout' => 10,  // 减少超时时间
            'user_agent' => 'BioinfoSearch/1.0',
            'ignore_errors' => true
        ]
    ]);

    $fetchXml = @file_get_contents($fetchUrl . '?' . http_build_query($fetchParams), false, $context);
    
    if ($fetchXml === false) {
        return createBasicEntries($database, $ids);
    }

    return parseXML($database, $fetchXml, $ids);
}

/**
 * 解析XML数据
 */
function parseXML($database, $xml, $ids) {
    $data = simplexml_load_string($xml);
    if ($data === false) {
        return createBasicEntries($database, $ids);
    }

    $results = [];

    switch ($database) {
        case 'pubmed':
            $results = parsePubMed($data);
            break;
        case 'gene':
            $results = parseGene($data);
            break;
        case 'protein':
        case 'nucleotide':
            $results = parseSequence($data, $database);
            break;
    }

    if (empty($results)) {
        return createBasicEntries($database, $ids);
    }

    return $results;
}

/**
 * 解析PubMed数据
 */
function parsePubMed($xml) {
    $results = [];
    $articles = [];

    if (isset($xml->PubmedArticle)) {
        $articles = $xml->PubmedArticle;
    } elseif (isset($xml->PubmedArticleSet->PubmedArticle)) {
        $articles = $xml->PubmedArticleSet->PubmedArticle;
    }

    foreach ($articles as $article) {
        $citation = $article->MedlineCitation;
        $pmid = (string)$citation->PMID;
        $articleData = $citation->Article;

        $title = strip_tags((string)$articleData->ArticleTitle);
        
        // 提取摘要
        $abstract = '';
        if (isset($articleData->Abstract->AbstractText)) {
            if (count($articleData->Abstract->AbstractText) > 1) {
                $parts = [];
                foreach ($articleData->Abstract->AbstractText as $part) {
                    $parts[] = (string)$part;
                }
                $abstract = implode(' ', $parts);
            } else {
                $abstract = (string)$articleData->Abstract->AbstractText;
            }
        }

        // 提取作者
        $authors = [];
        if (isset($articleData->AuthorList->Author)) {
            foreach ($articleData->AuthorList->Author as $author) {
                $lastName = (string)$author->LastName;
                $initials = (string)$author->Initials;
                if ($lastName) {
                    $authors[] = $lastName . ($initials ? ' ' . $initials : '');
                }
            }
        }

        // 提取期刊和年份
        $journal = (string)$articleData->Journal->Title;
        $year = null;
        if (isset($articleData->Journal->JournalIssue->PubDate->Year)) {
            $year = (int)$articleData->Journal->JournalIssue->PubDate->Year;
        }

        $results[] = [
            'id' => $pmid,
            'title' => $title,
            'abstract' => $abstract,
            'authors' => $authors,
            'journal' => $journal,
            'year' => $year,
            'pmid' => $pmid,
            'url' => "https://pubmed.ncbi.nlm.nih.gov/{$pmid}/",
            'database' => 'pubmed'
        ];
    }

    return $results;
}

/**
 * 解析Gene数据
 */
function parseGene($xml) {
    $results = [];
    $genes = $xml->Entrezgene ?? [];

    foreach ($genes as $gene) {
        $id = (string)$gene->{'Entrezgene_track-info'}->{'Gene-track'}->{'Gene-track_geneid'};
        $symbol = (string)$gene->{'Entrezgene_gene'}->{'Gene-ref'}->{'Gene-ref_locus'};
        $description = (string)$gene->{'Entrezgene_gene'}->{'Gene-ref'}->{'Gene-ref_desc'};

        $results[] = [
            'id' => $id,
            'title' => $symbol ? "{$symbol} - {$description}" : "Gene ID: {$id}",
            'abstract' => $description,
            'authors' => [],
            'journal' => '',
            'year' => null,
            'url' => "https://www.ncbi.nlm.nih.gov/gene/{$id}",
            'database' => 'gene'
        ];
    }

    return $results;
}

/**
 * 解析序列数据（Protein/Nucleotide）
 */
function parseSequence($xml, $database) {
    $results = [];
    $sequences = $xml->GBSeq ?? [];

    foreach ($sequences as $seq) {
        $accession = (string)$seq->{'GBSeq_accession-version'};
        $definition = (string)$seq->{'GBSeq_definition'};
        $organism = (string)$seq->{'GBSeq_organism'};
        $length = (string)$seq->{'GBSeq_length'};

        $results[] = [
            'id' => $accession,
            'title' => $definition ?: "{$database}: {$accession}",
            'abstract' => "来源: {$organism}，长度: {$length}" . ($database === 'protein' ? ' aa' : ' bp'),
            'authors' => [],
            'journal' => '',
            'year' => null,
            'url' => "https://www.ncbi.nlm.nih.gov/{$database}/{$accession}",
            'database' => $database
        ];
    }

    return $results;
}

/**
 * 创建基础条目
 */
function createBasicEntries($database, $ids) {
    $results = [];
    
    foreach ($ids as $id) {
        $results[] = [
            'id' => $id,
            'title' => "Entry ID: {$id}",
            'abstract' => "来自 {$database} 数据库的条目，详细信息获取失败。",
            'authors' => [],
            'journal' => '',
            'year' => null,
            'url' => "https://www.ncbi.nlm.nih.gov/{$database}/{$id}",
            'database' => $database
        ];
    }

    return $results;
}
?>
