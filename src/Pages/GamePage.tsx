import './GamePage.css'
import ApiHandler from '../Classes/IO/ApiHandler'
import MyHeroes from './Components/MyHeroes'
import { useState, useEffect } from 'react'
import {RunesList, BattlesInfosDict, HeroInfos, GameAccount, SkillsDict, SkillSets, BaseStatsDict, RuneInfos} from '../Types/apiTypes'
import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import SkillsHandler from '../Classes/IO/SkillsHandler'
import { computeBonusStats } from './utils/statisticsCompute'
import Summons from './Components/Summons'
import { StarknetWindowObject } from 'get-starknet'
import { Getter } from '../Blockchain/Getter'
import { HeroesFactory } from '../Classes/Heroes/HeroesFactory'
import Register from './Components/Register'
import { Account } from "starknet";
import { HeroBlockchain } from '../Types/blockchainTypes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import StateChangesHandler from './State/StateChangesHandler'

function getGamePageContainerStyle(isBattleRunning: boolean){
  if (isBattleRunning){
    return {
      paddingTop: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    }
  }
  else {
    return {
      paddingTop: "1.5rem",
      paddingLeft: "1.5rem",
      paddingRight: "1rem",
    }
  }
}

type GamePageProps = {
  localWallet: Account
  wallet: StarknetWindowObject | undefined
}  

