import Skill from "../Classes/Skill/Skill"

type RunesList = Array<RuneInfos>
type RuneInfos = {id:number, shape: number, statistics: Array<string>, isPercents:Array<boolean>, values:Array<number>, rarity:number, rank:number}
type HeroesListType = Array<HeroInfos>
type HeroInfos = {id:number, name: string, owner:string, level:number, experience:number, runesIds:Array<number>, spots:Array<number>, spells: Array<Skill>, baseStats:HeroStats, bonusStats:HeroStats}
type HeroStats = {health:number, attack:number, defense:number, speed:number, criticalChance:number, criticalDamage:number}
type WorldsBattlesInfosDict = {[key : string]: BattlesInfosList}
type BattlesInfosList = Array<BattleInfos>
type BattleInfos = {enemies: {names: Array<string>, levels: Array<number>, statistics: Array<HeroStats>}, energyCost:number}
type HeroesStatsDict = {[key: string]: HeroStats}
type SkillsDict = {[key: string]: Skill}


type HeroesListApi= Array<HeroInfosApi>
type HeroInfosApi = {id:number, name: string, owner:string, level:number, experience:number, runesIds:Array<number>, spots:Array<number>, spells:Array<SkillApi>, baseStats:HeroStats}
type SkillsDictApi = {[key: string]: SkillApi}
type SkillApi = {
  imgName: string,
  name: string,
  description: string,
  cooldown: number,
  damage: [string, number, boolean, boolean, boolean],
  heal: [string, number, boolean, boolean, boolean],
  targetType: string,
  accuracy: number,
  aoe: boolean,
  buffsAndStatusArrays: Array<Array<any>>
}


export type {RunesList, HeroesListType, HeroInfos, HeroStats, HeroesStatsDict, RuneInfos, BattlesInfosList, BattleInfos, WorldsBattlesInfosDict, SkillApi, HeroInfosApi, HeroesListApi, SkillsDict, SkillsDictApi}
