import React from 'react';
import Selection from './selection/Selection';
import SelectionService from '../../../services/SelectionService';

require('./Selections.scss');

export default class Selections extends React.Component {

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

    renderSelectedContainer = (selected) => {
        return (
            <li className='selected-container'>
                {selected.className}
            </li>
        );
    }

    render() {
        return (
            <ul className='selection-list'>
                {this.state.selections.map(selected => <Selection selected={selected} />)}
            </ul>
        )
    }
}