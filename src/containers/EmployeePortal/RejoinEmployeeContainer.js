import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as employeeActions from '../../actions/employeeActions';
import * as jobRoleSettingAction from '../../actions/jobRoleSettingAction';
import * as skillSettingAction from '../../actions/skillSettingAction';
import * as regionSettingAction from '../../actions/regionSettingAction';
import * as locationActions from '../../actions/locationActions';
import * as userRoleActions from '../../actions/userRoleActions';
import * as employeeTypeActions from '../../actions/employeeTypeActions';
import * as employeeSettingAction from '../../actions/employeeSettingAction';
import NewEmployee from '../../components/pages/EmployeePortal/NewEmployee/NewEmployee';
import * as globalAction from '../../actions/globalAction';
import * as authenticateActions from '../../actions/authenticateActions';
import * as groupActions from '../../actions/groupActions';
import * as geographicActions from '../../actions/geographicActions';

export const RejoinEmployeeContainer = React.createClass({
  render: function () {
    return (
      <NewEmployee
        {...this.props}
        submitEmployee={this.props.editEmployee}
        title="EMPLOYEE_REJOIN"
      />
    );

  }
});

function mapStateToProps(state) {
  const { requiredDocuments, jobRoles, skills, userRoles, shiftTemplates, regions, locations } = state.settingReducer;
  const { validated, newEmployee, employee, originEmployee, avatarName, payload, error,
    success, employeeTypes, availabilitySetting, workingTimeSetting, validatedResult } = state.employeeReducer;
  const { curEmp } = state.authReducer;
  const { groups } = state.groupReducer;
  const { cities, districts, states } = state.geographicReducer;
  return {
    requiredDocuments,
    validated,
    validatedResult,
    newEmployee,
    employee,
    originEmployee,
    jobRoles,
    skills,
    userRoles,
    shiftTemplates,
    regions,
    locations,
    avatarName,
    curEmp,
    payload,
    error,
    success,
    employeeTypes,
    groups,
    availabilitySetting,
    workingTimeSetting,
    cities,
    districts,
    states
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateEmployeeDto: bindActionCreators(employeeActions.updateEmployeeDto, dispatch),
    resetNewEmployeeDto: bindActionCreators(employeeActions.resetNewEmployeeDto, dispatch),
    loadEmployee: bindActionCreators(employeeActions.loadEmployee, dispatch),
    validateFieldEmployee: bindActionCreators(employeeActions.validateFieldEmployee, dispatch),
    validateTotalFieldsEmployee: bindActionCreators(employeeActions.validateTotalFieldsEmployee, dispatch),
    editEmployee: bindActionCreators(employeeActions.editEmployee, dispatch),
    loadJobRolesSetting: bindActionCreators(jobRoleSettingAction.loadJobRolesSetting, dispatch),
    loadAllEmployeeTypes: bindActionCreators(employeeTypeActions.loadAllEmployeeTypes, dispatch),
    loadSkillsSetting: bindActionCreators(skillSettingAction.loadSkillsSetting, dispatch),
    loadUserRoleOptions: bindActionCreators(userRoleActions.loadUserRoleOptions, dispatch),
    loadLocations: bindActionCreators(locationActions.loadLocations, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch),
    loadCities: bindActionCreators(geographicActions.loadCities, dispatch),
    loadDistricts: bindActionCreators(geographicActions.loadDistricts, dispatch),
    loadStates: bindActionCreators(geographicActions.loadStates, dispatch),
    loadAvailabilitySetting: bindActionCreators(employeeSettingAction.loadAvailabilitySetting, dispatch),
    loadWorkingTimeSetting: bindActionCreators(employeeSettingAction.loadWorkingTimeSetting, dispatch),
    resetPassword: bindActionCreators(authenticateActions.resetPassword, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
    resetValidate: bindActionCreators(employeeActions.resetValidate, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RejoinEmployeeContainer);





