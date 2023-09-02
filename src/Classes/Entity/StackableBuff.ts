export default class StackableBuff{
  name:string
  scale: number
  fontSize: number
  durations:Array<number>
  // positions:Array<{x:number, y:number}>
  images:Array<Phaser.GameObjects.Image>
  visibleImages: Array<boolean>
  durationTexts:Array<Phaser.GameObjects.Text>

  constructor(name:string, scale: number){
    this.name = name
    this.scale = scale
    this.fontSize = 45 * scale
    this.durations = []
    this.images = []
    this.visibleImages = []
    this.durationTexts = []
  }

  createOrSetBuff(position:{x:number, y:number}, duration: number, battleScene: Phaser.Scene) {
    for(let i= 0; i < this.visibleImages.length; i++){
      if(!this.visibleImages[i]){
        this.setExistingImage(i, position, duration)
        return
      }
    }
    this.createImage(position, duration,  battleScene)
  }
  createImage(position:{x:number, y:number}, duration: number, battleScene: Phaser.Scene){
    console.log("Push new image")
    this.visibleImages.push(true)
    this.durations.push(duration)
    // this.images.push(battleScene.add.image(position.x, position.y, "buff_" + this.name + this.images.length))
    this.images.push(battleScene.add.image(position.x, position.y, "buff_" + this.name))
    this.images[this.images.length - 1].setScale(this.scale)
    this.images[this.images.length - 1].setOrigin(0, 1)
    this.images[this.images.length - 1].setVisible(true)
    this.durationTexts.push(battleScene.add.text(position.x, position.y - 100 * this.scale, this.durations[this.durations.length - 1].toString(), {font: "bold " + this.fontSize + "px Arial", color: "#e8e8e8"}))
    this.durationTexts[this.durationTexts.length - 1].setText(duration.toString())
    this.durationTexts[this.durationTexts.length - 1].setVisible(true)
  }
  setExistingImage(index:number, position:{x:number, y:number}, duration: number) {
    this.visibleImages[index] = true
    this.durations[index] = duration
    this.images[index].setVisible(true)
    this.images[index].setX(position.x)
    this.images[index].setY(position.y)
    this.durationTexts[index].setText(duration.toString())
    this.durationTexts[index].setVisible(true)
    this.durationTexts[index].setX(position.x)
    this.durationTexts[index].setY(position.y - 100 * this.scale)
  }
  reset() {
    for(let i = 0; i < this.visibleImages.length; i++){
      this.visibleImages[i] = false
      this.images[i].setVisible(false)
      this.durationTexts[i].setVisible(false)
    }
  }

}