import React from 'react';
import CameraService from '../../services/CameraService';
import KeyboardListenerRenderer from '../keyboardlistenerrenderer/KeyboardListenerRenderer';


export default class CameraMovementRenderer extends React.Component {

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        let move = false;
        switch (event.key) {
            case 'w':
                CameraService.camera.position.y += 0.1;
                move = true;
                break;
            case 'a':
                CameraService.camera.position.x += -0.1;
                move = true;
                break;
            case 's':
                CameraService.camera.position.y += -0.1;
                move = true;
                break;
            case 'd':
                CameraService.camera.position.x += 0.1;
                move = true;
                break;
            case 'q':
                CameraService.camera.rotateZ(Math.PI / 10);
                move = true;
                break;
            case 'e':
                CameraService.camera.rotateZ(-Math.PI / 10);
                move = true;
                break;
            default:
        }
        move && CameraService.camera.updateProjectionMatrix()
    }

    render() {
        return (
            <>
                <KeyboardListenerRenderer {...this.props} />
            </>
        );
    }
}