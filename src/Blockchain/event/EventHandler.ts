import {eventHashesDict} from "./eventHash";
import {NewBattleEvent, StartTurnEvent, SkillEvent, EndTurnEvent, EndBattleEvent} from "./eventTypes";
import { num, shortString } from "starknet";

interface RawEvent {
  keys: string[],
  data: string[],
}

export default class EventHandler {
  private newBattleEvent: NewBattleEvent | undefined;
  private endBattleEvent: EndBattleEvent | undefined;
  private startTurnEventArray: StartTurnEvent[];
  private skillEventArray: SkillEvent[];
  private endTurnEventArray: EndTurnEvent[];

  constructor() {
    console.log("EventHandler constructor")
    this.newBattleEvent = undefined;
    this.endBattleEvent = undefined;
    this.startTurnEventArray = [];
    this.skillEventArray = [];
    this.endTurnEventArray = [];
  }

  parseAndStore(rawEventArray: RawEvent[]): void {
    rawEventArray.forEach((rawEvent: RawEvent) => {
      const eventName = eventHashesDict[rawEvent.keys[0]];
      if(!eventName) {
        throw new Error('event ' + rawEvent.keys[0] + ' not found');
      }
      if (eventName === "NewBattleEvent") {
        const healthsArray: number[] = rawEvent.data.slice(1).map((x: string) => Number(x));
        this.newBattleEvent = {owner: num.toHexString(rawEvent.data[0]), healthsArray: healthsArray};
      }
      else if (eventName === "StartTurnEvent") {
        this.parseAndStoreStartTurnEvent(rawEvent);
      }
      else if (eventName === "SkillEvent") {
        this.parseAndStoreSkillEvent(rawEvent);
      }
      else if (eventName === "EndTurnEvent") {
        this.parseAndStoreEndTurnEvent(rawEvent);
      }
      else  if (eventName === "EndBattleEvent") {
        this.endBattleEvent = {owner: num.toHexString(rawEvent.data[0]), hasPlayerWon: Boolean(Number(rawEvent.data[1]))};
      }
    });
  }

  private parseAndStoreStartTurnEvent(rawEvent: RawEvent) {
    const damagesLength = Number(rawEvent.data[2]);
    const damages = rawEvent.data.slice(3, 3 + damagesLength).map((x: string) => Number(x));
    const healsLength = Number(rawEvent.data[3 + damagesLength]);
    const heals = rawEvent.data.slice(4 + damagesLength, 4 + damagesLength + healsLength).map((x: string) => Number(x));
    let buffs = Array<{name: string, duration: number}>();
    let buffStartIndex = 4 + damagesLength + healsLength;
    for (let i = 0; i < Number(rawEvent.data[buffStartIndex]); i++) {
      buffs.push({name: shortString.decodeShortString(rawEvent.data[buffStartIndex + 1 + 2 * i]), duration: Number(rawEvent.data[buffStartIndex + 2 + 2 * i])})
    }
    let status = Array<{name: string, duration: number}>();
    let statusStartIndex = buffStartIndex + 1 + 2 * Number(rawEvent.data[buffStartIndex]);
    for (let i = 0; i < Number(rawEvent.data[statusStartIndex]); i++) {
      status.push({name: shortString.decodeShortString(rawEvent.data[statusStartIndex + 1 + 2 * i]), duration: Number(rawEvent.data[statusStartIndex + 2 + 2 * i])})
    }
    let isDead = Boolean(Number(rawEvent.data[statusStartIndex + 1 + 2 * Number(rawEvent.data[statusStartIndex])]));
    this.startTurnEventArray.push({owner: num.toHexString(rawEvent.data[0]), entityId: Number(rawEvent.data[1]), damages: damages, heals: heals, buffs: buffs, status: status, isDead: isDead});
  }

  private parseAndStoreSkillEvent(rawEvent: RawEvent) {
    const damagesLength = Number(rawEvent.data[4]);
    let damages = Array<{entityId: number, value: number}>();
    for (let i = 0; i < damagesLength; i++) {
      damages.push({entityId: Number(rawEvent.data[5 + 2 * i]), value: Number(rawEvent.data[6 + 2 * i])})
    }
    let damagesDict = this.formatIdValueToDict(damages);
    const healsLength = Number(rawEvent.data[5 + 2 * damagesLength]);
    let heals = Array<{entityId: number, value: number}>();
    for (let i = 0; i < healsLength; i++) {
      heals.push({entityId: Number(rawEvent.data[6 + 2 * damagesLength + 2 * i]), value: Number(rawEvent.data[7 + 2 * damagesLength + 2 * i])})
    }
    let healsDict = this.formatIdValueToDict(heals);
    let deathLength = Number(rawEvent.data[6 + 2 * damagesLength + 2 * healsLength]);
    let deaths = Array<number>();
    for (let i = 0; i < deathLength; i++) {
      deaths.push(Number(rawEvent.data[7 + 2 * damagesLength + 2 * healsLength + i]))
    }
    
    this.skillEventArray.push({owner: num.toHexString(rawEvent.data[0]), casterId: Number(rawEvent.data[1]), targetId: Number(rawEvent.data[2]), skillIndex: Number(rawEvent.data[3]), damagesDict: damagesDict, healsDict: healsDict, deathArray: deaths});
    // console.log('processed : ', this.skillEventArray[this.skillEventArray.length - 1])
  }

