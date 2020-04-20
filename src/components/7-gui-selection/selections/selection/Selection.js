import React from 'react';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.lastColor = this.lifeValueToColor(this.props.life);
        this.state = {
            lifeColor: this.lastColor
        }
    }

    componentDidMount() {
        this.props.selected.subscribeToLifeChange(this.onLifeChange);
    }

    componentWillUnmount() {
        this.props.selected.unsubscribeFromLifeChange(this.onLifeChange);
    }

    onLifeChange = (lifeValue) => {
        const toColor = this.lifeValueToColor(lifeValue)
        if (this.lastColor !== toColor) {
            this.lastColor = toColor;
            this.setState({
                lifeColor: this.lifeValueToColor(lifeValue)
            });
        }
    }

    lifeValueToColor(lifeValue) {
        const lifePercent = lifeValue / this.props.selected.lifeMax;
        let color = 'lightgreen';
        if (lifePercent < 0.25) {
            color = 'red';
        } else if (lifePercent < 0.5) {
            color = 'orange'
        } else if (lifePercent < 0.8) {
            color = 'yellow'
        }
        return color;
    }

    render() {
        return (
            <li className='selected-container' style={{ 'backgroundColor': this.state.lifeColor }}>
                {this.props.selected.className}
            </li>
        )
    }
}