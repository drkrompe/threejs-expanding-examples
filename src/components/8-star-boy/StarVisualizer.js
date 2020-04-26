import React from 'react';
import * as THREE from 'three';
import GuiSelection from '../7-gui-selection/GuiSelection';
import Vec from '../../helpers/Vec';
import PathFinder from './PathFinder';
import MouseService from '../../services/MouseService';
import Human from '../../prefab/human/Human';
import TeamService from '../../services/TeamService';
import Tickable from '../../models/Tickable';
import SceneService from '../../services/SceneService';
import CameraService from '../../services/CameraService';
import Collidable from '../../models/Collidable';

export default class StarVisualizer extends React.Component {

    constructor(props) {
        super(props);
        this.pathFinder = new PathFinder(13, 10);
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.onMousePress);
        this.props.updateFunctions.push(this.onTick);
        this.createXHumans(100);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress);
    }

    sampleFunc = (worldCoordinate = { x: 0, y: 0 }) => {
        this.raycaster.setFromCamera(
            { x: worldCoordinate.x, y: worldCoordinate.y },
            CameraService.camera
        );
        this.raycaster.ray.direction.z = 1
        this.raycaster.ray.origin.x = worldCoordinate.x;
        this.raycaster.ray.origin.y = worldCoordinate.y;
        const intersect = this.raycaster
            .intersectObjects(SceneService.scene.children)

        const collidable = intersect.find(sceneThing => sceneThing.object.self instanceof Collidable);
        return collidable ? 0 : 1
    }

    onMousePress = (event) => {
        const fromPosition = Vec(0, 0);
        const toPosition = MouseService.mouse;
        this.doSearchAndRender(fromPosition, toPosition);
    }

    doSearchAndRender = (fromPosition = { x: 0, y: 0 }, toPosition = { x: 0, y: 0 }) => {
        // this.pathFinder.debugClearScene();
        // const pathResult = this.pathFinder.findPath(fromPosition, toPosition, this.sampleFunc);
        // this.pathFinder.debugDrawPath(pathResult.searchResultWorld);
        // this.pathFinder.debugDrawSearchGrid();
        // this.drawStartAndEndPosition(fromPosition, toPosition);
    }

    drawStartAndEndPosition = (fromPositionWorld = { x: 0, y: 0 }, toPositionWorld = { x: 0, y: 0 }) => {
        if (this.renderableFrom) {
            this.props.scene.remove(this.renderableFrom.mesh);
            this.renderableFrom = undefined;
        }
        if (this.renderableTo) {
            this.props.scene.remove(this.renderableTo.mesh)
            this.renderableTo = undefined;
        }

        this.renderableFrom = new RenderableNode(fromPositionWorld, true, Vec(0.1, 0.1));
        this.renderableFrom.mesh.material.color = 0x000000;
        this.renderableFrom.mesh.material.opacity = 0.5;
        this.renderableTo = new RenderableNode(toPositionWorld, true, Vec(0.05, 0.05));
        this.renderableTo.mesh.material.color = 0x000000;
        this.renderableTo.mesh.material.opacity = 0.5;
        this.renderableTo.mesh.rotateZ(Math.PI / 4)
        this.props.scene.add(this.renderableFrom.mesh);
        this.props.scene.add(this.renderableTo.mesh);
    }

    onTick = () => {
        const timeDelta = this.clock.getDelta();
        TeamService.teams.forEach(team => {
            team.thingsArray.forEach(tickable => tickable instanceof Tickable && tickable.onTick(timeDelta));
        });
    }

    createXHumans = (x) => {
        for (let i = 0; i < x; i++) {
            const human = this.createHumanAt(Vec(Math.random() * 2 - 1, Math.random() * 2 - 1));
            SceneService.scene.add(human.dilsprite);
            TeamService.teams[0].add(human);
        }
    }

    createHumanAt = (position2d = { x: 0, y: 0 }) => {
        const human = new Human(position2d, true, 0);
        human.dilsprite.scale.x = 0.15
        human.dilsprite.scale.y = 0.15
        return human;
    }

    render() {
        return (
            <>
                <GuiSelection {...this.props} />
            </>
        )
    }
}

class Node {
    constructor(position2d = { x: 0, y: 0 }, traversable = true) {
        this.position = position2d;
        this.traversable = traversable;
    }
}

class RenderableNode extends Node {
    constructor(position2d = { x: 0, y: 0 }, traversable = true, scale = { x: 1, y: 1 }) {
        super(position2d, traversable);
        this.scale = scale;
        this.mesh = this._createMesh();
        this.mesh.position.x = position2d.x;
        this.mesh.position.y = position2d.y;
    }

    _createMesh = () => {
        const geom = new THREE.PlaneGeometry(this.scale.x, this.scale.y, 2);
        const material = new THREE.MeshBasicMaterial({
            color: this.traversable ? 0xffff00 : 0x000000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
        });
        return new THREE.Mesh(geom, material);
    }
} 