import Phaser from 'phaser'
import BattleScene from './BattleScene'
import UIScene from './UIScene'
import BattleLoader from './BattleLoader'
import FontLoader from './FontLoader'
import Entity from '../Classes/Entity/Entity'
import EventHandler from '../Blockchain/event/EventHandler'
import { Account } from 'starknet'

function getPhaserConfig(eventHandler: EventHandler, localWallet: Account, walletAdrs:string, parentContainer:string, worldId:number, battleId:number, selectedTeam: Entity[], selectedHeroesIds:number[], enemiesTeam: Entity[]): Phaser.Types.Core.GameConfig{
  const Config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentContainer,
    backgroundColor: '#282c34',
    pixelArt: true,
    // width: 640,
	  // height: 389,
    width: window.innerWidth,
	  height: window.innerHeight,

    scale: {
      mode: Phaser.Scale.ScaleModes.NONE,
      // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      // zoom: window.innerWidth / 640,
    },
    physics: {
      default: 'arcade',
    },
    scene: [FontLoader, BattleLoader, BattleScene, UIScene],
  
    callbacks: {
      preBoot: function (game) {
        game.registry.merge({"eventHandler": eventHandler, "localWallet": localWallet, "walletAdrs": walletAdrs, "worldId": worldId, "battleId": battleId, "selectedTeam": selectedTeam, "selectedHeroesIds": selectedHeroesIds, "enemiesTeam": enemiesTeam});
      }
    }
  }
  return Config

}

export {getPhaserConfig}