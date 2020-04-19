import React from 'react';
import * as THREE from 'three';
import Zerg from './unit/Zerg';
import UnitOrderRenderer from '../unitorderrenderer/UnitOrderRenderer';
import Human from './unit/Human';

export default class SelectionMovementAttack extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
        this.units = []
    }

    componentDidMount() {
        this.createXHuman(200)
        this.createXZerg(100)
        this.props.updateFunctions.push(this.onTick)
    }

    createXHuman = (x) => {
        for (let i = 0; i < x; i++){
            const human = new Human();
            human.dilsprite.sprite3dObject.position.x = Math.random() * 2 - 1
            human.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(human.dilsprite.sprite3dObject);
            this.units.push(human);
        }
    }

    createXZerg = (x) => {
        for (let i = 0; i < x; i++) {
            const zerg = new Zerg(true);
            zerg.dilsprite.sprite3dObject.position.x = Math.random() * 2 - 1
            zerg.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1
            this.props.scene.add(zerg.dilsprite.sprite3dObject);
            this.units.push(zerg);
        }
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        this.units.forEach(unit => {
            unit.onTick(timeDelta)
        });
    }

    render() {
        return (
            <>
                <UnitOrderRenderer {...this.props} />
            </>
        );
    }
}