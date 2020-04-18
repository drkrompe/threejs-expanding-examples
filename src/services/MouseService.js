import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
    const canvas = document.getElementById('canvas');
    const canvasData = getOffset(canvas);
    mouse.x = ((event.clientX - canvasData.left) / canvasData.width) * 2 - 1;
    mouse.y = -1 * ((event.clientY - canvasData.top) / canvasData.height) * 2 + 1;
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