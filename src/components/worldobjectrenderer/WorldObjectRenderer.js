import React from 'react';
import GridRenderer from '../gridrenderer/GridRenderer';
import worldObjectsService from '../../services/WorldObjectsService';
import SceneService from '../../services/SceneService';

export default class WorldObjectRenderer extends React.Component {

    constructor(props) {
        super(props);
        worldObjectsService.getWorldObjects().forEach(worldObject => {
            SceneService.scene.add(worldObject.sceneObject);
        });
    }

    render() {
        return (
            <>
                <GridRenderer {...this.props} />
            </>
        )
    }
}