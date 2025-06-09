// 用户认证相关功能
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.redirectUrl = null; // 登录成功后的重定向URL
        this.init();
    }

    init() {
        // 页面加载时检查用户登录状态
        this.checkLoginStatus();
        
        // 绑定登出按钮事件
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // 检查登录状态
    async checkLoginStatus() {
        try {
            const response = await fetch('backend/api/auth.php');
            const data = await response.json();
            
            if (data.success && data.user) {
                this.currentUser = data.user;
                this.updateUI(true);
            } else {
                this.currentUser = null;
                this.updateUI(false);
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            this.updateUI(false);
        }
    }

    // 更新界面显示
    updateUI(isLoggedIn) {
        const loggedInMenu = document.getElementById('userMenuLoggedIn');
        const loggedOutMenu = document.getElementById('userMenuLoggedOut');
        const usernameDisplay = document.getElementById('usernameDisplay');

        if (isLoggedIn && this.currentUser) {
            // 显示已登录状态
            loggedInMenu.style.display = 'flex';
            loggedOutMenu.style.display = 'none';
            usernameDisplay.textContent = this.currentUser.username;
            
            // 更新全局变量
            window.isLoggedIn = true;
            window.userId = this.currentUser.id;
        } else {
            // 显示未登录状态
            loggedInMenu.style.display = 'none';
            loggedOutMenu.style.display = 'flex';
            
            // 更新全局变量
            window.isLoggedIn = false;
            window.userId = null;
        }

        // 触发自定义事件，通知其他组件用户状态已更新
        window.dispatchEvent(new CustomEvent('userStatusChanged', {
            detail: { isLoggedIn, user: this.currentUser }
        }));
    }

    // 登录
    async login(username, password) {
        try {
            const response = await fetch('backend/api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    username: username,
                    password: password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateUI(true);

                // 保存登录状态到localStorage（兼容性）
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                // 触发登录状态变化事件
                window.dispatchEvent(new CustomEvent('loginStateChanged', {
                    detail: { isLoggedIn: true, user: data.user }
                }));

                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, message: '网络错误，请重试' };
        }
    }

    // 注册
    async register(username, email, password, confirmPassword) {
        try {
            const response = await fetch('backend/api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    username: username,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateUI(true);

                // 保存登录状态到localStorage（兼容性）
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                // 触发登录状态变化事件
                window.dispatchEvent(new CustomEvent('loginStateChanged', {
                    detail: { isLoggedIn: true, user: data.user }
                }));

                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('注册失败:', error);
            return { success: false, message: '网络错误，请重试' };
        }
    }

    // 登出
    async logout() {
        try {
            const response = await fetch('backend/api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'logout'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.clearLoginState();
            }
        } catch (error) {
            console.error('登出失败:', error);
            // 即使请求失败，也清除本地状态
            this.clearLoginState();
        }
    }

    // 清除登录状态
    clearLoginState() {
        this.currentUser = null;
        this.updateUI(false);

        // 清除localStorage中的登录状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('currentUser');

        // 触发登录状态变化事件
        window.dispatchEvent(new CustomEvent('loginStateChanged', {
            detail: { isLoggedIn: false, user: null }
        }));

        console.log('✅ 登录状态已清除');
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // 设置重定向URL
    setRedirectUrl(url) {
        this.redirectUrl = url;
        console.log('🔗 设置重定向URL:', url);
    }

    // 获取重定向URL
    getRedirectUrl() {
        return this.redirectUrl;
    }
}

// 创建全局认证管理器实例
window.authManager = new AuthManager();

// 兼容性：为其他脚本提供全局函数
window.isLoggedIn = false;
window.userId = null;

// 监听用户状态变化，更新全局变量
window.addEventListener('userStatusChanged', (event) => {
    window.isLoggedIn = event.detail.isLoggedIn;
    window.userId = event.detail.user ? event.detail.user.id : null;
});
