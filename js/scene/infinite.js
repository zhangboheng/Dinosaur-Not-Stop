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
export default class Infinite {
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
    this.backgroundImage.src = 'image/gamebackground.jpg';
    this.backButton = '';
    this.roadImage = new Image();
    this.roadImage.src = 'image/yard.jpg';
    this.trapImages = [
      'image/spikes.png',
      'image/prisonbarrier.png',
      'image/cobblestone.png',
      'image/doublestone.png'
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
    this.powerUpImage = new Image();
    this.powerUpImage.src = 'image/improve-bubble.png';
    this.getPowerUpImage = new Image();
    this.getPowerUpImage.src = 'image/improve.png';
    this.poisonMushroomImage = new Image();
    this.poisonMushroomImage.src = 'image/mushroom.png';
    this.dinoFootprintImage = new Image();
    this.dinoFootprintImage.src = 'image/footprint.png';
    this.ufoImage = new Image();
    this.ufoImage.src = 'image/ufo.png';
    this.wingImage = new Image();
    this.wingImage.src = 'image/wing.png';
    this.moonImage = new Image();
    this.moonImage.src = 'image/moon.png';
    this.drugImage = new Image();
    this.drugImage.src = 'image/drug.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域结束 */
    /* 常量设置区域开始 */
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.3;
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    this.dinoInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 93 * scaleX,
      height: 65 * scaleY,
      gravity: 0.4 * scaleY,
      originalGravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      canTripleJump: false,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    this.powerUp = {
      x: this.canvas.width,
      y: this.canvas.height - this.road.height - 150 * scaleY,
      width: 40 * scaleY,
      height: 40 * scaleY,
      visible: false,
      obtained: false,
      speed: this.road.speed,
      powerUpCount: 0,
      lastPowerUpScore: 0,
      powerUpScoreInterval: 10000
    };
    this.poisonMushroom = {
      x: this.canvas.width,
      y: this.canvas.height - this.road.height - 32 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      visible: false,
      obtained: false,
      speed: this.road.speed,
      lastMushroomScore: 0,
      poisonMushroomEffectDuration: 0
    };
    this.ufoflying = {
      x: this.canvas.width,
      y: 60 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      speed: this.road.speed,
      visible: false,
      amplitude: 3 * scaleY,
      frequency: 0.1
    };
    // 初始化分数
    this.score = 0;
    // 标志游戏速度是否已经加快
    this.speedIncreasedStageFirst = false;
    this.speedIncreasedStageSecond = false;
    this.speedIncreasedStageThird = false;
    this.speedIncreasedStageFourth = false;
    this.speedIncreasedStageFifth = false;
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
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
    /* 常量设置区域结束 */
  }
  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundInfo.x, this.dinoInfo.groundY, this.backgroundImage.width / 2, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundInfo.x < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundInfo.x + this.backgroundImage.width / 2, this.dinoInfo.groundY, this.backgroundImage.width / 2, this.canvas.height);
      }
    }
  }
  // 更新背景状态
  updateBackground() {
    this.backgroundInfo.x -= this.backgroundInfo.speed;
    if (this.backgroundInfo.x <= -this.backgroundImage.width / 2) {
      this.backgroundInfo.x = 0;
    }
  }
  // 绘制蓝色遮罩
  drawBlueScreen() {
    this.context.fillStyle = `#4db6ed`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height + this.dinoInfo.groundY);
  }
  // 绘制黑色遮罩
  drawBlackScreen() {
    if (this.isScreenDark) {
      this.context.fillStyle = `rgba(0, 0, 0, ${this.screenDarkness * 0.8})`;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 更新黑色遮罩
  updateDrawBlackScreen() {
    if (this.score > 7000 && this.score <= 7003) {
      soundManager.play('lightning', 200);
    }
    if (this.score >= 7000 && this.score < 7300) {
      this.isScreenDark = true;
      this.screenDarkness = Math.min((this.score - 7000) / (7300 - 7000), 1);
    } else if (this.score >= 7300 && this.score < 7600) {
      this.screenDarkness = Math.max(1 - (this.score - 7300) / (7600 - 7300), 0);
    } else if (this.score >= 7600) {
      this.screenDarkness = 0;
    }
    if (this.score > 35000 && this.score <= 35009) {
      soundManager.play('lightning', 200);
    }
    if (this.score >= 35000 && this.score < 35500) {
      this.isScreenDark = true;
      this.screenDarkness = Math.min((this.score - 35000) / (35500 - 35000), 1);
    } else if (this.score >= 35500 && this.score < 36000) {
      this.screenDarkness = Math.max(1 - (this.score - 35500) / (36000 - 35500), 0);
    } else if (this.score >= 36000) {
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
    this.context.fillStyle = 'black';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score + 6000, scoreX, scoreY);
    this.context.restore();
  }
  // 绘制道路
  drawRoad() {
    if (this.roadImage.complete) {
      this.context.drawImage(this.roadImage, this.road.x, this.road.y + this.dinoInfo.groundY, this.road.width, this.road.height);
      if (this.road.x < 0) {
        this.context.drawImage(this.roadImage, this.road.x + this.road.width, this.road.y + this.dinoInfo.groundY, this.road.width, this.road.height);
      }
    }
  }
  // 更新道路状态
  updateRoad() {
    this.score += this.road.speed / scaleX;
    this.road.x -= this.road.speed;
    if (this.road.x <= -this.canvas.width * scaleX) {
      this.road.x = 0;
    }
    // 检查分数是否达到6000分，并且尚未加速
    if (this.score >= 6000 && !this.speedIncreasedStageFirst) {
      this.road.speed += 1 * scaleX;
      this.poisonMushroom.speed += 1 * scaleX;
      this.powerUp.speed += 1 * scaleX;
      this.speedIncreasedStageFirst = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 检查分数是否达到10000分，并且尚未加速
    if (this.score >= 10000 && !this.speedIncreasedStageSecond) {
      this.road.speed += 1 * scaleX;
      this.poisonMushroom.speed += 1 * scaleX;
      this.powerUp.speed += 1 * scaleX;
      this.speedIncreasedStageSecond = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 检查分数是否达到18000分，并且尚未加速
    if (this.score >= 18000 && !this.speedIncreasedStageThird) {
      this.road.speed += 1 * scaleX;
      this.poisonMushroom.speed += 1 * scaleX;
      this.powerUp.speed += 1 * scaleX;
      this.speedIncreasedStageThird = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 检查分数是否达到30000分，并且尚未加速
    if (this.score >= 30000 && !this.speedIncreasedStageFourth) {
      this.road.speed += 1 * scaleX;
      this.poisonMushroom.speed += 1 * scaleX;
      this.powerUp.speed += 1 * scaleX;
      this.speedIncreasedStageFourth = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 检查分数是否达到30000分，并且尚未加速
    if (this.score >= 60000 && !this.speedIncreasedStageFifth) {
      this.road.speed += 1 * scaleX;
      this.poisonMushroom.speed += 1 * scaleX;
      this.powerUp.speed += 1 * scaleX;
      this.speedIncreasedStageFifth = true;
      this.messageDisplayTime = this.messageDuration;
    }
    // 如果消息正在显示，减少显示时间
    if (this.messageDisplayTime > 0) {
      this.messageDisplayTime--;
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
    if (this.trapInfo.trapTimer >= this.trapInfo.trapInterval) {
      const numberOfTraps = Math.floor(Math.random() * 4) + 1;
      let lastTrapX = this.canvas.width;
      for (let i = 0; i < numberOfTraps; i++) {
        // 为每个陷阱计算随机间隔
        const gap = Math.floor(Math.random() * 90 * scaleX) + 200; // 间隔（50到200像素之间）
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
  }
  // 绘制小恐龙
  drawDino() {
    let dinoImg;
    if (this.gameOver) {
      dinoImg = this.dinoDeadImage
    } else {
      if (!this.dinoInfo.isOnGround) {
        dinoImg = this.isJumpingUp ? this.dinoJumpUpImage : this.dinoJumpDownImage;
      } else {
        dinoImg = this.dinoImages[this.dinoInfo.currentDinoFrame];
      }
    }
    if (dinoImg.complete) {
      if (this.gameOver) {
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
    this.dinoInfo.velocityY += this.dinoInfo.gravity;
    this.dinoInfo.y += this.dinoInfo.velocityY;
    if (this.score - this.distanceMoon > 1000 && this.useMoon) {
      this.dinoInfo.gravity = 0.4 * scaleY;
      this.useMoon = false;
    }
    if (this.score - this.distanceWing >= 2000 && this.useWing) {
      this.useWing = false;
    }
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
      // 侦测三角碰撞
      if (trap.imageIndex === 0) {
        const trapTriangle = {
          vertices: [{
              x: trap.x,
              y: trap.y
            },
            {
              x: trap.x + trap.width / 2,
              y: trap.y - trap.height
            },
            {
              x: trap.x + trap.width,
              y: trap.y
            },
          ]
        };
        // 检查小恐龙是否与三角形的每条边发生碰撞
        if (doPolygonsIntersect(dinoPolygon, trapTriangle)) {
          if (!this.useDrug && this.score - this.distanceDrug >= 300) {
            soundManager.play('crack');
            this.gameOver = true;
            // 游戏结束时
            backgroundMusic.stopBackgroundMusic();
            soundManager.play('end', 200);
          } else {
            this.useDrug = false;
          }
        }
      } else if (trap.imageIndex >= 1) {
        // 创建陷阱的矩形表示
        const trapPolygon = {
          vertices: [{
              x: trap.x,
              y: trap.y
            },
            {
              x: trap.x + trap.width,
              y: trap.y
            },
            {
              x: trap.x + trap.width,
              y: trap.y - trap.height
            },
            {
              x: trap.x,
              y: trap.y - trap.height
            }
          ]
        };
        // 使用SAT检测碰撞
        if (doPolygonsIntersect(dinoPolygon, trapPolygon)) {
          if (!this.useDrug && this.score - this.distanceDrug >= 300) {
            soundManager.play('crack');
            this.gameOver = true;
            backgroundMusic.stopBackgroundMusic();
            soundManager.play('end', 200);
          } else {
            this.useDrug = false;
          }
        }
      }
    });
    // 检查小恐龙是否与道具碰撞
    if (this.powerUp.visible && !this.powerUp.obtained) {
      if (this.dinoInfo.x < this.powerUp.x + this.powerUp.width &&
        this.dinoInfo.x + this.dinoInfo.width > this.powerUp.x &&
        this.dinoInfo.y - 20 * scaleY < this.powerUp.y + this.powerUp.height &&
        this.dinoInfo.y + this.dinoInfo.height - 20 * scaleY > this.powerUp.y) {
        this.powerUp.obtained = true;
        this.powerUp.powerUpCount = 1; // 设置道具数量为1
        this.dinoInfo.canTripleJump = true; // 允许三级跳
        soundManager.play('get');
      }
    }
    // 检查小恐龙是否与毒蘑菇碰撞
    if (this.poisonMushroom.visible && !this.poisonMushroom.obtained) {
      if (this.dinoInfo.x < this.poisonMushroom.x + this.poisonMushroom.width &&
        this.dinoInfo.x + this.dinoInfo.width / 2 > this.poisonMushroom.x &&
        this.dinoInfo.y - 20 * scaleY < this.poisonMushroom.y + this.poisonMushroom.height &&
        this.dinoInfo.y + this.dinoInfo.height - 20 * scaleY > this.poisonMushroom.y) {
        // 碰撞发生
        this.poisonMushroom.obtained = true;
        this.dinoInfo.gravity = 0.4 * scaleY / 2;
        this.poisonMushroom.poisonMushroomEffectDuration = 300;
        soundManager.play('get');
      }
    }
  }
  // 绘制道具
  drawProps() {
    if (this.score > 500 && !this.powerUp.obtained) {
      this.powerUp.visible = true;
      if (this.powerUpImage.complete && this.powerUp.visible) {
        this.context.drawImage(this.powerUpImage, this.powerUp.x, this.powerUp.y + this.dinoInfo.groundY, this.powerUp.width, this.powerUp.height);
      }
    }
    if (this.powerUp.powerUpCount > 0) {
      // 绘制道具图片
      if (this.powerUpImage.complete) {
        this.context.drawImage(this.getPowerUpImage, menuButtonInfo.right - 24 * scaleY - 40 * scaleX, menuButtonInfo.bottom + 10 * scaleY, 24 * scaleY, 24 * scaleY);
      }
      // 绘制道具数量
      this.context.save();
      this.context.fillStyle = 'black';
      this.context.font = `${20 * scaleX}px Arial`;
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText(' x1', menuButtonInfo.right, menuButtonInfo.bottom + 22 * scaleY);
      this.context.restore();
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
    if (this.score - this.powerUp.lastPowerUpScore >= this.powerUp.powerUpScoreInterval && !this.powerUp.obtained) {
      this.powerUp.visible = true;
      this.powerUp.x = this.canvas.width; // 重置道具位置到屏幕右边缘
      this.powerUp.lastPowerUpScore = this.score; // 更新上次道具出现的分数
    }
  }
  // 绘制毒蘑菇
  drawMushroom() {
    if (this.score >= 1000 && !this.poisonMushroom.obtained) {
      this.poisonMushroom.visible = true;
      if (this.poisonMushroomImage.complete) {
        this.context.drawImage(this.poisonMushroomImage, this.poisonMushroom.x, this.poisonMushroom.y + 5 * scaleY + this.dinoInfo.groundY, this.poisonMushroom.width, this.poisonMushroom.height);
      }
    }
    if (this.poisonMushroom.poisonMushroomEffectDuration > 0) {
      // 绘制蘑菇图片
      if (this.poisonMushroomImage.complete) {
        this.context.drawImage(this.poisonMushroomImage, menuButtonInfo.right - 24 * scaleY - 40 * scaleX, menuButtonInfo.bottom + 44 * scaleY, 24 * scaleY, 24 * scaleY);
      }
      // 绘制道具数量
      this.context.save();
      this.context.fillStyle = 'black';
      this.context.font = `${20 * scaleX}px Arial`;
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText(' x1', menuButtonInfo.right, menuButtonInfo.bottom + 56 * scaleY);
      this.context.restore();
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
    if (this.poisonMushroom.poisonMushroomEffectDuration > 0) {
      this.poisonMushroom.poisonMushroomEffectDuration--;
      if (this.poisonMushroom.poisonMushroomEffectDuration === 0) {
        this.dinoInfo.gravity = 0.4 * scaleY;
      }
    }
    if (Math.random() < 0.382 && this.score - this.poisonMushroom.lastMushroomScore >= 4000) {
      this.poisonMushroom.obtained = false;
      this.poisonMushroom.visible = true; // 确保蘑菇是可见的
      this.poisonMushroom.x = this.canvas.width;
      this.poisonMushroom.lastMushroomScore = this.score; // 更新上次蘑菇出现的分数
    }
  }
  // 绘制 UFO
  drawUFO() {
    if (this.ufoImage.complete) {
      this.context.drawImage(this.ufoImage, this.ufoflying.x, this.ufoflying.y + this.dinoInfo.groundY, this.ufoflying.width, this.ufoflying.height);
    }
  }
  // 更新 UFO 显示位置
  updateUFO() {
    if (this.score % 100 == 0 && Math.random() < 0.01) {
      this.ufoflying.visible = false;
    }
    if (this.score > 1000 && !this.ufoflying.visible) {
      this.ufoflying.x -= this.ufoflying.speed;
      this.ufoflying.y += this.ufoflying.amplitude * Math.sin(this.ufoflying.frequency * this.ufoflying.x);
      // 处理 UFO 出界，重新放置到屏幕右侧
      if (this.ufoflying.x + this.ufoflying.width < 0) {
        this.ufoflying.x = this.canvas.width;
        this.ufoflying.y = 60 * scaleY;
        this.ufoflying.visible = true;
      }
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    if (this.messageDisplayTime > 0) {
      showBoxMessage(this.context, this.speedIncreaseMessage, this.canvas.width / 2, this.canvas.height / 2, '#f5d659', 'black', 16 * scaleX);
    }
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
  // 画面全部绘制
  draw() {
    // 绘制蓝色遮罩
    this.drawBlueScreen();
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
    // 绘制道具显示
    this.drawProps();
    // 绘制毒蘑菇
    this.drawMushroom();
    // 绘制 UFO
    this.drawUFO();
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
      // 更新道具变化
      this.updateProps();
      // 更新毒蘑菇
      this.updateMushroom();
      // 更新 UFO
      this.updateUFO();
      // 更新小恐龙图片切换
      this.updateDino();
      // 更新黑色遮罩
      this.updateDrawBlackScreen();
    } else {
      if (this.failTipsImage.complete) {
        this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
      }
      this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
      this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      if (this.interstitialAd) {
        this.interstitialAd.show().catch((err) => {
          console.error('插屏广告显示失败', err)
        })
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
      updateHighScores(this.score + 6000);
      backgroundMusic.stopBackgroundMusic()
      btn.onClick();
      return
    }
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
      // 二极跳和三级跳识别
      if (this.dinoInfo.isOnGround || this.dinoInfo.canDoubleJump || (this.dinoInfo.canTripleJump && !this.dinoInfo.isOnGround)) {
        this.dinoInfo.velocityY = this.dinoInfo.jumpHeight;
        if (!this.dinoInfo.isOnGround) {
          if (this.dinoInfo.canDoubleJump && !this.useWing) {
            this.dinoInfo.canDoubleJump = false; // 标记二段跳已使用
          } else if (this.dinoInfo.canTripleJump && !this.useWing) {
            this.dinoInfo.canTripleJump = false; // 标记三段跳已使用
            this.powerUp.powerUpCount = 0; // 使用后将道具数量设为0
            this.powerUp.obtained = false; // 获得道具
            this.powerUp.visible = false; // 隐藏道具
            this.powerUp.x = -80 * scaleX;
          }
        }
        soundManager.play('jump');
        this.dinoInfo.isOnGround = false; // 小恐龙起跳，不再在地面上
      }
    } else {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        updateHighScores(6000 + this.score);
        this.resetGame();
      }
      if (touchX >= this.buttonShareInfo.x && touchX <= this.buttonShareInfo.x + this.buttonShareInfo.width &&
        touchY >= this.buttonShareInfo.y && touchY <= this.buttonShareInfo.y + this.buttonShareInfo.height) {
        updateHighScores(6000 + this.score);
        wx.shareAppMessage({
          title: '小恐龙不要停！太难了吧',
          imageUrl: 'image/background.jpg' // 分享图片的路径
        });
      }
    }
  }
  // 游戏重制
  resetGame() {
    backgroundMusic.playBackgroundMusic();
    this.backButton = '';
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    this.dinoInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 93 * scaleX,
      height: 65 * scaleY,
      gravity: 0.4 * scaleY,
      originalGravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      canTripleJump: false,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    this.powerUp = {
      x: this.canvas.width, // 道具的初始横坐标
      y: this.canvas.height - this.road.height - 150 * scaleY, // 道具的初始纵坐标
      width: 40 * scaleY,
      height: 40 * scaleY,
      visible: false, // 道具是否可见
      obtained: false, // 道具是否已被获取
      speed: this.road.speed,
      powerUpCount: 0,
      lastPowerUpScore: 0,
      powerUpScoreInterval: 10000
    };
    this.poisonMushroom = {
      x: this.canvas.width,
      y: this.canvas.height - this.road.height - 32 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      visible: false,
      obtained: false,
      speed: this.road.speed,
      lastMushroomScore: 0,
      poisonMushroomEffectDuration: 0
    };
    this.ufoflying = {
      x: this.canvas.width,
      y: 60 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      speed: this.road.speed,
      visible: false,
      amplitude: 3 * scaleY,
      frequency: 0.1
    };
    this.useWing = false;
    this.distanceWing = 0;
    this.useMoon = false;
    this.distanceMoon = 0;
    this.useDrug = false;
    this.distanceDrug = 0;
    // 重置分数
    this.score = 0;
    // 屏幕变黑遮罩
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.messageDisplayTime = 0;
    this.speedIncreasedStageFirst = false;
    this.speedIncreasedStageSecond = false;
    this.speedIncreasedStageThird = false;
    this.speedIncreasedStageFourth = false;
    this.speedIncreasedStageFifth = false;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 游戏状态
    this.gameOver = false;
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
    this.powerUpImage.src = '';
    this.getPowerUpImage.src = '';
    this.poisonMushroomImage.src = '';
    this.dinoFootprintImage.src = '';
    this.ufoImage.src = '';
    this.wingImage.src = '';
    this.moonImage.src = '';
    this.drugImage.src = '';
    this.failTipsImage.src = '';
  }
}