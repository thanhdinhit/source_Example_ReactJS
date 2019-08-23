import React, { PropTypes } from 'react';
let RaisedButton = React.createClass({
    propTypes: {
        label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        onClick: PropTypes.func,
        className: PropTypes.string
    },
    getDefaultProps: function () {
        return {
            label: 'BUTTON',
            icon: '',
        };
    },
    handleOnClick: function (e) {
        if (this.props.disabled) {
            return;
        }
        this.props.onClick(e);
    },
    render: function () {
        let className = this.props.className ? this.props.className : '';
        if (this.props.disabled) {
            className += ' raised-button-disable'
        }
        return (
            <button
                className={"raised-button " + className}
                ref="label"
                onClick={this.handleOnClick}
            >
                <div className="raised-button-label">
                    {this.props.icon ? this.props.icon : ''}
                    {this.props.label}
                </div>
            </button>
        );
    }
});
export default RaisedButton;