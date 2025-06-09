/**
 * 网站内容编辑器
 */

class ContentEditor {
    constructor() {
        this.editor = null;
        this.originalContent = {};
        this.currentContent = {};
        this.hasChanges = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadCurrentContent();
            await this.initEditor();
            this.bindEvents();
            this.populateFields();
            console.log('✅ 内容编辑器初始化完成');
        } catch (error) {
            console.error('❌ 内容编辑器初始化失败:', error);
            this.showMessage('编辑器初始化失败', 'error');
        }
    }
    
    async loadCurrentContent() {
        // 从localStorage加载保存的内容，如果没有则使用默认值
        const saved = localStorage.getItem('websiteContent');
        if (saved) {
            this.currentContent = JSON.parse(saved);
        } else {
            // 默认内容
            this.currentContent = {
                siteTitle: '热门网站工具导航 - 精选优质网站工具',
                siteSubtitle: '生物信息学导航',
                siteDescription: '精选优质网站工具，涵盖AI工具、开发资源、设计素材、学习平台等多个分类。配备可爱AI猫咪桌面助手，温馨手绘风格设计。',
                heroTitle: '发现最好的网站工具',
                heroDescription: '精选全球最优质的网站工具和在线服务，从AI工具到开发资源，助力您的工作和创作',
                statWebsites: 28,
                statWebsitesLabel: '精选网站',
                statCategories: 6,
                statCategoriesLabel: '主要分类',
                statYear: '2025',
                statYearLabel: '最新更新',
                footerTitle: '🌐 全能导航',
                footerDescription: '精选优质网站工具，与可爱的猫咪一起探索互联网的无限可能。',
                copyrightText: '© 2025 全能导航 - 张子豪的作品 (2330416015). 保留所有权利.',
                customContent: ''
            };
        }
        
        // 保存原始内容用于重置
        this.originalContent = JSON.parse(JSON.stringify(this.currentContent));
    }
    
    async initEditor() {
        try {
            this.editor = await ClassicEditor.create(document.querySelector('#customContent'), {
                toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'link', 'bulletedList', 'numberedList', '|',
                    'outdent', 'indent', '|',
                    'insertTable', 'blockQuote', 'horizontalLine', '|',
                    'imageUpload', 'mediaEmbed', '|',
                    'undo', 'redo'
                ],
                language: 'zh-cn',
                placeholder: '在这里编写自定义HTML内容...\n\n您可以添加文字、图片、表格、链接等丰富内容。\n支持标题、列表、引用等多种格式。',
                heading: {
                    options: [
                        { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: '标题 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: '标题 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: '标题 3', class: 'ck-heading_heading3' }
                    ]
                },
                // 设置编辑器高度
                height: 400
            });

            // 监听内容变化
            this.editor.model.document.on('change:data', () => {
                this.onContentChange();
            });

        } catch (error) {
            throw new Error('CKEditor 初始化失败: ' + error.message);
        }
    }
    
    populateFields() {
        // 填充表单字段
        document.getElementById('siteTitle').value = this.currentContent.siteTitle || '';
        document.getElementById('siteSubtitle').value = this.currentContent.siteSubtitle || '';
        document.getElementById('siteDescription').value = this.currentContent.siteDescription || '';
        document.getElementById('heroTitle').value = this.currentContent.heroTitle || '';
        document.getElementById('heroDescription').value = this.currentContent.heroDescription || '';
        document.getElementById('statWebsites').value = this.currentContent.statWebsites || '';
        document.getElementById('statWebsitesLabel').value = this.currentContent.statWebsitesLabel || '';
        document.getElementById('statCategories').value = this.currentContent.statCategories || '';
        document.getElementById('statCategoriesLabel').value = this.currentContent.statCategoriesLabel || '';
        document.getElementById('statYear').value = this.currentContent.statYear || '';
        document.getElementById('statYearLabel').value = this.currentContent.statYearLabel || '';
        document.getElementById('footerTitle').value = this.currentContent.footerTitle || '';
        document.getElementById('footerDescription').value = this.currentContent.footerDescription || '';
        document.getElementById('copyrightText').value = this.currentContent.copyrightText || '';
        
        if (this.editor) {
            this.editor.setData(this.currentContent.customContent || '');
        }
    }
    
    bindEvents() {
        // 折叠/展开区域
        document.querySelectorAll('.toggle-section').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.toggle-section').dataset.target;
                const content = document.getElementById(target);
                const icon = e.target.closest('.toggle-section');
                
                content.classList.toggle('collapsed');
                icon.classList.toggle('collapsed');
            });
        });
        
        // 表单字段变化监听
        const fields = [
            'siteTitle', 'siteSubtitle', 'siteDescription',
            'heroTitle', 'heroDescription',
            'statWebsites', 'statWebsitesLabel', 'statCategories', 'statCategoriesLabel',
            'statYear', 'statYearLabel',
            'footerTitle', 'footerDescription', 'copyrightText'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.onContentChange());
            }
        });
        
        // 按钮事件
        const saveBtn = document.getElementById('saveAllBtn');
        const previewBtn = document.getElementById('previewChangesBtn');
        const resetBtn = document.getElementById('resetChangesBtn');
        const publishBtn = document.getElementById('publishChangesBtn');
        const insertBtn = document.getElementById('insertCustomBtn');
        const previewCustomBtn = document.getElementById('previewCustomBtn');

        if (saveBtn) saveBtn.addEventListener('click', () => this.saveAllChanges());
        if (previewBtn) previewBtn.addEventListener('click', () => this.previewChanges());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetChanges());
        if (publishBtn) publishBtn.addEventListener('click', () => this.publishChanges());
        if (insertBtn) insertBtn.addEventListener('click', () => this.insertCustomContent());
        if (previewCustomBtn) previewCustomBtn.addEventListener('click', () => this.previewCustomContent());
        
        // 模态框事件
        const closePreview = document.getElementById('closePreview');
        const closeCustomPreview = document.getElementById('closeCustomPreview');
        const previewModal = document.getElementById('previewModal');
        const customPreviewModal = document.getElementById('customPreviewModal');

        if (closePreview) closePreview.addEventListener('click', () => this.hidePreview());
        if (closeCustomPreview) closeCustomPreview.addEventListener('click', () => this.hideCustomPreview());

        // 点击模态框背景关闭
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target.id === 'previewModal') this.hidePreview();
            });
        }
        if (customPreviewModal) {
            customPreviewModal.addEventListener('click', (e) => {
                if (e.target.id === 'customPreviewModal') this.hideCustomPreview();
            });
        }
        
        // 页面离开前提醒
        window.addEventListener('beforeunload', (e) => {
            if (this.hasChanges) {
                e.preventDefault();
                e.returnValue = '您有未保存的更改，确定要离开吗？';
                return e.returnValue;
            }
        });
    }
    
    onContentChange() {
        this.hasChanges = true;
        this.updateCurrentContent();
        this.updateStatus('warning', '有未保存的更改');
    }
    
    updateCurrentContent() {
        // 更新当前内容对象
        this.currentContent.siteTitle = document.getElementById('siteTitle').value;
        this.currentContent.siteSubtitle = document.getElementById('siteSubtitle').value;
        this.currentContent.siteDescription = document.getElementById('siteDescription').value;
        this.currentContent.heroTitle = document.getElementById('heroTitle').value;
        this.currentContent.heroDescription = document.getElementById('heroDescription').value;
        this.currentContent.statWebsites = document.getElementById('statWebsites').value;
        this.currentContent.statWebsitesLabel = document.getElementById('statWebsitesLabel').value;
        this.currentContent.statCategories = document.getElementById('statCategories').value;
        this.currentContent.statCategoriesLabel = document.getElementById('statCategoriesLabel').value;
        this.currentContent.statYear = document.getElementById('statYear').value;
        this.currentContent.statYearLabel = document.getElementById('statYearLabel').value;
        this.currentContent.footerTitle = document.getElementById('footerTitle').value;
        this.currentContent.footerDescription = document.getElementById('footerDescription').value;
        this.currentContent.copyrightText = document.getElementById('copyrightText').value;
        
        if (this.editor) {
            this.currentContent.customContent = this.editor.getData();
        }
    }
    
    saveAllChanges() {
        this.updateCurrentContent();

        try {
            // 保存到localStorage
            localStorage.setItem('websiteContent', JSON.stringify(this.currentContent));
            this.hasChanges = false;
            this.updateStatus('success', '所有更改已保存');
            this.showMessage('所有更改已保存', 'success');
        } catch (error) {
            console.error('保存失败:', error);
            this.updateStatus('error', '保存失败');
            this.showMessage('保存失败: ' + error.message, 'error');
        }
    }

    updateStatus(type, message) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');

        if (statusIndicator && statusText) {
            statusIndicator.className = `fas fa-circle status-indicator ${type}`;
            statusText.textContent = message;
        }
    }
    
    resetChanges() {
        if (!confirm('确定要重置所有更改吗？这将丢失所有未保存的修改。')) {
            return;
        }
        
        this.currentContent = JSON.parse(JSON.stringify(this.originalContent));
        this.populateFields();
        this.hasChanges = false;
        this.showMessage('所有更改已重置', 'info');
    }
    
    publishChanges() {
        this.updateCurrentContent();
        
        try {
            // 应用更改到实际网站
            this.applyChangesToWebsite();
            this.saveAllChanges();
            this.showMessage('更改已发布到网站', 'success');
        } catch (error) {
            console.error('发布失败:', error);
            this.showMessage('发布失败: ' + error.message, 'error');
        }
    }
    
    applyChangesToWebsite() {
        // 这里应该调用后端API来更新网站内容
        // 目前使用localStorage模拟
        localStorage.setItem('publishedContent', JSON.stringify(this.currentContent));
        
        // 通知主页更新内容
        if (window.opener) {
            window.opener.postMessage({
                type: 'contentUpdate',
                content: this.currentContent
            }, '*');
        }
    }
    
    previewChanges() {
        this.updateCurrentContent();
        
        // 临时保存预览内容
        localStorage.setItem('previewContent', JSON.stringify(this.currentContent));
        
        // 显示预览模态框
        document.getElementById('previewModal').style.display = 'block';
        
        // 刷新预览iframe
        const iframe = document.getElementById('previewFrame');
        iframe.src = '../index.html?preview=true&t=' + Date.now();
    }
    
    hidePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }
    
    insertCustomContent() {
        if (!this.editor) {
            this.showMessage('编辑器未初始化', 'error');
            return;
        }
        
        const content = this.editor.getData();
        if (!content.trim()) {
            this.showMessage('请先编写自定义内容', 'warning');
            return;
        }
        
        // 这里可以实现将自定义内容插入到主页的逻辑
        this.showMessage('自定义内容已准备插入', 'info');
    }
    
    previewCustomContent() {
        if (!this.editor) {
            this.showMessage('编辑器未初始化', 'error');
            return;
        }
        
        const content = this.editor.getData();
        document.getElementById('customPreviewContent').innerHTML = content;
        document.getElementById('customPreviewModal').style.display = 'block';
    }
    
    hideCustomPreview() {
        document.getElementById('customPreviewModal').style.display = 'none';
    }
    
    exitAdmin() {
        if (this.hasChanges) {
            if (!confirm('您有未保存的更改，确定要退出编辑模式吗？')) {
                return;
            }
        }
        
        window.location.href = '../index.html';
    }
    
    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 4000;
            animation: slideIn 0.3s ease;
        `;
        
        switch (type) {
            case 'success':
                messageDiv.style.background = '#10b981';
                break;
            case 'error':
                messageDiv.style.background = '#ef4444';
                break;
            case 'warning':
                messageDiv.style.background = '#f59e0b';
                break;
            default:
                messageDiv.style.background = '#3b82f6';
        }
        
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}"></i> ${message}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// 全局变量
let contentEditor;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    contentEditor = new ContentEditor();

    // 初始化AOS动画
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // 初始化主题
    initTheme();

    // 绑定主题切换
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// 主题相关函数
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleText(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleText(newTheme);
}

function updateThemeToggleText(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> 浅色模式';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> 深色模式';
        }
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
