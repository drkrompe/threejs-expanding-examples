import React from 'react';
import * as THREE from 'three';
import TeamService from '../../services/TeamService';
import GuiSelection from '../7-gui-selection/GuiSelection';
import Dilsprite from '../../models/Dilsprite';
import MovingUnit from '../../models/unit/movingunit/MovingUnit';
import SceneService from '../../services/SceneService';
import Actions from '../../models/actions/Actions';

// Textures
import Creature from '../../textures/creature/Creature.png';
import { DilActionAnimation } from '../../models/dilactionanimation/DilActionAnimation';
import Vec from '../../helpers/Vec';

export default class CommonDataModels extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
    }

    componentDidMount() {

        const unit1 = this.createMovingUnit(Vec(-1, 0));
        unit1.targetLocation = Vec(1, 1);
        unit1.dilsprite.invertTexture(Vec(-1, -1));
        const unit2 = this.createMovingUnit(Vec(0, 0));
        unit2.targetLocation = Vec(1, 1);

        SceneService.scene.add(unit1.dilsprite);
        TeamService.teams[0].add(unit1);

        unit1.toggleUnitSelectedTo(true)
        unit1.dilsprite.animate(.75)

        SceneService.scene.add(unit2.dilsprite);
        TeamService.teams[0].add(unit2);

        this.props.updateFunctions.push(this.onTick);
    }

    createMovingUnit = (position2d = { x: 0, y: 0 }) => {
        const dilsprite = new Dilsprite(Creature, 10, 1, new DilActionAnimation({ columns: 10, rows: 1 }, 0, 3, 1));
        dilsprite.scale.x = 0.25
        dilsprite.scale.y = 0.25

        const movingUnit = new MovingUnit(
            position2d,
            dilsprite,
            true,
            Vec(0.33, 0.33),
            Vec(0, -0.22),
            0,
            100,
            Actions.WAITING,
            0.33
        );
        return movingUnit
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        TeamService.teams.forEach(team => {
            team.thingsArray.forEach(tickable => tickable.onTick(timeDelta));
        });
    }

    render() {
        return (
            <>
                <GuiSelection {...this.props} />
            </>
        );
    }
}