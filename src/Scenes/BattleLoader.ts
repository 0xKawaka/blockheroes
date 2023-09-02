import { assert } from 'console'
import Phaser from 'phaser'
import BackgroundDict from '../assets/backgrounds/BackgroundDict'
import {getLevelBackground, getLevelMonsters} from '../GameDatas/Levels/levels'
import loadingBattle from '../assets/backgrounds/loadingBattle.png'

export default class BattleLoader extends Phaser.Scene {
  constructor() {
    super('BattleLoader')
  }

  preload() {
    this.load.image('loaderBackground', loadingBattle)
    let worldId = this.registry.get('worldId')
    let battleId = this.registry.get('battleId')
    let img = require('../assets/backgrounds/' +  getLevelBackground(worldId, battleId) + '.png')
    this.load.image('background', img)
  }

  create({worldId, battleId, selectedTeam}:{worldId: string, battleId: string, selectedTeam: Array<integer>}) {
    // this.add.image(0, 0, 'background')
    this.add.text(100, 100, 'Loading battle...')
    this.scene.start('Battle', {battleId:battleId, worldId:worldId, background:getLevelBackground(worldId, battleId), monsterArray:getLevelMonsters(worldId, battleId), selectedTeam: selectedTeam})
  }
}