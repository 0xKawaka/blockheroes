let skillsetByMonsterName: {[key: string]: Array<string>}= {
  // "Knight": ["Attack", "Heal", "Slice Legs"],
  // "Knight": ["Attack", "StrikeStun", "StrikeAOETaunt"],
  "Knight": ["Attack", "StrikeStun", "Slice Legs"],
  "Priest": ["Attack", "HealAOE", "DefendSelfAndAlly"],
  "Assassin": ["Attack", "StrikeAndBoostATK", "StrikeReduceSpeedAOE"],
  "Hunter": ["Attack", "BuffSpeedATKSelf", "StrikeBurnAOE"],
}

for (let key in skillsetByMonsterName) {
  skillsetByMonsterName[key][0] = skillsetByMonsterName[key][0] + key
}

export default skillsetByMonsterName