const maxEnergy = 5
const timeTickEnergy = 120 // in seconds

export default class EnergyHandler {
  currentBlockchainEnergy: number
  actualEnergy: number
  lastEnergyUpdateTimestamp: number
  setEnergy: React.Dispatch<React.SetStateAction<number>>
  updateProcessCount: number

  constructor(setEnergy: React.Dispatch<React.SetStateAction<number>>) {
    this.currentBlockchainEnergy = 0
    this.actualEnergy = 0
    this.lastEnergyUpdateTimestamp = 0
    this.updateProcessCount = 0
    this.setEnergy = setEnergy
  }

  initEnergy(energy: number, lastEnergyUpdateTimestamp: number) {
    this.currentBlockchainEnergy = energy
    this.lastEnergyUpdateTimestamp = lastEnergyUpdateTimestamp
    this.actualEnergy = this.computeActualEnergy()
    this.setEnergy(this.actualEnergy)
  }

  updateEnergy(energy: number, lastEnergyUpdateTimestamp: number) {
    this.currentBlockchainEnergy = energy
    console.log("this.currentBlockchainEnergy :", this.currentBlockchainEnergy)
    this.lastEnergyUpdateTimestamp = lastEnergyUpdateTimestamp
    this.actualEnergy = this.computeActualEnergy()
    console.log("this.actualEnergy :", this.actualEnergy)
    this.setEnergy(this.actualEnergy)
    if(this.actualEnergy < maxEnergy) {
      this.updateEnergyOnCd()
    }
  }

  computeActualEnergy() {
    let now = Date.now() / 1000
    let timeSinceLastUpdate = Math.floor(now - this.lastEnergyUpdateTimestamp)
    let energyToAdd = Math.floor(timeSinceLastUpdate / timeTickEnergy)
    let actualEnergy = this.currentBlockchainEnergy + energyToAdd
    if(actualEnergy > maxEnergy) {
      actualEnergy = maxEnergy
    }
    return actualEnergy
  }

  async updateEnergyOnCd() {
    this.updateProcessCount += 1
    let processCount = this.updateProcessCount
    let i = 0
    while(this.actualEnergy < maxEnergy) {
      const now = Date.now() / 1000
      const timeSinceLastUpdate = now - (this.lastEnergyUpdateTimestamp + i * timeTickEnergy)

      if(timeSinceLastUpdate > timeTickEnergy) {
        console.log("timeSinceLastUpdate > timeTickEnergy")
        return
      }

      let remainingTime = timeTickEnergy - timeSinceLastUpdate
      console.log("Remaining time:", remainingTime)
      await new Promise(resolve => setTimeout(resolve, remainingTime * 1000))
      console.log("Energy timer ended")
      if(processCount !== this.updateProcessCount) {
        console.log("Not the latest timer process")
        return
      }
      this.actualEnergy += 1
      i += 1
      this.setEnergy(this.actualEnergy)
    }
  }

  getEnergy() {
    return this.actualEnergy
  }

  getMaxEnergy() {
    return maxEnergy
  }

  getLastEnergyActionTimestamp() {
    return this.lastEnergyUpdateTimestamp
  }

  setLastEnergyActionTimestamp(timestamp: number) {
    this.lastEnergyUpdateTimestamp = timestamp
  }

}

