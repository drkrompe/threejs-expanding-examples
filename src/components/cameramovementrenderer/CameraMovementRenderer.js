import React from 'react';
import MouseDragCaptureRenderer from "../mousedragcapturerenderer/MouseDragCaptureRenderer";


export default class CameraMovementRenderer extends React.Component {

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        console.log(event)
    }

    render() {
        return (
            <>
                <MouseDragCaptureRenderer {...this.props} />
            </>
        );
    }
}