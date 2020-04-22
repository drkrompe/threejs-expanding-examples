import React from 'react';
import * as THREE from 'three';
import TeamService from '../../services/TeamService';
import Human from './unit/Human';
import Zerg from './unit/Zerg';
import CameraMovementRenderer from '../cameramovementrenderer/CameraMovementRenderer';

export default class FightingBack extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
    }

    componentDidMount() {
        // this.createXHuman(200)
        // this.createXZerg(275)
        this.createWithPosition(new Human(0), { x: 0, y: 0 })
        this.createWithPosition(new Human(0), { x: 0, y: 1 })
        this.createWithPosition(new Human(0), { x: 0, y: 2 })
        this.props.updateFunctions.push(this.onTick)
    }

    createXHuman = (x) => {
        for (let i = 0; i < x; i++) {
            const human = new Human(0);
            human.dilsprite.sprite3dObject.position.x = Math.random() * 4 - 2
            human.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(human.dilsprite.sprite3dObject);
            TeamService.teams[0].add(human);
        }
    }

    createXZerg = (x) => {
        for (let i = 0; i < x; i++) {
            const zerg = new Zerg(1, true);
            zerg.dilsprite.sprite3dObject.position.x = Math.random() * 4 - 2
            zerg.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(zerg.dilsprite.sprite3dObject);
            TeamService.teams[1].add(zerg);
        }
    }

    createWithPosition = (thing, position) => {
        thing.dilsprite.sprite3dObject.position.x = position.x;
        thing.dilsprite.sprite3dObject.position.y = position.y;
        this.props.scene.add(thing.dilsprite.sprite3dObject);
        TeamService.teams[0].add(thing);
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
                <CameraMovementRenderer {...this.props} />
            </>
        );
    }
}