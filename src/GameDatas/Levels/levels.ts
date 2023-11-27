const levels: { [key: string]: {[key: string]: any} } = {
  0: {
    0: {
      background: "Background_Forest",
    },
    1: {
      background: "Background_Forest",
    },
  },
  1: {
    0: {
      background: "Background_Forest",
    },
    1: {
      background: "Background_Forest",
    },
  },
};

function getLevelBackground(worldId: number, battleId: number, canvasWidth: number): string {
  return levels[worldId][battleId].background
//   if(canvasWidth < 800){
//     return levels[worldId][battleId].background
//   }
//   return levels[worldId][battleId].background + "_640"
}

export {getLevelBackground};