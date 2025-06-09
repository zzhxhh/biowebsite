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

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

try {
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $action = $input['action'] ?? '';
            
            switch ($action) {
                case 'login':
                    handleLogin($db, $input);
                    break;
                case 'register':
                    handleRegister($db, $input);
                    break;
                case 'logout':
                    handleLogout();
                    break;
                default:
                    throw new Exception('无效的操作');
            }
            break;
            
        case 'GET':
            // 获取当前用户信息
            handleGetUser($db);
            break;
            
        default:
            throw new Exception('不支持的请求方法');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handleLogin($db, $input) {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        throw new Exception('用户名和密码不能为空');
    }
    
    // 查询用户（支持用户名或邮箱登录）
    $query = "SELECT id, username, email, password FROM users WHERE username = :username OR email = :username";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception('用户名或密码错误');
    }
    
    // 设置会话
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    
    echo json_encode([
        'success' => true,
        'message' => '登录成功',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
}

function handleRegister($db, $input) {
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirmPassword'] ?? '';
    
    // 验证输入
    if (empty($username) || empty($email) || empty($password)) {
        throw new Exception('所有字段都是必填的');
    }
    
    if ($password !== $confirmPassword) {
        throw new Exception('两次输入的密码不一致');
    }
    
    if (strlen($password) < 6) {
        throw new Exception('密码长度至少6位');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('邮箱格式不正确');
    }
    
    // 检查用户名是否已存在
    $query = "SELECT id FROM users WHERE username = :username OR email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        throw new Exception('用户名或邮箱已存在');
    }
    
    // 创建用户
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->execute();
    
    $userId = $db->lastInsertId();
    
    // 自动登录
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    
    echo json_encode([
        'success' => true,
        'message' => '注册成功',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]
    ]);
}

function handleLogout() {
    session_start();
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => '退出成功'
    ]);
}

function handleGetUser($db) {
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => false,
            'message' => '未登录'
        ]);
        return;
    }
    
    $query = "SELECT id, username, email, created_at FROM users WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => '用户不存在'
        ]);
    }
}
?>
