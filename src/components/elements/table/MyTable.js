import React, { PropTypes }from 'react';
import DropdownButton from  '../../elements/DropdownButton';
import _ from 'lodash'
export const MyTableHeader = React.createClass({
    propTypes: {
        name: PropTypes.any,
        sort: PropTypes.func,
        colspan: PropTypes.string,
        isTooltipRight: PropTypes.bool,
        enableSort: PropTypes.bool,
        listActions: PropTypes.array,
    },
    getDefaultProps: function () {
        return {
            show: true
        };
    },

    componentDidMount: function(){
        this.selectedItemName = this.props.name || '';
    },

    selectedItemName: undefined,

    handleSort: function (resetDirection=false) {
        if (this.props.enableSort)
        {
           this.props.sort(this.props.index, this.selectedItemName, resetDirection);
        }
    },

    handleChangeSortBy: function(itemName){
        let resetDirection = itemName !== this.selectedItemName;
        if (this.props.enableSort)
        {
            this.selectedItemName = itemName;
            this.handleSort(resetDirection);
        }
    },

    render: function () {
        let span = this.props.colspan || '1';
        let sortIcon = null;
        let arrow = '';
        let classCss = (this.props.className || '') + (this.props.enableSort ? ' enable-sort' : '');
        if (this.props.indexSort == this.props.index && this.props.enableSort) {
            arrow = this.props.direction == 1 ? 'asc' : 'desc';
        }
        if (this.props.enableSort) {
            sortIcon = <div className={'sort-icon ' + arrow}>
                            <i className="fa fa-angle-up" aria-hidden="true"></i>
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </div>;
        }
        if (!this.props.show) {
            return null;
        }
        return (
            <th className={classCss}
                colSpan={span}
                style={this.props.style}
                //onClick={this.handleSort}
            >
            {
                this.props.listActions ?
                <DropdownButton
                    button={<div className="columnName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.children} {sortIcon}</div>}
                    isRight={this.props.isTooltipRight || false}
                    label=''
                    sortList="arrow-up-sort-list"
                    listActions={this.props.listActions}
                    onClick={this.handleChangeSortBy}
                    className="dropdown-menu-sort"
                />
                :
                <div className="columnName"
                     onClick={this.handleSort.bind(this, false)}
                >
                    {this.props.children} {sortIcon}
                </div>
            }
            </th>
        );
    }
});

export const MyRowHeader = React.createClass({
    propTypes: {
        sort: PropTypes.func
    },
    getInitialState: function () {
        return {
            direction: 0,
            index: -1
        };
    },
    sort: function (index, columnName, resetDirection) {
        if(resetDirection){
            this.state.direction = 0;
            this.state.index = index;
        }

        if (this.state.direction == 0) {
            this.state.direction = 1;
            this.state.index = index;
        }
        else if (index == this.state.index) {
            this.state.direction = -this.state.direction;
        }
        else {
            this.state.direction = 1;
            this.state.index = index;
        }
        this.props.sort(index, columnName, this.state.direction);
        this.forceUpdate();
    },

    render: function () {
        const childs = React.Children.map(this.props.children, (child, index) =>
            child!=undefined?
            React.cloneElement(child, {
                index: index,
                sort: this.sort,
                direction: this.state.direction,
                indexSort: this.state.index
            }):null
        );

        return (
            <tr style={_.assign({}, this.props.style)} onClick={this.handleClick}>
                {this.props.type == 'expandTable' ? <td></td> : null}
                {childs}
            </tr>
        );
    }
});

export const MyHeader = React.createClass({
    propTypes: {
        sort: PropTypes.func
    },
    sort: function (index, columnName, direction) {
        this.props.sort(index, columnName, direction);
    },
    render: function () {
        const childs = React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
            isHeader: true,
            index: index,
            sort: this.sort,
            type: this.props.type
        }));
        return (
            <thead style={_.assign({}, this.props.style)}>
                {childs}
            </thead>
        );
    }
});
