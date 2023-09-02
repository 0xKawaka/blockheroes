import Phaser from 'phaser'
import Battle from '../Classes/Battle'
import imagesByName from '../GameDatas/Monsters/imagesByName'
import Entity from '../Classes/Entity/Entity'
import Skill from '../Classes/Skill/Skill'
import { skillsDict} from '../GameDatas/Skills/skills'
import ClickHandler from '../Classes/ClickHandler'
import ServerHandler from '../Classes/ServerHandler'
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
    this.loadMusicLoop()
  }

  async create({battleId, worldId, background, monsterArray, selectedTeam}:{battleId: string, worldId:string, background: any, monsterArray: Array<Entity>, selectedTeam: Array<integer>}) {
    this.serverHandler = this.registry.get('serverHandler')
    let walletAdrs = this.registry.get('walletAdrs')
    this.battle.setServerHandler(this.serverHandler)
    this.serverHandler.setBattle(this.battle)
    this.serverHandler.send({type:"newBattle", walletAdrs:walletAdrs, battleId:battleId, worldId:worldId})
    this.battle.positionScaler.setCanvasWidthHeight(this.sys.canvas.width, this.sys.canvas.height)
    const music = this.sound.add('battleLoop');
    music.loop = true;
    music.play();
    this.setBackground(background, 'background', 0, 0)
    this.loadSpellAnimations()
    this.loadProjectiles()
    this.loadBuffsStatus()
    this.createEntities(monsterArray, selectedTeam);
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

  loadProjectiles(){
    projectileInfos.forEach((projectileInfo) => {
      let img = require('../assets/projectiles/' + projectileInfo.name + '.png')
      this.load.image("projectile_" + projectileInfo.name, img)
    })
  }

  loadSpellAnimations(){
    spellAnimInfos.forEach((spellAnimInfo) => {
      let img = require('../assets/spellAnim/' + spellAnimInfo.name + '.png')
      this.load.spritesheet(spellAnimInfo.name, img, { frameWidth: spellAnimInfo.width, frameHeight: spellAnimInfo.height })
    })
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

  getMonsterNameArray(monsterArray: Array<Entity>): Array<string> {
    let monsterNameArray: Array<string> = []
    for (let i = 0; i < monsterArray.length; i++) {
      monsterNameArray.push(monsterArray[i].name)
    }
    return monsterNameArray
  }

  loadSkills(monsterArray: Array<Entity>) {
    let loadedSkills: Array<string> = []
    for (let i = 0; i < monsterArray.length; i++) {
      monsterArray[i].skillArray.forEach((skill: Skill) => {
        if (!loadedSkills.includes(skill.name)) {
          loadedSkills.push(skill.name)
          this.load.image(skill.name, skillsDict[skill.name].image)
        }
      })
    }
  }
  loadBuffsStatus(){
    buffsDebuffsStats.forEach((stat: string) => {
      let imgBuff = require('../assets/buffs/' + stat + '.png')
      let imgDebuff = require('../assets/status/' + stat + '.png')
      this.load.image("buff_" + stat, imgBuff)
      this.load.image("status_" + stat, imgDebuff)
    })

    onTurnStackableBuffNames.forEach((stackableBuffName) => {
      let img = require('../assets/buffs/' + stackableBuffName + '.png')
      this.load.image("buff_" + stackableBuffName, img)
    })
    onTurnStackableStatusNames.forEach((stackableStatusName) => {
      let img = require('../assets/status/' + stackableStatusName + '.png')
      this.load.image("buff_" + stackableStatusName, img)
    })
    let img = require('../assets/status/stun.png')
    this.load.image("status_stun", img)
  }

  loadMusicLoop(musicName: string = 'battle'){
    let sound = require('../assets/sound/music/' + musicName + '.mp3')
    this.load.audio('battleLoop', sound);
  }

  createEntities(monsterArray: Array<Entity>, selectedTeam: Array<integer>) {
    this.loadSkills(monsterArray)
    let monsterNameArray: Array<string> = this.getMonsterNameArray(monsterArray)

    let loadedNames: Array<string> = []
    for (let i = 0; i < monsterNameArray.length; i++) {
      if (!loadedNames.includes(monsterNameArray[i])) {
        this.load.spritesheet(monsterNameArray[i], this.imagesByName[monsterNameArray[i]], { frameWidth: 288, frameHeight: 128 })
        loadedNames.push(monsterNameArray[i])
      }
    }
    let entitiesNames = monsterNameArray.concat(monsterNameArray)
    let entitiesArray = monsterArray.concat(monsterArray)

    let isAllyOrEnemy = []
    for (let i = 0; i < entitiesNames.length; i++) {
      isAllyOrEnemy.push(i < monsterNameArray.length ? 'enemy' : 'ally')
    }
    this.waitLoadedAndCreateEntities(entitiesArray, entitiesNames, isAllyOrEnemy, selectedTeam.length ,monsterArray.length)
  }

  waitLoadedAndCreateEntities(entitiesArray: Array<Entity>, entitiesNames: Array<string>, isAllyOrEnemy: Array<string>, alliesCount: number, enemiesCount: number) {
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      for (let i = 0; i < entitiesNames.length; i++) {
        this.battle.createEntity(entitiesArray[i], i, isAllyOrEnemy[i], alliesCount, enemiesCount)
      }
      this.battleLoaded = true
    })
  }
}