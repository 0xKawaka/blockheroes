export default class BuffDisplay {
  image: Phaser.GameObjects.Image
  durationText: Phaser.GameObjects.Text
  scale: number

  constructor(imageName: string, battleScene: Phaser.Scene, scale:number) {
    this.scale = scale
    this.image = battleScene.add.image(0, 0, imageName)
    this.image.setScale(scale)
    this.image.setVisible(false)
    this.image.setOrigin(0, 1)
    let fontSize = 45 * scale
    this.durationText = battleScene.add.text(0, 0, "0", { font: "bold " + fontSize + "px Arial", color: "#e8e8e8" });
    this.durationText.setVisible(false)
  }
  setScale(scale: number) {
    this.image.setScale(scale)
  }
  setVisible(visible: boolean) {
    this.image.setVisible(visible)
    this.durationText.setVisible(visible)
    this.image.update()
    this.durationText.update()
  }
  setX(x: number) {
    this.image.x = x
    this.durationText.x = x
  }
  setY(y: number) {
    this.image.y = y
    this.durationText.y = y - 100 * this.scale
  }
  setDurationText(duration: number) {
    this.durationText.setText(duration.toString())
  }
}