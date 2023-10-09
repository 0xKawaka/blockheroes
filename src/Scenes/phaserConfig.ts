import Phaser from 'phaser'
import BattleScene from './BattleScene'
import BattleLoader from './BattleLoader'
import FontLoader from './FontLoader'
import ServerHandler from '../Classes/IO/ServerHandler'
import Entity from '../Classes/Entity/Entity'

function getPhaserConfig(serverHandler: ServerHandler, walletAdrs:string, parentContainer:string, worldId:string, battleId:string, selectedTeam: Entity[], selectedHeroesIds:number[], enemiesTeam: Entity[]): Phaser.Types.Core.GameConfig{

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
      // arcade: {
      //   debug: true
      // }
    },
    scene: [FontLoader, BattleLoader, BattleScene],
  
    callbacks: {
      preBoot: function (game) {
        game.registry.merge({"serverHandler": serverHandler, "walletAdrs": walletAdrs, "worldId": worldId, "battleId": battleId, "selectedTeam": selectedTeam, "selectedHeroesIds": selectedHeroesIds, "enemiesTeam": enemiesTeam});
      }
    }
  }
  return Config

}

export {getPhaserConfig}