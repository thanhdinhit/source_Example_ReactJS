import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as employeeActions from '../../actions/employeeActions';
import Employees from '../../components/pages/EmployeePortal/Employees';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common'
import RIGHTS from '../../constants/rights'
import * as jobRoleSettingAction from '../../actions/jobRoleSettingAction';
import * as roleAction from '../../actions/roleActions';
import * as employeeTypeAction from '../../actions/employeeTypeActions';
import * as groupActions from '../../actions/groupActions';
import * as locationSettingActions from '../../actions/locationActions';
import * as geographicActions from '../../actions/geographicActions';
import * as skillSettingAction from '../../actions/skillSettingAction';
import * as terminationActions from '../../actions/terminationActions';

export const EmployeesContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_EMPLOYEE], this.props.curEmp, <Employees {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  const {
    payload,
    employees,
    baseEmployees,
    employeeTypes,
    meta
   } = state.employeeReducer;
  return {
    employees,
    baseEmployees,
    employeeTypes,
    groups: state.groupReducer.groups,
    curEmp: state.authReducer.curEmp,
    jobRoles: state.settingReducer.jobRoles,
    roles: state.roleReducer.roles,
    regions: state.settingReducer.regions,
    locations: state.settingReducer.locations,
    payload,
    meta,
    cities: state.geographicReducer.cities,
    districts: state.geographicReducer.districts,
    states: state.geographicReducer.states,
    skills: state.settingReducer.skills,
    terminationReason: state.terminationReducer.terminationReason,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAllEmployee: bindActionCreators(employeeActions.loadAllEmployee, dispatch),
    loadAllBaseEmployee: bindActionCreators(employeeActions.loadAllBaseEmployee, dispatch),
    loadAllEmployeeTypes: bindActionCreators(employeeTypeAction.loadAllEmployeeTypes, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch),
    loadJobRolesSetting: bindActionCreators(jobRoleSettingAction.loadJobRolesSetting, dispatch),
    loadSkillsSetting: bindActionCreators(skillSettingAction.loadSkillsSetting, dispatch),
    loadRoles: bindActionCreators(roleAction.loadRoles, dispatch), 
    loadCities: bindActionCreators(geographicActions.loadCities, dispatch),
    loadDistricts: bindActionCreators(geographicActions.loadDistricts, dispatch),
    loadStates: bindActionCreators(geographicActions.loadStates, dispatch),
    loadLocations: bindActionCreators(locationSettingActions.loadLocations, dispatch),
    deleteEmployee: bindActionCreators(employeeActions.deleteEmployee, dispatch),
    getTerminationReason: bindActionCreators(terminationActions.getTerminationReason, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeesContainer);

