import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyLeaves from '../../../components/pages/EmployeePortal/Leave/MyLeaves';
import * as leaveActions from '../../../actions/leaveActions';
import * as globalAction from '../../../actions/globalAction';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';
import * as myProfileActions from '../../../actions/myProfileActions';

export const MyLeavesContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_MY_LEAVE], this.props.curEmp,  <MyLeaves {...this.props} />, this.props.location.pathname)

    );
  }
});

function mapStateToProps(state) {
  return {
    myLeaves: state.leaveReducer.myLeaves,
    curEmp: state.authReducer.curEmp,
    payload: state.leaveReducer.payload,
    meta: state.leaveReducer.meta,
    leaveHours: state.leaveReducer.leaveHours,
    leaveBalances: state.leaveReducer.leaveBalances,
    approvers: state.authReducer.approvers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveActions: bindActionCreators(leaveActions, dispatch),
    globalAction: bindActionCreators(globalAction, dispatch),
    getApprovers: bindActionCreators(myProfileActions.getApprovers, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLeavesContainer);
