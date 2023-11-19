export default class Scaler {
    screenWidth:number;
    backgroundBaseWidth: number;
    scaleFactor: number;

    constructor(screenWidth: number, backgroundBaseWidth: number = 640){
        this.screenWidth = screenWidth
        this.backgroundBaseWidth = backgroundBaseWidth
        this.scaleFactor = this.getScaleFactor()
    }

    scaleBackground(background: Phaser.GameObjects.Image){
        background.setScale(this.scaleFactor)
    }

    getScaleFactor(): number{
        let screenByBackgroundRatio = this.screenWidth / this.backgroundBaseWidth
        if(screenByBackgroundRatio > 1){
            return Math.trunc(screenByBackgroundRatio) + 1
        }
        else {
            if(screenByBackgroundRatio < 0.5){
                return 1 / (Math.trunc(this.backgroundBaseWidth / this.screenWidth) + 1)
            }
            return 1
        }
    }

    getBuffStatusScaleFactor(): number{
        // if(this.scaleFactor > 1){
        //     return this.scaleFactor - 1
        // }
        return this.scaleFactor
    }

    getTextBuffStatusScaleFactor() : number{
        // if(this.scaleFactor > 1){
        //     return this.scaleFactor
        // }
        // return 1
        return this.scaleFactor
    }


    getEntitiesScaleFactor(): number{
        return this.scaleFactor
    }
}