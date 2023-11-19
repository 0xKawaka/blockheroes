export default class BuffDisplay {
  image: Phaser.GameObjects.Image
  // durationText: Phaser.GameObjects.Text
  durationText: Phaser.GameObjects.BitmapText
  scale: number
  textScale: number
  fontSize: number

  constructor(imageName: string, battleScene: Phaser.Scene, scale:number, textScale:number, visible:boolean = false, position: {x:number, y:number} = {x:0, y:0}, duration: number = 0) {
    this.scale = scale
    this.textScale = textScale
    this.image = battleScene.add.image(Math.round(position.x), Math.round(position.y), imageName)
    this.image.setScale(scale)
    this.image.setVisible(visible)
    this.image.setOrigin(1, 1)
    this.fontSize = 8 * textScale
    // this.durationText = battleScene.add.text(position.x, position.y, duration.toString(), { font: this.fontSize + "px kenney", color: "#e8e8e8" });
    this.durationText = battleScene.add.bitmapText(position.x, position.y, "RetroGaming10", duration.toString())
    console.log("this.textScale ", this.textScale)
    this.durationText.setScale(this.textScale)
    this.durationText.setOrigin(1, 1)
    this.durationText.setVisible(visible)
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
    this.durationText.y = y
  }
  setDurationText(duration: number) {
    this.durationText.setText(duration.toString())
  }
}