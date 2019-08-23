import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import LoginComponent from '../../components/pages/Login/Login';
import * as globalAction from '../../actions/globalAction';

export const LoginContainer = React.createClass({

  render: function () {
    return (
      <div>
        <LoginComponent {...this.props} />
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    dataLogin: state.authReducer.dataLogin,
    curEmp: state.authReducer.curEmp,
    forgotPassword: state.authReducer.forgotPassword,
    payload: state.authReducer.payload,
    afterChangePassword: state.authReducer.afterChangePassword,
    contactDetail: state.authReducer.contactDetail
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(authenticateActions.login, dispatch),
    forgotPassword: bindActionCreators(authenticateActions.forgotPassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
    loginSuccess: bindActionCreators(authenticateActions.loginSuccess, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
