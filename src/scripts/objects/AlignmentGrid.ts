import { Math } from "phaser";


const Vector2 = Math.Vector2;

export default class AlignmentGrid extends Phaser.GameObjects.Grid{

    constructor(scene : Phaser.Scene,startPosition : Math.Vector2,gridDimension : Math.Vector2,cellDimesion : Math.Vector2,fillColor?: number,fillAlpha?: number,outlineFillColor?: number,outlineFillAlpha?: number){
        
        const centerX = scene.cameras.main.width / 2;
        const centerY = scene.cameras.main.height / 2;
        
        super(
            scene, 
            centerX,
            centerY, 
            gridDimension.x, 
            gridDimension.y,
            cellDimesion.x,
            cellDimesion.y, 
            fillColor, 
            fillAlpha, 
            outlineFillColor, 
            outlineFillAlpha
        );
        
         // Add grid to the scene
        scene.add.existing(this);

        const maxVisibleWidth = scene.cameras.main.width;
        const maxVisibleHeight = scene.cameras.main.height;

        // Debugging: Make sure the origin is correct
        // this.setOrigin(0.5, 0.5);
    }

    public getNumberOfCells() : Math.Vector2{
        return new Math.Vector2(this.width/this.cellWidth, this.height/this.cellHeight);
    }

}