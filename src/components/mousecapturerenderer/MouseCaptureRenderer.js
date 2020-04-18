import React from 'react';
import MouseService from '../../services/MouseService';
import SimpleRenderer from '../renderer/SimpleRenderer';

export default class MouseCaptureRenderer extends React.Component {

    componentDidMount() {
        window.addEventListener('mousemove', MouseService.onMouseMove, false);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', MouseService.onMouseMove, false);
    }

    render() {
        return (
            <>
                <SimpleRenderer {...this.props} />
            </>
        )
    }
}