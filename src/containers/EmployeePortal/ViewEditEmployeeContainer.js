import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as employeeActions from '../../actions/employeeActions';
import ViewEditEmployee from '../../components/pages/EmployeePortal/ViewEditEmployee';
import * as globalAction from '../../actions/globalAction';
import * as employeeSettingAction from '../../actions/employeeSettingAction';
import { authorization } from '../../services/common';
import RIGHTS from '../../constants/rights';
import * as userRoleActions from '../../actions/userRoleActions';
import * as employeeTypeActions from '../../actions/employeeTypeActions';
import * as groupActions from '../../actions/groupActions';
import * as skillSettingAction from '../../actions/skillSettingAction';
import * as jobRoleSettingAction from '../../actions/jobRoleSettingAction';
import * as terminationActions from '../../actions/terminationActions';
import * as emergencyContactActions from '../../actions/emergencyContactActions';
import * as locationActions from '../../actions/locationActions';
import * as geographicActions from '../../actions/geographicActions';

export const ViewEditEmployeeContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_EMPLOYEE], this.props.curEmp, <ViewEditEmployee {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  let { employee, originEmployee, payload, availabilitySetting, workingTimeSetting,
    employeeTypes, validated, validatedResult, emergencyContacts, employeeTransfers } = state.employeeReducer;
  let { curEmp } = state.authReducer;
  const { jobRoles, skills, userRoles, regions, locations } = state.settingReducer;
  const { groups } = state.groupReducer;
  const { cities, districts, states } = state.geographicReducer;

  return {
    employee,
    originEmployee,
    curEmp,
    payload,
    availabilitySetting,
    workingTimeSetting,
    userRoles,
    employeeTypes,
    groups,
    validated,
    skills,
    jobRoles,
    emergencyContacts,
    validatedResult,
    regions,
    locations,
    cities,
    districts,
    states,
    employeeTransfers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAvailabilitySetting: bindActionCreators(employeeSettingAction.loadAvailabilitySetting, dispatch),
    loadWorkingTimeSetting: bindActionCreators(employeeSettingAction.loadWorkingTimeSetting, dispatch),
    uploadAvatar: bindActionCreators(employeeActions.uploadAvatar, dispatch),
    loadEmployee: bindActionCreators(employeeActions.loadEmployee, dispatch),
    editEmployee: bindActionCreators(employeeActions.editEmployee, dispatch),
    loadUserRoleOptions: bindActionCreators(userRoleActions.loadUserRoleOptions, dispatch),
    loadAllEmployeeTypes: bindActionCreators(employeeTypeActions.loadAllEmployeeTypes, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    validateFieldEmployee: bindActionCreators(employeeActions.validateFieldEmployee, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
    resetValidate: bindActionCreators(employeeActions.resetValidate, dispatch),
    loadSkillsSetting: bindActionCreators(skillSettingAction.loadSkillsSetting, dispatch),
    loadJobRolesSetting: bindActionCreators(jobRoleSettingAction.loadJobRolesSetting, dispatch),
    deleteEmployee: bindActionCreators(employeeActions.deleteEmployee, dispatch),
    getTerminations: bindActionCreators(terminationActions.getTerminations, dispatch),
    emergencyContactActions: bindActionCreators(emergencyContactActions, dispatch),
    loadLocations: bindActionCreators(locationActions.loadLocations, dispatch),
    loadCities: bindActionCreators(geographicActions.loadCities, dispatch),
    loadDistricts: bindActionCreators(geographicActions.loadDistricts, dispatch),
    loadStates: bindActionCreators(geographicActions.loadStates, dispatch),
    editEmployeeContactDetail: bindActionCreators(employeeActions.editEmployeeContactDetail, dispatch),
    validateTotalFieldsEmployee: bindActionCreators(employeeActions.validateTotalFieldsEmployee, dispatch),
    editEmployeeJob: bindActionCreators(employeeActions.editEmployeeJob, dispatch),
    editEmployeeTime: bindActionCreators(employeeActions.editEmployeeTime, dispatch),
    editEmployeePayRate: bindActionCreators(employeeActions.editEmployeePayRate, dispatch),
    loadEmployeeHandsets: bindActionCreators(employeeActions.loadEmployeeHandsets, dispatch),
    resetEmployeeDto: bindActionCreators(employeeActions.resetEmployeeDto, dispatch),
    loadEmployeeTransfers: bindActionCreators(employeeActions.loadEmployeeTransfers, dispatch),
    transferEmployee: bindActionCreators(employeeActions.transferEmployee, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewEditEmployeeContainer);