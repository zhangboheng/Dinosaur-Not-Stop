class SoundManager {
  constructor() {
      this.sounds = {
          get: new Audio('audio/get.mp3'),
          jump: new Audio('audio/jump.mp3'),
          crack: new Audio('audio/crack.mp3'),
          end: new Audio('audio/gameover.mp3')
      };
  }

  play(soundName, delay = 0) {
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