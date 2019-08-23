import React from 'react';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import RaisedButton from '../../elements/RaisedButton'
import { browserHistory } from 'react-router';
import Preloader from '../../elements/Preloader';
import MyCheckBox from '../../elements/MyCheckBox';
import toastr from 'toastr';
import { LOGIN } from '../../../constants/routeConfig';
import RS from '../../../resources/resourceManager';
import stringUltil from '../../../utils/stringUtil';
import { REGEX_PASSWORD } from '../../../core/common/constants';
import Constraints from '../../../validation/common.constraints';

let changePasswordPage = React.createClass({

    componentDidMount: function () {

    },
    componentDidUpdate: function () {
        if (this.props.payload.success) {
            if(this.props.afterChangePassword) {
                browserHistory.push('/login');
                this.props.resetState();
            }
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
            warning: '',
            expired: false
        }
    },

    componentWillMount: function () {
        if (this.props.payload.isAuthenticated) {
            browserHistory.push('/')
        }
        else {

            if (!this.props.location.query.k) {
                browserHistory.replace('/page_not_found')
            }
            else {
                this.props.checkValidToken(this.props.location.query.k);
            }

        }
    },

    handlePasswordChange: function (event, password) {
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
            errorPassword: msg,
            warning: false
        });

        return valid;
    },
    handleConfirmPasswordChange: function (event, password) {
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
            errorConfirmPassword: msg,
            warning: false
        });

        return valid;
    },

    handleClick: function () {
        let valid = true;

        let validPassword = this.handlePasswordChange(null, this.state.password);
        let validConfirmPassword = this.handleConfirmPasswordChange(null, this.state.confirmPassword);

        if (validPassword && validConfirmPassword) {
            if (this.state.password != this.state.confirmPassword) {
                this.setState({ warning: 'E120'})
                valid = false;
            }
        }
        else {
            valid = false;
        }

        if (valid) {
            this.props.changeForgetPassword(this.props.location.query.k, this.state.password, LOGIN);
        }

    },
    handleBackToLoginPage: function () {
        browserHistory.push('/login');
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
        let classError = this.state.warning || this.state.errorForgotPassword ? 'is--error' : '';

        return (
            <div className='basic-wrap__content'>
                <div className="change-password-form">
                    <div className="change-password-form__title"> {RS.getString('CHANGE_PASSWORD')} </div>
                    <div className="change-password-form__notes">
                        <p>{RS.getString('P104')}</p>
                        <p>{RS.getString('P102')}</p>
                    </div>
                    {
                        this.state.warning ?
                            <div className="form__content-error">
                                <img src={require("../../../images/error-icon.png")} />
                                <p>{RS.getString(this.state.warning)}</p>
                            </div> : ''
                    }
                    <div className={"row form__content-input " + classError}>
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
                                onChange={this.handlePasswordChange}
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
                                onChange={this.handleConfirmPasswordChange}
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
        )
    },
    renderExpiredContent: function () {
        return (
            <div className='expired-content'>
                <div className="expired-content__wrap">
                    <div className='expired-content__img'>
                        <img src={require('../../../images/broken-link.png')} />
                    </div>
                    <div className='expired-content__title'>
                        {RS.getString('EXPIRED')}
                    </div>
                    <div className='expired-content__msg'>
                        {RS.getString('P105')}
                    </div>
                    <div className="expired-content__btn text-right">
                        <RaisedButton
                            label={RS.getString("BACK_TO_LOGIN")}
                            icon={<i className="icon-back-arrow" aria-hidden="true"></i>}
                            onClick={this.handleBackToLoginPage}
                            className="raised-button-large" />
                    </div>
                </div>
            </div>
        )

    },
    renderContent: function () {
        let className = this.props.isValidToken ? '' : 'basic-wrap-expired';

        return (
            <div className={'basic-wrap ' + className}>
                {this.props.isValidToken ? this.renderChangePassword() : this.renderExpiredContent()}
                {this.props.payload.isLoading ? this.renderLoading() : ''}
            </div>
        )
    },
    render: function () {
        return (
            <div className='change-password authen-content'>
                {this.renderContent()}

            </div>
        )
    }
})
export default changePasswordPage;