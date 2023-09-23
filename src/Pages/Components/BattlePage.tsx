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
  setBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BattlePage({world, battle, selectedTeam, selectedHeroesIds, enemiesTeam, serverHandler, setBattleRunning, setIsPhaserRunning}: BattlePageProps) {

  const [afterBattle, setAfterBattle] = useState<boolean>(false)
  const [battleVisible, setBattleVisible] = useState<boolean>(true)
  const [winOrLose, setWinOrLose] = useState<string>("")
  // const [walletAdrs, setWalletAdrs] = useState("")

  function handleStartFight() {
    setIsPhaserRunning(true)
    setBattleVisible(true)
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
    setBattleVisible(false)
    setAfterBattle(true)
  }

  return(
  <div className="BattlePageContainer">
    {!battleVisible &&
      <div className="OutOfBattleContainer">
        {afterBattle && winOrLose === "Defeat" &&
          <EndBattlePanel title={winOrLose} setWinOrLose={setWinOrLose} setAfterBattle={setAfterBattle} setBattleRunning={setBattleRunning} setIsPhaserRunning={setIsPhaserRunning} />          
        }
        {afterBattle && winOrLose === "Victory" &&
          <EndBattlePanel title={winOrLose} lootItems={[{name:"Explorer's emblem", amount:1, image:"Emblem"}]} setWinOrLose={setWinOrLose} setAfterBattle={setAfterBattle} setBattleRunning={setBattleRunning} setIsPhaserRunning={setIsPhaserRunning} />
          // {name:"Contributor's emblem", amount:1, image:"Emblem"}    
        }
      </div>
    }
  </div>
  )
}