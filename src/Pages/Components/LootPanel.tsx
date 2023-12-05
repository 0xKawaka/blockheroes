import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import crystalImg from "../../assets/icons/crystal.png"
import "./LootPanel.css"

type LootPanelProps = {
  eventHandler: GameEventHandler,
}

export default function LootPanel({eventHandler} : LootPanelProps) {
  const loot = eventHandler.getLootEvent()
  return(
    <div className="LootPanelContainer">
      <div className="LootCrystalsContainer">
        <div className="LootCrystalsValue">{loot!.crystals}</div>
        <img className="LootCrystalIcon" src={crystalImg} />
      </div>
    </div>
    )
}