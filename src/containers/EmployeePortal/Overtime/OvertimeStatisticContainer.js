import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OvertimeSttaistic from '../../../components/pages/EmployeePortal/Overtime/OvertimeStatistic';
import * as overtimeActions from '../../../actions/overtimeActions';
import * as jobRoleSettingAction from '../../../actions/jobRoleSettingAction';
import * as groupActions from '../../../actions/groupActions';
import * as globalAction from '../../../actions/globalAction';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common'
export const OvertimeStatisticContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_OVERTIME_STATISTIC], this.props.curEmp, <OvertimeSttaistic {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    jobRoles: state.settingReducer.jobRoles,
    groups: state.groupReducer.groups,
    overtimeSetting: state.overtimeReducer.overtimeSetting,
    overtimeStatistic: state.overtimeReducer.overtimeStatistic,
    curEmp: state.authReducer.curEmp,
    payload: state.overtimeReducer.payload,
    meta: state.overtimeReducer.meta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    overtimeActions: bindActionCreators(overtimeActions, dispatch),
    globalAction: bindActionCreators(globalAction, dispatch),
    loadJobRolesSetting: bindActionCreators(jobRoleSettingAction.loadJobRolesSetting, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OvertimeStatisticContainer);
