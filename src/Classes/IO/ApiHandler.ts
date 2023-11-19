export default class ApiHandler {
  static async get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
  }

  static getWorldsBattlesList() {
    return this.get('http://localhost:8081/worldBattles')
  }
  static getWorldsBattlesListWithStats() {
    return this.get('http://localhost:8081/worldBattlesWithStats')
  }
  static async getHeroes(owner: string) {
    return await this.get('http://localhost:8081/heroes/' + owner)
  }
  static async getHeroesAndRunes(owner: string) {
    return await this.get('http://localhost:8081/heroesAndRunes/' + owner)
  }
  static async getHeroesWithSpellsAndRunes(owner: string) {
    return await this.get('http://localhost:8081/heroesWithSpellsAndRunes/' + owner)
  }  
  static async getHeroesWithSpellsBaseStatsAndRunes(owner: string) {
    return await this.get('http://localhost:8081/heroesWithSpellsBaseStatsAndRunes/' + owner)
  }
  static async getRunes(owner: string) {
    return await this.get('http://localhost:8081/runes/' + owner)
  }
  
  static async getSkillSetsAndSkills() {
    return await this.get('http://localhost:8081/skillSetsAndSkills')
  }
  static async getEnemiesSkills(enemiesNames: string[]) {
    return await this.get('http://localhost:8081/enemiesSkills/' + enemiesNames)
  }

  // NEW
  static async getSkillsDict() {
    return await this.get('http://localhost:8081/skillsDict')
  }

  static async getSkillSets() {
    return await this.get('http://localhost:8081/skillSets')
  }

  static async getBaseStats() {
    return await this.get('http://localhost:8081/baseStats')
  }
  
  static async getBattlesInfos() {
    return await this.get('http://localhost:8081/battlesInfos')
  }

}