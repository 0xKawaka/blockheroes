import BarHandler from "../BarHandler";

export default class HealthBar{
  healthBar: BarHandler
  backgroundBar: BarHandler

  constructor(battleScene: Phaser.Scene, x:number, y:number, color:number, width:number, height: number) {
    this.backgroundBar = new BarHandler(battleScene, x - 1, y - 1, 0x000000, width + 2, height + 2)
    this.healthBar = new BarHandler(battleScene, x, y, color, width, height)
  }

  setBarPercentageValue(percentage: number) {
    this.healthBar.setBarPercentageValue(percentage);
  }

  hideBar() {
    this.healthBar.hideBar()
    this.backgroundBar.hideBar()
    this.updateBothBars()
  }

  showBar() {
    this.healthBar.showBar()
    this.backgroundBar.showBar()
    this.updateBothBars()
  }

  updateBothBars() {
    this.healthBar.updateBar()
    this.backgroundBar.updateBar()
  }
}