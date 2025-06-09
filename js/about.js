// 关于我们页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 加载主题
    loadTheme();

    // 初始化地图
    initMap();

    // 添加页面交互效果
    addInteractiveEffects();
});

// 初始化高德地图
function initMap() {
    // 检查AMap是否已加载
    if (typeof AMap === 'undefined') {
        console.error('高德地图API未加载');
        showMapError();
        return;
    }

    // 苏州大学独墅湖校区一期的精确坐标（根据地图显示调整到正确位置）
    const suzhou_university = [120.730429, 31.2726]; // 经度, 纬度

    try {
        // 检查当前主题模式
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const mapStyle = currentTheme === 'dark' ? 'amap://styles/dark' : 'amap://styles/normal';

        // 创建地图实例
        const map = new AMap.Map('mapContainer', {
            zoom: 15, // 适中的缩放级别，既能看到校区全貌又有足够细节
            center: suzhou_university, // 中心点坐标
            mapStyle: mapStyle, // 根据主题选择地图样式
            viewMode: '2D', // 地图模式
            lang: 'zh_cn', // 语言
            features: ['bg', 'point', 'road', 'building'], // 显示背景、兴趣点、道路、建筑物
            resizeEnable: true, // 允许地图自适应容器大小变化
            rotateEnable: false, // 禁用地图旋转
            pitchEnable: false, // 禁用地图倾斜
            expandZoomRange: true,
            zooms: [12, 18] // 限制缩放范围，避免过度放大或缩小
        });

        // 存储地图实例和目标位置，供其他函数使用
        window.mapInstance = map;
        window.targetLocation = suzhou_university;

        // 添加标记点 - 使用默认图标确保显示
        const marker = new AMap.Marker({
            position: suzhou_university,
            title: '苏州大学独墅湖校区一期'
        });

        // 将标记添加到地图
        map.add(marker);

        // 添加一个圆形覆盖物作为额外的视觉标识
        const circle = new AMap.Circle({
            center: suzhou_university,
            radius: 150, // 减小半径，避免覆盖过大区域
            strokeColor: '#FF6B6B',
            strokeWeight: 2,
            strokeOpacity: 0.6,
            fillColor: '#FF6B6B',
            fillOpacity: 0.15,
            cursor: 'pointer'
        });

        map.add(circle);

        // 添加文本标记
        const text = new AMap.Text({
            text: '🏫 苏州大学独墅湖校区',
            anchor: 'center',
            draggable: false,
            cursor: 'pointer',
            position: suzhou_university,
            style: {
                'background-color': '#FF6B6B',
                'color': 'white',
                'border': '2px solid white',
                'border-radius': '15px',
                'padding': '8px 12px',
                'font-size': '14px',
                'font-weight': 'bold',
                'font-family': 'Kalam, cursive',
                'box-shadow': '0 4px 8px rgba(0,0,0,0.3)',
                'transform': 'translate(-50%, -100%)',
                'transition': 'all 0.3s ease'
            }
        });

        // 添加悬停效果
        text.on('mouseover', function() {
            text.setStyle({
                'background-color': '#FF5555',
                'transform': 'translate(-50%, -100%) scale(1.05)',
                'box-shadow': '0 6px 12px rgba(0,0,0,0.4)'
            });
        });

        text.on('mouseout', function() {
            text.setStyle({
                'background-color': '#FF6B6B',
                'transform': 'translate(-50%, -100%) scale(1)',
                'box-shadow': '0 4px 8px rgba(0,0,0,0.3)'
            });
        });

        map.add(text);

        // 创建信息窗体
        const infoWindow = new AMap.InfoWindow({
            content: `
                <div style="padding: 20px; font-family: 'Kalam', cursive; max-width: 300px;">
                    <h4 style="margin: 0 0 15px 0; color: #FF6B6B; font-size: 18px; text-align: center;">
                        🏫 苏州大学独墅湖校区一期
                    </h4>
                    <div style="border-top: 2px dashed #FF6B6B; padding-top: 15px;">
                        <p style="margin: 8px 0; color: #666; display: flex; align-items: center;">
                            <span style="color: #FF6B6B; margin-right: 8px;">📍</span>
                            江苏省苏州市工业园区仁爱路199号
                        </p>
                        <p style="margin: 8px 0; color: #666; display: flex; align-items: center;">
                            <span style="color: #FF6B6B; margin-right: 8px;">🎓</span>
                            网站工具导航项目所在地
                        </p>
                        <p style="margin: 8px 0; color: #666; display: flex; align-items: center;">
                            <span style="color: #FF6B6B; margin-right: 8px;">🌟</span>
                            致力于创造有温度的技术产品
                        </p>
                    </div>
                </div>
            `,
            offset: new AMap.Pixel(0, -40),
            closeWhenClickMap: true
        });

        // 点击标记显示信息窗体
        marker.on('click', function() {
            infoWindow.open(map, marker.getPosition());
        });

        // 文本标记点击事件
        text.on('click', function() {
            infoWindow.open(map, marker.getPosition());
            console.log('文本标记被点击，信息窗体已打开');
        });

        // 圆形区域点击事件
        circle.on('click', function() {
            infoWindow.open(map, marker.getPosition());
            console.log('圆形区域被点击，信息窗体已打开');
        });

        // 地图加载完成事件 - 不自动显示信息窗体
        map.on('complete', function() {
            console.log('地图加载完成');
            console.log('标记位置:', marker.getPosition());
            console.log('地图中心:', map.getCenter());

            // 添加地图加载成功的视觉反馈
            const mapContainer = document.getElementById('mapContainer');
            if (mapContainer) {
                mapContainer.classList.add('map-loaded');

                // 添加交互提示
                const tooltip = document.createElement('div');
                tooltip.className = 'map-tooltip';
                tooltip.innerHTML = '💡 点击红色标记查看详细信息';
                tooltip.style.cssText = `
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: rgba(255, 107, 107, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-family: 'Kalam', cursive;
                    font-size: 12px;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    z-index: 1000;
                    animation: fadeInOut 4s ease-in-out;
                    pointer-events: none;
                `;

                mapContainer.appendChild(tooltip);

                // 4秒后移除提示
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 4000);
            }

            // 确保地图居中显示校区位置
            map.setCenter(suzhou_university);

            console.log('地图已准备就绪，点击标记查看详细信息');
        });

        // 标记点击事件增强
        marker.on('click', function() {
            console.log('标记被点击');
        });

        // 添加地图控件
        map.addControl(new AMap.Scale({
            position: 'LB' // 左下角
        }));

        map.addControl(new AMap.ToolBar({
            position: 'RT' // 右上角
        }));

        // 创建自定义定位按钮
        createLocationButton(map, suzhou_university);

        // 添加地图类型切换控件
        map.addControl(new AMap.MapType({
            defaultType: 0,
            showTraffic: false,
            showRoad: true
        }));

        // 存储地图实例供其他函数使用
        window.aboutPageMap = map;

    } catch (error) {
        console.error('高德地图初始化失败:', error);
        // 显示地图加载失败的提示
        showMapError();
    }
}



