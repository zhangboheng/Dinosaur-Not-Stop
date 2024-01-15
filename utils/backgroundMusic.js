class BackgroundMusic {
  constructor() {
    this.backgroundMusic = wx.createInnerAudioContext();
    this.backgroundMusic.src = 'audio/back.mp3';
    this.backgroundMusic.loop = true;
    // 初始化音乐播放状态
    this.backgroundMusicEnabled = this.getBackgroundMusicState();
  }
  getBackgroundMusicState() {
    // 使用微信API从本地存储获取音乐播放状态
    const state = wx.getStorageSync('backgroundMusicEnabled');
    return state ? true : state; // 如果没有状态，默认为 true
  }
  setBackgroundMusicState(state) {
    // 使用微信API保存音乐播放状态到本地存储
    wx.setStorageSync('backgroundMusicEnabled', state);
    this.backgroundMusicEnabled = state;
  }
  // 播放背景音乐
  playBackgroundMusic() {
    if (this.backgroundMusicEnabled) {
      this.backgroundMusic.play();
    }
  }
  // 暂停背景音乐
  pauseBackgroundMusic() {
    if (this.backgroundMusicEnabled) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0
    }
  }
}

export default BackgroundMusic