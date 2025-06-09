// 网站工具数据将从外部文件加载

// 全局变量
let currentFilter = 'all';
let currentCategory = 'all';
let favorites = [];
let searchQuery = '';

// DOM元素 - 将在DOMContentLoaded中初始化
let toolsGrid;
let searchInput;
let themeToggle;
let filterButtons;
let categoryItems;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化DOM元素
    toolsGrid = document.getElementById('toolsGrid');
    searchInput = document.getElementById('searchInput');
    themeToggle = document.getElementById('themeToggle');
    filterButtons = document.querySelectorAll('.filter-btn');
    categoryItems = document.querySelectorAll('.category-item');

    // 初始化AOS动画
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 主题由Utils自动加载

    // 加载用户收藏
    loadUserFavorites();

    // 渲染工具
    renderTools();

    // 绑定事件
    bindEvents();
});

// 绑定事件
function bindEvents() {
    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // 主题切换 - 由Utils自动处理
    // themeToggle事件绑定已在Utils.init()中处理

    // 筛选按钮
    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
        });
    }

    // 分类选择
    if (categoryItems) {
        categoryItems.forEach(item => {
            item.addEventListener('click', () => handleCategory(item.dataset.category));
        });
    }
}

// 搜索处理
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();

    // 渲染工具
    renderTools();

    // 如果有搜索内容，添加搜索交互效果
    if (searchQuery.trim() !== '') {
        // 自动滚动到工具区域，让用户看到搜索结果
        scrollToToolsSection();
        // 显示搜索结果提示
        showSearchResult(searchQuery);
    }
}

// 筛选处理
function handleFilter(filter) {
    currentFilter = filter;

    // 更新按钮状态
    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    renderTools();
}

// 分类处理
function handleCategory(category) {
    currentCategory = category;

    // 更新分类状态
    if (categoryItems) {
        categoryItems.forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });
    }

    // 添加交互动画和自动定位
    showFilteringAnimation();

    // 延迟渲染以显示动画效果
    setTimeout(() => {
        renderTools();
        // 自动滚动到工具区域
        scrollToToolsSection();
        // 显示筛选结果提示
        showFilterResult(category);
    }, 300);
}

// 显示筛选动画
function showFilteringAnimation() {
    const toolsGrid = document.getElementById('toolsGrid');
    if (!toolsGrid) return;

    // 添加过渡效果
    toolsGrid.style.transition = 'all 0.3s ease';
    toolsGrid.style.opacity = '0.5';
    toolsGrid.style.transform = 'scale(0.95)';

    // 添加加载指示器
    const existingLoader = document.querySelector('.filtering-loader');
    if (existingLoader) {
        existingLoader.remove();
    }

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'filtering-loader';
    loadingIndicator.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <span>正在为您寻找好工具...</span>
        </div>
    `;

    const toolsSection = document.querySelector('.tools-section .container');
    if (toolsSection) {
        toolsSection.appendChild(loadingIndicator);
    }

    // 300ms后移除加载指示器并恢复样式
    setTimeout(() => {
        if (loadingIndicator.parentNode) {
            loadingIndicator.remove();
        }
        toolsGrid.style.opacity = '1';
        toolsGrid.style.transform = 'scale(1)';
    }, 300);
}

// 滚动到工具区域
function scrollToToolsSection() {
    const toolsSection = document.querySelector('.tools-section');
    if (toolsSection) {
        toolsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 显示搜索结果提示
function showSearchResult(query) {
    // 移除之前的提示
    const existingTip = document.querySelector('.search-result-tip');
    if (existingTip) {
        existingTip.remove();
    }

    const filteredTools = getFilteredTools();
    const hasResults = filteredTools.length > 0;

    // 创建搜索结果提示
    const resultTip = document.createElement('div');
    resultTip.className = 'search-result-tip';
    resultTip.innerHTML = `
        <div class="tip-content">
            <i class="fas fa-search"></i>
            <span>搜索 "<strong>${query}</strong>" 找到 <strong>${filteredTools.length}</strong> 个相关工具</span>
            ${hasResults && window.externalSearch ?
                window.externalSearch.createQuickSearchButton(query, 'baidu') :
                hasResults ? `
                    <button class="external-search-quick-btn"
                            onclick="openExternalSearch('https://www.baidu.com/s?wd=${encodeURIComponent(query)}')"
                            title="在百度中搜索更多">
                        <i class="fas fa-external-link-alt"></i>
                        扩展搜索
                    </button>
                ` : ''
            }
            <button class="tip-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // 插入到工具网格前面
    const toolsGrid = document.getElementById('toolsGrid');
    if (toolsGrid && toolsGrid.parentNode) {
        toolsGrid.parentNode.insertBefore(resultTip, toolsGrid);
    }
}

