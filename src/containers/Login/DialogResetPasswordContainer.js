import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import DialogResetPassword from '../../components/pages/EmployeePortal/DialogResetPassword';
import * as globalAction from '../../actions/globalAction';

export const DialogResetPasswordContainer = React.createClass({
  render: function () {
    return (
      <DialogResetPassword {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    curEmp: state.authReducer.curEmp,
    payload: state.passwordReducer.payload,
    confirmPW: state.passwordReducer.confirmPW
  };
}

function mapDispatchToProps(dispatch) {
  return {
    confirmPassword: bindActionCreators(authenticateActions.confirmPassword, dispatch),
    resetPassword: bindActionCreators(authenticateActions.resetPassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogResetPasswordContainer);
