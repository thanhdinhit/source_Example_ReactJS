import React, { PropTypes } from 'react';
const MyCheckBox = React.createClass({
    getInitialState: function () {
        return {
            value: false
        };
    },
    componentWillMount: function () {
        if (this.props.value != undefined) {
            this.setState({ value: this.props.value })
        }
        else if (this.props.defaultValue) {
            this.setState({ value: this.props.defaultValue })
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.defaultValue != nextProps.defaultValue) {
            this.setState({ value: nextProps.defaultValue })
        }
    },
    onChange: function (e) {
        e.stopPropagation();
        this.setState({ value: !this.state.value });
        if (this.props.onChange)
            this.props.onChange(!this.state.value, e);
    },

    setValue: function (value) {
        this.refs.myCheckbox.checked = value;
        this.setState({ value })
    },

    getValue: function () {
        return this.refs.myCheckbox.checked;
    },

    handleOnClick: function (e) {
        if (this.props.disabled) {
            return;
        }
        !this.props.unStopPropagation && e.stopPropagation();
        this.onChange(e);
    },

    render: function () {
        let cssClassName = "my-checkbox " + (this.props.bodyClassName || '');
        return (
            <div className={cssClassName}>
                <input
                    ref="myCheckbox"
                    type="checkbox"
                    className="filled-in"
                    id={this.props.id}
                    checked={this.state.value}
                    onChange={() => { }}
                    disabled={this.props.disabled ? 'disabled' : ''}
                />
                <label htmlFor={this.props.id} onClick={this.handleOnClick}>{this.props.label || ''} </label>
            </div>
        );
    }
});

MyCheckBox.propTypes = {
    bodyClassName: PropTypes.string,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    unStopPropagation: PropTypes.bool
}
export default MyCheckBox;