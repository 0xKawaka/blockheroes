import { HeroInfos, SkillsDict, BaseStatsDict, SkillSets, HeroStats, BattlesInfosDict, EnemyInfos, BattlesInfosApi } from "../../Types/apiTypes";
import { HeroBlockchain } from "../../Types/blockchainTypes";
import Skill from "../Skill/Skill";

export abstract class HeroesFactory {
  public static createHeroes(heroes: Array<HeroBlockchain>, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): Array<HeroInfos> {
    let heroesWithStatsAndSkills = new Array<HeroInfos>();
    heroes.forEach((hero) => {
      let heroWithStatsAndSkills: HeroInfos = {
        id: hero.id,
        name: hero.name,
        level: hero.level,
        rank: hero.rank,
        experience: 0,
        runesIds: [],
        spots: [],
        spells: HeroesFactory.getSkills(skillSets[hero.name], skillsDict),
        baseStats: HeroesFactory.computeBaseStats(hero.level, hero.rank, baseStatsDict[hero.name]),
        bonusStats: HeroesFactory.computeBonusStats()
      }
      heroesWithStatsAndSkills.push(heroWithStatsAndSkills)
    })
    return heroesWithStatsAndSkills;
  }

  public static createHero(hero: HeroBlockchain, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): HeroInfos {
    let heroWithStatsAndSkills: HeroInfos = {
      id: hero.id,
      name: hero.name,
      level: hero.level,
      rank: hero.rank,
      experience: 0,
      runesIds: [],
      spots: [],
      spells: HeroesFactory.getSkills(skillSets[hero.name], skillsDict),
      baseStats: HeroesFactory.computeBaseStats(hero.level, hero.rank, baseStatsDict[hero.name]),
      bonusStats: HeroesFactory.computeBonusStats()
    }
    return heroWithStatsAndSkills;
  }

  public static createEnemyHeroes(battlesInfos: BattlesInfosApi, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): BattlesInfosDict {
    let battlesWithEnemyStatsAndSkills: BattlesInfosDict = {};
    Object.keys(battlesInfos).forEach((worldIdKey) => {
      // console.log(worldIdKey)
      const worldId = Number(worldIdKey)
      battlesWithEnemyStatsAndSkills[worldId] = [];
      battlesInfos[worldId].forEach((battle) => {
        let enemiesWithStatsAndSkills = new Array<EnemyInfos>();
        for(let i = 0; i < battle.names.length; i++){
          let enemyWithStatsAndSkills: EnemyInfos = {
            name: battle.names[i],
            level: battle.levels[i],
            rank: battle.ranks[i],
            stats: HeroesFactory.computeBaseStats(battle.levels[i],battle.ranks[i], baseStatsDict[battle.names[i]]),
            spells: HeroesFactory.getSkills(skillSets[battle.names[i]], skillsDict),
          }
          enemiesWithStatsAndSkills.push(enemyWithStatsAndSkills)
        }
        battlesWithEnemyStatsAndSkills[worldId].push({enemies: enemiesWithStatsAndSkills, energyCost: battle.energyCost})
      })
    })
    return battlesWithEnemyStatsAndSkills;
  }

  static getSkills(skillSet: Array<string>, skillsDict: SkillsDict): Array<Skill> {
    let skills = new Array<Skill>();
    skillSet.forEach((skillName) => {
      skills.push(skillsDict[skillName])
    })
    return skills;
  }

  static computeBaseStats(level: number, rank: number, baseStats: HeroStats): HeroStats {

    return { 
      health: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.health),
      attack: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.attack),
      defense: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.defense),
      speed: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.speed),
      criticalChance: baseStats.criticalChance, criticalDamage: baseStats.criticalDamage};
  }

  static computeBaseStatFromLevelRank(level: number, rank: number, stat: number): number {
    return Math.trunc(stat + (stat * (level - 1)) / 100);
  }

  static computeBonusStats(): HeroStats {
    return { health: 0, attack: 0, defense: 0, speed: 0, criticalChance: 0, criticalDamage: 0 };
  }

}