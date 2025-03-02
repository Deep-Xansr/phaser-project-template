import { Math as PhaserMath } from 'phaser';
import { GridStyle } from '../type/GridStyle';

//TODO : Add functionality to place tiles and spacer texture (for the gaps.)
export default class SnappingGrid extends Phaser.GameObjects.Container {
    numberOfCellX: number;
    numberOfCellY: number;

    cellWidth: number;
    cellHeight: number;
    gap: number; // Added gap property

    gridMatrix : Phaser.GameObjects.Image[][] = []
    debugGridMatrix : Phaser.GameObjects.Graphics[][] = []

    highlightedGraphics : Phaser.GameObjects.Graphics[] = []

    lastMousePosition : PhaserMath.Vector2 = PhaserMath.Vector2.ZERO;

    constructor(
        scene: Phaser.Scene,
        numberOfCellX: number,
        numberOfCellY: number,
        cellWidth: number,
        cellHeight: number,
        gap: number = 0, // Default gap is 0
        gridStyle?: GridStyle,
        isDebugMode? : boolean
    ) {
        super(scene, 0, 0);

        if(isDebugMode == null){
            isDebugMode = true;
        }

        this.numberOfCellX = numberOfCellX;
        this.numberOfCellY = numberOfCellY;

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gap = gap;

        // this.gridMatrix = [numberOfCellX][numberOfCellY]
        this.gridMatrix = Array.from({ length: numberOfCellX }, () => Array(numberOfCellY));
        this.debugGridMatrix = Array.from({ length: numberOfCellX }, () => Array(numberOfCellY));

        for (let i = 0; i < numberOfCellX; i++) {
            for (let j = 0; j < numberOfCellY; j++) {
                const cellX = i * (cellWidth + gap); // Adjust X position with gap
                const cellY = j * (cellHeight + gap); // Adjust Y position with gap

                // if(isDebugMode){
                //     const graphics = scene.add.graphics();
                //     graphics.fillStyle(0x808080, 1);
                //     graphics.fillRect(0, 0, cellWidth, cellHeight);

                //     // Position the graphics relative to the container
                //     graphics.setPosition(cellX, cellY);


                //     // Add graphics to the container
                //     this.add(graphics);
                //     this.debugGridMatrix[i][j] = graphics;
                // }

                
                if (gridStyle != null){
                    this.applyGridStyle(gridStyle);
                }
                else{
                    console.log('grid style is empty')
                }
                

                console.log(`Drawing cell at local position: (${cellX}, ${cellY})`);
            }
        }

        this.setSize(this.getTotalSize().x, this.getTotalSize().y);

        // Set container position
        const centerX = scene.cameras.main.width / 2;
        const centerY = scene.cameras.main.height / 2;
        this.setPosition(centerX - (this.getTotalSize().x * .5), centerY - (this.getTotalSize().y * .5));


        if (isDebugMode){
            // Debug container bounds
            const debugGraphics = scene.add.graphics();
            debugGraphics.lineStyle(2, 0xff0000, 1);
            debugGraphics.strokeRect(0, 0, this.getTotalSize().x, this.getTotalSize().y); // Relative to container
            this.add(debugGraphics); // Add debug graphics to the container
        }

        console.log('SnappingGrid size:', this.getTotalSize());

        // Add the container to the scene
        scene.add.existing(this);
    }

    // Calculate total grid size including gaps
    getTotalSize(): PhaserMath.Vector2 {
        const totalWidth = this.numberOfCellX * this.cellWidth + (this.numberOfCellX - 1) * this.gap;
        const totalHeight = this.numberOfCellY * this.cellHeight + (this.numberOfCellY - 1) * this.gap;
        return new PhaserMath.Vector2(totalWidth, totalHeight);
    }

    /**
     * Convert grid coordinates to world coordinates.
     * @param gridX - The X index of the grid cell.
     * @param gridY - The Y index of the grid cell.
     * @returns World position as a Phaser.Math.Vector2.
     */
    gridToWorldLocation(gridX: number, gridY: number): PhaserMath.Vector2 {
        const worldX = this.x + gridX * (this.cellWidth + this.gap);
        const worldY = this.y + gridY * (this.cellHeight + this.gap);
        return new PhaserMath.Vector2(worldX, worldY);
    }

