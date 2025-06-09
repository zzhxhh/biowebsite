// 外部搜索功能模块
// 提供多种搜索引擎的集成搜索功能

// 搜索引擎配置
const searchEngines = {
    baidu: {
        name: '百度搜索',
        icon: 'fas fa-search',
        url: 'https://www.baidu.com/s?wd=',
        color: '#4285f4',
        description: '在百度中搜索相关网站',
        category: 'general'
    },
    google: {
        name: 'Google搜索',
        icon: 'fab fa-google',
        url: 'https://www.google.com/search?q=',
        color: '#ea4335',
        description: '在Google中搜索相关网站',
        category: 'general'
    },
    bing: {
        name: '必应搜索',
        icon: 'fas fa-search',
        url: 'https://www.bing.com/search?q=',
        color: '#0078d4',
        description: '在必应中搜索相关网站',
        category: 'general'
    },
    github: {
        name: 'GitHub搜索',
        icon: 'fab fa-github',
        url: 'https://github.com/search?q=',
        color: '#333',
        description: '在GitHub中搜索开源项目',
        category: 'development'
    },
    stackoverflow: {
        name: 'Stack Overflow',
        icon: 'fab fa-stack-overflow',
        url: 'https://stackoverflow.com/search?q=',
        color: '#f48024',
        description: '在Stack Overflow中搜索技术问题',
        category: 'development'
    },
    zhihu: {
        name: '知乎搜索',
        icon: 'fas fa-question-circle',
        url: 'https://www.zhihu.com/search?type=content&q=',
        color: '#0084ff',
        description: '在知乎中搜索相关话题',
        category: 'general'
    },
    bilibili: {
        name: 'B站搜索',
        icon: 'fas fa-play-circle',
        url: 'https://search.bilibili.com/all?keyword=',
        color: '#fb7299',
        description: '在B站中搜索相关视频',
        category: 'entertainment'
    },
    youtube: {
        name: 'YouTube搜索',
        icon: 'fab fa-youtube',
        url: 'https://www.youtube.com/results?search_query=',
        color: '#ff0000',
        description: '在YouTube中搜索相关视频',
        category: 'entertainment'
    }
};

// 根据当前分类获取推荐的搜索引擎
function getRecommendedEngines(category = 'all', limit = 4) {
    let engines = [];
    
    // 根据分类推荐不同的搜索引擎
    switch(category) {
        case 'ai':
        case 'development':
            engines = ['baidu', 'google', 'github', 'stackoverflow'];
            break;
        case 'entertainment':
            engines = ['baidu', 'google', 'bilibili', 'youtube'];
            break;
        case 'learning':
            engines = ['baidu', 'google', 'zhihu', 'bilibili'];
            break;
        default:
            engines = ['baidu', 'google', 'bing', 'github'];
    }
    
    return engines.slice(0, limit).map(key => ({
        key,
        ...searchEngines[key]
    }));
}

// 创建外部搜索选项HTML
function createExternalSearchOptions(query, category = 'all') {
    const encodedQuery = encodeURIComponent(query);
    const recommendedEngines = getRecommendedEngines(category);
    
    return `
        <div class="external-search-section">
            <h4 style="color: var(--text-primary); margin-bottom: 20px; font-family: 'Caveat', cursive; font-size: 1.3rem;">
                🔍 试试在其他地方搜索 "${query}"
            </h4>
            <div class="external-search-grid">
                ${recommendedEngines.map(engine => `
                    <button class="external-search-btn" 
                            onclick="openExternalSearch('${engine.url}${encodedQuery}')"
                            style="--engine-color: ${engine.color}"
                            title="${engine.description}">
                        <i class="${engine.icon}"></i>
                        <span>${engine.name}</span>
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                `).join('')}
            </div>
            <div class="search-tips">
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 15px 0 5px 0; font-style: italic;">
                    💡 搜索建议：
                </p>
                <ul style="color: var(--text-secondary); font-size: 0.85rem; margin: 0; padding-left: 20px;">
                    <li>尝试使用英文关键词搜索</li>
                    <li>添加 "工具"、"网站"、"在线" 等关键词</li>
                    <li>搜索替代品：如 "${query} 替代" 或 "${query} alternative"</li>
                </ul>
            </div>
        </div>
    `;
}

// 打开外部搜索
function openExternalSearch(url) {
    // 在新标签页打开搜索结果
    window.open(url, '_blank', 'noopener,noreferrer');

    // 显示提示信息
    showSearchFeedback();
}

// 显示搜索反馈 - 使用统一通知系统
function showSearchFeedback() {
    // 使用统一的通知系统
    if (window.doodleNotify) {
        window.doodleNotify.success('已在新标签页打开搜索结果', 2500);
    } else {
        // 降级方案：创建简单提示
        const feedback = document.createElement('div');
        feedback.className = 'doodle-notification doodle-notification-success';
        feedback.innerHTML = `
            <div class="doodle-notification-content">
                <i class="fas fa-external-link-alt"></i>
                <span class="doodle-notification-message">已在新标签页打开搜索结果</span>
            </div>
        `;

        // 设置位置
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
        `;

        document.body.appendChild(feedback);

        // 显示动画
        setTimeout(() => {
            feedback.classList.add('doodle-notification-show');
        }, 10);

        // 3秒后自动移除
        setTimeout(() => {
            feedback.classList.add('doodle-notification-hide');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2500);
    }
}

// 创建快捷搜索按钮
function createQuickSearchButton(query, engineKey = 'baidu') {
    const engine = searchEngines[engineKey];
    if (!engine) return '';
    
    const encodedQuery = encodeURIComponent(query);
    
    return `
        <button class="external-search-quick-btn" 
                onclick="openExternalSearch('${engine.url}${encodedQuery}')"
                title="${engine.description}">
            <i class="${engine.icon}"></i>
            <span>${engine.name}</span>
            <i class="fas fa-external-link-alt"></i>
        </button>
    `;
}

// 初始化外部搜索功能
function initExternalSearch() {
    // 外部搜索功能已初始化
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initExternalSearch);

// 导出函数供其他模块使用
window.externalSearch = {
    createExternalSearchOptions,
    createQuickSearchButton,
    openExternalSearch,
    getRecommendedEngines,
    searchEngines
};
