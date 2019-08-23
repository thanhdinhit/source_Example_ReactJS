import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import ChangePasswordComponent from '../../components/pages/Login/ChangePassword';
import * as globalAction from '../../actions/globalAction';

export const ChangePasswordContainer = React.createClass({

  render: function () {
    return (
        <ChangePasswordComponent {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    curEmp: state.authReducer.curEmp,
    payload: state.authReducer.payload,
    isValidToken: state.authReducer.isValidToken,
    afterChangePassword: state.authReducer.afterChangePassword
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkValidToken: bindActionCreators(authenticateActions.checkValidToken, dispatch),
    changeForgetPassword: bindActionCreators(authenticateActions.changeForgetPassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordContainer);
