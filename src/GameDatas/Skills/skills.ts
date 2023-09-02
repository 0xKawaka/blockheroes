import SkillFactory from "../../Classes/Skill/SkillFactory"
import Skill from "../../Classes/Skill/Skill"

import HunterBasicAtk from '../../assets/skills/Attack_Hunter.png'
import PriestBasicATK from '../../assets/skills/Attack_Priest.png'
import KnightBasicAtk from '../../assets/skills/Attack_Knight.png'
import AsssasinBasicAtk from '../../assets/skills/Attack_Assassin.png'
import Taunt from '../../assets/skills/Taunt.png'
import Heal from '../../assets/skills/Heal.png'
import SliceLegs from '../../assets/skills/SliceLegs.png'
import StrikeStun from '../../assets/skills/StrikeStun.png'
import StrikeAOETaunt from '../../assets/skills/StrikeAOETaunt.png'
import HealAOE from '../../assets/skills/HealAOE.png'
import DefendSelfAndAlly from '../../assets/skills/DefendSelfAndAlly.png'
import StrikeAndBoostATK from '../../assets/skills/StrikeAndBoostATK.png'
import StrikeReduceSpeedAOE from '../../assets/skills/StrikeReduceSpeedAOE.png'
import BuffSpeedATKSelf from '../../assets/skills/BuffSpeedATKSelf.png'
import StrikeBurnAOE from '../../assets/skills/StrikeBurnAOE.png'
import ISkillAnimation from "../../Classes/Skill/Animations/ISkillAnimation"
import MoveAndCast from "../../Classes/Skill/Animations/MoveAndCast"
import Cast from "../../Classes/Skill/Animations/Cast"
import CastProjectile from "../../Classes/Skill/Animations/CastProjectile"
import CastProjectileAOE from "../../Classes/Skill/Animations/CastProjectileAOE"



const skillsDict: {[key: string]: Skill} = {
  // statusNameArray: string[], statusValueArray: number[], statusDurationArray: number[], statusChanceArray: number[], statusAoeArray: boolean[], statusSelfArray: boolean[]
  "AttackPriest": SkillFactory.createSkill("AttackPriest", "A basic attack.", 0, 10, "enemy", 1, false, PriestBasicATK, [], [], [], [], [], [], [], [], [], [], [], []),
  "AttackKnight": SkillFactory.createSkill("AttackKnight", "A basic attack.", 0, 10, "enemy", 1, false, KnightBasicAtk, [], [], [], [], [], [], [], [], [], [], [], []),
  "AttackAssassin": SkillFactory.createSkill("AttackAssassin", "A basic attack.", 0, 10, "enemy", 1, false, AsssasinBasicAtk, [], [], [], [], [], [], [], [], [], [], [], []),
  "AttackHunter": SkillFactory.createSkill("AttackHunter", "A basic attack.", 0, 10, "enemy", 1, false, HunterBasicAtk, [], [], [], [], [], [], [], [], [], [], [], []),
  "Heal": SkillFactory.createSkill("Heal", "Heal an ally", 0, 20, "ally", 1, false, Heal, [], [], [], [], [], [], ["Regen"], [1], [2], [1], [false], [false]),
  "Slice Legs": SkillFactory.createSkill("Slice Legs", "Slice legs of the enemy reducing it's mobility.", 2, 11, "enemy", 1, false, SliceLegs, ["Slow"], [1], [3], [1], [false], [false], [], [], [], [], [], []),
  "StrikeStun": SkillFactory.createSkill("StrikeStun", "StrikeStun.", 3, 11, "enemy", 1, false, StrikeStun, ["Stun"], [1], [3], [1], [false], [false], [], [], [], [], [], []),
  "StrikeAndBoostATK": SkillFactory.createSkill("StrikeAndBoostATK", "StrikeAndBoostATK.", 3, 10, "enemy", 1, true, StrikeAndBoostATK, [], [], [], [], [], [], ["Attack"], [0], [2], [1], [false], [true]),
  "StrikeReduceSpeedAOE": SkillFactory.createSkill("StrikeReduceSpeedAOE", "StrikeReduceSpeedAOE.", 4, 8, "enemy", 1, false, StrikeReduceSpeedAOE, ["Slow"], [1], [2], [1], [true], [false], [], [], [], [], [], []),
  "HealAOE": SkillFactory.createSkill("HealAOE", "HealAOE.", 3, 10, "ally", 1, true, HealAOE, [], [], [], [], [], [], ["Regen"], [10], [2], [1], [true], [false]),
  "DefendSelfAndAlly": SkillFactory.createSkill("DefendSelfAndAlly", "DefendSelfAndAlly.", 2, 10, "ally", 1, true, DefendSelfAndAlly, [], [], [], [], [], [], ["Regen"], [10], [2], [1], [true], [false]),
  "StrikeBurnAOE": SkillFactory.createSkill("StrikeBurnAOE", "StrikeBurnAOE.", 3, 0, "enemy", 1, false, StrikeBurnAOE, ["Poison"], [1], [2], [1], [true], [false], [], [], [], [], [], []),
  "BuffSpeedATKSelf": SkillFactory.createSkill("BuffSpeedATKSelf", "BuffSpeedATKSelf.", 2, 0, "self", 1, false, BuffSpeedATKSelf, [], [], [], [], [], [], ["Attack", "Speed"], [1, 1], [2, 2], [1, 1], [false, false], [true, true]),
}


const runInRunOutAndCast = new MoveAndCast("run", "run")
const runInJumpOutAndCast = new MoveAndCast("run", "jump")
const jumpInJumpOutAndCast = new MoveAndCast("jump", "jump")
const cast = new Cast()
const castProjectile = new CastProjectile()
const castProjectileAOE = new CastProjectileAOE()


const skillAnimsDict: {[key: string]: {animType: string, animPlayer:ISkillAnimation}} = {
  "AttackHunter": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "AttackPriest": {animType: "attack", animPlayer:castProjectile},
  "AttackKnight": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "AttackAssassin": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "Heal": {animType: "skill1", animPlayer:cast},
  "Slice Legs": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "StrikeStun": {animType: "skill1", animPlayer:jumpInJumpOutAndCast},
  "StrikeAndBoostATK": {animType: "skill1", animPlayer:runInRunOutAndCast},
  "StrikeReduceSpeedAOE": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "HealAOE": {animType: "skill1", animPlayer:cast},
  "DefendSelfAndAlly": {animType: "skill2", animPlayer:cast},
  "StrikeBurnAOE": {animType: "skill2", animPlayer:castProjectileAOE},
  "BuffSpeedATKSelf": {animType: "skill1", animPlayer:cast},
}

const projectilesDict: {[key: string]: {name:string, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "attackPriest": {name:"frostbolt", width:200, height:50, widthRatio: 0.2, heightRatio: 0.08}
}

const spellAnimDict: {[key: string]: {name:string, framerate:number, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "skill2Hunter": {name:"arrowShower", framerate:11, width:256, height:128, widthRatio: 0.3, heightRatio: 0.4},
}


const skillNames = Object.keys(skillsDict)
const projectileInfos = Object.values(projectilesDict)
const spellAnimInfos = Object.values(spellAnimDict)

// let skillImagesByName: {[key: string]: any} = {}

// for (let skillName of skillNames) {
//   skillImagesByName[skillName] = require('../../assets/skills/' + skillName.replace(/\s/g, "") + '.png')
// }

export {skillsDict, skillAnimsDict, projectilesDict, spellAnimDict, projectileInfos, spellAnimInfos }