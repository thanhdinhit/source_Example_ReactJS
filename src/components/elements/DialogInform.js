import React, { PropTypes } from 'react';
import RaisedButton from '../../components/elements/RaisedButton';
import RS from '../../../src/resources/resourceManager';
import Dialog from '../elements/Dialog';

export default React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string,
        buttonLabel: PropTypes.string,
        icon: PropTypes.object
    },

    handleClose: function () {
        this.props.handleClose();
    },

    getDefaultProps: function(){
        return {
            label: 'Close'
        };
    },

    render: function () {
        const actions = [

            <RaisedButton
                key={0}
                label={this.props.buttonLabel}
                onClick={this.handleClose}
                className="cancel-button" 
            />
        ];
        return (
            <Dialog
                className="dialog-inform"
                isOpen={this.props.isOpen}
                actions={actions}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}>
                <div className="dialog-inform-icon">
                {   
                    this.props.icon || 
                    <i className="fa fa-exclamation-triangle fa-4x pending-color" aria-hidden="true"></i>
                }
                </div>
                <div className="dialog-inform-title">{this.props.title}</div>
                <div className="dialog-inform-content">{this.props.content}</div>
            </Dialog>
        );
    }
});
