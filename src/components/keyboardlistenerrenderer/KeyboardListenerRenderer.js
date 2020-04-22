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