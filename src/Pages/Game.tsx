import { getPhaserConfig } from '../phaserConfig'
import Phaser from 'phaser'
import { useState, useEffect } from 'react'
import './Game.css'
import EndBattlePanel from './Components/EndBattlePanel'
import ServerHandler from '../Classes/ServerHandler'
import NavBar from './Components/Navbar'
import NetworkError from './Components/NetworkError'
import {type StarknetWindowObject } from "get-starknet"
import { currentChain } from '../BlockchainDatas/chain'

type GameProps = {
  serverHandler: ServerHandler
}

function Game({serverHandler}: GameProps) {

  // const [gameInstance, setGameInstance] = useState<Phaser.Game | undefined>(undefined)
  const [afterBattle, setAfterBattle] = useState<boolean>(false)
  const [battleVisible, setBattleVisible] = useState<boolean>(false)
  // const [battleHeight, setBattleHeight] = useState<string>("0%")
  const [winOrLose, setWinOrLose] = useState<string>("")
  const [walletAdrs, setWalletAdrs] = useState("")
  const [wallet, setWallet] = useState<StarknetWindowObject>()

  // useEffect(() => {

  // }, [afterBattle]);


  function handleStartFight() {
    // assert(selectedTeam.length > 0 && selectedTeam.length <= 4);
    setBattleVisible(true)
    // setBattleHeight("100%")
    // const phaserGame = new Phaser.Game(getPhaserConfig(serverHandler, walletAdrs, "BattleContainer"))*
    if(!wallet?.selectedAddress){
      console.log("No wallet selected")
      return
    }
    const phaserGame = new Phaser.Game(getPhaserConfig(serverHandler, wallet.selectedAddress, "BattleContainer", "world1", "battle1"))
    // setGameInstance(phaserGame)

    phaserGame.events.on('destroy', () => {
      onDestroyProcs()
    })

  }
  async function onDestroyProcs() {
    console.log("Game destroyed")
    const endBattleInfos = await serverHandler.getEndBattleInfos()
    setWinOrLose(endBattleInfos.winOrLose)
    // setGameInstance(undefined)
    setBattleVisible(false)
    // setBattleHeight("0%")
    setAfterBattle(true)
  }

  return (   
    <div id="BattleContainer" className="BattleContainer">
    {!battleVisible &&
      <div className="GamePanelAndNavbarContainer">
      <NavBar setWalletAdrsParent={setWalletAdrs} setWalletParent={setWallet}/>
      {walletAdrs != "" && wallet?.chainId === currentChain ?
      <div className="GamePanelContainer">
        {!afterBattle &&
            <div className="GameButton" onClick={handleStartFight}>
                Start Battle
            </div>
        }
        {afterBattle && winOrLose === "Defeat" &&
          <EndBattlePanel title={winOrLose} setWinOrLose={setWinOrLose} setAfterBattle={setAfterBattle}/>          
        }
        {afterBattle && winOrLose === "Victory" &&
          <EndBattlePanel title={winOrLose} lootItems={[{name:"Explorer's medal", amount:1, image:"Emblem"}, {name:"Contributor's medal", amount:1, image:"Emblem"}]} setWinOrLose={setWinOrLose} setAfterBattle={setAfterBattle} />          
        }
      </div>
      :
      <div className="GamePanelContainer">
        <NetworkError walletAdrs={walletAdrs} networkId={wallet?.chainId}/>
      </div>
      }
      </div>
    }
    </div>
  )
}

export default Game



