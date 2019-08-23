import React from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import DialogConfirm from '../../elements/DialogConfirm';
import * as toastr from '../../../utils/toastr';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { getPasswordConstraints } from '../../../validation/ChangePasswordConstraints';
import Dialog from '../../elements/Dialog';
import * as securityUtils from '../../../utils/securityUtils';
import { log } from 'util';
export default React.createClass({
    getInitialState: function () {
        return {
            curPass: '',
            newPass: '',
            confirmPass: '',
            errorCurPass: '',
            errorNewPass: '',
            errorConfirmPass: '',
            warning: ''
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.payload.success !== nextProps.payload.success && nextProps.payload.success) {
            toastr.success(RS.getString("CHANGE_PASSWORD_SUCCESS"), RS.getString("SUCCESS"))
            this.handleCancel();
        }
        if (nextProps.payload.error.message == 'Old_Password_Is_Incorrect') {
            this.setState({ errorCurPass: RS.getString(nextProps.payload.error.message) });
            this.props.resetError();
        }
        if (nextProps.payload.error.message == 'New_Password_Cannot_Be_Same_As_Old_Password') {
            this.setState({ errorNewPass: RS.getString(nextProps.payload.error.message) });
            this.props.resetError();
        }
    },

    handleChangePassword: function () {
        let errorCurPass = this.validatePasswordField(this.curPass.getValue());
        let errorNewPass = this.validatePasswordField(this.newPass.getValue());
        let errorConfirmPass = this.validatePasswordField(this.confirmPass.getValue());
        this.setState({
            errorCurPass: errorCurPass,
            errorNewPass: errorNewPass,
            errorConfirmPass: errorConfirmPass
        });
        if (errorCurPass == '' && errorNewPass == '' && errorConfirmPass == '') {
            if (this.newPass.getValue() != this.confirmPass.getValue()) {
                this.setState({ errorConfirmPass: RS.getString('E128') });
            }
            else {
                //HashPasss
                let email = this.props.username;
                let oldpass = securityUtils.sha256(this.curPass.getValue(), email);
                let newpass = securityUtils.sha256(this.newPass.getValue(), email);
                this.props.changePassword({
                    oldPassword : oldpass,
                    newPassword: newpass
                });
            }
        }
    },
    handleCancel: function () {
        this.setState({
            curPass: '',
            newPass: '',
            confirmPass: '',
            errorCurPass: '',
            errorNewPass: '',
            errorConfirmPass: '',
            warning: ''
        })
        this.props.handleCancel();
    },

    handleCurPassChange: function () {
        let password = this.curPass.getValue();
        let error = this.validatePasswordField(password);
        this.setState({ errorCurPass: error, curPass: password });
    },
    handleNewPassChange: function () {
        let password = this.newPass.getValue();
        let error = this.validatePasswordField(password);
        this.setState({ errorNewPass: error, newPass: password });
    },
    handleConfirmPassChange: function () {
        let password = this.confirmPass.getValue();
        let error = this.validatePasswordField(password);
        this.setState({ errorConfirmPass: error, confirmPass: password });
    },
    validatePasswordField: function (password) {
        let error = ''
        if (password == '') {
            error = RS.getString('E117')
        }
        if (this.validatePassword(password)) {
            error = RS.getString('E118')
        }
        if (password.length < 6 && password.length > 0) {
            error = RS.getString('E119')
        }
        return error;
    },
    validatePassword: function (pass) {
        let regexEmail = /[^A-Za-z0-9.]/
        return regexEmail.test(pass)
    },
    render: function () {
        return (
            <DialogConfirm
                style={{ widthBody: '415px' }}
                title={RS.getString('CHANGE_PASSWORD', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleChangePassword}
                handleClose={this.handleCancel}
                label={[RS.getString('SAVE'),RS.getString('CANCEL')]}>
                <div>
                    <p> {RS.getString('P102')}</p>
                    <div className="dialog-input-container">
                        <CommonTextField
                            title={RS.getString('NEW_PASSWORD', ['CURRENT', 'PASSWORD'], Option.CAPEACHWORD)}
                            type="password"
                            errorText={this.state.errorCurPass}
                            value={this.state.curPass}
                            ref={(curPass) => this.curPass = curPass}
                            required={true}
                        />
                        <CommonTextField
                            title={RS.getString('NEW_PASSWORD', ['NEW', 'PASSWORD'], Option.CAPEACHWORD)}
                            type="password"
                            errorText={this.state.errorNewPass}
                            value={this.state.newPass}
                            ref={(newPass) => this.newPass = newPass}
                            required={true}
                        />
                        <div className="dialog-last-input">
                            <CommonTextField
                                title={RS.getString('NEW_PASSWORD', ['CONFIRM', 'PASSWORD'], Option.CAPEACHWORD)}
                                type="password"
                                errorText={this.state.errorConfirmPass}
                                value={this.state.confirmPass}
                                ref={(confirmPass) => this.confirmPass = confirmPass}
                                required={true}
                            />
                        </div>
                    </div>
                </div>
            </DialogConfirm>
        )
    }
})