class SoundManager {
  constructor() {
    this.sounds = {
      get: new Audio('audio/get.mp3'),
      jump: new Audio('audio/jump.mp3'),
      crack: new Audio('audio/crack.mp3'),
      end: new Audio('audio/gameover.mp3'),
      win: new Audio('audio/gamewin.mp3')
    };
    // 初始化音乐播放状态
    this.musicEnabled = this.getMusicState();
  }
  getMusicState() {
    // 使用微信API从本地存储获取音乐播放状态
    const state = wx.getStorageSync('musicEnabled');
    return state ? true : state; // 如果没有状态，默认为 true
  }
  setMusicState(state) {
    // 使用微信API保存音乐播放状态到本地存储
    wx.setStorageSync('musicEnabled', state);
    this.musicEnabled = state;
  }
  play(soundName, delay = 0) {
    if (!this.musicEnabled) return; // 如果音乐被禁用，则不播放
    const sound = this.sounds[soundName];
    if (sound) {
      setTimeout(() => {
        sound.currentTime = 0; // 重置音频时间
        sound.play();
      }, delay);
    }
  }
}

export default SoundManager