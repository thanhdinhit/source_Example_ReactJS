import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import ForgotPasswordComponent from '../../components/pages/Login/ForgotPassword';
import * as globalAction from '../../actions/globalAction';

export const ForgotPasswordContainer = React.createClass({

  render: function () {
    return (
      <div>
        <ForgotPasswordComponent {...this.props} />
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    dataLogin: state.authReducer.dataLogin,
    curEmp: state.authReducer.curEmp,
    forgotPassword: state.authReducer.forgotPassword,
    payload: state.authReducer.payload
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: bindActionCreators(authenticateActions.forgotPassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordContainer);
