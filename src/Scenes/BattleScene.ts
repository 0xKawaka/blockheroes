import Phaser from 'phaser'
import Battle from '../Classes/Battle'
import Entity from '../Classes/Entity/Entity'
import Skill from '../Classes/Skill/Skill'
import ClickHandler from '../Classes/ClickHandler'
import ServerHandler from '../Classes/IO/ServerHandler'
import Scaler from '../Classes/Camera/Scaler'
import Zoomer from '../Classes/Camera/Zoomer'
import Positionner from '../Classes/Camera/Positionner'


export default class BattleScene extends Phaser.Scene {
  battle: Battle
  clickHandler: ClickHandler
  battleLoaded: boolean
  serverHandler: ServerHandler

  constructor() {
    super('Battle')
    // this.battleLoaded = false
    this.battle = new Battle(this)
    this.clickHandler = new ClickHandler(this.battle)
    this.battle.setBattleScene(this)
  }

  preload() {
  }

  async create() {
    // this.serverHandler = this.registry.get('serverHandler')
    // let walletAdrs = this.registry.get('walletAdrs')
    // let selectedTeam = this.registry.get('selectedTeam')
    // let enemiesTeam = this.registry.get('enemiesTeam')

    // this.battle.setServerHandler(this.serverHandler)
    // this.serverHandler.setBattle(this.battle)
    // // this.serverHandler.send({type:"newBattle", walletAdrs:walletAdrs, battleId:battleId, worldId:worldId, selectedTeam: selectedTeam})
    // this.battle.positionScaler.setCanvasWidthHeight(this.sys.canvas.width, this.sys.canvas.height)
    // this.playMusic()
    // this.setBackground(background, 'background', 0, 0)
    // this.createEntities(enemiesTeam, selectedTeam);
    // this.load.start()
    // this.input.on('pointerdown', this.clickHandler.handleClick, this.clickHandler);

    // while (!this.battleLoaded) {
    //   await new Promise(resolve => setTimeout(resolve, 50));
    //   console.log('waiting for battle to load')
    // }

    // const cam2 = this.cameras.add(0, 0, this.sys.canvas.width, this.sys.canvas.height);

    let backgroundWidth = 640
    let backgroundHeight = 389
    this.battle.setScaler(new Scaler(this.sys.canvas.width, backgroundWidth))
    this.battle.setZoomer(new Zoomer(this.sys.canvas.width, this.sys.canvas.height, backgroundWidth, backgroundHeight, this.battle.scaler.getScaleFactor()))
    this.battle.setPositionner(new Positionner(backgroundWidth * this.battle.scaler.getScaleFactor(), backgroundHeight * this.battle.scaler.getScaleFactor()))

    let selectedTeam = this.registry.get('selectedTeam')
    let enemiesTeam = this.registry.get('enemiesTeam')
    this.serverHandler = this.registry.get('serverHandler')
    this.battle.setServerHandler(this.serverHandler)
    this.serverHandler.setBattle(this.battle)
    this.battle.positionScaler.setCanvasWidthHeight(this.sys.canvas.width, this.sys.canvas.height)
    this.playMusic()
    // let backgroundOffset = this.battle.scaler.getBackgroundOffset()
    let backgroundImg = this.add.image(0, 0, 'background').setOrigin(0, 0)
    // cam2.ignore(backgroundImg)

    this.battle.scaler.scaleBackground(backgroundImg)
    this.battle.zoomer.zoomAndMoveMainCamera(this.cameras.main)

    this.createEntities(enemiesTeam, selectedTeam);
    this.input.on('pointerdown', this.clickHandler.handleClick, this.clickHandler);
    await this.battle.startBattle()
  }

  // getScaleFactor(): number{
  //   return this.battle.scaler.getScaleFactor()
  // }

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

