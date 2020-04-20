import React from 'react';
import SelectionMovementAttack from '../6-selection-movement-attack/SelectionMovementAttack';
import SelectionService from '../../services/SelectionService';
import Selections from './selections/Selections';


require('./GuiSelection.scss');

export default class GuiSelection extends React.Component {

    render() {
        return (
            <>
                <div className='gui-selection'>
                    <div className='gui-top'>
                        <SelectionMovementAttack {...this.props} />
                        <div className='gui-right'>
                            <div>
                                SelectedUnitPortrait
                            </div>
                            <div>
                                Stats
                            </div>
                            <ul>
                                <Selections/>
                            </ul>
                        </div>
                    </div>
                    <div className='gui-bottom'>
                        bottom
                    </div>
                </div>
            </>
        )
    }

}