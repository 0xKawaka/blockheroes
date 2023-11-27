export default class Positionner {

  backgroundDisplayWidth: number
  backgroundDisplayHeight: number
  backgroundBaseWidth: number
  backgroundBaseHeight: number
  buffStatusSize: number = 12

  entitiesPositionsByTeamSize: { [key: number]: Array<{x: number, y: number}> } = {
    1: [{x: 0.23, y: 0.82}],
    2: [{x: 0.17, y: 0.7}, {x: 0.17, y: 0.9}],
    3: [{x: 0.29, y: 0.7}, {x: 0.17, y: 0.84}, {x: 0.29, y: 0.97}],
    4: [{x: 0.29, y: 0.7}, {x: 0.17, y: 0.73}, {x: 0.17, y: 0.94}, {x: 0.29, y: 0.97}],
  }


  constructor(backgroundDisplayWidth: number, backgroundDisplayHeight: number, backgroundBaseWidth: number, backgroundBaseHeight: number) {
    this.backgroundDisplayWidth = backgroundDisplayWidth
    this.backgroundDisplayHeight = backgroundDisplayHeight
    this.backgroundBaseWidth = backgroundBaseWidth
    this.backgroundBaseHeight = backgroundBaseHeight
  }

  getEntityPosition(indexEntity: number, alliesCount: number, enemiesCount: number, isAlly:boolean): {x: number, y: number} {
    let x = 0
    let y = 0
    if(isAlly) {
      const positionIndex = indexEntity
       x = this.entitiesPositionsByTeamSize[alliesCount][positionIndex].x * this.backgroundBaseWidth
        y = this.entitiesPositionsByTeamSize[alliesCount][positionIndex].y * this.backgroundBaseHeight
      return {x, y}
    }
    const positionIndex = indexEntity - alliesCount
    x = this.backgroundBaseWidth - this.entitiesPositionsByTeamSize[enemiesCount][positionIndex].x * this.backgroundBaseWidth
    y = this.entitiesPositionsByTeamSize[enemiesCount][positionIndex].y * this.backgroundBaseHeight
    return {x, y}
  }

  // getSkillBarStartX(totalSizeSkill: number) {
  //   return this.backgroundDisplayWidth / 2 - totalSizeSkill / 2
  // }
  // getSkillBarStartY() {
  //   return this.backgroundDisplayHeight * 0.9
  // }

  getSkillBarStartX(totalSizeSkill: number) {
    return this.backgroundBaseWidth / 2 - totalSizeSkill / 2
  }
  getSkillBarStartY() {
    return this.backgroundBaseHeight * 0.9
  }


  getBuffStatusPosition(healthBarX: number, healthBarY: number, healthBarWidth:number, healthBarHeight: number, buffsCount:number, statusCount:number, scale:number): Array<{x: number, y: number}> {
    // const realWidth = this.buffStatusSize * scale
    // const realHeight = this.buffStatusSize * scale
    const buffsPerRow = Math.floor(healthBarWidth / this.buffStatusSize)
    let positionArray = []
    for (let i = 0; i < buffsCount + statusCount; i++) {
      // const x = healthBarX + i % buffsPerRow * (realWidth + this.buffStatusGapRatio * this.canvasWidth)
      const x = healthBarX + (((i % buffsPerRow) + 1) * this.buffStatusSize)
      // const y = healthBarY + Math.floor(i / buffsPerRow) * (realHeight + this.buffStatusGapRatio * this.canvasHeight)
      const y = healthBarY - Math.floor(i / buffsPerRow) * this.buffStatusSize
      positionArray.push({x, y})
    }
    return positionArray
  }
}