import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { HeroInfos } from "../../Types/apiTypes"
import "./ExperiencePanel.css"

type ExperiencePanelProps = {
  heroesList: Array<HeroInfos>,
  heroesBeforeExperienceGained: Array<HeroInfos>,
  eventHandler: GameEventHandler,
}

export default function ExperiencePanel({eventHandler, heroesList, heroesBeforeExperienceGained} : ExperiencePanelProps) {

  const experiencePanel = eventHandler.getExperienceGainEventArray().map(event => {
    const hero = heroesList.find(hero => hero.id === event.entityId)
    const heroBeforeExperienceGained = heroesBeforeExperienceGained.find(hero => hero.id === event.entityId)
    if(hero !== undefined) {
      return (
        <div className="experienceHero" key={hero.id}>
          {hero.level < event.levelAfter &&
            <div className="experienceHeroLevel">{heroBeforeExperienceGained!.level} &gt; </div>
          }
          <div className="experienceHeroLevel">{hero.level}</div>
          <div className="experienceHeroLevel">{heroBeforeExperienceGained!.experience} &gt; </div>
          <div className="experienceHeroExperience">{hero.experience}</div>
          <div className="experienceHeroExperienceGained">+{event.experienceGained} XP</div>
        </div>
      )
    }
  })

  return(
    <div className="ExperiencePanelContainer">
      {experiencePanel}
    </div>
    )
}