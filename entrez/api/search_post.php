<?php
/**
 * POST方式的生物信息学搜索API
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理OPTIONS预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 只接受POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => '只支持POST请求'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 获取POST参数
    $database = $_POST['db'] ?? 'pubmed';
    $keyword = $_POST['term'] ?? '';
    $retmax = min(50, max(1, intval($_POST['retmax'] ?? 20)));

    // 验证参数
    if (empty($keyword)) {
        throw new Exception('搜索关键词不能为空');
    }

    $allowedDbs = ['pubmed', 'gene', 'protein', 'nucleotide'];
    if (!in_array($database, $allowedDbs)) {
        throw new Exception('不支持的数据库类型');
    }

    // 包含搜索函数
    require_once 'search_functions.php';

    // 执行搜索
    $results = searchNCBI($database, $keyword, $retmax);
    
    // 返回结果，标记为POST方式
    echo json_encode([
        'success' => true,
        'method' => 'POST',
        'database' => $database,
        'keyword' => $keyword,
        'count' => $results['count'],
        'details' => $results['details']
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'method' => 'POST',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
