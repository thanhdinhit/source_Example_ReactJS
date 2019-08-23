import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import productReducer from './productReducer';
import { routerReducer } from 'react-router-redux';
import authReducer from './Auth/AuthEmployee';
import settingReducer from './Setting/SettingReducer';
import timesheetsReducer from './EmployeePortal/TimesheetsReducer';
import scheduleReducer from './Schedule/ScheduleReducer';
import employeeReducer from './EmployeePortal/EmployeeReducer';
import groupReducer from './Group/GroupReducer';
import applicationSettingReducer from './ApplicationSetting/ApplicationSettingReducer';
import roleReducer from './Roles/RoleReducer';
import uploadReducer from './Upload/UploadReducer';
import passwordReducer from './PasswordReducer/PasswordReducer';
import personalSettingsReducer from './ApplicationSetting/PersonalSettingReducer';
import terminationReducer from './EmployeePortal/TerminationReducer';
import geographicReducer from './Geographic/GeographicReducer';
import timeClockReducer from './EmployeePortal/TimeClockReducer';
import exportReducer from './Export/ExportReducer';
import handsetsReducer from './Handsets/HandsetsReducer';
import leaveReducer from './EmployeePortal/LeaveReducer';
import overtimeReducer from './EmployeePortal/OvertimeReducer';
import contractReducer from './CustomerManagement/ContractReducer';
import customerReducer from './CustomerManagement/CustomerReducer';
import notificationReducer from './Notification/NotificationReducer';
import {LOGOUT} from '../constants/actionTypes';

const appReducer = combineReducers({
  fuelSavings,
  productReducer,
  authReducer,
  settingReducer,
  routing: routerReducer,
  timesheetsReducer,
  scheduleReducer,
  employeeReducer,
  applicationSettingReducer,
  roleReducer,
  uploadReducer,
  groupReducer,
  passwordReducer,
  personalSettingsReducer,
  terminationReducer,
  geographicReducer,
  timeClockReducer,
  exportReducer,
  handsetsReducer,
  leaveReducer,
  overtimeReducer,
  contractReducer,
  customerReducer,
  notificationReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT ) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;


