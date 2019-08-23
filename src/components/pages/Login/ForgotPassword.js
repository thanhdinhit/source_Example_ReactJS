import React from 'react';
import RaisedButton from '../../elements/RaisedButton'
import { browserHistory } from 'react-router';
import Preloader from '../../elements/Preloader';
import MyCheckBox from '../../elements/MyCheckBox';
import toastr from 'toastr';
import RS, { Option } from '../../../resources/resourceManager';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import Constraints from '../../../validation/common.constraints';
import { REGEX_EMAIL_CAN_EMPTY } from '../../../core/common/constants'
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import LoadingIndicator from '../../elements/LoadingIndicator/LoadingIndicator';
import { LOADING_INDICATOR } from '../../../core/common/constants';
import { LOADING_INDICATOR_STYLE } from '../../../core/common/config';
import _ from 'lodash';

let ForgotPassword = React.createClass({

    componentDidUpdate: function () {
        if (this.props.payload.isLoading) {
            $("#" + LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR).css("display", "unset")
        }
        if (this.props.payload.success) {
            $("#" + LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR).css("display", "none")
            this.setState({ warning: false, afterForgotPassword: true }, function () {
                LoadingIndicatorActions.hideElementLoadingIndicator();
            })

            if (this.props.payload.isAuthenticated) {
                browserHistory.push('/');
            }

            this.props.resetState();
        }
        else if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            if (this.props.payload.error.message == "Employee_Does_Not_Found" || this.props.payload.error.message == "Email_Does_Not_Found") {
                this.setState({ errorForgotPassword: RS.getString(this.props.payload.error.message), warning: false })
            }
            else if (this.props.payload.error.message == "User_Is_Not_Existed" || this.props.payload.error.message == "The_Password_Is_Wrong")
                this.setState({ warning: true, afterForgotPassword: false })
            this.props.resetError();
            LoadingIndicatorActions.hideElementLoadingIndicator();
        }
    },

    getInitialState: function () {
        return {
            errorEmail: '',
            errorPassword: '',
            email: '',
            password: '',
            remember: undefined,
            warning: false,
            forgotPassword: false,
            afterForgotPassword: false,
            errorForgotPassword: ''
        }
    },

    componentWillMount: function () {
        if (this.props.payload.isAuthenticated) {
            browserHistory.push('/');
        }


    },

    handleEmailChange: function (event, email) {
        if (this.email) {
            email = _.trim(email);
            this.email.setValue(email)
        }
        this.setState({
            errorEmail: '',
            email: email,
            warning: false,
            afterForgotPassword: false,
            errorForgotPassword: ''
        })
    },

    handlePasswordChange: function (event, password) {
        if (password == '') {
            this.setState({ errorPassword: RS.getString('E117') })
        }
        else {
            this.setState({ errorPassword: '' })
        }
        this.setState({ password: password })
    },

    handleKeyPress: function (e) {
        if (e.key === 'Enter') {
            this.handleResetPasswordClick();
        }
    },

    handleResetPasswordClick: function () {
        let valid = true;
        if (this.state.email == '') {
            this.setState({ errorEmail: RS.getString('E122') })
            valid = false;
        } else {
            valid = this.email.validate();
        }

        if (valid) {
            LoadingIndicatorActions.showElementLoadingIndicator();
            this.props.forgotPassword(this.state.email);
        }
    },

    goToLoginPage: function () {
        browserHistory.push('/');
    },

    renderLoading: function () {
        return (
            <div className="basic-wrap__loading">
                <div className="progress" style={{ margin: '0' }}>
                    <div className="indeterminate"></div>
                </div>
            </div>
        )
    },

    focus() {
        this.input.focus();
    },

    renderForgot: function () {
        let haveMsgSuccess = this.state.afterForgotPassword ? 'have-msg-success' : '';
      
        return (
            <div className='basic-wrap__content'>
                <div className={"forgot-form " + haveMsgSuccess}>
                    <div className="forgot-form__title"> {RS.getString('FORGOT_PASSWORD', null, Option.CAPEACHWORD)} </div>
                    <div className={"forgot-form__note " + haveMsgSuccess}>
                        {RS.getString('FORGOT_PASSWORD_NOTE')}
                    </div>
                    {
                        this.state.afterForgotPassword ?
                            <div className="forgot-form__message-success">
                                <p>
                                    <img src={require("../../../images/infoIcon.png")} />
                                    {RS.getString('P106')}
                                </p>
                            </div> : ''
                    }
                    {this.state.warning ? <div className="form__content-error">
                        <img src={require("../../../images/error-icon.png")} />
                        <p> {RS.getString('E121')}</p>
                    </div> : ''}

                    {this.state.errorForgotPassword ? <div className="form__content-error">
                        <img src={require("../../../images/error-icon.png")} />
                        <p> {this.state.errorForgotPassword}</p>
                    </div> : ''}

                    <div className={"row form__content-input"}>
                        <div className="col-md-12 col-sm-12 mg-bttom-20">
                            <CommonTextField
                                required
                                title={RS.getString('EMAIL')}
                                id="email"
                                defaultValue={this.state.email}
                                ref={(input) => this.email = input}
                                errorText={this.state.errorEmail}
                                onChange={this.handleEmailChange}
                                onKeyPress={this.handleKeyPress}
                                constraint={Constraints.format(REGEX_EMAIL_CAN_EMPTY, RS.getString('E102'))}
                                onBlur={this.checkEmail}
                            />
                        </div>
                    </div>

                    <div className="form__btn">
                        <RaisedButton
                            label={RS.getString('RESET_PASSWORD')}
                            onClick={this.handleResetPasswordClick}
                            className="raised-button-large"
                        />
                        <p className="redirect" onClick={this.goToLoginPage}>
                            {RS.getString("GO_TO_LOGIN")}
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    renderContent: function () {
        return (
            <div className="basic-wrap">
                {
                    this.renderForgot()
                }
            </div>
        )
    },
    render: function () {
        return (
            <div>
                <div className='login authen-content'>
                    {this.renderContent()}
                </div>
                <LoadingIndicator
                    containerId={LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR}
                    config={LOADING_INDICATOR_STYLE.app}
                />
            </div>
        )
    }
});

export default ForgotPassword;