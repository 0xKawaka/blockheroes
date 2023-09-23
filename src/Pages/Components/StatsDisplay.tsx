import { HeroInfos, HeroStats, RunesList } from "../../Types/apiTypes"
import "./StatsDisplay.css"
import { useState } from "react"

type StatsDisplayProps = {
  heroInfos: HeroInfos,
}

export default function StatsDisplay({heroInfos}: StatsDisplayProps) {

  return(
  <div className="StatsDisplayContainer">
    <div className="HeroStat">
      <div className="HeroStatName">Health</div>
      <div className="HeroStatDetailsContainer">        
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.health + heroInfos.bonusStats.health)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.health} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.health)} )</div>
        </div>
      </div>
    </div>
    <div className="HeroStat">
      <div className="HeroStatName">Attack</div>
      <div className="HeroStatDetailsContainer">        
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.attack + heroInfos.bonusStats.attack)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.attack} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.attack)} )</div>
        </div>
      </div>
    </div>
    <div className="HeroStat">
      <div className="HeroStatName">Defense</div>
      <div className="HeroStatDetailsContainer">        
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.defense + heroInfos.bonusStats.defense)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.defense} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.defense)} )</div>
        </div>
      </div>
    </div>
    <div className="HeroStat">
      <div className="HeroStatName">Speed</div>
      <div className="HeroStatDetailsContainer">        
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.speed + heroInfos.bonusStats.speed)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.speed} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.speed)} )</div>
        </div>
      </div>
    </div>
    <div className="HeroStat">
      <div className="HeroStatName">Crit</div>
      <div className="HeroStatDetailsContainer">        
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.criticalChance + heroInfos.bonusStats.criticalChance)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.criticalChance} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.criticalChance)} )</div>
        </div>
      </div> 
    </div>
    <div className="HeroStat">
      <div className="HeroStatName">Crit Damage</div>
      <div className="HeroStatDetailsContainer">
        <div className="HeroStatValue">{Math.round(heroInfos.baseStats.criticalDamage + heroInfos.bonusStats.criticalDamage)}</div>
        <div className="HeroBaseStatAndBonusSum">
          <div className="HeroBaseStatValue">( {heroInfos.baseStats.criticalDamage} </div>
          <div className="HeroBonusStatValue">+{Math.round(heroInfos.bonusStats.criticalDamage)} )</div>
        </div>
      </div>
    </div>
  </div>
  )
}
