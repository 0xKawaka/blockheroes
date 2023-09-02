import Entity from "./Entity/Entity";
import EntityFactory from "./Entity/EntityFactory";
// import BattleScene from "../Scenes/BattleScene";
import Turnbar from "./Entity/Turnbar";
import IBattleEntity from "./Entity/IBattleEntity";
import ServerHandler from "./ServerHandler";
import AnimationsHandler from "./Animations/AnimationsHandler";
import PositionScaler from "./Entity/PositionScaler";
import BattleScene from "../Scenes/BattleScene";
import { skillsDict } from "../GameDatas/Skills/skills";


export default class Battle {
  battleEntities: Array<IBattleEntity>
  deadEntities: Array<IBattleEntity>
  alliesIndexes: Array<number>
  enemiesIndexes: Array<number>
  turnTimeline: Array<Turnbar>
  entityFactory: EntityFactory
  battleScene: BattleScene
  selectedSkill: string
  skillTargetType: string
  hasSelectedTarget: boolean
  isTurnPlaying: boolean
  isWaitingForEnemySkill: boolean
  serverHandler: ServerHandler
  animationsHandler: AnimationsHandler
  positionScaler: PositionScaler

  constructor(battleScene: BattleScene) {
    this.battleScene = battleScene
    // this.serverHandler = serverHandler
    this.battleEntities = []
    this.deadEntities = []
    this.alliesIndexes = []
    this.enemiesIndexes = []
    this.turnTimeline = []
    this.entityFactory = new EntityFactory()
    this.hasSelectedTarget = false
    this.isTurnPlaying = false
    this.isWaitingForEnemySkill = false
    this.animationsHandler = new AnimationsHandler(this)
    this.positionScaler = new PositionScaler()
  }

  setServerHandler(serverHandler: ServerHandler){
    this.serverHandler = serverHandler
  }

  async startBattle() {
    while(true){
      if(this.isBattleOver()) {
        console.log("Battle over")
        this.battleScene.destroyGame()
        return
      }
      // console.log('before : ', JSON.parse(JSON.stringify(this.turnTimeline)))
      this.loopUntilNextTurn()
      // console.log('after : ', JSON.parse(JSON.stringify(this.turnTimeline)))
      this.isTurnPlaying = true
      this.updateDisplayTurnBars()
      let onTurnProcs = await this.serverHandler.getFirstOnTurnProcs()
      console.log("On turn procs received")
      this.getEntityHighestTurn().playTurn(this, onTurnProcs, this.serverHandler, this.animationsHandler)
      // this.getEntityHighestTurn().playTurn(this.battleScene, this.serverHandler)
      while(this.isTurnPlaying){
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  updateDisplayTurnBars(){
    for (let i = 0; i < this.battleEntities.length; i++){
      this.battleEntities[i].updateDisplayTurnBar(this.getTurnBarValue(this.battleEntities[i]))
    }
  }

  getTurnBarValue(entity: IBattleEntity): number{
    return entity.getTurnbar().turnbar
  }

  async processSkillReceivedServer(skill:string, caster: number, target: number, damageDict: {[key: number]: {isCrit: boolean,value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, speedDict:{[key: number]: number} ,deathArray: Array<number>){
    console.log("Skill received from server")
    await this.animationsHandler.playSkillAnim(this, skill, caster, target, damageDict, healDict, statusDict, buffsDict, deathArray)
    // this.applyBuffsAndStatus(buffsDict, statusDict)
    // this.applyDamages(damageDict)
    // this.applyHeals(healDict)
    // this.updateHealths()
    // this.applyDeaths(deathArray)
    this.updateSpeeds(speedDict)
    let casterEntity = this.getEntityByIndex(caster)
    if (casterEntity){
      if (this.alliesIndexes.includes(caster)){
        // console.log("setOnCooldown")
        casterEntity.setOnCooldown(skill, skillsDict[skill].cooldown)
      }
      casterEntity.endTurn()
    }
    this.selectedSkill = ""
    this.isTurnPlaying = false
  }


  applyBuffsAndStatus(buffsDict: {[key: number]: Array<{name: string, duration: number}>}, statusDict: {[key: number]: Array<{name: string, duration: number}>}){
    for(let key in buffsDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.applyBuffsAndStatus(buffsDict[key], statusDict[key], this.battleScene)
    }
  }
  applyDeaths(deathArray: Array<number>){
    for(let i = 0; i < deathArray.length; i++){
      let entity = this.getEntityByIndex(deathArray[i])
      if(entity)
        entity.die(this, this.battleScene, this.animationsHandler)
    }
  }
  applyDamages(damageDict: {[key: number]: {isCrit: boolean,value: number}}){
    for(let key in damageDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.applyDamage(damageDict[key].isCrit, damageDict[key].value, this.battleScene, this.animationsHandler)
    }
  }
  applyHeals(healDict: {[key: number]: {value: number}}){
    for(let key in healDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.applyHeal(healDict[key].value, this.battleScene)
    }
  }

  updateHealths(){
    for(let i = 0; i < this.battleEntities.length; i++){
      this.battleEntities[i].updateHealth()
    }
  }

  processSkillClick(nameArray: string[]){
    if(this.isAllyTurn() && !this.hasSelectedTarget){
      this.selectedSkill = nameArray[1]
      this.getEntityHighestTurn().selectSkill(nameArray[1])
      this.getSkillTargetType(nameArray[1])
    }
  }

  processEntityClick(nameArray: string[]){
    if(this.isAllyTurn() && this.selectedSkill != "" && !this.hasSelectedTarget){
      if(this.isEntitySelectionValid(parseInt(nameArray[1]))){
        this.hasSelectedTarget = true
        this.getEntityHighestTurn().endSkillSelection()
        this.serverHandler.send({type: "skill", skill:this.selectedSkill, target:parseInt(nameArray[1])})
        this.serverHandler.waitForResponse()
      }
    }
  }

  isEntitySelectionValid(entityIndex: number): boolean{
    if (this.skillTargetType === "enemy") {
      if(this.enemiesIndexes.includes(entityIndex)){
        return true
      }
    } else if (this.skillTargetType === "ally" || this.skillTargetType === "self") {
      if(this.alliesIndexes.includes(entityIndex)){
        return true
      }
    }
    return false
  }

  getSkillTargetType(selectedSkill: string){
    this.getEntityHighestTurn().getEntity().skillArray.forEach(skill => {
      if(skill.name === selectedSkill){
        if(skill.targetType === "enemy"){
          this.skillTargetType = "enemy"
        } else if(skill.targetType === "ally"){
          this.skillTargetType = "ally"
        } else if(skill.targetType === "self"){
          this.skillTargetType = "self"
        }
      }
    })
  }

  updateSpeeds(speedDict:{[key: number]: number}){
    for(let key in speedDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.setBattleSpeed(speedDict[key])
    }
  }

  updateTurnTimeline() {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      let entity = this.getEntityByIndex(this.turnTimeline[i].entityIndex)
      if(!entity)
        break;
      this.turnTimeline[i].setSpeed(entity.getBattleSpeed())
    }
  }

  createEntity(entity: Entity, entityIndex: number, isAllyOrEnemy: string, alliesCount:number, enemiesCount: number){
    
    if (isAllyOrEnemy === "ally") {
      let battleEntity = EntityFactory.createBattleEntityAllyOrEnemyFromEntity(entity, entityIndex, alliesCount, isAllyOrEnemy, this.battleScene)
      this.animationsHandler.addOnAnimationCompleteListener(battleEntity)
      this.battleEntities.push(battleEntity)
      this.turnTimeline.push(battleEntity.getTurnbar())
      this.alliesIndexes.push(entityIndex)
    } else if (isAllyOrEnemy === "enemy") {
      let battleEntity = EntityFactory.createBattleEntityAllyOrEnemyFromEntity(entity, entityIndex, enemiesCount, isAllyOrEnemy, this.battleScene)
      this.animationsHandler.addOnAnimationCompleteListener(battleEntity)
      this.battleEntities.push(battleEntity)
      this.turnTimeline.push(battleEntity.getTurnbar())
      this.enemiesIndexes.push(entityIndex)
    }


  }

  loopUntilNextTurn() {
    this.updateTurnTimeline()
    this.sortTurnTimeline()
    while (this.turnTimeline[0].turnbar < 100) {
      this.incrementTurnBars()
      this.sortTurnTimeline()
    }
  }

  sortTurnTimeline() {
    this.turnTimeline.sort((a, b) => {
      if(a.turnbar === b.turnbar){
        return a.entityIndex > b.entityIndex ? -1 : 1
      }
      return a.turnbar > b.turnbar ? -1 : 1
    })
  }

  incrementTurnBars() {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      this.turnTimeline[i].incrementTurnbar()
    }
  }

  removeEntityTurnbar(entityIndex: number) {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      if(this.turnTimeline[i].entityIndex === entityIndex){
        this.turnTimeline.splice(i, 1)
        return;
      }
    }
  }

  isAllyTurn() {
    return this.alliesIndexes.includes(this.turnTimeline[0].entityIndex)
  }

  setBattleScene(battleScene: BattleScene) {
    this.battleScene = battleScene
  }

  getEntityHighestTurn(): IBattleEntity {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if (this.battleEntities[i].getIndex() === this.turnTimeline[0].entityIndex) {
        return this.battleEntities[i]
      }
    }
    console.log('Highest Turn Entity not found')
    return this.battleEntities[0]
  }

  getEntityByIndex(entityIndex: number): IBattleEntity | false {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if (this.battleEntities[i].getIndex() === entityIndex) {
        return this.battleEntities[i]
      }
    }
    return false
  }

  findEntityPositionByIndex(index: number): number {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if(this.battleEntities[i].getIndex() === index)
        return i
    }
    return -1
  }

  getAlliesOf(entityIndex: number) {
    if (this.alliesIndexes.includes(entityIndex)) {
        return this.getAllAllies();
    }
    return this.getAllEnemies();
  }

  getAllAllies() {
    let allies = new Array();
    for (let i = 0; i < this.battleEntities.length; i++) {
        if (this.alliesIndexes.includes(this.battleEntities[i].getIndex())) {
            allies.push(this.battleEntities[i]);
        }
    }
    return allies;
  }
  getAllEnemies() {
    let enemies = new Array();
    for (let i = 0; i < this.battleEntities.length; i++) {
        if (this.enemiesIndexes.includes(this.battleEntities[i].getIndex())) {
            enemies.push(this.battleEntities[i]);
        }
    }
    return enemies;
  }

  isBattleOver(): boolean {
    return this.alliesIndexes.length === 0 || this.enemiesIndexes.length === 0
  }
  

}