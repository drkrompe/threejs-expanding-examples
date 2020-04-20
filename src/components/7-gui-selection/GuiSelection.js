import React from 'react';
import SelectionMovementAttack from '../6-selection-movement-attack/SelectionMovementAttack';
import SelectionService from '../../services/SelectionService';
import Selections from './selections/Selections';
import FightingBack from '../7-fighting-back/FightingBack';


require('./GuiSelection.scss');

export default class GuiSelection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selections: []
        };
    }

    componentDidMount = () => {
        SelectionService.subscribeToSelected(this.onSelectionChange);
    }

    componentWillUnmount = () => {
        SelectionService.unsubscribeFromSelected(this.onSelectionChange);
    }

    onSelectionChange = (selections) => {
        this.setState({
            selections
        });
    }

    render() {
        const first = this.state.selections.find(obj => obj);

        return (
            <>
                <div className='gui-selection'>
                    <div className='gui-top'>
                        <FightingBack {...this.props} />
                        <div className='gui-right'>
                            <div>
                                {first && first.className}
                            </div>
                            <div>
                                {first && first.life}
                            </div>
                            <Selections selections={this.state.selections} />
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