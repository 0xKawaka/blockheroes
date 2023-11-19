import { getPhaserConfig } from "../../Scenes/phaserConfig"
import "./BattlePage.css"
import { useEffect, useState } from "react"
import EndBattlePanel from "./EndBattlePanel"
import { HeroStats } from "../../Types/apiTypes"
import Entity from "../../Classes/Entity/Entity"
import EventHandler from "../../Blockchain/event/EventHandler"
import { Account } from "starknet"

type BattlePageProps = {
  worldId: number
  battleId: number
  selectedTeam: Entity[]
  selectedHeroesIds: number[]
  enemiesTeam: Entity[]
  eventHandler: EventHandler
  localWallet: Account
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>
}

export default function BattlePage({worldId, battleId, selectedTeam, selectedHeroesIds, enemiesTeam, eventHandler, localWallet, setPhaserRunning, setIsBattleRunning, setIsLootPanelVisible, setWinOrLose}: BattlePageProps) {

  // const [walletAdrs, setWalletAdrs] = useState("")

  function handleStartFight() {
    setIsBattleRunning(true)
    setPhaserRunning(true)
    setIsLootPanelVisible(false)
    const phaserGame = new Phaser.Game(getPhaserConfig(eventHandler, localWallet, "0xtest", "GamePhaserContainer", worldId, battleId, selectedTeam, selectedHeroesIds, enemiesTeam))
    phaserGame.events.on('destroy', () => {
      onDestroyProcs()
    })
  }

  useEffect(() => {
    handleStartFight()
  }, [])
  
  async function onDestroyProcs() {
    console.log("Game destroyed")
    const endBattleEvent = eventHandler.getEndBattleEvent()
    if(endBattleEvent === undefined) {
      console.log("End battle event is undefined")
      return
    }
    console.log('endBattleEvent.hasPlayerWon : ' + endBattleEvent.hasPlayerWon)
    setWinOrLose(endBattleEvent.hasPlayerWon ? "Victory" : "Defeat")
    eventHandler.reset()
    setPhaserRunning(false)
    setIsBattleRunning(false)
    setIsLootPanelVisible(true)
  }

  return(
  <div className="BattlePageContainer">

  </div>
  )
}