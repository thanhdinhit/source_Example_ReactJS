import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authenticateActions from '../../actions/authenticateActions';
import FirstLoginComponent from '../../components/pages/Login/FirstLogin';
import * as globalAction from '../../actions/globalAction';

export const LoginContainer = React.createClass({

  render: function () {
    return (
      <div>
        <FirstLoginComponent {...this.props}/>
      </div>
    );
  }
});

function mapStateToProps(state) {
    return {
      curEmp: state.authReducer.curEmp,
      payload: state.authReducer.payload,
      dataLogin: state.authReducer.dataLogin
    };
}

function mapDispatchToProps(dispatch) {
  return {
    firstChangePassword: bindActionCreators(authenticateActions.firstChangePassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
