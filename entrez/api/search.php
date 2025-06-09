<?php
/**
 * GET方式的生物信息学搜索API
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

try {
    // 包含搜索函数
    require_once 'search_functions.php';

    // 验证参数
    $params = validateSearchParams($_GET);

    // 执行搜索
    $results = searchNCBI($params['database'], $params['keyword'], $params['retmax']);

    // 返回结果
    echo json_encode(formatSearchResponse('GET', $params['database'], $params['keyword'], $results), JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(formatErrorResponse('GET', $e->getMessage()), JSON_UNESCAPED_UNICODE);
}
?>
