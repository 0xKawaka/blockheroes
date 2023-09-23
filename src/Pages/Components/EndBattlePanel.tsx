import "./EndBattlePanel.css"
import LootItem from "./LootItem"

type EndBattlePanelProps = {
  title:string,
  lootItems?: Array<{name:string, amount:number, image:string}>
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>,
  setAfterBattle: React.Dispatch<React.SetStateAction<boolean>>
  setBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
}

const imagesByItemName: {[key: string]: string} = {
  "Emblem": require("../../assets/lootItems/emblem.png"),
}

export default function EndBattlePanel({title, lootItems, setWinOrLose, setAfterBattle, setBattleRunning, setIsPhaserRunning}: EndBattlePanelProps) {

  function handleContinue() {
    setWinOrLose("")
    setBattleRunning(false)
    setAfterBattle(false)
    setIsPhaserRunning(false)
  }

  return(
  <div className="EndBattlePanelContainer">
    {title === "Defeat" && 
    <div className="EndBattlePanelTitleDefeat">{title.toUpperCase()}</div>
    }
    {title === "Victory" && 
    <div className="EndBattlePanelTitleVictory">{title.toUpperCase()}</div>
    }
    {lootItems && lootItems.length > 0 &&
      <div className="EndBattlePanelLootContainer">
        {lootItems.map((item, index) => {
          return (
            <LootItem key={index} name={item.name} amount={item.amount} image={imagesByItemName[item.image]} />
          )
        })} 
      </div>
    }
    <div className="buttonContinue" onClick={handleContinue}>Continue</div>
  </div>
  )
}