// 像素版AI猫咪宠物
class PixelCat {
    constructor() {
        this.container = document.getElementById('pixel-cat-container');
        this.menu = document.getElementById('pixel-cat-menu');

        // 桌宠设置 - 纯GIF方案
        this.catWidth = 80;
        this.catHeight = 80;

        // GIF素材
        this.catGifs = {};
        this.currentGif = 'idle';
        this.gifsLoaded = false;

        // 状态管理
        this.isSleeping = false;
        this.isMenuOpen = false;
        this.isDragging = false;

        // 猫咪唱歌功能
        this.singingAudio = null;
        this.isSinging = false;

        this.init();
    }

    // 获取资源文件的正确路径
    getAssetPath(filename) {
        const currentPath = window.location.pathname;
        console.log('🔍 当前路径:', currentPath);

        // 区分不同类型的文件
        const isAudioFile = filename.endsWith('.mp3') || filename.endsWith('.wav');

        // 简化路径逻辑 - 基于当前页面的层级
        let basePath = '';

        // 检查是否在子目录中
        if (currentPath.includes('/entrez/') ||
            currentPath.includes('/auth/')) {
            // 在子目录中，需要返回上级目录
            basePath = '../';
            console.log('📂 检测到子目录，使用上级路径');
        } else {
            // 在根目录
            basePath = './';
            console.log('📂 检测到根目录，使用当前路径');
        }

        // 构建完整路径
        let fullPath;
        if (isAudioFile) {
            fullPath = basePath + 'pet/' + filename;
            console.log('🎵 音频文件路径:', fullPath);
        } else {
            fullPath = basePath + filename;
            console.log('🎬 动画文件路径:', fullPath);
        }

        return fullPath;
    }

    init() {
        // 立即显示默认动画，不等待加载
        this.showDefaultAnimation();

        // 加载GIF素材
        this.loadCatGifs();

        // 绑定事件
        this.bindEvents();

        // 初始化猫咪唱歌功能
        this.initSinging();

        console.log('🐱 纯GIF桌宠已启动！');
    }



    showDefaultAnimation() {
        // 立即创建并显示默认动画，不等待加载完成
        const defaultImg = new Image();
        defaultImg.onload = () => {
            // 图片加载完成后立即显示
            this.showGifAsElement(defaultImg);
            console.log('✅ 默认动画加载成功');
        };
        defaultImg.onerror = () => {
            // 如果加载失败，尝试备用路径
            console.warn('⚠️ 默认路径加载失败，尝试备用路径');
            this.tryAlternativePaths(defaultImg, '动画1.gif');
        };
        // 直接加载动画1 - 使用智能路径
        const imagePath = this.getAssetPath('动画1.gif');
        console.log('🎬 尝试加载默认动画:', imagePath);
        defaultImg.src = imagePath;
    }

    // 尝试备用路径
    tryAlternativePaths(img, filename) {
        const alternativePaths = [
            `./${filename}`,
            `../${filename}`,
            `../../${filename}`
        ];

        let pathIndex = 0;
        const tryNextPath = () => {
            if (pathIndex < alternativePaths.length) {
                const path = alternativePaths[pathIndex];
                console.log(`🔄 尝试备用路径 ${pathIndex + 1}:`, path);

                img.onload = () => {
                    console.log('✅ 备用路径加载成功:', path);
                    this.showGifAsElement(img);
                };
                img.onerror = () => {
                    pathIndex++;
                    tryNextPath();
                };
                img.src = path;
            } else {
                console.error('❌ 所有路径都加载失败，显示文字版桌宠');
                this.showTextFallback();
            }
        };

        tryNextPath();
    }

