import React from 'react';
import * as THREE from 'three';
import GuiSelection from '../7-gui-selection/GuiSelection';
import Vec from '../../helpers/Vec';
import SceneService from '../../services/SceneService';
import AStar from '../../helpers/AStar';
import Stats from 'stats.js';

var starStats = new Stats();
starStats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom 

document.body.appendChild(starStats.dom);

export default class StarVisualizer extends React.Component {

    componentDidMount() {
        this.mapWidth = 40;
        this.mapHeight = 20;
        this.mapStep = 0.1;
        this.mapXOffset = -1.95;
        this.mapYOffset = -0.958;
        this.nodes = new Array(this.mapWidth * this.mapHeight);
        this.fillNodesMap();

        starStats.begin()
        const graph = new AStar.Graph([
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ], { diagonal: true });
        const search = AStar.astar.search(graph, graph.grid[0][0], graph.grid[3][3], { heuristic: AStar.heuristics.diagonal })
        starStats.end();


        // Goal
        // Take MovingUnit current Location
        // 1. Convert to position in starGraph relative to target
        /**
         * [1, 1, 1, 1, 1]
         * [T, 1, 1, 1, 1]
         * [1, 1, 1, 1, 1]
         * [1, 1, 1, 1, 1]
         * [1, 1, 1, 1, S]
         */
        // - Target is nearest position within the "CUBE"
        // - Self is positioned at opposite side of cube relative to target

        // Capabilities needed
        // 1.) Convert To/From World/Grid coordinates [DONE]
        // 2.) Position Self and Target on Grid [DONEish -> target location needs to be cross checked upon move as only give relative direction]
        // 3.) Determine a World To Grid Scale factor [DONE -> Make up 10 grid units in a world unit] => 10x10

        

        // Test corn star

    }

    fillNodesMap = () => {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const renderableNode = new RenderableNode(Vec(x * this.mapStep + this.mapXOffset, y * this.mapStep + this.mapYOffset), true, Vec(0.09, 0.09));
                this.setNodesElement(x, y, renderableNode);
                SceneService.scene.add(renderableNode.mesh);
            }
        }
    }

    setNodesElement = (col, row, value) => {
        this.nodes[this.mapWidth * row + col] = value;
    }

    getNodesElement = (col, row) => {
        return this.nodes[this.mapWidth * row + col]
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
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        return new THREE.Mesh(geom, material);
    }
} 