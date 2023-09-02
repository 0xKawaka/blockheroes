import SkillStatus from "./SkillStatus";
import SkillBuff from "./SkillBuff";

export default interface ISkill {
  name: string,
  description: string,
  cooldown: number,
  damage: number,
  accuracy: number,
  aoe: boolean,
  image: any
  skillStatusArray: Array<SkillStatus>,
  skillBuffArray: Array<SkillBuff>,
}