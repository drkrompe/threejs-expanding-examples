import * as THREE from 'three';
import Unit from "./Unit";
import HumanTexture from './Human.png';
import SceneService from '../../../services/SceneService';
import CameraService from '../../../services/CameraService';
import DMath from '../../../helpers/DMath';
import MovementHelper from '../../../helpers/MovementHelper';

export default class Human extends Unit {
    constructor(size = 0.15) {
        super(HumanTexture, 3, 1, 'human', true);
        this.changeFrameTime = 0.25;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.speed = 0.33;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;

        this.raycaster = new THREE.Raycaster();
    }

    onTick = (timeDelta) => {
        this._atTargetLocation();
        this._moveTowardTargetLocation(timeDelta);
        this._updateTexture(timeDelta);
        this._moveAwayFromOtherZergOnLocation();
    }

    _updateTexture = (timeDelta) => {
        this.timeToNextTextureFrame -= timeDelta;
        if (this.timeToNextTextureFrame > 0) {
            return;
        }
        if (this.movementData && this.movementData.moving === 'left') {
            this.dilsprite.setTextureInverse(false);
            this.dilsprite.showTextureIndex((this.offset++ % 3), 0)
        } else {
            this.dilsprite.setTextureInverse(true);
            this.dilsprite.showTextureIndex(3 - (this.offset++ % 3), 0)
        }
        this.timeToNextTextureFrame = this.changeFrameTime;
    }

    _moveTowardTargetLocation = (timeDelta) => {
        if (!this.targetLocation) {
            return;
        }
        this.movementData = MovementHelper.moveToward(
            this.dilsprite.sprite3dObject.position,
            this.targetLocation,
            timeDelta,
            this.speed
        );
    }

    _moveAwayFromOtherZergOnLocation = () => {
        this.raycaster.setFromCamera(
            this.dilsprite.sprite3dObject.position,
            CameraService.camera
        )
        this.raycaster.ray.direction.z = 1
        const intersects = this.raycaster.intersectObjects(SceneService.scene.children);
        const others = intersects.filter(thing => thing.object.self !== this && thing.object.self instanceof Unit);
        if (others.length > 0) {
            const directionToOtherX = this.dilsprite.sprite3dObject.position.x - others[0].object.self.dilsprite.sprite3dObject.position.x;
            const directionToOtherY = this.dilsprite.sprite3dObject.position.y - others[0].object.self.dilsprite.sprite3dObject.position.y;
            if (Math.abs(directionToOtherX) > this.dilsprite.sprite3dObject.scale.x) {
                return;
            }
            if (Math.abs(directionToOtherY) > this.dilsprite.sprite3dObject.scale.y) {
                return;
            }
            this.dilsprite.sprite3dObject.position.x += directionToOtherX * Math.random() * 0.25;
            this.dilsprite.sprite3dObject.position.y += directionToOtherY * Math.random() * 0.25;
        }

        if (!this.targetLocation) {
            return;
        }
        const diffX = this.targetLocation.x - this.dilsprite.sprite3dObject.position.x;
        const diffY = this.targetLocation.y - this.dilsprite.sprite3dObject.position.y;
        const distanceToTarget = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))

        // If Colliding near target location... update self as being at target location
        if (others.length > 0 && distanceToTarget < 0.1) {
            this.targetLocation = undefined
        }
    }

    _atTargetLocation = () => {
        if (!this.targetLocation) {
            return;
        }
        const currentLocation = this.dilsprite.sprite3dObject.position;
        if (currentLocation.x === this.targetLocation.x && currentLocation.y === this.targetLocation.y) {
            this.targetLocation = undefined;
        }
    }
}