import "./BattleTeamSelection.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import energy from "../../assets/icons/energy.png"
import { useState, useEffect } from "react"
import { HeroesListType } from "../../Types/apiTypes"
import HeroesList from "./HeroesList"
import ApiHandler from "../../Classes/IO/ApiHandler"
import Skill from "../../Classes/Skill/Skill"
import { create } from "domain"
import SkillsHandler from "../../Classes/IO/SkillsHandler"


type BattleTeamSelectionProps = {
  enemiesNames: string[],
  enemiesLevels: number[],
  // enemiesRanks: number[],
  energyCost: number,
  heroesList: HeroesListType
  selectedHeroesIds: number[],
  setSelectedHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setEnemiesSkills: React.Dispatch<React.SetStateAction<Array<Array<Skill>>>>
}

export default function BattleTeamSelection({enemiesNames, enemiesLevels, energyCost, heroesList, selectedHeroesIds, setSelectedHeroesIds, setBattleRunning, setEnemiesSkills }: BattleTeamSelectionProps) {
  // const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>([])
  const notSelectedHeroesList = heroesList.filter(hero => !selectedHeroesIds.includes(hero.id))
  const [loadingEnemiesSkills, setLoadingEnemiesSkills] = useState<boolean>(true)

  function handleHeroClick(heroId: number) {
    if(selectedHeroesIds.includes(heroId)){
      setSelectedHeroesIds(selectedHeroesIds.filter(id => id !== heroId))
    }
    else if (selectedHeroesIds.length < 4){
      setSelectedHeroesIds([...selectedHeroesIds, heroId])
    }
  }
  function handlePlayClick() {
    if(loadingEnemiesSkills){
      console.log("loadingEnemiesSkills")
      return
    }
    if(selectedHeroesIds.length > 0){
      setBattleRunning(true)
    }
  }

  useEffect(() => {
    ApiHandler.getEnemiesSkills(enemiesNames).then((enemiesSkills) => {
      setEnemiesSkills(SkillsHandler.createEnemiesSkills(enemiesSkills))
      setLoadingEnemiesSkills(false)
    }
    )
  }, [])

  return(
  <div className="BattleTeamSelectionContainer">
    <div className="BattleTeamSelectionAndPlayButtonContainer">  
      <div className="BattleTeamSelectionTeamsContainer">
        <div className="BattleTeamSelectionMiniaturesAndTitleContainer">
          {/* <div className="BattleTeamSelectionTitle">My team</div> */}
          <div className="BattleTeamSelectionHeroesMiniatures">
            {selectedHeroesIds.length > 0 && selectedHeroesIds.map((heroId, i) => {
              const heroInfos = heroesList.find(hero => hero.id === heroId)
              if(heroInfos === undefined) return (<></>)
              return (
                <div className="HeroMiniatureWrapper" key={i} onClick={() =>  handleHeroClick(heroId)}>
                  <HeroMiniature image={portraitsDict[heroInfos.name]} rank={1} level={heroInfos.level} imageWidth="90px"></HeroMiniature>
                </div>
              )
            }
          )}
          </div>
        </div>
        <div className="BattleTeamSelectionVersusText">VS</div>
        <div className="BattleTeamSelectionMiniaturesAndTitleContainer">
          {/* <div className="BattleTeamSelectionTitle">Enemies</div> */}
          <div className="BattleTeamSelectionEnemiesMiniatures">
            {enemiesNames.map((enemyName, i) => {
              return (
                <div className="HeroMiniatureWrapper" key={i}>
                  <HeroMiniature image={portraitsDict[enemyName]} rank={1} level={enemiesLevels[i]} imageWidth="90px"></HeroMiniature>
                </div>
              )
            }
          )}
          </div>
        </div>
      </div>
      {<div className="BattleTeamSelectionPlayButton" onClick={handlePlayClick}>
        <div className="BattleTeamSelectionPlayButtonText">Play</div>
        <div className="BattleTeamSelectionEnergyCostValueIconContainer">
          <div className="BattleTeamSelectionEnergyCostValue">{energyCost}</div>
          <img className="BattleTeamSelectionEnergyCostIcon" src={energy} />
        </div>
      </div>}
    </div>
    <HeroesList heroesList={notSelectedHeroesList} handleHeroClick={handleHeroClick} /> 
  </div>
  )
}