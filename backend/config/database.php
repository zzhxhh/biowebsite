<?php
// 数据库配置文件
class Database {
    private $host = 'localhost';
    private $db_name = 'website_navigation';
    private $username = 'root';
    private $password = '';
    private $conn;

    // 获取数据库连接
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "连接失败: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

// 会话管理
session_start();

// 检查用户是否登录
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// 获取当前用户ID
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

// 获取当前用户信息
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT id, username, email, created_at FROM users WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// 登出函数
function logout() {
    session_destroy();
    header("Location: index.php");
    exit();
}
?>
