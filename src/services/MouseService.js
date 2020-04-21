import * as THREE from 'three';
import CameraService from './CameraService';
import { Camera } from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let canvas;

const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
    };
}

const onMouseMove = (event) => {
    if (!canvas) {
        canvas = document.getElementById('canvas');
    }
    const canvasData = getOffset(canvas);
    // Convert Mouse Position to Relative Camera position
    // X [-2, 2] left->right
    // Y [1, -1] top->bottom
    mouse.x = ((event.clientX - canvasData.left) / canvasData.width) * 4 - 2 + CameraService.camera.position.x;
    mouse.y = -1 * ((event.clientY - canvasData.top) / canvasData.height) * 2 + 1 + CameraService.camera.position.y;

    // mouse.x = ((event.clientX - canvasData.left) / canvasData.width) * 2 - 1;
    // mouse.y = -1 * ((event.clientY - canvasData.top) / canvasData.height) * 2 + 1;

    onMouseMoveFunctions.forEach(func => {
        func(mouse);
    });
}

const intersectingObjects = (camera, scene) => {
    raycaster.ray.origin.set(0, 0, 0)
    raycaster.ray.origin.z = camera.far
    camera.localToWorld(raycaster.ray.origin)
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(scene.children);
    return intersects;
}

const getMousePosition = () => {
    return mouse;
}

const onMouseMoveFunctions = [];
const onMouseDragReleaseFunctions = [];

const MouseService = {
    mouse,
    onMouseMove,
    intersectingObjects,
    getMousePosition,
    onMouseMoveFunctions,
    onMouseDragReleaseFunctions
};

export default MouseService;