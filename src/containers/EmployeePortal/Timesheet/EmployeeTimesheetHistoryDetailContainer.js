import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmployeeTimesheetHistoryDetail from '../../../components/pages/EmployeePortal/Timesheet/EmployeeTimesheetHistoryDetail';
import * as timesheetsActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import * as employeeActions from '../../../actions/employeeActions';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const EmployeeTimesheetHistoryDetailContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_MEMBER_TIMESHEET], this.props.curEmp, <EmployeeTimesheetHistoryDetail {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    employeeTimesheetHistories: state.timesheetsReducer.employeeTimesheetHistories,
    timesheetHistoryOfEmployee: state.timesheetsReducer.timesheetHistoryOfEmployee,
    timesheetTypes: state.timesheetsReducer.timesheetTypes,
    group: state.groupReducer.group,
    employee: state.employeeReducer.employee,
    curEmp: state.authReducer.curEmp,
    payload: state.timesheetsReducer.payload,
    meta: state.timesheetsReducer.meta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    timesheetsActions: bindActionCreators(timesheetsActions, dispatch),
    globalAction: bindActionCreators(globalAction, dispatch),
    loadGroup: bindActionCreators(groupActions.loadGroup, dispatch),
    loadEmployee: bindActionCreators(employeeActions.loadEmployee, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeTimesheetHistoryDetailContainer);
