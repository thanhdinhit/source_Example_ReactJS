import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import PropTypes from "prop-types";
import _ from 'lodash';
import FilterDateTime from './FilterDateTime';
let FilterMoreDateTime = React.createClass({
    propTypes: {
        handleRemoveFilterMore: PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            componentName: 'FilterMoreDateTime'
        }
    },

    render: function () {
        const props = _.cloneDeep(this.props);
        delete props['filterTitle'];
        delete props['field'];
        delete props['displayName'];
        delete props['handleRemoveFilterMore'];
        return (
            <div>
                <span>{this.props.filterTitle}</span>
                    <i
                        className="trash-icon fa fa-trash remove-filter"
                        aria-hidden="true"
                        onClick={this.props.handleRemoveFilterMore.bind(null, this.props.field)}
                    />
                <FilterDateTime
                    {...this.props}
                />
            </div>
        )
    }
});

export default FilterMoreDateTime;