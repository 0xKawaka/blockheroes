import { useState, useEffect } from 'react'
import "./MyHeroes.css"
import HeroPanel from "./HeroPanel"
import {HeroesStatsDict, HeroInfos, RunesList} from '../../Types/apiTypes'
import RunePanel from "./RunePanel"
import HeroesList from "./HeroesList"
import ArrowBack from "../../assets/misc/arrowback.png"

type MyHeroesProps = {
  heroesList: Array<HeroInfos>
  runesList: RunesList
  setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>
}

function getUnequipedRunes(runesList:RunesList, heroesList:Array<HeroInfos>){
  const runesIdsEquiped = heroesList.map(hero => hero.runesIds).flat()
  return runesList.filter(rune => !runesIdsEquiped.includes(rune.id))
}

function getHeroById(heroId:number, heroesList:Array<HeroInfos>){
  return heroesList.find(hero => hero.id === heroId)
}


function MyHeroes ( {heroesList, runesList, setShowMyHeroes} : MyHeroesProps) {
  const [showingHero, setShowingHero] = useState<boolean>(false)
  const [heroId, setHeroId] = useState<number>(0)
  const [showingRunes, setShowingRunes] = useState<boolean>(false)
  const [runeSelectId, setRuneSelectId] = useState<number>(0)
  const [runeSpotClicked, setRuneSpotClicked] = useState<number>(0)

  // serverHandler.RuneHandler.setRuneClickedIdSetter(setRuneSelectId)

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
        <div className="myHeroesArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowMyHeroes(false)}/>
        </div>
        <HeroesList heroesList={heroesList} handleHeroClick={handleHeroClick} heroesWidth="8.8rem"></HeroesList>
      </div>
    }
    {showingHero && !showingRunes && heroInfos &&
      <HeroPanel heroIndex={heroId} heroInfos={heroInfos} runesList={runesList} setShowingHero={setShowingHero} handleRuneClick={handleRuneClick}></HeroPanel>
    }
    {showingRunes &&
      <RunePanel runeClicked={runesList.find(rune => rune.id === runeSelectId)} runeSpotClicked={runeSpotClicked} runeListUnequiped={runeListUnequiped} heroId={heroId} setShowingRunes={setShowingRunes} ></RunePanel>
    }

  </div>)
}

export default MyHeroes 