import { BlockchainRune } from "../Types/blockchainTypes";

export abstract class Parser {

  static parseRune(rune: any): BlockchainRune {
    const rank = Number(rune.rank);
    return {
      id: Number(rune.id),
      statistic: this.getNotUndefinedKeys(rune.statistic.variant)[0].toLowerCase(),
      isPercent: Boolean(rune.isPercent),
      rank: Number(rune.rank),
      rarity: this.getNotUndefinedKeys(rune.rarity.variant)[0],
      shape: this.typeToShape(this.getNotUndefinedKeys(rune.runeType.variant)[0]),
      isEquipped: Boolean(rune.isEquipped),
      heroEquipped: Number(rune.heroEquipped),
      rank4Bonus: rank > 3 ? this.parseBonusRune(rune.rank4Bonus) : undefined,
      rank8Bonus: rank > 7 ? this.parseBonusRune(rune.rank8Bonus) :  undefined,
      rank12Bonus: rank > 11 ? this.parseBonusRune(rune.rank12Bonus) : undefined,
      rank16Bonus: rank > 15 ? this.parseBonusRune(rune.rank16Bonus) : undefined,
    }
  }

  static parseBonusRune(bonus: any) {
    return {
      statistic: this.getNotUndefinedKeys(bonus.statistic.variant)[0],
      isPercent: bonus.isPercent,
    }
  }

  static typeToShape(type: string): number {
    switch(type) {
      case "First":
        return 1;
      case "Second":
        return 2;
      case "Third":
        return 3;
      case "Fourth":
        return 4;
      case "Fifth":
        return 5;
      case "Sixth":
        return 6;
    }
    return -1;
  }

  // id: id,
  // statistic: statistic,
  // isPercent: isPercent,
  // rank: 0,
  // rarity: rarity,
  // runeType: runeType,
  // isEquipped: false,
  // heroEquipped: 0,
  // rank4Bonus: RuneBonus::new(RuneStatistic::Attack, false),
  // rank8Bonus: RuneBonus::new(RuneStatistic::Attack, false),
  // rank12Bonus: RuneBonus::new(RuneStatistic::Attack, false),
  // rank16Bonus: RuneBonus::new(RuneStatistic::Attack, false),

  static getNotUndefinedKeys(obj: any) {
    return Object.keys(obj).filter((key) => obj[key] !== undefined);
  }
}