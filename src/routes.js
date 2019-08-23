import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import { URL } from './core/common/app.routes'; 
import { getUrlPath } from './core/utils/RoutesUtils';
import AppContainer from './containers/Shared/AppContainer';
import PageContainer from './containers/Shared/PageContainer'; 
// import HomePage from './components/shared/HomePage';
// import FuelSavingsPage from './containers/FuelSavingsPage'; // eslint-disable-line import/no-named-as-default
import NotFoundPage from './components/shared/NotFoundPage.js';
import NotPermissionPage from './components/shared/NotPermissionPage.js';
// import NewLeaveContainer from './containers/EmployeePortal/Leave/NewLeaveContainer';
import EmployeeLeavesContainer from './containers/EmployeePortal/Leave/EmployeeLeavesContainer';
import MyLeavesContainer from './containers/EmployeePortal/Leave/MyLeavesContainer';
import LocationsContainer from './containers/LocationControl/LocationsContainer';
import NewEmployeeContainer from './containers/EmployeePortal/NewEmployeeContainer';
import RejoinEmployeeContainer from './containers/EmployeePortal/RejoinEmployeeContainer';
import ViewEditEmployeeContainer from './containers/EmployeePortal/ViewEditEmployeeContainer';
import MyProfileContainer from './containers/EmployeePortal/MyProfileContainer';
import EmployeesContainer from './containers/EmployeePortal/EmployeesContainer';
import Test from './components/pages/bootstrap/Test'
import LoginContainer from './containers/Login/LoginContainer';
import ForgotPasswordContainer from './containers/Login/ForgotPasswordContainer';
import FirstLoginContainer from './containers/Login/FirstLoginContainer';
import ChangePasswordContainer from './containers/Login/ChangePasswordContainer';
import ApplicationSettingContainer from './containers/ApplicationSetting/ApplicationSettingContainer';
import SchedulesContainer from './containers/Schedule/SchedulesContainer';
import ScheduleDetailContainer from './containers/Schedule/ScheduleDetailContainer';
import MyScheduleContainer from './containers/Schedule/MyScheduleContainer';
import { requireAuthentication } from './containers/Shared/AuthenticatedContainer'
import HomePage from './components/shared/HomePage';
import * as routeConfig from './constants/routeConfig';
import OvertimeMasterPageContainer from './containers/EmployeePortal/Overtime/OvertimeMasterPageContainer';
import NewOvertimeContainer from './containers/EmployeePortal/Overtime/NewOvertimeContainer';
import MyTimesheetContainer from './containers/EmployeePortal/Timesheet/MyTimesheetContainer';
import EmployeeTimeSheetsContainer from './containers/EmployeePortal/Timesheet/EmployeeTimesheetContainer';
import EmployeeTimeSheetHistoryDetailContainer from './containers/EmployeePortal/Timesheet/EmployeeTimeSheetHistoryDetailContainer';
import GroupTimeSheetsContainer from './containers/EmployeePortal/Timesheet/GroupTimesheetContainer';
import NewContractContainer from './containers/CustomerManagement/ContractManagement/NewContractContainer';
import EmployeeOrganizationContainer from './containers/EmployeePortal/Organization/EmployeeOrganizationContainer';
import CustomersContainer from './containers/CustomerManagement/Customer/CustomersContainer';
import CustomersDetailContainer from './containers/CustomerManagement/Customer/CustomersDetailContainer';
import ContractsContainer from './containers/CustomerManagement/ContractManagement/ContractsContainer';
import ContractDetailContainer from './containers/CustomerManagement/ContractManagement/ContractDetailContainer';
import ContractAppendixContainer from './containers/CustomerManagement/ContractManagement/ContractAppendixContainer';

import NewCustomerContainer from './containers/CustomerManagement/Customer/NewCustomerContainer';
import NotificationsContainer from './containers/Notification/NotificationsContainer';
import NotificationDetailContainer from './containers/Notification/NotificationDetailContainer';
import HandsetSummaryContainer from './containers/Handset/HandsetSummaryContainer';
import HandsetsContainer from './containers/Handset/HandsetsContainer';
import EditHandsetContainer from './containers/Handset/EditHandsetContainer';
import GroupTimesheetsHistoryContainer from './containers/EmployeePortal/Timesheet/GroupTimesheetsHistoryContainer';

