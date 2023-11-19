import "./Rune.css"
import RuneMiniature from "./RuneMiniature"
import { useState } from "react"

type RuneProps = {
  id: number,
  statistics: Array<String>,
  isPercents: Array<boolean>,
  values: Array<number>,
  equipped: boolean,
  shape: number,
  rank: number,
  rarity: number,
  image: string,
  heroId: number,
  runeSpotClicked: number,
  alreadyEquippedRune: boolean,
}

function handleEquipRune(runeId: number, spot: number, heroId: number){
  console.log("Equip rune:", runeId, " spot:", spot, "  hero:", heroId)
}

function handleUnequipRune(runeId: number, spot: number, heroId: number){
  console.log("Unequip rune:", runeId, " spot:", spot, "  hero:", heroId)
}

function handleUpgradeRune(runeId: number){
  console.log("Upgrade rune:", runeId)
}

const maxRankRune = 16

export default function Rune({id, statistics, isPercents, values, equipped, shape, rank, rarity, image, heroId, runeSpotClicked, alreadyEquippedRune}: RuneProps) {

  const equippedString = equipped ? "Remove" : "Equip"

  const [showEquipTooltip, setShowEquipTooltip] = useState<boolean>(false)
  const [showWrongShapeTooltip, setShowWrongShapeTooltip] = useState<boolean>(false)

  return(
    <div className="RuneContainer">
      <div className="RuneImageStatisticsContainer">
        <RuneMiniature image={image} rank={rank} imageWidth="140px"/>
        <div className="RuneStatisticsContainer">
          {statistics.map((statistic, i) => {
            return (
              <div className="RuneStatistic" key={i}>
                <div className="RuneStatisticName">{statistic}</div>
                <div className="RuneStatisticValue">+{values[i]}{isPercents[i] ? "%" : ""}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="RuneButtonsContainer">
        {rank < maxRankRune && <div className="RuneButton" onClick={() => handleUpgradeRune(id)}>Upgrade</div>}
        {equipped && <div className="RuneButton" onClick={() => handleUnequipRune(id, runeSpotClicked, heroId)}>{equippedString}</div>}
        {!equipped && !alreadyEquippedRune && !(shape !== runeSpotClicked) &&
          <div className="RuneButton" onClick={() => handleEquipRune(id, runeSpotClicked, heroId)}>{equippedString}</div>
        }
        {!equipped && shape !== runeSpotClicked &&
          <div className="RuneButton" onMouseOver={() => setShowWrongShapeTooltip(true)} onMouseOut={() => setShowWrongShapeTooltip(false)}>{equippedString}</div>
        }
        {!equipped && alreadyEquippedRune && !(shape !== runeSpotClicked) &&
          <div className="RuneButton" onMouseOver={() => setShowEquipTooltip(true)} onMouseOut={() => setShowEquipTooltip(false)}>{equippedString}</div>
        }
      </div>
      {showEquipTooltip && <div className="equipTooltip">Remove the rune first</div>}
      {showWrongShapeTooltip && <div className="equipTooltip">The rune type does not match</div>}
    </div>
  )
}