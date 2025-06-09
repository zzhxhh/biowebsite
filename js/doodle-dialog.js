// 手绘风格对话框组件
class DoodleDialog {
    constructor() {
        this.currentDialog = null;
    }

    // 显示确认对话框
    confirm(options) {
        return new Promise((resolve) => {
            const {
                title = '确认操作',
                message = '您确定要执行此操作吗？',
                icon = 'fas fa-question-circle',
                confirmText = '确定',
                cancelText = '取消'
            } = options;

            this.show({
                title,
                message,
                icon,
                buttons: [
                    {
                        text: cancelText,
                        class: 'cancel',
                        action: () => {
                            this.hide();
                            resolve(false);
                        }
                    },
                    {
                        text: confirmText,
                        class: 'confirm',
                        action: () => {
                            this.hide();
                            resolve(true);
                        }
                    }
                ]
            });
        });
    }

    // 显示警告对话框
    alert(options) {
        return new Promise((resolve) => {
            const {
                title = '提示',
                message = '操作完成',
                icon = 'fas fa-info-circle',
                buttonText = '确定'
            } = options;

            this.show({
                title,
                message,
                icon,
                buttons: [
                    {
                        text: buttonText,
                        class: 'confirm',
                        action: () => {
                            this.hide();
                            resolve(true);
                        }
                    }
                ]
            });
        });
    }

    // 显示对话框
    show(options) {
        // 如果已有对话框，先关闭
        if (this.currentDialog) {
            this.hide();
        }

        const {
            title,
            message,
            icon,
            buttons = []
        } = options;

        // 创建对话框HTML
        const dialogHTML = `
            <div class="doodle-dialog-overlay">
                <div class="doodle-dialog">
                    <div class="doodle-dialog-icon">
                        <i class="${icon}"></i>
                    </div>
                    <h3 class="doodle-dialog-title">${title}</h3>
                    <p class="doodle-dialog-message">${message}</p>
                    <div class="doodle-dialog-buttons">
                        ${buttons.map(button => `
                            <button class="doodle-dialog-btn ${button.class}" data-action="${button.text}">
                                ${button.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 创建对话框元素
        const dialogElement = document.createElement('div');
        dialogElement.innerHTML = dialogHTML;
        this.currentDialog = dialogElement.firstElementChild;

        // 绑定按钮事件
        buttons.forEach((button) => {
            const btnElement = this.currentDialog.querySelector(`[data-action="${button.text}"]`);
            if (btnElement) {
                btnElement.addEventListener('click', button.action);
            }
        });

        // 绑定ESC键关闭
        this.handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                // 如果是确认对话框，ESC相当于取消
                if (buttons.length === 2) {
                    buttons[0].action(); // 第一个按钮通常是取消
                }
            }
        };
        document.addEventListener('keydown', this.handleKeydown);

        // 绑定点击背景关闭
        this.currentDialog.addEventListener('click', (e) => {
            if (e.target === this.currentDialog) {
                this.hide();
                // 如果是确认对话框，点击背景相当于取消
                if (buttons.length === 2) {
                    buttons[0].action(); // 第一个按钮通常是取消
                }
            }
        });

        // 添加到页面
        document.body.appendChild(this.currentDialog);

        // 聚焦到第一个按钮
        setTimeout(() => {
            const firstBtn = this.currentDialog.querySelector('.doodle-dialog-btn');
            if (firstBtn) {
                firstBtn.focus();
            }
        }, 100);
    }

    // 隐藏对话框
    hide() {
        if (this.currentDialog) {
            // 移除键盘事件监听
            if (this.handleKeydown) {
                document.removeEventListener('keydown', this.handleKeydown);
                this.handleKeydown = null;
            }

            // 添加淡出动画
            this.currentDialog.style.animation = 'doodleDialogFadeOut 0.3s ease-out forwards';
            
            setTimeout(() => {
                if (this.currentDialog && this.currentDialog.parentNode) {
                    this.currentDialog.parentNode.removeChild(this.currentDialog);
                }
                this.currentDialog = null;
            }, 300);
        }
    }

    // 检查是否有对话框正在显示
    isVisible() {
        return this.currentDialog !== null;
    }
}

// 创建全局实例
window.doodleDialog = new DoodleDialog();

// 添加淡出动画到CSS（如果还没有的话）
if (!document.querySelector('#doodle-dialog-animations')) {
    const style = document.createElement('style');
    style.id = 'doodle-dialog-animations';
    style.textContent = `
        @keyframes doodleDialogFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 导出便捷函数
window.doodleConfirm = (message, title = '确认操作') => {
    return window.doodleDialog.confirm({
        title,
        message,
        icon: 'fas fa-question-circle'
    });
};

window.doodleAlert = (message, title = '提示') => {
    return window.doodleDialog.alert({
        title,
        message,
        icon: 'fas fa-info-circle'
    });
};

// 特殊的收藏确认对话框
window.doodleConfirmUnfavorite = (websiteName) => {
    return window.doodleDialog.confirm({
        title: '取消收藏',
        message: `确定要取消收藏"${websiteName}"吗？`,
        icon: 'fas fa-heart-broken',
        confirmText: '确定取消',
        cancelText: '保留收藏'
    });
};

// 统一的通知系统
class DoodleNotification {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
    }

    // 显示通知
    show(options) {
        const {
            message = '操作完成',
            type = 'info', // info, success, warning, error
            duration = 3000,
            icon = this.getIconByType(type),
            position = 'top-right' // top-right, top-left, bottom-right, bottom-left
        } = options;

        const notification = this.createNotification({
            message,
            type,
            icon,
            position
        });

        this.addNotification(notification);

        // 自动移除
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    // 根据类型获取图标
    getIconByType(type) {
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        return icons[type] || icons.info;
    }

    // 创建通知元素
    createNotification(options) {
        const { message, type, icon, position } = options;

        const notification = document.createElement('div');
        notification.className = `doodle-notification doodle-notification-${type}`;
        notification.innerHTML = `
            <div class="doodle-notification-content">
                <i class="${icon}"></i>
                <span class="doodle-notification-message">${message}</span>
                <button class="doodle-notification-close" onclick="window.doodleNotification.removeNotification(this.parentElement.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 设置位置样式
        this.setNotificationPosition(notification, position);

        return notification;
    }

    // 设置通知位置
    setNotificationPosition(notification, position) {
        const positions = {
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' }
        };

        const pos = positions[position] || positions['top-right'];
        Object.assign(notification.style, pos);
    }

    // 添加通知到页面
    addNotification(notification) {
        // 如果通知太多，移除最旧的
        if (this.notifications.length >= this.maxNotifications) {
            this.removeNotification(this.notifications[0]);
        }

        this.notifications.push(notification);
        document.body.appendChild(notification);

        // 添加进入动画
        setTimeout(() => {
            notification.classList.add('doodle-notification-show');
        }, 10);
    }

    // 移除通知
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;

        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }

        notification.classList.add('doodle-notification-hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // 清除所有通知
    clearAll() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
}

// 创建全局通知实例
window.doodleNotification = new DoodleNotification();

// 便捷函数
window.doodleNotify = {
    info: (message, duration = 3000) => window.doodleNotification.show({ message, type: 'info', duration }),
    success: (message, duration = 3000) => window.doodleNotification.show({ message, type: 'success', duration }),
    warning: (message, duration = 4000) => window.doodleNotification.show({ message, type: 'warning', duration }),
    error: (message, duration = 5000) => window.doodleNotification.show({ message, type: 'error', duration })
};
