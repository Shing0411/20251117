// ====================================================================
// 1. 全域變數和背景設定 (DynamicShape 相關)
// ====================================================================
let objs = [];
let colors = [
    '#f71735', // 紅
    '#ff8800', // 橘
    '#f7d002', // 黃
    '#1A53C0', // 藍
    '#00d4ff', // 亮藍/青
    '#00cc99', // 綠
    '#8A2BE2'  // 紫羅蘭
];
const BG_COLOR = 20; 

// LOGO 相關變數
let sawmahLogo; 

// 互動相關全域變數
let textBounds = {}; 
let logoTargetX, logoTargetY; 
let logoCurrentX, logoCurrentY;
let textClickTimer = 0; 
const TEXT_CLICK_DURATION = 30; 

// ====================================================================
// 2. 選單和 Iframe 相關的全域變數 【新增網址】
// ====================================================================
let sidebarDiv;
let iframeDiv; 
let closeButton; 
// --- 【新增：漢堡圖示和響應式相關變數】 ---
let hamburgerButton; 
let isMobileMode = false; // 用於判斷是否處於行動裝置模式
const MOBILE_BREAKPOINT = 768; // 響應式斷點 (768px)
// ------------------------------------------

const MENU_WIDTH = 250;
const TRIGGER_AREA_WIDTH = 50; 
let menuState = 'hidden'; 

// 網址定義 (略...)
const WORK_URL = "https://shing0411.github.io/20251020/";
const NOTES_URL = "https://hackmd.io/@CSw-vFZYRyGNjY9NVa6a0w/B1-BLm0oxx";
const QUIZ_NOTES_URL = "https://hackmd.io/@CSw-vFZYRyGNjY9NVa6a0w/rk81ZQ9Jbl";
// 【新增網址定義】
const MIDTERM_REPORT_URL = "https://hackmd.io/@CSw-vFZYRyGNjY9NVa6a0w/rkzK1bOe-l";

const TKU_URL = "https://www.tku.edu.tw/";
const ET_TKU_URL = "https://www.et.tku.edu.tw/";

// Iframe 尺寸設定
const IFRAME_SIZE = '70%'; 


// ====================================================================
// PRELOAD 函式
// ====================================================================
function preload() {
    sawmahLogo = loadImage('sawmah LOGO.png'); 
}


