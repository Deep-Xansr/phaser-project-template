


export default class Tile extends Phaser.GameObjects.Image{
    private isEmpty : boolean;

    constructor(scene : Phaser.Scene,x : number,y : number,texture : string,isEmpty : boolean){
        super(scene,x,y,texture);
        this.isEmpty = isEmpty;
        scene.add.existing(this);
    }

    setEmpty(isEmpty : boolean){
        this.isEmpty = isEmpty;
    }
}