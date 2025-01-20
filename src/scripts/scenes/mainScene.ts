import FpsText from '../objects/fpsText'
import AlignmentGrid from '../objects/AlignmentGrid'
import { Vector } from 'matter'

export default class MainScene extends Phaser.Scene {
  fpsText : FpsText
  grid : AlignmentGrid
  image : Phaser.GameObjects.Image

  isOverlapping : boolean = false;
  currentOverlappingCellCordinates : Phaser.Math.Vector2;

  previousHighlightedCells : Phaser.Math.Vector2[] = [];

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)
    this.grid = new AlignmentGrid(
      this, 
      new Phaser.Math.Vector2(50,50), 
      new Phaser.Math.Vector2(600,400), 
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

    this.image = this.add.image(this.grid.x, this.grid.y, 'tile');
    this.image.setDisplaySize(50,50).setOrigin(.5,.5);

    this.image.x = this.grid.x;
    this.image.y = this.grid.getBottomCenter().y + this.image.displayHeight/2 + 20;

    this.image.setInteractive();  // Make the image interactive

    // Enable drag and drop on the image
    this.input.setDraggable(this.image);


     // When the drag starts
    this.image.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      // Optionally, add some visual effect when dragging starts
      this.image.setTint(0x888888);  // Make it gray during drag
      console.log('drag start');
    });

    // While dragging the image
    this.image.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      // Move the image with the pointer
      this.image.x = dragX;
      this.image.y = dragY;
      console.log('dragging');


      let nearbyCells : Phaser.Math.Vector2[] = this.grid.getNearbyGridCells(new Phaser.Math.Vector2(this.image.x,this.image.y));
      this.grid.highlightCells(nearbyCells);

      // for (let i = 0; i < this.grid.width; i++) {
      //   for(let j = 0; j< this.grid.height;j++){
      //     this.isOverlapping = this.grid.checkImageOverlapWithCell(this.image, i, j);
      //     if(this.isOverlapping){
      //       this.currentOverlappingCellCordinates = new Phaser.Math.Vector2(i,j);
      //       break;
      //     }
      //   }
      // }

      for(let i = 0; i < nearbyCells.length; i++){
        this.isOverlapping = this.grid.checkImageOverlapWithCell(this.image, nearbyCells[i].x, nearbyCells[i].y);
        if(this.isOverlapping){
          this.currentOverlappingCellCordinates = nearbyCells[i];
          break;
        }
      }
  
      if(this.isOverlapping){
        this.grid.highlightCell(this.currentOverlappingCellCordinates,0xff0000);
        console.log('Overlapping');
      }

    });

    // When the drag ends
    this.image.on('dragend', (pointer: Phaser.Input.Pointer) => {
      // Optionally, remove the tint when dragging ends

      this.grid.RemoveHighlights();

      this.image.clearTint();
      console.log('drag end');
      if(this.isOverlapping){
        let imagePos = this.grid.gridToWorldFromVector(this.currentOverlappingCellCordinates)
        this.image.setPosition(imagePos.x, imagePos.y);
      }
    });

    console.log('cell size : ',this.grid.cellHeight, this.grid.cellWidth);
    console.log('image size : ',this.image.displayHeight, this.image.displayWidth);


  }

  update() {
    this.fpsText.update()

    

  }
}
