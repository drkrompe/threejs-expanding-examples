import Unit from "./Unit";
import Zerglite from './Zerglite.png';
import SceneService from '../../../services/SceneService';
import CameraService from '../../../services/CameraService';
import MovementHelper from '../../../helpers/MovementHelper';
import DMath from '../../../helpers/DMath';
import TeamService from '../../../services/TeamService';

const ZergActions = {
    ATTACK: 'attack',
    MOVE_TO: 'move_to',
    WAITING: 'waiting'
}

export default class Zerg extends Unit {
    constructor(team = 0, selectable = true, size = 0.18) {
        super(Zerglite, 10, 1, 'zerg', selectable, -0.25, team);

        // Sprite update data
        this.changeFrameTime = 0.18;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;

        this.numberTextures = 4;

        // Action
        this.action = ZergActions.WAITING;
        this.attackTarget = undefined;

        // Unit Stats
        this.className = 'Zerg'
        this.lifeMax = 100;
        this.life = this.lifeMax;
        this.attackRange = 0.1
        this.attackDamage = 5
        this.speed = 0.33;
    }

    onTick = (timeDelta) => {
        this.defaultOnTick()

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
                this._randomlyWander();
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

    _randomlyWander = () => {
        if (this.action !== ZergActions.WAITING) {
            return;
        }
        if (Math.random() > 0.99) {
            this.targetLocation = Object.assign({}, this.dilsprite.sprite3dObject.position)
            const wanderDistMax = 0.1
            this.targetLocation.x += (Math.random() * wanderDistMax - (wanderDistMax * 0.5))
            this.targetLocation.y += (Math.random() * wanderDistMax - (wanderDistMax * 0.5))
            this.action = ZergActions.MOVE_TO;
            return true;
        }
    }
}