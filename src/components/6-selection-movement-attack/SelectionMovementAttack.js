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
        const human = new Human();
        this.props.scene.add(human.dilsprite.sprite3dObject);
        this.units.push(human);
        this.createXZerg(100)
        this.props.updateFunctions.push(this.onTick)
    }

    createXZerg = (x) => {
        for (let i = 0; i < x; i++) {
            const zerg = new Zerg(false);
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