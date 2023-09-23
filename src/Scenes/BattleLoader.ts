import { assert } from 'console'
import Phaser from 'phaser'
import BackgroundDict from '../assets/backgrounds/BackgroundDict'
import {getLevelBackground, getLevelMonsters} from '../GameDatas/Levels/levels'
import loadingBattle from '../assets/backgrounds/loadingBattle.png'
import { projectileInfos, spellAnimInfos } from '../GameDatas/Skills/skills'
import { buffsDebuffsStats, onTurnStackableBuffNames, onTurnStackableStatusNames } from '../GameDatas/Skills/buffsStatus'



export default class BattleLoader extends Phaser.Scene {
  constructor() {
    super('BattleLoader')
  }

  preload() {
    this.createLoadingScreen()
    this.load.image('loaderBackground', loadingBattle)
    let worldId = this.registry.get('worldId')
    let battleId = this.registry.get('battleId')
    let serverHandler = this.registry.get('serverHandler')
    let walletAdrs = this.registry.get('walletAdrs')
    let selectedHeroesIds = this.registry.get('selectedHeroesIds')
    serverHandler.send({type:"newBattle", walletAdrs:walletAdrs, battleId:battleId, worldId:worldId, selectedHeroesIds: selectedHeroesIds})
    let img = require('../assets/backgrounds/' +  getLevelBackground(worldId, battleId) + '.png')
    this.load.image('background', img)
    this.loadMusicLoop()
    this.loadSpellAnimations()
    this.loadProjectiles()
    this.loadBuffsStatus();
  }

  create({}:{}) {
    let worldId = this.registry.get('worldId')
    let battleId = this.registry.get('battleId')
    // this.scene.start('Battle', {background:getLevelBackground(worldId, battleId), monsterArray:getLevelMonsters(worldId, battleId)})
    this.scene.start('Battle', {background:getLevelBackground(worldId, battleId)})
  }

  loadSpellAnimations(){
    spellAnimInfos.forEach((spellAnimInfo) => {
      let img = require('../assets/spellAnim/' + spellAnimInfo.name + '.png')
      this.load.spritesheet(spellAnimInfo.name, img, { frameWidth: spellAnimInfo.width, frameHeight: spellAnimInfo.height })
    })
  }

  loadProjectiles(){
    projectileInfos.forEach((projectileInfo) => {
      let img = require('../assets/projectiles/' + projectileInfo.name + '.png')
      this.load.image("projectile_" + projectileInfo.name, img)
    })
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

  createLoadingScreen(){
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBarWidth = width / 4
    const progressBarHeight = height / 25
    // let progressBarWidthOffset = (width / 9)
    // let progressBarHeightOffset = (height / 47)
    const progressBarX = width / 2 - (progressBarWidth / 2)
    const progressBarY = height / 2


    progressBox.fillStyle(0xFFFFFF, 0.5);
    progressBox.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    const textSize = height / 50
    const textStr = textSize + "px monospace"


    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - progressBarHeight,
        text: 'Loading...',
        style: {
            font: textStr,
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 + progressBarHeight/2,
      text: '0%',
      style: {
          font: textStr,
          color: '#000000'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + progressBarHeight * 2,
        text: '',
        style: {
            font: textStr,
        }
    });

    assetText.setOrigin(0.5, 0.5);
    this.load.on('progress', function (value:any) {
      percentText.setText(value * 100 + '%');
      progressBar.clear();
      progressBar.fillStyle(0xeab676, 1);
      progressBar.fillRect(progressBarX + (progressBarWidth/100), progressBarY + (progressBarHeight/10), (progressBarWidth - (progressBarWidth/50)) * value, progressBarHeight - (progressBarHeight/5));
      // progressBar.fillRect(progressBarX + progressBarWidthOffset, progressBarY + progressBarHeightOffset, progressBarWidth - (progressBarWidthOffset*2) * value, progressBarHeight - (progressBarHeightOffset*2));
    });
    
    this.load.on('fileprogress', function (file:any) {
        assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
  }
}