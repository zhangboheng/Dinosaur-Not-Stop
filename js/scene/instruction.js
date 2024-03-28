import {
  createBackButton
} from '../../utils/button';
import {
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 图片加载区域开始 */
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    this.characterImage = new Image();
    this.characterImage.src = 'image/dino_0.png';
    this.improveBubble = new Image();
    this.improveBubble.src = 'image/improve-bubble.png'
    this.mushroom = new Image();
    this.mushroom.src = 'image/mushroom.png';
    this.packageBox = new Image();
    this.packageBox.src = 'image/woodenbox.png';
    this.packageStackBox = new Image();
    this.packageStackBox.src = 'image/woodenstackbox.png';
    this.barrierCustom = new Image();
    this.barrierCustom.src = 'image/barrier.png';
    this.dinosaurBarrier = new Image();
    this.dinosaurBarrier.src = 'image/prisonbarrier.png';
    this.roadSpike = new Image();
    this.roadSpike.src = 'image/spikes.png';
    this.cobblestoneImage = new Image();
    this.cobblestoneImage.src = 'image/cobblestone.png';
    this.doublestoneImage = new Image();
    this.doublestoneImage.src = 'image/doublestone.png';
    this.clickImage = new Image();
    this.clickImage.src = 'image/click.png';
    /* 图片加载区域结束 */
    /* 事件监听区域开始 */
    wx.onTouchStart(this.handleTouchStart.bind(this));
    wx.onTouchMove(this.handleTouchMove.bind(this));
    wx.onTouchEnd(this.handleTouchEnd.bind(this));
    /* 事件监听区域结束 */
    // 定义标签和对应的内容
    this.tabs = [{
        title: "背景",
        content: "一个与世隔绝的神秘岛屿\n科学家将恐龙复活\n“侏罗纪乐园”就此诞生\n乐园不仅是恐龙的家园\n也是旅游胜地\n游客们在这里观察和学习\n可以体验激动人心的旅程\n然而，某天\n一个实验室突发事故\n引发了连锁反应\n安全系统开始失控\n一些恐龙逃出监牢\n整个乐园变成危险之地\n我们的主角小棘龙\n被困在了乐园\n为了找到它的家人\n逃离这个疯狂的乐园\n快跑\n不要停！"
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
    this.touchStartY = 0;
    this.scrollOffsetY = 0;
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
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
    const fontSize = 16 * scaleX;
    this.context.save();
    this.context.font = `bold ${fontSize}px Arial`;
    this.tabs.forEach((tab, index) => {
      // 标签的尺寸和位置
      const tabX = 10;
      const tabY = menuButtonInfo.top + 50 * index * scaleY + 50;
      const tabWidth = this.canvas.width / 4;
      const tabHeight = 40 * scaleY;
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
      // 使用 TextMetrics 获取文字高度
      const textMetrics = this.context.measureText(tab.title);
      const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      // 文本垂直居中
      const textY = tabY + (tabHeight - textHeight) / 2 + textMetrics.actualBoundingBoxAscent; // 精确垂直居中
      // 绘制文本
      this.context.fillStyle = 'black';
      this.context.fillText(tab.title, textX, textY);
    });
    this.context.restore();
  }
  // 绘制选中的内容
  drawTabsContent() {
    const fontSize = 16 * scaleX; // 字体大小
    const padding = 10 * scaleY; // 文本周围的内边距
    this.context.save();
    this.context.font = `${fontSize}px Arial`; // 设置字体
    // 获取选中标签的内容并分割为行
    const lines = this.tabs[this.selectedTabIndex].content.split('\n');
    // 内容的位置和尺寸
    let contentX = this.canvas.width / 4 + 20 * scaleX;
    let contentY = menuButtonInfo.top + 50;
    const contentWidth = this.canvas.width - contentX - 10 * scaleX;
    const contentHeight = this.canvas.height - (menuButtonInfo.top + 50 * scaleY) * 2;
    const imageWidth = 32 * scaleY; // 设置图片宽度
    const imageHeight = 32 * scaleY; // 设置图片高度
    const imageX = contentX + (contentWidth - imageWidth) / 2;
    const imageY = contentY + 10 * scaleY;
    // 绘制内容背景
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(contentX, contentY, contentWidth, contentHeight);
    // 绘制内容边框
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(contentX, contentY, contentWidth, contentHeight);
    // 设置剪切区域，确保文本只在矩形内显示
    this.context.beginPath();
    this.context.rect(contentX, contentY, contentWidth, contentHeight);
    this.context.clip();
    // 根据选中的标签决定是否绘制图片
    if (this.selectedTabIndex === 1) {
      if (this.characterImage.complete) {
        this.context.drawImage(this.characterImage, imageX, imageY + this.scrollOffsetY, imageWidth, imageHeight);
      }
      contentY += imageHeight
    } else if (this.selectedTabIndex === 2) {
      if (this.improveBubble.complete) {
        this.context.drawImage(this.improveBubble, imageX, imageY + this.scrollOffsetY, imageWidth, imageHeight);
      }
      if (this.mushroom.complete) {
        this.context.drawImage(this.mushroom, imageX, contentY + padding * 2 + (fontSize + padding) * 4 + 10 * scaleY + this.scrollOffsetY, imageWidth, imageHeight);
      }
      contentY += imageHeight
    } else if (this.selectedTabIndex === 3) {
      if (this.clickImage.complete) {
        this.context.drawImage(this.clickImage, imageX, imageY + this.scrollOffsetY, imageWidth, imageHeight);
      }
      contentY += imageHeight
    }
    // 绘制文本内容
    this.context.fillStyle = 'black';
    lines.forEach((line, index) => {
      const textWidth = this.context.measureText(line).width;
      const textX = contentX + (contentWidth - textWidth) / 2; // 左右居中
      const textY = contentY + padding * 2 + (fontSize + padding) * index + padding;
      this.context.fillText(line, textX, textY + this.scrollOffsetY);
    });
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
      const tabY = menuButtonInfo.top + 50 * index * scaleY + 50;
      const tabWidth = this.canvas.width / 4;
      const tabHeight = 40 * scaleY;
      if (touchX >= tabX && touchX <= tabX + tabWidth &&
        touchY >= tabY && touchY <= tabY + tabHeight) {
        // 更新选中的标签索引
        this.selectedTabIndex = index;
      }
    });
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
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.characterImage.src = '';
    this.improveBubble.src = '';
    this.mushroom.src = '';
    this.packageBox.src = '';
    this.packageStackBox.src = '';
    this.barrierCustom.src = '';
    this.dinosaurBarrier.src = '';
    this.roadSpike.src = '';
    this.cobblestoneImage.src = '';
    this.doublestoneImage.src = '';
    this.clickImage.src = '';
    // 移除触摸事件监听器
    wx.offTouchStart(this.handleTouchStart.bind(this));
    wx.offTouchMove(this.handleTouchMove.bind(this));
    wx.offTouchEnd(this.handleTouchEnd.bind(this));
    // 重置状态
    this.touchStartY = 0;
    this.scrollOffsetY = 0;
    this.selectedTabIndex = 0;
  }
}