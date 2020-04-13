import React from 'react';
import SimpleRenderer from '../renderer/SimpleRenderer';
import MouseService from '../../services/MouseService';
import * as THREE from 'three';

export default class GridRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.addGridLines();
    }

    addGridLines = () => {
        if (!this.props.scene) {
            console.error("GridRenderer Error: NO SCENE PASSED");
            return;
        }

        for (let i = -1; i <= 1; i += 0.2) {
            this.createRowLine(i);
            this.createColumnLine(i);
        }
    }

    createRowLine = (row) => {
        const points = [
            new THREE.Vector3(-1, row, 1),
            new THREE.Vector3(1, row, 1),
        ]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
            lineGeometry, new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        );
        this.props.scene.add(line);
    }

    createColumnLine = (col) => {
        const points = [
            new THREE.Vector3(col, 1, 1),
            new THREE.Vector3(col, -1, 1),
        ]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        );
        this.props.scene.add(line);
    }

    componentDidMount() {
        window.addEventListener('mousemove', MouseService.onMouseMove, false);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', MouseService.onMouseMove, false);
    }

    render() {
        return (
            <>
                <SimpleRenderer
                    {...this.props}
                />
            </>
        )
    }
}