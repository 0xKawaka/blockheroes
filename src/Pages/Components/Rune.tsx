import { log } from "console"
import { Sender } from "../../Blockchain/Sender"
import RuneFactory from "../../Classes/Runes/RuneFactory"
import { HeroInfos, RuneInfos, RunesList } from "../../Types/apiTypes"
import StateChangesHandler from "../State/StateChangesHandler"
import "./Rune.css"
import RuneMiniature from "./RuneMiniature"
import { useState } from "react"
import { Account } from "starknet"

type RuneProps = {
  runesList: Array<RuneInfos>,
  heroesList: Array<HeroInfos>,
  rune: RuneInfos,
  equipped: boolean,
  image: string,
  heroId: number,
  runeSpotClicked: number,
  alreadyEquippedRune: boolean,
  localWallet: Account,
  stateChangesHandler: StateChangesHandler,
}

const maxRankRune = 16


export default function Rune({runesList, heroesList, rune, equipped, image, heroId, runeSpotClicked, alreadyEquippedRune, localWallet, stateChangesHandler}: RuneProps) {
  const equippedString = equipped ? "Remove" : "Equip"
  const processEquippedString = equipped ? "Removing" : "Equiping"

  const [showEquipTooltip, setShowEquipTooltip] = useState<boolean>(false)
  const [showWrongShapeTooltip, setShowWrongShapeTooltip] = useState<boolean>(false)
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false)
  const [isEquipping, setIsEquipping] = useState<boolean>(false)

  async function handleEquipRune(rune: RuneInfos, heroId: number){
    setIsEquipping(true)
    const isSuccess = await Sender.equipRune(localWallet, rune.id, heroId)
    if(isSuccess)
      stateChangesHandler.updateRuneEquip(rune, heroId, runesList, heroesList)
    setIsEquipping(false)
    console.log("Equip rune: ", rune.id, " on hero: ", heroId)
  }
  
  function handleUnequipRune(runeId: number, spot: number, heroId: number){
    console.log("Unequip rune:", runeId, " spot:", spot, "  hero:", heroId)
  }
  
  async function handleUpgradeRune(localWallet: Account, rune: RuneInfos){
    setIsUpgrading(true)
    const upgradeRuneDatas = await Sender.upgradeRune(localWallet, rune)
    if(upgradeRuneDatas.success == false){
      console.log("Upgrade rune failed")
      return
    }
    stateChangesHandler.updateRuneUpgrade(rune, upgradeRuneDatas.bonus, runesList, heroesList)
    setIsUpgrading(false)
  }

  return(
    <div className="RuneContainer">
      <div className="RuneImageStatisticsContainer">
        <RuneMiniature image={image} rank={rune.rank} imageWidth="10rem"/>
        <div className="RuneStatisticsContainer">
          {rune.statistics.map((statistic, i) => {
            return (
              <div className="RuneStatistic" key={i}>
                <div className="RuneStatisticName">{statistic}</div>
                <div className="RuneStatisticValue">+{rune.values[i]}{rune.isPercents[i] ? "%" : ""}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="RuneButtonsContainer">
        {rune.rank < maxRankRune && <div className="RuneButton" onClick={() => handleUpgradeRune(localWallet, rune)}>{isUpgrading ? "Upgrading" : "Upgrade"}</div>}
        {equipped && <div className="RuneButton" onClick={() => handleUnequipRune(rune.id, runeSpotClicked, heroId)}>{equippedString}</div>}
        {!equipped && !alreadyEquippedRune && !(rune.shape !== runeSpotClicked) &&
          <div className="RuneButton" onClick={() => handleEquipRune(rune, heroId)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
        {!equipped && rune.shape !== runeSpotClicked &&
          <div className="RuneButton" onMouseOver={() => setShowWrongShapeTooltip(true)} onMouseOut={() => setShowWrongShapeTooltip(false)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
        {!equipped && alreadyEquippedRune && !(rune.shape !== runeSpotClicked) &&
          <div className="RuneButton" onMouseOver={() => setShowEquipTooltip(true)} onMouseOut={() => setShowEquipTooltip(false)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
      </div>
      {showEquipTooltip && <div className="equipTooltip">Remove the rune first</div>}
      {showWrongShapeTooltip && <div className="equipTooltip">The rune type does not match</div>}
    </div>
  )
}