import React,{PropTypes} from 'react';
import { YEAR_LIMIT_DELTA } from '../../../core/common/constants';
const propTypes = {
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func
}
class CommonYearPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: (new Date()).getFullYear()
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }
    componentDidMount() {
        this.setState({value: this.props.value})
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.value && this.props.value != nextProps.value){
            this.setState({value: nextProps.value})
        }
        this.setState({min: this.props.min, max: this.props.max})
    }
    
    handleOnChange(delta){
        let newValue = this.state.value + delta;
        if(newValue <= this.props.max && newValue >= this.props.min){
            this.setState({value: newValue})
            this.props.onChange && this.props.onChange(newValue);
        }
    }
    render() {
        let cssLeftAction = "year-picker-action left"
        cssLeftAction += (this.state.value == this.props.min? " disabled":'')
        let cssRightAction = "year-picker-action right"
        cssRightAction += (this.state.value == this.props.max? " disabled":'')
        return (
            <div className="year-picker noselect">
                <span className={cssLeftAction} onClick={this.handleOnChange.bind(this,-1)}>
                    <i className="icon-back-arrow"></i>
                </span>
                <span className="year-picker-number">
                    {this.state.value}
                </span>
                <span className={cssRightAction} onClick={this.handleOnChange.bind(this,1)}>
                    <i className="icon-next-arrow"></i>
                </span>
            </div>
        )
    }

}

CommonYearPicker.defaultProps = {
    min: (new Date()).getFullYear() - YEAR_LIMIT_DELTA,
    max: (new Date()).getFullYear() + YEAR_LIMIT_DELTA
};

export default CommonYearPicker;