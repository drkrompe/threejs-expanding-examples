import React from 'react';
import * as THREE from 'three';
import GuiSelection from '../7-gui-selection/GuiSelection';
import Vec from '../../helpers/Vec';
import AStar from '../../helpers/AStar';
import DilStar from '../../helpers/DilStar';

export default class StarVisualizer extends React.Component {

    componentDidMount() {
        this.gridShape = 30;
        this.ratioGridToWorld = 17;
        this.mapWidth = this.gridShape;
        this.mapHeight = this.gridShape;

        // Renderable Nodes
        this.nodes = new Array(this.gridShape * this.gridShape);

        const fromPosition = Vec(0, 0);
        const toPosition = Vec(0.5, 0.5);

        this.doSearchAndRender(fromPosition, toPosition, this.gridShape, this.ratioGridToWorld);
    }

    setNodesElement = (col, row, value) => {
        this.nodes[this.mapWidth * row + col] = value;
    }

    getNodesElement = (col, row) => {
        return this.nodes[this.mapWidth * row + col]
    }

    doSearchAndRender = (fromPosition = { x: 0, y: 0 }, toPosition = { x: 0, y: 0 }, gridShape = 11, ratioGridToWorld = 11) => {
        // ==========================================
        // 1. Find Start and End search point reference
        const startAndEndReferences = DilStar.getStartAndEndGridPositions(
            fromPosition,
            toPosition,
            gridShape,
            ratioGridToWorld,
        );

        const startGrid = startAndEndReferences.from;
        const endGrid = startAndEndReferences.to;

        // ==========================================
        // 2. Create Graph
        const graphArray = [];
        for (let y = 0; y < gridShape; y++) {
            const subArray = [];
            for (let x = 0; x < gridShape; x++) {
                if (startGrid.x === y && startGrid.y === x) {
                    subArray.push(1);
                } else if (endGrid.x === y && endGrid.y === x) {
                    subArray.push(1);
                } else {
                    subArray.push(Math.random() > 0.55 ? 1 : 0);
                }
            }
            graphArray.push(subArray);
        }
        const graph = new AStar.Graph(graphArray, { diagonal: true });

        // ==========================================
        // 3. Perform Search
        console.log(graph, endGrid)
        const startNode = graph.grid[startGrid.x][startGrid.y];
        const endNode = graph.grid[endGrid.x][endGrid.y];
        const searchResultArray = AStar.astar.search(
            graph,
            startNode,
            endNode,
            { heuristic: AStar.astar.heuristics.diagonal }
        )

        // ==========================================
        // DEBUG Drawing
        this.drawStartAndEndPosition(fromPosition, toPosition);
        this.drawGraphOnWorld(graph.nodes, startGrid, fromPosition, ratioGridToWorld);
        this.drawSearchPath(searchResultArray);
    }

    drawStartAndEndPosition = (fromPositionWorld = { x: 0, y: 0 }, toPositionWorld = { x: 0, y: 0 }) => {
        const renderableFrom = new RenderableNode(fromPositionWorld, true, Vec(0.1, 0.1));
        renderableFrom.mesh.material.color = 0x000000;
        renderableFrom.mesh.material.opacity = 0.5;
        const renderableTo = new RenderableNode(toPositionWorld, true, Vec(0.05, 0.05));
        renderableTo.mesh.material.color = 0x000000;
        renderableTo.mesh.material.opacity = 0.5;
        renderableTo.mesh.rotateZ(Math.PI / 4)
        this.props.scene.add(renderableFrom.mesh);
        this.props.scene.add(renderableTo.mesh);
    }

    drawGraphOnWorld = (graphNodes = [], referenceGrid = { x: 0, y: 0 }, referenceWorld = { x: 0, y: 0 }, ratioGridToWorld = 1) => {
        graphNodes.forEach(node => {
            const mesh = this.nodeToRenderable(node).mesh;
            const worldPosition = DilStar.gridPositionToWorldPosition(Vec(node.x, node.y), referenceGrid, referenceWorld, ratioGridToWorld)
            mesh.position.x = worldPosition.x;
            mesh.position.y = worldPosition.y;
            this.props.scene.add(mesh);
            this.setNodesElement(node.x, node.y, { mesh, traversable: node.weight });
        });
    }

    drawSearchPath = (nodes = []) => {
        nodes.forEach(node => {
            const mesh = this.getNodesElement(node.x, node.y).mesh;
            mesh.rotateZ(Math.PI / 4);
            mesh.scale.x = 1.5;
            mesh.scale.y = 1.5;
            mesh.material.color = 0x000000;
            mesh.material.opacity = 0.5;
        });
    }

    nodeToRenderable = (node) => {
        return new RenderableNode(Vec(node.x, node.y), node.weight, Vec(0.02, 0.02));
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