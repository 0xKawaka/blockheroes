import StatsModifier from "../Statistic/StatsModifier";
import Entity from "./Entity";
import Turnbar from "./Turnbar";
import IBattleEntity from "./IBattleEntity";
import HealthBar from "./HealthBar";
import TextAnim from "../Animations/TextAnim";
import Battle from "../Battle";
import BattleScene from "../../Scenes/BattleScene";
import { buffsDebuffsStats, onTurnStackableBuffNames, onTurnStackableStatusNames } from "../../GameDatas/Skills/buffsStatus";
import BuffDisplay from "./BuffDisplay";
import StackableBuff from "./StackableBuff";
import ServerHandler from "../IO/ServerHandler";
import SpriteWrapper from "../Animations/SpriteWrapper";
import AnimationsHandler from "../Animations/AnimationsHandler";
import ISkillAnimation from "../Skill/Animations/ISkillAnimation";

export default class BattleEntity implements IBattleEntity {
  Entity: Entity
  index: number
  position: {x: number, y: number}
  battleSpeed: number
  statusArray: Array<StatsModifier>
  buffsArray: Array<StatsModifier>
  stackableBuffsDict: {[key: string]: StackableBuff}
  stackableStatusDict: {[key: string]: StackableBuff}
  buffsByName: {[key: string]: BuffDisplay}
  statusByName: {[key: string]: BuffDisplay}
  currentHealth: number
  turnbar: Turnbar
  sprite: SpriteWrapper
  healthBar: HealthBar
  displayTurnBar: HealthBar
  stunned: boolean
  scaleValue: number
  entityWidth: number = 288
  entityHeight: number = 128
  countVisible: number

  constructor(Entity:Entity, index: number, teamEntityCount: number, statusArray: Array<StatsModifier>, buffsArray: Array<StatsModifier>, battleScene: BattleScene, isAlly: boolean, animationIndexes:{[key: string]:{start:number, end:number}}) {
    this.countVisible = 0
    this.stunned = false
    this.Entity = Entity
    this.index = index
    this.battleSpeed = Entity.statistics.speed
    this.statusArray = statusArray
    this.buffsArray = buffsArray
    this.stackableBuffsDict = {}
    this.stackableStatusDict = {}
    this.currentHealth = Entity.statistics.health
    this.scaleValue = battleScene.battle.positionScaler.computeScaleForWidthHeightRatio(this.entityWidth, this.entityHeight, battleScene.battle.positionScaler.entityRatio.widthRatio, battleScene.battle.positionScaler.entityRatio.heightRatio)
    this.position = battleScene.battle.positionScaler.computePositionEntity(this.scaleValue, this.entityWidth, this.entityHeight, index, teamEntityCount, isAlly)
    // console.log("Position for entity ", index, " is ", this.position)
    this.sprite = this.createSprite(battleScene, animationIndexes)
    this.turnbar = new Turnbar(index, this.battleSpeed)
    this.createHealthBar(battleScene)
    this.createTurnBar(battleScene)
    this.initBuffsDebuffsByName(battleScene)
  }

  updateHealth(): void {
    if(this.currentHealth <= 0) {
      this.currentHealth = 0
    }
    else if(this.currentHealth > this.Entity.statistics.health) {
      this.currentHealth = this.Entity.statistics.health
    }
    this.healthBar.setBarPercentageValue(this.currentHealth / this.Entity.statistics.health)
  }

