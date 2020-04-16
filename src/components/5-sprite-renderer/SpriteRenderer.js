import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import Zerglite from './Zerglite.png';
import SceneService from '../../services/SceneService';
import Sprite from './Sprite';

export default class SpriteRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.createSprite();
        this.props.updateFunctions.push(this.onRenderMoveOffset)
        this.clock = new THREE.Clock();
        this.changeFrameTime = 0.05;
        this.timeToNext = this.changeFrameTime;
    }

    createSprite = () => {
        this.zerg = new Sprite(Zerglite, 10, 1);
        this.offset = 0;
        SceneService.scene.add(this.zerg.sprite);
    }

    onRenderMoveOffset = (timeNow) => {
        const delta = this.clock.getDelta();
        this.timeToNext -= delta;
        if (this.timeToNext <= 0) {
            this.zerg.showTextureIndex(this.offset++ % 4, 0)
            this.timeToNext = this.changeFrameTime;
        }
        // this.zerg.sprite.material.rotation = 3.14 * ((this.timeToNext / this.changeFrameTime) * 2)
        
    }

    render() {
        return (
            <>
                <WorldObjectRenderer {...this.props} />
            </>
        );
    }
}