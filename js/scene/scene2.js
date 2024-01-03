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
    this.roadImage.src = 'image/yard.jpg'; // 替换为你的道路图片路径
    this.roadHeight = 300; // 道路的高度
    // 陷阱
    this.traps = [];
    this.trapWidth = 24; // 陷阱的宽度
    this.trapInterval = 30; // 陷阱间的最小间隔
    this.nextTrapAt = this.randomInterval(this.trapInterval, this.trapInterval * 2); // 下一个陷阱的初始位置
    // 加载陷阱图片
    this.trapImage = new Image();
    this.trapImage.src = 'image/spikes.png'
    this.trapTimer = 0; // 陷阱生成计时器
    this.trapInterval = 200; // 陷阱生成的间隔（以帧计）
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top - 15, 'image/reply.png', () => {
      this.game.switchScene(new this.game.scene1(this.game));
    });
    // 小恐龙属性
    this.isOnGround = true; // 添加地面接触标志
    this.circleX = 50; // 小恐龙的初始横坐标
    this.circleY = this.canvas.height - this.roadHeight - 50; // 小恐龙的初始纵坐标
    this.circleRadius = 15; // 小恐龙的半径
    this.gravity = 0.5; // 重力加速度
    this.jumpHeight = -10; // 跳跃的初始速度
    this.velocityY = 0; // 纵向速度
    this.canDoubleJump = true; // 添加二段跳的标志
    this.dinoImages = [];
    for (let i = 0; i <= 4; i++) { // 假设有 n 帧动画
      const img = new Image();
      img.src = `image/dino_${i}.png`;
      this.dinoImages.push(img);
    }
    this.currentDinoFrame = 0;
    this.dinoFrameInterval = 5; // 控制帧切换速度
    this.dinoFrameTimer = 0;
    this.dinoJumpUpImage = new Image();
    this.dinoJumpUpImage.src = 'image/dino_jump_up.png';
    this.dinoJumpDownImage = new Image();
    this.dinoJumpDownImage.src = 'image/dino_jump_down.png';
    // 初始化分数
    this.score = 0;
    this.speedIncreasedStageFirst = false; // 标志游戏速度是否已经加快
    this.speedIncreasedStageSecond = false; // 标志游戏速度是否已经加快
    // 消息提示
    this.speedIncreaseMessage = "Speed + 1";
    this.messageDisplayTime = 0; // 消息显示的持续时间（以帧计）
    this.messageDuration = 180;
    // 游戏状态
    this.gameOver = false;
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
        this.messageDisplayTime = this.messageDuration;
      }
      // 如果消息正在显示，减少显示时间
      if (this.messageDisplayTime > 0) {
        this.messageDisplayTime--;
      }
      // 检查分数是否达到12000分，并且尚未加速
      if (this.score >= 10000 && !this.speedIncreasedStageSecond) {
        this.roadSpeed += 1; // 增加道路速度
        this.speedIncreasedStageSecond = true; // 标记已经加速
      }
    }
  }
  randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // 绘制陷阱位置
  drawTraps() {
    const trapBaseY = this.canvas.height - this.roadHeight - this.trapImage.height;
    this.traps.forEach(trap => {
      // 绘制陷阱图片
      if (this.trapImage.complete) {
        this.context.drawImage(this.trapImage, trap.x, trapBaseY);
      }
    });
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
      // 更新计时器
      this.trapTimer++;
      // 当计时器达到间隔时，生成新的陷阱
      if (this.trapTimer >= this.trapInterval) {
        const numberOfTraps = Math.floor(Math.random() * 6) + 1;
        let lastTrapX = this.canvas.width;
        for (let i = 0; i < numberOfTraps; i++) {
          // 为每个陷阱计算随机间隔
          const gap = Math.floor(Math.random() * 60) + 150; // 间隔（50到200像素之间）
          lastTrapX += gap;
          // 添加陷阱
          this.traps.push({
            x: lastTrapX
          });
        }
        // 重置计时器
        this.trapTimer = 0;
      }
    }
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
    // 绘制分数
    this.context.fillStyle = 'black';
    this.context.font = '20px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle'; // 垂直居中
    this.context.fillText('分数: ' + this.score, this.canvas.width / 2, menuButtonInfo.top + 20);
    // 绘制移动的道路
    this.drawRoad();
    // 绘制移动的陷阱
    this.drawTraps();
    // 绘制小恐龙
    let dinoImg;
    if (!this.isOnGround) {
      dinoImg = this.isJumpingUp ? this.dinoJumpUpImage : this.dinoJumpDownImage;
    } else {
      dinoImg = this.dinoImages[this.currentDinoFrame];
    }
    if (dinoImg.complete) {
      this.context.drawImage(dinoImg, this.circleX - dinoImg.width / 2, this.circleY - dinoImg.height / 2 - 20);
    }
    // 如果消息需要显示
    if (this.messageDisplayTime > 0) {
      this.context.fillStyle = 'black';
      this.context.font = '20px Arial';
      this.context.fillText(this.speedIncreaseMessage, this.canvas.width / 2, 100); // 100为提示信息显示的垂直位置
    }
  }
  // 游戏更新事件
  update() {
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
      // 更新小恐龙图片切换
      this.dinoFrameTimer++;
      if (this.dinoFrameTimer >= this.dinoFrameInterval) {
        this.currentDinoFrame = (this.currentDinoFrame + 1) % this.dinoImages.length;
        this.dinoFrameTimer = 0;
      }
      this.velocityY += this.gravity;
      this.circleY += this.velocityY;
      // 根据速度判断小恐龙是在跳起还是在下落
      if (this.velocityY < 0) {
        this.isJumpingUp = true;
      } else if (this.velocityY > 0) {
        this.isJumpingUp = false;
      }
      // 检测与道路的碰撞
      if (this.circleY > this.canvas.height - this.roadHeight - this.circleRadius) {
        this.circleY = this.canvas.height - this.roadHeight - this.circleRadius;
        this.velocityY = 0;
        this.isOnGround = true; // 小恐龙在地面上
        this.canDoubleJump = true; // 重置二段跳标志
      } else {
        this.isOnGround = false; // 小恐龙在空中
      }
      // 检测与陷阱的碰撞
      this.traps.forEach(trap => {
        // 定义三角形尖刺的三个顶点
        const p1 = {
          x: trap.x,
          y: this.canvas.height - this.roadHeight
        };
        const p2 = {
          x: trap.x + this.trapWidth / 2,
          y: this.canvas.height - this.roadHeight - 20
        };
        const p3 = {
          x: trap.x + this.trapWidth,
          y: this.canvas.height - this.roadHeight
        };
        // 检查小恐龙是否与三角形的每条边发生碰撞
        if (this.pointToLineDistance(this.circleX + 10, this.circleY, p1.x, p1.y, p2.x, p2.y) < this.circleRadius ||
          this.pointToLineDistance(this.circleX, this.circleY, p2.x, p2.y, p3.x, p3.y) < this.circleRadius ||
          this.pointToLineDistance(this.circleX - 3, this.circleY, p3.x, p3.y, p1.x, p1.y) < this.circleRadius) {
          this.gameOver = true;
        }
      });
    }
    // 如果游戏结束，显示 Game Over
    if (this.gameOver) {
      // 定义矩形框的尺寸和位置
      const rectWidth = 200;
      const rectHeight = 60;
      const rectX = (this.canvas.width - rectWidth) / 2;
      const rectY = (this.canvas.height - rectHeight) / 2;

      // 绘制黄色矩形框
      this.context.fillStyle = '#f5d659';
      this.context.fillRect(rectX, rectY, rectWidth, rectHeight);

      // 绘制黑色描边
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(rectX, rectY, rectWidth, rectHeight);

      // 设置文本样式
      this.context.fillStyle = 'black';
      this.context.font = 'bold 30px';

      // 计算文本的位置（矩形框中心）
      const textX = this.canvas.width / 2;
      const textY = rectY + rectHeight / 2 + 2;

      // 绘制文本
      this.context.fillText('游戏结束', textX, textY);
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
    // 重置小恐龙位置和状态
    this.circleY = this.canvas.height - this.roadHeight - 50;
    this.velocityY = 0;
    this.isOnGround = true;
    this.gameOver = false;
    // 重置分数
    this.score = 0;
    this.roadSpeed = 2;
    this.speedIncreasedStageFirst = false;
    this.speedIncreasedStageSecond = false;
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
  // 点到线距离公共方法
  pointToLineDistance(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) { // 线段长度不为零
      param = dot / lenSq;
    }
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}