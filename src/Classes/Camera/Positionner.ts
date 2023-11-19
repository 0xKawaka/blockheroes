export default class Positionner {

  backgroundDisplayWidth: number
  backgroundDisplayHeight: number
  buffStatusSize: number = 16

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

  getEntityPosition(indexEntity: number, alliesCount: number, enemiesCount: number, isAlly:boolean): {x: number, y: number} {

    let x = 0
    let y = 0
    if(isAlly) {
      const positionIndex = indexEntity
       x = this.entitiesPositionsByTeamSize[alliesCount][positionIndex].x * this.backgroundDisplayWidth
        y = this.entitiesPositionsByTeamSize[alliesCount][positionIndex].y * this.backgroundDisplayHeight
      return {x, y}
    }
    const positionIndex = indexEntity - alliesCount
    x = this.backgroundDisplayWidth - this.entitiesPositionsByTeamSize[enemiesCount][positionIndex].x * this.backgroundDisplayWidth
    y = this.entitiesPositionsByTeamSize[enemiesCount][positionIndex].y * this.backgroundDisplayHeight
    return {x, y}
  }

  getSkillBarStartX(totalSizeSkill: number) {
    return this.backgroundDisplayWidth / 2 - totalSizeSkill / 2
  }
  getSkillBarStartY() {
    return this.backgroundDisplayHeight * 0.9
  }

  getBuffStatusPosition(healthBarX: number, healthBarY: number, healthBarWidth:number, healthBarHeight: number, buffsCount:number, statusCount:number, scale:number): Array<{x: number, y: number}> {
    const realWidth = this.buffStatusSize * scale
    const realHeight = this.buffStatusSize * scale
    const buffsPerRow = Math.floor(healthBarWidth / realWidth)
    let positionArray = []
    for (let i = 0; i < buffsCount + statusCount; i++) {
      // const x = healthBarX + i % buffsPerRow * (realWidth + this.buffStatusGapRatio * this.canvasWidth)
      const x = healthBarX + (((i % buffsPerRow) + 1) * realWidth)
      // const y = healthBarY + Math.floor(i / buffsPerRow) * (realHeight + this.buffStatusGapRatio * this.canvasHeight)
      const y = healthBarY - Math.floor(i / buffsPerRow) * realHeight
      positionArray.push({x, y})
    }
    return positionArray
  }
}