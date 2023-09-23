import './GamePage.css'
import ApiHandler from '../Classes/IO/ApiHandler'
import ServerHandler from '../Classes/IO/ServerHandler'
import MyHeroes from './Components/MyHeroes'
import { useState, useEffect } from 'react'
import {HeroesListType, RunesList, HeroesStatsDict, WorldsBattlesInfosDict, HeroStats} from '../Types/apiTypes'
import WorldSelect from './Components/WorldSelect'
import worldmap from '../assets/icons/worldmap.png'
import myheroes from '../assets/icons/myheroes.png'
import SkillsHandler from '../Classes/IO/SkillsHandler'
import { computeBonusStats } from './utils/statisticsCompute'


type GamePageProps = {
  serverHandler: ServerHandler
}  

function GamePage({serverHandler} : GamePageProps) {

  const [heroesList, setHeroesList] = useState<HeroesListType>([])
  const [runesList, setRunesList] = useState<RunesList>([])
  const [worldsBattlesList, setWorldsBattlesList] = useState<WorldsBattlesInfosDict>({})
  // const [baseStatsDict, setBaseStatsDict] = useState<HeroesStatsDict>({})
  const [runeEquippedDatas, setRuneEquippedDatas] = useState<{runeId: number, heroId: number, spot: number}>({runeId: 0, heroId: 0, spot: 0})
  const [runeUnequippedDatas, setRuneUnequippedDatas] = useState<{runeId: number, heroId: number, spot: number}>({runeId: 0, heroId: 0, spot: 0})
  const [useEffectAction, setUseEffectAction] = useState<string>('none')
  const [refreshUseEffect, setRefreshUseEffect] = useState<number>(0)
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [isPhaserRunning, setIsPhaserRunning] = useState<boolean>(false)

  function getGamePageContainerStyle(){
    if (isPhaserRunning){
      return {
        paddingTop: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
      }
    }
    else {
      return {
        paddingTop: "100px",
        paddingLeft: "100px",
        paddingRight: "100px",
      }
    }
  }

  function handleRuneEquipped(runeId:number, heroId:number, spot:number){
    setRuneEquippedDatas({runeId: runeId, heroId: heroId, spot: spot})
    setUseEffectAction('equip')
    setRefreshUseEffect(refreshUseEffect + 1)
  }
  function handleRuneUnequipped(runeId:number, heroId:number, spot:number){
    setRuneUnequippedDatas({runeId: runeId, heroId: heroId, spot: spot})
    setUseEffectAction('unequip')
    setRefreshUseEffect(refreshUseEffect + 1)
  }

  function indexOfHeroEquippedRuneId(runeId:number, heroesList:HeroesListType): number {
    for (let i=0; i<heroesList.length; i++){
      const indexRune = heroesList[i].runesIds.indexOf(runeId)
      if (indexRune !== -1){
        return i
      }
    }
    return -1
  }
  function handleRuneUpgraded(runeId:number, runesList:RunesList){
    setRunesList(runesList)
    const heroIndex = indexOfHeroEquippedRuneId(runeId, heroesList)
    if (heroIndex !== -1){
      let newHeroesList = [...heroesList]
      newHeroesList[heroIndex].bonusStats = computeBonusStats(newHeroesList[heroIndex], runesList)
      setHeroesList(newHeroesList)
    }
  }

  serverHandler.RuneHandler.setHandleRuneEquippedUX(handleRuneEquipped)
  serverHandler.RuneHandler.setHandleRuneUnequippedUX(handleRuneUnequipped)
  serverHandler.RuneHandler.setHandleRuneUpgradedUX(handleRuneUpgraded)

  useEffect(() => {
    console.log('useEffect GamePage')
    if (useEffectAction === 'equip'){
      const indexHero = heroesList.findIndex(hero => hero.id === runeEquippedDatas.heroId)
      let newHeroesList = [...heroesList]
      newHeroesList[indexHero].runesIds.push(runeEquippedDatas.runeId)
      newHeroesList[indexHero].spots.push(runeEquippedDatas.spot)
      newHeroesList[indexHero].bonusStats = computeBonusStats(newHeroesList[indexHero], runesList)
      setHeroesList(newHeroesList)
    }
    else if (useEffectAction === 'unequip'){
      const indexHero = heroesList.findIndex(hero => hero.id === runeUnequippedDatas.heroId)
      let newHeroesList = [...heroesList]
      const indexRune = newHeroesList[indexHero].runesIds.indexOf(runeUnequippedDatas.runeId)
      newHeroesList[indexHero].runesIds.splice(indexRune, 1)
      newHeroesList[indexHero].spots.splice(indexRune, 1)
      newHeroesList[indexHero].bonusStats = computeBonusStats(newHeroesList[indexHero], runesList)
      setHeroesList(newHeroesList)
    }
    else {
      (async () => {
        const promiseGetHeeroes = ApiHandler.getHeroesWithSpellsBaseStatsAndRunes('0xtest')
        const promiseGetRunes = ApiHandler.getRunes('0xtest')
        Promise.all([promiseGetHeeroes, promiseGetRunes]).then((values) => {
          let heroesWithFormattedSkillsAndBonusStats = SkillsHandler.formatHeroesSkillsAndBonusStats(values[0], values[1])
          setHeroesList(heroesWithFormattedSkillsAndBonusStats)
          setRunesList(values[1])
        })
        ApiHandler.getWorldsBattlesListWithStats().then((worldsBattlesList) => {
          setWorldsBattlesList(worldsBattlesList)
        })
      })();
    }
  }, [refreshUseEffect]);


  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer' >
      <div className='GamePageContainer' style={getGamePageContainerStyle()}>
        {!showMyHeroes && !showWorldSelect &&
          <div className='GamePageMenu'>
            <div className='GamePageMenuButton' onClick={() => setShowMyHeroes(true)}>
            <div className="GamePageMenuButtonIcon">
              <img src={myheroes} />
            </div>
            <div className="GamePageMenuButtonText">
              My Heroes Collection
            </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowWorldSelect(true)}>
            <div className="GamePageMenuButtonIcon">
              <img src={worldmap} />
            </div>
            <div className="GamePageMenuButtonText">
              World Battles
            </div>
            </div>
          </div>
        }
        {showMyHeroes &&
          <MyHeroes serverHandler={serverHandler} heroesList={heroesList} runesList={runesList} setShowMyHeroes={setShowMyHeroes}/>
        }
        {showWorldSelect &&
          <WorldSelect worldsBattlesList={worldsBattlesList} heroesList={heroesList} serverHandler={serverHandler} setShowWorldSelect={setShowWorldSelect} setIsPhaserRunning={setIsPhaserRunning} />
        }
      </div>
    </div>
  )
}

export default GamePage