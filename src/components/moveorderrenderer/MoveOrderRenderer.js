import React from 'react';
import MouseDragCaptureRenderer from '../mousedragcapturerenderer/MouseDragCaptureRenderer';
import SelectionService from '../../services/SelectionService';
import MouseService from '../../services/MouseService';
import Unit from '../7-fighting-back/unit/Unit';
import Actions from '../../models/actions/Actions';
import MovingUnit from '../../models/unit/movingunit/MovingUnit';

export default class MoveOrderRenderer extends React.Component {

    componentDidMount() {
        window.addEventListener('mousedown', this.onMouseDown);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onMouseDown);
    }

    randomizePlusMinus = (unit, factor) => {
        const randomizePlusMinus = factor;
        unit.targetLocation.x += Math.random() * randomizePlusMinus - (randomizePlusMinus * 0.5);
        unit.targetLocation.y += Math.random() * randomizePlusMinus - (randomizePlusMinus * 0.5);
    }

    onMouseDown = (event) => {
        if (event.button === 2) {
            SelectionService.selected
                .filter(selected => selected instanceof MovingUnit)
                .forEach(moveableUnit => {
                    moveableUnit.targetLocation = Object.assign({}, MouseService.mouse);
                    moveableUnit.action = Actions.MOVING;
                    if (moveableUnit.length > 1) {
                        this.randomizePlusMinus(moveableUnit, 0.09);
                        if (moveableUnit.length > 10 && moveableUnit.length < 40) {
                            this.randomizePlusMinus(moveableUnit, 0.025)
                        } else if (moveableUnit.length > 40 && moveableUnit.length < 80) {
                            this.randomizePlusMinus(moveableUnit, 0.5)
                        } else if (moveableUnit.length > 80) {
                            this.randomizePlusMinus(moveableUnit, 0.7)
                        }
                    }
                });
        }
    }

    render() {
        return (
            <>
                <MouseDragCaptureRenderer {...this.props} />
            </>
        );
    }
}