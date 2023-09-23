import { HeroesListType } from "../../Types/apiTypes"
import "./HeroesList.css"
import portraitsDict from "../../assets/portraits/portraitsDict"  
import HeroMiniature from "./HeroMiniature"

type HeroesListProps = {
  heroesList: HeroesListType
  handleHeroClick(heroId: number): void
}

export default function HeroesList({heroesList, handleHeroClick}: HeroesListProps) {

  return(
    <div className="HeroesListContainer">
    {heroesList.map((hero, i) => {
      return (
        <div className="heroCard" key={i} onClick={() => handleHeroClick(hero.id) }>
          <HeroMiniature image={portraitsDict[hero.name]} rank={1} level={hero.level} imageWidth="90px"></HeroMiniature>
          {/* <img className="heroCardImage" src={portraitsDict[hero.name]} />
          <div className="heroCardName">{hero.name}</div>
          <div className="heroCardLevel">Lvl {hero.level}</div> */}
          {/* <div className="heroCardExperience">{hero.experience}<  /div> */}
        </div>
      )
    })}
    </div>
  )
}



