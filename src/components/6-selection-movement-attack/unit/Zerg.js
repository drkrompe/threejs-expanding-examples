import * as THREE from 'three';
import Unit from "./Unit";
import Zerglite from './Zerglite.png';
import SceneService from '../../../services/SceneService';
import CameraService from '../../../services/CameraService';
import MovementHelper from '../../../helpers/MovementHelper';
import DMath from '../../../helpers/DMath';
import Human from './Human';
import TeamService from '../../../services/TeamService';

const ZergActions = {
    ATTACK: 'attack',
    MOVE_TO: 'move_to',
    WAITING: 'waiting'
}

export default class Zerg extends Unit {
    constructor(team = 0, selectable = true, size = 0.18) {
        super(Zerglite, 10, 1, 'zerg', selectable, -0.25, team);

        this.changeFrameTime = 0.18;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;

        this.raycaster = new THREE.Raycaster();

        this.divergeFactorStart = 0.005;
        this.divergeFactor = this.divergeFactorStart;

        // Faction Data
        this.team = team;

        // Action
        this.action = ZergActions.WAITING;

        this.attackTarget = undefined;

        // Subscribables
        this.onLifeChangeFuncs = [];

        // Unit Stats
        this.className = 'Zerg'
        this.lifeMax = 100;
        this.life = this.lifeMax;
        this.attackRange = 0.1
        this.attackDamage = 5
        this.speed = 0.33;

        // performanceHelpers
        this.tickLifeChange = 0
        this.occasionalTime = 1
        this.lastOccasional = 0

        // Attack timing
        this.lastAttackTimeReset = 1
        this.lastAttackTime = 0;

        // UpdateTimers
        this.updateEveryHalfSecReset = 0.5
        this.updateEveryHalfSec = this.updateEveryHalfSecReset
    }

    onTick = (timeDelta) => {

        this.updateEveryHalfSec -= timeDelta
        if (this.updateEveryHalfSec < 0) {
            this._updateLifeChangeSubscribers();
            this.updateEveryHalfSec = this.updateEveryHalfSecReset;
        }

        this._updateTexture(timeDelta);
        this._moveAwayFromOtherUnitsOnLocation();
        // Decision Tree
        this._evaluate_self_action(timeDelta);
    }

    _evaluate_self_action = (timeDelta) => {
        switch (this.action) {
            case ZergActions.WAITING:
                this.openToFindTarget = true;
                this._occasionally(timeDelta);
                this._ifAttackTargetSwitchAttacking();
                break;
            case ZergActions.ATTACK:
                this.openToFindTarget = false;
                this._checkAttackTargetIsAlive();
                this._followAttackTarget();
                this._moveTowardTargetLocation(timeDelta);
                this._attackTargetIfCloseEnough(timeDelta);
                this._ifNoAttackTargetSwitchWaiting();
                break;
            case ZergActions.MOVE_TO:
                this.openToFindTarget = false;
                this._ifMoveToThenNoAttackTarget();
                this._moveTowardTargetLocation(timeDelta);
                this._atTargetLocation();
                this._ifAtTargetLocationSwitchWaiting();
                break;
            default:
        }
    }

    _ifMoveToThenNoAttackTarget() {
        if (!this.attackTarget) {
            return;
        }
        this.attackTarget = undefined;
    }

    _ifAtTargetLocationSwitchWaiting() {
        if (this.targetLocation) {
            return;
        }
        this.action = ZergActions.WAITING;
    }

    _ifNoAttackTargetSwitchWaiting() {
        if (this.attackTarget) {
            return;
        };
        this.targetLocation = undefined;
        this.action = ZergActions.WAITING;
    }

    _ifAttackTargetSwitchAttacking() {
        if (!this.attackTarget) {
            return;
        }
        this.action = ZergActions.ATTACK;
    }

    _occasionally = (timeDelta) => {
        this.lastOccasional -= timeDelta
        if (this.lastOccasional > 0) {
            return;
        }
        this.lastOccasional = this.occasionalTime;
        this._findNearestOtherTeamTarget();
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

    _checkAttackTargetIsAlive = () => {
        if (!this.attackTarget) {
            return;
        }
        if (this.attackTarget.life > 0) {
            return;
        }
        this.attackTarget = undefined
    }

    _findNearestOtherTeamTarget = () => {
        // THIS IS INTENSIVE OPERATION!!!
        // Goal limit this search to happen only every so often
        if (!this.openToFindTarget) {
            return;
        }
        if (!this.attackTarget) {
            const otherTeam = TeamService.teams[(this.team + 1) % 2];
            const humanThings = otherTeam.things().filter(thing => {
                return thing instanceof Human
            });
            if (humanThings.length === 0) {
                return;
            }
            const foundHuman = humanThings.map((humanThing, index) => {
                const diffX = humanThing.dilsprite.sprite3dObject.position.x - this.dilsprite.sprite3dObject.position.x;
                const diffY = humanThing.dilsprite.sprite3dObject.position.y - this.dilsprite.sprite3dObject.position.y;
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
            });
            if (foundHuman) {
                this.attackTarget = foundHuman.humanThing;
            }
        }
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
            this.dilsprite.showTextureIndex(4 - (this.offset++ % 4), 0)
        } else {
            this.dilsprite.setTextureInverse(false);
            this.dilsprite.showTextureIndex((this.offset++ % 4), 0)
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

    _onTickUpdateLife = () => {
        this.life += this.tickLifeChange
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
    lifeChange = (changeAmount) => {
        this.tickLifeChange += changeAmount;
    }


}