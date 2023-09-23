import Phaser from 'phaser'
import Battle from '../Classes/Battle'
import imagesByName from '../GameDatas/Monsters/imagesByName'
import Entity from '../Classes/Entity/Entity'
import Skill from '../Classes/Skill/Skill'
import { skillsDict} from '../GameDatas/Skills/skills'
import ClickHandler from '../Classes/ClickHandler'
import ServerHandler from '../Classes/IO/ServerHandler'
import { buffsDebuffsStats, onTurnStackableBuffNames, onTurnStackableStatusNames } from '../GameDatas/Skills/buffsStatus'
import { projectileInfos, spellAnimInfos } from '../GameDatas/Skills/skills'

export default class BattleScene extends Phaser.Scene {
  background: any
  height: number = 0
  battle: Battle
  clickHandler: ClickHandler
  imagesByName: any = imagesByName
  battleLoaded: boolean
  serverHandler: ServerHandler

  constructor() {
    super('Battle')
    this.battleLoaded = false
    this.battle = new Battle(this)
    this.clickHandler = new ClickHandler(this.battle)
    this.battle.setBattleScene(this)
  }

  preload() {
  }

  async create({background}:{background: any}) {
    this.serverHandler = this.registry.get('serverHandler')
    let walletAdrs = this.registry.get('walletAdrs')
    let selectedTeam = this.registry.get('selectedTeam')
    let enemiesTeam = this.registry.get('enemiesTeam')

    this.battle.setServerHandler(this.serverHandler)
    this.serverHandler.setBattle(this.battle)
    // this.serverHandler.send({type:"newBattle", walletAdrs:walletAdrs, battleId:battleId, worldId:worldId, selectedTeam: selectedTeam})
    this.battle.positionScaler.setCanvasWidthHeight(this.sys.canvas.width, this.sys.canvas.height)
    this.playMusic()
    this.setBackground(background, 'background', 0, 0)
    this.createEntities(enemiesTeam, selectedTeam);
    this.load.start()
    this.input.on('pointerdown', this.clickHandler.handleClick, this.clickHandler);
    while (!this.battleLoaded) {
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('waiting for battle to load')
    }
    await this.battle.startBattle()
  }

  destroyGame(){
    this.game.destroy(true, false)
  }

  update() {
  }

  playMusic(){
    const music = this.sound.add('battleLoop');
    music.loop = true;
    music.play();
  }

  setBackground(image: any, name:string, x: number, y: number) {
    this.load.image(name, image)
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.background = this.add.image(x, y, name)
      this.background.setOrigin(0, 0)
      this.background.displayWidth = this.sys.canvas.width;
      this.background.displayHeight = this.sys.canvas.height;
    })
  }

  getEntitiesNameArray(entitiesArray: Array<Entity>): Array<string> {
    let enemiesNameArray: Array<string> = []
    for (let i = 0; i < entitiesArray.length; i++) {
      enemiesNameArray.push(entitiesArray[i].name)
    }
    return enemiesNameArray
  }

  loadSkills(entitiesArray: Array<Entity>) {
    let loadedSkills: Array<string> = []
    for (let i = 0; i < entitiesArray.length; i++) {
      entitiesArray[i].skillArray.forEach((skill: Skill) => {
        if (!loadedSkills.includes(skill.name)) {
          loadedSkills.push(skill.name)
          this.load.image(skill.name, skillsDict[skill.name].image)
        }
      })
    }
  }
  // loadBuffsStatus(){
  //   buffsDebuffsStats.forEach((stat: string) => {
  //     let imgBuff = require('../assets/buffs/' + stat + '.png')
  //     let imgDebuff = require('../assets/status/' + stat + '.png')
  //     this.load.image("buff_" + stat, imgBuff)
  //     this.load.image("status_" + stat, imgDebuff)
  //   })

  //   onTurnStackableBuffNames.forEach((stackableBuffName) => {
  //     let img = require('../assets/buffs/' + stackableBuffName + '.png')
  //     this.load.image("buff_" + stackableBuffName, img)
  //   })
  //   onTurnStackableStatusNames.forEach((stackableStatusName) => {
  //     let img = require('../assets/status/' + stackableStatusName + '.png')
  //     this.load.image("buff_" + stackableStatusName, img)
  //   })
  //   let img = require('../assets/status/stun.png')
  //   this.load.image("status_stun", img)
  // }

  // convertEntitiesInfosToEntities(): Array<Entity> {
  // }

  createEntities(enemiesTeam: Array<Entity>, selectedTeam: Array<Entity>) {
    this.loadSkills(enemiesTeam)
    this.loadSkills(selectedTeam)
    let enemiesNameArray: Array<string> = this.getEntitiesNameArray(enemiesTeam)
    let selectedTeamNameArray: Array<string> = this.getEntitiesNameArray(selectedTeam)

    let loadedNames: Array<string> = []
    for (let i = 0; i < enemiesNameArray.length; i++) {
      if (!loadedNames.includes(enemiesNameArray[i])) {
        this.load.spritesheet(enemiesNameArray[i], this.imagesByName[enemiesNameArray[i]], { frameWidth: 288, frameHeight: 128 })
        loadedNames.push(enemiesNameArray[i])
      }
    }
    for(let i = 0; i < selectedTeam.length; i++){
      if(!loadedNames.includes(selectedTeam[i].name)){
        this.load.spritesheet(selectedTeam[i].name, this.imagesByName[selectedTeam[i].name], { frameWidth: 288, frameHeight: 128 })
        loadedNames.push(selectedTeam[i].name)
      }
    }
    let entitiesNames = enemiesNameArray.concat(selectedTeamNameArray)
    let entitiesArray = enemiesTeam.concat(selectedTeam)

    let isAllyOrEnemy = []
    for (let i = 0; i < entitiesNames.length; i++) {
      isAllyOrEnemy.push(i < enemiesNameArray.length ? 'enemy' : 'ally')
    }
    this.waitLoadedAndCreateEntities(entitiesArray, entitiesNames, isAllyOrEnemy, selectedTeam.length, enemiesTeam.length)
  }

  waitLoadedAndCreateEntities(entitiesArray: Array<Entity>, entitiesNames: Array<string>, isAllyOrEnemy: Array<string>, alliesCount: number, enemiesCount: number) {
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      for (let i = 0; i < entitiesNames.length; i++) {
        console.log('creating entity ' + entitiesNames[i])
        this.battle.createEntity(entitiesArray[i], i, isAllyOrEnemy[i], alliesCount, enemiesCount)
      }
      this.battleLoaded = true
    })
  }
}