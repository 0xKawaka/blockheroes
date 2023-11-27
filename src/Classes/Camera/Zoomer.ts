export default class Zoomer {
    screenWidth:number;
    screenHeight:number;
    backgroundBaseWidth: number;
    backgroundBaseHeight: number;
    scaleFactor: number;
    mainCameraZoom: number = 1;

    constructor(screenWidth: number, screenHeight: number,  backgroundBaseWidth: number, backgroundBaseHeight: number ,scaleFactor: number){
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.backgroundBaseWidth = backgroundBaseWidth
        this.backgroundBaseHeight = backgroundBaseHeight
        this.scaleFactor = scaleFactor
    }

    moveMainCamera(mainCamera: Phaser.Cameras.Scene2D.Camera, scaleFactor: number){
        const yOverflow = (this.backgroundBaseHeight * scaleFactor - this.screenHeight) / scaleFactor

        mainCamera.scrollX = (-this.screenWidth + this.backgroundBaseWidth) / 2
        mainCamera.scrollY = (-this.screenHeight + this.backgroundBaseHeight + yOverflow) / 2
    }

    zoomAndMoveMainCamera(mainCamera: Phaser.Cameras.Scene2D.Camera){
        let screenWidthByBackgroundWidthRatio = this.screenWidth / (this.backgroundBaseWidth * this.scaleFactor)
        let screenHeightByBackgroundHeightRatio = this.screenHeight / (this.backgroundBaseHeight * this.scaleFactor)

        if(screenWidthByBackgroundWidthRatio > 1 || screenHeightByBackgroundHeightRatio > 1){
            console.log("Resolution not supported")
            return
        }
        let zoom = Math.max(screenWidthByBackgroundWidthRatio, screenHeightByBackgroundHeightRatio)
        mainCamera.setZoom(zoom)
        this.mainCameraZoom = zoom

        let zoomOffSet;
        let imgOffset = 0;

        if(screenHeightByBackgroundHeightRatio > screenWidthByBackgroundWidthRatio){
            zoomOffSet = (mainCamera.displayHeight - this.screenHeight) / 2
        }
        else {
            zoomOffSet = (mainCamera.displayHeight - this.screenHeight) / 2
            imgOffset = this.backgroundBaseHeight * this.scaleFactor - mainCamera.displayHeight
        }
        if(zoomOffSet <= 0){
            return
        }
        mainCamera.scrollY = Math.trunc(zoomOffSet + imgOffset)
        mainCamera.scrollX = this.getBackgroundOffset()
    }

    getBackgroundOffset(): number {
        return (this.backgroundBaseWidth * this.scaleFactor - this.screenWidth) / 2
    }
}