export default abstract class BackgroundPick {
  static getBackgroundWidth(canvasWidth: number): number {
    if(canvasWidth < 800){
      return 534
    }
    return 640
  }

  static getBackgroundHeight(canvasWidth: number): number {
    if(canvasWidth < 800){
      return 325
    }
    return 389
  }
}