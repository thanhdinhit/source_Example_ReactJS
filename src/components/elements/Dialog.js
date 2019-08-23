import React, { PropTypes } from 'react';
import RaisedButton from '../../components/elements/RaisedButton';
import RS from '../../../src/resources/resourceManager';

export default React.createClass({
    propTypes: {
        footerContent: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            isOpen: false,
            modal: false
        }

    },
    componentWillMount: function () {

        this.forceUpdate();
    },
    componentDidMount: function () {

        this.forceUpdate();
    },
    handleClickOutSide: function () {
        if (!this.props.modal) {
            this.props.handleClose();
        }

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
        let css = "dialog-confirm ";
        css += this.props.className ? this.props.className : ''
        if (this.props.isOpen)
            return (
                <span className={css}>
                    <div className="modal-fade">
                        <div className="modal-center">
                            <div className="modal-content" style={{ width: this.props.style ? this.props.style.widthBody : '' }}>
                                <div className='modal-header'>
                                    <div className='modal-title'>
                                        <label>{this.props.title}</label>
                                        <img className='modal-icon'
                                            onClick={this.props.handleClose}
                                            src={require("../../images/closeDialog.png")} />
                                    </div>
                                </div>
                                <div className={'modal-body ' + (this.props.modalBody || '')}>
                                    {this.props.children}
                                </div>
                                {
                                    this.props.actions || this.props.footerContent ?
                                        <div className={'modal-footer ' + (this.props.modalFooter || '')}>
                                            {
                                                this.props.footerContent ? this.props.footerContent :
                                                    <div className='text-right'>
                                                        {this.props.actions}
                                                    </div>
                                            }

                                        </div> : ''
                                }
                            </div>
                        </div>
                        <div className='background-dialog' onClick={this.handleClickOutSide}>
                            <div className="background-dialog-container"></div>
                        </div>
                    </div>
                </span>
            )
        else {
            return (null)
        }
    }
})
