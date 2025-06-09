// 全能网站导航数据
const websitesDetail = [
    // 🌟 自主开发工具 - 优先展示
    {
        id: 24,
        name: "生物信息检索",
        category: "utility",
        description: "🏆 自主开发的专业生物信息数据库搜索工具，基于NCBI Entrez，支持多种数据库检索。",
        detailedDescription: "这是我们完全自主开发的专业生物信息检索工具，集成NCBI Entrez数据库，支持PubMed文献、Gene基因、Protein蛋白质等多个数据库的搜索。提供可视化图表展示搜索结果，支持交互式数据浏览。具有GET、POST、SESSION三种搜索方式，展示了完整的前后端开发技术。",
        url: "entrez/search.html",
        icon: "fas fa-dna",
        pricing: "free",
        featured: true,
        selfDeveloped: true, // 标识为自主开发
        priority: 1, // 最高优先级
        features: ["多数据库支持", "XML数据解析", "可视化图表", "交互式结果", "实时搜索", "数据导出", "三种搜索方式", "响应式设计"],
        useCases: ["学术研究：文献检索、基因查找", "生物信息：蛋白质分析、序列搜索", "医学研究：疾病相关研究", "教学演示：生物信息学教学"],
        pros: ["完全自主开发", "数据权威可靠", "搜索功能强大", "结果可视化", "操作简单直观", "技术实现完整"],
        cons: ["需要网络连接", "英文数据库为主", "专业性较强"],
        pricingDetails: {
            free: { name: "完全免费", price: "免费", features: ["无限搜索", "所有数据库", "可视化图表", "数据导出", "源码开放"] }
        },
        rating: 4.9,
        reviews: 1250,
        tags: ["自主开发", "生物信息", "数据库检索", "学术研究", "NCBI", "可视化"]
    },

    // AI工具分类 (5个)
    {
        id: 1,
        name: "ChatGPT",
        category: "ai",
        description: "OpenAI开发的强大对话AI，能够进行自然语言对话、回答问题、协助写作等。",
        detailedDescription: "ChatGPT是OpenAI开发的基于GPT架构的大型语言模型，具有强大的自然语言理解和生成能力。它可以进行多轮对话，回答各种问题，协助写作、编程、分析等多种任务。",
        url: "https://chat.openai.com",
        icon: "fas fa-comments",
        pricing: "freemium",
        featured: true,
        features: ["自然语言对话", "多轮上下文理解", "代码生成和调试", "文本创作和编辑", "问题解答和分析", "多语言支持"],
        useCases: ["内容创作：博客文章、营销文案", "编程助手：代码生成、调试", "学习辅导：概念解释、习题解答", "工作效率：邮件撰写、会议纪要"],
        pros: ["回答质量高，逻辑清晰", "支持多种语言和领域", "界面简洁易用", "响应速度快"],
        cons: ["知识截止时间有限制", "无法访问实时信息", "偶尔会产生不准确信息"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["GPT-4.1 mini模型", "实时网络搜索", "有限的GPT-4o访问"] },
            plus: { name: "ChatGPT Plus", price: "$20/月", features: ["扩展的GPT-4o访问", "高级语音模式", "深度研究功能"] }
        },
        rating: 4.6,
        reviews: 15420,
        tags: ["对话AI", "文本生成", "编程助手", "OpenAI"]
    },
    {
        id: 2,
        name: "Claude",
        category: "ai",
        description: "Anthropic开发的AI助手，擅长分析、写作和复杂推理任务。",
        detailedDescription: "Claude是Anthropic开发的AI助手，基于Constitutional AI技术构建，注重安全性和有用性。Claude在长文本处理、复杂推理、代码分析等方面表现出色。",
        url: "https://claude.ai",
        icon: "fas fa-brain",
        pricing: "freemium",
        featured: true,
        features: ["长文本处理能力强", "复杂推理和分析", "代码理解和生成", "文档分析和总结", "安全可靠的回答", "支持文件上传"],
        useCases: ["学术研究：论文分析、文献综述", "商业分析：市场报告、数据分析", "技术文档：代码审查、技术方案", "法律文书：合同分析、法律条文解读"],
        pros: ["长文本处理能力出众", "推理逻辑严谨", "安全性和可靠性高", "支持文件上传分析"],
        cons: ["响应速度相对较慢", "免费版使用次数有限", "在创意任务上不如ChatGPT"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础Claude模型", "有限使用次数", "标准功能"] },
            pro: { name: "Claude Pro", price: "$20/月", features: ["Claude-3.5 Sonnet模型", "5倍更多使用量", "优先访问"] }
        },
        rating: 4.4,
        reviews: 8930,
        tags: ["AI助手", "文本分析", "推理", "Anthropic"]
    },
    {
        id: 3,
        name: "Midjourney",
        category: "ai",
        description: "领先的AI图像生成工具，能创造出令人惊叹的艺术作品和插图。",
        detailedDescription: "Midjourney是目前最受欢迎的AI图像生成工具之一，以其出色的艺术风格和创意表现力著称。通过简单的文本描述，能够生成高质量、富有创意的图像。",
        url: "https://midjourney.com",
        icon: "fas fa-palette",
        pricing: "premium",
        featured: true,
        features: ["高质量图像生成", "多种艺术风格", "风格一致性控制", "图像变体生成", "高分辨率输出", "商业使用授权"],
        useCases: ["艺术创作：概念艺术、插画", "设计工作：Logo设计、海报", "营销材料：广告图片、社交媒体内容", "游戏开发：角色设计、场景概念图"],
        pros: ["图像质量极高", "艺术风格多样", "创意表现力强", "社区活跃"],
        cons: ["需要付费订阅", "需要通过Discord使用", "生成速度有限制", "学习曲线较陡峭"],
        pricingDetails: {
            basic: { name: "基础计划", price: "$10/月", features: ["3.3小时快速GPU时间", "Discord私信使用", "商业使用权"] },
            standard: { name: "标准计划", price: "$30/月", features: ["15小时快速GPU", "无限放松模式", "3个并发任务"] }
        },
        rating: 4.7,
        reviews: 23150,
        tags: ["图像生成", "AI艺术", "创意设计", "Discord"]
    },
    {
        id: 4,
        name: "GitHub Copilot",
        category: "ai",
        description: "AI编程助手，提供智能代码补全和编程建议。",
        detailedDescription: "GitHub Copilot是由GitHub和OpenAI联合开发的AI编程助手，基于大量开源代码训练。它能够理解代码上下文，提供智能的代码补全、函数生成和编程建议。",
        url: "https://github.com/features/copilot",
        icon: "fab fa-github",
        pricing: "freemium",
        featured: true,
        features: ["智能代码补全", "多语言支持", "上下文理解", "函数生成", "代码注释生成", "IDE深度集成"],
        useCases: ["日常编程：代码补全、函数实现", "学习编程：代码示例、最佳实践", "项目开发：快速原型、重复代码生成", "代码重构：优化建议、模式识别"],
        pros: ["代码质量高", "支持多种编程语言", "IDE集成度好", "学习成本低"],
        cons: ["需要付费订阅", "偶尔生成不准确代码", "依赖网络连接", "可能产生版权争议"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["2000次代码补全/月", "50条聊天消息/月", "基础模型"] },
            pro: { name: "专业版", price: "$10/月", features: ["无限代码补全", "无限聊天", "高级模型访问"] }
        },
        rating: 4.5,
        reviews: 18750,
        tags: ["编程助手", "代码补全", "GitHub", "OpenAI"]
    },
    {
        id: 5,
        name: "Gemini",
        category: "ai",
        description: "Google开发的多模态AI助手，支持文本、图像和代码理解。",
        detailedDescription: "Gemini是Google开发的先进AI模型，具备强大的多模态理解能力，可以处理文本、图像、音频等多种类型的输入，提供全面的AI助手服务。",
        url: "https://gemini.google.com",
        icon: "fab fa-google",
        pricing: "freemium",
        featured: true,
        features: ["多模态理解", "图像分析", "代码生成", "实时信息", "Google服务集成", "多语言支持"],
        useCases: ["多媒体分析：图像理解、文档分析", "编程助手：代码生成、调试", "学习辅导：概念解释、问题解答", "信息查询：实时搜索、数据分析"],
        pros: ["多模态能力强", "与Google服务集成", "实时信息访问", "免费版功能丰富"],
        cons: ["相对较新", "某些功能仍在完善", "隐私考虑"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础Gemini模型", "有限使用次数", "标准功能"] },
            advanced: { name: "Gemini Advanced", price: "$20/月", features: ["Gemini Ultra模型", "更多使用次数", "优先访问"] }
        },
        rating: 4.3,
        reviews: 12500,
        tags: ["多模态AI", "Google", "图像理解", "实时信息"]
    },

    // 开发设计分类 (5个)
    {
        id: 6,
        name: "GitHub",
        category: "development",
        description: "全球最大的代码托管平台，提供版本控制、协作开发和项目管理功能。",
        detailedDescription: "GitHub是基于Git的代码托管平台，为开发者提供代码存储、版本控制、协作开发、项目管理等全方位服务。拥有庞大的开源社区和丰富的开发工具生态。",
        url: "https://github.com",
        icon: "fab fa-github",
        pricing: "freemium",
        featured: true,
        features: ["代码托管", "版本控制", "协作开发", "项目管理", "CI/CD", "开源社区"],
        useCases: ["代码托管：个人项目、团队协作", "开源贡献：参与开源项目", "项目管理：Issue跟踪、里程碑", "自动化：GitHub Actions"],
        pros: ["功能强大完善", "社区活跃", "集成度高", "免费版功能丰富"],
        cons: ["私有仓库有限制", "学习曲线较陡", "国内访问可能较慢"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["无限公开仓库", "有限私有仓库", "基础功能"] },
            pro: { name: "专业版", price: "$4/月", features: ["无限私有仓库", "高级功能", "优先支持"] }
        },
        rating: 4.8,
        reviews: 45000,
        tags: ["代码托管", "版本控制", "开源", "协作开发"]
    },
    {
        id: 7,
        name: "Figma",
        category: "development",
        description: "现代化的协作设计工具，支持UI/UX设计、原型制作和团队协作。",
        detailedDescription: "Figma是基于浏览器的设计工具，支持实时协作、组件系统、原型制作等功能。被广泛用于UI/UX设计、产品设计和团队协作。",
        url: "https://figma.com",
        icon: "fab fa-figma",
        pricing: "freemium",
        featured: true,
        features: ["实时协作", "组件系统", "原型制作", "设计系统", "插件生态", "云端同步"],
        useCases: ["UI设计：网站、App界面设计", "原型制作：交互原型、用户流程", "团队协作：设计评审、版本管理", "设计系统：组件库、规范制定"],
        pros: ["协作功能强大", "界面现代化", "插件丰富", "云端同步"],
        cons: ["需要网络连接", "复杂项目性能有限", "离线功能受限"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["3个项目", "无限个人文件", "基础功能"] },
            professional: { name: "专业版", price: "$12/月", features: ["无限项目", "团队协作", "高级功能"] }
        },
        rating: 4.6,
        reviews: 28000,
        tags: ["UI设计", "协作工具", "原型制作", "设计系统"]
    },
    {
        id: 8,
        name: "Stack Overflow",
        category: "development",
        description: "全球最大的程序员问答社区，解决编程问题的首选平台。",
        detailedDescription: "Stack Overflow是面向程序员的问答网站，拥有庞大的技术问题数据库和活跃的开发者社区。无论遇到什么编程问题，都能在这里找到答案或获得帮助。",
        url: "https://stackoverflow.com",
        icon: "fab fa-stack-overflow",
        pricing: "free",
        featured: true,
        features: ["技术问答", "代码示例", "专家解答", "声誉系统", "标签分类", "搜索功能"],
        useCases: ["问题求助：编程错误、技术难题", "知识学习：最佳实践、代码示例", "技术讨论：算法、架构设计", "职业发展：技能提升、经验分享"],
        pros: ["问题覆盖面广", "答案质量高", "搜索功能强大", "完全免费"],
        cons: ["新手门槛较高", "问题重复率高", "回答质量参差不齐"],
        pricingDetails: {
            free: { name: "免费使用", price: "免费", features: ["无限制访问", "提问回答", "搜索功能", "社区参与"] }
        },
        rating: 4.5,
        reviews: 32000,
        tags: ["程序员", "问答社区", "技术支持", "编程学习"]
    },
    {
        id: 9,
        name: "Unsplash",
        category: "development",
        description: "高质量免费图片素材库，提供数百万张专业摄影作品。",
        detailedDescription: "Unsplash是全球最大的免费高质量图片库之一，由专业摄影师和创作者贡献内容。所有图片都可免费用于商业和个人项目。",
        url: "https://unsplash.com",
        icon: "fas fa-camera",
        pricing: "free",
        featured: true,
        features: ["高质量图片", "免费商用", "分类丰富", "搜索功能", "API接口", "创作者社区"],
        useCases: ["网站设计：背景图、配图", "营销材料：海报、广告", "社交媒体：内容配图", "演示文稿：PPT背景"],
        pros: ["完全免费", "图片质量高", "分类齐全", "下载方便"],
        cons: ["热门图片使用率高", "需要注意版权", "搜索结果有限"],
        pricingDetails: {
            free: { name: "免费使用", price: "免费", features: ["无限下载", "商业使用", "高分辨率", "API访问"] }
        },
        rating: 4.7,
        reviews: 18500,
        tags: ["免费图片", "摄影作品", "设计素材", "商业使用"]
    },
    {
        id: 10,
        name: "CodePen",
        category: "development",
        description: "前端代码在线编辑器和社区平台，展示和分享代码作品。",
        detailedDescription: "CodePen是面向前端开发者的在线代码编辑器和社区平台，支持HTML、CSS、JavaScript的实时预览和编辑。开发者可以在这里创建、分享和发现优秀的前端代码作品。",
        url: "https://codepen.io",
        icon: "fab fa-codepen",
        pricing: "freemium",
        featured: true,
        features: ["在线代码编辑", "实时预览", "代码分享", "社区展示", "协作功能", "模板库"],
        useCases: ["前端开发：快速原型、代码测试", "学习交流：代码示例、技术分享", "作品展示：个人作品集、创意展示", "教学演示：代码教学、概念演示"],
        pros: ["使用简单便捷", "社区活跃", "作品质量高", "学习资源丰富"],
        cons: ["主要面向前端", "免费版功能有限", "复杂项目支持有限"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["公开Pen", "基础功能", "社区访问"] },
            pro: { name: "专业版", price: "$12/月", features: ["私有Pen", "高级功能", "无广告", "协作功能"] }
        },
        rating: 4.4,
        reviews: 15200,
        tags: ["前端开发", "在线编辑器", "代码分享", "社区平台"]
    },

    // 学习办公分类 (5个)
    {
        id: 11,
        name: "Coursera",
        category: "learning",
        description: "全球领先的在线学习平台，提供大学课程和专业认证。",
        detailedDescription: "Coursera与全球顶尖大学和公司合作，提供高质量的在线课程、专业证书和学位项目。涵盖技术、商业、艺术等多个领域。",
        url: "https://coursera.org",
        icon: "fas fa-graduation-cap",
        pricing: "freemium",
        featured: true,
        features: ["大学课程", "专业认证", "学位项目", "实践项目", "同伴评议", "移动学习"],
        useCases: ["技能提升：编程、数据科学", "职业发展：MBA、专业认证", "兴趣学习：艺术、历史", "学术深造：大学学位"],
        pros: ["课程质量高", "证书权威", "内容丰富", "灵活学习"],
        cons: ["部分课程收费", "英文为主", "时间投入较大"],
        pricingDetails: {
            free: { name: "免费课程", price: "免费", features: ["部分课程免费", "基础功能", "社区讨论"] },
            plus: { name: "Coursera Plus", price: "$59/月", features: ["无限访问课程", "专业证书", "学位项目"] }
        },
        rating: 4.5,
        reviews: 25000,
        tags: ["在线教育", "大学课程", "专业认证", "技能提升"]
    },
    {
        id: 12,
        name: "Zoom",
        category: "learning",
        description: "专业的视频会议平台，支持远程办公和在线协作。",
        detailedDescription: "Zoom是领先的视频通信平台，提供高质量的视频会议、网络研讨会、电话和聊天功能。广泛用于远程办公、在线教育和商务沟通。",
        url: "https://zoom.us",
        icon: "fas fa-video",
        pricing: "freemium",
        featured: true,
        features: ["视频会议", "屏幕共享", "录制功能", "虚拟背景", "分组讨论", "网络研讨会"],
        useCases: ["远程办公：团队会议、项目讨论", "在线教育：网课、培训", "商务沟通：客户会议、产品演示", "社交聚会：家庭聚会、朋友聊天"],
        pros: ["视频质量高", "功能丰富", "稳定可靠", "易于使用"],
        cons: ["免费版有时间限制", "安全性曾受质疑", "网络要求较高"],
        pricingDetails: {
            basic: { name: "基础版", price: "免费", features: ["40分钟群组会议", "无限一对一会议", "基础功能"] },
            pro: { name: "专业版", price: "$14.99/月", features: ["无限群组会议", "云录制", "管理功能"] }
        },
        rating: 4.4,
        reviews: 35000,
        tags: ["视频会议", "远程办公", "在线教育", "商务沟通"]
    },
    {
        id: 13,
        name: "Khan Academy",
        category: "learning",
        description: "免费的在线教育平台，提供从小学到大学的全面课程。",
        detailedDescription: "Khan Academy致力于为全世界提供免费的世界级教育。平台涵盖数学、科学、编程、历史、艺术等多个学科，适合各个年龄段的学习者。",
        url: "https://khanacademy.org",
        icon: "fas fa-book",
        pricing: "free",
        featured: true,
        features: ["免费教育", "个性化学习", "练习题库", "进度跟踪", "多语言支持", "移动应用"],
        useCases: ["基础教育：数学、科学基础", "编程学习：JavaScript、Python", "考试准备：SAT、GMAT", "兴趣学习：艺术史、经济学"],
        pros: ["完全免费", "内容系统化", "适合自学", "质量可靠"],
        cons: ["深度有限", "主要面向基础教育", "互动性一般"],
        pricingDetails: {
            free: { name: "完全免费", price: "免费", features: ["所有课程", "练习题库", "进度跟踪", "无广告"] }
        },
        rating: 4.6,
        reviews: 35000,
        tags: ["免费教育", "基础学习", "数学科学", "编程入门"]
    },
    {
        id: 14,
        name: "Slack",
        category: "learning",
        description: "现代化的团队沟通平台，提升团队协作效率。",
        detailedDescription: "Slack是专为团队设计的沟通和协作平台，通过频道、直接消息和集成应用，帮助团队更好地组织工作、分享信息和协作完成项目。",
        url: "https://slack.com",
        icon: "fab fa-slack",
        pricing: "freemium",
        featured: true,
        features: ["频道沟通", "直接消息", "文件分享", "应用集成", "搜索功能", "语音通话"],
        useCases: ["团队沟通：日常交流、项目讨论", "文件协作：文档分享、版本管理", "工作流程：任务分配、进度跟踪", "知识管理：信息存档、搜索查找"],
        pros: ["组织结构清晰", "集成应用丰富", "搜索功能强大", "移动端体验好"],
        cons: ["免费版功能有限", "消息过多时难以管理", "学习成本较高"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["10,000条消息历史", "10个应用集成", "基础功能"] },
            pro: { name: "专业版", price: "$6.67/月/用户", features: ["无限消息历史", "无限应用集成", "高级功能"] }
        },
        rating: 4.3,
        reviews: 28000,
        tags: ["团队沟通", "协作平台", "工作流程", "企业应用"]
    },
    {
        id: 15,
        name: "LinkedIn",
        category: "learning",
        description: "专业的职场社交网络，连接全球商务人士。",
        detailedDescription: "LinkedIn是全球最大的职业社交网络，专注于商务和职业发展。用户可以建立专业档案、扩展人脉、寻找工作机会和分享行业见解。",
        url: "https://linkedin.com",
        icon: "fab fa-linkedin",
        pricing: "freemium",
        featured: true,
        features: ["专业档案", "人脉网络", "职位搜索", "行业资讯", "技能认证", "公司页面"],
        useCases: ["职业发展：求职、跳槽、晋升", "人脉建设：行业联系、商务合作", "知识学习：行业趋势、专业技能", "品牌建设：个人品牌、公司宣传"],
        pros: ["专业性强", "人脉价值高", "求职资源丰富", "行业权威性"],
        cons: ["免费功能有限", "商业化程度高", "信息噪音较多"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础档案", "有限搜索", "基础消息"] },
            premium: { name: "Premium", price: "$29.99/月", features: ["高级搜索", "InMail消息", "学习课程"] }
        },
        rating: 4.2,
        reviews: 32000,
        tags: ["职场社交", "专业网络", "求职招聘", "商务合作"]
    },

    // 娱乐社交分类 (4个)
    {
        id: 16,
        name: "YouTube",
        category: "entertainment",
        description: "全球最大的视频分享平台，提供海量视频内容和创作工具。",
        detailedDescription: "YouTube是Google旗下的视频分享平台，用户可以上传、观看、分享视频内容。平台涵盖教育、娱乐、音乐、游戏等各个领域，是全球最受欢迎的视频网站。",
        url: "https://youtube.com",
        icon: "fab fa-youtube",
        pricing: "freemium",
        featured: true,
        features: ["视频观看", "内容创作", "直播功能", "社区互动", "订阅系统", "移动应用"],
        useCases: ["娱乐观看：电影、音乐、搞笑视频", "学习教育：教程、讲座、技能学习", "内容创作：视频制作、频道运营", "商业推广：品牌宣传、产品展示"],
        pros: ["内容丰富多样", "免费观看", "创作者友好", "全球覆盖"],
        cons: ["广告较多", "算法推荐有偏向", "版权问题"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["观看视频", "上传视频", "基础功能", "有广告"] },
            premium: { name: "YouTube Premium", price: "$11.99/月", features: ["无广告", "后台播放", "离线下载", "YouTube Music"] }
        },
        rating: 4.4,
        reviews: 50000,
        tags: ["视频平台", "内容创作", "娱乐", "教育"]
    },
    {
        id: 17,
        name: "Spotify",
        category: "entertainment",
        description: "全球领先的音乐流媒体平台，提供海量音乐和播客内容。",
        detailedDescription: "Spotify是全球最大的音乐流媒体服务之一，提供数千万首歌曲、播客和有声读物。支持个性化推荐、离线下载和社交分享功能。",
        url: "https://spotify.com",
        icon: "fab fa-spotify",
        pricing: "freemium",
        featured: true,
        features: ["音乐流媒体", "个性化推荐", "播客内容", "离线下载", "社交分享", "跨平台同步"],
        useCases: ["音乐欣赏：各种风格音乐", "播客收听：新闻、教育、娱乐", "健身运动：运动音乐、节奏控制", "工作学习：背景音乐、专注音乐"],
        pros: ["音乐库庞大", "推荐算法优秀", "界面设计好", "跨平台支持"],
        cons: ["免费版有限制", "部分地区内容受限", "需要网络连接"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["有限跳过", "广告", "随机播放"] },
            premium: { name: "Premium", price: "$9.99/月", features: ["无广告", "离线下载", "无限跳过", "高音质"] }
        },
        rating: 4.5,
        reviews: 42000,
        tags: ["音乐流媒体", "播客", "娱乐", "个性化推荐"]
    },
    {
        id: 18,
        name: "Twitter",
        category: "entertainment",
        description: "全球实时信息分享平台，获取最新资讯和观点。",
        detailedDescription: "Twitter（现X）是全球性的社交媒体平台，用户可以发布和阅读短消息（推文）。平台以实时性著称，是获取新闻、观点和趋势的重要渠道。",
        url: "https://twitter.com",
        icon: "fab fa-twitter",
        pricing: "freemium",
        featured: true,
        features: ["实时推文", "话题标签", "转发评论", "直播功能", "列表管理", "趋势话题"],
        useCases: ["新闻获取：实时资讯、突发事件", "观点交流：思想分享、讨论辩论", "品牌营销：产品推广、客户服务", "网络社交：关注名人、结识同好"],
        pros: ["信息实时性强", "影响力大", "话题丰富", "全球覆盖"],
        cons: ["信息质量参差不齐", "容易产生争议", "字数限制"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础功能", "发布推文", "关注用户"] },
            premium: { name: "Twitter Blue", price: "$8/月", features: ["编辑推文", "更长视频", "优先支持"] }
        },
        rating: 4.1,
        reviews: 38000,
        tags: ["社交媒体", "实时资讯", "观点分享", "全球平台"]
    },
    {
        id: 19,
        name: "Reddit",
        category: "entertainment",
        description: "全球最大的社区讨论平台，汇聚各种兴趣话题。",
        detailedDescription: "Reddit是一个大型的社区讨论网站，用户可以在各种主题的子版块（subreddit）中分享内容、讨论话题。平台以其多样化的社区和民主化的内容评级系统而闻名。",
        url: "https://reddit.com",
        icon: "fab fa-reddit",
        pricing: "freemium",
        featured: true,
        features: ["社区讨论", "内容投票", "子版块系统", "AMA问答", "实时聊天", "奖励系统"],
        useCases: ["兴趣交流：各种爱好、专业话题", "新闻讨论：时事评论、深度分析", "知识学习：专业知识、经验分享", "娱乐休闲：搞笑内容、创意分享"],
        pros: ["社区多样化", "内容质量高", "讨论深入", "匿名性好"],
        cons: ["界面相对复杂", "新手门槛较高", "部分内容质量参差不齐"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础功能", "社区参与", "内容浏览"] },
            premium: { name: "Reddit Premium", price: "$5.99/月", features: ["无广告", "高级功能", "专属徽章", "金币奖励"] }
        },
        rating: 4.2,
        reviews: 28500,
        tags: ["社区讨论", "兴趣分享", "新闻评论", "知识交流"]
    },

    // 效率工具分类 (4个)
    {
        id: 20,
        name: "Notion",
        category: "productivity",
        description: "全能的工作空间，集笔记、数据库、项目管理于一体。",
        detailedDescription: "Notion是一个多功能的生产力工具，可以用作笔记应用、数据库、项目管理工具、知识库等。其灵活的块状结构让用户可以创建个性化的工作流程。",
        url: "https://notion.so",
        icon: "fas fa-sticky-note",
        pricing: "freemium",
        featured: true,
        features: ["块状编辑", "数据库功能", "模板系统", "团队协作", "API集成", "多平台同步"],
        useCases: ["个人笔记：知识管理、日记", "项目管理：任务跟踪、进度管理", "团队协作：文档共享、知识库", "内容创作：博客写作、资料整理"],
        pros: ["功能强大灵活", "模板丰富", "协作便利", "界面美观"],
        cons: ["学习曲线较陡", "复杂功能性能有限", "移动端体验一般"],
        pricingDetails: {
            free: { name: "个人版", price: "免费", features: ["无限页面", "基础功能", "个人使用"] },
            pro: { name: "专业版", price: "$8/月", features: ["无限文件上传", "版本历史", "高级权限"] }
        },
        rating: 4.4,
        reviews: 22000,
        tags: ["笔记应用", "项目管理", "知识库", "团队协作"]
    },
    {
        id: 21,
        name: "Trello",
        category: "productivity",
        description: "基于看板的项目管理工具，简单直观的任务管理。",
        detailedDescription: "Trello采用看板（Kanban）方式进行项目管理，通过卡片、列表和面板的组织方式，让团队能够直观地跟踪项目进度和任务状态。",
        url: "https://trello.com",
        icon: "fab fa-trello",
        pricing: "freemium",
        featured: true,
        features: ["看板管理", "卡片系统", "团队协作", "自动化规则", "集成应用", "移动应用"],
        useCases: ["项目管理：任务分配、进度跟踪", "团队协作：工作流程、责任分工", "个人规划：待办事项、目标管理", "内容规划：编辑日历、发布计划"],
        pros: ["界面简洁直观", "易于上手", "协作功能好", "免费版功能充足"],
        cons: ["功能相对简单", "复杂项目支持有限", "报表功能较弱"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["无限个人面板", "10个团队面板", "基础功能"] },
            standard: { name: "标准版", price: "$5/月/用户", features: ["无限面板", "高级功能", "集成应用"] }
        },
        rating: 4.3,
        reviews: 18000,
        tags: ["项目管理", "看板", "团队协作", "任务管理"]
    },
    {
        id: 22,
        name: "Google Drive",
        category: "productivity",
        description: "Google的云存储和办公套件，支持文档协作和文件同步。",
        detailedDescription: "Google Drive是Google提供的云存储服务，集成了Google Docs、Sheets、Slides等办公应用。支持实时协作、文件同步和跨平台访问。",
        url: "https://drive.google.com",
        icon: "fab fa-google-drive",
        pricing: "freemium",
        featured: true,
        features: ["云存储", "文档协作", "实时同步", "版本控制", "共享权限", "离线访问"],
        useCases: ["文档协作：团队文档、报告编写", "文件存储：个人文件、工作资料", "数据分析：电子表格、图表制作", "演示制作：PPT、项目展示"],
        pros: ["与Google服务集成", "协作功能强大", "免费空间充足", "跨平台支持"],
        cons: ["隐私考虑", "需要Google账号", "离线功能有限"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["15GB存储空间", "基础办公套件", "协作功能"] },
            one: { name: "Google One", price: "$1.99/月起", features: ["100GB起存储", "高级功能", "家庭共享"] }
        },
        rating: 4.5,
        reviews: 45000,
        tags: ["云存储", "文档协作", "办公套件", "Google"]
    },
    {
        id: 23,
        name: "Evernote",
        category: "productivity",
        description: "专业的笔记应用，强大的信息收集和整理功能。",
        detailedDescription: "Evernote是一款功能强大的笔记应用，支持文本、图片、音频、网页剪藏等多种内容形式。具有强大的搜索功能和标签系统，适合知识管理和信息整理。",
        url: "https://evernote.com",
        icon: "fas fa-file-alt",
        pricing: "freemium",
        featured: true,
        features: ["多格式笔记", "网页剪藏", "OCR识别", "标签系统", "搜索功能", "跨平台同步"],
        useCases: ["知识管理：资料收集、信息整理", "会议记录：会议纪要、重要信息", "学习笔记：课程笔记、研究资料", "项目管理：项目资料、进度记录"],
        pros: ["功能全面", "搜索能力强", "OCR识别准确", "稳定可靠"],
        cons: ["免费版限制较多", "界面相对复杂", "同步速度一般"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["60MB月上传", "2台设备同步", "基础功能"] },
            personal: { name: "个人版", price: "$7.99/月", features: ["10GB月上传", "无限设备", "高级功能"] }
        },
        rating: 4.2,
        reviews: 32000,
        tags: ["笔记应用", "知识管理", "信息收集", "OCR识别"]
    },

    // 实用网站分类 (4个)
    {
        id: 26,
        name: "Google",
        category: "utility",
        description: "全球最大的搜索引擎，提供网页、图片、新闻等全方位搜索服务。",
        detailedDescription: "Google是全球使用最广泛的搜索引擎，提供快速、准确的搜索结果。除了基础搜索，还提供图片搜索、新闻搜索、学术搜索等专业服务。",
        url: "https://google.com",
        icon: "fab fa-google",
        pricing: "free",
        featured: true,
        features: ["网页搜索", "图片搜索", "新闻搜索", "学术搜索", "实时翻译", "语音搜索"],
        useCases: ["信息查找：资料搜索、问题解答", "学术研究：论文查找、文献检索", "新闻获取：实时新闻、热点事件", "图片查找：素材搜索、反向搜索"],
        pros: ["搜索结果准确", "速度快", "功能全面", "完全免费"],
        cons: ["隐私考虑", "广告较多", "算法黑盒"],
        pricingDetails: {
            free: { name: "免费使用", price: "免费", features: ["无限搜索", "所有功能", "全球服务"] }
        },
        rating: 4.8,
        reviews: 100000,
        tags: ["搜索引擎", "信息查找", "Google", "实用工具"]
    },
    {
        id: 26,
        name: "Wikipedia",
        category: "utility",
        description: "全球最大的免费百科全书，提供可靠的知识和信息。",
        detailedDescription: "Wikipedia是一个多语言的网络百科全书，由全球志愿者协作编辑。提供免费、可靠的知识内容，涵盖几乎所有领域的信息。",
        url: "https://wikipedia.org",
        icon: "fab fa-wikipedia-w",
        pricing: "free",
        featured: true,
        features: ["百科知识", "多语言支持", "引用来源", "历史版本", "讨论页面", "移动应用"],
        useCases: ["知识查询：概念了解、基础知识", "学术研究：背景资料、参考信息", "教育学习：课程辅助、知识扩展", "日常查询：人物、事件、地理信息"],
        pros: ["内容权威可靠", "完全免费", "更新及时", "多语言支持"],
        cons: ["编辑质量参差不齐", "某些争议话题存在偏见", "深度有限"],
        pricingDetails: {
            free: { name: "完全免费", price: "免费", features: ["无限访问", "所有语言版本", "无广告"] }
        },
        rating: 4.7,
        reviews: 85000,
        tags: ["百科全书", "知识查询", "教育资源", "免费"]
    },
    {
        id: 27,
        name: "DeepL",
        category: "utility",
        description: "高质量的AI翻译工具，提供准确自然的多语言翻译服务。",
        detailedDescription: "DeepL是一款基于AI的翻译工具，以其高质量、自然流畅的翻译效果而闻名。支持多种语言互译，特别在欧洲语言翻译方面表现出色。",
        url: "https://deepl.com",
        icon: "fas fa-language",
        pricing: "freemium",
        featured: true,
        features: ["AI翻译", "文档翻译", "网页翻译", "API接口", "语言检测", "翻译历史"],
        useCases: ["文档翻译：学术论文、商务文档", "日常翻译：邮件、聊天、阅读", "学习辅助：外语学习、理解", "商务沟通：国际合作、客户服务"],
        pros: ["翻译质量高", "语言自然流畅", "支持文档翻译", "界面简洁"],
        cons: ["免费版有限制", "支持语言相对较少", "中文翻译有待提升"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础翻译", "有限字符数", "标准功能"] },
            pro: { name: "专业版", price: "$6.99/月", features: ["无限翻译", "文档翻译", "API访问", "数据安全"] }
        },
        rating: 4.6,
        reviews: 28000,
        tags: ["AI翻译", "多语言", "文档翻译", "语言工具"]
    },
    {
        id: 28,
        name: "Canva",
        category: "utility",
        description: "简单易用的在线设计工具，快速创建各种视觉内容。",
        detailedDescription: "Canva是一款用户友好的在线设计工具，提供丰富的模板和设计元素。无需专业设计技能，就能快速创建海报、社交媒体图片、演示文稿等视觉内容。",
        url: "https://canva.com",
        icon: "fas fa-paint-brush",
        pricing: "freemium",
        featured: true,
        features: ["模板设计", "拖拽编辑", "素材库", "团队协作", "品牌套件", "一键发布"],
        useCases: ["社交媒体：帖子设计、故事制作", "营销材料：海报、传单、横幅", "演示文稿：PPT设计、信息图表", "个人项目：邀请函、简历、名片"],
        pros: ["操作简单易学", "模板资源丰富", "免费版可用", "多平台支持"],
        cons: ["设计自由度有限", "高级功能需付费", "原创性相对较低"],
        pricingDetails: {
            free: { name: "免费版", price: "免费", features: ["基础模板", "有限素材", "标准导出"] },
            pro: { name: "专业版", price: "$12.99/月", features: ["所有模板", "高级素材", "品牌套件", "团队功能"] }
        },
        rating: 4.4,
        reviews: 35000,
        tags: ["在线设计", "模板设计", "营销设计", "易用工具"]
    }
];

// 导出数据（兼容原有结构）
const aiToolsDetail = websitesDetail;