function GamePage({localWallet, wallet} : GamePageProps) {
  const [account, setAccount] = useState<GameAccount>({energy: 0, shards: 0})
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [heroesList, setHeroesList] = useState<Array<HeroInfos>>([])
  const [runesList, setRunesList] = useState<Array<RuneInfos>>([])
  const [skillsDict, setSkillsDict] = useState<SkillsDict>({})
  const [skillSets, setSkillSets] = useState<SkillSets>({})
  const [baseStatsDict, setBaseStatsDict] = useState<BaseStatsDict>({})
  const [worldsBattlesList, setWorldsBattlesList] = useState<BattlesInfosDict>({})
  const [runeEquippedDatas, setRuneEquippedDatas] = useState<{runeId: number, heroId: number, spot: number}>({runeId: 0, heroId: 0, spot: 0})
  const [runeUnequippedDatas, setRuneUnequippedDatas] = useState<{runeId: number, heroId: number, spot: number}>({runeId: 0, heroId: 0, spot: 0})
  const [useEffectAction, setUseEffectAction] = useState<string>('none')
  const [refreshUseEffect, setRefreshUseEffect] = useState<number>(0)
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroesList, setRunesList))

  function handleNewAccount(){
    setRefreshUseEffect(refreshUseEffect + 1)
  }

  async function handleNewHeroEvent(hero: HeroBlockchain) {
    let heroInfos = HeroesFactory.createHero(hero!, [], skillsDict, skillSets, baseStatsDict)
    let newHeroesList = [...heroesList]
    newHeroesList.push(heroInfos)
    setHeroesList(newHeroesList)
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

  function indexOfHeroEquippedRuneId(runeId:number, heroesList:Array<HeroInfos>): number {
    for (let i=0; i<heroesList.length; i++){
      const indexRune = heroesList[i].runesIds.indexOf(runeId)
      if (indexRune !== -1){
        return i
      }
    }
    return -1
  }

  useEffect(() => {
    console.log('useEffect GamePage')
    if (useEffectAction === 'equip'){
      const indexHero = heroesList.findIndex(hero => hero.id === runeEquippedDatas.heroId)
      let newHeroesList = [...heroesList]
      newHeroesList[indexHero].runesIds.push(runeEquippedDatas.runeId)
      newHeroesList[indexHero].spots.push(runeEquippedDatas.spot)
      newHeroesList[indexHero].bonusStats = computeBonusStats(newHeroesList[indexHero], runesList)
      setHeroesList(newHeroesList)
      setUseEffectAction('none')
    }
    else if (useEffectAction === 'unequip'){
      const indexHero = heroesList.findIndex(hero => hero.id === runeUnequippedDatas.heroId)
      let newHeroesList = [...heroesList]
      const indexRune = newHeroesList[indexHero].runesIds.indexOf(runeUnequippedDatas.runeId)
      newHeroesList[indexHero].runesIds.splice(indexRune, 1)
      newHeroesList[indexHero].spots.splice(indexRune, 1)
      newHeroesList[indexHero].bonusStats = computeBonusStats(newHeroesList[indexHero], runesList)
      setHeroesList(newHeroesList)
      setUseEffectAction('none')
    }
    else {
      (async () => {
        let accountPromise = await Getter.getAccount(localWallet);
        let heroesPromise = Getter.getAllHeroes(localWallet);
        let runesPromise = Getter.getAllRunes(localWallet);
        let skillsDictPromise = ApiHandler.getSkillsDict();
        let skillSetsPromise = ApiHandler.getSkillSets();
        let baseStatsDictPromise = ApiHandler.getBaseStats();
        let runeStatsDictPromise = ApiHandler.getRuneStats();
        let [account, heroes, blockchainRunes, skillsDictApi, skillSets, baseStatsDict, runeStatsDict] = await Promise.all([accountPromise, heroesPromise, runesPromise, skillsDictPromise, skillSetsPromise, baseStatsDictPromise, runeStatsDictPromise]);
        stateChangesHandler.setRuneStatsDict(runeStatsDict)
        setStateChangesHandler(stateChangesHandler)
        if(account){
          setAccount(account);
          setHasAccount(true);
        }
        const skillsDict = SkillsHandler.formatSkills(skillsDictApi);
        let runes = RuneFactory.createRunes(blockchainRunes, runeStatsDict);
        let heroesWithSkillsAndStats = HeroesFactory.createHeroes(heroes, runes, skillsDict, skillSets, baseStatsDict);
        setHeroesList(heroesWithSkillsAndStats);
        setRunesList(runes);
        setSkillsDict(skillsDict);
        setSkillSets(skillSets);
        setBaseStatsDict(baseStatsDict);
        let battlesInfos = await ApiHandler.getBattlesInfos();
        const battlesWithEnemyStatsAndSkills = HeroesFactory.createEnemyHeroes(battlesInfos, skillsDict, skillSets, baseStatsDict);
        // console.log(battlesWithEnemyStatsAndSkills);
        setWorldsBattlesList(battlesWithEnemyStatsAndSkills);
      })();
    }
  }, [refreshUseEffect]);


  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <div className='GamePageContainer' style={getGamePageContainerStyle(isBattleRunning)}>
        {hasAccount && !showMyHeroes && !showWorldSelect && !showSummons &&
        <div className='GamePageTitleAndMenu'>
          <img className='GamePageTitle' src={title} />
          <div className='GamePageMenu'>
            <div className='GamePageMenuButton' onClick={() => setShowMyHeroes(true)}>
              <img className='GamePageMenuButtonIcon' src={collectionIcon} />
              <div className="GamePageMenuButtonText">
                My Collection
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowWorldSelect(true)}>
              <img className='GamePageMenuButtonIcon' src={battleIcon} />
              <div className="GamePageMenuButtonText">
                Battle
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowSummons(true)}>
              <img className='GamePageMenuButtonIcon' src={summonIcon} />
              <div className="GamePageMenuButtonText">
                Summon Heroes
              </div>
            </div>
          </div>
        </div>
        }
        {!hasAccount &&
          <Register localWallet={localWallet} wallet={wallet} handleNewAccount={handleNewAccount} />
        }
        {showMyHeroes &&
          <MyHeroes heroesList={heroesList} runesList={runesList} localWallet={localWallet} setShowMyHeroes={setShowMyHeroes} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect worldsBattlesList={worldsBattlesList} heroesList={heroesList} localWallet={localWallet} setShowWorldSelect={setShowWorldSelect} setIsBattleRunning={setIsBattleRunning} />
        }
        {showSummons &&
          <Summons localWallet={localWallet} wallet={wallet} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
      </div>
    </div>
  )
}

export default GamePage