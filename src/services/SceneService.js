import * as THREE from 'three';

const scene = new THREE.Scene();

const removeWorldObjectFromScene = (worldObject) => {
    scene.remove(worldObject.sceneObject);
}

const SceneService = {
    scene,
    removeWorldObjectFromScene
}

export default SceneService;