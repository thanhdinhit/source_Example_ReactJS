import React, { PropTypes } from 'react';
import RaisedButton from '../../components/elements/RaisedButton';
import Dialog from '../elements/Dialog';
import RS, { Option } from '../../resources/resourceManager';

export default React.createClass({
    propTypes: {
        handleClose: PropTypes.func,
        handleSubmit: PropTypes.func,
        label: PropTypes.array,
        data: PropTypes.object,
        children: PropTypes.object,
        title: PropTypes.string,
        modal: PropTypes.bool,
        className: PropTypes.string,
        isOpen: PropTypes.bool,
        style: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            label: [RS.getString('YES'), RS.getString('NO')]
        };
    },
    handleClose: function () {
        this.props.handleClose();
    },
    handleUserInput: function () {
        this.props.handleSubmit(this.props.data);
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={1}
                label={this.props.label[1]}
                onClick={this.handleClose}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={0}
                label={this.props.label[0]}
                onClick={this.handleUserInput}
                className="raised-button-first"
            />
        ];
        return (
            <Dialog
                className={this.props.className}
                style={this.props.style}
                isOpen={this.props.isOpen}
                actions={actions}
                title={this.props.title}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}>
                {this.props.children}
            </Dialog>
        )
    }

});