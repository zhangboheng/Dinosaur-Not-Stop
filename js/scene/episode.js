import { soundManager, scaleX, scaleY } from '../../utils/global';
export default class Episode {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    soundManager.play('laugh');
    /* 图片加载区域开始 */
    this.imagePaths = ['image/storyparttwo.jpg', 'image/storypartthree.jpg'];
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/storypartone.jpg';
    /* 图片加载区域结束 */
    this.displayTimePerImage = 3000; // 每张图片显示的时间（毫秒）
    this.currentImageIndex = 0;
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
  // 绘制跳过文字，点击可跳过场动画
  drawSkipStage() {
    this.context.save();
    this.context.font = `${20 * scaleX}px Arial`;
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'center';
    this.context.textAlign = 'center';
    this.context.fillText('跳过 >>', this.canvas.width / 2, this.canvas.height * 0.9);
    this.context.restore();
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制跳过文字，点击可跳过场动画
    this.drawSkipStage();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    // 是否跳过
    if (
      touchX >= this.canvas.width / 2 - 40 * scaleX && touchX <= this.canvas.width / 2 + 40 * scaleX &&
      touchY >= this.canvas.height * 0.9 - 20 * scaleY && touchY <= this.canvas.height * 0.9 + 20 * scaleY
    ) {
      clearInterval(this.timerId);
      this.game.switchScene(new this.game.startup(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    clearInterval(this.timerId);
    this.backgroundImage.src = '';
  }
}