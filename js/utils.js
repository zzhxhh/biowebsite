// 通用工具函数模块
class Utils {
    // 主题管理
    static loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        return savedTheme;
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新所有主题切换按钮
        const themeToggles = document.querySelectorAll('.theme-toggle, #themeToggle');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
        
        return newTheme;
    }

    static initThemeToggle() {
        const savedTheme = this.loadTheme();
        
        // 更新所有主题切换按钮图标
        const themeToggles = document.querySelectorAll('.theme-toggle, #themeToggle');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // 绑定点击事件
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎨 Utils主题切换被触发');
                this.toggleTheme();
            });
        });
    }

    // 消息显示
    static showMessage(message, type = 'info', duration = 3000) {
        // 尝试使用统一的通知系统
        if (window.doodleNotify) {
            switch(type) {
                case 'success':
                    window.doodleNotify.success(message);
                    break;
                case 'error':
                    window.doodleNotify.error(message);
                    break;
                case 'warning':
                    window.doodleNotify.warning(message);
                    break;
                default:
                    window.doodleNotify.info(message);
            }
            return;
        }

        // 降级方案：查找页面中的消息容器
        let container = document.getElementById('messageContainer');
        let content = document.getElementById('messageContent');
        
        if (container && content) {
            content.textContent = message;
            content.className = `message ${type}`;
            container.style.display = 'block';
            
            setTimeout(() => {
                container.style.display = 'none';
            }, duration);
            return;
        }

        // 最终降级方案：创建临时消息元素
        this.createTempMessage(message, type, duration);
    }

    static createTempMessage(message, type, duration) {
        const messageEl = document.createElement('div');
        messageEl.className = `temp-message temp-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, duration);
    }

    // 分类名称映射
    static getCategoryNames() {
        return {
            ai: 'AI工具',
            development: '开发设计',
            learning: '学习办公',
            entertainment: '娱乐社交',
            productivity: '效率工具',
            utility: '实用网站'
        };
    }

    // 获取分类名称
    static getCategoryName(category) {
        return this.getCategoryNames()[category] || category;
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 平滑滚动
    static smoothScrollTo(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // 格式化数字
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 生成评分星星
    static generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star star"></i>';
        }

        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt star"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star star"></i>';
        }

        return starsHtml;
    }

    // 复制到剪贴板
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showMessage('已复制到剪贴板', 'success');
            return true;
        } catch (err) {
            console.error('复制失败:', err);
            this.showMessage('复制失败', 'error');
            return false;
        }
    }

    // 检测设备类型
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // 获取URL参数
    static getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 设置URL参数
    static setUrlParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }

    // 验证邮箱格式
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 验证密码强度
    static validatePassword(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return {
            isValid: password.length >= minLength,
            length: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            score: [password.length >= minLength, hasUpperCase, hasLowerCase, hasNumbers].filter(Boolean).length
        };
    }

    // 初始化通用功能
    static init() {
        // 初始化主题
        this.initThemeToggle();
        
        // 添加全局样式
        this.addGlobalStyles();
        
        // 绑定全局事件
        this.bindGlobalEvents();
    }

    static addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    static bindGlobalEvents() {
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // 关闭所有可能的模态框
                const modals = document.querySelectorAll('.modal, .overlay, [id*="Detail"]');
                modals.forEach(modal => {
                    if (modal.style.display !== 'none' && !modal.classList.contains('hidden')) {
                        modal.style.display = 'none';
                        modal.classList.add('hidden');
                    }
                });
                
                // 恢复body滚动
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    Utils.init();
});

// 导出到全局
window.Utils = Utils;
