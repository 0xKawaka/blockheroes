import "./Summons.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import Soul from "../../assets/misc/soul.png"

type SummonsProps = {
  setShowSummons: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Summons({setShowSummons}: SummonsProps) {

  return(
    <div className="WorldSelectArrowBackAndSummonsContainer">
      <div className="WorldSelectArrowBackContainer" onClick={() => setShowSummons(false)}>
        <img className="ArrowBack" src={ArrowBack} />
      </div>
      <div className="SummonsContainer">
        <div className="SummonsCount">
          10 summons
        </div>
        <div className="SummonImageAndButton">
          <img className="SummonImage" src={Soul} />
          <div className="SummonButton">
            Summon
          </div>
        </div>
      </div>
    </div>
  )
}