    /**
     * Convert world coordinates to grid coordinates.
     * @param worldX - The world X coordinate.
     * @param worldY - The world Y coordinate.
     * @returns Grid position as a Phaser.Math.Vector2, or null if out of bounds.
     */
    worldToGridLocation(worldX: number, worldY: number): PhaserMath.Vector2 | null {
        const localX = worldX - this.x; // Convert world coordinates to grid-local coordinates
        const localY = worldY - this.y;

        if (localX < 0 || localY < 0 || 
            localX >= this.getTotalSize().x || localY >= this.getTotalSize().y
        ) {
            return null; // Outside the grid
        }

        const gridX = Math.floor(localX / (this.cellWidth + this.gap));
        const gridY = Math.floor(localY / (this.cellHeight + this.gap));

        // Calculate the top-left corner of the current grid cell
        const cellStartX = gridX * (this.cellWidth + this.gap);
        const cellStartY = gridY * (this.cellHeight + this.gap);

        // Check if the mouse is within the cell (not in the gap)
        if (
            localX >= cellStartX &&
            localX < cellStartX + this.cellWidth &&
            localY >= cellStartY &&
            localY < cellStartY + this.cellHeight
        ) {
            return new PhaserMath.Vector2(gridX, gridY);
        }

        return null; // Outside any cell (likely in a gap)
    }



    updateWithMousePosition(mousePosition : PhaserMath.Vector2) : void{
        if(!this.lastMousePosition.equals(mousePosition)){
            this.lastMousePosition = mousePosition
            const mouseX = mousePosition.x;
            const mouseY = mousePosition.y;

            const gridPosition = this.worldToGridLocation(mouseX, mouseY);
            if (gridPosition != null) {
                console.log(`Mouse is over grid cell: (${gridPosition.x}, ${gridPosition.y})`);
                let nearbyCells : PhaserMath.Vector2[] = this.getNearbyCells(gridPosition);
                this.highlightGridCells(nearbyCells);
            }
            else{
                console.log('destroying highlight : ', this.highlightedGraphics.length)
                this.unhighlightGridCells(this.highlightedGraphics);
            }
        }
    }


     /**
     * Highlight the grid cells at the specified indices.
     * @param cellIndex - the indices of cells to highlight
     */
    highlightGridCells(cellIndexes : PhaserMath.Vector2[]) : void{

        for(let i = 0 ; i < cellIndexes.length; i++){
            let currentCord = cellIndexes[i];
            const cellStartX = this.x + currentCord.x * (this.cellWidth + this.gap);
            const cellStartY = this.y + currentCord.y * (this.cellHeight + this.gap);

            const graphics = this.scene.add.graphics();
            graphics.lineStyle(2, 0x000000, 1);
            graphics.strokeRect(cellStartX, cellStartY, this.cellWidth,this.cellHeight);

            this.scene.add.existing(graphics)
            this.highlightedGraphics.push(graphics);
            
        }

    }  

     /**
     * UnHighlight the grid cells at the specified indices.
     * @param highlightedGraphics - the graphics objects to unhighlight
     */
    unhighlightGridCells(highlightedGraphics : Phaser.GameObjects.Graphics[]) : void{
        for(let i = 0; i< highlightedGraphics.length ; i++){
            let graphics = highlightedGraphics[i];
            graphics.destroy();
        }

        // highlightedGraphics.length = 0;
    }

     /**
     * Get the nearby cells around the specified cell index.
     * @param cellIndex - the index of cell to get the nearby cells (current search around 3x3 area)
     * @returns an array of nearby cell indices
     */
    getNearbyCells(cellIndex : PhaserMath.Vector2) : PhaserMath.Vector2[]{
        const nearbyCells: PhaserMath.Vector2[] = [];
        const { x: centerX, y: centerY } = cellIndex;
    
        // Iterate through a 3x3 area centered around (centerX, centerY)
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const cellCol = centerX + i;
                const cellRow = centerY + j;
    
                // Ensure the cell indices are within bounds
                if (
                    cellCol >= 0 && cellCol < this.numberOfCellX &&
                    cellRow >= 0 && cellRow < this.numberOfCellY
                ) {
                    // Add valid nearby cells to the list
                    nearbyCells.push(new PhaserMath.Vector2(cellCol, cellRow));
                }
            }
        }
    
        return nearbyCells;
    }

      /**
     * apply the style to grid box
     * @param gridStyle - Grid style object.
     */
    applyGridStyle(gridStyle: GridStyle): SnappingGrid {

        for (let i = 0; i < this.numberOfCellX; i++) {
            for (let j = 0; j < this.numberOfCellY; j++) {
                const cellX = i * (this.cellWidth + this.gap); // Adjust X position with gap
                const cellY = j * (this.cellHeight + this.gap);
                let image : Phaser.GameObjects.Image = this.scene.add.image(0, 0, gridStyle.cellSocketTexture);
                image.setOrigin(0, 0);
                image.setSize(this.cellWidth, this.cellHeight);
                image.setDisplaySize(this.cellWidth, this.cellHeight);
                image.setPosition(cellX, cellY);
                this.gridMatrix[i][j] = image;
                this.add(image);
            }
        }
        return this;
    }
}
