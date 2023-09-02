// const Levels: { [key: string]: {[key: string]: any} } = {
//   "world1": {
//     "battle1": {background: "battle1", monsters: ["Knight", "Knight", "Knight", "Knight"], monsterLevels: [10, 11, 10, 12]},
//     "battle2": {background: "battle2", monsters: ["Knight", "Knight", "Knight", "Knight"], monsterLevels: [10, 11, 10, 12]}
//   },
// };

// export default Levels;


import EntityFactory from "../../Classes/Entity/EntityFactory";
import Entity from "../../Classes/Entity/Entity";

const levels: { [key: string]: {[key: string]: any} } = {
  "world1": {
    "battle1": {
      background: "battle1",
      monsterNames: ["Hunter", "Knight", "Priest", "Assassin"],
      monsterLevels: [10, 11, 10, 12],
      monsterHealths: [10, 10, 10, 10],
      monsterSpeeds: [133, 124, 115, 205],
    },
    "battle2": {
      background: "battle1",
      monsterNames: ["Hunter", "Knight", "Priest", "Assassin"],
      monsterLevels: [10, 11, 10, 12],
      monsterHealths: [10, 10, 10, 10],
      monsterSpeeds: [133, 124, 115, 205],
    }
  },
};

function getLevelBackground(worldId: string, battleId: string){
  return levels[worldId][battleId].background
}

function getLevelMonsters(worldId: string, battleId: string): Array<Entity> {
  let monsterArray = Array<Entity>()
  const levelDatas = levels[worldId][battleId]
  for (let i = 0; i < levelDatas.monsterNames.length; i++) {
    monsterArray.push(EntityFactory.createEntityFromScratch(levelDatas.monsterNames[i], levelDatas.monsterLevels[i], levelDatas.monsterHealths[i], levelDatas.monsterSpeeds[i]))
  }
  return monsterArray;
}

export {getLevelBackground, getLevelMonsters};
// export {getLevelBackground};