import {
  createBackButton,
  drawIconButton
} from '../../utils/button';
import {
  doPolygonsIntersect,
  updateHighScores
} from '../../utils/algorithm';
import {
  showBoxMessage
} from '../../utils/dialog';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
const soundManager = new SoundManager();
const backgroundMusic = new BackgroundMusic();
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
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.playBackgroundMusic();
    // 道路属性
    this.roadX = 0;
    this.roadWidth = this.canvas.width;
    this.roadSpeed = 2; // 道路每帧移动的像素数
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    // 加载背景图片
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/prisonback.jpg'; // 替换为你的背景图片路径
    this.backgroundX = 0; // 背景图片的初始 X 坐标
    this.backgroundSpeed = this.roadSpeed; // 背景移动速度，可以调整以匹配道路速度
    // 加载道路图片
    this.roadImage = new Image();
    this.roadImage.src = 'image/prison.jpg'; // 替换为你的道路图片路径
    this.roadHeight = 290; // 道路的高度
    // 陷阱
    this.traps = [];
    this.trapWidth = 32; // 陷阱的宽度
    this.trapHeight = 32; // 陷阱的高度
    this.trapInterval = 48; // 陷阱间的最小间隔
    this.nextTrapAt = this.randomInterval(this.trapInterval, this.trapInterval * 2); // 下一个陷阱的初始位置
    // 加载陷阱图片
    this.trapImage = new Image();
    this.trapImage.src = 'image/woodenbox.png'
    this.trapTimer = 0; // 陷阱生成计时器
    this.trapInterval = 200; // 陷阱生成的间隔（以帧计）
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.choose(this.game));
    });
    // 小恐龙属性
    this.isOnGround = true; // 添加地面接触标志
    this.circleX = 50; // 小恐龙的初始横坐标
    this.circleY = this.canvas.height - this.roadHeight - 50; // 小恐龙的初始纵坐标
    this.circleRadius = 15; // 小恐龙的半径
    this.gravity = 0.4; // 重力加速度
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
    // 加载脚印图片
    this.dinoFootprintImage = new Image();
    this.dinoFootprintImage.src = 'image/footprint.png';
    // 初始化分数
    this.score = 0;
    this.speedIncreasedStageFirst = false; // 标志游戏速度是否已经加快
    // 消息提示
    this.speedIncreaseMessage = "Speed+1";
    this.messageDisplayTime = 0; // 消息显示的持续时间（以帧计）
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 加载成功图片
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png'
    // 加载失败图片
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png'
    // 游戏状态
    this.gameOver = false;
    // 游戏通关状态
    this.isLevelCompleted = false;
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
    if (!this.isLevelCompleted) {
      this.backgroundX -= this.backgroundSpeed;
      if (this.backgroundX <= -this.canvas.width) {
        this.backgroundX = 0;
      }
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
    this.context.fillStyle = 'white';
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
    if (this.score >= 6000) {
      this.roadSpeed = 0; // 停止道路移动
      this.gameOver = true;
      this.isLevelCompleted = true;
      backgroundMusic.pauseBackgroundMusic();
      soundManager.play('win');
    } else {
      this.score += this.roadSpeed;
      this.roadX -= this.roadSpeed;
      if (this.roadX <= -this.roadImage.width) {
        this.roadX = 0;
      }
      // 检查分数是否达到3000分，并且尚未加速
      if (this.score >= 3000 && !this.speedIncreasedStageFirst) {
        this.roadSpeed += 1; // 增加道路速度
        this.speedIncreasedStageFirst = true; // 标记已经加速
        this.messageDisplayTime = this.messageDuration;
      }
      // 如果消息正在显示，减少显示时间
      if (this.messageDisplayTime > 0) {
        this.messageDisplayTime--;
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
    if (!this.isLevelCompleted) {
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
    } else {
      this.traps = []; // 清空陷阱
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
    if (this.isLevelCompleted) {
      this.circleX += 1;
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
    const dinoPolygon = {
      vertices: [{
          x: this.circleX + 10,
          y: this.circleY
        },
        {
          x: this.circleX - 10,
          y: this.circleY - 5
        },
        {
          x: this.circleX - 10,
          y: this.circleY
        },
        {
          x: this.circleX + 10,
          y: this.circleY - 5
        },
      ]
    };
    // 检测与陷阱的碰撞
    this.traps.forEach(trap => {
      // 创建陷阱的矩形表示
      const trapPolygon = {
        vertices: [{
            x: trap.x,
            y: this.canvas.height - this.roadHeight
          },
          {
            x: trap.x + this.trapWidth,
            y: this.canvas.height - this.roadHeight
          },
          {
            x: trap.x + this.trapWidth,
            y: this.canvas.height - this.roadHeight - this.trapHeight
          },
          {
            x: trap.x,
            y: this.canvas.height - this.roadHeight - this.trapHeight
          }
        ]
      };
      // 使用SAT检测碰撞
      if (doPolygonsIntersect(dinoPolygon, trapPolygon)) {
        this.gameOver = true;
        backgroundMusic.pauseBackgroundMusic();
        soundManager.play('crack');
        soundManager.play('end', 200);
      }
    });
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
      // 更新小恐龙图片切换
      this.updateDino();
    } else {
      if (!this.isLevelCompleted) {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width) / 2, (this.canvas.height - this.failTipsImage.height) / 2 - this.failTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110);
      } else {

        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width) / 2, (this.canvas.height - this.successTipsImage.height) / 2 - this.successTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonShareInfo = drawIconButton(this.context, "前往下关", this.canvas.width / 2, this.canvas.height / 2 + 110);
        wx.setStorageSync('infiniteEnabled', 'access')
        this.updateDino();
      }
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
      updateHighScores(this.score);
      // 游戏结束时
      backgroundMusic.pauseBackgroundMusic()
      return
    }
    if (this.isLevelCompleted) {
      this.canDoubleJump = false;
      this.isOnGround = false;
    } else {
      if (!this.gameOver && (this.isOnGround || this.canDoubleJump)) {
        this.velocityY = this.jumpHeight;
        if (!this.isOnGround) {
          if (this.canDoubleJump) {
            this.canDoubleJump = false; // 标记二段跳已使用
          }
        }
        soundManager.play('jump');
        this.isOnGround = false; // 小恐龙起跳，不再在地面上
      }
    }
    if (this.gameOver || this.isLevelCompleted) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        updateHighScores(this.score);
        this.resetGame();
      }
      if (touchX >= this.buttonShareInfo.x && touchX <= this.buttonShareInfo.x + this.buttonShareInfo.width &&
        touchY >= this.buttonShareInfo.y && touchY <= this.buttonShareInfo.y + this.buttonShareInfo.height) {
        updateHighScores(this.score);
        if (this.isLevelCompleted) {
          this.game.switchScene(new this.game.infinite(this.game));
        } else {
          wx.shareAppMessage({
            title: '小恐龙不要停！太难了吧',
            imageUrl: 'image/background.jpg' // 分享图片的路径
          });
        }
      }
    }
  }
  // 游戏重制
  resetGame() {
    // 重置道路和陷阱位置
    this.roadX = 0;
    this.traps = [];
    // 重置小恐龙位置和状态
    this.circleX = 50;
    this.circleY = this.canvas.height - this.roadHeight - 50;
    this.velocityY = 0;
    this.isOnGround = true;
    this.gameOver = false;
    // 重置分数
    this.score = 0;
    this.roadSpeed = 2;
    this.speedIncreasedStageFirst = false;
    // 游戏开始时
    backgroundMusic.playBackgroundMusic()
    this.isLevelCompleted = false;
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}