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
    // 包含搜索函数
    require_once 'search_functions.php';

    // 验证参数
    $params = validateSearchParams($_POST);

    // 将搜索参数存储到SESSION中
    $_SESSION['search_params'] = [
        'database' => $params['database'],
        'keyword' => $params['keyword'],
        'retmax' => $params['retmax'],
        'timestamp' => time()
    ];

    // 执行搜索并存储结果到SESSION
    $results = searchNCBI($params['database'], $params['keyword'], $params['retmax']);

    $response = formatSearchResponse('SESSION', $params['database'], $params['keyword'], $results);
    $response['timestamp'] = time();

    $_SESSION['search_results'] = $response;

    // 直接返回搜索结果
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $errorResponse = formatErrorResponse('SESSION', $e->getMessage());
    $errorResponse['timestamp'] = time();

    // 存储错误到SESSION
    $_SESSION['search_results'] = $errorResponse;

    http_response_code(400);
    echo json_encode($errorResponse, JSON_UNESCAPED_UNICODE);
}
?>
