import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GroupTimesheets from '../../../components/pages/EmployeePortal/Timesheet/GroupTimesheets';
import * as timesheetsActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common'
export const GroupTimeSheetsContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_MEMBER_TIMESHEET], this.props.curEmp, <GroupTimesheets {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTimeSheetsContainer);
