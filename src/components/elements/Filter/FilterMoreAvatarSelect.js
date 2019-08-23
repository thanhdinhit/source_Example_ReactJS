import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import PropTypes from "prop-types";
import _ from 'lodash';
import AvatarSelect from '../../elements/AvatarSelect.component';
let FilterMoreAvatarSelect = React.createClass({
    propTypes: {
        handleRemoveFilterMore: PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            componentName: 'FilterMoreAvatarSelect'
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
                {this.props.filterTitle}
                    <i
                        className="trash-icon fa fa-trash remove-filter"
                        aria-hidden="true"
                        onClick={this.props.handleRemoveFilterMore.bind(null, this.props.field)}
                    />
                <AvatarSelect
                    {...this.props}
                />
            </div>
        )
    }
});

export default FilterMoreAvatarSelect;