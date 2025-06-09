<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 检查用户是否登录
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => '请先登录']);
    exit();
}

$user_id = getCurrentUserId();
$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'POST':
            // 添加收藏
            $input = json_decode(file_get_contents('php://input'), true);
            $website_id = $input['website_id'] ?? null;

            if (!$website_id) {
                throw new Exception('缺少网站ID');
            }

            // 检查是否已收藏
            $query = "SELECT id FROM user_favorites WHERE user_id = :user_id AND website_id = :website_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':website_id', $website_id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                throw new Exception('已经收藏过了');
            }

            // 添加收藏
            $query = "INSERT INTO user_favorites (user_id, website_id) VALUES (:user_id, :website_id)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':website_id', $website_id);
            $stmt->execute();

            echo json_encode(['success' => true, 'message' => '收藏成功']);
            break;
            
        case 'DELETE':
            // 取消收藏
            $input = json_decode(file_get_contents('php://input'), true);
            $website_id = $input['website_id'] ?? null;
            
            if (!$website_id) {
                throw new Exception('缺少网站ID');
            }
            
            $query = "DELETE FROM user_favorites WHERE user_id = :user_id AND website_id = :website_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':website_id', $website_id);
            $stmt->execute();
            
            if ($stmt->rowCount() === 0) {
                throw new Exception('收藏不存在');
            }
            
            echo json_encode(['success' => true, 'message' => '取消收藏成功']);
            break;
            
        case 'GET':
            // 获取用户收藏状态
            $website_id = $_GET['website_id'] ?? null;
            
            if ($website_id) {
                // 检查单个网站的收藏状态
                $query = "SELECT id FROM user_favorites WHERE user_id = :user_id AND website_id = :website_id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':website_id', $website_id);
                $stmt->execute();
                
                echo json_encode([
                    'success' => true,
                    'is_favorited' => $stmt->rowCount() > 0
                ]);
            } else {
                // 获取所有收藏的网站ID
                $query = "SELECT website_id FROM user_favorites WHERE user_id = :user_id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->execute();
                
                $favorites = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                echo json_encode([
                    'success' => true,
                    'favorites' => $favorites
                ]);
            }
            break;
            
        default:
            throw new Exception('不支持的请求方法');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
