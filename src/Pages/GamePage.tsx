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
import AccountOverview from './Components/AccountOverview'
import EnergyHandler from './Classes/EnergyHandler'

function getGamePageContainerStyle(isBattleRunning: boolean){
  if (isBattleRunning){
    return {
      paddingTop: "0px",
    }
  }
  else {
    return {
      paddingTop: "1rem",
    }
  }
}

type GamePageProps = {
  localWallet: Account
  wallet: StarknetWindowObject | undefined
}  

function GamePage({localWallet, wallet} : GamePageProps) {
  const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", shards: 0})
  const [energy, setEnergy] = useState<number>(0)
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [heroesList, setHeroesList] = useState<Array<HeroInfos>>([])
  const [runesList, setRunesList] = useState<Array<RuneInfos>>([])
  const [skillsDict, setSkillsDict] = useState<SkillsDict>({})
  const [skillSets, setSkillSets] = useState<SkillSets>({})
  const [baseStatsDict, setBaseStatsDict] = useState<BaseStatsDict>({})
  const [worldsBattlesList, setWorldsBattlesList] = useState<BattlesInfosDict>({})
  const [refreshUseEffect, setRefreshUseEffect] = useState<number>(0)
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroesList, setRunesList, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning))

  function handleNewAccount(){
    setRefreshUseEffect(refreshUseEffect + 1)
  }

  async function handleNewHeroEvent(hero: HeroBlockchain) {
    let heroInfos = HeroesFactory.createHero(hero!, [], skillsDict, skillSets, baseStatsDict)
    let newHeroesList = [...heroesList]
    newHeroesList.push(heroInfos)
    setHeroesList(newHeroesList)
  }

  useEffect(() => {
    (async () => {
      console.log('useEffect GamePage')
      let accountPromise = await Getter.getAccount(localWallet);
      let heroesPromise = Getter.getAllHeroes(localWallet);
      let runesPromise = Getter.getAllRunes(localWallet);
      let skillsDictPromise = ApiHandler.getSkillsDict();
      let skillSetsPromise = ApiHandler.getSkillSets();
      let baseStatsDictPromise = ApiHandler.getBaseStats();
      let runeStatsDictPromise = ApiHandler.getRuneStats();
      let [account, heroes, blockchainRunes, skillsDictApi, skillSets, baseStatsDict, runeStatsDict] = await Promise.all([accountPromise, heroesPromise, runesPromise, skillsDictPromise, skillSetsPromise, baseStatsDictPromise, runeStatsDictPromise]);
      stateChangesHandler.setRuneStatsDict(runeStatsDict)
      if(account){
        let energyHandler = new EnergyHandler(setEnergy)
        energyHandler.initEnergy(account.energyInfos.energy, account.energyInfos.lastEnergyUpdateTimestamp)
        stateChangesHandler.setEnergyHandler(energyHandler)
        setGameAccount(account);
        setHasAccount(true);
      }
      setStateChangesHandler(stateChangesHandler)
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
  }, [refreshUseEffect]);

  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <div className='GamePageContainer' style={getGamePageContainerStyle(isBattleRunning)}>
        {hasAccount && !isBattleRunning && <AccountOverview username={gameAccount.username} energy={energy} maxEnergy={5} shards={gameAccount.shards} />}
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
          <MyHeroes heroesList={heroesList} runesList={runesList} localWallet={localWallet} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect energy={energy} worldsBattlesList={worldsBattlesList} heroesList={heroesList} localWallet={localWallet} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons localWallet={localWallet} wallet={wallet} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
      </div>
    </div>
  )
}

export default GamePage