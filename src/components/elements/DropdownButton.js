import React, { PropTypes } from 'react';
const DropdownButton = React.createClass({
    propTypes: {
        label: PropTypes.any,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string,
        isRight: PropTypes.bool,
        button: PropTypes.object,
        listActions: PropTypes.array,
        sortList: PropTypes.string
    },
    getDefaultProps: function () {
        return {
            label: <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
        };
    },
    getInitialState: function () {
        return {
            selectedIndex: -1
        };
    },
    handleClickItem: function(item,index){
        if(item){
            this.setState({ selectedIndex: index});
            this.props.onClick(item.id);
        }
    },
    render: function () {
        let className = this.props.className || '';
        className += this.props.isRight ? ' pull-right' : '';
        let listActions = this.props.listActions || [];
        return (
            <div className="btn-group">
                {
                    this.props.button
                    ||
                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.label || ''}
                    </button>
                }
                <ul className={"dropdown-menu " + className}>
                    {
                        listActions ?
                            listActions.map(function (item, index) {
                                return (
                                    <li className={this.state.selectedId===index ? 'active': ''}
                                        key={index}
                                        onClick={this.handleClickItem.bind(this,item,index)}
                                    >
                                        <a href="javascript:void(0)">{item.icon}{item.name}</a>
                                    </li>
                                )
                            }.bind(this)) : []
                    }
                </ul>
                <div className={"arrow-up " + (this.props.sortList || '')} />
            </div>
        );
    }
});
export default DropdownButton;