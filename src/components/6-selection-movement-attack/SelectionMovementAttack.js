import React from 'react';
import * as THREE from 'three';
import Zerg from './unit/Zerg';
import UnitOrderRenderer from '../unitorderrenderer/UnitOrderRenderer';
import Human from './unit/Human';
import TeamService from '../../services/TeamService';

export default class SelectionMovementAttack extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
        this.units = []
    }

    componentDidMount() {
        this.createXHuman(100)
        this.createXZerg(100)
        this.props.updateFunctions.push(this.onTick)
    }

    createXHuman = (x) => {
        for (let i = 0; i < x; i++) {
            const human = new Human(0);
            human.dilsprite.sprite3dObject.position.x = Math.random() * 2 - 1
            human.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(human.dilsprite.sprite3dObject);
            TeamService.teams[0].add(human);
        }
    }

    createXZerg = (x) => {
        for (let i = 0; i < x; i++) {
            const zerg = new Zerg(1, true);
            zerg.dilsprite.sprite3dObject.position.x = Math.random() * 2 - 1
            zerg.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(zerg.dilsprite.sprite3dObject);
            TeamService.teams[1].add(zerg);
        }
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        TeamService.teams.forEach(team => {
            team.thingsArray.forEach(thing => thing.onTick(timeDelta))
        })
    }

    render() {
        return (
            <>
                <UnitOrderRenderer {...this.props} />
            </>
        );
    }
}