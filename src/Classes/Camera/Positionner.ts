export default class Positionner {

  backgroundDisplayWidth: number
  backgroundDisplayHeight: number

  entitiesPositionsByTeamSize: { [key: number]: Array<{x: number, y: number}> } = {
    1: [{x: 0.21, y: 0.8}],
    2: [{x: 0.17, y: 0.71}, {x: 0.17, y: 0.86}],
    3: [{x: 0.25, y: 0.66}, {x: 0.17, y: 0.8}, {x: 0.25, y: 0.91}],
    4: [{x: 0.25, y: 0.66}, {x: 0.17, y: 0.71}, {x: 0.17, y: 0.86}, {x: 0.25, y: 0.91}],
  }

  constructor(backgroundDisplayWidth: number, backgroundDisplayHeight: number) {
    this.backgroundDisplayWidth = backgroundDisplayWidth
    this.backgroundDisplayHeight = backgroundDisplayHeight
  }

  getEntityPosition(indexEntity: number, teamEntityCount: number, isAlly:boolean): {x: number, y: number} {
    const positionIndex = indexEntity % teamEntityCount
    let x = 0
    let y = 0
    if(isAlly) {
       x = this.entitiesPositionsByTeamSize[teamEntityCount][positionIndex].x * this.backgroundDisplayWidth
        y = this.entitiesPositionsByTeamSize[teamEntityCount][positionIndex].y * this.backgroundDisplayHeight
      return {x, y}
    }
    x = this.backgroundDisplayWidth - this.entitiesPositionsByTeamSize[teamEntityCount][positionIndex].x * this.backgroundDisplayWidth
    y = this.entitiesPositionsByTeamSize[teamEntityCount][positionIndex].y * this.backgroundDisplayHeight
    return {x, y}
  }

  getSkillBarStartX(totalSizeSkill: number) {
    return this.backgroundDisplayWidth / 2 - totalSizeSkill / 2
  }
  getSkillBarStartY() {
    return this.backgroundDisplayHeight * 0.9
  }
}