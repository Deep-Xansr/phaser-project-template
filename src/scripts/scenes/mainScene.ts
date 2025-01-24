import FpsText from '../objects/fpsText'
import AlignmentGrid from '../objects/AlignmentGrid'
import MultiCellTile from '../objects/MultiCellTile'
import SnappingGrid from '../objects/SnappingGrid'
import { MutiTileType } from '../type/Enums'


type Vector2Dictionary = { [key: string]: Phaser.Math.Vector2[] };


type Vector2ToOverlappingDataDict = { [key : string] : {overlappingCellCord : Phaser.Math.Vector2, isOverlapping : boolean}};

      // Create the dictionary
let vectorDictionary: Vector2Dictionary = {};

// Helper function to convert a Vector2 to a unique string key
function vector2ToKey(vector: Phaser.Math.Vector2): string {
  return `${vector.x},${vector.y}`;
}

function keyToVector2(key: string): Phaser.Math.Vector2 {
  const [x, y] = key.split(',').map(Number);
  return new Phaser.Math.Vector2(x, y);
}


export default class MainScene extends Phaser.Scene {
  fpsText : FpsText
  grid : AlignmentGrid
  image : Phaser.GameObjects.Image
  multiCellTile : MultiCellTile;
  tempHighlight : Phaser.GameObjects.Graphics;
  vectorToOverlappingData : Vector2ToOverlappingDataDict = {};

  snappingGrid : SnappingGrid;



  isOverlapping : boolean = false;
  currentOverlappingCellCordinates : Phaser.Math.Vector2;