// ====================================================================
// 3. SETUP 函式：初始化畫布、選單和 Iframe 【修改選單項目】
// ====================================================================

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    angleMode(RADIANS);
    
    for (let i = 0; i < 10; i++) {
        objs.push(new DynamicShape());
    }

    // 初始化 LOGO 位置
    const margin = width * 0.02;
    const logoWidth = width * 0.10;
    const logoHeight = sawmahLogo.height * (logoWidth / sawmahLogo.width);
    logoTargetX = logoCurrentX = width - logoWidth - margin;
    logoTargetY = logoCurrentY = height - logoHeight - margin;

    // ----------------------------------------------------------------
    // 【Iframe & 關閉按鈕設定】
    // ----------------------------------------------------------------
    iframeDiv = createDiv('');
    iframeDiv.id('iframe-container');
    iframeDiv.style('position', 'fixed');
    iframeDiv.style('top', '50%');
    iframeDiv.style('left', '50%');
    iframeDiv.style('width', IFRAME_SIZE);
    iframeDiv.style('height', IFRAME_SIZE);
    iframeDiv.style('transform', 'translate(-50%, -50%)'); 
    iframeDiv.style('z-index', '999'); 
    iframeDiv.style('display', 'none'); 
    iframeDiv.style('background-color', 'white'); 
    iframeDiv.style('border', '5px solid #1A53C0'); 
    iframeDiv.style('box-shadow', '0 0 20px rgba(0, 0, 0, 0.8)'); 

    let iframe = createElement('iframe');
    iframe.attribute('id', 'content-iframe');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeDiv); 
    iframe.style('width', '100%');
    iframe.style('height', '100%');

    closeButton = createButton('X');
    closeButton.parent(iframeDiv);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '-20px'); 
    closeButton.style('right', '-20px'); 
    closeButton.style('width', '40px');
    closeButton.style('height', '40px');
    closeButton.style('border-radius', '50%');
    closeButton.style('background-color', '#f71735'); 
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('font-size', '20px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '1001'); 
    closeButton.mousePressed(hideIframe);
    
    // ----------------------------------------------------------------
    // 【側邊欄選單設定】(調整樣式)
    // ----------------------------------------------------------------
    sidebarDiv = createDiv('');
    sidebarDiv.id('sidebar-menu');
    
    sidebarDiv.style('position', 'absolute'); 
    sidebarDiv.style('top', '0');
    sidebarDiv.style('left', '0');
    sidebarDiv.style('width', MENU_WIDTH + 'px');
    sidebarDiv.style('height', '100vh');
    sidebarDiv.style('background-color', 'rgba(20, 20, 20, 0.95)');
    sidebarDiv.style('box-shadow', '2px 0 10px rgba(0, 0, 0, 0.5)');
    sidebarDiv.style('z-index', '1000'); 
    sidebarDiv.style('padding-top', '50px');
    sidebarDiv.style('transition', 'transform 0.3s ease-in-out');
    sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
    
    // 創建選單項目 (按順序調整)
    createMenuItem('第一單元作品', WORK_URL, 'work');
    createMenuItem('第一單元講義', NOTES_URL, 'notes');
    createMenuItem('測驗區筆記', QUIZ_NOTES_URL, 'quizNotes'); 
    
    // 【新增項目】：期中報告筆記
    createMenuItem('期中報告筆記', MIDTERM_REPORT_URL, 'midtermReport'); 

    createMenuItem('測驗區', '', 'quiz'); 
    createMenuItem('淡江大學', TKU_URL, 'tku'); 
    createMenuItem('教育科技系', ET_TKU_URL, 'ettku', true); 
    createMenuItem('回到首頁', '', 'home'); 

    // ----------------------------------------------------------------
    // 【漢堡圖示設定】
    // ----------------------------------------------------------------
    hamburgerButton = createButton('☰');
    hamburgerButton.style('position', 'fixed'); 
    hamburgerButton.style('top', '15px');
    hamburgerButton.style('left', '15px');
    hamburgerButton.style('width', '40px');
    hamburgerButton.style('height', '40px');
    hamburgerButton.style('background-color', 'rgba(26, 83, 192, 0.8)'); 
    hamburgerButton.style('color', 'white');
    hamburgerButton.style('border', 'none');
    hamburgerButton.style('font-size', '24px');
    hamburgerButton.style('cursor', 'pointer');
    hamburgerButton.style('border-radius', '5px');
    hamburgerButton.style('z-index', '1001'); 
    hamburgerButton.style('display', 'none'); 
    
    hamburgerButton.mousePressed(toggleMenu); 
    
    // 首次檢查螢幕尺寸
    checkScreenSize();
}

// ----------------------------------------------------------------
// 【新增：檢查螢幕尺寸並切換模式】
// ----------------------------------------------------------------
function checkScreenSize() {
    if (windowWidth < MOBILE_BREAKPOINT) {
        if (!isMobileMode) {
            isMobileMode = true;
            hamburgerButton.style('display', 'block'); // 顯示漢堡圖示
            menuState = 'hidden'; // 確保菜單收合
            sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
        }
    } else {
        if (isMobileMode) {
            isMobileMode = false;
            hamburgerButton.style('display', 'none'); // 隱藏漢堡圖示
        }
    }
}

// ----------------------------------------------------------------
// 【新增：切換選單狀態】
// ----------------------------------------------------------------
function toggleMenu() {
    if (menuState === 'hidden') {
        menuState = 'visible';
        sidebarDiv.style('transform', 'translateX(0)');
        hamburgerButton.html('✕'); // 變成關閉符號
    } else {
        menuState = 'hidden';
        sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
        hamburgerButton.html('☰'); // 變回漢堡圖示
    }
}