// 显示筛选结果提示
function showFilterResult(category) {
    const categoryNames = {
        ai: 'AI工具',
        development: '开发设计',
        learning: '学习办公',
        entertainment: '娱乐社交',
        productivity: '效率工具',
        utility: '实用网站',
        all: '全部网站'
    };

    const filteredTools = getFilteredTools();
    const categoryName = categoryNames[category] || '全部网站';

    // 移除已存在的提示
    const existingTip = document.querySelector('.filter-result-tip');
    if (existingTip) {
        existingTip.remove();
    }

    // 创建结果提示
    const resultTip = document.createElement('div');
    resultTip.className = 'filter-result-tip';
    resultTip.innerHTML = `
        <div class="tip-content">
            <i class="fas fa-check-circle"></i>
            <span>已筛选出 <strong>${filteredTools.length}</strong> 个${categoryName}工具</span>
            <button class="tip-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // 插入到工具网格前面
    const toolsGrid = document.getElementById('toolsGrid');
    if (toolsGrid && toolsGrid.parentNode) {
        toolsGrid.parentNode.insertBefore(resultTip, toolsGrid);
    }

    // 移除自动消失功能，只保留手动关闭
}

// 主题切换由Utils自动处理，无需额外函数

// 渲染工具
function renderTools() {
    if (!toolsGrid) return;

    const filteredTools = getFilteredTools();

    if (filteredTools.length === 0) {
        const hasSearchQuery = searchQuery.trim() !== '';
        toolsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">未找到相关工具</h3>
                <p style="color: var(--text-secondary); margin-bottom: 30px;">
                    ${hasSearchQuery ? `没有找到包含 "${searchQuery}" 的工具` : '尝试调整搜索关键词或筛选条件'}
                </p>
                ${hasSearchQuery ? createExternalSearchOptions(searchQuery) : ''}
            </div>
        `;
        return;
    }

    // 对工具进行排序：自主开发的工具优先显示
    const sortedTools = [...filteredTools].sort((a, b) => {
        // 优先级排序：priority值越小越靠前
        if (a.priority !== b.priority) {
            return (a.priority || 999) - (b.priority || 999);
        }

        // 自主开发的工具排在前面
        if (a.selfDeveloped && !b.selfDeveloped) return -1;
        if (!a.selfDeveloped && b.selfDeveloped) return 1;

        // 其他按原有顺序
        return 0;
    });

    toolsGrid.innerHTML = sortedTools.map(tool => createToolCard(tool)).join('');

    // 重新初始化AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// 创建外部搜索选项（使用外部搜索模块）
function createExternalSearchOptions(query) {
    // 使用外部搜索模块，根据当前分类推荐搜索引擎
    if (window.externalSearch) {
        return window.externalSearch.createExternalSearchOptions(query, currentCategory);
    }

    // 降级方案：如果外部搜索模块未加载
    const encodedQuery = encodeURIComponent(query);
    return `
        <div class="external-search-section">
            <h4 style="color: var(--text-primary); margin-bottom: 20px; font-family: 'Caveat', cursive; font-size: 1.3rem;">
                🔍 试试在其他地方搜索 "${query}"
            </h4>
            <div class="external-search-grid">
                <button class="external-search-btn"
                        onclick="openExternalSearch('https://www.baidu.com/s?wd=${encodedQuery}')"
                        style="--engine-color: #4285f4">
                    <i class="fas fa-search"></i>
                    <span>百度搜索</span>
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="external-search-btn"
                        onclick="openExternalSearch('https://www.google.com/search?q=${encodedQuery}')"
                        style="--engine-color: #ea4335">
                    <i class="fab fa-google"></i>
                    <span>Google搜索</span>
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </div>
    `;
}

