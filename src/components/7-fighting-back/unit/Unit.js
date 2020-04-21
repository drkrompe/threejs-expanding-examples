import * as THREE from 'three';
import DilSprite from "../../6-selection-movement-attack/DilSprite";
import SceneService from '../../../services/SceneService';
import SelectionService from '../../../services/SelectionService';
import TeamService from '../../../services/TeamService';
import DMath from '../../../helpers/DMath';
import MovementHelper from '../../../helpers/MovementHelper';
import CameraService from '../../../services/CameraService';
import MouseService from '../../../services/MouseService';

export default class Unit {

    constructor(
        unitTexture,
        unitTextureColumns = 1,
        unitTextureRows = 1,
        unitName = 'unit',
        selectable = false,
        selectionIndicatorYOffset = -0.25,
        team = 0,
        deadTexture,
        deadTextureColumns,
        deadTextureRows
    ) {
        this.dilsprite = new DilSprite(
            unitTexture,
            unitTextureColumns,
            unitTextureRows,
            unitName,
            selectable,
            selectionIndicatorYOffset
        );
        this.selectable = selectable;
        this.dilsprite.sprite3dObject.self = this;
        this.className = 'Unit';
        this.team = team;

        this.raycaster = new THREE.Raycaster();

        this.divergeFactorStart = 0.005;
        this.divergeFactor = this.divergeFactorStart;

        this.deadSprite = new DilSprite(
            deadTexture,
            deadTextureColumns,
            deadTextureRows,
            'deadbody',
            false
        )

        // Faction Data
        this.team = team;

        // Action
        this.action = undefined;
        this.attackTarget = undefined;

        // Subscribables
        this.onLifeChangeFuncs = [];

        // performanceHelpers
        this.tickLifeChange = 0;
        this.occasionalTime = 0.5;
        this.lastOccasional = 0;

        // Attack timing
        this.lastAttackTimeReset = 1;
        this.lastAttackTime = 0;

        // UpdateTimers
        this.updateEveryHalfSecReset = 0.5;
        this.updateEveryHalfSec = this.updateEveryHalfSecReset;

        // Data holders
        this.tickLifeChange = 0
    }

    defaultOnTick = (timeDelta) => {
        this._onTickUpdateLife();
        this._lifeLessThan0Die();
    }

    _onTickUpdateLife = () => {
        this.life += this.tickLifeChange
        this.tickLifeChange = 0;
    }

    _lifeLessThan0Die = () => {
        if (this.life <= 0) {
            SceneService.scene.remove(this.dilsprite.sprite3dObject);
            SelectionService.removeFromSelected(this);
            TeamService.teams[this.team].remove(this);
            SceneService.scene.add(this.deadSprite.sprite3dObject);
            this.deadSprite.sprite3dObject.position.x = this.dilsprite.sprite3dObject.position.x
            this.deadSprite.sprite3dObject.position.y = this.dilsprite.sprite3dObject.position.y
        }
    }


    // External Functions
    subscribeToLifeChange = (func) => {
        this.onLifeChangeFuncs.push(func);
    }

    unsubscribeFromLifeChange = (func) => {
        this.onLifeChangeFuncs = this.onLifeChangeFuncs.filter(otherFunc => otherFunc !== func);
    }

    _updateLifeChangeSubscribers = () => {
        this.onLifeChangeFuncs.forEach(func => {
            func(this.life);
        });
    }

    // External Unit Updates
    _onTickUpdateLife = () => {
        this.life += this.tickLifeChange
        this.tickLifeChange = 0;
    }

    lifeChange = (changeAmount) => {
        this.tickLifeChange += changeAmount;
    }

    // COMMON algorithms

    _findNearestOtherTeamTarget = () => {
        // THIS IS INTENSIVE OPERATION!!!
        // Goal limit this search to happen only every so often
        if (!this.openToFindTarget) {
            return;
        }
        if (!this.attackTarget) {
            const otherTeam = TeamService.teams[(this.team + 1) % 2];
            const humanThings = otherTeam.things().filter(thing => {
                return thing instanceof Unit
            });
            if (humanThings.length === 0) {
                return;
            }
            const foundOther = humanThings.map((otherUnit, index) => {
                const diffX = otherUnit.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
                const diffY = otherUnit.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;
                const distanceTo = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))
                return {
                    distanceTo,
                    otherUnit
                }
            }).reduce((prev, cur) => {
                if (prev.distanceTo < cur.distanceTo) {
                    return prev;
                } else {
                    return cur;
                }
            });
            if (foundOther) {
                this.attackTarget = foundOther.otherUnit;
            }
        }
    }

    _checkAttackTargetIsAlive = () => {
        if (!this.attackTarget) {
            return;
        }
        if (this.attackTarget.life > 0) {
            return;
        }
        this.attackTarget = undefined
    }

    _followAttackTarget = () => {
        if (!this.attackTarget) {
            return;
        }
        if (!this.targetLocation) {
            this.targetLocation = this.attackTarget.dilsprite.sprite3dObject.position
        }
    }

    _updateTexture = (timeDelta) => {
        this.timeToNextTextureFrame -= timeDelta;
        if (this.timeToNextTextureFrame > 0) {
            return;
        }
        if (this.movementData && this.movementData.moving === 'left') {
            this.dilsprite.setTextureInverse(true);
            this.dilsprite.showTextureIndex(this.numberTextures - (this.offset++ % this.numberTextures), 0)
        } else {
            this.dilsprite.setTextureInverse(false);
            this.dilsprite.showTextureIndex((this.offset++ % this.numberTextures), 0)
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

    _moveAwayFromOtherUnitsOnLocation = () => {
        const unitPositionCameraRelativeX = this.dilsprite.sprite3dObject.position.x - CameraService.camera.position.x;
        const unitPositionCameraRelativeY = this.dilsprite.sprite3dObject.position.y - CameraService.camera.position.y;

        this.raycaster.setFromCamera(
            { x: unitPositionCameraRelativeX * 0.5, y: unitPositionCameraRelativeY },
            CameraService.camera
        );

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

            // x => 0 output => 1
            // x => 1 output => 0

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

    _attackTargetIfCloseEnough = (timeDelta) => {
        this.lastAttackTime -= timeDelta;
        if (!this.attackTarget) {
            return;
        }
        if (this.lastAttackTime > 0) {
            return;
        }

        const diffX = this.attackTarget.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
        const diffY = this.attackTarget.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;
        const distanceToTarget = Math.sqrt(DMath.square(diffX) + DMath.square(diffY))
        if (distanceToTarget < this.attackRange) {
            this.lastAttackTime = this.lastAttackTimeReset;
            this.attackTarget.lifeChange(-this.attackDamage);
        }
    }

}