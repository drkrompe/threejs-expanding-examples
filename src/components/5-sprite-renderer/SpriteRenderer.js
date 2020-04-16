import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import Zerglite from './Zerglite.png';
import SceneService from '../../services/SceneService';

export default class SpriteRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.createSprite();
        this.props.updateFunctions.push(this.onRenderMoveOffset)
    }

    createSprite = () => {
        const spriteMap = new THREE.TextureLoader().load(Zerglite);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
        });
        console.log(spriteMaterial)
        spriteMaterial.map.repeat.x = 0.1
        this.sprite = new THREE.Sprite(spriteMaterial);
        this.offset = 0;
        SceneService.scene.add(this.sprite);
    }

    onRenderMoveOffset = () => {
        this.sprite.material.map.offset.x = (this.offset++ % 4) / 10
    }

    render() {
        return (
            <>
                <WorldObjectRenderer {...this.props} />
            </>
        );
    }
}