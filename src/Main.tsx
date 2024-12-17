import Phaser from "phaser";
import { ScreenProperties } from "./domain/DataTypes";
import { Track } from "./tracks/Track";

type Graphics = Phaser.GameObjects.Graphics;

export class Main extends Phaser.Scene {
    private graphics!: Graphics;
    private screenProperties: ScreenProperties = { centreX: 0, centreY: 0, height: 0, width: 0 };
    private track!: Track;

    private dt: number = 1;
    private factor: number = 60; // To achieve an equivalent 60 fps pace

    // Used for debugging
    text! : Phaser.GameObjects.Text;

    constructor() {
        super('Main');
    }

    preload() {
        this.load.setBaseURL('http://localhost:3000');

        this.load.image('background', 'background.png');
        this.load.image('tree', 'tree.png');
        this.load.image('lamppost', 'lamppost.png');
        this.load.image('player', 'car.png');
    }

    create() {
        // Add the graphics to the scene that will be used for rendering
        this.graphics = this.add.graphics();
        this.graphics.setDepth(2);

        // Set the screen properties
        this.screenProperties.height = this.game.config.height as number;
        this.screenProperties.width = this.game.config.width as number;
        this.screenProperties.centreX = this.screenProperties.width / 2;
        this.screenProperties.centreY = this.screenProperties.height / 2;

        this.text = this.add.text(10, 10, '');
        this.text.setDepth(4);

        this.track = new Track(this);
        this.track.create();
    }

    update(time: any, delta: any) {
        this.dt = Math.min(1, (delta / 1000));

        this.text.setText('fps: ' + (1 / this.dt));

        this.track.update(this.dt, this.factor);
    }

    // Return the screen properties
    getScreenProperties(): ScreenProperties {
        return this.screenProperties;
    }

    // Return the current graphics object for rendering
    getGraphics(): Graphics {
        return this.graphics;
    }
}