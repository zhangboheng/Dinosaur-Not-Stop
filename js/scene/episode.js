let systemInfo = wx.getSystemInfoSync();
import SoundManager from '../../utils/soundManager';
const soundManager = new SoundManager();
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    // 绘制漫画集合
    this.imagePaths = ['image/storyparttwo.jpg', 'image/storypartthree.jpg'];
    this.displayTimePerImage = 3000; // 每张图片显示的时间（毫秒）
    this.currentImageIndex = 0;
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/storypartone.jpg';
    soundManager.play('laugh');
    // 添加定时器，每隔 displayTimePerImage 毫秒切换一次图片
    this.timerId = setInterval(() => {
      this.changeImage();
    }, this.displayTimePerImage);
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 带有透明度的白色背景
    this.context.fillStyle = '#00000050';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  changeImage() {
    this.backgroundImage.src = this.imagePaths[this.currentImageIndex];
    if (this.currentImageIndex == 0) {
      soundManager.play('boom');
    } else if(this.currentImageIndex == 1){
      soundManager.play('scared');
    }
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imagePaths.length;
    if (this.currentImageIndex == 0) {
      clearInterval(this.timerId);
      setTimeout(() => {
        this.game.switchScene(new this.game.startup(this.game));
      }, 2000);
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
  }
  touchHandler(e) {
    console.info('点击了');
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    clearInterval(this.timerId);
    this.backgroundImage.src = '';
  }
}