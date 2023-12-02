import "./AccountOverview.css"
import energyImg from "../../assets/icons/energy.png"
import EnergyHandler from "../Classes/EnergyHandler"

type AccountOverviewProps = {
  username: string
  energy: number
  maxEnergy: number
  shards: number
}

export default function AccountOverview({username, energy, maxEnergy, shards}: AccountOverviewProps) {

  return(
  <div className="AccountOverviewContainer">
    <div className="AccountOverview">
      <div className="UsernameContainer">
        <div className="UsernameValue">{username}</div>
      </div>
      <div className="EnergyContainer">
        <div className="EnergyValue">{energy} / {maxEnergy}</div>
        <img className="EnergyIcon" src={energyImg} />
      </div>
      
      {/* <div className="ShardsContainer">
        <div className="ShardsValue">{shards}</div>
      </div> */}
    </div>
  </div>
  )
}
