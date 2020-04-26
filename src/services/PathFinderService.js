import * as THREE from 'three';
import DilStar from "../helpers/DilStar";
import Vec from "../helpers/Vec";
import AStar from "../helpers/AStar";
import SceneService from "./SceneService";
import CameraService from './CameraService';
import Collidable from '../models/Collidable';

class PathFinder {

    constructor(gridShape = 17, ratioGridToWorld = 17) {
        this._gridShape = gridShape;
        this._ratioGridToWorld = ratioGridToWorld;
        this._nodes = [];
        for (let x = 0; x < this._gridShape; x++) {
            const subArray = [];
            for (let y = 0; y < this._gridShape; y++) {
                subArray.push(null);
            }
            this._nodes.push(subArray);
        }

        // Debug
        this._renderNodes = [];

        this._lastWorldReference = { x: 0, y: 0 };
        this._lastGridReference = { x: 0, y: 0 };
    }

    setNodeWeightValue = (col, row, value) => {
        this._nodes[col][row] = value;
    }

    getNodeWeightValue = (col, row) => {
        return this._nodes[col][row];
    }

    findPath = (
        fromPositionWorld = { x: 0, y: 0 },
        toPositionWorld = { x: 0, y: 0 },
        mapSamplingFunc = (worldPosition = { x: 0, y: 0 }) => { return 1; }
    ) => {
        // 1. Find Start and End grid points
        const startAndEndGrid = DilStar.getStartAndEndGridPositions(
            fromPositionWorld,
            toPositionWorld,
            this._gridShape,
            this._ratioGridToWorld
        );

        const gridStart = startAndEndGrid.from;
        const gridEnd = startAndEndGrid.to;

        // EXTRA - helper for debugging
        this._lastGridReference = gridStart;
        this._lastWorldReference = fromPositionWorld;

        // 2. Sample and setup graph
        for (let x = 0; x < this._gridShape; x++) {
            for (let y = 0; y < this._gridShape; y++) {
                this.setNodeWeightValue(
                    x, y,
                    mapSamplingFunc(
                        DilStar.gridPositionToWorldPosition(
                            Vec(x, y),
                            gridStart,
                            fromPositionWorld,
                            this._ratioGridToWorld
                        )
                    )
                );
            }
        }
        const starGraph = new AStar.Graph(this._nodes, { diagonal: true });

        // 3. Perform search
        const startStarNode = starGraph.grid[gridStart.x][gridStart.y];
        const endStarNode = starGraph.grid[gridEnd.x][gridEnd.y];
        const searchResultArray = AStar.astar.search(
            starGraph,
            startStarNode,
            endStarNode,
            { heuristic: AStar.astar.heuristics.diagonal }
        );

        // Transform result to world coordinates
        const searchResultWorld = searchResultArray.map(node => {
            const worldPosition = DilStar.gridPositionToWorldPosition(
                Vec(node.x, node.y),
                gridStart,
                fromPositionWorld,
                this._ratioGridToWorld
            );
            return worldPosition;
        })

        return {
            searchResultGrid: searchResultArray,
            searchResultWorld,
        };
    }

    debugClearScene = () => {
        this._renderNodes.forEach(renderableNode => {
            SceneService.scene.remove(renderableNode.mesh);
        });
        this._renderNodes = [];
    }

    debugDrawPath = (searchResultWorld = [{ x: 0, y: 0 }]) => {
        searchResultWorld.forEach(worldLocation => {
            const renderableNode = new RenderableNode(worldLocation, true, Vec(0.02, 0.02), 0x0000ff, 1);
            this._renderNodes.push(renderableNode);
            SceneService.scene.add(renderableNode.mesh);
        });
    }

    debugDrawSearchGrid = () => {
        for (let x = 0; x < this._nodes.length; x++) {
            for (let y = 0; y < this._nodes[x].length; y++) {
                const nodeWorldPosition = DilStar.gridPositionToWorldPosition(
                    Vec(x, y),
                    this._lastGridReference,
                    this._lastWorldReference,
                    this._ratioGridToWorld
                );
                const renderableNode = new RenderableNode(
                    nodeWorldPosition,
                    this.getNodeWeightValue(x, y),
                    Vec(0.02, 0.02),
                    0xffffff,
                    0.4
                )
                this._renderNodes.push(renderableNode);
                SceneService.scene.add(renderableNode.mesh);
            }
        }
    }
}

class Node {
    constructor(position2d = { x: 0, y: 0 }, traversable = true) {
        this.position = position2d;
        this.traversable = traversable;
    }
}

class RenderableNode extends Node {
    constructor(position2d = { x: 0, y: 0 }, traversable = true, scale = { x: 1, y: 1 }, color = 0xffff00, opacity = 0.2) {
        super(position2d, traversable);
        this.scale = scale;
        this.mesh = this._createMesh(this.traversable ? color : 0x000000, opacity);
        this.mesh.position.x = position2d.x;
        this.mesh.position.y = position2d.y;
    }

    _createMesh = (color, opacity) => {
        const geom = new THREE.PlaneGeometry(this.scale.x, this.scale.y, 2);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity,
        });
        return new THREE.Mesh(geom, material);
    }
}

const pathSampleRayCaster = new THREE.Raycaster();

const raycastForIntersects = (worldCoordinate) => {
    pathSampleRayCaster.setFromCamera(
        { x: worldCoordinate.x, y: worldCoordinate.y },
        CameraService.camera
    );
    pathSampleRayCaster.ray.direction.z = 1
    pathSampleRayCaster.ray.origin.x = worldCoordinate.x;
    pathSampleRayCaster.ray.origin.y = worldCoordinate.y;
    const intersect = pathSampleRayCaster
        .intersectObjects(SceneService.scene.children)
    return intersect
}

export const PathSampleFuncCollidable = (worldCoordinate = { x: 0, y: 0 }) => {
    const intersects = raycastForIntersects(worldCoordinate);
    const collidable = intersects.find(sceneThing => sceneThing.object.self instanceof Collidable);
    return collidable ? 0 : 1;
}

export const PathSampleFuncCollidableIgnoring = (ignorableCollidable) => {
    return (worldCoordinate) => {
        const intersects = raycastForIntersects(worldCoordinate);
        const collidable = intersects.find(sceneThing => sceneThing.object.self instanceof Collidable && sceneThing.object.self !== ignorableCollidable);
        return collidable ? 0 : 1;
    }
}

const PathFinderService = new PathFinder(13, 10);
export default PathFinderService;
