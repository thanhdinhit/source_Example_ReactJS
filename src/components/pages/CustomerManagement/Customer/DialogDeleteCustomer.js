import React from 'react';
import RS from '../../../../resources/resourceManager';
import DialogConfirm from '../../../elements/DialogConfirm';

export default React.createClass({
    getInitialState: function () {
        return {
            isOpen: false
        };
    },

    handleOpen: function () {
        this.setState({ isOpen: true });
    },

    handleClose: function(){
        this.setState({ isOpen: false }, function(){
            if(this.props.handleClose){
                this.props.handleClose();
            }
        });
    },

    handleconfirm: function(){
        if(this.props.handleconfirm){
            this.props.handleconfirm();
        }
        this.setState({ isOpen: false });
    },

    render: function () {
        return (
            <DialogConfirm
                isOpen={this.state.isOpen}
                handleSubmit={this.handleconfirm}
                handleClose={this.handleClose}
                label={[RS.getString('CONFIRM'), RS.getString('CANCEL')]}
                className="dialog-delete-customer"
            >
                <div>
                    <div className="confirm-info">
                        <img src={require("../../../../images/info-icon.png")} />
                    </div>
                    <div className="confirm-title">{RS.format('CONFIRMATION')}</div>
                    <div className="confirm-text">{RS.format('CONFIRM_DELETE', 'CUSTOMER')}</div>
                </div>
            </DialogConfirm>
        )
    }
})