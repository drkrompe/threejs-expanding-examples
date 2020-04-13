import * as THREE from 'three';

const width = 2
const height = 2
const viewSize = height
const aspectRatio = width / height;
const viewPort = {
    viewSize,
    aspectRatio,
    left: (-aspectRatio * viewSize) / 2,
    right: (aspectRatio * viewSize) / 2,
    top: viewSize / 2,
    bottom: -viewSize / 2,
    near: -100,
    far: 100
};

const camera = new THREE.OrthographicCamera(
    viewPort.left,
    viewPort.right,
    viewPort.top,
    viewPort.bottom,
    viewPort.near,
    viewPort.far
);

// const fov = 60;
// const aspect = 2;  // the canvas default
// const near = 0.1;
// const far = 200;
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const CameraService = {
    camera: camera
};
export default CameraService;