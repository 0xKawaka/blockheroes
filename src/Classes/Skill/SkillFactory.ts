import Skill from "./Skill"
import SkillStatus from "./SkillStatus"
import SkillBuff from "./SkillBuff"

export default class SkillFactory {

  constructor() {}

  static createSkill(
    name: string,
    description: string,
    cooldown: number,
    damage: number,
    targetType: string,
    accuracy: number,
    aoe: boolean,
    image: any,
    statusNameArray: Array<string>,
    statusValueArray: Array<number>,
    statusDurationArray: Array<number>,
    statusChanceArray: Array<number>,
    statusAoeArray: Array<boolean>,
    statusSelfArray: Array<boolean>,
    buffNameArray: Array<string>,
    buffValueArray: Array<number>,
    buffDurationArray: Array<number>,
    buffChanceArray: Array<number>,
    buffAoeArray: Array<boolean>,
    buffSelfArray: Array<boolean>
    ) {
    let skillStatusArray = this.createSkillStatusArray(statusNameArray, statusValueArray, statusDurationArray, statusChanceArray, statusAoeArray, statusSelfArray)
    let skillBuffArray = this.createSkillBuffArray(buffNameArray, buffValueArray, buffDurationArray, buffChanceArray, buffAoeArray, buffSelfArray)
    return new Skill(name, description, cooldown, damage, targetType, accuracy, aoe, image, skillStatusArray, skillBuffArray)
  }

  static createSkillStatusArray(nameArray: Array<string>, statusValueArray: Array<number>, durationArray: Array<number>, chanceArray: Array<number>, aoeArray: Array<boolean>, selfArray: Array<boolean>) {
    let skillStatusArray = new Array<SkillStatus>()
    for (let i = 0; i < nameArray.length; i++) {
      skillStatusArray.push(new SkillStatus(nameArray[i], statusValueArray[i], durationArray[i], aoeArray[i], selfArray[i], chanceArray[i]))
    }
    return skillStatusArray
  }

  static createSkillBuffArray(nameArray: Array<string>, buffValueArray: Array<number>, durationArray: Array<number>, chanceArray: Array<number>, aoeArray: Array<boolean>, selfArray: Array<boolean>) {
    let skillBuffArray = new Array<SkillBuff>()
    for (let i = 0; i < nameArray.length; i++) {
      skillBuffArray.push(new SkillBuff(nameArray[i], buffValueArray[i], durationArray[i], aoeArray[i], selfArray[i], chanceArray[i]))
    }
    return skillBuffArray
  } 
}
