import { Account, Contract, TransactionFinalityStatus, shortString } from "starknet"
import {AccountsAdrs, GameAdrs} from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import GameAbi from './abi/Game.json'
import EventHandler from "./event/EventHandler";

export abstract class Sender {

  public static async playTurn(wallet: Account, spellIndex: number, targetId: number, eventHandler: EventHandler) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.playTurn(spellIndex, targetId);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      // console.log(res.events)
      // console.log(res.events[1])
      // console.log(res.events[2])
      eventHandler.parseAndStore(res.events)
    }
    catch(error: any){
      console.log('Sender playTurn ', error.message)
      return 0;
    }
  }


  public static async startBattle(wallet: Account, heroesId: number[], worldId: number, battleId: number, eventHandler: EventHandler) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.startBattle(heroesId, worldId, battleId);
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 400,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      // console.log(res.events[1])
      // console.log(res.events[2])
      // console.log(res.events[3])
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