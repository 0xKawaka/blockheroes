import Battle from "./Battle";

export default class ServerHandler {
  socket: WebSocket
  isWaiting: boolean
  battle: Battle
  onTurnProcsStack: Array<{type: string, entityIndex: number, damages:Array<number>, heals:Array<number>, buffs:Array<{name: string, duration: number}>,
  statuses:Array<{name: string, duration: number}>, isDead:boolean, speed: number}>
  endBattleInfos: {winOrLose: string}

  constructor() {
    this.isWaiting = false
    this.onTurnProcsStack = []
    // let socket = new WebSocket("wss://localhost:62930");
    // let socket = new WebSocket('wss://localhost:62930', { rejectUnauthorized: false });

    let socket = new WebSocket("wss://79.137.84.165:62930");
    socket.addEventListener("open", (event) => {
      socket.send("Hello Server!");
    });
    socket.addEventListener("message", (event) => {
      this.handleMessages(event)
    });
    this.socket = socket
  }

  setBattle(battle: Battle) {
    this.battle = battle
  }

  send(message: any) {
    this.socket.send(JSON.stringify(message))
  }

  handleMessages(message: any) {
    console.log(message.data)
    let data = this.parseJsonIfPossible(message.data)
    try {
      if(!data || data.constructor !== Object || !("type" in data))
        return;
    } catch (e) {
      console.log(e);
    }
    if(data.type === "afterSkill" && data.skill && data.caster !== undefined && data.target !== undefined && data.damageDict && data.healDict && data.statusDict && data.buffsDict && data.speedDict && data.deathArray) {
      this.battle.processSkillReceivedServer(data.skill, data.caster, data.target, data.damageDict, data.healDict, data.statusDict, data.buffsDict, data.speedDict, data.deathArray)
    }
    else if(data.type === "onTurnProcs" && data.entityIndex !== undefined && data.damages && data.heals && data.buffs && data.statuses && data.isDead !== undefined && data.speed) {
      this.onTurnProcsStack.push(data)
    }
    else if(data.type === "endBattle" && data.winOrLose) {
      console.log(data)
      delete data.type
      this.endBattleInfos = data
    }
  }

  async getFirstOnTurnProcs() {
    while(true){
      let firstElem = this.onTurnProcsStack.shift()
      if(firstElem !== undefined)
        return firstElem
      console.log("Waiting for onTurnProcs from server")
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async getEndBattleInfos(): Promise<{winOrLose: string}> {
    while(true){
      if(this.endBattleInfos !== undefined && this.endBattleInfos.winOrLose !== ""){
        let endBattleInfosCopy = this.endBattleInfos
        this.endBattleInfos = {winOrLose: ""}
        return endBattleInfosCopy
      }
      console.log("Waiting for endBattle from server")
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  parseJsonIfPossible(data: any) {
    // console.log(typeof data)
    try {
      data = JSON.parse(data);
      // console.log(typeof data)
    } catch (e) {
      return false;
    }
    return data;
  }
  
  waitForResponse(){
    this.isWaiting = true
  }

}