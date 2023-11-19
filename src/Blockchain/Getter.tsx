import { Account, Contract, shortString } from "starknet"
import {AccountsAdrs} from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import { GameAccount, HeroInfos } from "../Types/apiTypes";
import { HeroBlockchain } from "../Types/blockchainTypes";

export abstract class Getter {

  public static async getHero(wallet: Account, heroId: number): Promise<HeroBlockchain | undefined> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getHero(wallet.address, heroId);
      return {
        id: Number(res.id),
        name: shortString.decodeShortString(res.name),
        level: Number(res.level),
        rank: Number(res.rank)
      }
    }
    catch(error: any){
      console.log('getHero ', error.message)
      return;
    }
  }

  public static async getAllHeroes(wallet: Account) {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAllHeroes(wallet.address);
      const newRes = res.map((hero: any) => {
        return {
          id: Number(hero.id),
          name: shortString.decodeShortString(hero.name),
          level: Number(hero.level),
          rank: Number(hero.rank)
        }
      })
      return newRes;
    }
    catch(error: any){
      console.log('getAllHeroes ', error.message)
      return 0;
    }
  }

  public static async getAccount(wallet: Account): Promise<GameAccount | false> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAccount(wallet.address);
      if(Number(res.owner) === 0)
        return false;
      return {
        energy: Number(res.energy),
        shards: Number(res.shards),
      }
    }
    catch(error: any){
      console.log('getAccount ', error.message)
      return false;
    }
  }

}