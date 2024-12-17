import { Main } from "../Main";
import { Camera } from "../domain/Camera";
import { OBSTACLE, ROAD } from "../domain/Constants";
import { Player } from "../sprites/Player";
import { Segments } from "../domain/Segments";
import { Vehicle } from "../sprites/Vehicle";
import { Background } from "../sprites/Background";

type Graphics = Phaser.GameObjects.Graphics;

export class Track {
    private scene: Main;

    private graphics: Graphics;

    private segments: Segments;
    private camera: Camera;
    private background: Background;
    private player: Player;
    private vehicles: Array<Vehicle>;
    private rivals: any;

    constructor(scene: Main) {
        this.scene = scene;

        this.segments = new Segments(this.scene);
        this.graphics = this.scene.getGraphics();
        this.camera = new Camera(this.scene);
        this.background = new Background(this.scene);
        this.player = new Player(this.scene);

        this.vehicles = [];

        for (let item: number = 0; item < 10; item++) {
            this.vehicles.push(new Vehicle(this.scene, this.segments.getRoadLength(), this.segments.getRoadWidth()));
        }
    }

    create() {
        this.generateTrack();
    }

    update(dt: number, factor: number) {
        // Clear the screen
        this.graphics.clear();

        // Find out where the player is located
        let playerPosition = this.player.getCurrentPosition();

        // Get the current segment that the player is positioned on
        let playerSegment = this.segments.getSegment(playerPosition);

        // Update player position
        this.player.update(dt, factor, this.segments.getRoadLength(), playerSegment);

        // Using the player's current position, get the current position of the camera
        this.camera.updatePosition(playerPosition, this.segments.getRoadLength());

        // Render the road segments
        this.segments.renderSegments(this.graphics, this.camera, this.scene.getScreenProperties());

        // TODO: You only need one segment to work with. Use the remaining zPlayerPosition
        // as the percentage.
        // this.player.projectPlayer(playerCurrentSegments[0]);
        this.player.projectPlayer(this.camera, playerSegment, this.scene.getScreenProperties(), this.segments.getRoadLength());


        // Do the same for other vehicles
        for (let vehicleIndex = 0; vehicleIndex < this.vehicles.length; vehicleIndex++) {
            this.vehicles[vehicleIndex].update(dt, factor, this.segments.getRoadLength(), this.segments.getRoadWidth());
            let vehicleSegment = this.segments.getSegment(this.vehicles[vehicleIndex].getCurrentPosition());
            this.vehicles[vehicleIndex].projectVehicle(this.camera, vehicleSegment, this.scene.getScreenProperties(), this.segments.getRoadLength());
        }
    }

    // Generate a track by adding road segments
    private generateTrack() {
        this.addRoad(ROAD.LENGTH.SINGLE, ROAD.CURVE.NONE, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.FAR);
        this.addRoad(ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.LONG, ROAD.CURVE.EASY_LEFT, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.MIDDLE);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.ACCEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.DECEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.DECEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.ACCEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.DECEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.ACCEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.DECEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.ACCEND, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.LONG, ROAD.CURVE.HARD_RIGHT, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM_LEFT, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
        this.addRoad(ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.CLIMB.NONE, ROAD.LANES.TRIPPLE, OBSTACLE.TYPE.LAMP_POST, OBSTACLE.SIDE.LEFT, OBSTACLE.POSITION.NEAR);
    }

    // Add a road segment to the track
    private addRoad(roadLength: number, curve: number, climb: number, lanes: number, obstacleType: string, obstacleSide: number, obstaclePosition: number) {
        for (let index = 0; index < roadLength; index++) {
            this.segments.addSegment(curve, climb, lanes, obstacleType, obstacleSide, obstaclePosition);
        }
    }
}