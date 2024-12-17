import { Main } from "../Main";
import { Camera } from "../domain/Camera";
import { Position, ScreenProperties } from "../domain/DataTypes";
import { Segment } from "../domain/Segment";
import { AbstractSprite } from "./AbstractSprite";

export class Vehicle extends AbstractSprite {    
    // Vehicle movement properties
    currentSpeed: number;
    minSpeed: number;
    topSpeed: number;
    acceleration: number;
    deceleration: number;
    brake: number;

    direction: number;

    constructor(scene: Main, roadLength: number, roadWidth: number) {
        super(scene, 'player');

        // For now, set the current speed to 120
        this.currentSpeed = 120;
        this.minSpeed = 0;
        this.topSpeed = 120;
        this.acceleration = 8;
        this.deceleration = 4;
        this.brake = 12;

        this.direction = 1; // -1 left, 1 right

        let position = this.getCurrentPosition();
        position.x = Math.random() * roadWidth;
        position.z = Math.random() * roadLength * roadLength;
    }

    update(dt: number, factor: number, roadLength: number, roadWidth: number) {
        // Set the new position (using deltatime for consistent movement irrespective of frame rate)
        let position = this.getCurrentPosition();

        if (position.x > roadWidth) {
            this.direction = -1;
        }

        if (position.x < -(roadWidth)) {
            this.direction = 1;
        }

        position.x += dt * this.direction * this.currentSpeed;
        position.z += this.currentSpeed * dt * factor;

        if (position.z >= roadLength) { position.z -= roadLength; }
        if (position.z < 0) { position.z += roadLength; }
    }

    projectVehicle(camera: Camera, segment: Segment, screenProperties: ScreenProperties, roadLength: number) {
        let currentPosition: Position = this.getCurrentPosition();
        let cameraPosition: Position = camera.getCurrentPosition();

        let offsetX: number = currentPosition.x - cameraPosition.x + segment.getScreen().turnRate;
        let offsetY: number = currentPosition.y - cameraPosition.y + segment.getScreen().climbRate;
        let offsetZ: number = currentPosition.z - cameraPosition.z;

        if (offsetZ >= roadLength) { offsetZ -= roadLength; }
        if (offsetZ < 0) { offsetZ += roadLength; }

        let scale: number = camera.getScale() / offsetZ;

        let projectedPosition: Position = {
            x: (1 + (scale * offsetX)) * screenProperties.centreX,
            y: (1 - (scale * offsetY)) * screenProperties.centreY + 5,
            z: offsetZ
        }

        this.updateScale(Math.min(scale * projectedPosition.y, 1));

        this.updateProjectedPosition(projectedPosition);
    }
}