  parseAndStoreEndTurnEvent(rawEvent: RawEvent) {
    const buffsLength = Number(rawEvent.data[1]);
    let buffs = Array<{entityId: number, name: string, duration: number}>();
    for (let i = 0; i < buffsLength; i++) {
      buffs.push({entityId: Number(rawEvent.data[2 + 3 * i]), name: shortString.decodeShortString(rawEvent.data[3 + 3 * i]), duration: Number(rawEvent.data[4 + 3 * i])})
    }
    let buffsDict = this.formatIdNameDurationToDict(buffs);
    const statusLength = Number(rawEvent.data[2 + 3 * buffsLength]);
    let status = Array<{entityId: number, name: string, duration: number}>();
    for (let i = 0; i < statusLength; i++) {
      status.push({entityId: Number(rawEvent.data[3 + 3 * buffsLength + 3 * i]), name: shortString.decodeShortString(rawEvent.data[4 + 3 * buffsLength + 3 * i]), duration: Number(rawEvent.data[5 + 3 * buffsLength + 3 * i])})
    }
    let statusDict = this.formatIdNameDurationToDict(status);
    const speedsLength = Number(rawEvent.data[3 + 3 * buffsLength + 3 * statusLength]);
    let speeds = Array<{entityId: number, value: number}>();
    for (let i = 0; i < speedsLength; i++) {
      speeds.push({entityId: Number(rawEvent.data[4 + 3 * buffsLength + 3 * statusLength + 2 * i]), value: Number(rawEvent.data[5 + 3 * buffsLength + 3 * statusLength + 2 * i])})
    }
    let speedsDict = this.formatIdValueWithoutValueTagToDict(speeds);

    this.endTurnEventArray.push({owner: num.toHexString(rawEvent.data[0]), buffsDict: buffsDict, statusDict: statusDict, speedsDict: speedsDict});
    // console.log('processed : ', this.endTurnEventArray[this.endTurnEventArray.length - 1])
  }
    

  private formatIdValueWithoutValueTagToDict(valueById: Array<{entityId: number, value: number}>): {[key: number]: number} {
    let dict: {[key: number]: number} = {};
    valueById.forEach((valueById: {entityId: number, value: number}) => {
      dict[valueById.entityId] = valueById.value;
    });
    return dict;
  }

  private formatIdValueToDict(valueById: Array<{entityId: number, value: number}>): {[key: number]: {value: number}} {
    let dict: {[key: number]: {value: number}} = {};
    valueById.forEach((valueById: {entityId: number, value: number}) => {
      dict[valueById.entityId] = {value: valueById.value};
    });
    return dict;
  }

  private formatIdNameDurationToDict(valueById: Array<{entityId: number, name: string, duration: number}>): {[key: number]: Array<{name: string, duration: number}>} {
    let dict: {[key: number]: Array<{name: string, duration: number}>} = {};
    valueById.forEach((valueById: {entityId: number, name: string, duration: number}) => {
      if (dict[valueById.entityId]) {
        dict[valueById.entityId].push({name: valueById.name, duration: valueById.duration});
      }
      else {
        dict[valueById.entityId] = [{name: valueById.name, duration: valueById.duration}];
      }
    });
    return dict;
  }

  reset() {
    this.newBattleEvent = undefined;
    this.endBattleEvent = undefined;
    this.startTurnEventArray = [];
    this.skillEventArray = [];
    this.endTurnEventArray = [];
  }

  getNewBattleEvent(): NewBattleEvent | undefined {
    return this.newBattleEvent;
  }

  getEndBattleEvent(): EndBattleEvent | undefined {
    return this.endBattleEvent;
  }

  shiftStartTurnEvent(): StartTurnEvent | undefined {
    return this.startTurnEventArray.shift();
  }

  shiftSkillEvent(): SkillEvent | undefined {
    return this.skillEventArray.shift();
  }

  shiftEndTurnEvent(): EndTurnEvent | undefined {
    return this.endTurnEventArray.shift();
  }
}

