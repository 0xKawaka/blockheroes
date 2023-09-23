let skillsetByMonsterName: {[key: string]: Array<string>}= {
  "Knight": ["Attack", "Blade Swing", "Fire Strike"],
  "Priest": ["Attack", "Healing Prayer", "Water Shield"],
  "Assassin": ["Attack", "StrikeAndBoostATK", "Sandstorm Strikes"],
  "Hunter": ["Attack", "BuffSpeedATKSelf", "StrikeBurnAOE"],
}

for (let key in skillsetByMonsterName) {
  skillsetByMonsterName[key][0] = skillsetByMonsterName[key][0] + key
}

export default skillsetByMonsterName