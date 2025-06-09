# 🧬 生物信息学导航网站

一个专业的生物信息学工具导航网站，集成了多种生物数据库搜索功能和可视化分析工具。

## ✨ 主要功能

### 🔍 生物数据库搜索
- **PubMed搜索**：医学文献检索与分析
- **Gene数据库**：基因信息查询与可视化
- **Protein数据库**：蛋白质数据检索与分析
- **Nucleotide数据库**：核酸序列搜索与统计

### 📊 数据可视化
- **智能图表生成**：根据数据库类型自动选择合适的可视化方式
- **长度分布分析**：基因、蛋白质、核酸序列长度统计
- **类型分布统计**：科学的生物学分类与统计
- **交互式图表**：支持缩放、平移等交互操作

### 🎯 网站导航
- **分类导航**：按功能分类的生物信息学工具
- **收藏功能**：个人工具收藏管理
- **搜索功能**：快速查找相关工具

### 🐱 特色功能
- **像素猫咪**：可爱的网站吉祥物
- **猫咪验证码**：创新的情感验证系统
- **用户认证**：完整的登录注册系统

## 🛠️ 技术栈

### 前端
- **HTML5/CSS3**：现代化的网页结构与样式
- **JavaScript (ES6+)**：原生JavaScript实现
- **Canvas API**：自定义图表绘制
- **响应式设计**：适配各种设备

### 后端
- **PHP**：服务器端逻辑
- **MySQL**：数据库存储
- **RESTful API**：标准化接口设计

### 数据源
- **NCBI Entrez API**：生物数据库接口
- **实时数据获取**：支持多种HTTP请求方式

## 🚀 快速开始

### 环境要求
- PHP 7.4+
- MySQL 5.7+
- Web服务器 (Apache/Nginx)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/bioinformatics-website.git
cd bioinformatics-website
```

2. **配置数据库**
```bash
# 导入数据库结构
mysql -u your_username -p your_database < sql/create_tables.sql
```

3. **配置后端**
```php
// 编辑 backend/config/database.php
$host = 'localhost';
$dbname = 'your_database';
$username = 'your_username';
$password = 'your_password';
```

4. **启动服务**
```bash
# 使用PHP内置服务器（开发环境）
php -S localhost:8000

# 或部署到Web服务器
```

5. **访问网站**
打开浏览器访问 `http://localhost:8000`

## 📁 项目结构

```
bioinformatics-website/
├── index.html              # 主页
├── about.html              # 关于页面
├── favorites.html          # 收藏页面
├── auth/                   # 用户认证
│   ├── login.html
│   └── register.html
├── entrez/                 # 生物数据库搜索
│   ├── search.html
│   ├── api/
│   ├── css/
│   └── js/
├── css/                    # 样式文件
├── js/                     # JavaScript文件
├── backend/                # 后端API
├── pet/                    # 像素猫咪
└── sql/                    # 数据库文件
```

## 🎨 特色亮点

### 科学的数据可视化
- 基于生物学原理的图表设计
- 智能数据类型识别
- 真实数据分布模拟

### 用户体验优化
- 响应式设计
- 加载进度提示
- 错误处理机制

### 创新功能
- 情感化验证码系统
- 个性化收藏管理
- 多种搜索方式支持

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

- **您的名字** - *初始工作* - [您的GitHub](https://github.com/your-username)

## 🙏 致谢

- NCBI 提供的优秀API服务
- 开源社区的支持与贡献
- 所有测试用户的反馈

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
