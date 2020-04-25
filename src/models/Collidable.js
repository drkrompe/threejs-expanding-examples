import * as THREE from 'three';
import Tickable from "./Tickable";
import Dilsprite from "./Dilsprite";
import CameraService from "../services/CameraService";
import SceneService from "../services/SceneService";

export default class Collidable extends Tickable {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 1, y: 1 },
        selectedIndicatorOffset = { x: 0, y: 0 }
    ) {
        super(
            position2d,
            dilsprite,
            selectable,
            selectedIndicatorScale,
            selectedIndicatorOffset
        );
    }

    onTick(timeDelta) {
        super.onTick(timeDelta);
        this._correctPositionForCollision();
    }

    _correctPositionForCollision = () => {
        if (!this.raycaster) {
            this.raycaster = new THREE.Raycaster();
        }
        const unitPositionCameraRelativeX = this.dilsprite.position.x - CameraService.camera.position.x;
        const unitPositionCameraRelativeY = this.dilsprite.position.y - CameraService.camera.position.y;
        this.raycaster.setFromCamera(
            { x: unitPositionCameraRelativeX * 0.5, y: unitPositionCameraRelativeY },
            CameraService.camera
        );

        this.raycaster.ray.direction.z = 1
        this.raycaster
            .intersectObjects(SceneService.scene.children)
            .filter(sceneThing => sceneThing.object.self !== this && sceneThing.object.self instanceof Collidable)
            .forEach(collidableSceneObj => {
                // Design goal
                // Closer we are to other the more we push away
                // if we are to right of other
                const otherCollidable = collidableSceneObj.object.self;
                const directionX = otherCollidable.dilsprite.position.x - this.dilsprite.position.x;
                const directionY = otherCollidable.dilsprite.position.y - this.dilsprite.position.y;
                // x => 0 output => 1
                // x => 1 output => 0
                // the closer the center the harder the object is pushed away from that center
                if (Math.abs(directionX) < this.dilsprite.scale.x) {
                    const normalizedX = 1 - Math.abs(directionX) / (this.dilsprite.scale.x * 0.5);
                    this.dilsprite.position.x -= directionX * normalizedX * 0.5;
                }
                if (Math.abs(directionY) < this.dilsprite.scale.y) {
                    const normalizedY = 1 - Math.abs(directionY) / (this.dilsprite.scale.y * 0.5);
                    this.dilsprite.position.y -= directionY * normalizedY * 0.5
                }

                // Added Effect FEAST SWARM EFFECT HAPPENS
                const threshold = 0.01
                if (Math.abs(directionX) < threshold && Math.abs(directionY) < threshold) {
                    const randSpread = 0.07
                    this.dilsprite.position.x += (Math.random() * randSpread) - (randSpread * 0.5)
                    this.dilsprite.position.y += (Math.random() * randSpread) - (randSpread * 0.5)
                }
            });

    }
}