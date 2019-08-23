import React, { PropTypes, Component } from 'react';

const propTypes = {
    title: PropTypes.string,
    list: PropTypes.array,
    value: PropTypes.any,
    inline: PropTypes.bool,
    disabled: PropTypes.bool,
    handleChange: PropTypes.func
};

class RadioButtons extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.renderRadioButtons = this.renderRadioButtons.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    componentWillMount() {
        this.props.value && this.setState({ value: this.props.value });
    }

    componentWillReceiveProps(nextProps) {
        nextProps.value && this.setState({ value: nextProps.value });
    }

    handleChangeValue(value) {
        this.setState({ value });
        this.props.handleChange && this.props.handleChange(value);
    }

    getValue() {
        return this.state.value;
    }

    renderRadioButtons() {
        if (!this.props.list) return;

        let self = this;
        return this.props.list.map(function (radio, index) {
            let className = self.props.disabled ? ' disabled' : '';
            const id = radio.value + 'radio-button' + self.props.title || '';
            if (self.props.inline) {
                return (
                    <label
                        key={index}
                        className={'radio-inline' + className}
                        onClick={self.handleChangeValue.bind(this, radio.value)}
                    >
                        <input
                            type="radio"
                            name="optionsRadio"
                            id={id}
                            value={radio.value}
                            disabled={self.props.disabled}
                            checked={self.state.value === radio.value}
                            onChange={() => { }}
                        />
                        <label />
                        <span>{radio.title}</span>
                    </label>
                );
            }
            return (
                <div
                    key={index}
                    className={'radio' + className}
                >
                    <label onClick={self.handleChangeValue.bind(this, radio.value)}>
                        <input
                            type="radio"
                            name="optionsRadio"
                            id={id}
                            value={radio.value}
                            disabled={self.props.disabled}
                            checked={self.state.value === radio.value}
                            onChange={() => { }}
                        />
                        <label />
                        <span>{radio.title}</span>
                    </label>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="radio-buttons-group">
                {this.props.title ?
                    <div className="title "> {this.props.title}
                    </div> : null
                }
                <form className="radio-buttons">
                    {this.renderRadioButtons()}
                </form>
            </div>
        );
    }
}

RadioButtons.propTypes = propTypes;
RadioButtons.defaultProps = {
    inline: false,
    disabled: false
};

export default RadioButtons;