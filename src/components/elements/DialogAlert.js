import React from 'react';
import RaisedButton from '../../components/elements/RaisedButton';
import RS from '../../../src/resources/resourceManager';

export default React.createClass({
    getDefaultProps: function () {
        return {
            isOpen: false,
            modal: false
        }

    },
    handleClickOutSide: function () {
        !this.props.modal ? this.props.handleClose() : '';
    },

    componentDidUpdate: function () {
        // $('#image-icon').attr('src',this.props.icon);
    },
    componentWillReceiveProps: function (nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            $('body').css('overflow', 'hidden');
        }
        if (this.props.isOpen && !nextProps.isOpen) {
            $('body').css('overflow', 'auto');
        }
    },
    componentWillUnmount: function () {
        $('body').css('overflow', 'auto');
    },
    render: function () {
        if (this.props.isOpen)
            return (
                <div className="dialog-alert">
                    <div className="modal-fade">
                        <div className="modal-center">
                            <div className="modal-content">
                                <img
                                    className="closeDialog"
                                    onClick={this.props.handleClose}
                                    src={require("../../images/closeDialog.png")}
                                />
                                <div className='modal-body'>
                                    <img id="image-icon" className='modal-icon-body'
                                        src={this.props.icon} />
                                    <div className='modal-body-title'>{this.props.title}</div>
                                    <div className='modal-body-content'>{this.props.children}</div>
                                </div>
                                {
                                    <div className='modal-footer'>
                                        {!!this.props.actions && this.props.actions}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='background-dialog' onClick={this.handleClickOutSide}>
                            <div className="background-dialog-container"></div>
                        </div>
                    </div>
                </div>
            )
        else {
            return (null)
        }
    }
})
