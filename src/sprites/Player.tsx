import { Main } from "../Main";
import { Camera } from "../domain/Camera";
import { Position, ScreenProperties } from "../domain/DataTypes";
import { Segment } from "../domain/Segment";
import { AbstractSprite } from "./AbstractSprite";

export class Player extends AbstractSprite {    
    // Player movement properties
    currentSpeed: number;
    minSpeed: number;
    topSpeed: number;
    acceleration: number;
    deceleration: number;
    brake: number;

    // Player turning movement properties
    turningSpeed: number;
    turningRate: number;

    driftSpeed: number;
    driftRate: number;

    // Player control properties
    keyCursors: any;

    constructor(scene: Main) {
        super(scene, 'player');

        this.currentSpeed = 0;
        this.minSpeed = 0;
        this.topSpeed = 200;
        this.acceleration = 2;
        this.deceleration = 1;
        this.brake = 4;

        this.turningSpeed = 0;
        this.turningRate = 16;

        this.driftSpeed = 0;
        this.driftRate = 3;

        this.keyCursors = scene.input.keyboard?.createCursorKeys();
    }

    update(dt: number, factor: number, roadLength: number, segment: Segment) {
        // Calculate the current speed based on keys pressed
        if (this.keyCursors.up.isDown) {
            if (this.currentSpeed <= this.topSpeed) {
                this.currentSpeed += this.acceleration;
            }
        } else {
            if (this.currentSpeed >= this.minSpeed) {
                this.currentSpeed -= (this.keyCursors.down.isDown ? this.brake : this.deceleration);
            }
        }

        // Make sure the player doesn't go backwards
        this.currentSpeed = Math.max(this.currentSpeed, this.minSpeed);

        let percentage: number = this.currentSpeed / this.topSpeed;

        // Calculate the turning speed based on keys pressed (only when moving forward)
        this.turningSpeed = Math.pow(percentage, 2) * this.turningRate * dt * factor;

        // Set the new position (using deltatime for consistent movement irrespective of frame rate)
        let position = this.getCurrentPosition();

        if (this.keyCursors.left.isDown) {
            position.x -= this.turningSpeed;
        }
        
        if (this.keyCursors.right.isDown) {
            position.x += this.turningSpeed;
        }

        this.driftSpeed = Math.pow(percentage, 3) * segment.getWorld().curve * this.driftRate * dt * factor;
        position.x -= this.driftSpeed;
        position.z += this.currentSpeed * dt * factor;

        if (position.z >= roadLength) { position.z -= roadLength; }
        if (position.z < 0) { position.z += roadLength; }
    }

    projectPlayer(camera: Camera, segment: Segment, screenProperties: ScreenProperties, roadLength: number) {
        let currentPosition: Position = this.getCurrentPosition();
        let cameraPosition: Position = camera.getCurrentPosition();

        let projectedX: number = currentPosition.x - cameraPosition.x + segment.getScreen().turnRate;
        let projectedY: number = currentPosition.y - cameraPosition.y + segment.getScreen().climbRate;
        let projectedZ: number = currentPosition.z - cameraPosition.z;

        // this.scene.text.appendText('\ncurrentPosition: ' + JSON.stringify(currentPosition));

        if (projectedZ >= roadLength) { projectedZ -= roadLength; }
        if (projectedZ < 0) { projectedZ += roadLength; }

        let scale: number = camera.getScale() / projectedZ;

        let projectedPosition: Position = {
            x: (1 + (scale * projectedX)) * screenProperties.centreX,
            y: (1 - (scale * projectedY)) * screenProperties.centreY + 5,
            z: projectedZ
        }

        this.updateScale(Math.min(scale * projectedPosition.y, 1));

        this.updateProjectedPosition(projectedPosition);

        this.scene.text.appendText('nsegment: ' + JSON.stringify(segment.getWorld()));
        this.scene.text.appendText('nsegment: ' + JSON.stringify(segment.getScreen()));
    }
    /*
    projectPlayer(currentSegment: Segment) {
        let position: Position = this.getCurrentPosition();
        let segmentScreen: SegmentScreen = currentSegment.getScreen();

        position.x = segmentScreen.x;
        position.y = segmentScreen.y;
        this.updateScale(Math.min(segmentScreen.scale * position.y, 1));

        this.updateCurrentPosition(position);
    }
    */
}