import {
  createBackButton
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
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
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 绘制Game One封面
    this.rectImage = new Image();
    this.rectImage.src = 'image/gameone.jpg';
    // 绘制Game Two封面
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
  // 绘制第一关
  drawGameOne() {
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectMaxWidth = 480; // 矩形的最大宽度
    const rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth); // 矩形的宽度
    const rectX = (this.canvas.width - rectWidth) / 2;;
    const rectY = this.backButton.y + this.backButton.height + rectMargin;
    const rectHeight = 190; // 根据需要调整矩形高度
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    // 在矩形中绘制图像
    const imageMargin = 10;
    const imageX = rectX + imageMargin;
    const imageY = rectY + imageMargin;
    const imageWidth = rectWidth - 2 * imageMargin;
    const imageHeight = rectHeight - 40; // 留出空间给文字，根据需要调整
    if (this.rectImage.complete) {
      this.context.drawImage(this.rectImage, imageX, imageY, imageWidth, imageHeight);
    }
    // 给图像添加黑色描边
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3; // 描边宽度，根据需要调整
    this.context.strokeRect(imageX, imageY, imageWidth, imageHeight);
    // 在图片下方绘制文字
    const text = 'Game One 逃出监牢';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight - 15);
  }
  // 绘制第二关
  drawGameTwo() {
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectHeight = 190; // 根据需要调整矩形高度
    const rectMaxWidth = 480; // 矩形的最大宽度
    const rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth); // 矩形的宽度
    const rectX = (this.canvas.width - rectWidth) / 2;;
    const rectY = this.backButton.y + this.backButton.height  + rectHeight + rectMargin * 2;
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    // 在矩形中绘制图像
    const imageMargin = 10;
    const imageX = rectX + imageMargin;
    const imageY = rectY + imageMargin;
    const imageWidth = rectWidth - 2 * imageMargin;
    const imageHeight = rectHeight - 40; // 留出空间给文字，根据需要调整
    if (this.rectImageTwo.complete) {
      this.context.drawImage(this.rectImageTwo, imageX, imageY, imageWidth, imageHeight);
    }
    // 给图像添加黑色描边
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3; // 描边宽度，根据需要调整
    this.context.strokeRect(imageX, imageY, imageWidth, imageHeight);
    // 在图片下方绘制文字
    const text = 'Game Two 逃出乐园';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight - 15);
    this.context.fillStyle = '#00000099';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
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
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectMaxWidth = 480; // 矩形的最大宽度
    this.rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth);; // 矩形的宽度
    this.rectX = (this.canvas.width - this.rectWidth) / 2; // 矩形的X坐标
    this.rectY = this.backButton.y + this.backButton.height + rectMargin; // 矩形的Y坐标
    this.rectHeight = 190; // 矩形的高度
    // 检查触摸点是否在 Game One 内
    if (touchX >= this.rectX && touchX <= this.rectX + this.rectWidth &&
      touchY >= this.rectY && touchY <= this.rectY + this.rectHeight) {
      //this.game.switchScene(new this.game.infinite(this.game));
    }
    // 检查触摸点是否在 Game Two 内
    if (touchX >= this.rectX && touchX <= this.rectX + this.rectWidth &&
      touchY >= this.rectY + 200 && touchY <= this.rectY + 200 + this.rectHeight) {
      this.game.switchScene(new this.game.infinite(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}