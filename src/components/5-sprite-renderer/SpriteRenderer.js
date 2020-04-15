import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import Zerglite from './Zerglite.png';
import SceneService from '../../services/SceneService';

export default class SpriteRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.createSprite();
    }

    createSprite = () => {
        const spriteMap = new THREE.TextureLoader().load(Zerglite);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.x = 5
        sprite.position.x = 1.5
        SceneService.scene.add(sprite);
    }

    render() {
        return (
            <>
                <WorldObjectRenderer {...this.props} />
            </>
        );
    }
}