  applyDamage(isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void {
    animationHandler.playAnim(this, "hurt").then(() => {
      animationHandler.waitAndIdle(this)
    })
    this.currentHealth -= value
    let fontSize = Math.floor(this.sprite.getHeight() / 3);
    let textAnim = isCrit ? "CRIT " + (~~value).toString() : (~~value).toString()
    let distanceTravel = this.sprite.getHeight() / 2
    new TextAnim(battleScene, distanceTravel, this.position.x, this.position.y - this.sprite.getHeight() / 2, textAnim, { font: fontSize + "px Sans-serif"}, 0xff0000)
  }
  applyHeal(value: number, battleScene: Phaser.Scene): void {
    this.currentHealth += value
    let fontSize = Math.floor(this.sprite.getHeight() / 2.6);
    let distanceTravel = this.sprite.getHeight() / 2
    new TextAnim(battleScene, distanceTravel, this.position.x, this.position.y - this.sprite.getHeight() / 2, (~~value).toString(), { font: fontSize + "px Sans-serif"}, 0x07f100)
  }

  applyBuffsAndStatus(buffs: Array<{name: string, duration: number}>, status: Array<{name: string, duration: number}>, battleScene: BattleScene): void {
    this.resetBuffsAndStatus()

    if(buffs.length === 0 && status.length === 0)
      return;

    const scale = battleScene.battle.positionScaler.computeScaleBuffsAndStatus()
    const positions = battleScene.battle.positionScaler.computePositionBuffsAndStatus(this.healthBar.backgroundBar.bar.x, this.healthBar.backgroundBar.bar.y, this.healthBar.backgroundBar.width, this.healthBar.backgroundBar.height, buffs.length, status.length, scale)
  
    for(let i = 0; i < buffs.length; i++) {
      if(buffsDebuffsStats.includes(buffs[i].name)) {
        this.displayBuff(this.buffsByName[buffs[i].name], positions[i], buffs[i].duration, battleScene)
      }
      else if (onTurnStackableBuffNames.includes(buffs[i].name)) {
        this.stackableBuffsDict[buffs[i].name].createOrSetBuff(positions[i], buffs[i].duration, battleScene)
      }
      
    }
    for(let i = 0; i < status.length; i++) {
      if(buffsDebuffsStats.includes(status[i].name)) {
        this.displayBuff(this.statusByName[status[i].name], positions[buffs.length + i], status[i].duration, battleScene)
      }
      else if (onTurnStackableStatusNames.includes(status[i].name)) {
        this.stackableStatusDict[status[i].name].createOrSetBuff(positions[buffs.length + i], status[i].duration, battleScene)
      }
      else if (status[i].name === "stun") {
        this.stunned = true
        // console.log("Display Stunned")
        if(status[i].duration != 0)
          this.displayBuff(this.statusByName[status[i].name], positions[buffs.length + i], status[i].duration, battleScene)
      }
    }
    if(this.isDead())
      this.resetBuffsAndStatus()
  }
  displayBuff(buff: BuffDisplay, position:{x:number, y:number}, duration: number, battleScene: BattleScene): void {
    buff.setDurationText(duration)
    buff.setVisible(true)
    buff.setX(position.x)
    buff.setY(position.y)
  }
  resetBuffsAndStatus(): void {
    for(let key in this.buffsByName) {
      this.buffsByName[key].setVisible(false)
    }
    for(let key in this.statusByName) {
      this.statusByName[key].setVisible(false)
    }
    for(let i = 0; i < onTurnStackableBuffNames.length; i++) {
      this.stackableBuffsDict[onTurnStackableBuffNames[i]].reset()
    }
    for(let i = 0; i < onTurnStackableStatusNames.length; i++) {
      this.stackableStatusDict[onTurnStackableStatusNames[i]].reset()
    }
  }

  die(battle: Battle, battleScene: Phaser.Scene, animationsHandler: AnimationsHandler): void {
    let index = battle.findEntityPositionByIndex(this.getIndex())
    if(index === -1)
      return;
    animationsHandler.playAnim(this, "die")
    this.healthBar.hideBar()
    this.displayTurnBar.hideBar()
    console.log('Entity ' + this.getIndex() + ' died!')
    // this.sprite.visible = false
    this.resetBuffsAndStatus()
    // this.sprite.update()
    battle.deadEntities.push(battle.battleEntities.splice(index, 1)[0])
    battle.removeEntityTurnbar(this.getIndex())
    if(battle.alliesIndexes.includes(this.getIndex())){
      battle.alliesIndexes.splice(battle.alliesIndexes.indexOf(this.getIndex()), 1)
    }
    else if(battle.enemiesIndexes.includes(this.getIndex())){
      battle.enemiesIndexes.splice(battle.enemiesIndexes.indexOf(this.getIndex()), 1)
    }
  }

  isDead(): boolean {
    return this.currentHealth <= 0
  }

  initBuffsDebuffsByName(battleScene: BattleScene) {
    this.buffsByName = {}
    this.statusByName = {}
    const scale = battleScene.battle.positionScaler.computeScaleBuffsAndStatus()
    for(let i = 0; i < buffsDebuffsStats.length; i++) {
      this.buffsByName[buffsDebuffsStats[i]] = new BuffDisplay("buff_" + buffsDebuffsStats[i], battleScene, scale)
      this.statusByName[buffsDebuffsStats[i]] = new BuffDisplay("status_" + buffsDebuffsStats[i], battleScene, scale)
    }
    for(let i = 0; i < onTurnStackableBuffNames.length; i++) {
      this.stackableBuffsDict[onTurnStackableBuffNames[i]] = new StackableBuff(onTurnStackableBuffNames[i], scale)
    }
    for(let i = 0; i < onTurnStackableStatusNames.length; i++) {
      this.stackableStatusDict[onTurnStackableStatusNames[i]] = new StackableBuff(onTurnStackableStatusNames[i], scale)
    }
    this.statusByName["stun"] = new BuffDisplay("status_stun", battleScene, scale)
  }

  createSprite(battleScene: BattleScene, animationIndexes: {[key: string]:{start:number, end:number}}): SpriteWrapper {
    // let {width, height} = battleScene.battle.positionScaler.computeWidthHeightPlaceholder()
    // let sprite = new SpriteWrapper(battleScene, this.position.x, this.position.y, this.Entity.name, this.scaleValue, this.index, width, height)
    let sprite = new SpriteWrapper(battleScene, this.position.x, this.position.y, this.Entity.name, this.scaleValue, this.index)
    
    // battleScene.anims.create({key: this.Entity.name + this.index, frames: battleScene.anims.generateFrameNumbers(this.Entity.name), frameRate:20, repeat:-1})
    for (let animationName in animationIndexes) {
      if(animationName === "idle")
        this.createAnim(battleScene, this.index , this.Entity.name, animationName, -1, animationIndexes[animationName])
      else 
        this.createAnim(battleScene, this.index , this.Entity.name, animationName, 0, animationIndexes[animationName])
    }
    sprite.play(this.Entity.name + this.index + 'idle')
    return sprite
  }
  createAnim(battleScene: Phaser.Scene, entityIndex: number, entityName:string, animationName: string, repeat: number, startEnd: {start: number, end: number}): void {
    battleScene.anims.create({
      key: entityName + entityIndex + animationName,
      frames: battleScene.anims.generateFrameNumbers(entityName, {start:startEnd.start, end:startEnd.end}),
      frameRate: 20,
      repeat: repeat
  });}

  playAnim(animationName: string): void {
    console.log("Playing anim " + this.Entity.name + this.index + animationName)
    this.sprite.play(this.Entity.name + this.index + animationName)
  }
  // async playHurtThenIdle(animationHandler: AnimationsHandler): Promise<void> {
  //   await animationHandler.playHurtThenIdle(this)
  // }

  playTurn(battle: Battle, onTurnProcs: {type: string, entityIndex: number, damages:Array<number>, heals:Array<number>, buffs:Array<{name: string, duration: number}>,
  statuses:Array<{name: string, duration: number}>, isDead:boolean, speed:number}, serverHandler:ServerHandler, animationsHandler: AnimationsHandler): void {
    if(this.index != onTurnProcs.entityIndex)
      throw new Error('OnTurnProcs Wrong entity index : ' + onTurnProcs.entityIndex + 'expected ' + this.index)
    this.stunned = false
    this.setBattleSpeed(onTurnProcs.speed)
    for(let i= 0; i < onTurnProcs.damages.length; i++) {
      this.applyDamage(false, onTurnProcs.damages[i], battle.battleScene, animationsHandler)
    }
    for(let i= 0; i < onTurnProcs.heals.length; i++) {
      this.applyHeal(onTurnProcs.heals[i], battle.battleScene)
    }
    this.updateHealth()
    if(onTurnProcs.isDead) {
      this.die(battle.battleScene.battle, battle.battleScene, animationsHandler)
      return;
    }
    this.applyBuffsAndStatus(onTurnProcs.buffs, onTurnProcs.statuses, battle.battleScene)
  }
  endTurn() {
    this.turnbar.resetTurn()
  }
  updateDisplayTurnBar(turnbarValue: number): void {
    if(turnbarValue > 100)
      this.displayTurnBar.setBarPercentageValue(1)
    else
      this.displayTurnBar.setBarPercentageValue(turnbarValue/100)
  }
  createHealthBar(battleScene: BattleScene): void {
    let width = this.sprite.getWidth()
    let height = this.sprite.getHeight() / 7
    let x = this.sprite.getPlaceholderX() - this.sprite.getWidth() / 2
    let y = this.sprite.getPlaceholderY() - this.sprite.getHeight() - height
    this.healthBar = new HealthBar(battleScene, x, y, 0x2ecc71, width, height);
  }
  createTurnBar(battleScene: BattleScene): void {
    let width = this.sprite.getWidth()
    let height = this.sprite.getHeight() * 0.03
    let x = this.sprite.getPlaceholderX() - this.sprite.getWidth() / 2
    let y = this.sprite.getPlaceholderY() - this.sprite.getHeight() - height
    this.displayTurnBar = new HealthBar(battleScene, x, y, 0x3498db, width, height);
  }
  selectSkill() {}
  endSkillSelection() {}
  // getSkillAnim(skillName: string): ISkillAnimation {
  //   return this.Entity.getSkillAnim(skillName)
  // }
  getFrontEntityX(): number {
    throw new Error("Method getFrontEntityX not implemented.");
  }
  getEntity(): Entity {
    return this.Entity
  }
  getIndex(): number {
    return this.index
  }
  getBattleSpeed(): number {
    return this.battleSpeed
  }
  setBattleSpeed(value: number): void {
    this.battleSpeed = value
  }
  setOnCooldown(name: string, cooldown: number): void {
    throw new Error("Method setOnCooldown not implemented.");
  }
  getPosition(): {x: number, y: number} {
    return this.position
  }
  getStatusArray(): Array<StatsModifier> {
    return this.statusArray
  }
  getBuffsArray(): Array<StatsModifier> {
    return this.buffsArray
  }
  getCurrentHealth(): number {
    return this.currentHealth
  }
  getTurnbar(): Turnbar {
    return this.turnbar
  }
  getSprite(): SpriteWrapper {
    return this.sprite
  }
  getHealthBar(): HealthBar{
    return this.healthBar
  }
  getScaledValue(): number {
    return this.scaleValue
  }
  getName(): string {
    return this.Entity.name
  }
  isStunned(): boolean {
    return this.stunned
  }
}