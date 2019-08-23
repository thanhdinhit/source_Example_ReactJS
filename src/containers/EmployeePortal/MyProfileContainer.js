import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as employeeActions from '../../actions/employeeActions';
import * as myProfileActions from '../../actions/myProfileActions';
import * as regionSettingAction from '../../actions/regionSettingAction';
import * as userRoleActions from '../../actions/userRoleActions';
import * as uploadActions from '../../actions/uploadActions';
import MyProfile from '../../components/pages/EmployeePortal/MyProfile';
import * as globalAction from '../../actions/globalAction';
import * as employeeSettingAction from '../../actions/employeeSettingAction';
import EmergencyContacts from '../../components/pages/EmployeePortal/EmergencyContacts';
import * as emergencyContactActions from '../../actions/emergencyContactActions';
import * as locationActions from '../../actions/locationActions';
import * as geographicActions from '../../actions/geographicActions';

export const MyProfileContainer = React.createClass({

  render: function () {
    return (
      <div>
        <MyProfile {...this.props} />
      </div>
    );
  }
});

function mapStateToProps(state) {
  const { cities, districts, states } = state.geographicReducer;
  return {
    myProfile: state.authReducer.employeeInfo,
    curEmp: state.authReducer.curEmp,
    payload: state.authReducer.payload,
    availabilitySetting: state.employeeReducer.availabilitySetting,
    workingTimeSetting: state.employeeReducer.workingTimeSetting,
    emergencyContacts : state.employeeReducer.emergencyContacts,
    cities,
    districts,
    states
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteEmergencyContact: bindActionCreators(myProfileActions.deleteEmergencyContact, dispatch),
    updateEmployeeDto: bindActionCreators(employeeActions.updateEmployeeDto, dispatch),
    loadAvailabilitySetting: bindActionCreators(employeeSettingAction.loadAvailabilitySetting, dispatch),
    loadWorkingTimeSetting: bindActionCreators(employeeSettingAction.loadWorkingTimeSetting, dispatch),
    uploadAvatar: bindActionCreators(myProfileActions.uploadAvatar, dispatch),
    loadMyProfile: bindActionCreators(myProfileActions.loadMyProfile, dispatch),
    loadMyProfileTime: bindActionCreators(myProfileActions.loadMyProfileTime, dispatch),
    loadMyProfileAttachment: bindActionCreators(myProfileActions.loadMyProfileAttachment, dispatch),
    loadMyProfileJobRoleSkills: bindActionCreators(myProfileActions.loadMyProfileJobRoleSkills, dispatch),
    loadMyProfileContactDetail: bindActionCreators(myProfileActions.loadMyProfileContactDetail, dispatch),
    emergencyContactActions: bindActionCreators(emergencyContactActions, dispatch),
    editMyProfile: bindActionCreators(myProfileActions.editMyProfile, dispatch),
    editMyProfileContactDetail: bindActionCreators(myProfileActions.editMyProfileContactDetail, dispatch),
    resetError: bindActionCreators(globalAction.resetError, dispatch),
    resetState: bindActionCreators(globalAction.resetState, dispatch),
    loadLocations: bindActionCreators(locationActions.loadLocations, dispatch),
    loadCities: bindActionCreators(geographicActions.loadCities, dispatch),
    loadDistricts: bindActionCreators(geographicActions.loadDistricts, dispatch),
    loadStates: bindActionCreators(geographicActions.loadStates, dispatch),
    loadEmployeeHandsets: bindActionCreators(employeeActions.loadEmployeeHandsets, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfileContainer);