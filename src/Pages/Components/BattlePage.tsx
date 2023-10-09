import ServerHandler from "../../Classes/IO/ServerHandler"
import { getPhaserConfig } from "../../Scenes/phaserConfig"
import "./BattlePage.css"
import { useEffect, useState } from "react"
import EndBattlePanel from "./EndBattlePanel"
import { HeroStats } from "../../Types/apiTypes"
import Entity from "../../Classes/Entity/Entity"

type BattlePageProps = {
  world: string
  battle: string
  selectedTeam: Entity[]
  selectedHeroesIds: number[]
  enemiesTeam: Entity[]
  serverHandler: ServerHandler
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>
}

export default function BattlePage({world, battle, selectedTeam, selectedHeroesIds, enemiesTeam, serverHandler, setPhaserRunning, setIsBattleRunning, setIsLootPanelVisible, setWinOrLose}: BattlePageProps) {

  // const [walletAdrs, setWalletAdrs] = useState("")

  function handleStartFight() {
    setIsBattleRunning(true)
    setPhaserRunning(true)
    setIsLootPanelVisible(false)
    // const phaserGame = new Phaser.Game(getPhaserConfig(serverHandler, walletAdrs, "BattleContainer"))*
    // const phaserGame = new Phaser.Game(getPhaserConfig(serverHandler, "0xtest", "BattlePageContainer", world, battle))
    const phaserGame = new Phaser.Game(getPhaserConfig(serverHandler, "0xtest", "GamePhaserContainer", world, battle, selectedTeam, selectedHeroesIds, enemiesTeam))
    // setGameInstance(phaserGame)
    phaserGame.events.on('destroy', () => {
      onDestroyProcs()
    })
  }

  useEffect(() => {
    handleStartFight()
  }, [])
  
  async function onDestroyProcs() {
    console.log("Game destroyed")
    const endBattleInfos = await serverHandler.getEndBattleInfos()
    setWinOrLose(endBattleInfos.winOrLose)
    setPhaserRunning(false)
    setIsBattleRunning(false)
    setIsLootPanelVisible(true)
  }

  return(
  <div className="BattlePageContainer">

  </div>
  )
}