import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import PropTypes from "prop-types";
import _ from 'lodash';
import CommonSelect from '../../elements/CommonSelect.component';
var FilterMoreCommonSelect = React.createClass({
    propTypes: {
        handleRemoveFilterMore: PropTypes.func
    },

    getDefaultProps: function () {
        return {
            componentName: 'FilterMoreCommonSelect'
        }
    },

    getInitialState: function () {
        return {
            selectedFilter: [],
        }
    },

    render: function () {
        return (
            <div>
                <span>
                    {this.props.filterTitle}
                </span>
                <i
                    className="trash-icon fa fa-trash remove-filter"
                    aria-hidden="true"
                    onClick={this.props.handleRemoveFilterMore ? this.props.handleRemoveFilterMore.bind(null, this.props.field) : ''}
                />
                <CommonSelect
                    {...this.props}
                />
            </div>
        )
    }
});

export default FilterMoreCommonSelect;