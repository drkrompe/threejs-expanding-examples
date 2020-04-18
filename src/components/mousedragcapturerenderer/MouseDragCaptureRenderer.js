import React from 'react';
import * as THREE from 'three';
import MouseCaptureRenderer from '../mousecapturerenderer/MouseCaptureRenderer';
import MouseService from '../../services/MouseService';
import DMath from '../../helpers/DMath';
import SceneService from '../../services/SceneService';
import CameraService from '../../services/CameraService';
import SelectionService from '../../services/SelectionService';

export default class MouseDragCaptureRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.pressed = false;
        this.locationStart = {
            x: 0,
            y: 0
        };
        this.locationEnd = {
            x: 0,
            y: 0
        };
        this.raycaster = new THREE.Raycaster();
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onMousePress);
        window.addEventListener('mouseup', this.onMouseRelease);
        window.addEventListener('mousemove', this.onMouseMove);
        MouseService.onMouseMoveFunctions.push(this.renderMouseDragUpdate);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onMousePress);
        window.removeEventListener('mousedown', this.onMouseRelease);
        MouseService.onMouseMoveFunctions.remove(this.renderMouseDragUpdate);
    }

    onMousePress = (event) => {
        if (event.button !== 0) {
            return;
        }
        this.pressed = true;
        this.locationStart = Object.assign({}, MouseService.mouse);
        this.renderMouseDragInit();
    }

    onMouseRelease = () => {
        if (!this.pressed) {
            return;
        }
        this.pressed = false;
        this.locationEnd = Object.assign({}, MouseService.mouse);
        this.renderMouseDragEnd();
    }

    renderMouseDragInit = () => {
        const geometry = new THREE.PlaneGeometry(1, 1, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            opacity: 0.4,
            transparent: true
        });
        this.dragPlane = new THREE.Mesh(geometry, material);
        this.dragPlane.position.z = 1
        this.dragPlane.name = "mouse_drag_selection_plane"
        this.dragPlane.position.x = MouseService.mouse.x;
        this.dragPlane.position.y = MouseService.mouse.y;
        this.dragPlane.scale.x = 0.01
        this.dragPlane.scale.y = 0.01
        this.props.scene.add(this.dragPlane);
    }

    renderMouseDragUpdate = () => {
        if (!this.pressed) {
            return;
        }
        this.locationEnd = Object.assign({}, MouseService.mouse);

        const relativeWidth = this.locationEnd.x - this.locationStart.x;
        const relativeHeight = this.locationEnd.y - this.locationStart.y;

        this.dragPlane.position.x = MouseService.mouse.x - (relativeWidth / 2);
        this.dragPlane.position.y = MouseService.mouse.y - (relativeHeight / 2);

        this.dragPlane.scale.x = Math.abs(relativeWidth)
        this.dragPlane.scale.y = Math.abs(relativeHeight)
    }

    renderMouseDragEnd = () => {
        // Get dragVerts and call release functions with them
        const dragVerts = {};
        dragVerts.topLeft = {
            x: this.dragPlane.position.x - (this.dragPlane.scale.x / 2),
            y: this.dragPlane.position.y - (this.dragPlane.scale.y / 2)
        }
        dragVerts.bottomRight = {
            x: dragVerts.topLeft.x + this.dragPlane.scale.x,
            y: dragVerts.topLeft.y + this.dragPlane.scale.y
        };

        MouseService.onMouseDragReleaseFunctions.forEach(func => {
            func(dragVerts);
        });
        // Remove dragplane From scsne
        SceneService.scene.remove(this.dragPlane);
        this.dragPlane = undefined;
    }

    render() {
        return (
            <>
                <MouseCaptureRenderer {...this.props} />
            </>
        )
    }

}