// 輔助函式：創建選單項目 (略...未修改部分)
function createMenuItem(text, url, action, isSubItem = false) {
    let link = createA('#', text); 
    link.parent(sidebarDiv);
    
    link.style('display', 'block');
    link.style('text-decoration', 'none');
    link.style('color', '#f0f0f0');
    link.style('font-family', 'sans-serif');
    link.style('transition', 'background-color 0.2s, color 0.2s');
    link.style('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
    
    if (isSubItem) {
        link.style('padding', '10px 20px 10px 40px'); 
        link.style('font-size', '24px'); 
        link.style('background-color', 'rgba(10, 10, 10, 0.5)'); 
    } else {
        link.style('padding', '15px 20px');
        link.style('font-size', '32px'); 
    }
    
    link.mousePressed(() => {
        handleMenuClick(action, url);
        return false; 
    });

    link.mouseOver(() => {
        link.style('background-color', '#1A53C0');
        link.style('color', 'white');
    });
    link.mouseOut(() => {
        if (isSubItem) {
             link.style('background-color', 'rgba(10, 10, 10, 0.5)'); 
        } else {
             link.style('background-color', 'transparent');
        }
        link.style('color', '#f0f0f0');
    });
}

// ----------------------------------------------------------------
// 隱藏 Iframe 的函式 (略...未修改部分)
// ----------------------------------------------------------------
function hideIframe() {
    iframeDiv.style('display', 'none');
    const iframe = document.getElementById('content-iframe');
    iframe.src = ''; 
}

// ----------------------------------------------------------------
// 選單點擊處理函式 (新增期中報告處理邏輯)
// ----------------------------------------------------------------
function handleMenuClick(action, url) {
    const iframe = document.getElementById('content-iframe');
    let shouldShowIframe = true;
    let targetUrl = url;

    if (action === 'home') {
        hideIframe();
        shouldShowIframe = false;
        
    } else if (action === 'work' || action === 'notes' || action === 'quizNotes' || action === 'midtermReport') {
        // 【新增邏輯】：處理期中報告筆記
        targetUrl = url;
        
    } else if (action === 'quiz') {
        // 測驗區固定網址
        targetUrl = 'https://shing0411.github.io/20251106-1/';
        
    } else if (action === 'tku' || action === 'ettku') {
        targetUrl = url;
    }

    if (shouldShowIframe && targetUrl) {
        iframe.src = targetUrl;
        iframeDiv.style('display', 'block');
    }
    
    // 無論是否打開 Iframe，在行動模式下點擊選單後都應該收合選單
    if (isMobileMode) {
        menuState = 'hidden';
        sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
        hamburgerButton.html('☰'); // 變回漢堡圖示
    } else {
        // 大螢幕下，打開 Iframe 時收合選單
        if (shouldShowIframe) {
             menuState = 'hidden';
             sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
        }
    }
}


// ----------------------------------------------------------------
// P5.JS 內建函式：處理視窗大小調整和滑鼠移動 (略...未修改部分)
// ----------------------------------------------------------------
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // 檢查螢幕尺寸，切換選單模式
    checkScreenSize();
    
    // 視窗大小改變時，重新計算 LOGO 的基礎位置
    const margin = width * 0.02;
    const logoWidth = width * 0.10;
    const logoHeight = sawmahLogo.height * (logoWidth / sawmahLogo.width);
    logoTargetX = logoCurrentX = width - logoWidth - margin;
    logoTargetY = logoCurrentY = height - logoHeight - margin;
}

function mouseMoved() {
    if (iframeDiv.style('display') === 'block') {
        return; 
    }
    
    // 【修改】: 在行動裝置模式下，禁用滑鼠邊緣觸發
    if (isMobileMode) {
        return;
    }
    
    // 大螢幕模式下，保留滑鼠邊緣觸發
    if (mouseX < TRIGGER_AREA_WIDTH && menuState === 'hidden') {
        menuState = 'visible';
        sidebarDiv.style('transform', 'translateX(0)');
    } 
    
    else if (mouseX > MENU_WIDTH + 10 && menuState === 'visible') {
        menuState = 'hidden';
        sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
    }
}

