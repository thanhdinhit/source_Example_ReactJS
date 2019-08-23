import React from 'react';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import RaisedButton from '../../elements/RaisedButton'
import { browserHistory } from 'react-router';
import Preloader from '../../elements/Preloader';
import MyCheckBox from '../../elements/MyCheckBox';
import toastr from 'toastr';
import RS from '../../../resources/resourceManager';
import stringUltil from '../../../utils/stringUtil';
import { REGEX_PASSWORD } from '../../../core/common/constants';
import Constraints from '../../../validation/common.constraints';

const errorStyle = {
    bottom: '-8px',
    position: 'absolute'
}
let firstLoginPage = React.createClass({

    componentDidMount: function () {

    },
    componentDidUpdate: function () {
        if (localStorage.getItem('firstLogin') != 'true') {
            browserHistory.push('/');
        }
        if (this.props.payload.success) {

            this.props.resetState();
        }
        else if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            // toastr.error(this.props.payload.error.message, "Error");
            // this.addNotificationError(this.props.payload.error.message);
            this.setState({ warning: this.props.payload.error.message })
            this.props.resetError();
        }
    },
    getInitialState: function () {
        return {
            errorPassword: '',
            password: '',
            confirmPassword: '',
            errorConfirmPassword: '',
            warning: ''
        }
    },

    componentWillMount: function () {
        if (this.props.payload.isAuthenticated) {
            browserHistory.push('/')
        }
    },

    handlePasswordBlur: function (password) {
        let valid = true;
        let msg = '';

        if (password == '') {
            msg = RS.getString('E117');
            valid = false;
        }

        if (valid && password.length < 6) {
            msg = RS.getString('E119');
            valid = false;
        }

        if (valid && this.newPassword.validate() === false) {
            msg = RS.getString('E118');
            valid = false;
        }

        if (valid) {
            msg = '';
        }

        this.setState({
            password: password,
            errorPassword: msg
        });

        return valid;
    },
    handleConfirmPasswordBlur: function (password) {
        let valid = true;
        let msg = '';

        if (password == '') {
            msg = RS.getString('E138');
            valid = false;
        }

        if (valid && password.length < 6) {
            msg = RS.getString('E119');
            valid = false;
        }

        if (valid && this.confirmPassword.validate() === false) {
            msg = RS.getString('E118');
            valid = false;
        }

        if (valid) {
            msg = '';
        }

        this.setState({
            confirmPassword: password,
            errorConfirmPassword: msg
        });

        return valid;
    },

    handleClick: function () {
        let valid = true;

        let validPassword = this.handlePasswordBlur(this.state.password);
        let validConfirmPassword = this.handleConfirmPasswordBlur(this.state.confirmPassword);

        if (validPassword && validConfirmPassword) {
            if (this.state.password != this.state.confirmPassword) {
                this.setState({ warning: 'E120' });
                valid = false;
            }
        }
        else {
            valid = false;
        }

        if (valid) {
            this.props.firstChangePassword(this.props.curEmp, this.props.dataLogin, this.state.password, true, this.props.location.query.next);
        }
    },
    handleOkButton: function () {
        browserHistory.push('/');
        localStorage.removeItem('firstLogin');
    },
    handleKeyPress: function (e) {
        if (e.key === 'Enter') {
            this.handleClick();
        }
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

    renderChangePassword: function () {
        return (
            <div className="basic-wrap__content">
                <div className="login-form">
                    <div className="login-form__content">
                        <div className="form__content-logo">
                            <img src={require('../../../images/iWFALogo.png')} />
                        </div>
                        <div className="change-password-form__notes">
                            <p>{RS.getString('P101')}</p>
                            <p>{RS.getString('P102')}</p>
                        </div>
                        {
                            this.state.warning ?
                                <div className="form__content-error">
                                    <img src={require("../../../images/error-icon.png")} />
                                    <p>{RS.getString(this.state.warning)}</p>
                                </div> : ''
                        }
                        <div className={"row form__content-input "}>
                            <div className="col-md-12 col-sm-12 mg-bttom-20">
                                <CommonTextField
                                    required
                                    title={stringUltil.capitalizeFirstLetter(RS.format('NEW_PASSWORD', ['NEW', 'PASSWORD']))}
                                    id="newPassword"
                                    defaultValue={this.state.password || ''}
                                    value={this.state.password}
                                    ref={(input) => this.newPassword = input}
                                    type="password"
                                    errorText={this.state.errorPassword}
                                    onBlur={this.handlePasswordBlur}
                                    onKeyPress={this.handleKeyPress}
                                    constraint={Constraints.format(REGEX_PASSWORD, RS.getString('E118'))}
                                />
                            </div>
                            <div className="col-md-12 col-sm-12 mg-bttom-20">
                                <CommonTextField
                                    required
                                    title={stringUltil.capitalizeFirstLetter(RS.format('CONFIRM_PASSWORD', ['CONFIRM', 'PASSWORD']))}
                                    id="confirmPassword"
                                    defaultValue={this.state.confirmPassword || ''}
                                    value={this.state.confirmPassword}
                                    ref={(input) => this.confirmPassword = input}
                                    type="password"
                                    errorText={this.state.errorConfirmPassword}
                                    onBlur={this.handleConfirmPasswordBlur}
                                    onKeyPress={this.handleKeyPress}
                                    constraint={Constraints.format(REGEX_PASSWORD, RS.getString('E118'))}
                                />
                            </div>
                        </div>

                        <div className="form__btn">
                            <RaisedButton
                                label={RS.getString('CHANGE_PASSWORD')}
                                onClick={this.handleClick}
                                className="raised-button-large" />
                        </div>
                    </div>
                </div>
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
    renderOkContent: function () {
        return (
            <div className="basic-wrap__content">
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
                                onClick={this.handleOkButton}
                                className="raised-button-large" />
                        </div>
                    </div>
                </div>
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
    renderContent: function () {
        return (
            <div className="basic-wrap">
                {this.props.payload.isAuthenticated ? this.renderOkContent() : this.renderChangePassword()}
                {this.props.payload.isLoading ? this.renderLoading() : ''}
            </div>
        );
    },
    render: function () {
        return (
            <div className="first-login authen-content">
                {this.renderContent()}
            </div>
        );
    }
});
export default firstLoginPage;