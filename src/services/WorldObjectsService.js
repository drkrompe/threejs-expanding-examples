import { v1 as uuidv1 } from 'uuid';

class WorldObjectsService {
    constructor() {
        this._worldObjects = [];
    }

    getWorldObjects = () => {
        return this._worldObjects;
    }

    addWorldObject = (worldObject) => {
        this._worldObjects.push(worldObject);
    }

    removeWorldObject = (worldObject) => {
        this._worldObjects = this._worldObjects.filter(
            obj => obj !== worldObject
        );
    }
}

export class WorldObject {
    constructor(sceneObject, id = `world-object-${uuidv1()}`) {
        this.id = id
        this.sceneObject = sceneObject
    }
}

const worldObjectsService = new WorldObjectsService();
export default worldObjectsService;