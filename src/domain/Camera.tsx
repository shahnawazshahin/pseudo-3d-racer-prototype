import { Main } from "../Main";
import { Position } from "./DataTypes";

export class Camera {
    private scene: Main;

    private position: Position;
    private fieldOfViewDegrees: number = 0;
    private fieldOfViewRadians: number = 0;
    private scale: number = 0;
    private depth: number;

    constructor(scene: Main) {
        this.scene = scene;

        this.depth = 2000;

        this.position = { x: 0, y: 800, z: -(this.depth) };

        this.updateFieldOfView(60); // Usually this is 60 degrees for console, and 90 for PC.
    }

    // Get the current position of the camera
    getCurrentPosition(): Position {
        return this.position;
    }

    updatePosition(position: Position, roadLength: number) {
        this.position.x = position.x;
        this.position.z = position.z - this.depth;

        if (this.position.z >= roadLength) { this.position.z -= roadLength; }
        if (this.position.z < 0) { this.position.z += roadLength; }
    }

    // Get the current scale factor from the camera
    getScale(): number {
        // this.scene.text.setText('camscale: ' + this.scale + '\n: ' + Math.tan(this.fieldOfViewRadians / 2));
        return this.scale;
    }

    // Update the field of view value
    updateFieldOfView(degrees: number) {
        this.fieldOfViewDegrees = degrees;
        this.fieldOfViewRadians = this.fieldOfViewDegrees * (Math.PI / 180);
        this.scale = 1 / Math.tan(this.fieldOfViewRadians / 2);
//        this.scale = this.scene.getScreenProperties().centreX / Math.tan(this.fieldOfViewDegrees / 2);
    }
}