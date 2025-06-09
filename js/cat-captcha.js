// AI猫咪拖拽喂食验证系统
class CatCaptcha {
    constructor() {
        this.isActive = false;
        this.startTime = null;
        this.interactions = [];
        this.dragStartTime = null;
        this.dragPath = [];
        this.isCompleted = false;
        this.currentResolve = null;
        
        // 验证参数（随机化增加安全性）
        this.minDragTime = 300 + Math.random() * 200; // 300-500ms
        this.maxDragTime = 8000 + Math.random() * 4000; // 8-12s
        this.minPathLength = 40 + Math.random() * 30; // 40-70px
        this.timeLimit = 25000 + Math.random() * 10000; // 25-35秒

        // 挑战类型和难度
        this.challengeType = this.getRandomChallengeType();
        this.attemptCount = 0;
        this.maxAttempts = 3;

        // 多选模式相关
        this.requiredGoodFeeds = 0; // 需要喂食的好食物数量
        this.completedGoodFeeds = 0; // 已完成的好食物喂食数量
        this.fedFoodTypes = new Set(); // 已喂食的食物类型
    }

    // 获取随机挑战类型
    getRandomChallengeType() {
        const types = ['normal', 'multiple', 'avoid'];
        return types[Math.floor(Math.random() * types.length)];
    }

