import {
  createBackButton,
  drawRoundedRectNoStrike
} from '../../utils/button';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Settings {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 创建BackgroundMusic实例
    this.backgroundMusic = new BackgroundMusic();
    // 创建SoundManager实例
    this.soundManager = new SoundManager();
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 定义标签和对应的内容
    this.tabs = ['设置', '历史', '团队', '关于', '产品'];
    // 加载左侧版本图标
    this.iconVersion = new Image();
    this.iconVersion.src = 'image/version.png'
    // 加载左侧音效图标
    this.iconImage = new Image();
    this.iconImage.src = 'image/music.png';
    // 绘制左侧音乐图标
    this.iconBack = new Image();
    this.iconBack.src = 'image/bgm.png';
    // 当前选中的标签索引
    this.selectedIndex = 0;
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 带有透明度的白色背景
    this.context.fillStyle = '#00000099';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制标签按钮
  drawTabs() {
    // 计算每个标签的宽度，考虑间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    for (let i = 0; i < this.tabs.length; i++) {
      // 计算每个标签的X坐标
      const tabX = 10 + i * (tabWidth + 10);
      const tabHeight = 40;
      const tabY = menuButtonInfo.top + tabHeight;
      // 绘制标签背景
      this.context.fillStyle = this.selectedIndex === i ? '#f5ac11' : '#f5d659';
      this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制标签文本
      this.context.fillStyle = '#000000';
      this.context.font = '16px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(this.tabs[i], tabX + tabWidth / 2, tabY + tabHeight / 2 + 2);
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    const tabContentY = menuButtonInfo.top + 90; // 设置内容区域的Y坐标
    // 计算当前选中标签的位置和宽度
    const tabWidth = this.canvas.width - 20;
    const tabX = 10;
    // 绘制选中标签下方的矩形
    this.context.fillStyle = '#f5d659'; // 标签背景颜色
    this.context.strokeStyle = 'black'; // 标签描边颜色
    if (this.selectedIndex === 0) {
      const contentHeight = 130; // 设置内容区域的高度，可以根据需要调整
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 设置版本左侧图标和文字的位置
      const iconX = tabX + 10; // 根据需要调整
      const iconY = tabContentY + 10; // 根据需要调整
      const iconSize = 30; // 图标的大小
      // 绘制版本左侧图标
      if (this.iconVersion.complete) {
        this.context.drawImage(this.iconVersion, iconX, iconY, iconSize, iconSize);
      }
      // 绘制音效左侧图标
      if (this.iconImage.complete) {
        this.context.drawImage(this.iconImage, iconX, iconY + 40, iconSize, iconSize);
      }
      // 绘制音乐左侧图标
      if (this.iconBack.complete) {
        this.context.drawImage(this.iconBack, iconX, iconY + 80, iconSize, iconSize);
      }
      // 绘制音效左侧文字
      const textX = iconX + iconSize + 30;
      const textY = iconY + iconSize / 2;
      this.context.fillStyle = '#000000';
      this.context.font = '16px Arial';
      this.context.fillText('版本', textX, textY);
      this.context.fillText('音效', textX, textY + 40);
      this.context.fillText('音乐', textX, textY + 80);
      // 设置并绘制右侧开关按钮
      const switchX = tabX + tabWidth - 60; // 开关的X坐标
      const switchY = tabContentY + 50; // 开关的Y坐标
      const switchWidth = 50; // 开关宽度
      const switchHeight = 25; // 开关高度
      const borderRadius = 12.5; // 圆角半径
      // 开关状态
      const isSwitchOn = wx.getStorageSync('musicEnabled') ? true : wx.getStorageSync('musicEnabled');
      const isBackMusicOn = wx.getStorageSync('backgroundMusicEnabled') ? true : wx.getStorageSync('backgroundMusicEnabled');
      this.context.fillText('V 1.0.4', switchX + 26, textY);
      // 绘制圆角矩形背景
      this.context.fillStyle = isSwitchOn ? '#4CAF50' : '#cccccc';
      drawRoundedRectNoStrike(this.context, switchX, switchY, switchWidth, switchHeight, borderRadius, '#000000', 3);
      this.context.fill();
      this.context.fillStyle = isBackMusicOn ? '#4CAF50' : '#cccccc';
      drawRoundedRectNoStrike(this.context, switchX, switchY + 40, switchWidth, switchHeight, borderRadius, '#000000', 3);
      this.context.fill();
      // 绘制音效开关滑块
      const sliderX = isSwitchOn ? switchX + switchWidth - switchHeight : switchX;
      this.context.fillStyle = '#FFFFFF';
      this.context.beginPath();
      this.context.arc(sliderX + switchHeight / 2, switchY + switchHeight / 2, switchHeight / 2, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fill();
      // 绘制音乐开关按钮
      const MusicX = isBackMusicOn ? switchX + switchWidth - switchHeight : switchX;
      this.context.fillStyle = '#FFFFFF';
      this.context.beginPath();
      this.context.arc(MusicX + switchHeight / 2, switchY + switchHeight / 2 + 40, switchHeight / 2, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fill();
    } else if (this.selectedIndex === 1) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['版本 1.0.4', '修复PC端无法适配问题', '', '版本 1.0.3', '增加游戏开篇画面和音效', '增加小恐龙闯关失败后的失败状态', '', '版本 1.0.2', '增加道具屋，通过看广告兑换道具', '', '版本 1.0.1', '关卡增加障碍物种类和黑夜变换', '增加历史成绩榜', '', '版本 1.0.0', 'Demo 版本发布'];
      const list = ['2024-03-15', '', '', '2024-01-30', '', '', '','2024-01-27', '', '', '2024-01-22', '', '', '', '2024-01-08', ''];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 15 + textHeight * i + fontSize / 2;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10, textY);
      }
    } else if (this.selectedIndex === 2) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['企划', '文案', '制图', '音乐', '开发', '测试', '发行'];
      const list = ['伯衡君', '伯衡君&ChatGPT', 'DALL·E 3', 'Suno AI', '伯衡君&ChatGPT', '伯衡君', '行运设计师荣誉出品'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 15 + textHeight * i + fontSize / 2;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10, textY);
      }
    } else if (this.selectedIndex === 3) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['官网', '微信', 'Youtube', '邮箱', 'Github'];
      const list = ['https://luckydesigner.space/', 'Nosense-history', '@LuckyDesigner', 'zhangboheng827@gmail.com', 'https://github.com/zhagnboheng'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 15 + textHeight * i + fontSize / 2;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10, textY);
      }
    } else if (this.selectedIndex === 4) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['浏览器插件', '微信小程序', '微信小游戏'];
      const list = ['LuckyNews Box', '英语大富翁', '小恐龙不要停'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 15 + textHeight * i + fontSize / 2;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10, textY);
      }
    }
  }
  draw() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标签按钮
    this.drawTabs();
    // 绘制选中标签的内容
    this.drawTabsContent();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      return
    }
    // 计算标签的宽度和间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和，包括两侧边缘
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    const tabHeight = 50;
    const tabY = menuButtonInfo.top + tabHeight;
    // 检查是否触摸了标签
    for (let i = 0; i < this.tabs.length; i++) {
      const tabX = 10 + i * (tabWidth + 10);
      // 检查触摸点是否在标签内
      if (touchX >= tabX && touchX <= tabX + tabWidth &&
        touchY >= tabY && touchY <= tabY + tabHeight) {
        // 更新选中的标签索引
        this.selectedIndex = i;
        break;
      }
    }
    // 开关按钮的位置和尺寸（与drawTabsContent方法中一致）
    const tabContentY = menuButtonInfo.top + 90;
    const tabContentX = 10;
    const switchX = tabContentX + (this.canvas.width - 20) - 60;
    const switchY = tabContentY + 55;
    const switchWidth = 50;
    const switchHeight = 25;
    // 检查是否触摸了音效开关按钮
    if (touchX >= switchX && touchX <= switchX + switchWidth &&
      touchY >= switchY && touchY <= switchY + switchHeight) {
      this.toggleMusic();
      // 重新绘制以显示更新后的开关状态
      this.draw();
      return;
    }
    // 检查是否触摸了音乐开关按钮
    if (touchX >= switchX && touchX <= switchX + switchWidth &&
      touchY >= switchY + 40 && touchY <= switchY + switchHeight + 40) {
      this.toggleBackgroundMusic();
      // 重新绘制以显示更新后的开关状态
      this.draw();
      return;
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.iconVersion.src = '';
    this.iconImage.src = '';
    this.iconBack.src = '';
  }
  // 管理音效状态
  toggleMusic() {
    const currentMusicState = this.soundManager.getMusicState();
    this.soundManager.setMusicState(!currentMusicState);
  }
  // 管理背景音乐状态
  toggleBackgroundMusic() {
    const currentMusicState = this.backgroundMusic.getBackgroundMusicState();
    this.backgroundMusic.setBackgroundMusicState(!currentMusicState);
  }
}