import * as THREE from 'three';
import DilSprite from "./DilSprite";
import Zerglite from "./Zerglite.png";
import MovementHelper from '../../helpers/MovementHelper';

import CameraService from '../../services/CameraService';
import SceneService from '../../services/SceneService';
import DMath from '../../helpers/DMath';

export default class Zerg {
    constructor(size = 0.25) {
        this.sprite = new DilSprite(
            Zerglite,
            10,
            1
        );
        this.changeFrameTime = 0.18;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;

        this.zergSpeed = 1;

        this.sprite.sprite3dObject.scale.x = size - 0.05;
        this.sprite.sprite3dObject.scale.y = size;
        this.sprite.sprite3dObject.self = this;

        this.raycaster = new THREE.Raycaster();
    }

    onTick = (timeDelta) => {
        this._atTargetLocation();
        this._moveTowardTargetLocation(timeDelta);
        this._updateTexture(timeDelta);
        this._moveAwayFromOtherZergOnLocation()
    };

    _updateTexture = (timeDelta) => {
        this.timeToNextTextureFrame -= timeDelta;
        if (this.timeToNextTextureFrame > 0) {
            return;
        }
        if (this.movementData && this.movementData.moving === 'left') {
            this.sprite.setTextureInverse(true);
            this.sprite.showTextureIndex(4 - (this.offset++ % 4), 0)
        } else {
            this.sprite.setTextureInverse(false);
            this.sprite.showTextureIndex((this.offset++ % 4), 0)
        }
        this.timeToNextTextureFrame = this.changeFrameTime;
    }

    _moveTowardTargetLocation = (timeDelta) => {
        if (!this.targetLocation) {
            return;
        }
        this.movementData = MovementHelper.moveToward(
            this.sprite.sprite3dObject.position,
            this.targetLocation,
            timeDelta,
            this.zergSpeed
        );
    }

    _moveAwayFromOtherZergOnLocation = () => {
        this.raycaster.setFromCamera(
            this.sprite.sprite3dObject.position,
            CameraService.camera
        )
        this.raycaster.ray.direction.z = 1
        const intersects = this.raycaster.intersectObjects(SceneService.scene.children);
        const others = intersects.filter(thing => thing.object.self !== this && thing.object.self instanceof Zerg);
        if (others.length > 0) {
            const directionToOtherX = this.sprite.sprite3dObject.position.x - others[0].object.self.sprite.sprite3dObject.position.x;
            const directionToOtherY = this.sprite.sprite3dObject.position.y - others[0].object.self.sprite.sprite3dObject.position.y;
            if (Math.abs(directionToOtherX) > this.sprite.sprite3dObject.scale.x) {
                return;
            }
            if (Math.abs(directionToOtherY) > this.sprite.sprite3dObject.scale.y) {
                return;
            }
            this.sprite.sprite3dObject.position.x += directionToOtherX * Math.random() * 0.25;
            this.sprite.sprite3dObject.position.y += directionToOtherY * Math.random() * 0.25;
        }

        if (!this.targetLocation) {
            return;
        }
        
        const diffX = this.targetLocation.x - this.sprite.sprite3dObject.position.x;
        const diffY = this.targetLocation.y - this.sprite.sprite3dObject.position.y;
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
        const currentLocation = this.sprite.sprite3dObject.position;
        if (currentLocation.x === this.targetLocation.x && currentLocation.y === this.targetLocation.y) {
            this.targetLocation = undefined;
        }
    }
}