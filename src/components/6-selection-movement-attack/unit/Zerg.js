import * as THREE from 'three';
import Unit from "./Unit";
import Zerglite from './Zerglite.png';
import SceneService from '../../../services/SceneService';
import CameraService from '../../../services/CameraService';
import MovementHelper from '../../../helpers/MovementHelper';
import DMath from '../../../helpers/DMath';
import Human from './Human';




export default class Zerg extends Unit {
    constructor(selectable = true, size = 0.18) {
        super(Zerglite, 10, 1, 'zerg', selectable);
        this.changeFrameTime = 0.18;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.zergSpeed = 0.33;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;

        this.raycaster = new THREE.Raycaster();
        this.humanTarget = undefined;

        this.divergeFactorStart = 0.005;
        this.divergeFactor = this.divergeFactorStart;

        this.attackRange = 0.1
        this.attackDamage = 1
    }

    onTick = (timeDelta) => {
        this._checkHumanTargetIsAlive();
        this._atTargetLocation();
        this._moveTowardTargetLocation(timeDelta);
        this._updateTexture(timeDelta);
        this._moveAwayFromOtherUnitsOnLocation();
        this._findNearestHumanTarget();
        this._followHumanTarget();
        this._attackTargetIfCloseEnough();
    }

    _attackTargetIfCloseEnough = () => {
        if (!this.humanTarget) {
            return;
        }
        const diffX = this.humanTarget.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
        const diffY = this.humanTarget.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;
        const distanceToTarget = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))
        if (distanceToTarget < this.attackRange) {
            this.humanTarget.life -= this.attackDamage
        }
    }

    _checkHumanTargetIsAlive = () => {
        if (!this.humanTarget) {
            return;
        }
        if (this.humanTarget.life > 0) {
            return;
        }
        this.humanTarget = undefined
    }

    _findNearestHumanTarget = () => {
        if (!this.humanTarget) {
            const humanThings = SceneService.scene.children.filter(sceneElement => {
                return sceneElement.self instanceof Human
            });
            if (humanThings.length === 0) {
                return;
            }
            const foundHuman = humanThings.map((humanThing, index) => {
                const diffX = humanThing.self.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
                const diffY = humanThing.self.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;
                const distanceTo = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))
                return {
                    distanceTo,
                    humanThing
                }
            }).reduce((prev, cur) => {
                if (prev.distanceTo < cur.distanceTo) {
                    return prev;
                } else {
                    return cur;
                }
            })
            if (foundHuman) {
                this.humanTarget = foundHuman.humanThing.self
            }
        }
    }

    _followHumanTarget = () => {
        if (!this.humanTarget) {
            return;
        }
        if (!this.targetLocation) {
            this.targetLocation = this.humanTarget.dilsprite.sprite3dObject.position
        }
    }

    _updateTexture = (timeDelta) => {
        this.timeToNextTextureFrame -= timeDelta;
        if (this.timeToNextTextureFrame > 0) {
            return;
        }
        if (this.movementData && this.movementData.moving === 'left') {
            this.dilsprite.setTextureInverse(true);
            this.dilsprite.showTextureIndex(4 - (this.offset++ % 4), 0)
        } else {
            this.dilsprite.setTextureInverse(false);
            this.dilsprite.showTextureIndex((this.offset++ % 4), 0)
        }
        this.timeToNextTextureFrame = this.changeFrameTime;
    }

    _moveTowardTargetLocation = (timeDelta) => {
        window.debug && console.log("Move toward", this.targetLocation, this);
        if (!this.targetLocation) {
            return;
        }
        this.movementData = MovementHelper.moveToward(
            this.dilsprite.sprite3dObject.position,
            this.targetLocation,
            timeDelta,
            this.zergSpeed
        );
    }

    _moveAwayFromOtherUnitsOnLocation = () => {
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

            // x => 0 y => 1
            // x => 1 y => 0

            // the closer the center the harder the object is pushed away from that center
            if (Math.abs(directionX) < this.dilsprite.sprite3dObject.scale.x) {
                const normalizedX = 1 - Math.abs(directionX) / (this.dilsprite.sprite3dObject.scale.x * 0.5);
                this.dilsprite.sprite3dObject.position.x -= directionX * normalizedX * 0.5;
            }
            if (Math.abs(directionY) < this.dilsprite.sprite3dObject.scale.y) {
                const normalizedY = 1 - Math.abs(directionY) / (this.dilsprite.sprite3dObject.scale.y * 0.5);
                this.dilsprite.sprite3dObject.position.y -= directionY * normalizedY * 0.5
            }

            const threshold = 0.01
            if (Math.abs(directionX) < threshold && Math.abs(directionY) < threshold) {
                // FEAST SWARM EFFECT HAPPENS
                const randSpread = 0.07
                this.dilsprite.sprite3dObject.position.x += (Math.random() * randSpread) - (randSpread * 0.5)
                this.dilsprite.sprite3dObject.position.y += (Math.random() * randSpread) - (randSpread * 0.5)
            }
        });

        if (others.length > 0) {
            if (this.divergeFactor < 0.05) {
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