export default class Turnbar {
  entityIndex: number
  speed: number
  turnbar: number
  incrementStep: number = 0.7

  constructor(entityIndex: number, speed: number) {
    this.entityIndex = entityIndex
    this.speed = speed
    this.turnbar = 0
  }

  incrementTurnbar() {
    this.turnbar += Math.floor(this.speed * this.incrementStep)
  }

  resetTurn() {
    this.turnbar = 0
  }

  setSpeed(speed: number) {
    this.speed = speed
  }
}