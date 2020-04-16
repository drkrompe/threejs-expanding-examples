import React from 'react';
import ClassNames from '../../utils/ClassNames';
import MouseService from '../../services/MouseService';

require('./SimpleRenderer.scss');

export default class SimpleRenderer extends React.Component {

    constructor(props) {
        super(props);
        // this.id = uuidv1();
        this.id = 'canvas'
        this.renderer = this.props.renderer;
        this.scene = this.props.scene;
        this.camera = this.props.camera;
    }

    componentDidMount() {
        window.addEventListener('resize', this.onScreenResize);
        this.onScreenResize();

        const element = document.getElementById(this.id);
        if (!element) {
            console.log("No renderer", element);
            return;
        }
        element.appendChild(this.renderer.domElement);

        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', MouseService.onMouseMove, false);
    }

    onScreenResize = () => {
        const boundingRectInfo = document.getElementById(this.id).getBoundingClientRect();
        this.camera.aspect = boundingRectInfo.width / boundingRectInfo.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(boundingRectInfo.width, boundingRectInfo.height);
    }

    animate = (now) => {
        this.props.updateFunctions && this.props.updateFunctions.forEach(func => {
            func(now);
        });
        this.props.updateFunction && this.props.updateFunction(now);

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (
            <div
                className={ClassNames('simple-renderer', this.props.className)}
                id={this.id}
            />
        );
    }

}