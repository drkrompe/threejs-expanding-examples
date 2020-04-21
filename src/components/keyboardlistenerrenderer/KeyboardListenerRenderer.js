import React from 'react';
import UnitOrderRenderer from '../unitorderrenderer/UnitOrderRenderer';
import CameraService from '../../services/CameraService';

export default class KeyboardListenerRenderer extends React.Component {

    componentDidMount() {
        window.addEventListener('keypress', this.onKeyPress)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress)
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
    }

    onKeyDown = (event) => {
        switch (event.key) {
            case 'w':
                CameraService.camera.position.y += 0.1;
                break;
            case 'a':
                CameraService.camera.position.x += -0.1;
                break;
            case 's':
                CameraService.camera.position.y += -0.1;
                break;
            case 'd':
                CameraService.camera.position.x += 0.1;
                break;
            default:
        }
    }

    onKeyPress = (event) => {

    }

    onKeyUp = (event) => {

    }

    render() {
        return (
            <>
                <UnitOrderRenderer {...this.props} />
            </>
        )
    }
}