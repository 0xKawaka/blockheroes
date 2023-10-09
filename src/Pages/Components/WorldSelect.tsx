import ServerHandler from "../../Classes/IO/ServerHandler"
import { HeroesListType, HeroesStatsDict, RunesList, WorldsBattlesInfosDict } from "../../Types/apiTypes"
import "./WorldSelect.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"
import BattlesSelect from "./BattlesSelect"


type WorldSelectProps = {
  worldsBattlesList: WorldsBattlesInfosDict
  heroesList: HeroesListType
  serverHandler: ServerHandler
  setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WorldSelect({ worldsBattlesList, heroesList, serverHandler, setShowWorldSelect, setIsBattleRunning }: WorldSelectProps) {

  const [worldIdStr, setWorldIdStr] = useState<string>("")

  return(
  <div className="WorldSelectContainer">
    {worldIdStr == "" &&
      <div className="WorldSelectArrowBackAndWorldsListContainer">
        <div className="WorldSelectArrowBackContainer" onClick={() => setShowWorldSelect(false)}>
          <img className="ArrowBack" src={ArrowBack} />
        </div>
        <div className="WorldsList">
          {Object.keys(worldsBattlesList).map((worldName, i) => {
            return (
              <div className="worldOverviewContainer" key={i} onClick={() => setWorldIdStr(worldName)}>
                <div className="worldName">{worldName}</div>
              </div>
            )
          }
          )}
        </div>
      </div>
    }
    {worldIdStr !== "" &&
      <BattlesSelect worldIdStr={worldIdStr} battlesList={worldsBattlesList[worldIdStr]} heroesList={heroesList} serverHandler={serverHandler} setWorldIdStr={setWorldIdStr} setIsBattleRunning={setIsBattleRunning} />
    }
  </div>
  )

}