// 显示地图加载失败的提示
function showMapError() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-error">
                <div class="error-content">
                    <i class="fas fa-map-marked-alt"></i>
                    <h4>地图加载失败</h4>
                    <p>抱歉，地图服务暂时不可用</p>
                    <div class="location-fallback">
                        <h5>📍 我们的位置</h5>
                        <p>江苏省苏州市工业园区仁爱路199号</p>
                        <p>苏州大学独墅湖校区一期</p>
                        <a href="https://ditu.amap.com/search?query=苏州大学独墅湖校区"
                           target="_blank" class="map-link">
                            <i class="fas fa-external-link-alt"></i>
                            在高德地图中查看
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// 创建自定义定位按钮
function createLocationButton(map, targetLocation) {
    const locationButton = document.createElement('div');
    locationButton.className = 'custom-location-btn';
    locationButton.innerHTML = `
        <i class="fas fa-crosshairs"></i>
        <span class="location-tooltip">回到我们的位置</span>
    `;

    // 添加样式 - 调整位置避免遮挡地图控件
    locationButton.style.cssText = `
        position: absolute;
        top: 70px;
        right: 15px;
        width: 45px;
        height: 45px;
        background: white;
        border: 2px solid #FF6B6B;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #FF6B6B;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
        font-family: 'Kalam', cursive;
    `;

    // 工具提示样式
    const tooltip = locationButton.querySelector('.location-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
    `;

    // 悬停效果
    locationButton.addEventListener('mouseenter', function() {
        this.style.background = '#FF6B6B';
        this.style.color = 'white';
        this.style.transform = 'scale(1.1)';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    });

    locationButton.addEventListener('mouseleave', function() {
        this.style.background = 'white';
        this.style.color = '#FF6B6B';
        this.style.transform = 'scale(1)';
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });

    // 点击事件 - 回到目标位置
    locationButton.addEventListener('click', function() {
        map.setCenter(targetLocation);
        map.setZoom(15);

        // 添加点击反馈动画
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        console.log('地图已重新定位到苏州大学独墅湖校区');
    });

    // 添加到地图容器
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.appendChild(locationButton);
    }
}

// 主题切换功能 - 由桌面宠物统一处理，这里只保留地图更新

// 更新地图主题
function updateMapTheme() {
    if (window.aboutPageMap) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const mapStyle = currentTheme === 'dark' ? 'amap://styles/dark' : 'amap://styles/normal';
        window.aboutPageMap.setMapStyle(mapStyle);
        console.log('地图主题已更新为:', currentTheme === 'dark' ? '深色模式' : '浅色模式');

        // 同时更新定位按钮的样式以适应主题
        updateLocationButtonTheme(currentTheme === 'dark');
    }
}

// 更新定位按钮主题
function updateLocationButtonTheme(isDarkMode) {
    const locationButton = document.querySelector('.custom-location-btn');
    if (locationButton) {
        // 移除内联样式，让CSS变量和选择器处理主题
        locationButton.style.removeProperty('background');
        locationButton.style.removeProperty('color');
        locationButton.style.removeProperty('border-color');

        // 强制重新应用CSS样式
        locationButton.offsetHeight; // 触发重排

        console.log('定位按钮主题已更新为:', isDarkMode ? '深色模式' : '浅色模式');
    }
}

// 加载主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    // 设置HTML根元素的data-theme属性
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 同时设置body的class（兼容性）
    const body = document.body;
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }

    // 更新主题切换按钮图标
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    console.log('主题已加载:', savedTheme);
}

// 添加页面交互效果
function addInteractiveEffects() {
    // 技能标签悬停效果
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(' + (Math.random() * 10 - 5) + 'deg) scale(1.1)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // 统计卡片动画
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(' + (index % 2 === 0 ? '2deg' : '-2deg') + ') scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // 技术栈图标动画
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(10deg)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // 添加滚动视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-decoration i');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // 数字动画效果
    animateNumbers();
}

// 数字动画效果
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;

                // 如果是数字，执行动画
                if (!isNaN(finalNumber) && finalNumber !== '∞') {
                    animateNumber(target, 0, parseInt(finalNumber), 2000);
                }

                observer.unobserve(target);
            }
        });
    });

    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// 数字递增动画
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end;
        }
    }

    requestAnimationFrame(updateNumber);
}

// 页面离开时的清理
window.addEventListener('beforeunload', function() {
    if (window.aboutPageMap) {
        window.aboutPageMap.destroy();
    }
});
