import React, { PropTypes } from 'react';
import _ from 'lodash';
const MultiValueTextView = React.createClass({
    render: function () {
        let contentClassName = 'content ' + (this.props.image ? 'with-image ' : '');
        return (
            <div className="multi-value-text-view">
                <div className="title">{this.props.title}</div>
                <div className={contentClassName || '' }>
                {
                    this.props.value && this.props.value.length ?
                    _.map(this.props.value, (item, index) => (
                        <span key={index} className={this.props.disabled ? 'view-disabled ' : ''} >{_.isString(item) ? item : ''}</span>
                    )) :
                    <span>&nbsp;</span>
                }
                </div>
            </div>
        );
    }
});

MultiValueTextView.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.array,
    disabled: PropTypes.bool
}

export default MultiValueTextView;