  previousHighlightedCells : Phaser.Math.Vector2[] = [];

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)
    // this.grid = new AlignmentGrid(
    //   this,
    //   new Phaser.Math.Vector2(0, 0),
    //   new Phaser.Math.Vector2(10, 10),
    //   new Phaser.Math.Vector2(50, 50),
    //   new Phaser.Math.Vector2(5, 5),
    //   0x808080,
    //   1,
    //   0x000000,
    //   1
    // );

    // this.grid.setOrigin(.5,.5);

    // if (this.grid instanceof AlignmentGrid){
    //   console.log('Number of cells : ' ,this.grid.getNumberOfCells());
    // }

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0);
    

    
    

    // this.image = this.add.image(this.grid.x, this.grid.y, 'tile');
    // this.image.setDisplaySize(50,50).setOrigin(.5,.5);

    // this.image.x = this.grid.x;
    // this.image.y = this.grid.getBottomCenter().y + this.image.displayHeight/2 + 20;

    // this.image.setInteractive();  // Make the image interactive

    // // Enable drag and drop on the image
    // this.input.setDraggable(this.image);


    //  // When the drag starts
    // this.image.on('dragstart', (pointer: Phaser.Input.Pointer) => {
    //   // Optionally, add some visual effect when dragging starts
    //   this.image.setTint(0x888888);  // Make it gray during drag
    //   console.log('drag start');
    // });

    // // While dragging the image
    // this.image.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
    //   // Move the image with the pointer
    //   this.image.x = dragX;
    //   this.image.y = dragY;
    //   console.log('dragging');


    //   let nearbyCells : Phaser.Math.Vector2[] = this.grid.getNearbyGridCells(new Phaser.Math.Vector2(this.image.x,this.image.y));
    //   this.grid.highlightCells(nearbyCells);

    //   // for (let i = 0; i < this.grid.width; i++) {
    //   //   for(let j = 0; j< this.grid.height;j++){
    //   //     this.isOverlapping = this.grid.checkImageOverlapWithCell(this.image, i, j);
    //   //     if(this.isOverlapping){
    //   //       this.currentOverlappingCellCordinates = new Phaser.Math.Vector2(i,j);
    //   //       break;
    //   //     }
    //   //   }
    //   // }

    //   for(let i = 0; i < nearbyCells.length; i++){
    //     this.isOverlapping = this.grid.checkImageOverlapWithCell(this.image, nearbyCells[i].x, nearbyCells[i].y);
    //     if(this.isOverlapping){
    //       this.currentOverlappingCellCordinates = nearbyCells[i];
    //       break;
    //     }
    //   }
  
    //   if(this.isOverlapping){
    //     this.grid.highlightCell(this.currentOverlappingCellCordinates,0xff0000);
    //     console.log('Overlapping');
    //   }

    // });

    // // When the drag ends
    // this.image.on('dragend', (pointer: Phaser.Input.Pointer) => {
    //   // Optionally, remove the tint when dragging ends

    //   this.grid.RemoveHighlights();

    //   this.image.clearTint();
    //   console.log('drag end');
    //   if(this.isOverlapping){
    //     let imagePos = this.grid.gridToWorldFromVector(this.currentOverlappingCellCordinates)
    //     this.image.setPosition(imagePos.x, imagePos.y);
    //   }
    // });

    // console.log('cell size : ',this.grid.cellHeight, this.grid.cellWidth);
    // console.log('image size : ',this.image.displayHeight, this.image.displayWidth);

    // this.multiCellTile = new MultiCellTile(this, 0, 0, MutiTileType.Square, new Phaser.Math.Vector2(50,50));
    // this.multiCellTile.setPosition(100,100);

    // this.tempHighlight = this.add.graphics();
    // // Draw a rectangle over the cell
    // this.tempHighlight.lineStyle(2, 0xff0000, 1);

    // this.multiCellTile.setInteractive(new Phaser.Geom.Rectangle(this.multiCellTile.x - this.multiCellTile.getBounds().width/2, 
    //                                   this.multiCellTile.y - this.multiCellTile.getBounds().height/2, 
    //                                   this.multiCellTile.getBounds().width, 
    //                                   this.multiCellTile.getBounds().height
    //                                 ), 
    //                                   Phaser.Geom.Rectangle.Contains);
    // this.input.setDraggable(this.multiCellTile);

    // // this.multiCellTile.on('pointerover', (pointer: Phaser.Input.Pointer) => {
    // //   console.log('drag start multi cell tile');
    // //   this.multiCellTile.highlightTiles(0x888888);
    // // });


    // this.multiCellTile.on('dragstart',(pointer: Phaser.Input.Pointer) =>{
    //   console.log('drag start multi cell tile');
    //   this.multiCellTile.highlightTiles(0x888888);
    // })

    // // While dragging the image
    // this.multiCellTile.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
    //   // console.log('dragging start multi cell tile');
    //   this.multiCellTile.x = dragX;
    //   this.multiCellTile.y = dragY;

      
    //   let nearbyCellsForTiles : Phaser.Math.Vector2[][] = []
    //   // let tileRecord : Record<Phaser.GameObjects.Image, Phaser.Math.Vector2[]> = {};

    //   // Define the dictionary type
      





    //   for(let i = 0; i <  this.multiCellTile.tiles.length; i++){
    //     let currentTile : Phaser.GameObjects.Image = this.multiCellTile.tiles[i];
    //     let worldX = currentTile.getWorldTransformMatrix().tx;
    //     let worldY = currentTile.getWorldTransformMatrix().ty;
    //     let nearbyCells : Phaser.Math.Vector2[] = this.grid.getNearbyGridCells(new Phaser.Math.Vector2(worldX,worldY));
    //     nearbyCellsForTiles.push(nearbyCells);
    //     this.grid.highlightCells(nearbyCells);
    //     let key : string = vector2ToKey(this.multiCellTile.getTileLocalCordForIndex(i));
    //     console.log("key : ", key);
    //     vectorDictionary[key] = nearbyCells;
    //     // console.log("Hightlighted cells : number : ", nearbyCells.length, " current tile pos : " , worldX, worldY);
    //   }


    //   for (let i in vectorDictionary){
    //     console.log("Key : ", i);
    //     console.log("Value : ", vectorDictionary);

    //     let nearbyCells = vectorDictionary[i]
    //     let draggableCellTileCord = keyToVector2(i);
    //     console.log("Drageeble cell tile cord : ", draggableCellTileCord);

    //     for(let cellIdx in nearbyCells){
    //       let nearbyCell = nearbyCells[cellIdx]
    //       let currentImage = this.multiCellTile.getImageAtPosition(draggableCellTileCord.x, draggableCellTileCord.y);
    //       let isOverlapping = this.grid.checkImageOverlapWithCell(currentImage, nearbyCell.x, nearbyCell.y);
    //       if(isOverlapping){
    //         this.vectorToOverlappingData[i] = {overlappingCellCord : nearbyCell, isOverlapping : true};
    //         let overlappingData = this.vectorToOverlappingData[i];
    //         console.log("Overlapping cell cord : ", overlappingData.overlappingCellCord," of tile key : ",keyToVector2(i));
    //         break;
    //       }

    //     }


    //   }


    //   for(let i in this.vectorToOverlappingData){
    //     let overlappingData = this.vectorToOverlappingData[i];
    //     if(overlappingData.isOverlapping){
    //       this.grid.highlightCell(overlappingData.overlappingCellCord,0xff0000);
    //     }
    //   }


    //   // for(let i = 0; i < nearbyCellsForTiles.length; i++){
    //   //   for(let j = 0; j < nearbyCellsForTiles[i].length; j++){
    //   //     this.isOverlapping = this.grid.checkImageOverlapWithCell(this.multiCellTile.tiles[i], nearbyCellsForTiles[i][j].x, nearbyCellsForTiles[i][j].y);
    //   //     if(this.isOverlapping){
    //   //       this.currentOverlappingCellCordinates = nearbyCellsForTiles[i][j];
    //   //       break;
    //   //     }
    //   //   }
    //   // }

    // });

    // // When the drag ends
    // this.multiCellTile.on('dragend', (pointer: Phaser.Input.Pointer) => {
    //   console.log('drag end start multi cell tile');
    //   this.multiCellTile.unHighlightTiles();

    //   for(let i in this.vectorToOverlappingData){
    //     let overlappingData = this.vectorToOverlappingData[i];
    //     console.log("Overlapping cell cord : ", overlappingData.overlappingCellCord," of tile key : ",keyToVector2(i));
    //     let imagePos = this.grid.gridToWorldFromVector(overlappingData.overlappingCellCord);
    //     let image = this.multiCellTile.getImageAtPosition(keyToVector2(i).x, keyToVector2(i).y);
    //     image?.setPosition(imagePos.x, imagePos.y);
    //   }


    // });

    this.snappingGrid = new SnappingGrid(this,5,5,50,50,10);
  }

  update() {
    this.fpsText.update()
    this.snappingGrid.updateWithMousePosition(new Phaser.Math.Vector2(this.game.input.mousePointer.x,this.game.input.mousePointer.y));
    // this.tempHighlight.strokeRect(this.multiCellTile.x, this.multiCellTile.y, this.multiCellTile.getBounds().width,this.multiCellTile.getBounds().height);
  }
}
