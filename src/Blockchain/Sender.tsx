import { Account, Contract, TransactionFinalityStatus, shortString } from "starknet"
import {AccountsAdrs, GameAdrs} from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import GameAbi from './abi/Game.json'
import GameEventHandler from "./event/GameEventHandler";
import EventHandler from "./event/EventHandler";
import { RuneBonusEvent } from "./event/eventTypes";
import { RuneInfos } from "../Types/apiTypes";

export abstract class Sender {

  public static async unequipRune(wallet: Account, rune: RuneInfos) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.unequipRune(rune.id);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      if(res.execution_status == "SUCCEEDED")
        return true;
      return false;
    }
    catch(error: any){
      console.log('Sender unequipRune ', error.message)
      return false;
    }
  }

  public static async equipRune(wallet: Account, runeId: number, heroId: number) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.equipRune(runeId, heroId);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      console.log(res.events)
      if(res.execution_status == "SUCCEEDED")
        return true;
      return false;
    }
    catch(error: any){
      console.log('Sender equipRune ', error.message)
      return false;
    }
  }

  public static async upgradeRune(wallet: Account, rune: RuneInfos): Promise<{success: boolean, bonus: RuneBonusEvent | undefined }> {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.upgradeRune(rune.id);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      if(process.env.REACT_APP_ENV == "PROD" && res.events.length > 1) {
        return { success: true, bonus: EventHandler.parseRuneBonusEvent(res.events[0])};
      }
      else if(process.env.REACT_APP_ENV == "DEV" && res.events.length > 0) {
        return { success: true, bonus: EventHandler.parseRuneBonusEvent(res.events[0])};
      }
      // if(res.events.length > 0) {
      //   return { success: true, bonus: EventHandler.parseRuneBonusEvent(res.events[0])};
      // }
      return { success: true, bonus: undefined };
    }
    catch(error: any){
      console.log('Sender upgradeRune ', error.message)
      return { success: false, bonus: undefined };
    }
  }

  public static async playTurn(wallet: Account, spellIndex: number, targetId: number, eventHandler: GameEventHandler) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.playTurn(spellIndex, targetId);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      eventHandler.parseAndStore(res.events)
    }
    catch(error: any){
      console.log('Sender playTurn ', error.message)
      return 0;
    }
  }


  public static async startBattle(wallet: Account, heroesId: number[], worldId: number, battleId: number, eventHandler: GameEventHandler) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.startBattle(heroesId, worldId, battleId);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 300,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      eventHandler.parseAndStore(res.events)
    }
    catch(error: any){
      console.log('Sender startBattle ', error.message)
      return 0;
    }
  }

  public static async mintHero(wallet: Account): Promise<{id: number, name: String}> {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.mintHero();
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return {id: Number(res.events[0].data[1]), name: shortString.decodeShortString(res.events[0].data[2])};
    }
    catch(error: any){
      console.log('mintHero ', error.message)
      return {id: -1, name: ''};
    }
  }
  public static async createAccount(wallet: Account,  unsername: string) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.createAccount(unsername);
      await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return;
    }
    catch(error: any){
      console.log('createAccount ', error.message)
      return 0;
    }
  }
}