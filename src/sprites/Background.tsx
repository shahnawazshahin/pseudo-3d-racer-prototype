import { Main } from "../Main";

export class Background {
    scene: Main;

    background: Phaser.GameObjects.TileSprite;

    constructor(scene: Main) {
        this.scene = scene;

        this.background = this.scene.add.tileSprite(0, 0, this.scene.getScreenProperties().width, this.scene.getScreenProperties().height, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(1);
    }
}