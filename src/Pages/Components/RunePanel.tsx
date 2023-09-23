import "./RunePanel.css"
import {RuneInfos, RunesList} from '../../Types/apiTypes'
import RuneMiniature from "./RuneMiniature"
import runeImg from "../../assets/runes/testRune.png"
import runesImgDict from "../../assets/runes/runeImgDict"
import ArrowBack from "../../assets/misc/arrowback.png"  
import Rune from "./Rune"
import { useState, useEffect } from 'react'
import { log } from "console"
import ServerHandler from "../../Classes/IO/ServerHandler"
import { createRuneListDict } from "../utils/runesSorterFilter"


type RunePanelProps = {
  runeClicked: RuneInfos |  undefined,
  runeSpotClicked: number,
  runeListUnequiped: RunesList,
  heroId: number, 
  setShowingRunes: React.Dispatch<React.SetStateAction<boolean>>,
  serverHandler: ServerHandler
}


export default function RunePanel({runeClicked, runeSpotClicked, runeListUnequiped, heroId, setShowingRunes, serverHandler}: RunePanelProps) {

  const [runeSelectedId, setRuneSelectedId] = useState<number>(0)
  const [sortedName, setSortedName] = useState<string>("rank_desc")
  const [sortedRuneListUnequipedDict, setSortedRuneListUnequipedDict] = useState<{[key: string]: RunesList}>(createRuneListDict(runeListUnequiped))
  const runeSelected = runeListUnequiped.find(rune => rune.id === runeSelectedId)

  serverHandler.RuneHandler.setRuneSelectedIdSetter(setRuneSelectedId)

  useEffect(() => {
    setSortedRuneListUnequipedDict(createRuneListDict(runeListUnequiped))
  }, [runeListUnequiped]);
  
  return(
  <div className="RunePanelContainer">
    <div className="RunePanelArrowBackContainer" onClick={() => setShowingRunes(false)}>
      <img className="ArrowBack" src={ArrowBack} />
    </div>
    <div className="RuneDetailsAndListContainer">
      <div className="RuneDetailsContainer">
        <div className="RuneEquippedWrapper">
        {runeClicked && 
          <Rune 
          id={runeClicked.id}
          statistics={runeClicked.statistics}
          isPercents={runeClicked.isPercents}
          values={runeClicked.values}
          equipped={true}
          shape={runeClicked.shape}
          rank={runeClicked.rank}
          rarity={runeClicked.rarity}
          image={runesImgDict[runeClicked.shape]}
          heroId={heroId} 
          runeSpotClicked={runeSpotClicked}
          alreadyEquippedRune={true}
          serverHandler={serverHandler} />
        }
        {!runeClicked &&
          <div className="TransparentRuneImg">
            <RuneMiniature image={runesImgDict[runeSpotClicked]} rank={-1} imageWidth="140px"/>
          </div>
        }
        </div>
        <div className="RuneSelectedWrapper">
          {runeSelectedId > 0 && runeSelected &&
          <Rune 
            id={runeSelected.id}
            statistics={runeSelected.statistics}
            isPercents={runeSelected.isPercents}
            values={runeSelected.values}
            equipped={false}
            shape={runeSelected.shape}
            rank={runeSelected.rank}
            rarity={runeSelected.rarity}
            image={runesImgDict[runeSelected.shape]} 
            heroId={heroId}
            runeSpotClicked={runeSpotClicked}
            alreadyEquippedRune={runeClicked !== undefined}
            serverHandler={serverHandler}/>
          }
        </div>
      </div>
      <div className="RunesList">
        {sortedRuneListUnequipedDict[sortedName].map((rune, i) => {
          return (
            <div className="RuneMiniatureWrapper" key={rune.id} onClick={() => setRuneSelectedId(rune.id)}>
              <RuneMiniature image={runesImgDict[rune.shape]} rank={rune.rank} imageWidth="62px"/>
            </div>
          )
        })}
      </div>
    </div>
  </div>
  )
}