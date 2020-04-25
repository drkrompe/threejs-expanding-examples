import * as THREE from 'three';
import Dilsprite from '../Dilsprite';
import TeamService from '../../services/TeamService';
import SceneService from '../../services/SceneService';
import Actions from '../actions/Actions';
import Collidable from '../Collidable';

export default class Unit extends Collidable {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 0.5, y: 0.5 },
        selectedIndicatorOffset = { x: 0, y: 0 },
        faction = 0,
        health = 100,
        action = Actions.WAITING,
    ) {
        super(position2d, dilsprite, selectable, selectedIndicatorScale, selectedIndicatorOffset);
        /**
         * Units are Tickables with:
         * Faction/Team
         * Health: number
         * Action: string
         */
        this.faction = faction;
        this.health = health;
        this.action = action;

        // Subscribables:
        this.onLifeChangeFuncs = [];

        // Intertick Updateables
        this._tickHealthChange = 0;
    }

    onTick(timeDelta) {
        super.onTick(timeDelta);
        this._onTickApplyAccumulatedHealthChange();
        this._ifHealthLessThanZeroThenRemove();
    }

    _ifHealthLessThanZeroThenRemove = () => {
        if (this.health > 0) {
            return;
        }
        this.removeThisUnit();
    }

    // External Updaters
    removeThisUnit = () => {
        TeamService.teams[this.faction].remove(this);
        SceneService.scene.remove(this.dilsprite);
    }

    healthChange = (changeAmount) => {
        this._tickHealthChange += changeAmount;
    }

    // On Tick Apply Accumulated Values
    _onTickApplyAccumulatedHealthChange = () => {
        this.health += this._tickHealthChange;
        this._tickHealthChange = 0;
    }

    // Subscribables
    subscribeToLifeChange = (onLifeChangeFunc) => {
        this.onLifeChangeFuncs.push(onLifeChangeFunc);
    }

    unsubscribeFromLifeChange = (onLifeChangeFunc) => {
        this.onLifeChangeFuncs = this.onLifeChangeFuncs.filter(func => func !== onLifeChangeFunc);
    }

    _updateHealthChangeSubscribers = () => {
        this.onLifeChangeFuncs.forEach(func => {
            func(this.health);
        })
    }

}