// ----------------------------------------------------------------
// MOUSEPRESSED 函式 (處理點擊特效) (略...未修改部分)
// ----------------------------------------------------------------
function mousePressed() {
    // 1. 檢查 Iframe 是否顯示 (如果顯示，則忽略背景點擊)
    if (iframeDiv.style('display') === 'block') {
        return;
    }
    
    // 2. 檢查是否點擊到文字區域
    if (mouseX > textBounds.x && 
        mouseX < textBounds.x + textBounds.w && 
        mouseY > textBounds.y && 
        mouseY < textBounds.y + textBounds.h) 
    {
        // 點擊到文字：啟動文字閃爍計時器
        textClickTimer = TEXT_CLICK_DURATION;
        return; 
    }
    
    // 3. 點擊到背景：產生粒子爆炸效果
    // 避免在菜單/漢堡圖示區域點擊觸發特效
    if (isMobileMode && menuState === 'visible') {
         // 行動模式下，如果菜單是展開的，點擊菜單外部收起菜單，不觸發粒子爆炸
         if (mouseX > MENU_WIDTH) {
             toggleMenu();
         }
         return;
    }
    
    if (mouseX > MENU_WIDTH || isMobileMode) { 
        const numParticles = 30; 
        for (let i = 0; i < numParticles; i++) {
            let newShape = new DynamicShape(mouseX, mouseY); 
            newShape.init(); 
            newShape.sizeMax = width * random(0.01, 0.025); 
            newShape.actionPoints = 1; 
            newShape.duration = random(20, 40); 
            
            let angle = random(TWO_PI);
            let speed = random(10, 50); 
            newShape.fromX = mouseX;
            newShape.fromY = mouseY;
            newShape.toX = mouseX + cos(angle) * speed;
            newShape.toY = mouseY + sin(angle) * speed;
            newShape.animationType = int(random([1, 2])); 
            
            objs.push(newShape);
        }
    }
}


// ====================================================================
// 4. DRAW 函式：背景動畫邏輯、LOGO 繪製和文字繪製 (略...未修改主要互動邏輯)
// ====================================================================

