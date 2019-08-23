import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scheduleAction from '../../actions/scheduleAction';
import * as contractAction from '../../actions/contractActions';
import ScheduleDetail from '../../components/pages/Schedule/ScheduleDetail';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common';
import RIGHTS from '../../constants/rights';
import * as jobRoleSettingAction from '../../actions/jobRoleSettingAction';
import * as employeeActions from '../../actions/employeeActions';
import * as groupActions from '../../actions/groupActions';
import * as shiftTemplateSettingActions from '../../actions/shiftTemplateSettingAction';

export const ScheduleDetailContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_SCHEDULE], this.props.curEmp, <ScheduleDetail {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    scheduleEmployeeView: state.scheduleReducer.scheduleEmployeeView,
    scheduleShiftView: state.scheduleReducer.scheduleShiftView,
    schedule: state.scheduleReducer.schedule,
    contracts: state.contractReducer.contracts,
    curEmp: state.authReducer.curEmp,
    payload: state.scheduleReducer.payload,
    meta: state.scheduleReducer.meta,
    jobRoles: state.settingReducer.jobRoles,
    employeesToAssign: state.employeeReducer.employeesToAssign,
    groupSubs: state.groupReducer.groupSubs,
    contractGroup: state.scheduleReducer.contractGroup,
    scheduleSubGroups: state.scheduleReducer.scheduleSubGroups,
    managedGroups: state.groupReducer.managedGroups,
    shiftTemplates: state.settingReducer.shiftTemplates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSchedule: bindActionCreators(scheduleAction.loadSchedule, dispatch),
    loadEmployeSchedules: bindActionCreators(scheduleAction.loadEmployeSchedules, dispatch),
    loadAllContract: bindActionCreators(contractAction.loadAllContract, dispatch),
    resetScheduleState: bindActionCreators(globalAction.resetScheduleState, dispatch),
    resetScheduleShiftViewState: bindActionCreators(scheduleAction.resetScheduleShiftViewState, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
    jobRoleSettingAction: bindActionCreators(jobRoleSettingAction, dispatch),
    loadEmployeeAssigns: bindActionCreators(employeeActions.loadEmployeeAssigns, dispatch),
    loadGroupSubs: bindActionCreators(groupActions.loadGroupSubs, dispatch),
    loadManagedGroups: bindActionCreators(groupActions.loadManagedGroups, dispatch),
    shiftTemplateSettingActions: bindActionCreators(shiftTemplateSettingActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleDetailContainer);

