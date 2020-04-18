import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import Zerglite from './Zerglite.png';
import SceneService from '../../services/SceneService';
import Sprite from './Sprite';
import MouseService from '../../services/MouseService';
import MovementHelper from '../../helpers/MovementHelper';

export default class SpriteOrder extends React.Component {

    constructor(props) {
        super(props);
        this.createSprite();
        this.props.updateFunctions.push(this.onRenderMoveOffset)
        this.clock = new THREE.Clock();
        this.changeFrameTime = 0.05;
        this.timeToNext = this.changeFrameTime;

        this.targetLocation = {
            x: 0,
            y: 0
        }
        this.zergSpeed = 1
    }

    createSprite = () => {
        this.zerg = new Sprite(Zerglite, 10, 1);
        this.offset = 0;
        this.zerg.sprite.position.z = 0
        this.zerg.sprite.position.x = 0.5
        this.zerg.sprite.position.y = 0.5
        SceneService.scene.add(this.zerg.sprite);

        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        cube.position.x = 0
        cube.position.y = 0
        cube.position.z = 0
        SceneService.scene.add(cube);
    }

    onRenderMoveOffset = (timeNow) => {
        const delta = this.clock.getDelta();
        this.timeToNext -= delta;
        const movementData = MovementHelper.moveToward(
            this.zerg.sprite.position,
            this.targetLocation,
            delta,
            this.zergSpeed
        )
        if (this.timeToNext <= 0) {
            if (movementData.moving === 'left') {
                this.zerg.setTextureInverse(true);
                this.zerg.showTextureIndex(4 - (this.offset++ % 4), 0)
            } else {
                this.zerg.setTextureInverse(false);
                this.zerg.showTextureIndex((this.offset++ % 4), 0)
            }
            this.timeToNext = this.changeFrameTime;
        }
        // this.zerg.sprite.material.rotation = 3.14 * ((this.timeToNext / this.changeFrameTime) * 2)

        if ((MouseService.mouse.x > 1 || MouseService.mouse.x < -1)
            || (MouseService.mouse.y > 1 || MouseService.mouse.y < -1)) {
            this.targetLocation = {
                x: 0,
                y: 0
            }
        } else {
            this.targetLocation = MouseService.mouse
        }
    }

    render() {
        return (
            <>
                <WorldObjectRenderer {...this.props} />
            </>
        );
    }
}