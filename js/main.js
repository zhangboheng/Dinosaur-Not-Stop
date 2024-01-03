import Scene1 from './scene/scene1.js';
import Scene2 from './scene/scene2.js';

export default class Game {
  constructor() {
    this.canvas = wx.createCanvas();
    this.context = canvas.getContext('2d');
    this.scene1 = Scene1;
    this.scene2 = Scene2;
    this.currentScene = new this.scene1(this);

    canvas.addEventListener('touchstart', (e) => {
      this.currentScene.touchHandler(e);
    });

    this.loop()
  }

  loop() {
    this.currentScene.draw();
    if (this.currentScene instanceof Scene2) {
      this.currentScene.update();
    }
    requestAnimationFrame(this.loop.bind(this));
  }
  // 切换页面方法
  switchScene(newScene) {
    // 页面销毁后需要将就页面的资源和监听器进行清理
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }
    this.currentScene = newScene;
  }
}
