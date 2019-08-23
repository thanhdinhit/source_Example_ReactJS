import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GroupTimesheetsHistory from '../../../components/pages/EmployeePortal/Timesheet/GroupTimesheetsHistory';
import * as timesheetsActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common'
export const GroupTimesheetsHistoryContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_MEMBER_TIMESHEET], this.props.curEmp, <GroupTimesheetsHistory {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    groups: state.groupReducer.groups,
    curEmp: state.authReducer.curEmp,
    payload: state.timesheetsReducer.payload,
    meta: state.timesheetsReducer.meta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    timesheetsActions: bindActionCreators(timesheetsActions, dispatch),
    globalAction: bindActionCreators(globalAction, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTimesheetsHistoryContainer);
