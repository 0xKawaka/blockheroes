
export default class FontLoader extends Phaser.Scene {
  constructor() {
    super('FontLoader')
  }

  preload() {
    this.load.bitmapFont('RetroGaming', 'fonts/RetroGaming.png', 'fonts/RetroGaming.xml')
    this.load.bitmapFont('RetroGaming10', 'fonts/RetroGaming10.png', 'fonts/RetroGaming10.xml')
    this.load.bitmapFont('Kenney', 'fonts/Kenney.png', 'fonts/Kenney.xml')
    this.load.bitmapFont('pixelFJ8', 'fonts/pixelFJ8.png', 'fonts/pixelFJ8.xml')
  }

  create({}:{}) {
    this.scene.start('BattleLoader')
  }
}