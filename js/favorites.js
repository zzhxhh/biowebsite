// 收藏页面功能
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.init();
    }

    init() {
        // 监听用户状态变化
        window.addEventListener('userStatusChanged', (event) => {
            this.handleUserStatusChange(event.detail);
        });

        // 如果用户已登录，加载收藏
        if (window.authManager && window.authManager.isLoggedIn()) {
            this.loadFavorites();
        }

        // 绑定搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterFavorites(e.target.value);
            });
        }
    }

    // 处理用户状态变化
    handleUserStatusChange(detail) {
        if (detail.isLoggedIn) {
            this.loadFavorites();
        } else {
            this.showNotLoggedIn();
        }
    }

    // 加载用户收藏
    async loadFavorites() {
        try {
            const response = await fetch('backend/api/favorites.php');
            const data = await response.json();
            
            if (data.success) {
                this.favorites = data.favorites || [];
                this.renderFavorites();
            } else {
                console.error('加载收藏失败:', data.message);
                this.showEmptyFavorites();
            }
        } catch (error) {
            console.error('加载收藏失败:', error);
            this.showEmptyFavorites();
        }
    }

    // 渲染收藏列表
    renderFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyFavorites = document.getElementById('emptyFavorites');
        const notLoggedIn = document.getElementById('notLoggedIn');
        const favoritesCount = document.getElementById('favoritesCount');

        // 隐藏提示信息
        if (emptyFavorites) emptyFavorites.style.display = 'none';
        if (notLoggedIn) notLoggedIn.style.display = 'none';

        if (this.favorites.length === 0) {
            this.showEmptyFavorites();
            return;
        }

        // 更新收藏数量
        if (favoritesCount) favoritesCount.textContent = this.favorites.length;

        // 获取网站详细信息并渲染
        if (typeof websitesDetail !== 'undefined') {
            const favoriteCards = this.favorites.map((favoriteId, index) => {
                const website = websitesDetail.find(w => w.id == favoriteId);
                if (!website) return '';

                return this.createFavoriteCard(website, index);
            }).filter(card => card !== '').join('');

            if (favoritesGrid) {
                favoritesGrid.innerHTML = favoriteCards;
                favoritesGrid.style.display = 'grid';
            }

            // 重新初始化AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
    }

    // 创建收藏卡片
    createFavoriteCard(website, index) {
        const categoryNames = Utils.getCategoryNames();

        return `
            <div class="favorite-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="favorite-header">
                    <div class="website-icon">
                        <i class="${website.icon}"></i>
                    </div>
                    <div class="website-info">
                        <h3>${website.name}</h3>
                        <span class="website-category">
                            ${categoryNames[website.category]}
                        </span>
                    </div>
                    <button class="unfavorite-btn" onclick="window.favoritesManager.removeFavorite(${website.id})">
                        <i class="fas fa-heart-broken"></i>
                    </button>
                </div>
                
                <p class="website-description">
                    ${website.description}
                </p>
                
                <div class="favorite-footer">
                    <div class="website-pricing ${website.pricing === 'free' ? 'pricing-free' : 'pricing-premium'}">
                        <i class="fas fa-${website.pricing === 'free' ? 'gift' : 'crown'}"></i>
                        <span>${website.pricing === 'free' ? '免费' : (website.pricing === 'freemium' ? '免费增值' : '付费')}</span>
                    </div>
                    
                    <div class="favorite-actions">
                        <a href="${website.url}" target="_blank" class="visit-btn">
                            <span>访问</span>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // 移除收藏
    async removeFavorite(websiteId) {
        // 获取网站名称用于确认对话框
        const website = websitesDetail.find(w => w.id == websiteId);
        const websiteName = website ? website.name : '这个网站';

        // 使用手绘风格确认对话框
        const confirmed = await window.doodleConfirmUnfavorite(websiteName);
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch('backend/api/favorites.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ website_id: websiteId })
            });

            const data = await response.json();

            if (data.success) {
                // 从本地列表中移除
                this.favorites = this.favorites.filter(id => id != websiteId);
                this.renderFavorites();

                // 显示成功消息
                Utils.showMessage('取消收藏成功', 'success');
            } else {
                Utils.showMessage('取消收藏失败：' + data.message, 'error');
            }
        } catch (error) {
            console.error('取消收藏失败:', error);
            Utils.showMessage('操作失败，请重试', 'error');
        }
    }

    // 筛选收藏
    filterFavorites(query) {
        const cards = document.querySelectorAll('.favorite-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.website-description').textContent.toLowerCase();
            const category = card.querySelector('.website-category').textContent.toLowerCase();

            const matches = title.includes(query.toLowerCase()) ||
                          description.includes(query.toLowerCase()) ||
                          category.includes(query.toLowerCase());

            card.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
        });

        // 如果有搜索词但没有找到结果，显示外部搜索选项
        this.handleSearchResults(query.trim(), visibleCount);
    }

    // 处理搜索结果
    handleSearchResults(query, resultCount) {
        // 移除之前的搜索提示
        const existingTip = document.querySelector('.favorites-search-tip');
        if (existingTip) {
            existingTip.remove();
        }

        if (query && resultCount === 0) {
            // 没有找到收藏结果，显示外部搜索选项
            const searchTip = document.createElement('div');
            searchTip.className = 'favorites-search-tip';
            searchTip.innerHTML = `
                <div class="no-favorites-result">
                    <i class="fas fa-search" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 15px;"></i>
                    <h4 style="color: var(--text-primary); margin-bottom: 10px;">收藏中未找到 "${query}"</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">试试在网上搜索相关工具</p>
                    ${window.externalSearch ?
                        window.externalSearch.createExternalSearchOptions(query, 'all') :
                        this.createFallbackSearch(query)
                    }
                </div>
            `;

            const favoritesGrid = document.getElementById('favoritesGrid');
            if (favoritesGrid && favoritesGrid.parentNode) {
                favoritesGrid.parentNode.insertBefore(searchTip, favoritesGrid);
            }
        } else if (query && resultCount > 0) {
            // 找到了结果，显示搜索结果提示
            const searchTip = document.createElement('div');
            searchTip.className = 'favorites-search-tip';
            searchTip.innerHTML = `
                <div class="favorites-search-result">
                    <i class="fas fa-check-circle" style="color: var(--primary-color); margin-right: 10px;"></i>
                    <span>在收藏中找到 <strong>${resultCount}</strong> 个包含 "<strong>${query}</strong>" 的工具</span>
                    <button class="tip-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            const favoritesGrid = document.getElementById('favoritesGrid');
            if (favoritesGrid && favoritesGrid.parentNode) {
                favoritesGrid.parentNode.insertBefore(searchTip, favoritesGrid);
            }
        }
    }

    // 降级搜索选项
    createFallbackSearch(query) {
        const encodedQuery = encodeURIComponent(query);
        return `
            <div class="external-search-section">
                <div class="external-search-grid">
                    <button class="external-search-btn"
                            onclick="window.open('https://www.baidu.com/s?wd=${encodedQuery}', '_blank')"
                            style="--engine-color: #4285f4">
                        <i class="fas fa-search"></i>
                        <span>百度搜索</span>
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="external-search-btn"
                            onclick="window.open('https://www.google.com/search?q=${encodedQuery}', '_blank')"
                            style="--engine-color: #ea4335">
                        <i class="fab fa-google"></i>
                        <span>Google搜索</span>
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // 显示未登录状态
    showNotLoggedIn() {
        const notLoggedIn = document.getElementById('notLoggedIn');
        const emptyFavorites = document.getElementById('emptyFavorites');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesCount = document.getElementById('favoritesCount');

        if (notLoggedIn) notLoggedIn.style.display = 'block';
        if (emptyFavorites) emptyFavorites.style.display = 'none';
        if (favoritesGrid) favoritesGrid.style.display = 'none';
        if (favoritesCount) favoritesCount.textContent = '0';
    }

    // 显示空收藏状态
    showEmptyFavorites() {
        const emptyFavorites = document.getElementById('emptyFavorites');
        const notLoggedIn = document.getElementById('notLoggedIn');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesCount = document.getElementById('favoritesCount');

        if (emptyFavorites) emptyFavorites.style.display = 'block';
        if (notLoggedIn) notLoggedIn.style.display = 'none';
        if (favoritesGrid) favoritesGrid.style.display = 'none';
        if (favoritesCount) favoritesCount.textContent = '0';
    }

    // 显示消息 - 使用统一通知系统
    showMessage(message, type) {
        if (window.doodleNotify) {
            // 使用统一的通知系统
            if (type === 'success') {
                window.doodleNotify.success(message);
            } else {
                window.doodleNotify.error(message);
            }
        } else {
            // 降级方案：使用统一样式的通知
            const messageEl = document.createElement('div');
            messageEl.className = `doodle-notification doodle-notification-${type === 'success' ? 'success' : 'error'}`;
            messageEl.innerHTML = `
                <div class="doodle-notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
                    <span class="doodle-notification-message">${message}</span>
                </div>
            `;

            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2000;
            `;

            document.body.appendChild(messageEl);

            // 显示动画
            setTimeout(() => {
                messageEl.classList.add('doodle-notification-show');
            }, 10);

            // 3秒后自动移除
            setTimeout(() => {
                messageEl.classList.add('doodle-notification-hide');
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }, 3000);
        }
    }
}

// 创建全局收藏管理器实例
window.favoritesManager = new FavoritesManager();
