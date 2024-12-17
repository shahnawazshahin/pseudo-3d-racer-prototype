import { Main } from "../Main";
import { Position } from "../domain/DataTypes";

type Sprite = Phaser.GameObjects.Sprite;

export abstract class AbstractSprite {
    protected scene: Main;

    private texture: string;
    private position: Position;
    private projectedPosition: Position;
    private scale: number;
    private sprite: Sprite;

    constructor(scene: Main, texture: string) {
        this.scene = scene;

        this.texture = texture;
        this.position = { x: 0, y: 0, z: 0 };
        this.projectedPosition = { x: 0, y: 0, z: 0 };
        this.scale = 1;

        this.sprite = scene.add.sprite(0, 0, texture);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(3);
        this.updateProjectedPosition(this.position);
        this.updateScale(this.scale);
    }

    getCurrentPosition(): Position {
        return this.position;
    }

    updateProjectedPosition(position: Position) {
        this.projectedPosition = position;

        this.sprite.setPosition(this.projectedPosition.x, this.projectedPosition.y);
    }

    updateScale(scale: number) {
        this.scale = scale;

        this.sprite.setScale(this.scale);
    }

    getSprite(): Sprite {
        return this.sprite;
    }
}