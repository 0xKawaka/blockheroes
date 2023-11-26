import { HeroInfos, HeroesStatsDict, RunesList, BattlesInfosDict } from "../../Types/apiTypes"
import "./WorldSelect.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"
import BattlesSelect from "./BattlesSelect"
import { Account } from "starknet"


type WorldSelectProps = {
  worldsBattlesList: BattlesInfosDict
  heroesList: Array<HeroInfos>
  localWallet: Account
  setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WorldSelect({ worldsBattlesList, heroesList, localWallet, setShowWorldSelect, setIsBattleRunning }: WorldSelectProps) {

  const [worldId, setWorldId] = useState<number>(-1)

  return(
  <div className="WorldSelectContainer">
    {worldId == -1 &&
      <div className="WorldSelectArrowBackAndWorldsListContainer">
        <div className="ArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowWorldSelect(false)}/>
        </div>
        <div className="WorldsList">
          {Object.keys(worldsBattlesList).map((worldIndex, i) => {
            return (
              <div className="worldOverviewContainer" key={i} onClick={() => setWorldId(Number(worldIndex))}>
                <div className="worldName">World {worldIndex}</div>
              </div>
            )
          }
          )}
        </div>
      </div>
    }
    {worldId !== -1 &&
      <BattlesSelect worldId={worldId} battlesList={worldsBattlesList[worldId]} heroesList={heroesList} localWallet={localWallet} setWorldId={setWorldId} setIsBattleRunning={setIsBattleRunning} />
    }
  </div>
  )

}