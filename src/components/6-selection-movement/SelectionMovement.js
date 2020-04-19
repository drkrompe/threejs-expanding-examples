import React from 'react';
import * as THREE from 'three';

import MouseService from '../../services/MouseService';
import SelectionService from '../../services/SelectionService';

import Zerg from './Zerg';
import MouseDragCaptureRenderer from '../mousedragcapturerenderer/MouseDragCaptureRenderer';
import Unit from '../6-selection-movement-attack/unit/Unit';

export default class SelectionMovement extends React.Component {

    constructor(props) {
        super(props);
        this.clock = new THREE.Clock();
        this.units = [];
        this.raycaster = new THREE.Raycaster();
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onMouseDown)
        this.createXZerg(300)
        this.props.updateFunctions.push(this.onTick);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onMouseDown);
    }

    createXZerg = (x) => {
        for (let i = 0; i < x; i++) {
            const zerg = this.createZerg();
            zerg.dilsprite.sprite3dObject.position.x = Math.random() * 2 - 1;
            zerg.dilsprite.sprite3dObject.position.y = Math.random() * 2 - 1;
        }
    }

    createZerg = () => {
        const zerg = new Zerg();
        this.units.push(zerg);
        this.props.scene.add(zerg.dilsprite.sprite3dObject);
        return zerg;
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        this.units.forEach(zerg => zerg.onTick(timeDelta));
    }

    randomizePlusMinus = (zerg, factor) => {
        const randomizePlusMinus = factor;
        zerg.targetLocation.x += Math.random() * randomizePlusMinus - (randomizePlusMinus * 0.5);
        zerg.targetLocation.y += Math.random() * randomizePlusMinus - (randomizePlusMinus * 0.5);
    }

    onMouseDown = (event) => {
        if (event.button === 0) {
            SelectionService.filterSelectedOn(thing => {
                if (thing.object.self instanceof Unit) {
                    thing.object.self.dilsprite.toggleIndicatorOpacity(false);
                    return false
                }
                return true
            });
        } else if (event.button === 2) {
            const zergs = SelectionService.selected.filter(thing => thing instanceof Unit)
            zergs.forEach(zerg => {
                zerg.targetLocation = Object.assign({}, MouseService.mouse);
                if (zergs.length > 1) {
                    this.randomizePlusMinus(zerg, 0.09);
                    if (zergs.length > 10 && zergs.length < 40) {
                        this.randomizePlusMinus(zerg, 0.025)
                    } else if (zergs.length > 40 && zergs.length < 80) {
                        this.randomizePlusMinus(zerg, 0.5)
                    } else if (zergs.length > 80) {
                        this.randomizePlusMinus(zerg, 0.7)
                    }
                }
            });
        }
    }

    // onDragRelease = (dragVerts) => {
    //     const traceDist = 0.09
    //     for (let x = dragVerts.topLeft.x; x < dragVerts.bottomRight.x; x += traceDist) {
    //         for (let y = dragVerts.topLeft.y; y < dragVerts.bottomRight.y; y += traceDist) {
    //             this.raycastForZergsAddToSelected({ x, y });
    //         }
    //     }
    //     console.log(SelectionService.selected)
    // }

    // raycastForZergsAddToSelected = (position) => {
    //     this.raycaster.setFromCamera(position, CameraService.camera);
    //     this.raycaster.ray.direction.z = 1
    //     const intersects = this.raycaster.intersectObjects(SceneService.scene.children);
    //     intersects.forEach(thing => {
    //         const foundThing = this.zergs.find(zerg => zerg.sprite.sprite3dObject === thing.object)
    //         foundThing && SelectionService.addToSelected(foundThing);
    //         foundThing && foundThing.sprite.toggleIndicatorOpacity(true);
    //     });
    // }

    render() {
        return (
            <>
                <MouseDragCaptureRenderer {...this.props} />
            </>
        );
    }
}