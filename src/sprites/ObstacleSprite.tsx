import { Camera } from "../domain/Camera";
import { OBSTACLE } from "../domain/Constants";
import { Obstacle, Position, ScreenProperties } from "../domain/DataTypes";
import { Segment } from "../domain/Segment";
import { AbstractSprite } from "./AbstractSprite";

export class ObstacleSprite extends AbstractSprite {
    renderObstacle(obstacle: Obstacle) {
        if (obstacle.side !== OBSTACLE.SIDE.NONE) {
            let position = this.getCurrentPosition();

            position.x = obstacle.x;
            position.y = obstacle.y;

            this.updateProjectedPosition(position);
            this.updateScale(obstacle.scale);
        }
    }

    projectObstacle(camera: Camera, segment: Segment, screenProperties: ScreenProperties) {
        let position: Position = this.getCurrentPosition();
        let cameraPosition: Position = camera.getCurrentPosition();

        position.x = segment.getScreen().x + (segment.getScreen().w * segment.getObstacle().side * segment.getObstacle().position);
        segment.getObstacle().y = segment.getScreen().y;
        segment.getObstacle().scale = segment.getScreen().scale * cameraPosition.y;
    }
}