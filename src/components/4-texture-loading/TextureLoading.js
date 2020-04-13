import React from 'react';
import * as THREE from 'three';
import TextTexture from './test-texture.jpg';
import SceneService from '../../services/SceneService';
import SimpleRenderer from '../renderer/SimpleRenderer';

export default class TextureLoading extends React.Component {
    
    componentDidMount() {
        new THREE.TextureLoader().load(
            TextTexture,
            (loadedTexture) => {
                const material = new THREE.MeshBasicMaterial({
                    map: loadedTexture
                });
                const geometry = new THREE.BoxGeometry(1.2, 1.2, 0.2);
                const cube = new THREE.Mesh(geometry, material);
                SceneService.scene.add(cube);
            }
        )
    }

    render() {
        return (
            <>
                <SimpleRenderer {...this.props} />
            </>
        );
    }
}