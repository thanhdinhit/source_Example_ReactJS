import React, { PropTypes, Component } from 'react';

const propTypes = {
    title: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    subLabel: PropTypes.element,
    handleChange: PropTypes.func
};

class RadioButton extends Component {
    constructor(props) {
        super(props);
        this.state = { checked: this.props.checked };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ checked: nextProps.checked });
    }

    handleChange(e) {
        let checked = e.target.value == 'on';
        this.setState({ checked });
        this.props.onChange && this.props.onChange(checked);
    }

    getValue() {
        return this.state.checked;
    }

    render() {
        let className = this.props.disabled ? ' disabled' : '';
        return (
            <div className={'radio radio-button ' + this.props.className + className}>
                <label>
                    <input
                        type="radio"
                        name={this.props.name}
                        id={this.props.id}
                        value={this.props.value}
                        disabled={this.props.disabled}
                        checked={this.state.checked}
                        onChange={this.handleChange}
                    />
                    <div className="check"></div>
                    <span className="main-label">{this.props.title}</span>
                    {this.props.subLabel}
                </label>
            </div>
        );
    }
}

RadioButton.propTypes = propTypes;
RadioButton.defaultProps = {
    inline: false,
    disabled: false
};

export default RadioButton;