export default class PositionScaler {
  canvasWidth: number
  canvasHeight: number
  entityRatio: {widthRatio: number, heightRatio: number}

  buffStatusSize : {width: number, height: number}
  buffStatusGapRatio: number
  
  buffStatusRatio: {widthRatio: number, heightRatio: number}
  healthBarRatio: {widthRatio: number, heightRatio: number}
  turnBarRatio: {widthRatio: number, heightRatio: number}
  playTurnBarRatio: {widthRatio: number, heightRatio: number}
  spellIconsRatio: {widthRatio: number, heightRatio: number}
  placeholderRatio: {widthRatio: number, heightRatio: number}
  dictSpellAnimationsRatio: {[key: string]: {widthRatio: number, heightRatio: number}}
  
  entitiesRatioPositionsByTeamSize: { [key: number]: Array<{x: number, y: number}> } = {
    1: [{x: 0, y: 0}],
    2: [{x: 0, y: 0}, {x: 0, y: 0}],
    3: [{x: 0.07, y: 0}, {x: 0, y: 0}, {x: 0.07, y: 0}],
    4: [{x: 0.3, y: 0.49}, {x: 0.2, y: 0.56}, {x: 0.2, y: 0.76}, {x: 0.3, y: 0.83}],
  }
  widthPositionRatio:number = 0.13
  heightOfTerrainRatio:number = 0.6
  

  constructor() {
    this.buffStatusSize = {width: 100, height: 100}
    this.buffStatusGapRatio = 0.005

    this.entityRatio = {widthRatio: 0.5, heightRatio: 0.4}
    this.buffStatusRatio = {widthRatio: 0.0275, heightRatio: 0.035}
    this.healthBarRatio = {widthRatio: 0.11, heightRatio: 0.021}
    this.turnBarRatio = {widthRatio: 0.11, heightRatio: 0.0035}
    this.playTurnBarRatio = {widthRatio: 0.055, heightRatio: 0.01}
    this.spellIconsRatio = {widthRatio: 0.1, heightRatio: 0.1}
    this.placeholderRatio = {widthRatio: 0.1, heightRatio: 0.15}
  }

  computePositionBuffsAndStatus(healthBarX: number, healthBarY: number, healthBarWidth:number, healthBarHeight: number, buffsCount:number, statusCount:number, scale:number): Array<{x: number, y: number}> {
    const realWidth = this.buffStatusSize.width * scale
    const realHeight = this.buffStatusSize.height * scale
    const buffsPerRow = Math.floor(healthBarWidth / realWidth)
    let positionArray = []
    for (let i = 0; i < buffsCount + statusCount; i++) {
      // const x = healthBarX + i % buffsPerRow * (realWidth + this.buffStatusGapRatio * this.canvasWidth)
      const x = healthBarX + ((i % buffsPerRow) * realWidth)
      // const y = healthBarY + Math.floor(i / buffsPerRow) * (realHeight + this.buffStatusGapRatio * this.canvasHeight)
      const y = healthBarY - Math.floor(i / buffsPerRow) * realHeight
      positionArray.push({x, y})
    }
    return positionArray
  }

  computePositionEntity(scale:number, entityWidth: number, entityHeight: number, indexEntity: number, teamEntityCount: number, isAlly:boolean): {x: number, y: number} {
    const realHeight = entityHeight * scale
    const realWidth = entityWidth * scale
    const realIndex = indexEntity % teamEntityCount
    let x = 0
    let y = 0
    if(isAlly) {
       x = this.canvasWidth * this.entitiesRatioPositionsByTeamSize[teamEntityCount][realIndex].x
      const yStartTerrain = this.canvasHeight -  this.canvasHeight * this.heightOfTerrainRatio
      // y = yStartTerrain - realHeight + realIndex * realHeight / 2
      y = this.canvasHeight * this.entitiesRatioPositionsByTeamSize[teamEntityCount][realIndex].y
      return {x, y}
    }
    x = this.canvasWidth - this.canvasWidth * this.entitiesRatioPositionsByTeamSize[teamEntityCount][realIndex].x
    const yStartTerrain = this.canvasHeight - this.canvasHeight * this.heightOfTerrainRatio
    // y = yStartTerrain - realHeight + realIndex * realHeight / 2
    y = this.canvasHeight * this.entitiesRatioPositionsByTeamSize[teamEntityCount][realIndex].y
    return {x, y}
  }
  computeWidthHeightPlaceholder(): {width: number, height: number} {
    let width = this.placeholderRatio.widthRatio * this.canvasWidth
    let height = this.placeholderRatio.heightRatio * this.canvasHeight
    return {width: width, height: height}
  }
  computeScaleBuffsAndStatus(){
    const widthScale = this.buffStatusRatio.widthRatio / (this.buffStatusSize.width / this.canvasWidth)
    const heightScale = this.buffStatusRatio.heightRatio / (this.buffStatusSize.height / this.canvasHeight)
    return Math.min(widthScale, heightScale)
  }
  computeScaleForWidthHeightRatio(width: number, height: number, widthRatio:number, heightratio:number): number {
    let widthScale = widthRatio / (width / this.canvasWidth)
    let heightScale = heightratio / (height / this.canvasHeight)
    return Math.min(widthScale, heightScale)
  }
  computeWidthHeightTurnBar(): {width: number, height: number} {
    let width = this.turnBarRatio.widthRatio * this.canvasWidth
    let height = this.turnBarRatio.heightRatio * this.canvasHeight
    return {width: width, height: height}
  }
  computeWidthHeightPlayTurnBar(): {width: number, height: number} {
    let width = this.playTurnBarRatio.widthRatio * this.canvasWidth
    let height = this.playTurnBarRatio.heightRatio * this.canvasHeight
    return {width: width, height: height}
  }
  computeWidthHeightHealthBar(): {width: number, height: number} {
    let width = this.healthBarRatio.widthRatio * this.canvasWidth
    let height = this.healthBarRatio.heightRatio * this.canvasHeight
    return {width: width, height: height}
  }
  computePositionTurnBar(entityPosition: {x: number, y: number}, entityWidth: number, entityHeight: number): {x: number, y: number} {
    let {width, height} = this.computeWidthHeightTurnBar()
    let gap = (entityWidth - width) / 2
    return {x: entityPosition.x - entityWidth / 2 + gap, y: entityPosition.y - entityHeight - height}
  }
  computePositionHealthBar(entityPosition: {x: number, y: number}, entityWidth: number, entityHeight: number): {x: number, y: number} {
    // let {width, height} = this.computeWidthHeightTurnBar()
    // let turnBarHeight = height;
    let {width, height} = this.computeWidthHeightHealthBar()
    let gap = (entityWidth - width) / 2
    return {x: entityPosition.x - entityWidth / 2 + gap, y: entityPosition.y - entityHeight - height}
  }
  computePositionPlayTurnBar(entityPosition: {x: number, y: number}, entityWidth: number, entityHeight: number): {x: number, y: number} {
    let {width, height} = this.computeWidthHeightPlayTurnBar()
    let gap = (width - entityWidth) / 2
    return {x: entityPosition.x + gap, y: entityPosition.y}
  }
  setCanvasWidthHeight(width: number, height: number) {
    this.canvasWidth = width
    this.canvasHeight = height
  }
}