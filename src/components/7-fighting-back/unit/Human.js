import Unit from "./Unit";
import HumanTexture from './Human.png';
import DeadHumanTexture from './HumanDead.png';

const HumanActions = {
    ATTACK: 'attack',
    MOVE_TO: 'move_to',
    WAITING: 'waiting'
}

export default class Human extends Unit {
    constructor(team = 0, size = 0.15) {
        super(
            HumanTexture,
            3,
            1,
            'human',
            true,
            -0.45,
            team,
            DeadHumanTexture,
            3,
            1
        );

        // Sprite update data
        this.changeFrameTime = 0.25;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;
        this.dilsprite.sprite3dObject.scale.x = size - 0.05;
        this.dilsprite.sprite3dObject.scale.y = size;
        this.dilsprite.sprite3dObject.self = this;
        this.deadSprite.sprite3dObject.scale.x = size - 0.05;
        this.deadSprite.sprite3dObject.scale.y = size;
        this.deadSprite.sprite3dObject.scale.z = 3;
        this.deadSprite.showTextureIndex(2)

        this.numberTextures = 3;

        // Action
        this.action = HumanActions.WAITING;
        this.attackTarget = undefined;

        // Unit Stats
        this.className = 'Human'
        this.lifeMax = 100;
        this.life = this.lifeMax;
        this.attackRange = 0.1
        this.attackDamage = 10
        this.speed = 0.33;
    }

    onTick = (timeDelta) => {
        this.defaultOnTick();

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
            case HumanActions.WAITING:
                this.openToFindTarget = true;
                this._occasionally(timeDelta);
                this._ifAttackTargetSwitchAttacking();
                this._randomlyWander();
                break;
            case HumanActions.ATTACK:
                this.openToFindTarget = false;
                this._checkAttackTargetIsAlive();
                this._followAttackTarget();
                this._moveTowardTargetLocation(timeDelta);
                this._attackTargetIfCloseEnough(timeDelta);
                this._ifNoAttackTargetSwitchWaiting();
                break;
            case HumanActions.MOVE_TO:
                this.openToFindTarget = false;
                this._ifMoveToThenNoAttackTarget();
                this._moveTowardTargetLocation(timeDelta);
                this._atTargetLocation();
                this._ifAtTargetLocationSwitchWaiting();
                break;
            default:
        }
    }

    _randomlyWander = () => {
        if (this.action !== HumanActions.WAITING) {
            return;
        }
        if (Math.random() > 0.99) {
            this.targetLocation = Object.assign({}, this.dilsprite.sprite3dObject.position)
            const wanderDistMax = 0.1
            this.targetLocation.x += (Math.random() * wanderDistMax - (wanderDistMax * 0.5))
            this.targetLocation.y += (Math.random() * wanderDistMax - (wanderDistMax * 0.5))
            this.action = HumanActions.MOVE_TO;
            return true;
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
        this.action = HumanActions.WAITING;
    }

    _ifNoAttackTargetSwitchWaiting() {
        if (this.attackTarget) {
            return;
        };
        this.targetLocation = undefined;
        this.action = HumanActions.WAITING;
    }

    _ifAttackTargetSwitchAttacking() {
        if (!this.attackTarget) {
            return;
        }
        this.action = HumanActions.ATTACK;
    }

    _occasionally = (timeDelta) => {
        this.lastOccasional -= timeDelta
        if (this.lastOccasional > 0) {
            return;
        }
        this.lastOccasional = this.occasionalTime;
        this._findNearestOtherTeamTarget();
    }
}