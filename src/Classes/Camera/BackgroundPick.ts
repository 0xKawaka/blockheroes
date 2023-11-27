export default abstract class BackgroundPick {
  static getBackgroundWidth(canvasWidth: number): number {
    return 534
    // if(canvasWidth < 800){
    //   return 534
    // }
    // return 640
  }

  static getBackgroundHeight(canvasWidth: number): number {
    return 325
    // if(canvasWidth < 800){
    //   return 325
    // }
    // return 389
  }
}