import React from 'react';
import * as THREE from 'three';

import MouseService from '../../services/MouseService';
import CameraService from '../../services/CameraService';
import SceneService from '../../services/SceneService';
import SelectionService from '../../services/SelectionService';

import Zerg from './Zerg';
import MouseDragCaptureRenderer from '../mousedragcapturerenderer/MouseDragCaptureRenderer';

export default class SelectionMovement extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
        this.zergs = [];
        this.raycaster = new THREE.Raycaster();
    }

    componentDidMount() {
        window.addEventListener('click', this.onClick);
        window.addEventListener('mousedown', this.onMouseDown)
        this.createZerg().sprite.sprite3dObject.position.y = 0.5;
        this.createZerg().sprite.sprite3dObject.position.x = -0.5;
        this.createZerg().sprite.sprite3dObject.position.x = 0.5;
        this.props.updateFunctions.push(this.onTick);
        MouseService.onMouseDragReleaseFunctions.push(this.onDragRelease);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onClick);
        window.removeEventListener('mousedown', this.onMouseDown);
    }

    createZerg = () => {
        const zerg = new Zerg();
        this.zergs.push(zerg);
        this.props.scene.add(zerg.sprite.sprite3dObject);
        return zerg;
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        this.zergs.forEach(zerg => zerg.onTick(timeDelta));
    }

    onMouseDown = (event) => {
        // Remove all zerg currently selected if left mouse button
        if (event.button === 0) {
            SelectionService.filterSelectedOn(thing => !(thing instanceof Zerg));
        }
    }

    onClick = (event) => {
        this.raycastForZergsAddToSelected(MouseService.mouse);
    }

    onDragRelease = (dragVerts) => {
        const traceDist = 0.09
        for (let x = dragVerts.topLeft.x; x < dragVerts.bottomRight.x; x += traceDist) {
            for (let y = dragVerts.topLeft.y; y < dragVerts.bottomRight.y; y += traceDist) {
                this.raycastForZergsAddToSelected({ x, y });
            }
        }
        console.log(SelectionService.selected)
    }

    raycastForZergsAddToSelected = (position) => {
        this.raycaster.setFromCamera(position, CameraService.camera);
        this.raycaster.ray.direction.z = 1
        const intersects = this.raycaster.intersectObjects(SceneService.scene.children);
        intersects.forEach(thing => {
            const foundThing = this.zergs.find(zerg => zerg.sprite.sprite3dObject === thing.object)
            foundThing && SelectionService.addToSelected(foundThing);
        });
    }

    render() {
        return (
            <>
                <MouseDragCaptureRenderer {...this.props} />
            </>
        );
    }
}