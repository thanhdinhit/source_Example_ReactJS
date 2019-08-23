import React from 'react';
import _ from 'lodash';
import RS, { Option } from '../../../resources/resourceManager';
import DialogConfirm from '../../elements/DialogConfirm';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import Dialog from '../../elements/Dialog';
import DialogAlert from '../../elements/DialogAlert';
import { getPasswordConstraints } from '../../../validation/ChangePasswordConstraints';
export default React.createClass({
    getInitialState: function () {
        return {
            curPass: '',
            errorCurPass: '',
            newPass: '',
            errorNewPass: '',
            dialogSecond: false,
            isOpenSuccess: false
        }
    },
    passwordConstraints: undefined,
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.payload.error.message != '') {
            this.setState({
                errorCurPass: RS.getString(nextProps.payload.error.message),
                errorNewPass: RS.getString(nextProps.payload.error.message)
            });
            this.props.resetError();
        }
        if (nextProps.payload.success) {
            this.setState({ isOpenSuccess: true });
            this.props.resetState();
        }
        if (nextProps.confirmPW == true) {
            this.setState({
                dialogSecond: true,
                newPass: this.curPass.getValue()
            }, () => this.setState({ newPass: '' }));
            setTimeout(() => {
                this.newPass.focus();
            }, );
        }
        if (!this.props.isOpen && nextProps.isOpen) {
            this.resetState();
            setTimeout(() => {
                this.curPass.focus();
            }, );
        }
    },

    resetState: function () {
        this.props.resetState();
        this.setState({
            curPass: '',
            errorCurPass: '',
            newPass: '',
            errorNewPass: '',
            dialogSecond: false
        })
    },

    handleSubmitPassword: function () {
        if (this.curPass.validate()) {
            this.props.confirmPassword({
                password: this.curPass.getValue(),
                userName: this.props.curEmp.userName
            });

        }
    },

    handleSubmitNewPassword: function () {
        if (this.newPass.validate()) {
            this.props.resetPassword({
                employeeId: this.props.employee.id,
                newPassword: this.newPass.getValue()
            });
        }
    },

    handleCancel: function () {
        this.resetState();
        this.props.handleCancel();
        this.setState({
            isOpenSuccess: false
        })
    },

    handleKeyPress: function (e, ref) {
        if (e.key === 'Enter' && e.currentTarget.id === 'first') {
            this.handleSubmitPassword();
        }
        if (e.key === 'Enter' && e.currentTarget.id === 'second') {
            this.handleSubmitNewPassword();
        }
    },

    renderDialogFirst: function () {
        return (
            <DialogConfirm
                modal={true}
                style={{ widthBody: '415px' }}
                title={RS.getString('RESET_PASSWORD', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleSubmitPassword}
                handleClose={this.handleCancel}
                label={[RS.getString('NEXT'), RS.getString('CANCEL')]}>
                <div>
                    <p> {RS.getString('P118')}</p>
                    <div className="dialog-input-container">
                        <CommonTextField
                            constraint={this.passwordConstraints.password}
                            type="password"
                            errorText={this.state.errorCurPass}
                            defaultValue={this.state.curPass}
                            ref={(curPass) => curPass && (this.curPass = curPass)}
                            onKeyPress={this.handleKeyPress}
                            id='first'
                        />
                    </div>
                </div>
            </DialogConfirm>
        )
    },

    renderDialogSecond: function () {
        let content = RS.getString('P117', _.get(this.props.employee, 'contactDetail.fullName', ''))
        return (
            <DialogConfirm
                modal={true}
                style={{ widthBody: '415px' }}
                title={RS.getString('RESET_PASSWORD', null, Option.UPPER)}
                handleSubmit={this.handleSubmitNewPassword}
                handleClose={this.handleCancel}
                isOpen={this.props.isOpen}
                label={[RS.getString('RESET_PASSWORD', null, Option.CAPEACHWORD), RS.getString('CANCEL')]}>
                <div>
                    <div className="content-display" dangerouslySetInnerHTML={{ __html: content }} />
                    <div className="dialog-input-container">
                        <CommonTextField
                            constraint={this.passwordConstraints.password}
                            type="password"
                            errorText={this.state.errorNewPass}
                            defaultValue={this.state.newPass}
                            ref={(newPass) => this.newPass = newPass}
                            onKeyPress={this.handleKeyPress}
                            id='second'
                        />
                    </div>
                </div>
            </DialogConfirm>
        )
    },

    render: function () {
        this.passwordConstraints = getPasswordConstraints()
        let content = RS.getString('P119', _.get(this.props.employee, 'contactDetail.fullName', ''))
        return (
            <div>
                {
                    !this.state.isOpenSuccess ? !this.state.dialogSecond ?
                        this.renderDialogFirst() : this.renderDialogSecond() : null
                }
                {
                    this.state.isOpenSuccess &&
                    <DialogAlert
                        icon={require("../../../images/complete-icon.png")}
                        isOpen={this.props.isOpen}
                        handleClose={this.handleCancel}
                        title={RS.getString('SUCCESSFUL')}
                    >
                        <div className="export-success">
                            <div className="content-display" dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                    </DialogAlert>
                }

            </div>
        )

    }
})