    // 文字版降级方案
    showTextFallback() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="text-cat" style="
                    width: 80px;
                    height: 80px;
                    background: #007bff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: white;
                    cursor: pointer;
                    user-select: none;
                ">🐱</div>
            `;

            // 绑定点击事件
            const textCat = this.container.querySelector('.text-cat');
            if (textCat) {
                textCat.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMenu();
                });
            }
        }
    }



    loadCatGifs() {
        const gifUrls = {
            idle: this.getAssetPath('动画1.gif'),      // 待机状态
            happy: this.getAssetPath('动画2.gif'),     // 开心状态
            sleep: this.getAssetPath('动画3.gif'),     // 睡觉状态 - 专用睡觉动画
            walk: this.getAssetPath('动画1.gif')       // 走路状态
        };

        let loadedCount = 0;
        const totalGifs = Object.keys(gifUrls).length;

        Object.keys(gifUrls).forEach(state => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalGifs) {
                    this.gifsLoaded = true;
                    console.log('🎬 GIF加载完成！');
                    this.setCatState(this.currentGif);
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ 无法加载${state}状态的GIF`);
                loadedCount++;
                if (loadedCount === totalGifs) {
                    this.gifsLoaded = true;
                    this.setCatState(this.currentGif);
                }
            };
            img.src = gifUrls[state];
            this.catGifs[state] = img;
        });
    }



    bindEvents() {
        // 拖拽事件 - 绑定到容器
        this.bindDragEvents();

        // 菜单事件
        this.bindMenuEvents();

        // 点击其他地方关闭菜单 - 只在菜单打开时监听
        document.addEventListener('click', (e) => {
            // 只有菜单打开时才处理点击事件
            if (this.isMenuOpen && !this.container.contains(e.target)) {
                this.closeMenu();
                // 点击空白处关闭菜单时，立即切换回待机状态
                if (!this.isSleeping) {
                    this.setCatState('idle');
                }
            }
        });

        // ESC键关闭菜单 - 只在菜单打开时响应
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    bindMenuEvents() {
        const menuItems = this.menu.querySelectorAll('.pixel-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;

                // 点击菜单项时保持开心状态
                this.setCatState('happy');

                this.handleMenuAction(action);
                this.closeMenu();

                // 延迟2秒后回到待机状态（如果不是睡觉）
                setTimeout(() => {
                    if (!this.isSleeping && !this.isMenuOpen) {
                        this.setCatState('idle');
                    }
                }, 2000);
            });
        });
    }

    handleMenuAction(action) {
        switch (action) {
            case 'home':
                this.goHome();
                break;
            case 'top':
                this.scrollToTop();
                break;
            case 'favorites':
                this.showFavorites();
                break;
            case 'theme':
                this.toggleTheme();
                break;
            case 'sleep':
                this.sleep();
                break;
            case 'singing':
                this.toggleSinging();
                break;
        }
    }

    // 菜单功能实现
    goHome() {
        let actions = [];

        // 检查当前页面是否为真正的首页（项目根目录的index.html）
        const currentPath = window.location.pathname;
        console.log('🔍 当前路径:', currentPath);

        // 更精确的首页检测：只有在项目根目录的index.html才算首页
        // entrez/index.html 不应该被认为是首页
        const isRealHomePage = (currentPath === '/' ||
                               currentPath === '/website/' ||
                               currentPath === '/website/index.html') ||
                               (currentPath.endsWith('/index.html') && !currentPath.includes('/entrez/') && !currentPath.includes('/auth/'));

        // 如果不在真正的首页，直接跳转到首页
        if (!isRealHomePage) {
            // 确定首页路径
            let homePath = '../index.html'; // 默认返回上级目录的首页

            // 根据当前路径确定正确的首页路径
            if (currentPath.includes('/entrez/')) {
                // 从entrez目录返回主网站首页
                homePath = '../index.html';
                console.log('📍 从entrez页面返回首页:', homePath);
            } else if (currentPath.includes('/auth/')) {
                // 从auth目录返回主网站首页
                homePath = '../index.html';
                console.log('📍 从auth页面返回首页:', homePath);
            } else {
                // 其他情况的路径计算
                const pathParts = currentPath.split('/').filter(part => part !== '');
                if (pathParts.length > 1) {
                    // 在子目录中，返回上级
                    homePath = '../index.html';
                } else {
                    // 在根目录，直接跳转
                    homePath = 'index.html';
                }
                console.log('📍 其他路径返回首页:', homePath);
            }

            console.log('🏠 准备跳转到首页:', homePath);
            this.showMessage('🏃‍♀️ 正在返回主网站首页...', 'success');
            setTimeout(() => {
                window.location.href = homePath;
            }, 500);
            return;
        }

        // 如果已经在首页，执行首页重置操作
        // 关闭详情页
        const detailOverlay = document.querySelector('.tool-detail-overlay');
        if (detailOverlay && !detailOverlay.classList.contains('hidden')) {
            // 使用正确的关闭方法，而不是删除元素
            if (typeof closeToolDetail === 'function') {
                closeToolDetail();
            } else {
                detailOverlay.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
            actions.push('关闭详情页');
        }

        // 检查是否需要重置筛选
        const activeFilter = document.querySelector('.filter-btn.active:not([data-filter="all"])');
        const activeCategory = document.querySelector('.category-item.active:not([data-category="all"])');
        const searchInput = document.getElementById('searchInput');
        const hasSearch = searchInput && searchInput.value.trim() !== '';

        if (activeFilter || activeCategory || hasSearch) {
            this.resetAllFilters();
            actions.push('重置筛选');
        }

        // 滚动到顶部
        this.scrollToTop(false);

        // 显示操作结果
        if (actions.length > 0) {
            this.showMessage(`🏠 ${actions.join('，')}，回到首页！`, 'success');
        } else {
            this.showMessage('🏠 已经在首页啦！');
        }
    }

    scrollToTop(showMessage = true) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (showMessage) {
            this.showMessage('⬆️ 回到顶部！', 'success');
        }
    }

    showFavorites() {
        // 检查登录状态 - 多种方式确保准确性
        let isLoggedIn = false;

        // 方式1：检查window.isLoggedIn
        if (window.isLoggedIn === true) {
            isLoggedIn = true;
        }

        // 方式2：检查authManager
        if (window.authManager && typeof window.authManager.isLoggedIn === 'function') {
            isLoggedIn = window.authManager.isLoggedIn();
        }

        // 方式3：检查localStorage中的用户信息
        if (!isLoggedIn) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    isLoggedIn = user && user.id;
                } catch (e) {
                    console.log('解析用户信息失败:', e);
                }
            }
        }

        // 方式4：检查sessionStorage
        if (!isLoggedIn) {
            const sessionUser = sessionStorage.getItem('currentUser');
            isLoggedIn = !!sessionUser;
        }

        if (isLoggedIn) {
            // 确定收藏页面路径
            const currentPath = window.location.pathname;
            let favoritesPath = 'favorites.html';

            // 如果当前在子目录中，需要调整路径
            if (currentPath.includes('/auth/') || currentPath.includes('/entrez/')) {
                favoritesPath = '../favorites.html';
            }

            this.showMessage('🏃‍♀️ 前往收藏页面...', 'success');
            setTimeout(() => {
                window.location.href = favoritesPath;
            }, 500);
        } else {
            this.showMessage('💔 请先登录查看收藏', 'error');
        }
    }

    toggleTheme() {
        // 使用统一的主题切换工具
        if (window.Utils && typeof Utils.toggleTheme === 'function') {
            const newTheme = Utils.toggleTheme();

            // 如果是关于我们页面，更新地图主题
            if (typeof updateMapTheme === 'function') {
                updateMapTheme();
            }

            // 显示切换结果
            const themeText = newTheme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式';
            this.showMessage(`🎨 ${themeText}！`, 'success');
        } else {
            this.showMessage('❌ 主题切换功能暂不可用', 'error');
        }
    }

    // 重置所有筛选状态
    resetAllFilters() {
        // 重置筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
            allBtn.click();
        }

        // 重置分类选择
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        const allCategory = document.querySelector('[data-category="all"]');
        if (allCategory) {
            allCategory.classList.add('active');
        }

        // 清空搜索框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            // 触发搜索事件以更新显示
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
    }

    sleep() {
        if (this.isSleeping) {
            this.wakeUp();
        } else {
            this.startSleeping();
        }
    }

    startSleeping() {
        this.isSleeping = true;
        this.setCatState('sleep');
        this.container.classList.add('sleeping');

        // 随机睡觉提示语
        const sleepMessages = [
            '😴 猫咪去休息啦~',
            '💤 呼呼大睡中...',
            '🌙 进入梦乡...',
            '😪 累了，要睡觉觉~',
            '🛌 猫咪睡着了，轻点哦'
        ];
        const randomMessage = sleepMessages[Math.floor(Math.random() * sleepMessages.length)];
        this.showMessage(randomMessage);

        console.log('😴 猫咪开始睡觉，isSleeping:', this.isSleeping);
    }

    wakeUp() {
        this.isSleeping = false;
        this.setCatState('idle');
        this.container.classList.remove('sleeping');

        // 清除任何悬停提示
        this.hideWakeUpHint();

        // 随机醒来提示语
        const wakeMessages = [
            '😊 猫咪醒来啦！',
            '🌟 精神满满！',
            '😸 睡得真香~',
            '🎉 又是元气满满的一天！',
            '😺 休息好了，继续陪你~'
        ];
        const randomMessage = wakeMessages[Math.floor(Math.random() * wakeMessages.length)];
        this.showMessage(randomMessage, 'success');
    }

    showWakeUpHint() {
        // 显示悬停叫醒提示，跟随猫咪位置
        if (!document.querySelector('.wake-up-hint')) {
            const hint = document.createElement('div');
            hint.className = 'wake-up-hint';
            hint.textContent = '💤 点击叫醒猫咪';

            // 计算猫咪位置
            const containerRect = this.container.getBoundingClientRect();
            const hintWidth = 120;
            const hintHeight = 35;

            // 计算提示框位置（在猫咪上方）
            let left = containerRect.left + (containerRect.width - hintWidth) / 2;
            let top = containerRect.top - hintHeight - 10;

            // 边界检查
            if (left < 10) left = 10;
            if (left + hintWidth > window.innerWidth - 10) {
                left = window.innerWidth - hintWidth - 10;
            }
            if (top < 10) {
                // 如果上方空间不够，显示在下方
                top = containerRect.bottom + 10;
            }

            hint.style.left = `${left}px`;
            hint.style.top = `${top}px`;

            document.body.appendChild(hint);

            console.log('🎯 提示框位置:', { left, top, containerRect });
        }
    }

    hideWakeUpHint() {
        // 隐藏悬停叫醒提示
        const hint = document.querySelector('.wake-up-hint');
        if (hint) {
            hint.remove();
        }
    }

    showMessage(text, type = 'normal') {
        // 移除之前的消息
        const existingMessage = document.querySelector('.pixel-cat-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建消息提示
        const message = document.createElement('div');
        message.textContent = text;
        message.className = 'pixel-cat-message';

        // 添加消息类型样式
        if (type === 'error') {
            message.classList.add('error');
        } else if (type === 'success') {
            message.classList.add('success');
        } else if (type === 'info') {
            message.classList.add('info');
        }

        // 计算猫咪位置，让消息跟随猫咪
        const containerRect = this.container.getBoundingClientRect();
        const messageWidth = 200; // 预估消息框宽度
        const messageHeight = 50; // 预估消息框高度

        // 计算消息位置（在猫咪左侧）
        let left = containerRect.left - messageWidth - 15;
        let top = containerRect.top + (containerRect.height - messageHeight) / 2;

        // 边界检查
        if (left < 10) {
            // 如果左侧空间不够，显示在右侧
            left = containerRect.right + 15;
        }
        if (left + messageWidth > window.innerWidth - 10) {
            // 如果右侧也不够，显示在上方
            left = containerRect.left + (containerRect.width - messageWidth) / 2;
            top = containerRect.top - messageHeight - 15;
        }
        if (top < 10) {
            // 如果上方空间不够，显示在下方
            top = containerRect.bottom + 15;
        }
        if (top + messageHeight > window.innerHeight - 10) {
            // 如果下方也不够，显示在屏幕中央
            top = (window.innerHeight - messageHeight) / 2;
        }

        // 设置消息位置
        message.style.position = 'fixed';
        message.style.left = `${left}px`;
        message.style.top = `${top}px`;
        message.style.right = 'auto';
        message.style.bottom = 'auto';

        document.body.appendChild(message);

        console.log('💬 消息位置:', { left, top, containerRect });

        // 根据消息类型调整显示时间
        const duration = type === 'error' ? 3000 : 2500;

        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, duration);
    }

    // 优化的拖拽功能 - 无延迟响应
    bindDragEvents() {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        const startDrag = (e) => {
            console.log('🎯 开始拖拽');
            const rect = this.container.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
            e.preventDefault();
        };

        const drag = (e) => {
            // 立即开始拖拽，无延迟
            if (!isDragging) {
                isDragging = true;
                this.isDragging = true;
                this.container.classList.add('dragging');
            }

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            // 限制在视窗范围内
            const maxX = window.innerWidth - this.container.offsetWidth;
            const maxY = window.innerHeight - this.container.offsetHeight;

            const clampedX = Math.max(0, Math.min(x, maxX));
            const clampedY = Math.max(0, Math.min(y, maxY));

            // 直接设置位置，更流畅
            this.container.style.left = clampedX + 'px';
            this.container.style.top = clampedY + 'px';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
        };

        const endDrag = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);

            this.container.classList.remove('dragging');

            // 立即结束拖拽状态，无延迟
            isDragging = false;
            this.isDragging = false;
        };

        // 绑定到容器，这样Canvas和GIF都能拖拽
        this.container.addEventListener('mousedown', startDrag);
    }

    // 菜单控制
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menu.classList.add('show');
        this.isMenuOpen = true;
        // 打开菜单时保持开心状态
        this.setCatState('happy');
    }

    closeMenu() {
        this.menu.classList.remove('show');
        this.isMenuOpen = false;

        // 关闭菜单后延迟2秒回到待机状态
        setTimeout(() => {
            if (!this.isSleeping && !this.isMenuOpen) {
                this.setCatState('idle');
            }
        }, 2000);
    }



    showGifAsElement(img) {
        // 显示img元素

        // 创建或更新img元素
        let gifElement = this.container.querySelector('.cat-gif');
        if (!gifElement) {
            gifElement = document.createElement('img');
            gifElement.className = 'cat-gif';
            gifElement.style.cssText = `
                width: ${this.catWidth}px;
                height: ${this.catHeight}px;
                object-fit: contain;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            `;

            // 为GIF元素添加事件监听
            this.bindGifEvents(gifElement);
            this.container.appendChild(gifElement);
        }

        gifElement.src = img.src;
        gifElement.style.display = 'block';
    }

    bindGifEvents(gifElement) {
        // 鼠标悬停事件
        gifElement.addEventListener('mouseenter', () => {
            console.log('🖱️ 鼠标悬停，睡觉状态:', this.isSleeping, '菜单状态:', this.isMenuOpen);
            if (this.isSleeping) {
                // 睡觉时悬停显示叫醒提示
                this.showWakeUpHint();
            } else if (!this.isMenuOpen) {
                // 只有在菜单关闭时才因悬停切换到开心状态
                this.setCatState('happy');
            }
            // 如果菜单开着，已经是开心状态，不需要重复设置
        });

        gifElement.addEventListener('mouseleave', () => {
            if (this.isSleeping) {
                // 睡觉时移开鼠标隐藏提示
                this.hideWakeUpHint();
            } else if (!this.isMenuOpen) {
                // 只有在菜单关闭时才切换回待机状态
                this.setCatState('idle');
            }
            // 如果菜单开着，保持开心状态，不切换
        });

        // 点击事件
        gifElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.isDragging) {
                if (this.isSleeping) {
                    // 如果在睡觉，点击叫醒
                    this.wakeUp();
                } else {
                    // 否则打开菜单，保持开心状态
                    this.toggleMenu();
                    // 点击时切换到开心状态并保持
                    this.setCatState('happy');
                }
            }
        });
    }



    // 切换猫咪状态
    setCatState(state) {
        if (this.catGifs[state]) {
            this.currentGif = state;
            console.log(`🐱 切换到${state}状态`);

            // 显示对应的GIF
            const img = this.catGifs[state];
            this.showGifAsElement(img);
        }
    }

    // 猫咪唱歌功能相关方法
    initSinging() {
        try {
            // 初始化唱歌音频对象
            this.singingAudio = new Audio();
            this.singingAudio.volume = 0.6; // 设置合适的音量
            this.singingAudio.preload = 'metadata';

            // 尝试加载音频文件
            this.loadAudioWithFallback();

        } catch (error) {
            console.error('🎤 唱歌功能初始化失败:', error);
        }
    }

    // 尝试多个路径加载音频文件
    loadAudioWithFallback() {
        const audioFilename = '猫咪唱歌.mp3';
        const possiblePaths = [
            this.getAssetPath(audioFilename),  // 智能路径
            `pet/${audioFilename}`,            // 直接pet目录
            `../pet/${audioFilename}`,         // 上级pet目录
            `./${audioFilename}`,              // 当前目录
            `../${audioFilename}`              // 上级目录
        ];

        let pathIndex = 0;

        const tryNextPath = () => {
            if (pathIndex >= possiblePaths.length) {
                console.error('🎤 所有音频路径都加载失败');
                this.showMessage('🎤 音频文件加载失败，唱歌功能不可用', 'error');
                return;
            }

            const currentPath = possiblePaths[pathIndex];
            console.log(`🎤 尝试音频路径 ${pathIndex + 1}/${possiblePaths.length}:`, currentPath);

            // 创建临时音频对象测试路径
            const testAudio = new Audio();

            testAudio.addEventListener('canplaythrough', () => {
                console.log('✅ 音频路径加载成功:', currentPath);
                this.singingAudio.src = currentPath;
                this.setupAudioEvents();
            }, { once: true });

            testAudio.addEventListener('error', () => {
                console.warn(`❌ 音频路径失败:`, currentPath);
                pathIndex++;
                tryNextPath();
            }, { once: true });

            testAudio.src = currentPath;
        };

        tryNextPath();
    }

    // 设置音频事件监听
    setupAudioEvents() {
        if (!this.singingAudio) return;

        // 音频事件监听
        this.singingAudio.addEventListener('loadeddata', () => {
            console.log('🎤 猫咪唱歌音频加载完成');
        });

        this.singingAudio.addEventListener('canplaythrough', () => {
            console.log('🎤 猫咪可以开始唱歌了');
        });

        this.singingAudio.addEventListener('error', (e) => {
            console.error('🎤 唱歌音频加载失败:', e);
            this.showMessage('🎤 唱歌音频加载失败', 'error');
        });

        this.singingAudio.addEventListener('play', () => {
            console.log('🎤 猫咪开始唱歌');
            this.isSinging = true;
            this.setCatState('happy'); // 唱歌时显示开心状态
            this.updateSingingIcon();
        });

        this.singingAudio.addEventListener('pause', () => {
            console.log('🎤 猫咪停止唱歌');
            this.isSinging = false;
            this.setCatState('idle'); // 停止唱歌后回到待机状态
            this.updateSingingIcon();
        });

        this.singingAudio.addEventListener('ended', () => {
            console.log('🎤 猫咪唱完了');
            this.isSinging = false;
            this.setCatState('idle'); // 唱完后回到待机状态
            this.updateSingingIcon();
            this.showMessage('🎤 唱完啦~', 'success');
        });

        // 更新初始图标状态
        this.updateSingingIcon();
    }



    toggleSinging() {
        console.log('🎤 切换唱歌状态，当前唱歌状态:', this.isSinging);

        if (this.isSinging) {
            this.stopSinging();
        } else {
            this.startSinging();
        }

        // 关闭菜单
        this.closeMenu();
    }

    async startSinging() {
        try {
            console.log('🎤 猫咪准备唱歌...');

            if (!this.singingAudio) {
                console.error('🎤 唱歌音频对象不存在');
                this.showMessage('🎤 唱歌功能未初始化', 'error');
                return;
            }

            // 显示准备提示
            this.showMessage('🎤 准备唱歌...', 'info');

            // 重置音频到开头
            this.singingAudio.currentTime = 0;

            await this.singingAudio.play();

            // 延迟显示成功消息
            setTimeout(() => {
                this.showMessage('🎤 喵~ 开始唱歌啦！', 'success');
            }, 500);

        } catch (error) {
            console.error('🎤 唱歌失败:', error);

            // 根据错误类型显示不同消息
            if (error.name === 'NotAllowedError') {
                this.showMessage('🎤 请先与页面交互后再让猫咪唱歌', 'warning');
            } else if (error.name === 'NotSupportedError') {
                this.showMessage('🎤 浏览器不支持此音频格式', 'error');
            } else {
                this.showMessage('🎤 唱歌失败，请检查音频文件', 'error');
            }
        }
    }

    stopSinging() {
        try {
            console.log('🎤 停止唱歌');

            if (this.singingAudio) {
                this.singingAudio.pause();
                this.singingAudio.currentTime = 0; // 重置到开头
            }

            this.showMessage('🎤 停止唱歌了~', 'info');

        } catch (error) {
            console.error('🎤 停止唱歌失败:', error);
        }
    }

    updateSingingIcon() {
        const singingItem = document.querySelector('[data-action="singing"]');
        if (singingItem) {
            const icon = singingItem.querySelector('i');
            const text = singingItem.querySelector('span');

            if (this.isSinging) {
                icon.className = 'fas fa-microphone';
                text.textContent = '停止唱歌';
                singingItem.classList.add('active');

                // 添加唱歌动画效果
                icon.style.animation = 'singingPulse 1s ease-in-out infinite';
            } else {
                icon.className = 'fas fa-music';
                text.textContent = '让我唱歌';
                singingItem.classList.remove('active');

                // 移除动画效果
                icon.style.animation = '';
            }

            console.log('🎤 唱歌图标已更新，唱歌状态:', this.isSinging);
        } else {
            console.warn('🎤 找不到唱歌菜单项');
        }
    }
}

// 初始化像素版AI猫咪
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pixel-cat-container')) {
        console.log('🐱 初始化桌面宠物');
        window.pixelCat = new PixelCat();
    }
});
