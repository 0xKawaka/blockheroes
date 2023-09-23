import { RunesList } from "../../Types/apiTypes"

export default class RuneHandler {
  setRuneClickedId: React.Dispatch<React.SetStateAction<number>>
  setRuneSelectedId: React.Dispatch<React.SetStateAction<number>>
  handleRuneEquippedUX: (runeId: number, heroId: number, spot: number) => void
  handleRuneUnequippedUX: (runeId: number, heroId: number, spot: number) => void
  handleRuneUpgradedUX: (runeId:number, runesList: RunesList) => void


  constructor() {
  }

  handleRuneEquipped(runeId: number, heroId: number, spot: number) {
    this.setRuneClickedId(runeId)
    this.setRuneSelectedId(0)
    this.handleRuneEquippedUX(runeId, heroId, spot)
  }

  handleRuneUnequipped(runeId: number, heroId: number, spot: number) {
    this.setRuneClickedId(0)
    this.handleRuneUnequippedUX(runeId, heroId, spot)
  }

  handleRuneUpgraded(runeId:number, runesList: RunesList) {
    this.handleRuneUpgradedUX(runeId, runesList)
  }

  setHandleRuneEquippedUX(handleRuneEquippedUX: (runeId: number, heroId: number, spot: number) => void){
    this.handleRuneEquippedUX = handleRuneEquippedUX
  }

  setHandleRuneUnequippedUX(handleRuneUnequippedUX: (runeId: number, heroId: number, spot: number) => void){
    this.handleRuneUnequippedUX = handleRuneUnequippedUX
  }

  setHandleRuneUpgradedUX(handleRuneUpgradedUX: (runeId:number, runesList: RunesList) => void){
    this.handleRuneUpgradedUX = handleRuneUpgradedUX
  }

  setRuneClickedIdSetter(setRuneClickedId: React.Dispatch<React.SetStateAction<number>>){
    this.setRuneClickedId = setRuneClickedId
  }
  setRuneSelectedIdSetter(setRuneSelectedId: React.Dispatch<React.SetStateAction<number>>){
    this.setRuneSelectedId = setRuneSelectedId
  }
  
}