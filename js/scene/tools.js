import {
  createBackButton,
  drawRoundedRect
} from '../../utils/button';
import {
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Tools {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.videoAd = null;
    this.bannerAd = null; // 底部广告
    this.clickWhat = '';
    /* 图片加载区域开始 */
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    this.wingImage = new Image();
    this.wingImage.src = 'image/wing.png';
    this.moonImage = new Image();
    this.moonImage.src = 'image/moon.png';
    this.drugImage = new Image();
    this.drugImage.src = 'image/drug.png';
    /* 图片加载区域结束 */
    /* 按钮区域开始 */
    this.buttonWidth = this.canvas.width - 20;
    this.buttonHeight = 50 * scaleY;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = menuButtonInfo.top + 50;
    /* 按钮区域结束 */
    /* 道具区域开始 */
    this.wingCount = 0;
    this.getWingAccess = '';
    this.moonCount = 0;
    this.getMoonAccess = '';
    this.drugCount = 0;
    this.getDrugAccess = '';
    /* 道具区域结束 */
    this.drawBottomAd();
  }
  // 绘制广告
  drawAd() {
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-34c5af2089cd54df'
      })
      this.videoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      this.videoAd.onError((err) => {
        console.error('激励视频光告加载失败', err)
      });
    }
    if (this.videoAd) {
      this.videoAd.show().catch(() => {
        this.videoAd.load()
          .then(() => this.videoAd.show())
          .catch(err => {
            console.error('激励视频 广告显示失败', err)
          })
      });
    }
    if (this.videoAd) {
      this.videoAd.onClose((res) => {
        if (res && res.isEnded || res === undefined) {
          if (this.clickWhat == 'wing') {
            wx.setStorageSync('wingCount', this.wingCount + 1);
          } else if (this.clickWhat == 'moon') {
            wx.setStorageSync('moonCount', this.moonCount + 1);
          } else if (this.clickWhat == 'drug') {
            wx.setStorageSync('drugCount', this.drugCount + 1);
          }
        }
      })
    }
  }
  // 绘制底部广告
  drawBottomAd() {
    this.bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-516f17ab80e68280',
      style: {
          left: 10,
          top: 0,
          width: this.canvas.width - 20
      }
    });
    this.bannerAd.show()
    this.bannerAd.onResize(res => {
      this.bannerAd.style.top = this.canvas.height - res.height - 10
    })
    // 监听 banner 广告错误事件
    this.bannerAd.onError(err => {
      console.error(err.errMsg)
    });
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
    this.context.save();
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#f5d659', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('道具列表', this.buttonX + this.buttonWidth / 2, this.buttonY + 20 * scaleY);
    this.context.font = `${12 * scaleY}px Arial`;
    this.context.fillText('通过看广告兑换后，可在关卡中使用', this.buttonX + this.buttonWidth / 2, this.buttonY + 36 * scaleY);
    this.context.restore();
  }
  // 绘制飞天翼道具区
  drawWingArea() {
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 60 * scaleY, this.buttonWidth, 80 * scaleY, 10, '#f5d659', 'black', 3);
    if (this.wingImage.complete) {
      this.context.drawImage(this.wingImage, this.buttonX + 10, this.buttonY + 68 * scaleY, 64 * scaleY, 64 * scaleY);
    }
    this.context.save();
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.getWingAccess = wx.getStorageSync('wingCount');
    if (typeof this.getWingAccess == 'string') {
      this.wingCount = 0;
    } else {
      this.wingCount = this.getWingAccess;
    }
    this.context.fillText(`x${this.wingCount}`, this.buttonX + 64 * scaleY + 20, this.buttonY + 80 * scaleY);
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('飞天翼', this.buttonWidth, this.buttonY + 60 * scaleY + 64 * scaleY / 2);
    this.context.font = `${12 * scaleX}px Arial`;
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('无限连跳，开局施放可连跳2000米', this.buttonWidth, this.buttonY + 80 * scaleY + 64 * scaleY / 2);
    this.context.restore();
  }
  // 绘制月球药道具绘制
  drawMoonArea() {
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 150 * scaleY, this.buttonWidth, 80 * scaleY, 10, '#f5d659', 'black', 3);
    if (this.moonImage.complete) {
      this.context.drawImage(this.moonImage, this.buttonX + 10, this.buttonY + 158 * scaleY, 64 * scaleY, 64 * scaleY);
    }
    this.context.save();
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.getMoonAccess = wx.getStorageSync('moonCount');
    if (typeof this.getMoonAccess == 'string') {
      this.moonCount = 0;
    } else {
      this.moonCount = this.getMoonAccess;
    }
    this.context.fillText(`x${this.moonCount}`, this.buttonX + 64 * scaleY + 20, this.buttonY + 170 * scaleY);
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('月球药', this.buttonWidth, this.buttonY + 150 * scaleY + 64 * scaleY / 2);
    this.context.font = `${12 * scaleX}px Arial`;
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('得到地球重力的1/6，1000步内有效', this.buttonWidth, this.buttonY + 170 * scaleY + 64 * scaleY / 2);
    this.context.restore();
  }
  // 绘制道具区域
  drawToolsArea() {
    drawRoundedRect(this.context, this.buttonX, this.buttonY + 240 * scaleY, this.buttonWidth, 80 * scaleY, 10, '#f5d659', 'black', 3);
    if (this.drugImage.complete) {
      this.context.drawImage(this.drugImage, this.buttonX + 10, this.buttonY + 248 * scaleY, 64 * scaleY, 64 * scaleY);
    }
    this.context.save();
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.getDrugAccess = wx.getStorageSync('drugCount');
    if (typeof this.getDrugAccess == 'string') {
      this.drugCount = 0;
    } else {
      this.drugCount = this.getDrugAccess;
    }
    this.context.fillText(`x${this.drugCount}`, this.buttonX + 64 * scaleY + 20, this.buttonY + 260 * scaleY);
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('隐身药', this.buttonWidth, this.buttonY + 240 * scaleY + 64 * scaleY / 2);
    this.context.font = `${12 * scaleX}px Arial`;
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText('得到隐身能力，可规避一次撞击', this.buttonWidth, this.buttonY + 260 * scaleY + 64 * scaleY / 2);
    this.context.restore();
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标题
    this.drawTitle();
    // 绘制飞天翼道具区
    this.drawWingArea();
    // 绘制月球药道具绘制
    this.drawMoonArea();
    // 绘制隐身药绘制
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
      touchY >= this.buttonY + 60 * scaleY && touchY <= this.buttonY + 140 * scaleY) {
      this.clickWhat = 'wing';
      this.drawAd();
    }
    // 点击月球药区域
    if (touchX >= this.buttonX && touchX <= this.buttonX + this.buttonWidth &&
      touchY >= this.buttonY + 150 * scaleY && touchY <= this.buttonY + 230 * scaleY) {
      this.clickWhat = 'moon';
      this.drawAd();
    }
    // 点击隐身药区域
    if (touchX >= this.buttonX && touchX <= this.buttonX + this.buttonWidth &&
      touchY >= this.buttonY + 240 * scaleY && touchY <= this.buttonY + 320 * scaleY) {
      this.clickWhat = 'drug';
      this.drawAd();
    }
  }
  // 页面销毁机制
  destroy() {
    this.bannerAd.hide();
    this.bannerAd = '';
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.wingImage.src = '';
    this.moonImage.src = '';
    this.drugImage.src = '';
  }
}