import {
  createBackButton,
  drawRoundedRectNoStrike
} from '../../utils/button';
import { soundManager, backgroundMusic, menuButtonInfo, scaleX, scaleY } from '../../utils/global';
export default class Settings {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.bannerAd = '';
    /* 图片加载区域开始 */
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 加载左侧版本图标
    this.iconVersion = new Image();
    this.iconVersion.src = 'image/version.png'
    // 加载左侧音效图标
    this.iconImage = new Image();
    this.iconImage.src = 'image/music.png';
    // 绘制左侧音乐图标
    this.iconBack = new Image();
    this.iconBack.src = 'image/bgm.png';
    /* 图片加载区域结束 */
    /* 事件监听区域开始 */
    wx.onTouchStart(this.handleTouchStart.bind(this));
    wx.onTouchMove(this.handleTouchMove.bind(this));
    wx.onTouchEnd(this.handleTouchEnd.bind(this));
    /* 事件监听区域结束 */
    /* 变量区域开始 */
    // 定义标签和对应的内容
    this.tabs = ['设置', '历史', '团队', '关于', '产品'];
    // 初始化触摸位置和滚动偏移量
    this.touchStartY = 0;
    this.scrollOffsetY = 0;
    this.selectedIndex = 0;
    /* 变量区域结束 */
    this.drawAd();
  }
  // 绘制广告
  drawAd() {
    this.bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-516f17ab80e68280',
      style: {
          left: 10,
          top: 0,
          width: this.canvas.width - 20
      }
    });
    this.bannerAd.show()
    this.bannerAd.onResize(res => {
      this.bannerAd.style.top = this.canvas.height - res.height - 10
    })
    // 监听 banner 广告错误事件
    this.bannerAd.onError(err => {
      console.error(err.errMsg)
    });
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 带有透明度的黑色背景
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
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    for (let i = 0; i < this.tabs.length; i++) {
      // 计算每个标签的X坐标
      const tabX = 10 + i * (tabWidth + 10);
      const tabY = menuButtonInfo.bottom + 10 * scaleY;
      const tabHeight = 40 * scaleY;
      // 绘制标签背景
      this.context.save();
      this.context.fillStyle = this.selectedIndex === i ? '#f5ac11' : '#f5d65999';
      this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制标签文本
      this.context.fillStyle = '#000000';
      this.context.font = `bold ${16 * scaleX}px Arial`;
      // 计算文本宽度并水平居中
      const textWidth = this.context.measureText(this.tabs[i]).width;
      const textX = tabX + (tabWidth - textWidth) / 2; // 水平居中
      const textY = tabY + tabHeight / 2 + 6 * scaleX;
      this.context.fillText(this.tabs[i], textX, textY);
      this.context.restore();
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    this.context.save();
    const tabContentY = menuButtonInfo.bottom + 40 * scaleY + 20 * scaleY; // 设置内容区域的Y坐标
    // 计算当前选中标签的位置和宽度
    const tabWidth = this.canvas.width - 20;
    const tabX = 10;
    // 绘制选中标签下方的矩形
    this.context.fillStyle = '#f5d659'; // 标签背景颜色
    this.context.strokeStyle = 'black'; // 标签描边颜色
    this.context.lineWidth = 3;
    if (this.selectedIndex === 0) {
      // 设置版本左侧图标和文字的位置
      const iconX = tabX + 10 * scaleX; // 根据需要调整
      const iconY = tabContentY + 10 * scaleY; // 根据需要调整
      const iconSize = 30 * scaleY; // 图标的大小
      const contentHeight = 80 * scaleY + iconSize + 20 * scaleY; // 设置内容区域的高度，可以根据需要调整
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制版本左侧图标
      if (this.iconVersion.complete) {
        this.context.drawImage(this.iconVersion, iconX, iconY, iconSize, iconSize);
      }
      // 绘制音效左侧图标
      if (this.iconImage.complete) {
        this.context.drawImage(this.iconImage, iconX, iconY + 40 * scaleY, iconSize, iconSize);
      }
      // 绘制音乐左侧图标
      if (this.iconBack.complete) {
        this.context.drawImage(this.iconBack, iconX, iconY + 80 * scaleY, iconSize, iconSize);
      }
      // 绘制音效左侧文字
      const textX = iconX + iconSize + 30 * scaleX;
      this.context.fillStyle = '#000000';
      this.context.font = `${16 * scaleX}px Arial`;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText('版本', textX, iconY + iconSize / 2);
      this.context.fillText('音效', textX, iconY + 40 * scaleY + iconSize / 2);
      this.context.fillText('音乐', textX, iconY + 80 * scaleY + iconSize / 2);
      const switchWidth = 50 * scaleX; // 开关宽度
      const switchHeight = 25 * scaleY; // 开关高度
      const borderRadius = 12.5 * scaleY; // 圆角半径
      // 设置并绘制右侧开关按钮
      const switchX = tabX + tabWidth - switchWidth - 10 * scaleX; // 开关的X坐标
      const switchY = tabContentY + 40 * scaleY + switchHeight / 2; // 开关的Y坐标
      // 开关状态
      const isSwitchOn = wx.getStorageSync('musicEnabled') ? true : wx.getStorageSync('musicEnabled');
      const isBackMusicOn = wx.getStorageSync('backgroundMusicEnabled') ? true : wx.getStorageSync('backgroundMusicEnabled');
      const textWidth = this.context.measureText('V 1.0.9').width;
      this.context.fillText('V 1.0.9', switchX + switchWidth - textWidth / 2, iconY + iconSize / 2);
      // 绘制圆角矩形背景
      this.context.fillStyle = isSwitchOn ? '#4CAF50' : '#cccccc';
      drawRoundedRectNoStrike(this.context, switchX, switchY, switchWidth, switchHeight, borderRadius, '#000000', 3);
      this.context.fill();
      this.context.fillStyle = isBackMusicOn ? '#4CAF50' : '#cccccc';
      drawRoundedRectNoStrike(this.context, switchX, switchY + 40 * scaleY, switchWidth, switchHeight, borderRadius, '#000000', 3);
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
      this.context.arc(MusicX + switchHeight / 2, switchY + switchHeight / 2 + 40 * scaleY, switchHeight / 2, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fill();
    } else if (this.selectedIndex === 1) {
      const fontSize = 16 * scaleX;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['版本 1.0.9', '修复道具屋获取道具数量错误', '', '版本 1.0.8', '增加广告', '解决一些小问题', '', '版本 1.0.7', '道具出现速度优化', '关卡中加速水平增加一种', '', '版本 1.0.6', '降低难度，延长可玩性', '优化运行稳定性', '修复 bugs', '', '版本 1.0.5', '优化程序稳定性', '逃出监牢增加明显终点标识', '优化精简程序运行', '','版本 1.0.4', '修复PC端无法适配问题', '', '版本 1.0.3', '增加游戏开篇画面和音效', '增加小恐龙闯关失败后的失败状态', '', '版本 1.0.2', '增加道具屋，通过看广告兑换道具', '', '版本 1.0.1', '关卡增加障碍物种类和黑夜变换', '增加历史成绩榜', '', '版本 1.0.0', 'Demo 版本发布'];
      const list = ['2024-04-01', '', '', '2024-03-31', '', '', '', '2024-03-31', '', '', '', '2024-03-29', '', '', '', '','2024-03-18', '', '', '', '', '2024-03-15', '', '', '2024-01-30', '', '', '','2024-01-27', '', '', '2024-01-22', '', '', '', '2024-01-08', ''];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20 * scaleY;
      // 绘制矩形
      const limitHeight = this.canvas.height - tabContentY - contentHeight <= tabContentY ? this.canvas.height - 2 * tabContentY : contentHeight
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, limitHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, limitHeight);
      // 设置剪切区域，确保文本只在矩形内显示
      this.context.beginPath();
      this.context.rect(tabX, tabContentY, tabWidth, limitHeight);
      this.context.clip();
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10 * scaleX, textY + this.scrollOffsetY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10 * scaleX, textY + this.scrollOffsetY);
      }
    } else if (this.selectedIndex === 2) {
      const fontSize = 16 * scaleX;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['企划', '文案', '制图', '音乐', '开发', '测试', '发行'];
      const list = ['伯衡君', '伯衡君&ChatGPT', 'DALL·E 3', 'Suno AI', '伯衡君&ChatGPT', '伯衡君', '行运设计师荣誉出品'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10 * scaleX, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    } else if (this.selectedIndex === 3) {
      const fontSize = 16 * scaleX;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['官网', '微信', 'Youtube', '邮箱', 'Github'];
      const list = ['https://luckydesigner.space/', 'Nosense-history', '@LuckyDesigner', 'zhangboheng827@gmail.com', 'https://github.com/zhagnboheng'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10 * scaleX, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    } else if (this.selectedIndex === 4) {
      const fontSize = 16 * scaleX;
      this.context.font = `${fontSize}px Arial`;
      const arr = ['浏览器插件', '微信小程序', '微信小游戏', '微信小游戏'];
      const list = ['LuckyNews Box', '英语大富翁', '小恐龙不要停', '跃影忍者'];
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = arr.length * textHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 遍历数组并绘制文本
      this.context.fillStyle = '#000000';
      for (let i = 0; i < arr.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;
        // 左侧文本
        this.context.textAlign = 'left';
        this.context.fillText(arr[i], tabX + 10 * scaleX, textY);
        // 右侧文本
        this.context.textAlign = 'right';
        this.context.fillText(list[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    }
    this.context.restore();
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标签按钮
    this.drawTabs();
    // 绘制选中标签的内容
    this.drawTabsContent();
  }
  // 记录触摸开始的位置
  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }
  // 计算触摸移动的距离并更新滚动偏移量
  handleTouchMove(e) {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - this.touchStartY;
    if (deltaY < 0) {
      this.scrollOffsetY += deltaY;
      this.touchStartY = touchY;
    }
  }
  // 触摸结束，可以在这里添加额外的逻辑
  handleTouchEnd(e) {
    this.scrollOffsetY = 0;
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
    const tabY = menuButtonInfo.bottom + 10;
    const tabHeight = 40 * scaleY;
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
    const tabX = 10;
    const tabContentY = menuButtonInfo.bottom + 40 * scaleY + 20 * scaleY;
    const switchWidth = 50 * scaleX; // 开关宽度
    const switchHeight = 25 * scaleY; // 开关高度
    const switchX = tabX + (this.canvas.width - 20) - switchWidth - 10 * scaleX; // 开关的X坐标
    const switchY = tabContentY + 40 * scaleY + switchHeight / 2; // 开关的Y坐标
    // 检查是否触摸了音效开关按钮
    if (touchX >= switchX && touchX <= switchX + switchWidth &&
      touchY >= switchY && touchY <= switchY + switchHeight && this.selectedIndex === 0) {
      this.toggleMusic();
      // 重新绘制以显示更新后的开关状态
      this.draw();
      return;
    }
    // 检查是否触摸了音乐开关按钮
    if (touchX >= switchX && touchX <= switchX + switchWidth &&
      touchY >= switchY + 40 * scaleY && touchY <= switchY + switchHeight + 40 * scaleY && this.selectedIndex === 0) {
      this.toggleBackgroundMusic();
      // 重新绘制以显示更新后的开关状态
      this.draw();
      return;
    }
  }
  // 页面销毁机制
  destroy() {
    this.bannerAd.hide();
    this.bannerAd = '';
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.iconVersion.src = '';
    this.iconImage.src = '';
    this.iconBack.src = '';
    // 移除触摸事件监听器
    wx.offTouchStart(this.handleTouchStart.bind(this));
    wx.offTouchMove(this.handleTouchMove.bind(this));
    wx.offTouchEnd(this.handleTouchEnd.bind(this));
    // 重置状态
    this.touchStartY = 0;
    this.scrollOffsetY = 0;
    this.selectedTabIndex = 0;
  }
  // 管理音效状态
  toggleMusic() {
    const currentMusicState = soundManager.getMusicState();
    soundManager.setMusicState(!currentMusicState);
  }
  // 管理背景音乐状态
  toggleBackgroundMusic() {
    const currentMusicState = backgroundMusic.getBackgroundMusicState();
    backgroundMusic.setBackgroundMusicState(!currentMusicState);
  }
}