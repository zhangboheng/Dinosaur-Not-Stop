import {
  createBackButton,
  drawRoundedRect
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
    // 设置标题位置
    this.buttonWidth = this.canvas.width - 20;
    this.buttonHeight = 50;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = menuButtonInfo.top + 50;
    // 图片区
    this.wingImage = new Image();
    this.wingImage.src = 'image/wing.png';
    this.moonImage = new Image();
    this.moonImage.src = 'image/moon.png';
    this.drugImage = new Image();
    this.drugImage.src = 'image/drug.png';
    // 道具数量区
    this.wingCount = 0;
    this.getWingAccess = wx.getStorageSync('wingCount');
    this.moonCount = 0;
    this.getMoonAccess = wx.getStorageSync('moonCount');
    this.drugCount = 0;
    this.getDrugAccess = wx.getStorageSync('drugCount');
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
  // 绘制标题
  drawTitle() {
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#f5d659', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('道具列表', this.buttonX + this.buttonWidth / 2, this.buttonY + 20);
    this.context.font = '12px Arial';
    this.context.fillText('通过观看广告兑换后，可在关卡中使用一次', this.buttonX + this.buttonWidth / 2, this.buttonY + 36);
  }
  // 绘制道具区域
  drawToolsArea() {
    // 飞天翼道具绘制
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 60, this.buttonWidth, 80, 10, '#f5d659', 'black', 3);
    if (this.wingImage.complete) {
      this.context.drawImage(this.wingImage, this.buttonX + 10, this.buttonY + 68, 64, 64);
      this.context.fillStyle = 'black';
      this.context.font = 'bold 16px Arial';
      this.context.textAlign = 'left';
      this.context.textBaseline = 'middle';
      if (typeof this.getWingAccess == 'string'){
        this.wingCount = 0;
      } else {
        this.wingCount = this.getWingAccess;
      }
      this.context.fillText(`x${this.wingCount}`,  this.buttonX + this.wingImage.width + 20, this.buttonY + 80);
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('飞天翼',  this.buttonWidth, this.buttonY + 60 + this.wingImage.height/2);
      this.context.font = '12px Arial';
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('短暂飞行能力，开局施放可飞2000米',  this.buttonWidth, this.buttonY + 80 + this.wingImage.height/2);
    }
    // 月球药道具绘制
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 150, this.buttonWidth, 80, 10, '#f5d659', 'black', 3);
    if (this.moonImage.complete) {
      this.context.drawImage(this.moonImage, this.buttonX + 10, this.buttonY + 158, 64, 64);
      this.context.fillStyle = 'black';
      this.context.font = 'bold 16px Arial';
      this.context.textAlign = 'left';
      this.context.textBaseline = 'middle';
      if (typeof this.getMoonAccess == 'string'){
        this.moonCount = 0;
      } else {
        this.moonCount = this.getMoonAccess;
      }
      this.context.fillText(`x${this.moonCount}`,  this.buttonX + this.moonImage.width + 20, this.buttonY + 170);
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('月球药',  this.buttonWidth, this.buttonY + 150 + this.wingImage.height/2);
      this.context.font = '12px Arial';
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('得到地球重力的1/6，1000步内有效',  this.buttonWidth, this.buttonY + 170 + this.wingImage.height/2);
    }
    // 隐身药道具绘制
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 240, this.buttonWidth, 80, 10, '#f5d659', 'black', 3);
    if (this.drugImage.complete) {
      this.context.drawImage(this.drugImage, this.buttonX + 10, this.buttonY + 248, 64, 64);
      this.context.fillStyle = 'black';
      this.context.font = 'bold 16px Arial';
      this.context.textAlign = 'left';
      this.context.textBaseline = 'middle';
      if (typeof this.getDrugAccess == 'string'){
        this.drugCount = 0;
      } else {
        this.drugCount = this.getDrugAccess;
      }
      this.context.fillText(`x${this.drugCount}`,  this.buttonX + this.drugImage.width + 20, this.buttonY + 260);
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('隐身药',  this.buttonWidth, this.buttonY + 240 + this.wingImage.height/2);
      this.context.font = '12px Arial';
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText('得到隐身能力，可规避一次撞击',  this.buttonWidth, this.buttonY + 260 + this.wingImage.height/2);
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标题
    this.drawTitle();
    // 绘制道具区域
    this.drawToolsArea();
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
    // 点击飞天翼区域
    if (touchX >= this.buttonX && touchX <= this.buttonX + this.buttonWidth &&
      touchY >= this.buttonY + 70 && touchY <= this.buttonY + 150) {
      // 后续增加激励广告区域 
      this.wingCount++;
      this.getWingAccess = this.wingCount;
      wx.setStorageSync('wingCount', this.wingCount)
    }
    // 点击月球药区域
    if (touchX >= this.buttonX && touchX <= this.buttonX + this.buttonWidth &&
      touchY >= this.buttonY + 160 && touchY <= this.buttonY + 240) {
      // 后续增加激励广告区域 
      this.moonCount++;
      this.getMoonAccess = this.moonCount;
      wx.setStorageSync('moonCount', this.moonCount)
    }
    // 点击隐身药区域
    if (touchX >= this.buttonX && touchX <= this.buttonX + this.buttonWidth &&
      touchY >= this.buttonY + 250 && touchY <= this.buttonY + 330) {
      // 后续增加激励广告区域 
      this.drugCount++;
      this.getDrugAccess = this.drugCount;
      wx.setStorageSync('drugCount', this.drugCount)
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.wingImage.src = '';
  }
}