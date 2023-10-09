// import SkillFactory from "../../Classes/Skill/SkillFactory"
// import Skill from "../../Classes/Skill/Skill"

// import HunterBasicAtk from '../../assets/skills/Attack_Hunter.png'
// import PriestBasicATK from '../../assets/skills/Attack_Priest.png'
// import KnightBasicAtk from '../../assets/skills/Attack_Knight.png'
// import AsssasinBasicAtk from '../../assets/skills/Attack_Assassin.png'
// import Taunt from '../../assets/skills/Taunt.png'
// import Heal from '../../assets/skills/Heal.png'
// import FireStrike from '../../assets/skills/FireStrike.png'
// import BladeSwing from '../../assets/skills/BladeSwing.png'
// import StrikeAOETaunt from '../../assets/skills/StrikeAOETaunt.png'
// import HealingPrayer from '../../assets/skills/HealingPrayer.png'
// import WaterShield from '../../assets/skills/WaterShield.png'
// import StrikeAndBoostATK from '../../assets/skills/StrikeAndBoostATK.png'
// import SandstormStrikes from '../../assets/skills/SandstormStrikes.png'
// import BuffSpeedATKSelf from '../../assets/skills/BuffSpeedATKSelf.png'
// import StrikeBurnAOE from '../../assets/skills/StrikeBurnAOE.png'
import ISkillAnimation from "../../Classes/Skill/Animations/ISkillAnimation"
import MoveAndCast from "../../Classes/Skill/Animations/MoveAndCast"
import Cast from "../../Classes/Skill/Animations/Cast"
import CastProjectile from "../../Classes/Skill/Animations/CastProjectile"
import CastProjectileAOE from "../../Classes/Skill/Animations/CastProjectileAOE"
// import FlatDamage from "../../Classes/Skill/FlatDamage"
// import PercentHeal from "../../Classes/Skill/PercentHeal"

