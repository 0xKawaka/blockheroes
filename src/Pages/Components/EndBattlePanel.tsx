import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { HeroInfos } from "../../Types/apiTypes"
import StateChangesHandler from "../State/StateChangesHandler"
import "./EndBattlePanel.css"
import ExperiencePanel from "./ExperiencePanel"
import LootItem from "./LootItem"

type EndBattlePanelProps = {
  title:string,
  heroesList: Array<HeroInfos>,
  eventHandler: GameEventHandler,
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>,
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>,
  stateChangesHandler: StateChangesHandler
}

const imagesByItemName: {[key: string]: string} = {
  "Emblem": require("../../assets/lootItems/emblem.png"),
}

export default function EndBattlePanel({title, eventHandler, heroesList, setWinOrLose, setIsLootPanelVisible, stateChangesHandler}: EndBattlePanelProps) {

  const heroesBeforeExperienceGained = heroesList.filter(hero => eventHandler.getExperienceGainEventArray().some(event => event.entityId === hero.id))

  function handleContinue() {
    setWinOrLose("")
    setIsLootPanelVisible(false)
    stateChangesHandler.setIsBattleRunning(false)
  }

  return(
  <div className="EndBattlePanelContainer">
    {title === "Defeat" && 
    <div className="EndBattlePanelTitleDefeat">{title.toUpperCase()}</div>
    }
    {title === "Victory" && 
    <div className="EndBattlePanelVictoryContainer">
      <div className="EndBattlePanelTitleVictory">{title.toUpperCase()}</div>
      <ExperiencePanel heroesList={heroesList} eventHandler={eventHandler} heroesBeforeExperienceGained={heroesBeforeExperienceGained} />
    </div>
  
    }
    {/* {lootItems && lootItems.length > 0 &&
      <div className="EndBattlePanelLootContainer">
        {lootItems.map((item, index) => {
          return (
            <LootItem key={index} name={item.name} amount={item.amount} image={imagesByItemName[item.image]} />
          )
        })} 
      </div>
    } */}
    <div className="buttonContinue" onClick={handleContinue}>Continue</div>
  </div>
  )
}