function draw() {
    background(BG_COLOR); 
    
    // 運行背景動畫
    for (let i of objs) {
        i.run();
    }
    
    // 處理文字點擊計時器
    if (textClickTimer > 0) {
        textClickTimer--;
    }

    // ----------------------------------------------------------------
    // 【主畫面內容】: 僅在 Iframe 隱藏時顯示
    // ----------------------------------------------------------------
    if (iframeDiv.style('display') === 'none') {
        
        // --- 互動判斷與參數設定 ---
        const baseCenterY = height / 2;
        const lineHeight = height * 0.08;
        const textSize1 = width * 0.05; 
        const textSize2 = width * 0.03; 
        const textHeight = textSize1 + 2 * textSize2 + 2 * lineHeight;
        const textWidth = width * 0.4; 
        
        // 儲存文字偵測區域 (供 mousePressed 使用)
        textBounds.x = width / 2 - textWidth / 2;
        textBounds.y = baseCenterY - lineHeight - textSize1 * 0.5;
        textBounds.w = textWidth;
        textBounds.h = textHeight * 1.5; // 擴大偵測區域
        
        // 判斷滑鼠是否在文字區域內
        const isMouseOverText = mouseX > textBounds.x && 
                                 mouseX < textBounds.x + textBounds.w && 
                                 mouseY > textBounds.y && 
                                 mouseY < textBounds.y + textBounds.h;
        
        // 動態文字參數
        const hoverScale = isMouseOverText ? 1.1 : 1.0; 
        const hoverColor = isMouseOverText ? color('#00d4ff') : color('#f7d002'); 
        
        // 點擊閃爍/震動參數
        let textOffsetX = 0;
        let textOffsetY = 0;
        let flashAlpha = 255;
        if (textClickTimer > 0) {
            textOffsetX = random(-3, 3);
            textOffsetY = random(-3, 3);
            flashAlpha = map(textClickTimer, 0, TEXT_CLICK_DURATION, 100, 255);
        }


        // ----------------------------------------------------------------
        // 【個人資訊文字】
        // ----------------------------------------------------------------
        
        push();
        textAlign(CENTER, CENTER);
        textStyle(BOLD); 
        
        // 應用縮放與震動平移
        translate(width / 2 * (1 - hoverScale) + textOffsetX, height / 2 * (1 - hoverScale) + textOffsetY); 
        scale(hoverScale);

        const mainColor = color(red(hoverColor), green(hoverColor), blue(hoverColor), flashAlpha);
        const shadowColor = color(0, 0, 0, 150); 
        const shadowOffset = 3;
        
        // 文字內容
        const line1 = "淡江教科系";
        const line2 = "414000529";
        const line3 = "王O興";
        
        // 繪製陰影
        fill(shadowColor);
        textSize(textSize1);
        text(line1, width / 2 + shadowOffset, baseCenterY - lineHeight + shadowOffset);
        textSize(textSize2);
        text(line2, width / 2 + shadowOffset, baseCenterY + shadowOffset);
        text(line3, width / 2 + shadowOffset, baseCenterY + lineHeight + shadowOffset);

        // 繪製主文字
        fill(mainColor);
        textSize(textSize1);
        text(line1, width / 2, baseCenterY - lineHeight);
        textSize(textSize2);
        text(line2, width / 2, baseCenterY);
        text(line3, width / 2, baseCenterY + lineHeight);
        
        pop();
        
        // ----------------------------------------------------------------
        // 【繪製 LOGO - 右下角追蹤特效】
        // ----------------------------------------------------------------
        push();
        imageMode(CORNER); 
        
        const margin = width * 0.02;
        const logoWidth = width * 0.10; 
        const logoHeight = sawmahLogo.height * (logoWidth / sawmahLogo.width);
        
        const baseX = width - logoWidth - margin;
        const baseY = height - logoHeight - margin;

        const trackArea = 150; 
        const isMouseNearLogo = mouseX > baseX - trackArea && 
                                 mouseX < baseX + logoWidth + trackArea && 
                                 mouseY > baseY - trackArea && 
                                 mouseY < baseY + logoHeight + trackArea;
        
        let moveAmountX = 0;
        let moveAmountY = 0;
        
        if (isMouseNearLogo) {
            const centerLogoX = baseX + logoWidth / 2;
            const centerLogoY = baseY + logoHeight / 2;
            
            moveAmountX = map(mouseX, centerLogoX - trackArea, centerLogoX + trackArea, -10, 10, true);
            moveAmountY = map(mouseY, centerLogoY - trackArea, centerLogoY + trackArea, -10, 10, true);
            
            moveAmountX = -moveAmountX * 0.5; 
            moveAmountY = -moveAmountY * 0.5;
        }

        logoTargetX = baseX + moveAmountX;
        logoTargetY = baseY + moveAmountY;
        
        // 使用 lerp 讓 LOGO 平滑地移動到目標位置
        logoCurrentX = lerp(logoCurrentX, logoTargetX, 0.1);
        logoCurrentY = lerp(logoCurrentY, logoTargetY, 0.1);
        
        // 繪製 LOGO
        image(
            sawmahLogo, 
            logoCurrentX, 
            logoCurrentY, 
            logoWidth, 
            logoHeight
        );
        pop();
        // --------------------------------------------------
    }
    // ----------------------------------------------------------------

    // 背景動畫的粒子生成和移除邏輯 
    if (frameCount % int(random([10, 20])) == 0) {
        let addNum = int(random(1, 15)); 
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    
    for (let i = objs.length - 1; i >= 0; i--) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
}

// ====================================================================
// 5. HELPER 函式和 CLASS (DynamicShape) (略...未修改部分)
// ====================================================================

function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
    constructor(startX = random(width), startY = random(height)) {
        this.x = startX;
        this.y = startY;
        this.reductionRatio = 1;
        this.shapeType = int(random(6)); 
        this.animationType = int(random(4)); 
        this.maxActionPoints = int(random(3, 7)); 
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.04); 
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.baseClr = color(random(colors));
        this.clr = this.baseClr;
        this.changeShape = true;
        this.ang = random(PI * 2);
        this.angVelocity = random(-0.02, 0.02); 
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        
        this.ang += this.angVelocity;
        rotate(this.ang); 

        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        
        let alpha = map(this.actionPoints, 0, this.maxActionPoints, 0, 255, true);
        this.clr = color(red(this.baseClr), green(this.baseClr), blue(this.baseClr), alpha);

        stroke(this.clr);
        strokeWeight(this.size * 0.05 + 1); 

        if (this.shapeType == 0) {
            fill(this.clr);
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            fill(this.clr);
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            noFill();
            strokeWeight(this.size * 0.1);
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        } else if (this.shapeType == 5) {
            noFill();
            let r = this.size / 2;
            triangle(0, -r, r * cos(PI/6), r * sin(PI/6), -r * cos(PI/6), r * sin(PI/6));
        }

        pop();
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = 0; 
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = 0; 
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(6)); 
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.4, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init(); 
        }
        if (this.actionPoints < 0) {
            this.isDead = true; 
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.8, 1.2); 
        
        this.fromX = this.x;
        this.toX = constrain(this.fromX + (width / 20) * random([-1, 1]) * int(random(1, 5)), 0, width);
        this.fromY = this.y;
        this.toY = constrain(this.fromY + (height / 20) * random([-1, 1]) * int(random(1, 5)), 0, height);
        
        this.animationType = int(random(4)); 
        this.duration = random(30, 70); 
        this.changeShape = true;
    }
}