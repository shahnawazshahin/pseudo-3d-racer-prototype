import { Main } from "../Main";
import { ObstacleSprite } from "../sprites/ObstacleSprite";
import { Camera } from "./Camera";
import { COLOUR, SEGMENT, ROAD, OBSTACLE } from "./Constants";
import { Position, ScreenProperties } from "./DataTypes";
import { Segment } from "./Segment";

type Graphics = Phaser.GameObjects.Graphics;

export class Segments {
    private scene: Main;

    private segments: Array<Segment> = [];
    private segmentLength: number = SEGMENT.LENGTH;
    private visibleSegments: number = SEGMENT.VISIBILITY.LONG;
    private roadWidth: number = ROAD.WIDTH.MEDIUM;

    private obstacleGroup: Phaser.GameObjects.Group;

    constructor(scene: Main) {
        this.scene = scene;
        this.obstacleGroup = scene.add.group();
    }

    renderSegments(graphics: Graphics, camera: Camera, screenProperties: ScreenProperties) {
        this.obstacleGroup.clear(true, true);

        let position: Position = camera.getCurrentPosition();

        if (position.z >= this.getRoadLength()) { position.z -= this.getRoadLength(); }
        if (position.z < 0) { position.z += this.getRoadLength(); }

        let startPos: number = Math.floor((position.z / this.segmentLength) % this.segments.length);
        let endPos: number = startPos + this.visibleSegments;

        let maxy: number = screenProperties.height;
        let zOffset: number = 0;

        let percentage: number = (position.z % this.segmentLength) / this.segmentLength;

        let dTurnX: number = this.segments[startPos + 1].getWorld().curve * percentage * -1;
        let turnX: number = 0;

        let dClimbY: number = this.segments[startPos + 1].getWorld().climb * percentage * -1;
        let climbY: number = 0;

        for (let index: number = startPos; index < endPos; index++) {
            let nextIndex: number = (index + 1) % this.segments.length;
            let nextSegment: Segment = this.segments[nextIndex];

            zOffset = (nextIndex < startPos ? this.getRoadLength() : 0); // -(index >= (this.segments.length - 1) ? this.getRoadLength() : 0); 

            nextSegment.projectToScreen(camera, screenProperties, this.roadWidth, turnX, climbY, zOffset);

            turnX += dTurnX;
            dTurnX += nextSegment.getWorld().curve;

            climbY += dClimbY;
            dClimbY += nextSegment.getWorld().climb;

            if ((index > 0) && (nextSegment.getScreen().y <= maxy)) {
                let lastIndex = index % this.segments.length;
                let lastSegment = this.segments[lastIndex];

                // Render grass
                graphics.fillStyle(nextSegment.getColours().grass, 1);

                graphics.beginPath();

                graphics.moveTo((0), nextSegment.getScreen().y);
                graphics.lineTo((screenProperties.width), nextSegment.getScreen().y);
                graphics.lineTo((screenProperties.width), lastSegment.getScreen().y);
                graphics.lineTo((0), lastSegment.getScreen().y);

                graphics.closePath();
                graphics.fill();

                // Render road
                graphics.fillStyle(nextSegment.getColours().road, 1);

                graphics.beginPath();

                graphics.moveTo((nextSegment.getScreen().x - nextSegment.getScreen().w), nextSegment.getScreen().y);
                graphics.lineTo((nextSegment.getScreen().x + nextSegment.getScreen().w), nextSegment.getScreen().y);
                graphics.lineTo((lastSegment.getScreen().x + lastSegment.getScreen().w), lastSegment.getScreen().y);
                graphics.lineTo((lastSegment.getScreen().x - lastSegment.getScreen().w), lastSegment.getScreen().y);

                graphics.closePath();
                graphics.fill();

                // Render lanes
                let lanes: number = nextSegment.getWorld().lanes;
                let lastW: number = lastSegment.getScreen().w / lanes;
                let nextW: number = nextSegment.getScreen().w / lanes;

                for (let lane = 0; lane <= lanes; lane++) {
                    let lastX: number = (lastSegment.getScreen().x - lastSegment.getScreen().w) + ((lastW * 2) * lane);
                    let nextX: number = (nextSegment.getScreen().x - nextSegment.getScreen().w) + ((nextW * 2) * lane);

                    graphics.fillStyle(nextSegment.getColours().lane, 1);

                    graphics.beginPath();
    
                    graphics.moveTo((nextX - (nextSegment.getScreen().w / 36)), nextSegment.getScreen().y);
                    graphics.lineTo((nextX + (nextSegment.getScreen().w / 36)), nextSegment.getScreen().y);
                    graphics.lineTo((lastX + (lastSegment.getScreen().w / 36)), lastSegment.getScreen().y);
                    graphics.lineTo((lastX - (lastSegment.getScreen().w / 36)), lastSegment.getScreen().y);
    
                    graphics.closePath();
                    graphics.fill();
                }

                let obstacleSprite = new ObstacleSprite(this.scene, 'lamppost');
                obstacleSprite.renderObstacle(nextSegment.getObstacle());
                this.obstacleGroup.add(obstacleSprite.getSprite());

                maxy = nextSegment.getScreen().y;
            }
        }
    }

    getSegment(position: Position): Segment {
        let indexPosition = Math.floor((position.z / this.segmentLength) % this.segments.length);

        return this.segments[indexPosition];
    }

    addSegment(curve: number, climb: number, lanes: number, obstacleType: string, obstacleSide: number, obstaclePosition: number) {
        let nextIndex: number = this.segments.length;

        let segment: Segment = new Segment(nextIndex);

        segment.updateWorld(this.segmentLength, curve, climb, lanes);

        if (nextIndex % 2 === 0) {
            segment.updateColours(COLOUR.GRASS.DARK, COLOUR.RUMBLE.DARK, COLOUR.ROAD.DARK, COLOUR.LANE.DASH);
        } else {
            if (nextIndex === 1) {
                segment.updateColours(COLOUR.GRASS.LIGHT, COLOUR.RUMBLE.LIGHT, COLOUR.ROAD.START, COLOUR.LANE.DASH);
            } else {
                segment.updateColours(COLOUR.GRASS.LIGHT, COLOUR.RUMBLE.LIGHT, COLOUR.ROAD.LIGHT, COLOUR.LANE.GAP);
            }        
        }

        if ((obstacleSide !== OBSTACLE.SIDE.NONE) && (nextIndex % 10 === 0)) {
            segment.setObstacle(obstacleType, obstacleSide, obstaclePosition);
        }

        this.segments.push(segment);
    }

    getRoadLength(): number {
        return (this.segments.length - 1) * this.segmentLength;
    }

    getRoadWidth(): number {
        return this.roadWidth;
    }
}