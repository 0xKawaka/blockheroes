export default class BarHandler {
  bar: Phaser.GameObjects.Graphics
  width: number
  height: number

  constructor(battleScene: Phaser.Scene, x:number, y:number, color:number, width:number, height: number) {
    this.width = width
    this.height = height
    this.bar = this.createBar(battleScene, x, y, color, width, height)
  }

  createBar(battleScene: Phaser.Scene, x:number, y:number, color:number, width:number, height: number): Phaser.GameObjects.Graphics {
    let bar = this.makeBar(battleScene, x, y, color, width, height);
    return bar
  }

  setBarPercentageValue(percentage: number) {
    this.bar.scaleX = percentage;
    this.bar.update()
  }

  makeBar(battleScene: Phaser.Scene, x: number, y: number, color: number, width: number, height: number) {
    let bar = battleScene.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, width, height);
    bar.x = x;
    bar.y = y;
    return bar;
  }

  hideBar() {
    this.bar.setVisible(false)
  }

  showBar() {
    this.bar.setVisible(true)
  }

  updateBar() {
    this.bar.update()
  }

}