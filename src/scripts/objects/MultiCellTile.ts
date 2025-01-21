import { GameObjects, Math as PhaserMath } from "phaser";
import { MutiTileType } from "../type/Enums";

// Helper function to get tile positions based on the type
function getTilePositionFromType(tileType: MutiTileType): PhaserMath.Vector2[] {
  switch (tileType) {
    case MutiTileType.Square:
      return [
        new PhaserMath.Vector2(0, 0),
        new PhaserMath.Vector2(1, 0),
        new PhaserMath.Vector2(0, 1),
        new PhaserMath.Vector2(1, 1),
      ];
    case MutiTileType.Line:
      return [
        new PhaserMath.Vector2(0, 0),
        new PhaserMath.Vector2(1, 0),
        new PhaserMath.Vector2(2, 0),
        new PhaserMath.Vector2(3, 0),
      ];
    case MutiTileType.LShape:
      return [
        new PhaserMath.Vector2(0, 0),
        new PhaserMath.Vector2(1, 0),
        new PhaserMath.Vector2(2, 0),
        new PhaserMath.Vector2(0, 1),
      ];
    case MutiTileType.TShape:
      return [
        new PhaserMath.Vector2(0, 0),
        new PhaserMath.Vector2(1, 0),
        new PhaserMath.Vector2(2, 0),
        new PhaserMath.Vector2(1, 1),
      ];
    default:
      return [];
  }
}

export default class MultiCellTile extends GameObjects.Container {
  tiles: GameObjects.Image[] = [];
  tileType: MutiTileType;

  constructor(scene: Phaser.Scene, x: number, y: number, tileType: MutiTileType,textureSize : Phaser.Math.Vector2) {
    super(scene, x, y); // Initialize the container at position (x, y)
    this.tileType = tileType;

    // Add this container to the scene
    scene.add.existing(this);

    // Get positions for the tiles
    const tilePositions = getTilePositionFromType(tileType);

    // Create and add tiles to the container

    tilePositions.forEach((position) => {
      const tileX = position.x * textureSize.x; // Use textureSize for dynamic sizing
      const tileY = position.y * textureSize.y;
      const tile = new GameObjects.Image(scene, tileX, tileY, 'tile');
      tile.setOrigin(0, 0);

      // Set the display size of the tile (if necessary)
      tile.setDisplaySize(textureSize.x, textureSize.y);
    
      // Add the tile to the container
      this.add(tile);
      this.tiles.push(tile);
    });

    let size = this.getTotalSize(textureSize);
    console.log("MutliCellTile size : ",size);
    this.setSize(size.x,size.y);

    // Create a Phaser Graphics object
    const highlight = this.scene.add.graphics();
    // Draw a rectangle over the cell
    highlight.lineStyle(2, 0xff0000, 1); // Set line color and thickness
    highlight.strokeRect(this.x, this.y, this.displayWidth, this.displayHeight); // Draw the rectangle

  }

  // Example: Set a new texture for all tiles
  setTileTexture(textureKey: string): void {
    this.tiles.forEach((tile) => {
      tile.setTexture(textureKey);
    });
  }

  // Example: Highlight all tiles by changing their tint
  highlightTiles(color: number): void {
    this.tiles.forEach((tile) => {
      tile.setTint(color);
    });
  }

  // Calculate the total size of the combined texture (bounding box)
  getTotalSize(textureSize: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    // Get positions for the tiles
    const tilePositions = getTilePositionFromType(this.tileType);

    // Initialize min and max values
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    // Calculate the min/max positions
    tilePositions.forEach((position) => {
      const tileX = position.x * textureSize.x;
      const tileY = position.y * textureSize.y;

      minX = Math.min(minX, tileX);
      maxX = Math.max(maxX, tileX);
      minY = Math.min(minY, tileY);
      maxY = Math.max(maxY, tileY);
    });

    // The total size is the width and height of the bounding box
    const width = maxX - minX + textureSize.x;  // Add the tile size to account for the bounds
    const height = maxY - minY + textureSize.y;

    return new Phaser.Math.Vector2(width, height);
  }

  setInteractive(hitArea?: Phaser.Types.Input.InputConfiguration | any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean): this {
    // Log or add custom behavior
    console.log('Setting MultiCellTile container as interactive');

    // Call the base class method to ensure the container is interactive
    super.setInteractive(hitArea, callback, dropZone);

    // If you want to make sure the child tiles are interactive as well, loop through them
    this.tiles.forEach(tile => {
      tile.setInteractive(hitArea, callback, dropZone);
    });

    return this;  // Return the container to allow chaining
  }

}
