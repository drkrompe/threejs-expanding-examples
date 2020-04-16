import React from 'react';
import * as THREE from 'three';
import WorldObjectRenderer from '../worldobjectrenderer/WorldObjectRenderer';
import Zerglite from './Zerglite.png';
import SceneService from '../../services/SceneService';
import Sprite from './Sprite';
import MouseService from '../../services/MouseService';

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
        this.zergSpeed = 0.5
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

    moveToward = (currentPosition, targetPosition, delta, speed) => {
        const xDiff = targetPosition.x - currentPosition.x;
        const yDiff = targetPosition.y - currentPosition.y;

        const distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

        const denom = (Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)));
        const unitX = Math.abs(xDiff / denom)
        const unitY = Math.abs(yDiff / denom)

        if (distance <= speed * delta) {
            currentPosition.x = targetPosition.x;
            currentPosition.y = targetPosition.y;
            return;
        }

        if (xDiff > 0) {
            currentPosition.x += (unitX * speed * delta)
        } else {
            currentPosition.x -= (unitX * speed * delta)
        }

        if (yDiff > 0) {
            currentPosition.y += (unitY * speed * delta)
        } else {
            currentPosition.y -= (unitY * speed * delta)
        }
    }

    onRenderMoveOffset = (timeNow) => {
        const delta = this.clock.getDelta();
        this.timeToNext -= delta;
        if (this.timeToNext <= 0) {
            this.zerg.showTextureIndex(this.offset++ % 4, 0)
            this.timeToNext = this.changeFrameTime;
        }
        // this.zerg.sprite.material.rotation = 3.14 * ((this.timeToNext / this.changeFrameTime) * 2)
        this.moveToward(
            this.zerg.sprite.position,
            this.targetLocation,
            delta,
            this.zergSpeed
        )

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