// 打开外部搜索（使用外部搜索模块）
function openExternalSearch(url) {
    if (window.externalSearch) {
        window.externalSearch.openExternalSearch(url);
    } else {
        // 降级方案
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// 获取筛选后的工具
function getFilteredTools() {
    return websitesDetail.filter(tool => {
        // 分类筛选
        if (currentCategory !== 'all' && tool.category !== currentCategory) {
            return false;
        }

        // 价格筛选
        if (currentFilter === 'free' && tool.pricing !== 'free') {
            return false;
        }
        if (currentFilter === 'premium' && tool.pricing === 'free') {
            return false;
        }

        // 搜索筛选 - 增强关键词匹配
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const searchableText = [
                tool.name,
                tool.description,
                tool.detailedDescription || '',
                ...(tool.tags || []),
                ...(tool.features || []),
                ...(tool.useCases || [])
            ].join(' ').toLowerCase();

            // 支持模糊匹配和同义词
            const synonyms = {
                '生物信息学': ['生物信息', 'bioinformatics', 'ncbi', 'entrez', '基因', '蛋白质', 'dna', 'rna'],
                '人工智能': ['ai', 'artificial intelligence', '机器学习', 'ml', 'deep learning'],
                '设计': ['design', 'ui', 'ux', '界面', '原型'],
                '编程': ['programming', 'coding', '代码', 'development', '开发'],
                '翻译': ['translate', 'translation', '语言', 'language'],
                '音乐': ['music', 'spotify', '播放', '歌曲'],
                '视频': ['video', 'youtube', '播放', '影片']
            };

            // 检查直接匹配
            if (searchableText.includes(query)) {
                return true;
            }

            // 检查同义词匹配
            for (const [key, values] of Object.entries(synonyms)) {
                if (query.includes(key) || values.some(synonym => query.includes(synonym))) {
                    if (values.some(synonym => searchableText.includes(synonym)) ||
                        searchableText.includes(key)) {
                        return true;
                    }
                }
            }

            return false;
        }

        return true;
    });
}

// 创建工具卡片
function createToolCard(tool) {
    const isFavorited = favorites.includes(tool.id);
    const categoryNames = Utils.getCategoryNames();

    // 为自主开发的工具添加特殊样式类
    const cardClasses = ['tool-card'];
    if (tool.selfDeveloped) {
        cardClasses.push('self-developed');
    }
    if (tool.priority === 1) {
        cardClasses.push('priority-high');
    }

    // 自主开发标识
    const selfDevelopedBadge = tool.selfDeveloped ? `
        <div class="self-developed-badge">
            <i class="fas fa-star"></i>
            <span>自主开发</span>
        </div>
    ` : '';

    return `
        <div class="${cardClasses.join(' ')}" data-aos="fade-up" data-aos-delay="100" onclick="openToolDetail(${tool.id})">
            ${selfDevelopedBadge}
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <span class="tool-category">${categoryNames[tool.category]}</span>
                </div>
            </div>

            <p class="tool-description">${tool.description}</p>

            <div class="tool-footer">
                <div class="tool-pricing ${tool.pricing === 'free' ? 'pricing-free' : 'pricing-premium'}">
                    <i class="fas fa-${tool.pricing === 'free' ? 'gift' : 'crown'}"></i>
                    <span>${tool.pricing === 'free' ? '免费' : tool.pricing === 'freemium' ? '免费增值' : '付费'}</span>
                </div>

                <div class="tool-actions">
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}"
                            onclick="event.stopPropagation(); toggleFavorite(${tool.id})"
                            title="${isFavorited ? '取消收藏' : '添加收藏'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="visit-btn" onclick="event.stopPropagation(); visitTool('${tool.url}')" title="访问网站">
                        <span>访问</span>
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 加载用户收藏
function loadUserFavorites() {
    if (!window.isLoggedIn) {
        favorites = [];
        return;
    }

    fetch('backend/api/favorites.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                favorites = data.favorites;
                renderTools();
            }
        })
        .catch(error => {
            console.error('加载收藏失败:', error);
            favorites = [];
        });
}

// 切换收藏状态
async function toggleFavorite(toolId) {
    if (!window.isLoggedIn) {
        await window.doodleAlert('请先登录后再收藏', '需要登录');
        return;
    }

    const isCurrentlyFavorited = favorites.includes(toolId);
    const method = isCurrentlyFavorited ? 'DELETE' : 'POST';

    fetch('backend/api/favorites.php', {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website_id: toolId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isCurrentlyFavorited) {
                favorites = favorites.filter(id => id != toolId);
                Utils.showMessage('已取消收藏', 'success');
            } else {
                favorites.push(toolId);
                Utils.showMessage('已添加到收藏', 'success');
            }
            renderTools();
        } else {
            Utils.showMessage('操作失败：' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('收藏操作失败:', error);
        Utils.showMessage('操作失败，请重试', 'error');
    });
}

// 访问工具网站
function visitTool(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// 平滑滚动函数已整合到其他功能中

// 打开工具详情页
function openToolDetail(toolId) {
    // 检查详细数据是否已加载
    if (typeof websitesDetail === 'undefined') {
        console.error('Websites detail data not loaded');
        return;
    }

    // 查找工具详细信息
    const toolDetail = websitesDetail.find(tool => tool.id === toolId);
    if (!toolDetail) {
        console.error('Tool detail not found for ID:', toolId);
        return;
    }



    // 渲染详情页内容
    renderToolDetail(toolDetail);

    // 显示详情页
    const detailOverlay = document.getElementById('toolDetail');
    detailOverlay.classList.remove('hidden');

    // 禁止背景滚动
    document.body.style.overflow = 'hidden';

    // 更新收藏按钮状态
    updateDetailFavoriteButton(toolId);
}

// 关闭工具详情页
function closeToolDetail() {
    const detailOverlay = document.getElementById('toolDetail');
    detailOverlay.classList.add('hidden');

    // 恢复背景滚动
    document.body.style.overflow = 'auto';

    // currentToolDetail变量已删除，不再需要
}

// 渲染工具详情页内容
function renderToolDetail(tool) {
    const categoryNames = Utils.getCategoryNames();

    const detailContent = document.getElementById('toolDetailContent');

    // 生成评分星星 - 使用通用工具函数
    const generateStars = (rating) => Utils.generateStars(rating);

    // 生成特色功能列表
    const generateFeatures = (features) => {
        return features.map(feature => `
            <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    };

    // 生成使用场景列表
    const generateUseCases = (useCases) => {
        return useCases.map(useCase => `
            <li class="use-case-item">${useCase}</li>
        `).join('');
    };

    // 生成优缺点列表
    const generateProsCons = (pros, cons) => {
        const prosHtml = pros.map(pro => `<li>${pro}</li>`).join('');
        const consHtml = cons.map(con => `<li>${con}</li>`).join('');

        return `
            <div class="pros-cons-grid">
                <div class="pros-section">
                    <h4><i class="fas fa-thumbs-up"></i> 优点</h4>
                    <ul class="pros-list">${prosHtml}</ul>
                </div>
                <div class="cons-section">
                    <h4><i class="fas fa-thumbs-down"></i> 缺点</h4>
                    <ul class="cons-list">${consHtml}</ul>
                </div>
            </div>
        `;
    };

    // 生成定价方案
    const generatePricing = (pricingDetails) => {
        if (!pricingDetails) return '';

        const plans = Object.values(pricingDetails).map(plan => `
            <div class="pricing-plan">
                <div class="plan-name">${plan.name}</div>
                <div class="plan-price">${plan.price}</div>
                <ul class="plan-features">
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        return `
            <div class="detail-section pricing-section">
                <h3>定价方案</h3>
                <div class="pricing-plans">${plans}</div>
            </div>
        `;
    };

    // 生成标签
    const generateTags = (tags) => {
        return tags.map(tag => `<span class="tag-item">${tag}</span>`).join('');
    };

    detailContent.innerHTML = `
        <div class="detail-hero">
            <div class="detail-tool-icon">
                <i class="${tool.icon}"></i>
            </div>
            <h1 class="detail-tool-name">${tool.name}</h1>
            <span class="detail-tool-category">${categoryNames[tool.category]}</span>
            <div class="detail-rating">
                <div class="rating-stars">${generateStars(tool.rating)}</div>
                <span class="rating-text">${tool.rating} (${tool.reviews.toLocaleString()} 评价)</span>
            </div>
        </div>

        <div class="detail-description">
            <h3>详细介绍</h3>
            <p>${tool.detailedDescription}</p>
        </div>

        <div class="detail-section">
            <h3>特色功能</h3>
            <div class="features-grid">
                ${generateFeatures(tool.features)}
            </div>
        </div>

        <div class="detail-section">
            <h3>使用场景</h3>
            <ul class="use-cases-list">
                ${generateUseCases(tool.useCases)}
            </ul>
        </div>

        ${generateProsCons(tool.pros, tool.cons)}

        ${generatePricing(tool.pricingDetails)}

        <div class="detail-section tags-section">
            <h3>相关标签</h3>
            <div class="tags-list">
                ${generateTags(tool.tags)}
            </div>
        </div>

        <div class="detail-actions-bottom">
            <button class="visit-tool-btn" onclick="visitTool('${tool.url}')">
                <span>立即使用</span>
                <i class="fas fa-external-link-alt"></i>
            </button>
        </div>
    `;
}

// 更新详情页收藏按钮状态
function updateDetailFavoriteButton(toolId) {
    const favoriteBtn = document.getElementById('detailFavoriteBtn');
    const isFavorited = favorites.includes(toolId);

    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.title = isFavorited ? '取消收藏' : '添加收藏';

    // 绑定点击事件
    favoriteBtn.onclick = () => {
        toggleFavorite(toolId);
        updateDetailFavoriteButton(toolId);
    };
}

// 点击背景关闭详情页
document.addEventListener('DOMContentLoaded', function() {
    const detailOverlay = document.getElementById('toolDetail');

    detailOverlay.addEventListener('click', function(e) {
        if (e.target === detailOverlay) {
            closeToolDetail();
        }
    });

    // ESC键关闭详情页 - 已在Utils中统一处理
    // 详情页ESC关闭功能已在Utils.bindGlobalEvents()中实现

    // 检查管理员权限
    checkAdminAccess();
});

// 检查管理员权限
function checkAdminAccess() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        // 更新管理员按钮状态
        updateAdminButtonState(true);

        // 添加管理员快速编辑功能
        setTimeout(() => {
            if (window.contentManager) {
                window.contentManager.addAdminEntry();
            }
        }, 1000);
    }
}

// 显示管理员登录对话框
function showAdminLogin() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        // 已经是管理员，直接打开管理页面
        window.open('admin/content-editor.html', '_blank');
        return;
    }

    // 创建自定义登录对话框
    const modal = document.createElement('div');
    modal.className = 'admin-login-modal';
    modal.innerHTML = `
        <div class="admin-login-content">
            <div class="admin-login-header">
                <h3><i class="fas fa-user-shield"></i> 管理员登录</h3>
                <button class="close-btn" onclick="this.closest('.admin-login-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="admin-login-body">
                <p>请输入管理员密码：</p>
                <div class="password-hint">
                    <i class="fas fa-info-circle"></i>
                    提示：密码是 <code>test</code>
                </div>
                <input type="password" id="adminPassword" placeholder="输入密码..." class="admin-password-input">
                <div class="admin-login-actions">
                    <button onclick="this.closest('.admin-login-modal').remove()" class="btn-cancel">取消</button>
                    <button onclick="verifyAdminPassword()" class="btn-login">登录</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 聚焦到密码输入框
    setTimeout(() => {
        document.getElementById('adminPassword').focus();
    }, 100);

    // 支持回车键登录
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAdminPassword();
        }
    });
}

