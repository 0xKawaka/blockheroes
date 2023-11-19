// const imgTypes = ["idle"]
// const directions = ["faceRight"]
const monstersNames = ["knight", "assassin", "priest", "hunter"]

let imagesByName: {[key: string]: {[key: string]: {[key: string]: any}} } = {}

// for (let monsterName of monstersNames) {
//   imagesByName[monsterName] = {}
//   for (let direction of directions) {
//     imagesByName[monsterName][direction] = {}
//     for (let imgType of imgTypes) {
//       // let img = require('../../assets/monsters/' + monsterName + '/' +  direction + '/' + imgType + '/' + imgType + 'Sprite.png')
//       let img = require('../../assets/monsters/' + monsterName + '/' +  direction + '/' + imgType + '/' + imgType + '.png')
//       imagesByName[monsterName][direction][imgType] = img
//     }
//   }
// }

for (let monsterName of monstersNames) {
  imagesByName[monsterName] = {}
  let img = require('../../assets/monsters/' + monsterName + '/' + 'spritesheet.png')
  imagesByName[monsterName] = img
}


export default imagesByName