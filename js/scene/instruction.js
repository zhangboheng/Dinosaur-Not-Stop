import {
  createBackButton
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
let isAndroid = systemInfo.platform === 'android';
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.scene1(this.game));
    });
    // 加载角色图片
    this.characterImage = new Image();
    this.characterImage.src = 'image/dino_0.png';
    // 加载道具图片
    this.improveBubble = new Image();
    this.improveBubble.src = 'image/improve-bubble.png'
    this.mushroom = new Image();
    this.mushroom.src = 'image/mushroom.png'
    // 加载操作图片
    this.clickImage = new Image();
    this.clickImage.src = 'image/click.png'
    // 定义标签和对应的内容
    this.tabs = [{
        title: "背景",
        content: "一个与世隔绝的神秘岛屿\n科学家将恐龙复活\n“侏罗纪乐园”就此诞生\n乐园不仅是恐龙的家园\n也是旅游胜地\n体验激动人心的旅程\n然而，某天\n一个实验室突发事故\n安全系统开始失控\n整个乐园变成危险之地\n我们的主角小棘龙\n被困在了乐园\n为了逃离这个疯狂的乐园\n跑\n不要停！"
      },
      {
        title: "角色",
        content: "名称：小棘龙\n龙龄：未知\n独家秘技：二级跳\n爱好：吃毒蘑菇发癫"
      },
      {
        title: "道具",
        content: "名称：三级跳\n功效：可以连跳三次\n触发条件：随机\n\n\n名称：毒蘑菇\n功效：让小棘龙嗨起来\n副作用：跳老高了\n触发条件：随机"
      },
      {
        title: "操作",
        content: "点击即可让小棘龙跳跃\n连点可使出独家秘技\n在陷阱间不落地时\n二级跳效果更好哦"
      }
    ];
    // 当前选中的标签索引
    this.selectedTabIndex = 0;
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
    const fontSize = 16;
    this.context.font = `bold ${fontSize}px Arial`; // 设置字体
    if (isAndroid) {
      this.tabs.forEach((tab, index) => {
        // 标签的尺寸和位置
        const tabX = 10;
        const tabY = menuButtonInfo.top + 50 * index + 50;
        const tabWidth = this.canvas.width / 4;
        const tabHeight = 40;
        // 绘制标签背景
        this.context.fillStyle = this.selectedTabIndex === index ? '#f5ac11' : '#f5d659';
        this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
        // 绘制标签边框
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 3;
        this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
        const textX = tabX + tabWidth / 2; // 水平居中
        // 文本垂直居中
        const textY = tabY + tabHeight / 2 + 2; // 调整以实现垂直居中
        // 绘制文本
        this.context.fillStyle = 'black';
        this.context.fillText(tab.title, textX, textY);
      });
    } else {
      this.tabs.forEach((tab, index) => {
        // 标签的尺寸和位置
        const tabX = 10;
        const tabY = menuButtonInfo.top + 50 * index + 50;
        const tabWidth = this.canvas.width / 4;
        const tabHeight = 40;
        // 绘制标签背景
        this.context.fillStyle = this.selectedTabIndex === index ? '#f5ac11' : '#f5d659';
        this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
        // 绘制标签边框
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 3;
        this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
        // 计算文本宽度并水平居中
        const textWidth = this.context.measureText(tab.title).width;
        const textX = tabX + (tabWidth - textWidth) / 2; // 水平居中
        // 文本垂直居中
        const textY = tabY + tabHeight / 2 + fontSize / 2 - 2; // 调整以实现垂直居中
        // 绘制文本
        this.context.fillStyle = 'black';
        this.context.fillText(tab.title, textX, textY);
      });
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    const fontSize = 16; // 字体大小
    const padding = 10; // 文本周围的内边距
    this.context.font = `${fontSize}px Arial`; // 设置字体
    // 获取选中标签的内容并分割为行
    const lines = this.tabs[this.selectedTabIndex].content.split('\n');
    // 内容的位置和尺寸
    let contentX = this.canvas.width / 4 + 20;
    let contentY = menuButtonInfo.top + 50;
    const contentWidth = this.canvas.width - contentX - 10;
    const contentHeight = lines.length * (fontSize + 10) + padding * 2 + 2;
    // 根据选中的标签决定是否绘制图片
    if (this.selectedTabIndex === 1) {
      const imageWidth = 32; // 设置图片宽度
      const imageHeight = 32; // 设置图片高度
      const imageX = contentX + (contentWidth - imageWidth) / 2;
      const imageY = contentY + 10;
      // 绘制内容背景
      this.context.fillStyle = '#f5d659';
      this.context.fillRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      if (this.characterImage.complete) {
        this.context.drawImage(this.characterImage, imageX, imageY, imageWidth, imageHeight);
      }
      contentY += imageHeight
    } else if (this.selectedTabIndex === 2) {
      const imageWidth = 32; // 设置图片宽度
      const imageHeight = 32; // 设置图片高度
      const imageX = contentX + (contentWidth - imageWidth) / 2;
      const imageY = contentY + 10;
      // 绘制内容背景
      this.context.fillStyle = '#f5d659';
      this.context.fillRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      if (this.improveBubble.complete) {
        this.context.drawImage(this.improveBubble, imageX, imageY, imageWidth, imageHeight);
      }
      if (this.mushroom.complete) {
        this.context.drawImage(this.mushroom, imageX, contentY + padding + fontSize / 2 + (fontSize + 10) * 3 + 42, imageWidth, imageHeight);
      }
      contentY += imageHeight
    } else if (this.selectedTabIndex === 3) {
      const imageWidth = 32; // 设置图片宽度
      const imageHeight = 32; // 设置图片高度
      const imageX = contentX + (contentWidth - imageWidth) / 2;
      const imageY = contentY + 10;
      // 绘制内容背景
      this.context.fillStyle = '#f5d659';
      this.context.fillRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(contentX, contentY, contentWidth, contentHeight + imageHeight);
      if (this.clickImage.complete) {
        this.context.drawImage(this.clickImage, imageX, imageY, imageWidth, imageHeight);
      }
      contentY += imageHeight
    } else {
      // 绘制内容背景
      this.context.fillStyle = '#f5d659';
      this.context.fillRect(contentX, contentY, contentWidth, contentHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(contentX, contentY, contentWidth, contentHeight);
    }
    // 绘制文本内容
    this.context.fillStyle = 'black';
    if (isAndroid) {
      lines.forEach((line, index) => {
        const textX = contentX + contentWidth / 2; // 左右居中
        const textY = contentY + padding + fontSize / 2 + (fontSize + 10) * index + 12;
        this.context.fillText(line, textX, textY);
      });
    } else {
      lines.forEach((line, index) => {
        const textWidth = this.context.measureText(line).width;
        const textX = contentX + (contentWidth - textWidth) / 2; // 左右居中
        const textY = contentY + padding + fontSize / 2 + (fontSize + 10) * index + 12;
        this.context.fillText(line, textX, textY);
      });
    }
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
    // 检查是否触摸了标签
    this.tabs.forEach((tab, index) => {
      const tabX = 10;
      const tabY = menuButtonInfo.top + 50 * index + 50;
      const tabWidth = this.canvas.width / 4;
      const tabHeight = 40;
      if (touchX >= tabX && touchX <= tabX + tabWidth &&
        touchY >= tabY && touchY <= tabY + tabHeight) {
        // 更新选中的标签索引
        this.selectedTabIndex = index;
      }
    });
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}