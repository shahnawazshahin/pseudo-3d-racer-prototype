import { Camera } from "./Camera";
import { SegmentWorld, SegmentScreen, ScreenProperties, Colours, Position, Obstacle } from "./DataTypes";

export class Segment {
    private index: number = 0;
    private world: SegmentWorld = { x: 0, y: 0, z: 0, curve: 0, climb: 0, lanes: 0 };
    private screen: SegmentScreen = { x: 0, y: 0, w: 0, scale: 0, turnRate: 0, climbRate: 0 };
    private colours: Colours = { grass: 0x000000, rumble: 0x000000, road: 0x000000, lane: 0x000000 };
    private obstacle: Obstacle = { type: null, side: 0, position: 0, x: 0, y: 0, scale: 0 };

    constructor(index: number) {
        this.index = index;
    }

    getWorld(): SegmentWorld {
        return this.world;
    }

    updateWorld(segmentLength: number, curve: number, climb: number, lanes: number) {
        this.world.z = segmentLength * this.index;
        this.world.curve = curve;
        this.world.climb = climb;
        this.world.lanes = lanes;
    }

    projectToScreen(camera: Camera, screenProperties: ScreenProperties, roadWidth: number, turnX: number, climbY: number, zOffset: number) {
        let cameraPosition: Position = camera.getCurrentPosition();

        let cameraX: number = this.world.x - cameraPosition.x + turnX;
        let cameraY: number = this.world.y - cameraPosition.y + climbY;
        let cameraZ: number = this.world.z - cameraPosition.z + zOffset;

        this.screen.scale = camera.getScale() / cameraZ;

        this.screen.x = (1 + (this.screen.scale * cameraX)) * screenProperties.centreX;
        this.screen.y = (1 - (this.screen.scale * cameraY)) * screenProperties.centreY;
        // this.screen.y = ((cameraY * this.screen.scale) / cameraZ) + screenProperties.centreY;
        // this.screen.x = ((cameraX * this.screen.scale) / cameraZ) + screenProperties.centreX;
        this.screen.w = roadWidth * this.screen.scale * screenProperties.centreX;
        this.screen.turnRate = turnX;
        this.screen.climbRate = climbY;

        this.obstacle.x = this.screen.x + (this.screen.w * this.obstacle.side * this.obstacle.position);
        this.obstacle.y = this.screen.y;
        this.obstacle.scale = this.screen.scale * cameraPosition.y;
    }

    getScreen(): SegmentScreen {
        return this.screen;
    }

    getColours(): Colours {
        return this.colours
    }

    updateColours(grass: number, rumble: number, road: number, lane: number) {
        this.colours.grass = grass;
        this.colours.rumble = rumble;
        this.colours.road = road;
        this.colours.lane = lane;
    }

    getObstacle(): Obstacle {
        return this.obstacle;
    }

    setObstacle(obstacleType: string, obstacleSide: number, obstaclePosition: number) {
        this.obstacle.type = obstacleType;
        this.obstacle.side = obstacleSide;
        this.obstacle.position = obstaclePosition;
    }
}