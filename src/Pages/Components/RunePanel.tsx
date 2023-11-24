import "./RunePanel.css"
import {HeroInfos, RuneInfos, RunesList} from '../../Types/apiTypes'
import RuneMiniature from "./RuneMiniature"
import runeImg from "../../assets/runes/testRune.png"
import runesImgDict from "../../assets/runes/runeImgDict"
import ArrowBack from "../../assets/misc/arrowback.png"  
import Rune from "./Rune"
import { useState, useEffect } from 'react'
import { log } from "console"
import { createRuneListDict } from "../utils/runesSorterFilter"
import { Account } from "starknet"
import StateChangesHandler from "../State/StateChangesHandler"


type RunePanelProps = {
  runesList: Array<RuneInfos>,
  heroesList: Array<HeroInfos>,
  runeClicked: RuneInfos |  undefined,
  runeSpotClicked: number,
  runeListUnequiped: RunesList,
  heroId: number, 
  localWallet: Account,
  setShowingRunes: React.Dispatch<React.SetStateAction<boolean>>,
  stateChangesHandler: StateChangesHandler,
}


export default function RunePanel({runesList, heroesList, runeClicked, runeSpotClicked, runeListUnequiped, heroId, localWallet, setShowingRunes, stateChangesHandler}: RunePanelProps) {

  const [runeSelectedId, setRuneSelectedId] = useState<number>(-1)
  const [sortedName, setSortedName] = useState<string>("rank_desc")
  const [sortedRuneListUnequipedDict, setSortedRuneListUnequipedDict] = useState<{[key: string]: RunesList}>(createRuneListDict(runeListUnequiped))
  const runeSelected = runeListUnequiped.find(rune => rune.id === runeSelectedId)
  // serverHandler.RuneHandler.setRuneSelectedIdSetter(setRuneSelectedId)

  useEffect(() => {
    setSortedRuneListUnequipedDict(createRuneListDict(runeListUnequiped))
  }, [runeListUnequiped]);
  
  return(
  <div className="RunePanelContainer">
    <div className="RunePanelArrowBackContainer" >
      <img className="ArrowBack" src={ArrowBack} onClick={() => setShowingRunes(false)}/>
    </div>
    <div className="RuneDetailsAndListContainer">
      <div className="RuneDetailsContainer">
        <div className="RuneEquippedWrapper">
        {runeClicked && 
          <Rune 
          runesList={runesList}
          heroesList={heroesList}
          rune={runeSelected!}
          equipped={true}
          image={runesImgDict[runeClicked.shape]}
          heroId={heroId} 
          runeSpotClicked={runeSpotClicked}
          alreadyEquippedRune={true}
          localWallet={localWallet}
          stateChangesHandler={stateChangesHandler}
           />
        }
        {!runeClicked &&
          <div className="TransparentRuneImg">
            <RuneMiniature image={runesImgDict[runeSpotClicked]} rank={-1} imageWidth="10rem"/>
          </div>
        }
        </div>
        <div className="RuneSelectedWrapper">
          {runeSelectedId > -1 && runeSelected &&
          <Rune 
            runesList={runesList}
            heroesList={heroesList}
            rune={runeSelected!}
            equipped={false}
            image={runesImgDict[runeSelected.shape]} 
            heroId={heroId}
            runeSpotClicked={runeSpotClicked}
            alreadyEquippedRune={runeClicked !== undefined}
            localWallet={localWallet}
            stateChangesHandler={stateChangesHandler}
            />
          }
        </div>
      </div>
      <div className="RunesList">
        {sortedRuneListUnequipedDict[sortedName].map((rune) => {
          return (
            <div className="RuneMiniatureWrapper" key={rune.id} onClick={() => setRuneSelectedId(rune.id)}>
              <RuneMiniature image={runesImgDict[rune.shape]} rank={rune.rank} imageWidth="6rem"/>
            </div>
          )
        })}
      </div>
    </div>
  </div>
  )
}