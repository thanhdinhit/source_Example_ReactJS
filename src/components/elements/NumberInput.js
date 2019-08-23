import React, { PropTypes } from 'react';
import _ from 'lodash';

const propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    disableAddon: PropTypes.bool
};
class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };

        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleDown = this.handleDown.bind(this);
    }

    componentDidMount() {
        this.setState({ value: this.props.value });
        if (this.props.integerOnly) {
            $(this.input).on('keydown', function(e) {
                let charCode = (e.which) ? e.which : e.keyCode;
                if (e.shiftKey === true ) {
                    if (charCode == 9) {
                        return true;
                    }
                    return false;
                }
                if (charCode > 31 && (charCode < 48 || (57 < charCode && charCode < 96) || 105 < charCode)) {
                    return false;
                }
                return true;
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({ value: nextProps.value });
        }
        // if (this.props.max != nextProps.max) {
        //     this.setState({
        //         value:
        //             (this.state.value < this.props.min || this.state.value > this.props.max) ? this.props.min : this.state.value
        //     });
        // }
    }

    handleOnChange(e) {
        let value = e.target.value;
        let isValid = this.isValid(value);
        isValid && this.setState({ value });
        isValid && this.props.onChange && this.props.onChange(value);
    }
    handleUp() {
        const value = parseInt(this.state.value) + 1;
        this.isValid(value) && this.setState({ value });
    }
    handleDown() {
        const value = parseInt(this.state.value) - 1;
        this.isValid(value) && this.setState({ value });
    }

    isValid(value) {
        if (value < this.props.min || value > this.props.max) {
            return false;
        }
        return true;
    }
    getValue() {
        return this.input.value;
    }
    handleOnBlur() {

    }
    handleOnFocus() {

    }

    render() {
        let { disableAddon, ...props } = this.props;
        delete props.integerOnly;
        // let value = (this.state.value < this.props.min || this.state.value > this.props.max) ? 0 : this.state.value;
        return (
            <div className="input-group number-input">
                <input
                    {...props}
                    onChange={this.handleOnChange}
                    type="number"
                    className="form-control"
                    ref={input => this.input = input}
                    value={this.state.value}
                />
                {
                    !this.props.disableAddon &&
                    <div className="input-group-addon">
                        <div>
                            <i
                                className="fa fa-angle-up"
                                aria-hidden="true"
                                onClick={this.handleUp}
                            />
                            <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                                onClick={this.handleDown}
                            />
                        </div>
                    </div>
                }

            </div>
        );
    }
}
{/* <div className="number-input">
                    <input
                        {...props}
                        onChange={this.handleOnChange}
                        onFocus={this.handleOnFocus}
                        onBlur={this.handleOnBlur}
                        ref={(input) => input && (this.input = input)}
                        type="number"
                        className="form-control form-text-input"
                        value={this.props.value}
                    // onKeyPress={this.props.onKeyPress}
                    // onKeyDown={this.props.onKeyDown}
                    />
                </div> */}


NumberInput.propTypes = propTypes;
NumberInput.defaultProps = {
    value: 0
};

export default NumberInput;