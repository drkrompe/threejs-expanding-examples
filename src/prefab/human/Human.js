import MovingUnit from "../../models/unit/movingunit/MovingUnit";
import Actions from "../../models/actions/Actions";
import Dilsprite from "../../models/Dilsprite";
import { DilActionAnimation } from "../../models/dilactionanimation/DilActionAnimation";
import HumanTexture from '../../textures/human/Human.png';
import Vec from "../../helpers/Vec";
import DistanceHelper from "../../helpers/DistanceHelper";
import DMath from "../../helpers/DMath";

export default class Human extends MovingUnit {
    constructor(
        position2d = { x: 0, y: 0 },
        selectable = false,
        faction = 0,
    ) {
        const humanWaitingActionAnimation = new DilActionAnimation({ rows: 1, columns: 4 }, 0, 0, 1);
        const humanMovingActionAnimation = new DilActionAnimation({ rows: 1, columns: 4 }, 0, 2, 1);
        const humanDilsprite = new Dilsprite(HumanTexture, 4, 1, humanWaitingActionAnimation);
        super(position2d, humanDilsprite, selectable, Vec(0.4, 0.5), Vec(0, -0.48), faction, 100, Actions.WAITING, 0.33);

        this.actionToAnimation = new Map();
        this.actionToAnimation.set(Actions.WAITING, humanWaitingActionAnimation);
        this.actionToAnimation.set(Actions.MOVING, humanMovingActionAnimation);
    }

    onTick(deltaTime) {
        super.onTick(deltaTime);
        this._determineAction();
    }

    _determineAction = () => {
        switch (this.action) {
            case Actions.WAITING:
                this._setActionAnimationToAction(Actions.WAITING);
                break;
            case Actions.MOVING:
                this._setActionAnimationToAction(Actions.MOVING);
                this._ifMovingAndNoTargetLocationThenSelfLambda(() => this.action = Actions.WAITING);
                this._ifMovingAndTargetLocationThenOrientSelfToTarget();
                break;
            default:
                console.error("Error: Unexpected Behavior no Action", this);
        }
    }

    _setActionAnimationToAction = (action = Actions.WAITING) => {
        this.dilsprite.dilActionAnimation = this.actionToAnimation.get(action);
    }

    _ifMovingAndNoTargetLocationThenSelfLambda = (lambdaFunc = () => { }) => {
        if (this.action === Actions.MOVING && !this.targetLocation) {
            lambdaFunc();
        }
    }

    _ifMovingAndTargetLocationThenOrientSelfToTarget = () => {
        if (this.action !== Actions.MOVING) {
            return;
        }
        if (!this.targetLocation) {
            return;
        }
        const distanceVector = DistanceHelper.differenceOfPoints(this.dilsprite.position, this.targetLocation);
        if (distanceVector.x < 0) {
            this.dilsprite.invertTexture(Vec(-1, 1));
        } else {
            this.dilsprite.invertTexture(Vec(1, 1));
        }
    }
}