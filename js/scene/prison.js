import {
  createBackButton,
  drawIconButton,
  drawRoundedRect
} from '../../utils/button';
import {
  doPolygonsIntersect,
  updateHighScores
} from '../../utils/algorithm';
import {
  showBoxMessage
} from '../../utils/dialog';
import {
  soundManager,
  backgroundMusic,
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Prison {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.playBackgroundMusic();
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    /* 加载音乐音效管理器结束 */
    /* 道具设置区开始 */
    this.wingCount = 0;
    this.getWingAccess = wx.getStorageSync('wingCount');
    this.moonCount = 0;
    this.getMoonAccess = wx.getStorageSync('moonCount');
    this.drugCount = 0;
    this.getDrugAccess = wx.getStorageSync('drugCount');
    // 广告显示
    this.interstitialAd = null;
    if (wx.createInterstitialAd){
      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-4dc7d03dc1c7a0e1'
      })
    }
    // 是否使用了道具
    this.useWing = false;
    this.distanceWing = 0;
    this.useMoon = false;
    this.distanceMoon = 0;
    this.useDrug = false;
    this.distanceDrug = 0;
    /* 道具设置区结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/prisonback.jpg';
    this.backButton = '';
    this.roadImage = new Image();
    this.roadImage.src = 'image/prison.jpg';
    this.trapImages = [
      'image/woodenbox.png',
      'image/prisonbarrier.png',
      'image/barrier.png',
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.dinoImages = [];
    for (let i = 0; i <= 4; i++) { // 假设有 n 帧动画
      const img = new Image();
      img.src = `image/dino_${i}.png`;
      this.dinoImages.push(img);
    }
    this.dinoJumpUpImage = new Image();
    this.dinoJumpUpImage.src = 'image/dino_jump_up.png';
    this.dinoJumpDownImage = new Image();
    this.dinoJumpDownImage.src = 'image/dino_jump_down.png';
    this.dinoDeadImage = new Image();
    this.dinoDeadImage.src = 'image/dead.png';
    this.dinoFootprintImage = new Image();
    this.dinoFootprintImage.src = 'image/footprint.png';
    this.wingImage = new Image();
    this.wingImage.src = 'image/wing.png';
    this.moonImage = new Image();
    this.moonImage.src = 'image/moon.png';
    this.drugImage = new Image();
    this.drugImage.src = 'image/drug.png';
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域结束 */
    /* 常量设置区域开始 */
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.3;
    // 道路属性
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    // 背景属性
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    // 小恐龙属性
    this.dinoInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 93 * scaleX,
      height: 65 * scaleY,
      gravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    // 陷阱属性
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    // 初始化分数
    this.score = 0;
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.speedIncreaseMessage = "Speed+1";
    this.messageDisplayTime = 0;
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 终点显现速度
    this.endSpeed = 0;
    // 游戏状态
    this.gameOver = false;
    // 游戏通关状态
    this.isLevelCompleted = false;
    /* 常量设置区域结束 */
  }
  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundInfo.x, this.dinoInfo.groundY, this.backgroundImage.width * scaleX, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundInfo.x < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundInfo.x + this.backgroundImage.width * scaleX, this.dinoInfo.groundY, this.backgroundImage.width * scaleX, this.canvas.height);
      }
    }
  }
  // 更新背景状态
  updateBackground() {
    if (!this.isLevelCompleted) {
      this.backgroundInfo.x -= this.backgroundInfo.speed;
      if (this.backgroundInfo.x <= -this.backgroundImage.width * scaleX) {
        this.backgroundInfo.x = 0;
      }
    }
  }
  // 绘制黑色遮罩
  drawBlackScreen() {
    if (this.isScreenDark) {
      this.context.fillStyle = `rgba(0, 0, 0, ${this.screenDarkness * 0.8})`;
      this.context.fillRect(0,  0, this.canvas.width, this.canvas.height);
    }
  }
  // 更新黑色遮罩
  updateDrawBlackScreen() {
    if (this.score == 3000) {
      soundManager.play('break');
    }
    if (this.score >= 3000 && this.score < 3300) {
      this.isScreenDark = true;
      this.screenDarkness = Math.min((this.score - 3000) / (3300 - 3000), 1);
    } else if (this.score >= 3350 && this.score < 3650) {
      this.screenDarkness = Math.max(1 - (this.score - 3350) / (3650 - 3350), 0);
    } else if (this.score >= 3650) {
      this.screenDarkness = 0;
    }
  }
  // 绘制返回按钮
  drawBack() {
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.choose(this.game));
    });
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制分数
  drawScore() {
    const iconSize = 24 * scaleY; // 图标大小
    const iconPadding = 10; // 图标与分数之间的间距
    // 计算分数文本的宽度
    this.context.save();
    this.context.font = `${20 * scaleX}px Arial`; // 确保设置的字体与绘制时相同
    const textWidth = this.context.measureText(this.score).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top + 6 * scaleY; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
    // 绘制图标
    if (this.dinoFootprintImage.complete) {
      this.context.drawImage(this.dinoFootprintImage, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.fillStyle = 'white';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score, scoreX, scoreY);
    this.context.restore();
  }
  // 绘制道路
  drawRoad() {
    if (this.roadImage.complete) {
      this.context.drawImage(this.roadImage, this.road.x, this.road.y + this.dinoInfo.groundY);
      if (this.road.x < 0) {
        this.context.drawImage(this.roadImage, this.road.x + this.road.width, this.road.y + this.dinoInfo.groundY);
      }
    }
  }
  // 更新道路状态
  updateRoad() {
    if (this.score >= 6000) {
      this.road.speed = 0; // 停止道路移动
      this.gameOver = true;
      this.isLevelCompleted = true;
      backgroundMusic.stopBackgroundMusic();
      soundManager.play('win');
    } else {
      this.score += this.road.speed / scaleX;
      this.road.x -= this.road.speed;
      if (this.road.x <= -this.roadImage.width * scaleX) {
        this.road.x = 0;
      }
      // 检查分数是否达到3000分，并且尚未加速
      if (this.score >= 3000 && !this.speedIncreasedStageFirst) {
        this.road.speed += 1 * scaleX; // 增加道路速度
        this.speedIncreasedStageFirst = true; // 标记已经加速
        this.messageDisplayTime = this.messageDuration;
      }
      // 如果消息正在显示，减少显示时间
      if (this.messageDisplayTime > 0) {
        this.messageDisplayTime--;
      }
    }
  }
  // 绘制陷阱位置
  drawTraps() {
    this.trapInfo.list.forEach(trap => {
      const trapImg = this.trapImages[trap.imageIndex];
      // 绘制陷阱图片
      if (trapImg.complete) {
        this.context.drawImage(trapImg, trap.x, trap.y - trap.height + 5 * scaleY + this.dinoInfo.groundY, trap.width, trap.height);
      }
    });
  }
  // 更新陷阱位置
  updateTraps() {
    if (!this.isLevelCompleted) {
      this.road.x -= this.road.speed;
      if (this.road.x <= -this.road.width) {
        this.road.x = 0;
      }
      this.trapInfo.list.forEach(trap => {
        trap.x -= this.road.speed;
      });
      // 移除已经离开屏幕的陷阱
      this.trapInfo.list = this.trapInfo.list.filter(trap => trap.x + trap.width > 0);
      // 根据道路位置和间隔添加新陷阱
      // 更新计时器
      this.trapInfo.trapTimer++;
      // 当计时器达到间隔时，生成新的陷阱
      if (this.trapInfo.trapTimer >= this.trapInfo.trapInterval && this.score <= 5000) {
        const numberOfTraps = Math.floor(Math.random() * 6) + 1;
        let lastTrapX = this.canvas.width;
        for (let i = 0; i < numberOfTraps; i++) {
          // 为每个陷阱计算随机间隔
          const gap = Math.floor(Math.random() * 60 * scaleX) + 150 * scaleX; // 间隔（50到200像素之间）
          lastTrapX += gap;
          const imageIndex = Math.floor(Math.random() * this.trapImages.length);
          const trapImg = this.trapImages[imageIndex];
          // 添加陷阱
          this.trapInfo.list.push({
            x: lastTrapX,
            y: this.canvas.height - this.groundHeight,
            imageIndex: imageIndex,
            width: 32 * scaleX, // 为陷阱设置宽度
            height: (trapImg.height / 8) * scaleY // 为陷阱设置高度
          });
        }
        // 重置计时器
        this.trapInfo.trapTimer = 0;
      }
    } else {
      this.trapInfo.list = []; // 清空陷阱
    }
  }
  // 绘制椭圆终点
  drawEllipse() {
    // 设置半椭圆的参数
    const centerX = this.canvas.width + 150 * scaleX;
    const centerY = this.canvas.height - this.groundHeight;
    const radiusX = 150 * scaleX;
    const radiusY = this.canvas.height - this.groundHeight;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    // 绘制半椭圆
    this.context.save();
    this.context.beginPath();
    this.context.ellipse(centerX + this.endSpeed, centerY + this.dinoInfo.groundY, radiusX, radiusY, 0, startAngle, endAngle);
    this.context.closePath();
    // 填充半椭圆（可选）
    this.context.fillStyle = '#111111';
    this.context.fill();
    // 描边半椭圆（可选）
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.restore();
  }
  // 更新椭圆终点
  updateEllipse() {
    if (this.score >= 5900 && this.score <= 6000) {
      this.endSpeed -= this.road.speed;
    }
  }
  // 绘制小恐龙
  drawDino() {
    let dinoImg;
    if (this.gameOver) {
      if (this.isLevelCompleted) {
        if (!this.dinoInfo.isOnGround) {
          dinoImg = this.isJumpingUp ? this.dinoJumpUpImage : this.dinoJumpDownImage;
        } else {
          dinoImg = this.dinoImages[this.dinoInfo.currentDinoFrame];
        }
      } else {
        dinoImg = this.dinoDeadImage
      };
    } else {
      if (!this.dinoInfo.isOnGround) {
        dinoImg = this.isJumpingUp ? this.dinoJumpUpImage : this.dinoJumpDownImage;
      } else {
        dinoImg = this.dinoImages[this.dinoInfo.currentDinoFrame];
      }
    }
    if (dinoImg.complete) {
      if (this.gameOver && !this.isLevelCompleted) {
        this.context.drawImage(dinoImg, this.dinoInfo.x, this.dinoInfo.y + this.dinoInfo.groundY, this.dinoInfo.width, this.dinoInfo.height)
      } else {
        this.context.drawImage(dinoImg, this.dinoInfo.x, this.dinoInfo.y - 20 * scaleY + this.dinoInfo.groundY, this.dinoInfo.width, this.dinoInfo.height)
      }
    }
  }
  // 更新小恐龙
  updateDino() {
    let getTrackView = wx.getStorageSync('trackView');
    // 更新 Y 视角
    if (this.dinoInfo.y < this.groundHeight && getTrackView) {
      this.dinoInfo.groundY = this.groundHeight - this.dinoInfo.y
    } else {
      this.dinoInfo.groundY = 0;
    }
    this.dinoInfo.dinoFrameTimer++;
    if (this.dinoInfo.dinoFrameTimer >= this.dinoInfo.dinoFrameInterval) {
      this.dinoInfo.currentDinoFrame = (this.dinoInfo.currentDinoFrame + 1) % this.dinoImages.length;
      this.dinoInfo.dinoFrameTimer = 0;
    }
    if (this.isLevelCompleted) {
      this.dinoInfo.x += 1 * scaleX;
    } else {
      if (this.score - this.distanceMoon > 1000 && this.useMoon) {
        this.dinoInfo.gravity = 0.4 * scaleY;
        this.useMoon = false;
      }
      if (this.score - this.distanceWing >= 2000 && this.useWing) {
        this.useWing = false;
      }
    }
    this.dinoInfo.velocityY += this.dinoInfo.gravity;
    this.dinoInfo.y += this.dinoInfo.velocityY;
    // 根据速度判断小恐龙是在跳起还是在下落
    if (this.dinoInfo.velocityY < 0) {
      this.isJumpingUp = true;
    } else if (this.dinoInfo.velocityY > 0) {
      this.isJumpingUp = false;
    }
    // 检测与道路的碰撞
    if (this.dinoInfo.y >= this.road.y - this.dinoInfo.height / 2 - 5 * scaleY) {
      this.dinoInfo.y = this.road.y - this.dinoInfo.height / 2 - 5 * scaleY;
      this.dinoInfo.velocityY = 0;
      this.dinoInfo.isOnGround = true; // 小恐龙在地面上
      this.dinoInfo.canDoubleJump = true; // 重置二段跳标志
    } else {
      this.dinoInfo.isOnGround = false; // 小恐龙在空中
    }
    const dinoPolygon = {
      vertices: [{
          x: this.dinoInfo.x + this.dinoInfo.width * 3 / 4,
          y: this.dinoInfo.y
        },
        {
          x: this.dinoInfo.x + 40 * scaleX,
          y: this.dinoInfo.y + 18 * scaleY
        },
        {
          x: this.dinoInfo.x + 30 * scaleX,
          y: this.dinoInfo.y + 10 * scaleY
        },
        {
          x: this.dinoInfo.x + this.dinoInfo.width * 3 / 4,
          y: this.dinoInfo.y + 5 * scaleY
        },
      ]
    };
    // 检测与陷阱的碰撞
    this.trapInfo.list.forEach(trap => {
      // 创建陷阱的矩形表示
      const trapPolygon = {
        vertices: [{
            x: trap.x,
            y: this.canvas.height - this.road.height
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.road.height
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.road.height - trap.height
          },
          {
            x: trap.x,
            y: this.canvas.height - this.road.height - trap.height
          }
        ]
      };
      // 使用SAT检测碰撞
      if (doPolygonsIntersect(dinoPolygon, trapPolygon)) {
        if (!this.useDrug && this.score - this.distanceDrug >= 300) {
          this.gameOver = true;
          backgroundMusic.stopBackgroundMusic();
          soundManager.play('crack');
          soundManager.play('end', 200);
        } else {
          this.useDrug = false;
        }
      }
    });
  }
  // 绘制隐身药道具显示
  drawDrug() {
    if (!this.useDrug && this.distanceDrug == 0 && typeof this.getDrugAccess != 'string' && this.getDrugAccess != 0) {
      drawRoundedRect(this.context, -10 * scaleX, this.canvas.height - this.road.height + 20 * scaleY, 100 * scaleX, 40 * scaleY, 10 * scaleY, '#f5d659', 'black', 3);
      if (this.drugImage.complete) {
        this.context.drawImage(this.drugImage, 10, this.canvas.height - this.road.height + 28 * scaleY, 24 * scaleY, 24 * scaleY);
      }
      this.context.save();
      this.context.fillStyle = 'black';
      this.context.font = `${16 * scaleX}px Arial`;
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      if (typeof this.getDrugAccess == 'string') {
        this.drugCount = 0;
      } else {
        this.drugCount = this.getDrugAccess;
      }
      this.context.fillText(this.drugCount, 80 * scaleX, this.canvas.height - this.road.height + 42 * scaleY);
      this.context.restore();
    }
  }
  // 绘制月球药道具显示
  drawMoon() {
    if (!this.useMoon && typeof this.getMoonAccess != 'string' && this.getMoonAccess != 0 && this.distanceMoon == 0) {
      drawRoundedRect(this.context, -10 * scaleX, this.canvas.height - this.road.height + 70 * scaleY, 100 * scaleX, 40 * scaleY, 10 * scaleY, '#f5d659', 'black', 3);
      if (this.moonImage.complete) {
        this.context.drawImage(this.moonImage, 10, this.canvas.height - this.road.height + 78 * scaleY, 24 * scaleY, 24 * scaleY);
      }
      this.context.save();
      this.context.fillStyle = 'black';
      this.context.font = `${16 * scaleX}px Arial`;
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      if (typeof this.getMoonAccess == 'string') {
        this.moonCount = 0;
      } else {
        this.moonCount = this.getMoonAccess;
      }
      this.context.fillText(this.moonCount, 80 * scaleX, this.canvas.height - this.road.height + 92 * scaleY);
      this.context.restore();
    }
  }
  // 绘制飞天翼道具显示
  drawWing() {
    if (this.score <= 800 && !this.useWing && typeof this.getWingAccess != 'string' && this.getWingAccess != 0) {
      drawRoundedRect(this.context, -10 * scaleX, this.canvas.height - this.road.height + 120 * scaleY, 100 * scaleX, 40 * scaleY, 10 * scaleY, '#f5d659', 'black', 3);
      if (this.wingImage.complete) {
        this.context.drawImage(this.wingImage, 10, this.canvas.height - this.road.height + 128 * scaleY, 24 * scaleY, 24 * scaleY);
      }
      this.context.save();
      this.context.fillStyle = 'black';
      this.context.font = `${16 * scaleX}px Arial`;
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      if (typeof this.getWingAccess == 'string') {
        this.wingCount = 0;
      } else {
        this.wingCount = this.getWingAccess;
      }
      this.context.fillText(this.wingCount, 80 * scaleX, this.canvas.height - this.road.height + 142 * scaleY);
      this.context.restore();
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    if (this.messageDisplayTime > 0) {
      showBoxMessage(this.context, this.speedIncreaseMessage, this.canvas.width / 2, this.canvas.height / 2, '#f5d659', 'black', 16 * scaleX);
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
    // 绘制椭圆终点
    this.drawEllipse();
    // 绘制小恐龙
    this.drawDino();
    // 绘制隐身药道具
    this.drawDrug();
    // 绘制月球药道具
    this.drawMoon();
    // 绘制飞天翼道具
    this.drawWing();
    // 如果消息需要显示
    this.drawMessageBox();
    // 绘制黑色遮罩
    this.drawBlackScreen();
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
      // 更新椭圆终点
      this.updateEllipse();
      // 更新小恐龙图片切换
      this.updateDino();
      // 更新黑色遮罩
      this.updateDrawBlackScreen();
    } else {
      if (!this.isLevelCompleted) {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      } else {
        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width * scaleX) / 2, (this.canvas.height - this.successTipsImage.height * scaleY) / 2 - this.successTipsImage.height * scaleY / 2, this.successTipsImage.width * scaleX, this.successTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonShareInfo = drawIconButton(this.context, "前往下关", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
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
      this.gameOver = true;
      updateHighScores(this.score);
      backgroundMusic.stopBackgroundMusic()
      btn.onClick();
      return
    }
    if (this.isLevelCompleted) {
      this.dinoInfo.canDoubleJump = false;
      this.dinoInfo.isOnGround = false;
    } else {
      if (!this.gameOver) {
        // 使用隐身药道具点击识别
        if (touchX >= 0 && touchX <= 90 * scaleX &&
          touchY >= this.canvas.height - this.road.height + 20 * scaleY && touchY <= this.canvas.height - this.road.height + 60 * scaleY && this.drugCount >= 1 && !this.useDrug && this.distanceDrug == 0) {
          this.useDrug = true;
          this.distanceDrug = this.score;
          this.drugCount--;
          this.getDrugAccess = this.drugCount;
          wx.setStorageSync('drugCount', this.drugCount);
        }
        // 使用月球药道具点击识别
        if (touchX >= 0 && touchX <= 90 * scaleX &&
          touchY >= this.canvas.height - this.road.height + 70 * scaleY && touchY <= this.canvas.height - this.road.height + 110 * scaleY && this.moonCount >= 1 && !this.useMoon && this.distanceMoon == 0) {
          this.useMoon = true;
          this.dinoInfo.gravity = this.dinoInfo.gravity / 6;
          this.distanceMoon = this.score;
          this.moonCount--;
          this.getMoonAccess = this.moonCount;
          wx.setStorageSync('moonCount', this.moonCount)
        }
        // 使用天使翼道具点击识别
        if (touchX >= 0 && touchX <= 90 * scaleX &&
          touchY >= this.canvas.height - this.road.height + 120 * scaleY && touchY <= this.canvas.height - this.road.height + 160 * scaleY && this.wingCount >= 1 && !this.useWing && this.distanceWing == 0) {
          this.useWing = true;
          this.distanceWing = this.score;
          this.wingCount--;
          this.getWingAccess = this.wingCount;
          wx.setStorageSync('wingCount', this.wingCount)
        }
        // 二极跳识别
        if (this.dinoInfo.isOnGround || this.dinoInfo.canDoubleJump) {
          this.dinoInfo.velocityY = this.dinoInfo.jumpHeight;
          if (!this.dinoInfo.isOnGround) {
            if (this.dinoInfo.canDoubleJump && !this.useWing) {
              this.dinoInfo.canDoubleJump = false; // 标记二段跳已使用
            }
          }
          soundManager.play('jump');
          this.dinoInfo.isOnGround = false; // 小恐龙起跳，不再在地面上
        }
      }
    }
    if (this.gameOver || this.isLevelCompleted) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        updateHighScores(this.score);
        this.resetGame();
        if (this.interstitialAd) {
          this.interstitialAd.show().catch((err) => {
            console.error('插屏广告显示失败', err)
          })
        }
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
    backgroundMusic.playBackgroundMusic();
    this.backButton = '';
    // 道路属性
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    // 背景属性
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    // 小恐龙属性
    this.dinoInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 93 * scaleX,
      height: 65 * scaleY,
      gravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    // 陷阱属性
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    // 重置小恐龙位置和状态
    this.useWing = false;
    this.distanceWing = 0;
    this.useMoon = false;
    this.distanceMoon = 0;
    this.useDrug = false;
    this.distanceDrug = 0;
    // 初始化分数
    this.score = 0;
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.speedIncreasedStageFirst = false;
    this.messageDisplayTime = 0;
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 终点显现速度
    this.endSpeed = 0;
    // 游戏状态
    this.gameOver = false;
    // 游戏通关状态
    this.isLevelCompleted = false;
  }
  // 页面销毁机制
  destroy() {
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.roadImage.src = '';
    this.trapImages.forEach(img => img = null);
    this.dinoImages.forEach(img => img = null);
    this.dinoJumpUpImage.src = '';
    this.dinoJumpDownImage.src = '';
    this.dinoDeadImage.src = '';
    this.dinoFootprintImage.src = '';
    this.wingImage.src = '';
    this.moonImage.src = '';
    this.drugImage.src = '';
    this.successTipsImage.src = '';
    this.failTipsImage.src = '';
  }
}