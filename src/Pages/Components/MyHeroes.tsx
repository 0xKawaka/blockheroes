import ServerHandler from '../../Classes/IO/ServerHandler'
import { useState, useEffect } from 'react'
import "./MyHeroes.css"
import HeroPanel from "./HeroPanel"
import {HeroesStatsDict, HeroesListType, RunesList} from '../../Types/apiTypes'
import RunePanel from "./RunePanel"
import HeroesList from "./HeroesList"
import ArrowBack from "../../assets/misc/arrowback.png"

type MyHeroesProps = {
  serverHandler: ServerHandler
  heroesList: HeroesListType
  runesList: RunesList
  setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>
}

function getUnequipedRunes(runesList:RunesList, heroesList:HeroesListType){
  const runesIdsEquiped = heroesList.map(hero => hero.runesIds).flat()
  return runesList.filter(rune => !runesIdsEquiped.includes(rune.id))
}

function getHeroById(heroId:number, heroesList:HeroesListType){
  return heroesList.find(hero => hero.id === heroId)
}


function MyHeroes ( {serverHandler, heroesList, runesList, setShowMyHeroes} : MyHeroesProps) {
  const [showingHero, setShowingHero] = useState<boolean>(false)
  const [heroId, setHeroId] = useState<number>(0)
  const [showingRunes, setShowingRunes] = useState<boolean>(false)
  const [runeSelectId, setRuneSelectId] = useState<number>(0)
  const [runeSpotClicked, setRuneSpotClicked] = useState<number>(0)

  serverHandler.RuneHandler.setRuneClickedIdSetter(setRuneSelectId)

  const runeListUnequiped = getUnequipedRunes(runesList, heroesList)

  function handleHeroClick(heroId: number) {
    setHeroId(heroId)
    setShowingHero(true)
  }

  function handleRuneClick(runeId: number, runeSpotClicked: number) {
    setRuneSelectId(runeId)
    setRuneSpotClicked(runeSpotClicked)
    setShowingRunes(true)
  }

  const heroInfos = getHeroById(heroId, heroesList)

  return (
  <div className="myHeroesContainer">
    {!showingHero && !showingRunes &&
      <div className="myHeroesMenuAndHeroesListContainer">
        <div className="myHeroesArrowBackContainer" onClick={() => setShowMyHeroes(false)}>
          <img className="ArrowBack" src={ArrowBack} />
        </div>
        <HeroesList heroesList={heroesList} handleHeroClick={handleHeroClick}></HeroesList>
      </div>
    }
    {showingHero && !showingRunes && heroInfos &&
      <HeroPanel heroIndex={heroId} heroInfos={heroInfos} runesList={runesList} setShowingHero={setShowingHero} handleRuneClick={handleRuneClick}></HeroPanel>
    }
    {showingRunes &&
      <RunePanel runeClicked={runesList.find(rune => rune.id === runeSelectId)} runeSpotClicked={runeSpotClicked} runeListUnequiped={runeListUnequiped} heroId={heroId} setShowingRunes={setShowingRunes} serverHandler={serverHandler}></RunePanel>
    }

  </div>)
}

export default MyHeroes 