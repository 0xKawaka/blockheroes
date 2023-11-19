const levels: { [key: string]: {[key: string]: any} } = {
  0: {
    0: {
      background: "Background_Forest_640",
    },
    1: {
      background: "Background_Forest_640",
    },
  },
  1: {
    0: {
      background: "Background_Forest_640",
    },
    1: {
      background: "Background_Forest_640",
    },
  },
};

function getLevelBackground(worldId: number, battleId: number){
  return levels[worldId][battleId].background
}

export {getLevelBackground};