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
import Tickable from '../../models/Tickable';
import Human from '../../prefab/human/Human';

export default class CommonDataModels extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
    }

    componentDidMount() {
        this.createXHumans(100);
        this.props.updateFunctions.push(this.onTick);
    }

    createXHumans = (x) => {
        for (let i = 0; i < x; i++) {
            const human = this.createHumanAt(Vec(Math.random() * 2 - 1, Math.random() * 2 - 1));
            SceneService.scene.add(human.dilsprite);
            TeamService.teams[0].add(human);
        }
    }

    createHumanAt = (position2d = { x: 0, y: 0 }) => {
        const human = new Human(position2d, true, 0);
        human.dilsprite.scale.x = 0.15
        human.dilsprite.scale.y = 0.15
        return human;
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        TeamService.teams.forEach(team => {
            team.thingsArray.forEach(tickable => tickable instanceof Tickable && tickable.onTick(timeDelta));
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