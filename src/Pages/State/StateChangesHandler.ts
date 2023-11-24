import { RuneBonusEvent } from "../../Blockchain/event/eventTypes"
import RuneFactory from "../../Classes/Runes/RuneFactory"
import { HeroInfos, RuneInfos, RuneStatsDict } from "../../Types/apiTypes"

export default class StateChangesHandler {
  runeStatsDict: RuneStatsDict
  setHeroesList: React.Dispatch<React.SetStateAction<HeroInfos[]>>
  setRunesList: React.Dispatch<React.SetStateAction<RuneInfos[]>>


  constructor(setHeroesList: React.Dispatch<React.SetStateAction<HeroInfos[]>>, setRunesList: React.Dispatch<React.SetStateAction<RuneInfos[]>>) {
    this.setHeroesList = setHeroesList
    this.setRunesList = setRunesList
  }

  updateRuneUpgrade(rune: RuneInfos, bonus: RuneBonusEvent | undefined, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let upgradedRune = RuneFactory.upgradeRune(rune, bonus, this.runeStatsDict)
    let newRunesList = [...runesList]
    const indexRune = newRunesList.findIndex(r => r.id === rune.id)
    newRunesList[indexRune] = upgradedRune
    this.setRunesList(newRunesList)
    console.log("Upgraded rune:", rune.id)
  }

  // function handleRuneUpgraded(runeId:number, newRunesList:RunesList){
  //   setRunesList(newRunesList)
  //   const heroIndex = indexOfHeroEquippedRuneId(runeId, heroesList)
  //   if (heroIndex !== -1){
  //     let newHeroesList = [...heroesList]
  //     newHeroesList[heroIndex].bonusStats = computeBonusStats(newHeroesList[heroIndex], runesList)
  //     setHeroesList(newHeroesList)
  //   }
  // }
  
  updateRuneEquip(rune: RuneInfos, heroId: number, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    // let newRunesList = [...runesList]
    // const indexRune = newRunesList.findIndex(r => r.id === rune.id)
    // newRunesList[indexRune].equippedHeroId = heroId
    // this.setRunesList(newRunesList)
    // let newHeroesList = [...heroesList]
    // const indexHero = newHeroesList.findIndex(h => h.id === heroId)
    // newHeroesList[indexHero].equippedRunesIds.push(rune.id)
    // this.setHeroesList(newHeroesList)
    // console.log("Equipped rune:", rune.id, "on hero:", heroId)
  }

  setRuneStatsDict(runeStatsDict: RuneStatsDict) {
    this.runeStatsDict = runeStatsDict
  }
}