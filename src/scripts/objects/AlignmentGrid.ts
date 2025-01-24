import { Math } from "phaser";


const Vector2 = Math.Vector2;
let gridCells : Array<Phaser.Geom.Rectangle>
let highlightedGraphics : Phaser.GameObjects.Graphics[];



export default class AlignmentGrid extends Phaser.GameObjects.Grid{

    gridWdith : number;
    gridHeight : number;
    cellWidth : number;
    cellHeight: number;

    constructor(scene : Phaser.Scene,startPosition : Math.Vector2,gridSize : Math.Vector2,cellDimension : Math.Vector2,cellGap : Math.Vector2,fillColor?: number,fillAlpha?: number,outlineFillColor?: number,outlineFillAlpha?: number){
        
        const centerX = scene.cameras.main.width / 2;
        const centerY = scene.cameras.main.height / 2;

        

        const gridDimensionX = (cellDimension.x * gridSize.x) + (cellGap.x * (gridSize.x - 1));
        const gridDimensionY = (cellDimension.y * gridSize.y) + (cellGap.y * (gridSize.y - 1));


        console.log("Grid : ",gridDimensionX,gridDimensionY);
        
        super(
            scene, 
            centerX,
            centerY, 
            gridDimensionX,
            gridDimensionY,
            cellDimension.x,
            cellDimension.y,
            fillColor, 
            fillAlpha, 
            outlineFillColor, 
            outlineFillAlpha
        );
        
         // Add grid to the scene
        scene.add.existing(this);

        const maxVisibleWidth = scene.cameras.main.width;
        const maxVisibleHeight = scene.cameras.main.height;

        gridCells = [];
        highlightedGraphics = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const cellX = this.x + i * this.cellWidth;
                const cellY = this.y + j * this.cellHeight;
                const highlight = this.scene.add.graphics();
                highlightedGraphics.push(highlight);

                // const text = scene.add.text(
                //     cellX + this.cellWidth / 2,
                //     cellY + this.cellHeight / 2,
                //     `${i},${j}`, // Example: cell coordinates
                //     { fontSize: '12px', color: '#ffffff' }
                // );

                // Align text to the center of the cell
                // text.setOrigin(0.5, 0.5);

                // // Add the text object to the cordText array for later management
                // cordText.push(text);

            }
        }



        // Debugging: Make sure the origin is correct
        // this.setOrigin(0.5, 0.5);
    }

    public getNumberOfCells() : Math.Vector2{
        return new Math.Vector2(this.width/this.cellWidth, this.height/this.cellHeight);
    }

    public checkImageOverlapWithCell(image: Phaser.GameObjects.Image | null, cellX: number, cellY: number): boolean {

        if (image == null) {
            return false;
        }

        const imageBounds = new Phaser.Geom.Rectangle(
            image.x - image.displayWidth / 2,
            image.y - image.displayHeight / 2,
            image.displayWidth,
            image.displayHeight
        );

        const index = (cellY * (this.width / this.cellWidth)) + cellX;
        let cell = gridCells[index];

        const intersection = Phaser.Geom.Rectangle.Intersection(cell, imageBounds);
        console.log('Intersection : ', intersection); 

        return intersection.isEmpty(); // No overlap
    }

    public getNearbyGridCells(position: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
        const topLeftX = this.x - (this.width / 2);
        const topLeftY = this.y - (this.height / 2);
      
        // Calculate the column and row indices of the center cell
        const col = Math.FloorTo((position.x - topLeftX) / this.cellWidth);
        const row = Math.FloorTo((position.y - topLeftY) / this.cellHeight);
      
        const nearbyCells: Phaser.Math.Vector2[] = [];
      
        // Iterate through the 2x2 cells around the center
        for (let i = 0; i <= 1; i++) { // 0 (current cell) and 1 (next column)
          for (let j = 0; j <= 1; j++) { // 0 (current row) and 1 (next row)
            const cellCol = col + i;
            const cellRow = row + j;
      
            // Ensure indices are within bounds
            if (cellCol >= 0 && cellCol < this.width / this.cellWidth && cellRow >= 0 && cellRow < this.height / this.cellHeight) {
              // Calculate the index in the gridCells array
      
              // Add the corresponding cell
              nearbyCells.push(new Vector2(cellCol, cellRow));
            }
          }
        }
      
        return nearbyCells;
    }

    public highlightCells(cellPositions : Phaser.Math.Vector2[],highlightColor: number = 0xffff00) : void{

        for (let i = 0; i < cellPositions.length; i++) {
            
            const cellLeft = this.x - (this.width / 2) + (cellPositions[i].x * this.cellWidth);
            const cellTop = this.y - (this.height / 2) + (cellPositions[i].y * this.cellHeight);
            
            // Create a Phaser Graphics object
            const highlight = this.scene.add.graphics();
            highlightedGraphics.push(highlight);
            // Draw a rectangle over the cell
            highlight.lineStyle(2, highlightColor, 1); // Set line color and thickness
            highlight.strokeRect(cellLeft, cellTop, this.cellWidth, this.cellHeight); // Draw the rectangle

            console.log('highlighted cell : ', cellPositions[i].x, cellPositions[i].y);
        }
    }

    public highlightCell(cellPosition : Phaser.Math.Vector2,highlightColor: number = 0xffff00) : void{
        const cellLeft = this.x - (this.width / 2) + (cellPosition.x * this.cellWidth);
            const cellTop = this.y - (this.height / 2) + (cellPosition.y * this.cellHeight);
            
            // Create a Phaser Graphics object
            const highlight = this.scene.add.graphics();
            highlightedGraphics.push(highlight);
            
            // Draw a rectangle over the cell
            highlight.lineStyle(2, highlightColor, 1); // Set line color and thickness
            highlight.strokeRect(cellLeft, cellTop, this.cellWidth, this.cellHeight); 
    }

    public gridToWorld(cellX: number, cellY: number): Phaser.Math.Vector2 {
        const worldX = this.x - (this.width / 2) + (cellX * this.cellWidth) + this.cellWidth / 2;
        const worldY = this.y - (this.height / 2) + (cellY * this.cellHeight) + this.cellHeight / 2;

        return new Phaser.Math.Vector2(worldX, worldY);
    }

    public gridToWorldFromVector(cellPosition: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        return this.gridToWorld(cellPosition.x, cellPosition.y);
    }

    public RemoveHighlights(){
        for(let i = 0; i < highlightedGraphics.length; i++){
            highlightedGraphics[i].destroy();
        }
    }

}