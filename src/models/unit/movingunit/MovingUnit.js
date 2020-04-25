import Unit from "../Unit";
import Dilsprite from "../../Dilsprite";
import Actions from "../../actions/Actions";
import MovementHelper from "../../../helpers/MovementHelper";

export default class MovingUnit extends Unit {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 0.5, y: 0.5 },
        selectedIndicatorOffset = { x: 0, y: 0 },
        faction = 0,
        health = 100,
        action = Actions.WAITING,
        unitSpeed = 0.33,
    ) {
        super(
            position2d,
            dilsprite,
            selectable,
            selectedIndicatorScale,
            selectedIndicatorOffset,
            faction,
            health,
            action,
        );
        /**
         * Moving Units are units that when moving have:
         * unitSpeed: 0.33
         * targetLocation: location2d
         * onMoveCompleteFuncs: []
         */
        this.unitSpeed = unitSpeed;
        this.targetLocation = undefined;
        this.onMoveCompleteFuncs = [];
    }

    onTick(timeDelta) {
        super.onTick(timeDelta);
        this._ifActionIsMovingThenMoveTowardTargetLocation(timeDelta);
    }

    _ifActionIsMovingThenMoveTowardTargetLocation = (timeDelta) => {
        if (!this.action || this.action !== Actions.MOVING) {
            return;
        }
        if (!this.targetLocation) {
            console.error("Error: Unexpected No TargetLocation", this)
        }
        this.movementData = MovementHelper.moveDilTowardPoint(
            this.dilsprite,
            this.targetLocation,
            timeDelta,
            this.unitSpeed
        );
        this._ifAtTargetLocationCallOnMoveCompleteFuncs();
    }

    _ifAtTargetLocationCallOnMoveCompleteFuncs = () => {
        if (!this.targetLocation) {
            return;
        }
        const atLocation = this.dilsprite.position.x === this.targetLocation.x
            && this.dilsprite.position.y === this.targetLocation.y;
        if (!atLocation) {
            return;
        }
        this.targetLocation = undefined;
        this.onMoveCompleteFuncs.forEach(func => {
            func();
        });
    }
}