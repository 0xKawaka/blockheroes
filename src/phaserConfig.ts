import Phaser from 'phaser'

import Map from './Scenes/Map'
import BattleScene from './Scenes/BattleScene'
import BattleLoader from './Scenes/BattleLoader'
import ServerHandler from './Classes/ServerHandler'

function getPhaserConfig(serverHandler: ServerHandler, walletAdrs:string, parentContainer:string, worldId:string, battleId:string): Phaser.Types.Core.GameConfig{
  const Config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentContainer,
    backgroundColor: '#282c34',
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [Map, BattleLoader, BattleScene],
  
    callbacks: {
      preBoot: function (game) {
        game.registry.merge({"serverHandler": serverHandler, "walletAdrs": walletAdrs, "worldId": worldId, "battleId": battleId});
      }
    }
  }
  return Config

}


// export default Phaser.Game(config)
export {getPhaserConfig}