    // 显示验证界面
    show() {
        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this.isActive = true;
            this.startTime = Date.now();
            this.challengeType = this.getRandomChallengeType(); // 每次重新随机
            this.createCaptchaUI();
            this.bindEvents();
        });
    }

    // 创建验证UI
    createCaptchaUI() {
        // 根据当前页面路径确定图片路径
        const isInAuthFolder = window.location.pathname.includes('/auth/');
        const imagePath = isInAuthFolder ? '../' : '';

        // 生成随机食物选项
        const foodOptions = this.generateRandomFoodOptions();

        const overlay = document.createElement('div');
        overlay.className = 'cat-captcha-overlay';
        overlay.innerHTML = `
            <div class="cat-captcha-container">
                <div class="cat-captcha-header">
                    <h3>🐱 帮助小猫咪</h3>
                    <p>${this.getChallengeDescription()}</p>
                    <div class="captcha-timer">
                        <i class="fas fa-clock"></i>
                        <span id="captchaTimer">${Math.floor(this.timeLimit / 1000)}</span>秒
                    </div>
                </div>

                <div class="cat-captcha-game">
                    <!-- 哭泣的猫咪 -->
                    <div class="cat-container">
                        <img src="${imagePath}猫咪哭泣.jpeg" alt="哭泣的猫咪" class="cat-image crying" id="catImage">
                        <div class="cat-status">😢 小猫咪很饿...</div>
                    </div>

                    <!-- 食物选项 -->
                    <div class="food-container">
                        ${foodOptions.map(food => `
                            <div class="food-item ${food.type}-food" draggable="true" data-type="${food.type}" data-id="${food.id}">
                                <div class="food-emoji">${food.emoji}</div>
                                <span>${food.name}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- 多选模式进度提示 -->
                    ${this.challengeType === 'multiple' ? `
                        <div class="progress-indicator">
                            <span id="feedProgress">已喂食: 0/${this.requiredGoodFeeds}</span>
                        </div>
                    ` : ''}
                </div>

                <div class="cat-captcha-footer">
                    <button class="captcha-cancel-btn" id="captchaCancel">
                        <i class="fas fa-times"></i>
                        取消
                    </button>
                    <div class="captcha-hint">
                        💡 提示：${this.getChallengeHint()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;

        // 启动计时器
        this.startTimer();
    }

    // 生成随机食物选项
    generateRandomFoodOptions() {
        // 定义所有可能的食物选项
        const goodFoods = [
            { emoji: '🍖', name: '美味肉肉', type: 'good' },
            { emoji: '🐟', name: '新鲜小鱼', type: 'good' },
            { emoji: '🥛', name: '香甜牛奶', type: 'good' },
            { emoji: '🍗', name: '香烤鸡腿', type: 'good' },
            { emoji: '🧀', name: '奶香芝士', type: 'good' },
            { emoji: '🥩', name: '嫩滑牛肉', type: 'good' },
            { emoji: '🍤', name: '鲜美虾仁', type: 'good' },
            { emoji: '🐠', name: '活蹦小鱼', type: 'good' },
            { emoji: '🥓', name: '香脆培根', type: 'good' },
            { emoji: '🍯', name: '甜蜜蜂蜜', type: 'good' },
            { emoji: '🥚', name: '营养鸡蛋', type: 'good' },
            { emoji: '🍖', name: '鲜嫩羊肉', type: 'good' }
        ];

        const badFoods = [
            { emoji: '💩', name: '臭臭便便', type: 'bad' },
            { emoji: '🗑️', name: '垃圾废料', type: 'bad' },
            { emoji: '🧻', name: '卫生纸巾', type: 'bad' },
            { emoji: '🧽', name: '清洁海绵', type: 'bad' },
            { emoji: '🔋', name: '废旧电池', type: 'bad' },
            { emoji: '🧪', name: '化学试剂', type: 'bad' },
            { emoji: '🚬', name: '香烟烟头', type: 'bad' },
            { emoji: '💊', name: '药物胶囊', type: 'bad' },
            { emoji: '🧼', name: '洗涤肥皂', type: 'bad' },
            { emoji: '🔧', name: '金属工具', type: 'bad' },
            { emoji: '🌶️', name: '超辣辣椒', type: 'bad' },
            { emoji: '🧄', name: '刺激大蒜', type: 'bad' }
        ];

        // 根据挑战类型生成不同的食物组合
        let selectedFoods = [];

        switch(this.challengeType) {
            case 'normal':
                // 普通模式：3个好食物，1个坏食物
                selectedFoods = [
                    ...this.shuffleArray([...goodFoods]).slice(0, 3),
                    ...this.shuffleArray([...badFoods]).slice(0, 1)
                ];
                this.requiredGoodFeeds = 1; // 只需要喂一个好食物
                break;

            case 'multiple':
                // 多选模式：2个好食物，2个坏食物
                const selectedGoodFoods = this.shuffleArray([...goodFoods]).slice(0, 2);
                selectedFoods = [
                    ...selectedGoodFoods,
                    ...this.shuffleArray([...badFoods]).slice(0, 2)
                ];
                this.requiredGoodFeeds = selectedGoodFoods.length; // 需要喂所有好食物
                break;

            case 'avoid':
                // 避免模式：1个好食物，3个坏食物
                selectedFoods = [
                    ...this.shuffleArray([...goodFoods]).slice(0, 1),
                    ...this.shuffleArray([...badFoods]).slice(0, 3)
                ];
                this.requiredGoodFeeds = 1; // 只需要喂一个好食物
                break;

            default:
                // 默认模式
                selectedFoods = [
                    ...this.shuffleArray([...goodFoods]).slice(0, 3),
                    ...this.shuffleArray([...badFoods]).slice(0, 1)
                ];
                this.requiredGoodFeeds = 1;
        }

        // 为每个食物添加唯一ID
        selectedFoods = selectedFoods.map((food, index) => ({
            ...food,
            id: `food_${index}_${Date.now()}`
        }));

        // 重置计数器
        this.completedGoodFeeds = 0;
        this.fedFoodTypes.clear();

        // 随机排序最终的食物列表
        return this.shuffleArray(selectedFoods);
    }

    // 数组随机排序函数
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 获取挑战描述
    getChallengeDescription() {
        const descriptions = {
            'normal': '拖拽美食给哭泣的小猫咪，让它开心起来吧！',
            'multiple': '小猫咪特别饿，需要多种美食才能满足！',
            'avoid': '小心！有很多危险的东西，只选择安全的食物！'
        };
        return descriptions[this.challengeType] || descriptions['normal'];
    }

    // 获取挑战提示
    getChallengeHint() {
        const hints = {
            'normal': '拖拽好吃的食物到猫咪身上',
            'multiple': '拖拽所有好吃的食物，避开有害的东西',
            'avoid': '仔细辨别，只选择真正适合猫咪的食物'
        };
        return hints[this.challengeType] || hints['normal'];
    }

    // 绑定事件
    bindEvents() {
        const foodItems = this.overlay.querySelectorAll('.food-item');
        const catContainer = this.overlay.querySelector('.cat-container');
        const cancelBtn = this.overlay.querySelector('#captchaCancel');

        // 拖拽事件
        foodItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('drag', (e) => this.handleDrag(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // 放置区域事件
        catContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            catContainer.classList.add('drag-over');
        });

        catContainer.addEventListener('dragleave', () => {
            catContainer.classList.remove('drag-over');
        });

        catContainer.addEventListener('drop', (e) => this.handleDrop(e));

        // 取消按钮
        cancelBtn.addEventListener('click', () => this.cancel());

        // ESC键取消
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    // 处理拖拽开始
    handleDragStart(e) {
        this.dragStartTime = Date.now();
        this.dragPath = [];
        const foodItem = e.target.closest('.food-item');
        this.currentDragType = foodItem.dataset.type;
        this.currentDragId = foodItem.dataset.id;

        // 记录拖拽开始位置
        this.dragPath.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });

        e.target.style.opacity = '0.5';
    }

    // 处理拖拽过程
    handleDrag(e) {
        if (e.clientX !== 0 && e.clientY !== 0) {
            this.dragPath.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });
        }
    }

    // 处理拖拽结束
    handleDragEnd(e) {
        e.target.style.opacity = '1';
    }

    // 处理放置
    handleDrop(e) {
        e.preventDefault();
        const catContainer = e.currentTarget;
        catContainer.classList.remove('drag-over');

        const dragTime = Date.now() - this.dragStartTime;
        const pathLength = this.calculatePathLength();

        // 记录交互数据
        this.interactions.push({
            type: this.currentDragType,
            dragTime,
            pathLength,
            timestamp: Date.now(),
            foodId: this.currentDragId
        });

        if (this.currentDragType === 'good') {
            this.handleCorrectFeed();
        } else {
            this.handleWrongFeed();
        }
    }

    // 正确喂食
    handleCorrectFeed() {
        // 检查是否已经喂过这个食物
        if (this.fedFoodTypes.has(this.currentDragId)) {
            this.showFeedbackMessage('这个食物已经喂过了！', 'warning');
            return;
        }

        // 记录已喂食的食物
        this.fedFoodTypes.add(this.currentDragId);
        this.completedGoodFeeds++;

        // 隐藏已使用的食物
        const foodItem = this.overlay.querySelector(`[data-id="${this.currentDragId}"]`);
        if (foodItem) {
            foodItem.style.opacity = '0.3';
            foodItem.style.pointerEvents = 'none';
            foodItem.draggable = false;
        }

        const catImage = this.overlay.querySelector('#catImage');
        const catStatus = this.overlay.querySelector('.cat-status');

        // 根据当前页面路径确定图片路径
        const isInAuthFolder = window.location.pathname.includes('/auth/');
        const imagePath = isInAuthFolder ? '../' : '';

        // 更新进度显示
        if (this.challengeType === 'multiple') {
            const progressElement = this.overlay.querySelector('#feedProgress');
            if (progressElement) {
                progressElement.textContent = `已喂食: ${this.completedGoodFeeds}/${this.requiredGoodFeeds}`;
            }
        }

        // 检查是否完成所有要求
        if (this.completedGoodFeeds >= this.requiredGoodFeeds) {
            // 切换到开心的猫咪
            catImage.src = `${imagePath}猫咪开心.jpeg`;
            catImage.className = 'cat-image happy';
            catStatus.innerHTML = '😸 小猫咪很开心！所有食物都很棒！';
            catStatus.style.color = '#4CAF50';

            // 添加成功动画
            catImage.style.animation = 'catHappy 1s ease-in-out';

            // 验证成功
            setTimeout(() => {
                if (this.validateHumanBehavior()) {
                    this.complete(true);
                } else {
                    this.showError('检测到异常行为，请重试');
                    this.reset();
                }
            }, 1500);
        } else {
            // 部分完成，显示鼓励信息
            catStatus.innerHTML = `😋 小猫咪喜欢这个！还需要更多食物哦~`;
            catStatus.style.color = '#4CAF50';

            // 短暂的开心表情
            catImage.src = `${imagePath}猫咪开心.jpeg`;
            catImage.className = 'cat-image happy';

            setTimeout(() => {
                catImage.src = `${imagePath}猫咪哭泣.jpeg`;
                catImage.className = 'cat-image crying';
                catStatus.innerHTML = '😢 小猫咪还是很饿...';
                catStatus.style.color = '';
            }, 2000);
        }
    }

    // 错误喂食
    handleWrongFeed() {
        const catContainer = this.overlay.querySelector('.cat-container');
        const catStatus = this.overlay.querySelector('.cat-status');
        
        // 显示错误反馈
        catContainer.style.animation = 'shake 0.5s ease-in-out';
        catStatus.innerHTML = '🤢 小猫咪不喜欢这个...';
        catStatus.style.color = '#f44336';

        setTimeout(() => {
            catContainer.style.animation = '';
            catStatus.innerHTML = '😢 小猫咪很饿...';
            catStatus.style.color = '';
        }, 2000);
    }

    // 验证人类行为
    validateHumanBehavior() {
        if (this.interactions.length === 0) return false;

        const lastInteraction = this.interactions[this.interactions.length - 1];
        
        // 检查拖拽时间（太快或太慢都可疑）
        if (lastInteraction.dragTime < this.minDragTime || 
            lastInteraction.dragTime > this.maxDragTime) {
            return false;
        }

        // 检查拖拽路径长度（直线拖拽可疑）
        if (lastInteraction.pathLength < this.minPathLength) {
            return false;
        }

        // 检查拖拽路径的自然性（人类拖拽通常不是完美直线）
        if (!this.isNaturalPath()) {
            return false;
        }

        return true;
    }

    // 检查拖拽路径是否自然
    isNaturalPath() {
        if (this.dragPath.length < 3) return false;

        let directionChanges = 0;
        let lastDirection = null;

        for (let i = 1; i < this.dragPath.length; i++) {
            const current = this.dragPath[i];
            const previous = this.dragPath[i - 1];
            
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            const direction = Math.atan2(dy, dx);

            if (lastDirection !== null) {
                const directionDiff = Math.abs(direction - lastDirection);
                if (directionDiff > 0.5) { // 方向变化阈值
                    directionChanges++;
                }
            }
            lastDirection = direction;
        }

        // 人类拖拽通常会有一些方向变化
        return directionChanges >= 2;
    }

    // 计算拖拽路径长度
    calculatePathLength() {
        let length = 0;
        for (let i = 1; i < this.dragPath.length; i++) {
            const current = this.dragPath[i];
            const previous = this.dragPath[i - 1];
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    // 启动计时器
    startTimer() {
        let timeLeft = Math.floor(this.timeLimit / 1000);
        const timerElement = this.overlay.querySelector('#captchaTimer');

        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            // 根据剩余时间比例改变颜色
            const timeRatio = timeLeft / Math.floor(this.timeLimit / 1000);
            if (timeRatio <= 0.3) {
                timerElement.style.color = '#f44336';
            } else if (timeRatio <= 0.5) {
                timerElement.style.color = '#ff9800';
            }

            if (timeLeft <= 0) {
                this.timeout();
            }
        }, 1000);
    }

    // 超时处理
    timeout() {
        this.showError('验证超时，请重试');
        this.complete(false);
    }

    // 显示错误信息
    showError(message) {
        this.showFeedbackMessage(message, 'error');
    }

    // 显示反馈消息
    showFeedbackMessage(message, type = 'error') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `captcha-message captcha-${type}`;

        const icon = type === 'error' ? 'fas fa-exclamation-triangle' :
                    type === 'warning' ? 'fas fa-exclamation-circle' :
                    'fas fa-info-circle';

        messageDiv.innerHTML = `
            <i class="${icon}"></i>
            ${message}
        `;

        const container = this.overlay.querySelector('.cat-captcha-container');
        container.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 重置验证
    reset() {
        const catImage = this.overlay.querySelector('#catImage');
        const catStatus = this.overlay.querySelector('.cat-status');

        // 根据当前页面路径确定图片路径
        const isInAuthFolder = window.location.pathname.includes('/auth/');
        const imagePath = isInAuthFolder ? '../' : '';

        catImage.src = `${imagePath}猫咪哭泣.jpeg`;
        catImage.className = 'cat-image crying';
        catStatus.innerHTML = '😢 小猫咪很饿...';
        catStatus.style.color = '';

        this.interactions = [];
        this.dragPath = [];
        this.attemptCount++;

        // 重置多选模式状态
        this.completedGoodFeeds = 0;
        this.fedFoodTypes.clear();

        // 恢复所有食物的可用状态
        const foodItems = this.overlay.querySelectorAll('.food-item');
        foodItems.forEach(item => {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.draggable = true;
        });

        // 重置进度显示
        if (this.challengeType === 'multiple') {
            const progressElement = this.overlay.querySelector('#feedProgress');
            if (progressElement) {
                progressElement.textContent = `已喂食: 0/${this.requiredGoodFeeds}`;
            }
        }

        // 如果尝试次数过多，重新生成挑战
        if (this.attemptCount >= 2) {
            this.challengeType = this.getRandomChallengeType();
            this.regenerateFoodOptions();
            this.attemptCount = 0;
        }
    }

    // 重新生成食物选项
    regenerateFoodOptions() {
        const foodContainer = this.overlay.querySelector('.food-container');
        const newFoodOptions = this.generateRandomFoodOptions();

        // 重新生成食物容器HTML
        const gameContainer = this.overlay.querySelector('.cat-captcha-game');
        const catContainer = gameContainer.querySelector('.cat-container');

        gameContainer.innerHTML = `
            ${catContainer.outerHTML}

            <!-- 食物选项 -->
            <div class="food-container">
                ${newFoodOptions.map(food => `
                    <div class="food-item ${food.type}-food" draggable="true" data-type="${food.type}" data-id="${food.id}">
                        <div class="food-emoji">${food.emoji}</div>
                        <span>${food.name}</span>
                    </div>
                `).join('')}
            </div>

            <!-- 多选模式进度提示 -->
            ${this.challengeType === 'multiple' ? `
                <div class="progress-indicator">
                    <span id="feedProgress">已喂食: 0/${this.requiredGoodFeeds}</span>
                </div>
            ` : ''}
        `;

        // 重新绑定拖拽事件
        const foodItems = gameContainer.querySelectorAll('.food-item');
        foodItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('drag', (e) => this.handleDrag(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // 重新绑定猫咪容器事件
        const newCatContainer = gameContainer.querySelector('.cat-container');
        newCatContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            newCatContainer.classList.add('drag-over');
        });
        newCatContainer.addEventListener('dragleave', () => {
            newCatContainer.classList.remove('drag-over');
        });
        newCatContainer.addEventListener('drop', (e) => this.handleDrop(e));

        // 更新提示信息
        const hintElement = this.overlay.querySelector('.captcha-hint');
        if (hintElement) {
            hintElement.innerHTML = `💡 提示：${this.getChallengeHint()}`;
        }

        // 更新描述
        const descElement = this.overlay.querySelector('.cat-captcha-header p');
        if (descElement) {
            descElement.textContent = this.getChallengeDescription();
        }
    }

    // 处理键盘事件
    handleKeydown(e) {
        if (e.key === 'Escape' && this.isActive) {
            this.cancel();
        }
    }

    // 取消验证
    cancel() {
        this.complete(false);
    }

    // 完成验证
    complete(success) {
        this.isActive = false;
        this.isCompleted = true;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        }
        
        document.removeEventListener('keydown', this.handleKeydown);
        
        if (this.currentResolve) {
            this.currentResolve(success);
        }
    }
}

// 创建全局实例
window.catCaptcha = new CatCaptcha();

// 便捷函数
window.showCatCaptcha = () => {
    return window.catCaptcha.show();
};
