import {
  drawRoundedRect
} from '../../utils/button';

export default class Scene1 {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    this.context = game.context;
    this.context.scale(devicePixelRatio, devicePixelRatio);
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 设置开始按钮的基础设置
    this.buttonWidth = 180;
    this.buttonHeight = 50;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = this.canvas.height - 200;
    // 设置玩法说明的基础设置
    this.secondButtonWidth = this.buttonWidth;
    this.secondButtonHeight = this.buttonHeight;
    this.secondButtonX = this.buttonX;
    this.secondButtonY = this.buttonY + this.buttonHeight + 10; // 20 像素的间距
  }
  draw() {
    // 白色背景
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 开始按钮
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#f5d659', 'black', 3);
    drawRoundedRect(this.context, this.secondButtonX, this.secondButtonY, this.secondButtonWidth, this.secondButtonHeight, 10, '#f5d659', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    // 将文本的y坐标设置为按钮的垂直中心
    this.context.fillText('开始游戏', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2 + 2);
    this.context.fillText('玩法说明', this.secondButtonX + this.secondButtonWidth / 2, this.secondButtonY + this.secondButtonHeight / 2 + 2);
    const text = '©行运设计师荣誉出品';
    const x = this.canvas.width / 2;
    const y = this.canvas.height - 40;

    this.context.fillText(text, x, y);
  }
  touchHandler(e) {
    const touch = e.touches[0];
    if (touch.clientX >= this.buttonX && touch.clientX <= this.buttonX + this.buttonWidth &&
      touch.clientY >= this.buttonY && touch.clientY <= this.buttonY + this.buttonHeight) {
      this.game.switchScene(new this.game.scene2(this.game));
    }
    // 检测是否点击了第二个按钮
    if (touch.clientX >= this.secondButtonX && touch.clientX <= this.secondButtonX + this.secondButtonWidth &&
      touch.clientY >= this.secondButtonY && touch.clientY <= this.secondButtonY + this.secondButtonHeight) {
        this.game.switchScene(new this.game.instruction(this.game));
    }
  }
}