// const skillsDict: {[key: string]: Skill} = {
//   // statusNameArray: string[], statusValueArray: number[], statusDurationArray: number[], statusChanceArray: number[], statusAoeArray: boolean[], statusSelfArray: boolean[]
//   "AttackPriest": SkillFactory.createSkill(
//     "AttackPriest",
//     "A basic attack.",
//     0,
//     new FlatDamage(10, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     PriestBasicATK,
//     [], [], [], [], [], [], [], [], [], [], [], [], [], []
//   ),
//   "AttackHunter": SkillFactory.createSkill(
//     "AttackHunter",
//     "A basic attack.",
//     0,
//     new FlatDamage(10, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     HunterBasicAtk,
//     [],[],[],[],[],[],[],[],[],[],[],[],[],[]
//   ),
//   "AttackKnight": SkillFactory.createSkill(
//     "AttackKnight",
//     "A basic attack.",
//     0,
//     new FlatDamage(10, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     KnightBasicAtk,
//     [],[],[],[],[],[],[],[],[],[],[],[],[],[]
//   ),
//   "AttackAssassin": SkillFactory.createSkill(
//     "AttackAssassin",
//     "A basic attack.",
//     0,
//     new FlatDamage(10, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     AsssasinBasicAtk,
//     [],[],[],[],[],[],[],[],[],[],[],[],[],[]
//   ),
//   "Heal": SkillFactory.createSkill(
//     "Heal",
//     "Heal an ally.",
//     0,
//     new FlatDamage(0, false, false, false),
//     new PercentHeal(0.2, true, false, false),
//     "ally",
//     1,
//     false,
//     Heal,
//     [], [], [], [], [], [], [], ["Regen"], [0.15], [2], [1], [true], [false], [false],
//   ),
//   "Fire Strike": SkillFactory.createSkill(
//     "Fire Strike",
//     "Fire Strike.",
//     2,
//     new FlatDamage(20, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     FireStrike,
//     ["Poison"], [0.2], [2], [1], [true], [false], [false], [], [], [], [], [], [], []
//   ),
//   "Blade Swing": SkillFactory.createSkill(
//     "Blade Swing",
//     "Blade Swing",
//     3,
//     new FlatDamage(20, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     BladeSwing,
//     ["Stun"], [0], [2], [1], [true], [false], [false], [], [], [], [], [], [], []
//   ),
//   "StrikeAndBoostATK": SkillFactory.createSkill(
//     "StrikeAndBoostATK",
//     "StrikeAndBoostATK.",
//     3,
//     new FlatDamage(20, true, false, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     StrikeAndBoostATK,
//     [], [], [], [], [], [], [], ["Attack"], [0.3], [2], [1], [false], [false], [true],
//   ),  
//   "Sandstorm Strikes": SkillFactory.createSkill(
//     "Sandstorm Strikes",
//     "Sandstorm Strikes.",
//     4,
//     new FlatDamage(10, false, true, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     SandstormStrikes,
//     ["Slow"], [0.2], [2], [1], [false], [true], [false], [], [], [], [], [], [], []
//   ),
//   "Healing Prayer": SkillFactory.createSkill(
//     "Healing Prayer",
//     "Healing Prayer.",
//     3,
//     new FlatDamage(0, false, false, false),
//     new PercentHeal(0.1, false, true, false),
//     "ally",
//     1,
//     true,
//     HealingPrayer,
//     [], [], [], [], [], [], [], ["Regen"], [0.1], [2], [1], [false], [true], [false],
//   ),
//   "Water Shield": SkillFactory.createSkill(
//   "Water Shield",
//   "Water Shield.",
//   2,
//   new FlatDamage(0, false, false, false),
//   new PercentHeal(0, false, false, false),
//   "ally",
//   1,
//   false,
//   WaterShield,
//   [], [], [], [], [], [], [], ["Defense"], [1], [3], [1], [true], [false], [true],
//   ),
//   "StrikeBurnAOE": SkillFactory.createSkill(
//     "StrikeBurnAOE",
//     "StrikeBurnAOE.",
//     3,
//     new FlatDamage(0, false, true, false),
//     new PercentHeal(0, false, false, false),
//     "enemy",
//     1,
//     false,
//     StrikeBurnAOE,
//     ["Poison"], [0.15], [2], [1], [false], [true], [false], [], [], [], [], [], [], []
//   ),
//   "BuffSpeedATKSelf": SkillFactory.createSkill(
//     "BuffSpeedATKSelf",
//     "BuffSpeedATKSelf.",
//     2,
//     new FlatDamage(0, false, false, false),
//     new PercentHeal(0, false, false, false),
//     "ally",
//     1,
//     false,
//     BuffSpeedATKSelf,
//     [], [], [], [], [], [], [], ["Attack", "Speed"], [1, 1], [2, 2], [1, 1], [false, false], [false, false], [true, true],
//   ),

// }



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
  "Fire Strike": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "Blade Swing": {animType: "skill1", animPlayer:jumpInJumpOutAndCast},
  "StrikeAndBoostATK": {animType: "skill1", animPlayer:runInRunOutAndCast},
  "Sandstorm Strikes": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "Healing Prayer": {animType: "skill1", animPlayer:cast},
  "Water Shield": {animType: "skill2", animPlayer:cast},
  "StrikeBurnAOE": {animType: "skill2", animPlayer:castProjectileAOE},
  "BuffSpeedATKSelf": {animType: "skill1", animPlayer:cast},
}

const projectilesDict: {[key: string]: {name:string, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "attackPriest": {name:"frostbolt", width:200, height:50, widthRatio: 0.2, heightRatio: 0.08}
}

const spellAnimDict: {[key: string]: {name:string, framerate:number, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "skill2Hunter": {name:"arrowShower", framerate:11, width:256, height:128, widthRatio: 0.3, heightRatio: 0.4},
}


// const skillNames = Object.keys(skillsDict)
const projectileInfos = Object.values(projectilesDict)
const spellAnimInfos = Object.values(spellAnimDict)

// let skillImagesByName: {[key: string]: any} = {}

// for (let skillName of skillNames) {
//   skillImagesByName[skillName] = require('../../assets/skills/' + skillName.replace(/\s/g, "") + '.png')
// }

export { skillAnimsDict, projectilesDict, spellAnimDict, projectileInfos, spellAnimInfos }