import EnergyHandler from "../Pages/Classes/EnergyHandler";

type HeroBlockchain = {id:number, name: string, level:number, experience: number, rank: number, runeIds: Array<number>, spots:Array<number>}
type BlockchainRune = { id: number, statistic: string, isPercent: boolean, rank: number, rarity: string, shape: number, isEquipped: boolean, heroEquipped: number, rank4Bonus?: {statistic: string, isPercent: boolean}, rank8Bonus?: {statistic: string, isPercent: boolean}, rank12Bonus?: {statistic: string, isPercent: boolean}, rank16Bonus?: {statistic: string, isPercent: boolean}};
type EnergyInfos = {energy: number, lastEnergyUpdateTimestamp: number}
type AccountBlockchain = {username: string, shards: number, energyInfos: {energy: number, lastEnergyUpdateTimestamp: number}}

export type {HeroBlockchain, BlockchainRune, EnergyInfos, AccountBlockchain}