export default (
  <Route path="/" component={PageContainer}>
    <IndexRedirect to="/app" />
    <Route path={routeConfig.APP} component={AppContainer} >
      <IndexRoute component={requireAuthentication(HomePage)} />

      <Route path={URL.MY_PROFILE.path} component={requireAuthentication(MyProfileContainer)} />
      <Route path={URL.EMPLOYEES.path} component={requireAuthentication(EmployeesContainer)} />
      <Route path={URL.EMPLOYEE.path} component={requireAuthentication(ViewEditEmployeeContainer)} />
      <Route path={URL.NEW_EMPLOYEE.path} component={requireAuthentication(NewEmployeeContainer)} />
      <Route path={URL.MY_LEAVES.path} component={requireAuthentication(MyLeavesContainer)} />
      {/* <Route path={URL.NEW_LEAVE.path} component={requireAuthentication(NewLeaveContainer)} /> */}
      <Route path={URL.TEAM_LEAVES.path} component={requireAuthentication(EmployeeLeavesContainer)} />
      <Route path={URL.MY_TIMESHEETS.path} component={requireAuthentication(MyTimesheetContainer)} />
      <Route path={URL.GROUP_TIMESHEETS.path} component={requireAuthentication(GroupTimeSheetsContainer)} />
      <Route path={URL.GROUP_TIMESHEETS_DETAIL.path} component={requireAuthentication(EmployeeTimeSheetsContainer)} />
      <Route path={URL.GROUP_TIMESHEET_HISTORY_DETAIL.path} component={requireAuthentication(EmployeeTimeSheetHistoryDetailContainer)} />
      <Route path={URL.OVERTIME.path} component={requireAuthentication(OvertimeMasterPageContainer)} />
      <Route path={URL.NEW_OVERTIME.path} component={requireAuthentication(NewOvertimeContainer)} />
      <Route path={URL.ORGANIZATION.path} component={requireAuthentication(EmployeeOrganizationContainer)} />

      <Route path={URL.CUSTOMERS.path} component={requireAuthentication(CustomersContainer)} />
      <Route path={URL.CUSTOMERS_DETAIL.path} component={requireAuthentication(CustomersDetailContainer)} />
      <Route path={URL.NEW_CUSTOMER.path} component={requireAuthentication(NewCustomerContainer)} />
      <Route path={URL.CONTRACTS.path} component={requireAuthentication(ContractsContainer)} />
      <Route path={URL.CONTRACT.path} component={requireAuthentication(ContractDetailContainer)} />
      <Route path={URL.CONTRACT_APPENDIX.path} component={requireAuthentication(ContractAppendixContainer)} />   
      <Route path={URL.NEW_CONTRACT.path} component={requireAuthentication(NewContractContainer)} />

      <Route path={URL.SCHEDULE.path} component={requireAuthentication(ScheduleDetailContainer)} />
      <Route path={URL.SCHEDULES.path} component={requireAuthentication(SchedulesContainer)} />
      <Route path={URL.MY_SCHEDULE.path} component={requireAuthentication(MyScheduleContainer)} />
      <Route path={URL.NOTIFICATIONS.path} component={requireAuthentication(NotificationsContainer)} />
      <Route path={URL.NOTIFICATION_DETAILS.path} component={requireAuthentication(NotificationDetailContainer)} />

      <Route path={URL.APPLICATION_SETTING.path} component={requireAuthentication(ApplicationSettingContainer)} >
      </Route>

      <Route path={routeConfig.TEST} component={Test} />
      <Route path={URL.LOCATION.path} component={requireAuthentication(LocationsContainer)} />
      <Route path={URL.HANDSET_SUMMARY.path} component={requireAuthentication(HandsetSummaryContainer)} />
      <Route path={URL.HANDSETS.path} component={requireAuthentication(HandsetsContainer)} />
      <Route path={URL.EDIT_HANDSET.path} component={requireAuthentication(EditHandsetContainer)} />
      <Route path={URL.TIMESHEETS_HISTORY.path} component={requireAuthentication(GroupTimesheetsHistoryContainer)} />
      {/*
      <Route path={routeConfig.LEAVE_SETTING} component={createMenu(requireAuthentication(Setting))} />*/}
      {/*
      <Route path={routeConfig.APPLICATION_SETTING} component={createMenu(requireAuthentication(ApplicationSettingContainer))} >
        <Route path={routeConfig.LEAVE_MANAGEMENT} component={requireAuthentication(LeaveManagementContainer)} />
    </Route>*/}
      <Route path={URL.REJOIN_EMPLOYEE.path} component={requireAuthentication(RejoinEmployeeContainer)} />
    </Route>
    <Route path={routeConfig.LOGIN} component={LoginContainer} />
    <Route path={routeConfig.FORGOT_PASSWORD} component={ForgotPasswordContainer} />
    <Route path={routeConfig.FIRSTLOGIN} component={FirstLoginContainer} />
    <Route path={routeConfig.CHANGE_PASSWORD} component={ChangePasswordContainer} />
    <Route path={URL.NOT_PERMISSION.path} component={NotPermissionPage} />
    <Route path="*" component={NotFoundPage} />
  </Route >

);
