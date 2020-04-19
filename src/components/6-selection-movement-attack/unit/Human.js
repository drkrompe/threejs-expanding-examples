import * as THREE from 'three';
import Unit from "./Unit";
import HumanTexture from './Human.png';
import SceneService from '../../../services/SceneService';
import CameraService from '../../../services/CameraService';
import DMath from '../../../helpers/DMath';
import MovementHelper from '../../../helpers/MovementHelper';

export default class Human extends Unit {
    constructor(size = 0.15) {
        super(HumanTexture, 3, 1, 'human', true, -0.45);
        this.changeFrameTime = 0.25;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.speed = 0.33;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;

        this.raycaster = new THREE.Raycaster();
        this.divergeFactorStart = 0.005;
        this.divergeFactorMax = 0.05
        this.divergeFactor = this.divergeFactorStart;
        this.life = 100
    }

    onTick = (timeDelta) => {
        this._atTargetLocation();
        this._moveTowardTargetLocation(timeDelta);
        this._updateTexture(timeDelta);
        this._moveAwayFromOtherZergOnLocation();
        this._lifeLessThan0Die();
    }

    _lifeLessThan0Die = () => {
        if (this.life < 0) {
            SceneService.scene.remove(this.dilsprite.sprite3dObject)
        }
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

        // Design goal
        // Closer we are to other the more we push away
        // if we are to right of other

        others.forEach((rendUnit) => {
            const otherUnit = rendUnit.object.self;
            const directionX = otherUnit.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
            const directionY = otherUnit.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;

            // const divergeFactor = 0.08
            const divergeFactor = this.divergeFactor
            if (Math.abs(directionX) > 0) {
                const xOverlap = directionX
                this.dilsprite.sprite3dObject.position.x -= (xOverlap * divergeFactor);
            }
            if (Math.abs(directionY) > 0) {
                const yOverlap = directionY
                this.dilsprite.sprite3dObject.position.y -= (yOverlap * divergeFactor);
            }
            if (directionX === directionY && directionX === 0) {
                const randSpread = 0.01
                this.dilsprite.sprite3dObject.position.x += (Math.random() * randSpread) - (randSpread * 0.5)
                this.dilsprite.sprite3dObject.position.y += (Math.random() * randSpread) - (randSpread * 0.5)
            }
        });

        if (others.length > 0) {
            if (this.divergeFactor < this.divergeFactorMax) {
                this.divergeFactor += this.divergeFactorStart;
            }
            // this.divergeFactor *= 1.05;
        } else {
            this.divergeFactor = this.divergeFactorStart;
        }

        // Give up on target location if colliding
        if (!this.targetLocation) {
            return;
        }
        const diffX = this.targetLocation.x - this.dilsprite.sprite3dObject.position.x;
        const diffY = this.targetLocation.y - this.dilsprite.sprite3dObject.position.y;
        const distanceToTarget = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))

        // If Colliding near target location... update self as being at target location
        if (others.length > 0 && distanceToTarget < 0.2) {
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