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
import * as routeConfig from '../../../constants/routeConfig';

let loginPage = React.createClass({

    componentDidMount: function () {
        if (!this.props.afterChangePassword) {
            this.refs.email.focus();
        }
    },
    componentDidUpdate: function () {
        if (this.props.payload.isLoading) {
            $("#" + LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR).css("display", "unset")
        }
        if (this.props.payload.success) {
            $("#" + LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR).css("display", "none")

            if (this.props.payload.isAuthenticated) {
                browserHistory.push('/');
            } else {
                if (this.props.afterChangePassword) {
                    this.setState({
                        afterChangePassword: this.props.afterChangePassword
                    });
                }
            }

            this.props.resetState();
        }
        else if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            if (this.props.payload.error.message == "Employee_Does_Not_Found" || this.props.payload.error.message == "Email_Does_Not_Found") {
                this.setState({ errorForgotPassword: RS.getString(this.props.payload.error.message), warning: false })
            }
            else if (this.props.payload.error.message == "User_Is_Not_Existed" || this.props.payload.error.message == "The_Password_Is_Wrong") {
                this.setState({ warning: true, afterForgotPassword: false });
            } else if (this.props.payload.error.message == RS.getString('NO_CONNECT_TO_SERVER')) {
                this.setState({
                    warning: true,
                    afterForgotPassword: false,
                    errorMessage: RS.getString('NO_CONNECT_TO_SERVER')
                });
            }

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
            afterForgotPassword: false,
            errorForgotPassword: '',
            afterChangePassword: false,
            errorMessage: RS.getString('E123')
        }
    },

    componentWillMount: function () {
        if (this.props.payload.isAuthenticated) {
            browserHistory.push('/');
        } else {
            if (this.props.afterChangePassword) {
                this.setState({
                    afterChangePassword: this.props.afterChangePassword
                });
            }
        }
    },
    handleEmailChange: function (event, email) {
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
    handleClick: function () {
        let valid = true;
        if (this.state.email == '') {
            this.setState({ errorEmail: RS.getString('E124') })
            valid = false;
        }

        if (this.state.password == '') {
            this.setState({ errorPassword: RS.getString('E117') })
            valid = false;
        }
        if (valid) {
            LoadingIndicatorActions.showElementLoadingIndicator();
            this.props.login(this.state.email, this.state.password, this.refs.rememberMe.refs.myCheckbox.checked, this.props.location.query.next);
        }

    },
    handleKeyPress: function (e) {
        if (e.key === 'Enter') {
            this.handleClick();
        }
    },
    goToLoginPage: function () {
        browserHistory.push('/');
    },
    goToHomePage: function () {
        this.props.loginSuccess(this.props.contactDetail);
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
    renderLogin: function () {
        return (
            <div className="basic-wrap__content">
                {
                    this.state.afterChangePassword ? this.renderChangePasswordSuccess() : this.renderLoginForm()
                }
                <div className="login-bg">
                    <img src={require('../../../images/LoginBg-2.png')} />
                    <div className="welcome-iwfa">
                        <p className="welcome-text">
                            {RS.getString('WELCOME_TEXT')}
                        </p>
                        <p className="iwfa-text">
                            {RS.getString('IWFA_TEXT')}
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    renderChangePasswordSuccess: function () {
        return (
            <div className="change-password-success">
                <div className="change-password-success__content">
                    <div className="success-icon">
                        <img src={require('../../../images/complete.png')} />
                    </div>
                    <div className="success-text"> {RS.getString('SUCCESS')}</div>
                    <div className="success-msg">
                        {RS.getString('PASSWORD_CHANGED_SUCCESSFULLY')}
                    </div>
                    <div className="form__btn">
                        <RaisedButton
                            label={RS.getString("OK", null, 'UPPER')}
                            onClick={this.goToHomePage}
                            className="raised-button-large" />
                    </div>
                </div>
            </div>
        )
    },
    renderLoginForm: function () {
        return (
            <div className="login-form">
                <div className="login-form__content">
                    <div className="form__content-logo">
                        <img src={require('../../../images/iWFALogo.png')} />
                    </div>
                    {this.state.warning ? <div className="form__content-error">
                        <img src={require("../../../images/error-icon.png")} />
                        <p>{this.state.errorMessage}</p>
                    </div> : ''}
                    <div className={"row form__content-input"}>
                        <div className="col-md-12 col-sm-12 mg-bttom-20">
                            <CommonTextField
                                required
                                title={RS.getString('ACCOUNT')}
                                id="email"
                                defaultValue={this.state.email || ''}
                                value={this.state.email}
                                ref='email'
                                type="text"
                                errorText={this.state.errorEmail}
                                onChange={this.handleEmailChange}
                                onKeyPress={this.handleKeyPress}
                            />
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <CommonTextField
                                required
                                title={RS.getString('PASSWORD')}
                                id="password"
                                defaultValue={this.state.password || ''}
                                value={this.state.password}
                                ref='password'
                                type="password"
                                errorText={this.state.errorPassword}
                                onChange={this.handlePasswordChange}
                                onKeyPress={this.handleKeyPress}
                            />
                        </div>
                    </div>
                    <div className="login-form__content-option">
                        <MyCheckBox
                            defaultValue={localStorage.getItem('keepSignedIn') == "true"}
                            ref="rememberMe"
                            checked={this.state.remember}
                            className="filled-in"
                            id="rememberMe"
                            label={RS.getString("KEEP_SIGNIN")}
                            style={{ display: 'inline-block' }}
                            onChange={(e, value) => { this.setState({ remember: value }) }}
                        />
                        <p className="forgot-pw-text" onClick={(e) => { e.preventDefault(), browserHistory.push('/' + routeConfig.FORGOT_PASSWORD) }}>
                            {RS.getString("FORGOT_PASSWORD")}
                        </p>
                    </div>
                    <div className="form__btn">
                        <RaisedButton
                            label={RS.getString("LOGIN")}
                            onClick={this.handleClick}
                            className="raised-button-large"
                        />
                    </div>
                </div>
            </div>
        )
    },

    focus() {
        this.input.focus();
    },

    renderContent: function () {
        return (
            <div className="basic-wrap">
                {
                    this.renderLogin()
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
})
export default loginPage;