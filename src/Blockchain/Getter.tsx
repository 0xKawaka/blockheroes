import { Account, Contract, shortString } from "starknet"
import {AccountsAdrs} from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import { GameAccount, HeroInfos } from "../Types/apiTypes";
import { BlockchainRune, HeroBlockchain } from "../Types/blockchainTypes";
import { Parser } from "./Parser";

export abstract class Getter {

  public static async getAllRunes(wallet: Account): Promise<Array<BlockchainRune>> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAllRunes(wallet.address);
      const newRes = res.map((rune: any) => {
        return Parser.parseRune(rune)
      })
      return newRes;
    }
    catch(error: any){
      console.log('getAllRunes ', error.message)
      return [];
    }
  }

  public static async getHero(wallet: Account, heroId: number): Promise<HeroBlockchain | undefined> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getHero(wallet.address, heroId);
      return Parser.parseHero(res)
    }
    catch(error: any){
      console.log('getHero ', error.message)
      return;
    }
  }

  public static async getAllHeroes(wallet: Account): Promise<Array<HeroBlockchain>> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAllHeroes(wallet.address);
      const newRes = res.map((hero: any) => {
        return Parser.parseHero(hero)
      })
      return newRes;
    }
    catch(error: any){
      console.log('getAllHeroes ', error.message)
      return [];
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