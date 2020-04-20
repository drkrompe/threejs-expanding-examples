import React from 'react';
import Selection from './selection/Selection';
import SelectionService from '../../../services/SelectionService';

require('./Selections.scss');

export default class Selections extends React.Component {

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
                {this.props.selections.map(selected => <Selection selected={selected} />)}
            </ul>
        )
    }
}