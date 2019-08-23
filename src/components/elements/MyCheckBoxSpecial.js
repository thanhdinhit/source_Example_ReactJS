import React, { PropTypes } from 'react';
import _ from 'lodash'
let myCheckBox = React.createClass({
    propTypes: {
        onChange: PropTypes.func,
        className: PropTypes.string,
        id: PropTypes.string,
        style: PropTypes.object,
        checked: PropTypes.bool,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        disabled: PropTypes.bool
    },

    onChange: function (e) {
        this.props.onChange(e, this.refs.myCheckbox.checked);
    },

    render: function () {
        return (
            <div style={_.assign({ display: 'inline-block', alignItems: 'center' }, this.props.style)}>
                <input
                    ref="myCheckbox"
                    type="checkbox"
                    className={this.props.className}
                    id={this.props.id}
                    checked={this.props.checked || false}
                    onChange={this.onChange}
                    disabled={this.props.disabled ? 'disabled' : ''}
                />
                <label htmlFor={this.props.id} className={this.props.className}>{this.props.label || ''}</label>
            </div>
        );
    }
});

export default myCheckBox;