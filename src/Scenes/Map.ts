import { assert } from 'console'
import Phaser from 'phaser'

// import battle1 from '../assets/backgrounds/battle1.png'

export default class Map extends Phaser.Scene {
  constructor() {
    super('Map')
  }

  preload() {

  }

  create() {
    // this.load.image('background', BackgroundDict[battleId])
    // this.load.image('background', battle1)
    this.add.text(100, 100, 'Map')

    
    this.scene.start('BattleLoader', { worldId:"world1", battleId:"battle2", selectedTeam: [1, 2, 2, 1] })
  }

  monsters = {
    1: {
    },
    2: {
    },
  }
}