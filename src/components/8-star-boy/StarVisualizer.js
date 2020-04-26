import React from 'react';
import * as THREE from 'three';
import GuiSelection from '../7-gui-selection/GuiSelection';
import Vec from '../../helpers/Vec';
import SceneService from '../../services/SceneService';
import AStar from '../../helpers/AStar';
import Stats from 'stats.js';
import DilStar from '../../helpers/DilStar';
import DistanceHelper from '../../helpers/DistanceHelper';

var starStats = new Stats();
starStats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom 

document.body.appendChild(starStats.dom);

export default class StarVisualizer extends React.Component {

    componentDidMount() {
        this.gridShape = 11;
        this.mapWidth = this.gridShape;
        this.mapHeight = this.gridShape;

        // Renderable Nodes
        this.nodes = new Array(this.gridShape * this.gridShape);

        this.doSearchAndRender();
    }

    doSearchAndRender = () => {
        const gridShape = this.gridShape; // Controls large of an area is covered 
        const ratioGridToWorld = 9; // Controls density of points

        // Test
        const fromPosition = Vec(0, 0);
        const toPosition = Vec(-1, -0.5);

        // Render Test Position
        const renderableFrom = new RenderableNode(fromPosition, true, Vec(0.1, 0.1));
        renderableFrom.mesh.material.color = 0x000000;
        renderableFrom.mesh.material.opacity = 0.5;
        const renderableTo = new RenderableNode(toPosition, true, Vec(0.05, 0.05));
        renderableTo.mesh.material.color = 0x000000;
        renderableTo.mesh.material.opacity = 0.5;
        renderableTo.mesh.rotateZ(Math.PI / 4)
        this.props.scene.add(renderableFrom.mesh);
        this.props.scene.add(renderableTo.mesh);
        // End Render Test Position

        // ========================================== Start
        // Find Start and End search point reference
        // - Need to have position loss-less way of figuring out what
        //   grid a world point is. 
        //   * Possible solution would be an upgrade to data structure
        //     for storing grid such that world coordinate points are
        //     stored as well.
        // - Pathing search should attempt to path using Vague grid positions
        //   unit unit is pathed to containing grid, then do final complete pathing.
        const startAndEndReferences = this.getStartAndEndReferences(
            gridShape,
            ratioGridToWorld,
            fromPosition,
            toPosition
        );

        console.log("calced grid from and to", startAndEndReferences)

        const graphArray = [];
        for (let y = 0; y < gridShape; y++) {
            const subArray = [];
            for (let x = 0; x < gridShape; x++) {
                subArray.push(1);
            }
            graphArray.push(subArray);
        }
        const graph = new AStar.Graph(graphArray, { diagonal: true });

        const startGrid = startAndEndReferences.from;
        const endGrid = startAndEndReferences.to;
        // ========================================= End

        // Draw Nodes on Graph to be considered
        graph.nodes.forEach(node => {
            const mesh = this.nodeToRenderable(node).mesh;
            const worldPosition = DilStar.gridPositionToWorldPosition(Vec(node.x, node.y), startGrid, fromPosition, ratioGridToWorld)
            mesh.position.x = worldPosition.x;
            mesh.position.y = worldPosition.y;
            this.props.scene.add(mesh);
            this.setNodesElement(node.x, node.y, mesh);
        });

        const search = AStar.astar.search(graph, graph.grid[startGrid.x][startGrid.y], graph.grid[endGrid.x][endGrid.y], { heuristic: AStar.heuristics.diagonal })
        console.log("Search result", search);

        // Render Path
        search.forEach(node => {
            const mesh = this.getNodesElement(node.x, node.y);
            mesh.rotateZ(Math.PI / 4);
            mesh.scale.x = 1.5;
            mesh.scale.y = 1.5;
            mesh.material.color = 0x000000;
            mesh.material.opacity = 0.5;
        })
    }

    getStartAndEndReferences = (gridShape, ratioGridToWorld, fromPosition, toPosition) => {
        const gridPositions = DilStar.worldPositionsToGridPositions(fromPosition, toPosition, gridShape);
        const inGrid = DilStar.targetWorldIsWithinGrid(toPosition, gridPositions.from, fromPosition, ratioGridToWorld, gridShape)

        if (inGrid) {
            gridPositions.to = inGrid;
        }

        return gridPositions;
    }

    nodeToRenderable = (node) => {
        return new RenderableNode(Vec(node.x, node.y), true, Vec(0.02, 0.02));
    }

    fillNodesMap = () => {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const renderableNode = new RenderableNode(Vec(x * this.mapStep + this.mapXOffset, y * this.mapStep + this.mapYOffset), true, Vec(0.009, 0.009));
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
            opacity: 0.2,
        });
        return new THREE.Mesh(geom, material);
    }
} 