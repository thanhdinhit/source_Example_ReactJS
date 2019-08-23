import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import DialogChangePassword from '../../components/pages/EmployeePortal/DialogChangePassword';
import * as globalAction from '../../actions/globalAction';

export const DialogChangePasswordContainer = React.createClass({
  render: function () {
    return (
      <DialogChangePassword {...this.props}
        username={this.props.curEmp.userName}
      />
    );
  }
});

function mapStateToProps(state) {
  return {
    curEmp: state.authReducer.curEmp,
    payload: state.passwordReducer.payload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changePassword: bindActionCreators(authenticateActions.changePassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogChangePasswordContainer);
