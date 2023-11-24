import { BattleInfos, HeroInfos, HeroStats, HeroesStatsDict, RunesList } from "../../Types/apiTypes"
import BattleOverview from "./BattleOverview"
import './BattlesSelect.css'
import { useEffect, useState } from "react"
import BattleTeamSelection from "./BattleTeamSelection"
import ArrowBack from "../../assets/misc/arrowback.png"
import BattlePage from "./BattlePage"
import EntityFactory from "../../Classes/Entity/EntityFactory"
import Entity from "../../Classes/Entity/Entity"
import Skill from "../../Classes/Skill/Skill"
import EndBattlePanel from "./EndBattlePanel"
import { Account } from "starknet"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"

type BattleSelectProps = {
  worldId: number
  battlesList: Array<BattleInfos>
  heroesList: Array<HeroInfos>
  localWallet: Account
  setWorldId: React.Dispatch<React.SetStateAction<number>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
}

function computeTotalStats(baseeStats: HeroStats, bonusStats: HeroStats): HeroStats {
  return {
    health: baseeStats.health + bonusStats.health,
    speed: baseeStats.speed + bonusStats.speed,
    attack: baseeStats.attack + bonusStats.attack,
    defense: baseeStats.defense + bonusStats.defense,
    criticalChance: baseeStats.criticalChance + bonusStats.criticalChance,
    criticalDamage: baseeStats.criticalDamage + bonusStats.criticalDamage,
  }
}

function BattlesSelect ( {worldId, battlesList, heroesList, localWallet, setWorldId, setIsBattleRunning} : BattleSelectProps) {
  const [selectedBattleIndex, setSelectedBattleIndex] = useState<number>(-1)
  const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>([])
  const [phaserRunning , setPhaserRunning] = useState<boolean>(false)
  const [isLootPanelVisible, setIsLootPanelVisible] = useState<boolean>(false)
  const [winOrLose, setWinOrLose] = useState<string>("")
  const [eventHandler, setGameEventHandler] = useState<GameEventHandler>()

  useEffect(() => {
    setGameEventHandler(new GameEventHandler())
  }, [])

  function getSelectedTeam(selectedHeroesIds:number[]): Entity[] {
    let selectedTeamNames = []
    let selectedTeamStats = []
    let selectedTeamSkills = []
    for (let i=0; i<selectedHeroesIds.length; i++){
      const hero = heroesList.find(hero => hero.id === selectedHeroesIds[i])
      if (hero !== undefined){
        selectedTeamNames.push(hero.name)
        selectedTeamSkills.push(hero.spells)
        selectedTeamStats.push(computeTotalStats(hero.baseStats, hero.bonusStats))
      }
    }
    let entities = []
    for(let i =0; i <selectedTeamNames.length; i++){
      entities.push(EntityFactory.createEntity(selectedTeamNames[i], 1, selectedTeamStats[i].health, selectedTeamStats[i].speed, selectedTeamSkills[i]))
    }
    return entities
  }

  function getEnemiesTeam(selectedBattleIndex:number): Entity[] {
    let entities = []
    for (let i=0; i<battlesList[selectedBattleIndex].enemies.length; i++){
      entities.push(EntityFactory.createEntity(battlesList[selectedBattleIndex].enemies[i].name, battlesList[selectedBattleIndex].enemies[i].level, battlesList[selectedBattleIndex].enemies[i].stats.health, battlesList[selectedBattleIndex].enemies[i].stats.speed, battlesList[selectedBattleIndex].enemies[i].spells))
    }
    return entities
  }

  return (
  <div className="BattlesSelectContainer">
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex == -1  &&
      <div className="BattlesSelectArrowBackAndBattlesListContainer">
        <div className="BattleSelectArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => setWorldId(-1)}/>
        </div>
        <div className="BattlesSelectList">
          {battlesList !== undefined && battlesList.map((battle, i) => {
            return (  
              <div className="BattleOverviewContainer" key={i} onClick={() => setSelectedBattleIndex(i)}>
                <BattleOverview enemiesNames={battle.enemies.map((enemy) => {return enemy.name})} enemiesLevels={battle.enemies.map((enemy) => {return enemy.level})} energyCost={battle.energyCost} />
              </div>
            )
          })}
        </div>
      </div>
    }
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex !== -1 &&
      <div className="BattleTeamSelectionAndArrowBackContainer">
        <img className="ArrowBack" src={ArrowBack} onClick={() => setSelectedBattleIndex(-1)}/>
        <BattleTeamSelection worldId={worldId} battleId={selectedBattleIndex} enemiesNames={battlesList[selectedBattleIndex].enemies.map((enemy) => {return enemy.name})} enemiesLevels={battlesList[selectedBattleIndex].enemies.map((enemy) => {return enemy.level})} energyCost={battlesList[selectedBattleIndex].energyCost} heroesList={heroesList} selectedHeroesIds={selectedHeroesIds} localWallet={localWallet} eventHandler={eventHandler!} setSelectedHeroesIds={setSelectedHeroesIds} setPhaserRunning={setPhaserRunning} />
      </div>
    }
    {phaserRunning &&
      <BattlePage worldId={worldId} battleId={selectedBattleIndex} selectedTeam={getSelectedTeam(selectedHeroesIds)} selectedHeroesIds={selectedHeroesIds} enemiesTeam={getEnemiesTeam(selectedBattleIndex)} eventHandler={eventHandler!} localWallet={localWallet} setPhaserRunning={setPhaserRunning} setIsBattleRunning={setIsBattleRunning} setIsLootPanelVisible={setIsLootPanelVisible} setWinOrLose={setWinOrLose}  />
    }
    {!phaserRunning && isLootPanelVisible &&
      <div className="OutOfBattleContainer">
        {winOrLose === "Defeat" &&
          <EndBattlePanel title={winOrLose} setWinOrLose={setWinOrLose} setIsLootPanelVisible={setIsLootPanelVisible} setIsBattleRunning={setIsBattleRunning} />          
        }
        {winOrLose === "Victory" &&
          <EndBattlePanel title={winOrLose} lootItems={[{name:"Explorer's emblem", amount:1, image:"Emblem"}]} setWinOrLose={setWinOrLose} setIsLootPanelVisible={setIsLootPanelVisible} setIsBattleRunning={setIsBattleRunning} />
          // {name:"Contributor's emblem", amount:1, image:"Emblem"}    
        }
      </div>
    }
  </div>
  )
}

export default BattlesSelect