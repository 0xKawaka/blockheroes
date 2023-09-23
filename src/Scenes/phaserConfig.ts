import Phaser from 'phaser'
import BattleScene from './BattleScene'
import BattleLoader from './BattleLoader'
import ServerHandler from '../Classes/IO/ServerHandler'
import { HeroStats } from '../Types/apiTypes'
import Entity from '../Classes/Entity/Entity'

function getPhaserConfig(serverHandler: ServerHandler, walletAdrs:string, parentContainer:string, worldId:string, battleId:string, selectedTeam: Entity[], selectedHeroesIds:number[], enemiesTeam: Entity[]): Phaser.Types.Core.GameConfig{
  const Config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentContainer,
    backgroundColor: '#282c34',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.ScaleModes.NONE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [BattleLoader, BattleScene],
  
    callbacks: {
      preBoot: function (game) {
        game.registry.merge({"serverHandler": serverHandler, "walletAdrs": walletAdrs, "worldId": worldId, "battleId": battleId, "selectedTeam": selectedTeam, "selectedHeroesIds": selectedHeroesIds, "enemiesTeam": enemiesTeam});
      }
    }
  }
  return Config

}

export {getPhaserConfig}