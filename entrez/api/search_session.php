<?php
/**
 * SESSION方式的生物信息学搜索API - 第一步：存储搜索参数
 */

session_start();

// 动态设置CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000'
];

header('Content-Type: application/json; charset=utf-8');
if (in_array($origin, $allowedOrigins) || empty($origin)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: 'http://localhost'));
    header('Access-Control-Allow-Credentials: true');
}
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

    // 将搜索参数存储到SESSION中
    $_SESSION['search_params'] = [
        'database' => $database,
        'keyword' => $keyword,
        'retmax' => $retmax,
        'timestamp' => time()
    ];

    // 包含搜索函数
    require_once 'search_functions.php';

    // 执行搜索并存储结果到SESSION
    $results = searchNCBI($database, $keyword, $retmax);

    $_SESSION['search_results'] = [
        'success' => true,
        'method' => 'SESSION',
        'database' => $database,
        'keyword' => $keyword,
        'count' => $results['count'],
        'details' => $results['details'],
        'timestamp' => time()
    ];

    // 直接返回搜索结果（简化版SESSION）
    echo json_encode($_SESSION['search_results'], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // 存储错误到SESSION
    $_SESSION['search_results'] = [
        'success' => false,
        'method' => 'SESSION',
        'error' => $e->getMessage(),
        'timestamp' => time()
    ];

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'method' => 'SESSION',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
