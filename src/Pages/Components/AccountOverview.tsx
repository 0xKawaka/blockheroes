import "./AccountOverview.css"
import energyImg from "../../assets/icons/energy.png"
import crystalImg from "../../assets/icons/crystal.png"
import EnergyHandler from "../Classes/EnergyHandler"

type AccountOverviewProps = {
  username: string
  energy: number
  maxEnergy: number
  crystals: number
}

export default function AccountOverview({username, energy, maxEnergy, crystals}: AccountOverviewProps) {

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
      <div className="CrystalsContainer">
        <div className="CrystalsValue">{crystals}</div>
        <img className="CrystalsIcon" src={crystalImg} />
      </div>
    </div>
  </div>
  )
}
