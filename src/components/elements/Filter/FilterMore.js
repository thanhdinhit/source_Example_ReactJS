import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import PropTypes from "prop-types";
import _ from 'lodash';

let acceptedTypes = ['FilterMoreCommonSelect', 'FilterMoreCommonTextField', 'FilterMoreDateTime', 'FilterMoreAvatarSelect', 'FilterAddress'];

class FilterMore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: []
        };
    }

    handleSelectFilter(field) {
        this.props.handleAddFilterMore(field);
    }

    render() {
        let flattenChildren = _.flatten(this.props.children);

        let options = _.map(flattenChildren, (children) => {
            return {
                field: children.props.field,
                displayName: children.props.displayName
            };
        });

        options = _.filter(options, (option) => {
            return _.indexOf(this.props.selectedFilter, option.field) == -1;
        });

        let childrens = _.map(this.props.selectedFilter, (filter) => {
            return _.find(flattenChildren, (children) => children.props.field == filter);
        });

        let disableClass = options.length === 0 ? 'is--disabled' : '';

        return (
            <div className="row filter-row">
                <div className={'row btn-group button-add-more ' + disableClass}>
                    <button type="button" className="btn btn-default button-circle dropdown-toggle" data-toggle="dropdown">
                        <img style={{ width: "30px" }} src={require("../../../../src/images/svg/add-icon.svg")} />
                    </button>
                    <div className="arrow-up" />
                    <ul className="dropdown-menu scrollable-menu pull-right" role="menu">
                        {
                            _.map(options, (item) => (
                                <li onClick={this.handleSelectFilter.bind(this, item.field)} key={item.field}>
                                    <a>{item.displayName}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="row more-options">
                    {
                        _.map(_.filter(childrens, (item) => !!item), (child) => (
                            <div className="col-xs-12 col-sm-3" key={child.props.field}>
                                {child}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

FilterMore.defaultProps = {
    componentName: 'FilterMore'
}

FilterMore.propTypes = {
    selectedFilter: PropTypes.array.isRequired,
    handleAddFilterMore: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: function(props, propName, componentName) {
        let childs = _.isArray(props[propName]) ? props[propName] : [props[propName]];
        childs = _.flatten(childs);
        if (_.find(childs, (child) => acceptedTypes.indexOf(child.props.componentName) == -1)) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    }
};

export default FilterMore;