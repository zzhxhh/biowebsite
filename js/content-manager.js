/**
 * 网站内容管理器
 * 负责动态更新网站内容
 */

class ContentManager {
    constructor() {
        this.currentContent = null;
        this.isPreviewMode = false;
        this.init();
    }
    
    init() {
        // 检查是否为预览模式
        const urlParams = new URLSearchParams(window.location.search);
        this.isPreviewMode = urlParams.has('preview');
        
        // 加载内容
        this.loadContent();
        
        // 监听来自编辑器的消息
        window.addEventListener('message', (event) => {
            if (event.data.type === 'contentUpdate') {
                this.updateContent(event.data.content);
            }
        });
        
        // 页面加载完成后应用内容
        document.addEventListener('DOMContentLoaded', () => {
            this.applyContent();
        });
    }
    
    loadContent() {
        try {
            let contentKey = 'publishedContent';
            
            // 预览模式使用预览内容
            if (this.isPreviewMode) {
                contentKey = 'previewContent';
            }
            
            const saved = localStorage.getItem(contentKey);
            if (saved) {
                this.currentContent = JSON.parse(saved);
                console.log('✅ 内容加载成功:', this.isPreviewMode ? '预览模式' : '正式模式');
            } else {
                console.log('ℹ️ 未找到保存的内容，使用默认内容');
            }
        } catch (error) {
            console.error('❌ 内容加载失败:', error);
        }
    }
    
    updateContent(newContent) {
        this.currentContent = newContent;
        this.applyContent();
        console.log('✅ 内容已更新');
    }
    
    applyContent() {
        if (!this.currentContent) {
            return;
        }
        
        try {
            // 更新页面标题
            if (this.currentContent.siteTitle) {
                document.title = this.currentContent.siteTitle;
            }
            
            // 更新meta描述
            if (this.currentContent.siteDescription) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', this.currentContent.siteDescription);
                }
            }
            
            // 更新头部横幅
            this.updateHeroSection();
            
            // 更新统计数据
            this.updateStats();
            
            // 更新页脚
            this.updateFooter();
            
            // 插入自定义内容
            this.insertCustomContent();
            
            // 添加预览模式标识
            if (this.isPreviewMode) {
                this.addPreviewBanner();
            }
            
            console.log('✅ 页面内容应用完成');
            
        } catch (error) {
            console.error('❌ 内容应用失败:', error);
        }
    }
    
    updateHeroSection() {
        // 更新主标题
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && this.currentContent.heroTitle) {
            heroTitle.textContent = this.currentContent.heroTitle;
        }
        
        // 更新描述
        const heroDesc = document.querySelector('.hero p');
        if (heroDesc && this.currentContent.heroDescription) {
            heroDesc.textContent = this.currentContent.heroDescription;
        }
    }
    
    updateStats() {
        const stats = document.querySelectorAll('.stat');
        
        if (stats.length >= 3) {
            // 更新网站数量
            if (this.currentContent.statWebsites) {
                const websiteStat = stats[0];
                const number = websiteStat.querySelector('.stat-number');
                const label = websiteStat.querySelector('.stat-label');
                if (number) number.textContent = this.currentContent.statWebsites;
                if (label && this.currentContent.statWebsitesLabel) {
                    label.textContent = this.currentContent.statWebsitesLabel;
                }
            }
            
            // 更新分类数量
            if (this.currentContent.statCategories) {
                const categoryStat = stats[1];
                const number = categoryStat.querySelector('.stat-number');
                const label = categoryStat.querySelector('.stat-label');
                if (number) number.textContent = this.currentContent.statCategories;
                if (label && this.currentContent.statCategoriesLabel) {
                    label.textContent = this.currentContent.statCategoriesLabel;
                }
            }
            
            // 更新年份
            if (this.currentContent.statYear) {
                const yearStat = stats[2];
                const number = yearStat.querySelector('.stat-number');
                const label = yearStat.querySelector('.stat-label');
                if (number) number.textContent = this.currentContent.statYear;
                if (label && this.currentContent.statYearLabel) {
                    label.textContent = this.currentContent.statYearLabel;
                }
            }
        }
    }
    
    updateFooter() {
        // 更新页脚标题
        const footerTitle = document.querySelector('.footer-section h3');
        if (footerTitle && this.currentContent.footerTitle) {
            footerTitle.textContent = this.currentContent.footerTitle;
        }
        
        // 更新页脚描述
        const footerDesc = document.querySelector('.footer-section p');
        if (footerDesc && this.currentContent.footerDescription) {
            footerDesc.textContent = this.currentContent.footerDescription;
        }
        
        // 更新版权信息
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright && this.currentContent.copyrightText) {
            copyright.textContent = this.currentContent.copyrightText;
        }
    }
    
    insertCustomContent() {
        if (!this.currentContent.customContent || !this.currentContent.customContent.trim()) {
            return;
        }
        
        // 查找或创建自定义内容容器
        let customContainer = document.getElementById('customContentContainer');
        if (!customContainer) {
            customContainer = document.createElement('section');
            customContainer.id = 'customContentContainer';
            customContainer.className = 'custom-content-section';
            customContainer.style.cssText = `
                padding: 40px 0;
                background: var(--surface-color);
                margin: 20px 0;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            `;
            
            // 插入到工具区域之前
            const toolsSection = document.querySelector('.tools-section');
            if (toolsSection) {
                toolsSection.parentNode.insertBefore(customContainer, toolsSection);
            }
        }
        
        // 更新自定义内容
        customContainer.innerHTML = `
            <div class="container">
                <div class="custom-content-wrapper" style="padding: 20px;">
                    ${this.currentContent.customContent}
                </div>
            </div>
        `;
    }
    
    addPreviewBanner() {
        // 添加预览模式横幅
        let previewBanner = document.getElementById('previewBanner');
        if (!previewBanner) {
            previewBanner = document.createElement('div');
            previewBanner.id = 'previewBanner';
            previewBanner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                text-align: center;
                padding: 10px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            `;
            previewBanner.innerHTML = `
                <i class="fas fa-eye"></i>
                预览模式 - 这些更改尚未发布到正式网站
                <button onclick="window.close()" style="margin-left: 20px; background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-times"></i> 关闭预览
                </button>
            `;
            
            document.body.appendChild(previewBanner);
            
            // 调整页面顶部边距
            document.body.style.paddingTop = '50px';
        }
    }
    
    // 管理员快速编辑入口已移除，统一使用导航栏管理员按钮
    addAdminEntry() {
        // 不再添加右下角按钮，保持界面简洁
        console.log('✅ 管理员模式已启用，请使用导航栏的管理员按钮');
    }
}

// 初始化内容管理器
const contentManager = new ContentManager();

// 导出供其他脚本使用
window.contentManager = contentManager;

// 添加动画样式
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
