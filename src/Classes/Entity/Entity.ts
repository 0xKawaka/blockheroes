import Statistics from "../Statistic/Statistics"
import Skill from "../Skill/Skill"
import ISkillAnimation from "../Skill/Animations/ISkillAnimation"

export default class Entity {
  name: string
  statistics: Statistics
  skillArray: Array<Skill>
  // skillAnimationDict: {[key: string]: ISkillAnimation}

  // constructor(name: string, statistics: Statistics, skillArray: Array<Skill>, skillAnimationDict: {[key: string]: ISkillAnimation}) {
  constructor(name: string, statistics: Statistics, skillArray: Array<Skill>) {
    this.name = name
    this.statistics = statistics
    this.skillArray = skillArray
    // this.skillAnimationDict = skillAnimationDict
  }

  // getSkillAnim(skillName: string): ISkillAnimation {
  //   return this.skillAnimationDict[skillName]
  // }
}
