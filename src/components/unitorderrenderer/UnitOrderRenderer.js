import React from 'react';
import MouseDragCaptureRenderer from '../mousedragcapturerenderer/MouseDragCaptureRenderer';
import SelectionService from '../../services/SelectionService';
import MouseService from '../../services/MouseService';
import Unit from '../7-fighting-back/unit/Unit';

export default class UnitOrderRenderer extends React.Component {

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
            const selectedUnits = SelectionService.selected
                .filter(selected => selected instanceof Unit)

            selectedUnits.forEach(unit => {
                if (unit instanceof Unit) {
                    unit.targetLocation = Object.assign({}, MouseService.mouse);
                    unit.action = 'move_to'
                    if (selectedUnits.length > 1) {
                        this.randomizePlusMinus(unit, 0.09);
                        if (selectedUnits.length > 10 && selectedUnits.length < 40) {
                            this.randomizePlusMinus(unit, 0.025)
                        } else if (selectedUnits.length > 40 && selectedUnits.length < 80) {
                            this.randomizePlusMinus(unit, 0.5)
                        } else if (selectedUnits.length > 80) {
                            this.randomizePlusMinus(unit, 0.7)
                        }
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