import ServerHandler from "../../Classes/IO/ServerHandler"
import { BattlesInfosList, HeroStats, HeroesListType, HeroesStatsDict, RunesList } from "../../Types/apiTypes"
import BattleOverview from "./BattleOverview"
import './BattlesSelect.css'
import { useState } from "react"
import BattleTeamSelection from "./BattleTeamSelection"
import ArrowBack from "../../assets/misc/arrowback.png"
import BattlePage from "./BattlePage"
import EntityFactory from "../../Classes/Entity/EntityFactory"
import Entity from "../../Classes/Entity/Entity"
import Skill from "../../Classes/Skill/Skill"
import EndBattlePanel from "./EndBattlePanel"

type BattleSelectProps = {
  worldIdStr: string
  battlesList: BattlesInfosList
  heroesList: HeroesListType
  serverHandler: ServerHandler
  setWorldIdStr: React.Dispatch<React.SetStateAction<string>>
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

function BattlesSelect ( {worldIdStr, battlesList, heroesList, serverHandler, setWorldIdStr, setIsBattleRunning} : BattleSelectProps) {
  const [selectedBattleIndex, setSelectedBattleIndex] = useState<number>(-1)
  const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>([])
  const [phaserRunning , setPhaserRunning] = useState<boolean>(false)
  const [isLootPanelVisible, setIsLootPanelVisible] = useState<boolean>(false)
  const [enemiesSkills, setEnemiesSkills] = useState<Array<Array<Skill>>>([])

  const [winOrLose, setWinOrLose] = useState<string>("")

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
    for (let i=0; i<battlesList[selectedBattleIndex].enemies.names.length; i++){
      entities.push(EntityFactory.createEntity(battlesList[selectedBattleIndex].enemies.names[i], battlesList[selectedBattleIndex].enemies.levels[i], battlesList[selectedBattleIndex].enemies.statistics[i].health, battlesList[selectedBattleIndex].enemies.statistics[i].speed, enemiesSkills[i]))
    }
    return entities
  }

  return (
  <div className="BattlesSelectContainer">
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex == -1  &&
      <div className="BattlesSelectArrowBackAndBattlesListContainer">
        <div className="BattleSelectArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => setWorldIdStr("")}/>
        </div>
        <div className="BattlesSelectList">
          {battlesList !== undefined && battlesList.map((battle, i) => {
            return (  
              <div className="BattleOverviewContainer" key={i} onClick={() => setSelectedBattleIndex(i)}>
                <BattleOverview enemiesNames={battle.enemies.names} enemiesLevels={battle.enemies.levels} energyCost={battle.energyCost} />
              </div>
            )
          })}
        </div>
      </div>
    }
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex !== -1 &&
      <div className="BattleTeamSelectionAndArrowBackContainer">
        <img className="ArrowBack" src={ArrowBack} onClick={() => setSelectedBattleIndex(-1)}/>
        <BattleTeamSelection enemiesNames={battlesList[selectedBattleIndex].enemies.names} enemiesLevels={battlesList[selectedBattleIndex].enemies.levels} energyCost={battlesList[selectedBattleIndex].energyCost} heroesList={heroesList} selectedHeroesIds={selectedHeroesIds} setSelectedHeroesIds={setSelectedHeroesIds} setPhaserRunning={setPhaserRunning} setEnemiesSkills={setEnemiesSkills} />
      </div>
    }
    {phaserRunning &&
      <BattlePage serverHandler={serverHandler} world={worldIdStr} battle={"battle"+(selectedBattleIndex+1)} selectedTeam={getSelectedTeam(selectedHeroesIds)} selectedHeroesIds={selectedHeroesIds} enemiesTeam={getEnemiesTeam(selectedBattleIndex)} setPhaserRunning={setPhaserRunning} setIsBattleRunning={setIsBattleRunning} setIsLootPanelVisible={setIsLootPanelVisible} setWinOrLose={setWinOrLose}  />
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