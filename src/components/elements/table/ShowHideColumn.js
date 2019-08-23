import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import MyCheckBox from '../../elements/MyCheckBox';

var CustomPopover = React.createClass({
    onChange: function (column, checked) {
        if (this.props.onChange) {
            let columns = _.map(this.props.columns, (col) => {
                if (col.name == column.name) {
                    col.show = checked;
                }
                return col;
            });
            this.props.onChange(columns);
        }
    },

    render: function () {
        return (
            <div className="popover-container">
                <div className="arrow-up" />
                <div className="popover-content ">
                    {
                        _.map(this.props.columns, (col) => (
                            <MyCheckBox
                                key={col.name}
                                id={col.name}
                                defaultValue={col.show}
                                label={col.label}
                                onChange={this.onChange.bind(this, col)}
                            />
                        ))
                    }
                </div>
            </div>
        )
    }
})

var ShowHideColumn = React.createClass({
    getInitialState: function () {
        return {
            isOpen: false
        };
    },

    handleOnClick: function() {
        this.setState({ isOpen: !this.state.isOpen });
    },

    onHide: function () {
        this.setState({ isOpen: false })
    },

    render() {
        return (
            <div className="show-hide-column btn-group" ref="target">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" onClick={this.handleOnClick}>
                    <i className="icon-more-column" aria-hidden="true"></i>
                </button>
                <Overlay
                    animation={false}
                    rootClose
                    show={this.state.isOpen}
                    placement="top"
                    container={this}
                    onHide={this.onHide}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}
                >
                    <CustomPopover
                        columns={this.props.columns}
                        onChange={this.props.onChange}
                    />
                </Overlay>
            </div>
        );
    }
});

ShowHideColumn.propTypes = {
    columns: PropTypes.array.isRequired,
    onChange: PropTypes.func
}

export default ShowHideColumn;