// 验证管理员密码
function verifyAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const modal = document.querySelector('.admin-login-modal');

    if (password === 'test') {
        localStorage.setItem('isAdmin', 'true');

        // 显示成功消息
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('管理员登录成功！', 'success');
        }

        // 更新按钮状态
        updateAdminButtonState(true);

        // 关闭对话框
        modal.remove();

        // 启用管理员功能
        setTimeout(() => {
            if (window.contentManager) {
                window.contentManager.addAdminEntry();
            }
        }, 500);

        // 1秒后自动打开管理页面
        setTimeout(() => {
            window.open('admin/content-editor.html', '_blank');
        }, 1000);

    } else {
        // 密码错误
        const passwordInput = document.getElementById('adminPassword');
        passwordInput.style.borderColor = '#ef4444';
        passwordInput.style.animation = 'shake 0.5s ease-in-out';

        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('密码错误！', 'error');
        }

        // 清空输入框并重新聚焦
        setTimeout(() => {
            passwordInput.value = '';
            passwordInput.style.borderColor = '';
            passwordInput.style.animation = '';
            passwordInput.focus();
        }, 500);
    }
}

// 更新管理员按钮状态
function updateAdminButtonState(isAdmin) {
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        if (isAdmin) {
            adminBtn.innerHTML = '<i class="fas fa-cog"></i> 管理';
            adminBtn.title = '打开管理面板';
            adminBtn.classList.add('admin-active');
        } else {
            adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> 管理员';
            adminBtn.title = '管理员登录';
            adminBtn.classList.remove('admin-active');
        }
    }
}
