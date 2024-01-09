import {
  createBackButton,
  drawIconButton
} from '../../utils/button';
import {
  pointToLineDistance
} from '../../utils/algorithm';
import {
  showBoxMessage
} from '../../utils/dialog'
import SoundManager from '../../utils/soundManager'
const soundManager = new SoundManager();
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();

export default class Scene2 {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 加载背景音乐
    this.backgroundMusic = new Audio('audio/back.mp3');
    this.backgroundMusic.loop = true; // 设置音乐循环播放
    // 游戏开始时
    this.backgroundMusic.play();
    // 道路属性
    this.roadX = 0;
    this.roadWidth = this.canvas.width;
    this.roadSpeed = 2; // 道路每帧移动的像素数
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
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
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
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
    this.canTripleJump = false; // 添加三级跳的标志
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
    // 道具显示
    this.powerUp = {
      x: this.canvas.width, // 道具的初始横坐标
      y: this.canvas.height - this.roadHeight - 150, // 道具的初始纵坐标
      width: 42, // 道具的宽度
      height: 42, // 道具的高度
      visible: false, // 道具是否可见
      obtained: false, // 道具是否已被获取
      speed: this.roadSpeed // 道具移动的速度，根据需要调整
    };
    this.powerUpCount = 0;
    this.lastPowerUpScore = 0; // 记录上次道具出现时的分数
    this.powerUpScoreInterval = 10000; // 每隔10000分出现一次道具
    this.powerUpImage = new Image();
    this.powerUpImage.src = 'image/improve-bubble.png';
    this.getPowerUpImage = new Image();
    this.getPowerUpImage.src = 'image/improve.png';
    // 毒蘑菇显示
    this.poisonMushroom = {
      x: this.canvas.width, // 道具的初始横坐标
      y: this.canvas.height - this.roadHeight - 32, // 道具的初始纵坐标
      width: 32, // 毒蘑菇的宽度
      height: 32, // 毒蘑菇的高度
      visible: false, // 毒蘑菇是否可见
      obtained: false, // 毒蘑菇是否已被获取
      speed: this.roadSpeed // 道具移动的速度，根据需要调整
    };
    this.lastMushroomScore = 0;  // 记录上次蘑菇出现时的分数
    // 加载毒蘑菇图片
    this.poisonMushroomImage = new Image();
    this.poisonMushroomImage.src = 'image/mushroom.png';
    this.poisonMushroomEffectDuration = 0;
    // 加载脚印图片
    this.dinoFootprintImage = new Image();
    this.dinoFootprintImage.src = 'image/footprint.png';
    // 初始化分数
    this.score = 0;
    this.speedIncreasedStageFirst = false; // 标志游戏速度是否已经加快
    this.speedIncreasedStageSecond = false; // 标志游戏速度是否已经加快
    this.speedIncreasedStageThird = false; // 标志游戏速度是否已经加快
    // 消息提示
    this.speedIncreaseMessage = "Speed+1";
    this.messageDisplayTime = 0; // 消息显示的持续时间（以帧计）
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 游戏状态
    this.gameOver = false;
  }
  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundX, 0, this.canvas.width, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundX < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
  // 更新背景状态
  updateBackground() {
    this.backgroundX -= this.backgroundSpeed;
    if (this.backgroundX <= -this.canvas.width) {
      this.backgroundX = 0;
    }
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制分数
  drawScore() {
    const iconSize = 24; // 图标大小
    const iconPadding = 10; // 图标与分数之间的间距
    // 计算分数文本的宽度
    this.context.font = '20px Arial'; // 确保设置的字体与绘制时相同
    const textWidth = this.context.measureText(this.score).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top + 6; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20; // 分数的y坐标
    // 绘制图标
    if (this.dinoFootprintImage.complete) {
        this.context.drawImage(this.dinoFootprintImage, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.fillStyle = 'black';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score, scoreX, scoreY);
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
    // 检查分数是否达到10000分，并且尚未加速
    if (this.score >= 10000 && !this.speedIncreasedStageSecond) {
      this.roadSpeed += 1; // 增加道路速度
      this.speedIncreasedStageSecond = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 检查分数是否达到18000分，并且尚未加速
    if (this.score >= 18000 && !this.speedIncreasedStageThird) {
      this.roadSpeed += 1; // 增加道路速度
      this.speedIncreasedStageThird = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 如果消息正在显示，减少显示时间
    if (this.messageDisplayTime > 0) {
      this.messageDisplayTime--;
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
    this.roadX -= this.roadSpeed;
    if (this.roadX <= -this.roadWidth) {
      this.roadX = 0;
    }
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
  // 绘制小恐龙
  drawDino() {
    let dinoImg;
    if (!this.isOnGround) {
      dinoImg = this.isJumpingUp ? this.dinoJumpUpImage : this.dinoJumpDownImage;
    } else {
      dinoImg = this.dinoImages[this.currentDinoFrame];
    }
    if (dinoImg.complete) {
      this.context.drawImage(dinoImg, this.circleX - dinoImg.width / 2, this.circleY - dinoImg.height / 2 - 20);
    }
  }
  // 更新小恐龙
  updateDino() {
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
      if (pointToLineDistance(this.circleX + 10, this.circleY, p1.x, p1.y, p2.x, p2.y) < this.circleRadius ||
        pointToLineDistance(this.circleX, this.circleY, p2.x, p2.y, p3.x, p3.y) < this.circleRadius ||
        pointToLineDistance(this.circleX - 3, this.circleY, p3.x, p3.y, p1.x, p1.y) < this.circleRadius) {
        soundManager.play('crack');
        this.gameOver = true;
        // 游戏结束时
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0; // 重置音乐到开始位置
        soundManager.play('end', 200);
        
      }
    });
    // 检查小恐龙是否与道具碰撞
    if (this.powerUp.visible && !this.powerUp.obtained) {
      const dinoRect = {
        x: this.circleX - this.circleRadius,
        y: this.circleY - this.circleRadius,
        width: this.circleRadius * 2,
        height: this.circleRadius * 2
      };
      const powerUpRect = {
        x: this.powerUp.x,
        y: this.powerUp.y,
        width: this.powerUp.width,
        height: this.powerUp.height
      };
      if (dinoRect.x < powerUpRect.x + powerUpRect.width &&
        dinoRect.x + dinoRect.width > powerUpRect.x &&
        dinoRect.y < powerUpRect.y + powerUpRect.height &&
        dinoRect.y + dinoRect.height > powerUpRect.y) {
        this.powerUp.obtained = true;
        this.powerUpCount = 1; // 设置道具数量为1
        this.canTripleJump = true; // 允许三级跳
        soundManager.play('get');
      }
    }
    // 检查小恐龙是否与毒蘑菇碰撞
    if (this.poisonMushroom.visible && !this.poisonMushroom.obtained) {
      const dinoRect = {
        x: this.circleX - this.circleRadius,
        y: this.circleY - this.circleRadius,
        width: this.circleRadius * 2,
        height: this.circleRadius * 2
      };
      const mushroomRect = {
        x: this.poisonMushroom.x,
        y: this.poisonMushroom.y,
        width: this.poisonMushroom.width,
        height: this.poisonMushroom.height
      };
      if (dinoRect.x < mushroomRect.x + mushroomRect.width &&
        dinoRect.x + dinoRect.width > mushroomRect.x &&
        dinoRect.y < mushroomRect.y + mushroomRect.height &&
        dinoRect.y + dinoRect.height > mushroomRect.y) {
        // 碰撞发生
        this.poisonMushroom.obtained = true;
        this.originalGravity = this.gravity;
        this.gravity /= 2; // 举例，将重力加倍
        this.poisonMushroomEffectDuration = 300; // 毒蘑菇效果持续时间（以帧为单位）
        soundManager.play('get');
      }
    }
  }
  // 绘制道具
  drawProps() {
    if (this.score > 500 && !this.powerUp.obtained) {
      this.powerUp.visible = true;
      if (this.powerUpImage.complete && this.powerUp.visible) {
        this.context.drawImage(this.powerUpImage, this.powerUp.x, this.powerUp.y, this.powerUp.width, this.powerUp.height);
      }
    }
    if (this.powerUpCount > 0) {
      // 绘制道具图片
      if (this.powerUpImage.complete) {
        this.context.drawImage(this.getPowerUpImage, menuButtonInfo.right - this.getPowerUpImage.width - 40, menuButtonInfo.top + 40, 24, 24);
      }
      // 绘制道具数量
      this.context.fillStyle = 'black';
      this.context.font = '20px Arial';
      this.context.fillText(' X' + this.powerUpCount, menuButtonInfo.right - this.getPowerUpImage.width, menuButtonInfo.top + 55);
    }
  }
  // 更新道具状态
  updateProps() {
    if (this.score > 500 && !this.powerUp.obtained) {
      this.powerUp.x -= this.powerUp.speed; // 向左移动道具
      if (this.powerUp.x + this.powerUp.width < 0) { // 如果道具完全离开屏幕
        this.powerUp.visible = false; // 可以选择隐藏道具或者重置位置
      }
    }
    if (this.score - this.lastPowerUpScore >= this.powerUpScoreInterval && !this.powerUp.obtained) {
      this.powerUp.visible = true;
      this.powerUp.x = this.canvas.width; // 重置道具位置到屏幕右边缘
      this.lastPowerUpScore = this.score; // 更新上次道具出现的分数
    }
  }
  // 绘制毒蘑菇
  drawMushroom() {
    if (this.score >= 1000 && !this.poisonMushroom.obtained) {
      this.poisonMushroom.visible = true;
      if (this.poisonMushroomImage.complete) {
        this.context.drawImage(this.poisonMushroomImage, this.poisonMushroom.x, this.poisonMushroom.y, this.poisonMushroom.width, this.poisonMushroom.height);
      }
    }
  }
  // 更新毒蘑菇状态
  updateMushroom() {
    // 监测毒蘑菇向左移动
    if (this.score >= 1000 && !this.poisonMushroom.obtained) {
      this.poisonMushroom.x -= this.poisonMushroom.speed;
      if (this.poisonMushroom.x + this.poisonMushroom.width < 0) {
        this.poisonMushroom.visible = false;
      }
    }
    // 监测毒蘑菇消失时效时间
    if (this.poisonMushroomEffectDuration > 0) {
      this.poisonMushroomEffectDuration--;
      // 绘制蘑菇图片
      if (this.poisonMushroomImage.complete) {
        this.context.drawImage(this.poisonMushroomImage, menuButtonInfo.right - this.poisonMushroomImage.width - 40, menuButtonInfo.top + 70, 24, 24);
      }
      // 绘制蘑菇数量
      this.context.fillStyle = 'black';
      this.context.font = '20px Arial';
      this.context.fillText(' X1', menuButtonInfo.right - this.poisonMushroomImage.width, menuButtonInfo.top + 85);
      if (this.poisonMushroomEffectDuration === 0) {
        this.gravity = this.originalGravity;
      }
    }
    if (Math.random() < 0.382 && this.score - this.lastMushroomScore >= 4000) {
      this.poisonMushroom.obtained = false;
      this.poisonMushroom.visible = true;  // 确保蘑菇是可见的
      this.poisonMushroom.x = this.canvas.width;
      this.lastMushroomScore = this.score; // 更新上次蘑菇出现的分数
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    if (this.messageDisplayTime > 0) {
      showBoxMessage(this.context, this.speedIncreaseMessage, this.canvas.width / 2, this.canvas.height / 2);
    }
  }
  // 画面全部绘制
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制分数
    this.drawScore();
    // 绘制移动的道路
    this.drawRoad();
    // 绘制移动的陷阱
    this.drawTraps();
    // 绘制小恐龙
    this.drawDino();
    // 绘制道具显示
    this.drawProps();
    // 绘制毒蘑菇
    this.drawMushroom();
    // 如果消息需要显示
    this.drawMessageBox();
  }
  // 游戏更新事件
  update() {
    if (!this.gameOver) {
      // 更新背景变化
      this.updateBackground();
      // 更新道路变化
      this.updateRoad();
      // 更新陷阱变化
      this.updateTraps();
      // 更新道具变化
      this.updateProps();
      // 更新毒蘑菇
      this.updateMushroom();
      // 更新小恐龙图片切换
      this.updateDino();
    } else {
      showBoxMessage(this.context, "游戏结束", this.canvas.width / 2, this.canvas.height / 2 - 70, '#f5ac11');
      this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2);
      this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 70);
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
      // 游戏结束时
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0; // 重置音乐到开始位置
      return
    }
    if (!this.gameOver && (this.isOnGround || this.canDoubleJump || (this.canTripleJump && !this.isOnGround))) {
      this.velocityY = this.jumpHeight;
      if (!this.isOnGround) {
        if (this.canDoubleJump) {
          this.canDoubleJump = false; // 标记二段跳已使用
        } else if (this.canTripleJump) {
          this.canTripleJump = false; // 标记三段跳已使用
          this.powerUpCount = 0; // 使用后将道具数量设为0
          this.powerUp.obtained = false; // 获得道具
          this.powerUp.visible = false; // 隐藏道具
          this.powerUp.x = -80;
        }
      }
      soundManager.play('jump');
      this.isOnGround = false; // 小恐龙起跳，不再在地面上
    }
    if (this.gameOver) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        this.resetGame()
      }
      if (touchX >= this.buttonShareInfo.x && touchX <= this.buttonShareInfo.x + this.buttonShareInfo.width &&
        touchY >= this.buttonShareInfo.y && touchY <= this.buttonShareInfo.y + this.buttonShareInfo.height) {
        wx.shareAppMessage({
          title: '小恐龙不要停！太难了吧',
          imageUrl: 'image/background.jpg' // 分享图片的路径
        });
      }
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
    this.gravity = 0.5;
    this.speedIncreasedStageFirst = false;
    this.speedIncreasedStageSecond = false;
    this.speedIncreasedStageThird = false;
    this.powerUp = {
      x: this.canvas.width, // 道具的初始横坐标
      y: this.canvas.height - this.roadHeight - 150, // 道具的初始纵坐标
      width: 42, // 道具的宽度
      height: 42, // 道具的高度
      visible: false, // 道具是否可见
      obtained: false, // 道具是否已被获取
      speed: this.roadSpeed // 道具移动的速度，根据需要调整
    };
    this.powerUpCount = 0;
    this.lastPowerUpScore = 0; // 记录上次道具出现时的分数
    this.powerUpScoreInterval = 10000; // 每隔10000分出现一次道具
    this.canTripleJump = false; // 标记三段跳已使用
    this.poisonMushroom = {
      x: this.canvas.width, // 道具的初始横坐标
      y: this.canvas.height - this.roadHeight - 32, // 道具的初始纵坐标
      width: 32, // 毒蘑菇的宽度
      height: 32, // 毒蘑菇的高度
      visible: false, // 毒蘑菇是否可见
      obtained: false, // 毒蘑菇是否已被获取
      speed: this.roadSpeed // 道具移动的速度，根据需要调整
    };
    this.poisonMushroomEffectDuration = 0;
    this.lastMushroomScore = 0;
    // 游戏开始时
    this.backgroundMusic.play();
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}