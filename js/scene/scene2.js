import {
  createBackButton
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();

export default class Scene2 {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    this.context = game.context;
    this.context.scale(devicePixelRatio, devicePixelRatio);
    // 道路属性
    this.roadX = 0;
    this.roadWidth = this.canvas.width;
    this.roadSpeed = 2; // 道路每帧移动的像素数
    // 加载背景图片
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/gamebackground.jpg'; // 替换为你的背景图片路径
    this.backgroundX = 0; // 背景图片的初始 X 坐标
    this.backgroundSpeed = 2; // 背景移动速度，可以调整以匹配道路速度
    // 加载道路图片
    this.roadImage = new Image();
    this.roadImage.src = 'image/yard.png'; // 替换为你的道路图片路径
    this.roadHeight = 60; // 道路的高度
    // 陷阱
    this.traps = [];
    this.trapWidth = 10; // 陷阱的宽度
    this.trapInterval = 30; // 陷阱间的最小间隔
    this.nextTrapAt = this.randomInterval(this.trapInterval, this.trapInterval * 2); // 下一个陷阱的初始位置
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top - 15, 'image/reply.png', () => {
      this.game.switchScene(new this.game.scene1(this.game));
    });
    // 圆球属性
    this.isOnGround = true; // 添加地面接触标志
    this.circleX = 50; // 圆球的初始横坐标
    this.circleY = this.canvas.height - this.roadHeight - 50; // 圆球的初始纵坐标
    this.circleRadius = 15; // 圆球的半径
    this.gravity = 0.5; // 重力加速度
    this.jumpHeight = -10; // 跳跃的初始速度
    this.velocityY = 0; // 纵向速度
    this.canDoubleJump = true; // 添加二段跳的标志
    // 初始化分数
    this.score = 0;
    this.speedIncreasedStageFirst = false; // 标志游戏速度是否已经加快
    this.speedIncreasedStageSecond = false; // 标志游戏速度是否已经加快
    // 游戏状态
    this.gameOver = false;
  }
  // 更新道路状态
  updateRoad() {
    if (!this.gameOver) {
      this.score += this.roadSpeed;
      this.roadX -= this.roadSpeed;
      if (this.roadX <= -this.roadImage.width) {
        this.roadX = 0;
      }
      // 检查分数是否达到6000分，并且尚未加速
      if (this.score >= 6000 && !this.speedIncreasedStageFirst) {
        this.roadSpeed += 1; // 增加道路速度
        this.speedIncreasedStageFirst = true; // 标记已经加速
      }
      // 检查分数是否达到12000分，并且尚未加速
      if (this.score >= 10000 && !this.speedIncreasedStageSecond) {
        this.roadSpeed += 0.5; // 增加道路速度
        this.speedIncreasedStageSecond = true; // 标记已经加速
      }
    }
  }
  // 绘制道路
  drawRoad() {
    if (this.roadImage.complete) {
      const roadY = this.canvas.height - this.roadHeight - 10;
      this.context.drawImage(this.roadImage, this.roadX, roadY);
      if (this.roadX < 0) {
        this.context.drawImage(this.roadImage, this.roadX + this.roadWidth, roadY);
      }
    }
  }
  randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // 更新陷阱位置
  updateTraps() {
    if (!this.gameOver) {
      this.traps.forEach(trap => {
        trap.x -= this.roadSpeed;
      });
      // 移除已经离开屏幕的陷阱
      this.traps = this.traps.filter(trap => trap.x + this.trapWidth > 0);
      // 根据道路位置和间隔添加新陷阱
      if (this.roadX <= -this.nextTrapAt) {
        // 生成 10 到 30 之间的随机间隔
        const randomGap = Math.floor(Math.random() * 30) + 30; // 产生 10 到 30 之间的数
        const randomNumber = [1.2, 2, 3, 4][Math.floor(Math.random() * 4)]
        this.traps.push({
          x: this.canvas.width
        }); // 陷阱从屏幕右侧出现
        this.nextTrapAt = this.canvas.width - this.randomInterval(randomGap, randomGap * randomNumber);
      }
    }
  }
  // 绘制陷阱位置
  drawTraps() {
    this.context.fillStyle = 'black';
    this.traps.forEach(trap => {
      this.context.fillRect(trap.x, this.canvas.height - this.roadHeight, this.trapWidth, this.roadHeight);
    });
  }
  // 画面全部绘制
  draw() {
    // 绘制白色背景
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundX, 0, this.canvas.width, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundX < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
      }
    }
    // 绘制返回按钮
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
    // 绘制移动的道路
    this.drawRoad();
    // 绘制移动的陷阱
    this.drawTraps();
    // 绘制圆球
    if (!this.gameOver) {
      this.context.beginPath();
      this.context.arc(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2);
      this.context.fillStyle = 'blue';
      this.context.fill();
    } else {
      this.context.beginPath();
      this.context.arc(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2);
      this.context.fillStyle = 'blue';
      this.context.fill();
    }
    // 绘制分数
    this.context.fillStyle = 'black';
    this.context.font = '20px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle'; // 垂直居中
    this.context.fillText('分数: ' + this.score, this.canvas.width / 2, menuButtonInfo.top + 20);
  }
  update() {
    // 更新圆球位置
    if (!this.gameOver) {
      this.backgroundX -= this.backgroundSpeed;
      if (this.backgroundX <= -this.canvas.width) {
        this.backgroundX = 0;
      }
      this.updateRoad();
      this.roadX -= this.roadSpeed;
      if (this.roadX <= -this.roadWidth) {
        this.roadX = 0;
      }
      this.updateTraps();
      this.velocityY += this.gravity;
      this.circleY += this.velocityY;
      // 检测与道路的碰撞
      if (this.circleY > this.canvas.height - this.roadHeight - this.circleRadius) {
        this.circleY = this.canvas.height - this.roadHeight - this.circleRadius;
        this.velocityY = 0;
        this.isOnGround = true; // 圆球在地面上
        this.canDoubleJump = true; // 重置二段跳标志
      } else {
        this.isOnGround = false; // 圆球在空中
      }
      // 检测与陷阱的碰撞
      this.traps.forEach(trap => {
        if (this.circleX + this.circleRadius - 10 > trap.x &&
          this.circleX - this.circleRadius + 10 < trap.x + this.trapWidth && this.circleY + this.circleRadius >= this.canvas.height - this.roadHeight) {
          this.gameOver = true;
        }
      });
    }
    // 如果游戏结束，显示 Game Over
    if (this.gameOver) {
      // 设置文本样式
      this.context.fillStyle = 'red';
      this.context.font = '30px Arial';

      // 计算文本的位置
      const textX = this.canvas.width / 2;
      const textY = this.canvas.height / 2;

      // 绘制文本
      this.context.fillText('Game Over', textX, textY);
    }
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;

    const btn = this.backButton;
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      this.gameOver = false;
    }
    // 游戏结束，点击屏幕重置游戏
    if (this.gameOver) {
      this.resetGame();
      return; // 返回，不再执行后续代码
    }
    if (!this.gameOver && (this.isOnGround || this.canDoubleJump)) {
      this.velocityY = this.jumpHeight;
      // 如果已经在空中，则标记为已使用二段跳
      if (!this.isOnGround) {
        this.canDoubleJump = false;
      }
      this.isOnGround = false; // 球体起跳，不再在地面上
    }
  }
  // 游戏重制
  resetGame() {
    // 重置道路和陷阱位置
    this.roadX = 0;
    this.traps = [];

    // 重置圆球位置和状态
    this.circleY = this.canvas.height - this.roadHeight - 50;
    this.velocityY = 0;
    this.isOnGround = true;
    this.gameOver = false;
    // 重置分数
    this.score = 0;
    this.roadSpeed = 2; // 重置道路速度为初始值
    this.speedIncreasedStageFirst = false; // 重置速度增加标志
    this.speedIncreasedStageSecond = false;
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}