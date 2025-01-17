import FpsText from '../objects/fpsText'
import AlignmentGrid from '../objects/AlignmentGrid'

export default class MainScene extends Phaser.Scene {
  fpsText : FpsText
  grid : Phaser.GameObjects.Grid

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)
    this.grid = new AlignmentGrid(
      this, 
      new Phaser.Math.Vector2(50,50), 
      new Phaser.Math.Vector2(800,600), 
      new Phaser.Math.Vector2(50,50), 
      0x000000, 
      0.5, 
      0x000000, 
      0.5
    );

    if (this.grid instanceof AlignmentGrid){
      console.log('Number of cells : ' ,this.grid.getNumberOfCells());
    }

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  update() {
    this.fpsText.update()
  }
}
