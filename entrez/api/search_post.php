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
    // 包含搜索函数
    require_once 'search_functions.php';

    // 验证参数
    $params = validateSearchParams($_POST);

    // 执行搜索
    $results = searchNCBI($params['database'], $params['keyword'], $params['retmax']);

    // 返回结果
    echo json_encode(formatSearchResponse('POST', $params['database'], $params['keyword'], $results), JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(formatErrorResponse('POST', $e->getMessage()), JSON_UNESCAPED_UNICODE);
}
?>
