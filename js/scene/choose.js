import {
  createBackButton,
  drawRoundedRectWithTail
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Choose {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    this.getGameTwoAccess = wx.getStorageSync('infiniteEnabled');
    // 设置提示关注
    this.showTips = wx.getStorageSync('showTips') !== false; // 如果没有设置，默认显示提示
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 绘制逃出监牢封面
    this.rectImage = new Image();
    this.rectImage.src = 'image/gameone.jpg';
    // 绘制逃出乐园封面
    this.rectImageTwo = new Image();
    this.rectImageTwo.src = 'image/gametwo.jpg';
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
  // 绘制加入我的小程序提示
  drawTips() {
    if (!this.showTips) return; // 如果用户选择不显示提示，则跳过
    // 提示框属性
    const rectWidth = 140;
    const rectHeight = 30;
    const borderRadius = 10;
    const tailWidth = 20; // 尾巴的宽度
    const tailHeight = 28; // 尾巴的高度
    const rectX = menuButtonInfo.right - menuButtonInfo.width - rectWidth - tailWidth;
    const rectY = menuButtonInfo.top; // 可以根据需要调整
    // 绘制半透明矩形
    this.context.fillStyle = '#f5d659'; // 增加透明度
    drawRoundedRectWithTail(this.context, rectX, rectY, rectWidth, rectHeight, borderRadius, tailWidth, tailHeight, 'right');
    this.context.fill();
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    drawRoundedRectWithTail(this.context, rectX, rectY, rectWidth, rectHeight, borderRadius, tailWidth, tailHeight);
    this.context.stroke();
    // 绘制提示文本
    this.context.fillStyle = 'black';
    this.context.font = '14px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('点击加入我的小程序', rectX + rectWidth / 2, rectY + rectHeight / 2 + 2);
  }
  drawGameOne() {
    // 定义关卡布局参数
    const rectMargin = 10;
    const rectHeightPercentage = 0.4; // 关卡占屏幕高度的比例
    const rectWidthPercentage = 1; // 关卡占屏幕宽度的比例
    // 计算关卡在当前屏幕尺寸下的实际大小
    const rectWidth = this.canvas.width * rectWidthPercentage - 2 * rectMargin;
    const rectHeight = this.canvas.height * rectHeightPercentage - 2 * rectMargin;

    // 计算关卡在屏幕中的位置
    const rectX = (this.canvas.width - rectWidth) / 2;
    const rectY = menuButtonInfo.bottom + rectMargin;
    // 绘制关卡背景
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight + 24);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight + 24);
    // 绘制关卡图像
    const imageX = rectX + rectMargin;
    const imageY = rectY + rectMargin;
    const imageWidth = rectWidth - 2 * rectMargin;
    const imageHeight = rectHeight - 2 * rectMargin;
    if (this.rectImage.complete) {
      this.context.drawImage(this.rectImage, imageX, imageY, imageWidth, imageHeight);
    }
    // 绘制关卡标题
    const text = '逃出监牢';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight + rectMargin);
  }
  drawGameTwo() {
    // 定义关卡布局参数
    const rectMargin = 10;
    const rectHeightPercentage = 0.4; // 关卡占屏幕高度的比例
    const rectWidthPercentage = 1; // 关卡占屏幕宽度的比例
    // 计算关卡在当前屏幕尺寸下的实际大小
    const rectWidth = this.canvas.width * rectWidthPercentage - 2 * rectMargin;
    const rectHeight = this.canvas.height * rectHeightPercentage - 2 * rectMargin;
    // 计算关卡在屏幕中的位置
    const rectX = (this.canvas.width - rectWidth) / 2;
    const rectY = rectHeight + menuButtonInfo.bottom + rectMargin * 2 + 24;
    // 绘制关卡背景
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight + 24);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight + 24);
    // 绘制关卡图像
    const imageX = rectX + rectMargin;
    const imageY = rectY + rectMargin;
    const imageWidth = rectWidth - 2 * rectMargin;
    const imageHeight = rectHeight - 2 * rectMargin;
    if (this.rectImageTwo.complete) {
      this.context.drawImage(this.rectImageTwo, imageX, imageY, imageWidth, imageHeight);
    }
    // 绘制关卡标题
    const text = '逃出乐园';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight + rectMargin);
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制加入我的小程序提示
    this.drawTips();
    // 绘制第一关
    this.drawGameOne();
    // 绘制第二关
    this.drawGameTwo();
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
    const rectMargin = 10;
    const rectHeightPercentage = 0.4; // 关卡占屏幕高度的比例
    const rectWidthPercentage = 1; // 关卡占屏幕宽度的比例
    const rectWidth = this.canvas.width * rectWidthPercentage - 2 * rectMargin;
    const rectHeight = this.canvas.height * rectHeightPercentage - 2 * rectMargin;
    const rectX = (this.canvas.width - rectWidth) / 2;
    const rectY = menuButtonInfo.bottom + rectMargin;
    // 点击第二关卡
    if (touchX >= rectX && touchX <= rectX + rectWidth &&
      touchY >= rectY && touchY <= rectY + rectHeight) {
      this.game.switchScene(new this.game.prison(this.game));
      return;
    }
    // 点击第二关卡
    const rectY2 = rectY + rectHeight + 2 * rectMargin + 24; // 第二关卡的Y坐标
    if (touchX >= rectX && touchX <= rectX + rectWidth &&
      touchY >= rectY2 && touchY <= rectY2 + rectHeight) {
      this.game.switchScene(new this.game.infinite(this.game));
      return;
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}