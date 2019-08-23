import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmployeeTimesheets from '../../../components/pages/EmployeePortal/Timesheet/EmployeeTimesheets';
import * as timesheetsActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common'
export const EmployeeTimeSheetsContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_MEMBER_TIMESHEET], this.props.curEmp, <EmployeeTimesheets {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    groupStatusTimesheets: state.timesheetsReducer.groupStatusTimesheets,
    groupTimesheets: state.timesheetsReducer.groupTimesheets,
    employeeTimesheets: state.timesheetsReducer.employeeTimesheets,
    payload: state.timesheetsReducer.payload,
    meta: state.timesheetsReducer.meta,
    timesheetsOfEmployee: state.timesheetsReducer.timesheetsOfEmployee,
    countErrorTimesheet: state.timesheetsReducer.countErrorTimesheet,
    countAllPending: state.timesheetsReducer.countAllPending,

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
)(EmployeeTimeSheetsContainer);
