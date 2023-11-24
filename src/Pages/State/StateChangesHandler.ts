import { RuneBonusEvent } from "../../Blockchain/event/eventTypes"
import { HeroesFactory } from "../../Classes/Heroes/HeroesFactory"
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
    if(upgradedRune.isEquipped) {
      let newHeroesList = [...heroesList]
      const indexHero = newHeroesList.findIndex(h => h.id === upgradedRune.heroEquipped)
      let hero = newHeroesList[indexHero]
      let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
      newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)
      this.setHeroesList(newHeroesList)
    }
    console.log("Upgraded rune:", rune.id)
  }
  
  updateRuneEquip(runeEquipped: RuneInfos, heroId: number, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let newHeroesList = [...heroesList]
    let newRunesList = [...runesList]

    const indexHero = newHeroesList.findIndex(h => h.id === heroId)
    let hero = newHeroesList[indexHero]

    // const heroIndexRuneUnequipped = hero.spots.findIndex(spot => spot === runeEquipped.shape)
    // if(heroIndexRuneUnequipped !== -1) {
    //   const idRuneUnequipped = hero.runesIds.splice(heroIndexRuneUnequipped, 1)[0]
    //   hero.spots.splice(heroIndexRuneUnequipped, 1)
    //   const indexRuneUnequipped = newRunesList.findIndex(r => r.id === idRuneUnequipped)
    //   newRunesList[indexRuneUnequipped].isEquipped = false
    //   newRunesList[indexRuneUnequipped].heroEquipped = -1
    // }

    hero.runesIds.push(runeEquipped.id)
    hero.spots.push(runeEquipped.shape)
    let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
    newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)

    const indexRuneEquipped = newRunesList.findIndex(r => r.id === runeEquipped.id)
    newRunesList[indexRuneEquipped].isEquipped = true
    newRunesList[indexRuneEquipped].heroEquipped = heroId

    this.setRunesList(newRunesList)
    this.setHeroesList(newHeroesList)

    console.log("Equipped rune:", runeEquipped.id)
  }

  updateRuneUnequip(runeUnequipped: RuneInfos, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let newHeroesList = [...heroesList]
    let newRunesList = [...runesList]

    const indexHero = newHeroesList.findIndex(h => h.id === runeUnequipped.heroEquipped)
    let hero = newHeroesList[indexHero]

    const heroIndexRuneUnequipped = hero.spots.findIndex(spot => spot === runeUnequipped.shape)
    if(heroIndexRuneUnequipped !== -1) {
      const idRuneUnequipped = hero.runesIds.splice(heroIndexRuneUnequipped, 1)[0]
      hero.spots.splice(heroIndexRuneUnequipped, 1)
      const indexRuneUnequipped = newRunesList.findIndex(r => r.id === idRuneUnequipped)
      newRunesList[indexRuneUnequipped].isEquipped = false
      newRunesList[indexRuneUnequipped].heroEquipped = -1
    }
    else {
      throw new Error("updateRuneUnequip : Rune was not equipped")
    }

    let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
    newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)

    this.setRunesList(newRunesList)
    this.setHeroesList(newHeroesList)

    console.log("Unequipped rune:", runeUnequipped.id)
  }

  setRuneStatsDict(runeStatsDict: RuneStatsDict) {
    this.runeStatsDict = runeStatsDict
  }
}