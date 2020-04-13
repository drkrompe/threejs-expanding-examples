import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import WorldObjectsService, { WorldObject } from '../../services/WorldObjectsService';
import MouseService from '../../services/MouseService';
import CameraService from '../../services/CameraService';
import SceneService from '../../services/SceneService';

export default class SquareHover extends React.Component {

    constructor(props) {
        super(props);
        this.createRow(0.9, this.createCube);
        this.createRow(-0.9, this.createCube);
        this.rayCaster = new THREE.Raycaster();
        this.props.updateFunctions.push(this.onRenderChangeColorOfMouseIntersectedObjectsToRed);
    }

    createCube = (x, y) => {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        cube.position.x = x;
        cube.position.y = y;
        WorldObjectsService.addWorldObject(new WorldObject(cube));
    }

    createRow = (row, objCreateFunc) => {
        for (let i = -0.9; i <= 1.1; i += 0.2) {
            objCreateFunc(i, row);
        }
    }

    onRenderChangeColorOfMouseIntersectedObjectsToRed = () => {
        // update the picking ray with the camera and mouse position
        this.rayCaster.setFromCamera(MouseService.mouse, CameraService.camera);
        this.rayCaster.ray.direction.z = 1
        // calculate objects intersecting the picking ray
        const intersects = this.rayCaster.intersectObjects(SceneService.scene.children);
        intersects.forEach(intersectedObj => {
            intersectedObj.object.material.color.set(0xff0000);
        });
    }

    render() {
        return (
            <>
                <WorldObjectRenderer {...this.props} />
            </>
        );
    }
}