  // setBackground(name:string, x: number, y: number) {
  //   this.background = this.add.image(x, y, name)
  //   this.background.setOrigin(0, 0)
  //   this.background.displayWidth = this.sys.canvas.width;
  //   this.background.displayHeight = this.sys.canvas.height;
  // }

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
          // this.load.image(skill.name, skillsDict[skill.name].image)
          this.load.image(skill.name, skill.image)
        }
      })
    }
  }

  createEntities(enemiesTeam: Array<Entity>, selectedTeam: Array<Entity>) {
    // this.loadSkills(enemiesTeam)
    // this.loadSkills(selectedTeam)
    let enemiesNameArray: Array<string> = this.getEntitiesNameArray(enemiesTeam)
    let selectedTeamNameArray: Array<string> = this.getEntitiesNameArray(selectedTeam)

    // let loadedNames: Array<string> = []
    // for (let i = 0; i < enemiesNameArray.length; i++) {
    //   if (!loadedNames.includes(enemiesNameArray[i])) {
    //     const spritesheet  = require('../assets/monsters/' + enemiesNameArray[i] + '/' + 'spritesheetSmall.png')
    //     // this.load.spritesheet(enemiesNameArray[i], spritesheet, { frameWidth: 360, frameHeight: 160 })
    //     // const spritesheet  = require('../assets/monsters/' + enemiesNameArray[i] + '/' + 'spritesheet.png')
    //     this.load.spritesheet(enemiesNameArray[i], spritesheet, getSpriteSize(enemiesNameArray[i]))

    //     loadedNames.push(enemiesNameArray[i])
    //   }
    // }
    // for(let i = 0; i < selectedTeam.length; i++){
    //   if(!loadedNames.includes(selectedTeam[i].name)){
    //     const spritesheet  = require('../assets/monsters/' + selectedTeam[i].name + '/' + 'spritesheetSmall.png')
    //     // this.load.spritesheet(selectedTeam[i].name, spritesheet, { frameWidth: 360, frameHeight: 160 })
    //     // const spritesheet  = require('../assets/monsters/' + selectedTeam[i].name + '/' + 'spritesheet.png')
    //     this.load.spritesheet(selectedTeam[i].name, spritesheet, getSpriteSize(enemiesNameArray[i]))

    //     loadedNames.push(selectedTeam[i].name)
    //   }
    // }
    let entitiesNames = enemiesNameArray.concat(selectedTeamNameArray)
    let entitiesArray = enemiesTeam.concat(selectedTeam)

    let isAllyOrEnemy = []
    for (let i = 0; i < entitiesNames.length; i++) {
      isAllyOrEnemy.push(i < enemiesNameArray.length ? 'enemy' : 'ally')
    }
    for (let i = 0; i < entitiesNames.length; i++) {
      console.log('creating entity ' + entitiesNames[i])
      this.battle.createEntity(entitiesArray[i], i, isAllyOrEnemy[i], selectedTeam.length, enemiesTeam.length)
    }
    // this.waitLoadedAndCreateEntities(entitiesArray, entitiesNames, isAllyOrEnemy, selectedTeam.length, enemiesTeam.length)
  }

  // createEntities(enemiesTeam: Array<Entity>, selectedTeam: Array<Entity>) {
  //   this.loadSkills(enemiesTeam)
  //   this.loadSkills(selectedTeam)
  //   let enemiesNameArray: Array<string> = this.getEntitiesNameArray(enemiesTeam)
  //   let selectedTeamNameArray: Array<string> = this.getEntitiesNameArray(selectedTeam)

  //   let loadedNames: Array<string> = []
  //   for (let i = 0; i < enemiesNameArray.length; i++) {
  //     if (!loadedNames.includes(enemiesNameArray[i])) {
  //       const spritesheet  = require('../assets/monsters/' + enemiesNameArray[i] + '/' + 'spritesheetSmall.png')
  //       // this.load.spritesheet(enemiesNameArray[i], spritesheet, { frameWidth: 360, frameHeight: 160 })
  //       // const spritesheet  = require('../assets/monsters/' + enemiesNameArray[i] + '/' + 'spritesheet.png')
  //       this.load.spritesheet(enemiesNameArray[i], spritesheet, getSpriteSize(enemiesNameArray[i]))

  //       loadedNames.push(enemiesNameArray[i])
  //     }
  //   }
  //   for(let i = 0; i < selectedTeam.length; i++){
  //     if(!loadedNames.includes(selectedTeam[i].name)){
  //       const spritesheet  = require('../assets/monsters/' + selectedTeam[i].name + '/' + 'spritesheetSmall.png')
  //       // this.load.spritesheet(selectedTeam[i].name, spritesheet, { frameWidth: 360, frameHeight: 160 })
  //       // const spritesheet  = require('../assets/monsters/' + selectedTeam[i].name + '/' + 'spritesheet.png')
  //       this.load.spritesheet(selectedTeam[i].name, spritesheet, getSpriteSize(enemiesNameArray[i]))

  //       loadedNames.push(selectedTeam[i].name)
  //     }
  //   }
  //   let entitiesNames = enemiesNameArray.concat(selectedTeamNameArray)
  //   let entitiesArray = enemiesTeam.concat(selectedTeam)

  //   let isAllyOrEnemy = []
  //   for (let i = 0; i < entitiesNames.length; i++) {
  //     isAllyOrEnemy.push(i < enemiesNameArray.length ? 'enemy' : 'ally')
  //   }
  //   this.waitLoadedAndCreateEntities(entitiesArray, entitiesNames, isAllyOrEnemy, selectedTeam.length, enemiesTeam.length)
  // }

//   waitLoadedAndCreateEntities(entitiesArray: Array<Entity>, entitiesNames: Array<string>, isAllyOrEnemy: Array<string>, alliesCount: number, enemiesCount: number) {
//     this.load.once(Phaser.Loader.Events.COMPLETE, () => {
//       for (let i = 0; i < entitiesNames.length; i++) {
//         console.log('creating entity ' + entitiesNames[i])
//         this.battle.createEntity(entitiesArray[i], i, isAllyOrEnemy[i], alliesCount, enemiesCount)
//       }
//       this.battleLoaded = true
//     })
//   }
}