import BuffDisplay from "./BuffDisplay"

export default class StackableBuff{
  name:string
  scale: number
  textScale: number
  fontSize: number
  visibleBuffs: Array<Boolean>
  buffs: Array<BuffDisplay>

  constructor(name:string, scale: number, textScale: number){
    this.name = name
    this.scale = scale
    this.textScale = textScale

    this.visibleBuffs = []
    this.buffs = []
  }

  createOrSetBuff(position:{x:number, y:number}, duration: number, battleScene: Phaser.Scene) {
    for(let i= 0; i < this.visibleBuffs.length; i++){
      if(!this.visibleBuffs[i]){
        this.setExistingImage(i, position, duration)
        return
      }
    }
    this.createImage(position, duration,  battleScene)
  }
  createImage(position:{x:number, y:number}, duration: number, battleScene: Phaser.Scene){
    this.visibleBuffs.push(true)
    this.buffs.push(new BuffDisplay("buff_" + this.name, battleScene, this.scale, this.textScale, true, position, duration))

  }
  setExistingImage(index:number, position:{x:number, y:number}, duration: number) {
    this.buffs[index].setX(position.x)
    this.buffs[index].setY(position.y)
    this.buffs[index].setDurationText(duration)
    this.visibleBuffs[index] = true
    this.buffs[index].setVisible(true)

  }
  reset() {
    for(let i = 0; i < this.visibleBuffs.length; i++){
      this.visibleBuffs[i] = false
      this.buffs[i].setVisible(false)
    }
  }

}