import React, { PropTypes } from 'react';
import { IndexLink, browserHistory } from 'react-router';
import _ from 'lodash';
import * as configName from '../../constants/configName';
import RIGHTS from '../../constants/rights';
import RS from '../../resources/resourceManager';
import { getUrlPath } from '../../core/utils/RoutesUtils';
import { URL } from '../../core/common/app.routes';
import MenuLeaf from './sideMenu/MenuLeaf';
import MenuEdge from './sideMenu/MenuEdge';
import NavbarSide from './sideMenu/NavbarSide';
import ClockInClockOutButton from '../pages/EmployeePortal/TimeClock/ClockInClockOutButton'
import ClockInClockOutButtonContainer from '../../containers/EmployeePortal/TimeClock/ClockInClockOutButtonContainer'
import LoadingIndicator from '../elements/LoadingIndicator/LoadingIndicator';
import { LOADING_INDICATOR } from '../../core/common/constants';
import { LOADING_INDICATOR_STYLE } from '../../core/common/config';
import PopupNotificationsContainer from '../../containers/Notification/PopupNotificationsContainer';
import toastr from 'toastr';
const menuValue = {
  EMPLOYEE_PORTAL: 0,
  SETTING: 1
};

class App extends React.Component {
  constructor(props, context, value) {
    super(props, context);
    this.state = { isAuthenticate: false, activedMenu: undefined };
  }

  activeNavBarMenu(routes) {
    let pathname = this.props.location.pathname;
    let existArr = [];

    _.map(routes, (route) => {
      if (route == URL.APP.path.substring(1)) {
        if (pathname.replace(/\//, '') == URL.APP.path.substring(1)) {
          existArr.push(route);
        }
      } else if (pathname.includes(route)) {
        existArr.push(route);
      }
    });

    if (existArr.length > 0) {
      return 'selected';
    } else {
      return '';
    }
  }

  switchPersonDemo() {
    console.log("switch clicked")
    this.switchPersonDemo();

  }

  createHomePageMenu() {
    return (
      <MenuEdge
        id="homepage"
        srcImg={require("../../images/menu/homepage-icon.png")}
        ulClassName="nav nav-second-level collapse"
        liClassName={this.activeNavBarMenu(['app'])}
        label={RS.getString('HOMEPAGE')}
        isNonChildMenu={true}
        onClick={this.onClickMenuItem.bind(this, URL.APP)}
      />
    )
  }

  createEmployeeMenu(value) {
    return (
      <MenuEdge
        id="employee-portal"
        srcImg={require("../../images/menu/employee-portal-icon.png")}
        ulClassName="nav nav-second-level collapse"
        liClassName={this.activeNavBarMenu(['employee-portal'])}
        label={RS.getString('EMPLOYEE_PORTAL')}
      >
        <MenuLeaf
          id={URL.EMPLOYEES.path}
          url={URL.EMPLOYEES}
          label={RS.getString('EMPLOYEES')}
          onClick={this.onClickMenuItem.bind(this, URL.EMPLOYEES)}
          right={RIGHTS.VIEW_EMPLOYEE}
          liClassName={this.activeNavBarMenu([URL.EMPLOYEES.path])}
        />
        <MenuEdge
          id="leave"
          ulClassName="nav nav-third-level collapse"
          label={RS.getString('LEAVE')}
          liClassName={this.activeNavBarMenu(['leave'])}
        >
          <MenuLeaf
            id={URL.MY_LEAVES.path}
            url={URL.MY_LEAVES}
            label={RS.getString('MY_LEAVES')}
            onClick={this.onClickMenuItem.bind(this, URL.MY_LEAVES)}
            right={RIGHTS.VIEW_MY_LEAVE}
            liClassName={this.activeNavBarMenu([URL.MY_LEAVES.path])}
          />
          <MenuLeaf
            id={URL.TEAM_LEAVES.path}
            url={URL.TEAM_LEAVES}
            label={RS.getString('TEAM_LEAVES')}
            onClick={this.onClickMenuItem.bind(this, URL.TEAM_LEAVES)}
            right={RIGHTS.VIEW_MEMBER_LEAVE}
            liClassName={this.activeNavBarMenu([URL.TEAM_LEAVES.path])}
          />
        </MenuEdge>
        <MenuEdge
          id="timesheet"
          ulClassName="nav nav-third-level collapse"
          label={RS.getString('TIMESHEET')}
          liClassName={this.activeNavBarMenu(['timesheet'])}
        >
          <MenuLeaf
            id={URL.MY_TIMESHEETS.path}
            url={URL.MY_TIMESHEETS}
            label={RS.getString('MY_TIMESHEET')}
            onClick={this.onClickMenuItem.bind(this, URL.MY_TIMESHEETS)}
            right={RIGHTS.VIEW_MY_TIMESHEET}
            liClassName={this.activeNavBarMenu([URL.MY_TIMESHEETS.path])}
          />
          <MenuLeaf
            id={URL.GROUP_TIMESHEETS.path}
            url={URL.GROUP_TIMESHEETS}
            label={RS.getString('EMPLOYEE_TIMESHEETS')}
            onClick={this.onClickMenuItem.bind(this, URL.GROUP_TIMESHEETS)}
            right={RIGHTS.VIEW_MEMBER_TIMESHEET}
            liClassName={this.activeNavBarMenu([URL.GROUP_TIMESHEETS.path])}
          />
        </MenuEdge>
        <MenuLeaf
          id={URL.OVERTIME.path}
          url={URL.OVERTIME}
          label={RS.getString('OVERTIME')}
          onClick={this.onClickMenuItem.bind(this, URL.OVERTIME)}
          right={RIGHTS.VIEW_MY_OVERTIME}
          liClassName={this.activeNavBarMenu([URL.OVERTIME.path])}
        />
        <MenuLeaf
          id={URL.ORGANIZATION.path}
          url={URL.ORGANIZATION}
          label={RS.getString('ORGANIZATION')}
          onClick={this.onClickMenuItem.bind(this, URL.ORGANIZATION)}
          right={RIGHTS.VIEW_GROUP}
          liClassName={this.activeNavBarMenu([URL.ORGANIZATION.path])}
        />
        {/* <MenuLeaf
          id={URL.OVERTIME.path}
          url={URL.OVERTIME}
          label={RS.getString('OVERTIME')}
          onClick={this.onClickMenuItem.bind(this, URL.OVERTIME)}
          right={RIGHTS.VIEW_MY_OVERTIME}
        />
        <MenuLeaf
          id={URL.ROLES.path}
          url={URL.ROLES}
          label={RS.getString('ROLES')}
          onClick={this.onClickMenuItem.bind(this, URL.ROLES)}
          right={RIGHTS.VIEW_ACCESS_ROLE}
        /> */}
      </MenuEdge>
    )
  }

  createSettingMenu() {
    return (
      <MenuEdge
        id="setting-menu"
        srcImg={require("../../images/menu/setting-icon.png")}
        ulClassName="nav nav-second-level collapse"
        label={RS.getString('SETTING')}
      >
        <MenuLeaf
          id={URL.SKILL_MANAGEMENT.path}
          url={URL.SKILL_MANAGEMENT}
          label={RS.getString('SKILL_MANAGEMENT')}
          onClick={this.onClickMenuItem.bind(this, URL.SKILL_MANAGEMENT)}
          right={RIGHTS.VIEW_JOBSKILL}
        />
        <MenuLeaf
          id={URL.JOBROLE_MANAGEMENT.path}
          url={URL.JOBROLE_MANAGEMENT}
          label={RS.getString('JOBROLE_MANAGEMENT', ['JOBROLE'])}
          onClick={this.onClickMenuItem.bind(this, URL.JOBROLE_MANAGEMENT)}
          right={RIGHTS.VIEW_JOBROLE}
        />
      </MenuEdge>
    )
  }
  createCustomerMenu(value) {
    return (
      <MenuEdge
        id="customer-portal"
        srcImg={require("../../images/menu/customer-portal-icon.png")}
        ulClassName="nav nav-second-level collapse"
        label={RS.getString('CUSTOMER_MANAGEMENT')}
        liClassName={this.activeNavBarMenu(['customer-portal'])}
      >
        <MenuLeaf
          id={URL.CUSTOMERS.path}
          url={URL.CUSTOMERS}
          label={RS.getString('CUSTOMERS')}
          onClick={this.onClickMenuItem.bind(this, URL.CUSTOMERS)}
          right={RIGHTS.VIEW_CUSTOMER}
          liClassName={this.activeNavBarMenu([URL.CUSTOMERS.path])}
        />
        <MenuLeaf
          id={URL.CONTRACTS.path}
          url={URL.CONTRACTS}
          label={RS.getString('CONTRACTS')}
          onClick={this.onClickMenuItem.bind(this, URL.CONTRACTS)}
          right={RIGHTS.VIEW_CONTRACT}
          liClassName={this.activeNavBarMenu([URL.CONTRACTS.path])}
        />
      </MenuEdge>
    )
  }

  createScheduleMenu() {
    return (
      <MenuEdge
        id="schedules-management"
        srcImg={require("../../images/menu/schedule-icon.png")}
        ulClassName="nav nav-second-level collapse"
        label={RS.getString('SCHEDULE')}
        liClassName={this.activeNavBarMenu(['schedule'])}
      >
        <MenuLeaf
          id={URL.SCHEDULES.path}
          url={URL.SCHEDULES}
          label={RS.getString('SCHEDULES')}
          onClick={this.onClickMenuItem.bind(this, URL.SCHEDULES)}
          right={RIGHTS.VIEW_SCHEDULE}
          liClassName={this.activeNavBarMenu([URL.SCHEDULES.path])}
        />
        <MenuLeaf
          id={URL.MY_SCHEDULE.path}
          url={URL.MY_SCHEDULE}
          label={RS.getString('MY_SCHEDULE')}
          onClick={this.onClickMenuItem.bind(this, URL.MY_SCHEDULE)}
          right={RIGHTS.VIEW_MY_SCHEDULE}
          liClassName={this.activeNavBarMenu([URL.MY_SCHEDULE.path])}
        />
      </MenuEdge>
    )
  }
  createLocationServicesMenu() {
    return (
      <MenuEdge
        id="location-control"
        srcImg={require("../../images/menu/location-services-icon.png")}
        ulClassName="nav nav-second-level collapse"
        label={RS.getString('LOCATION_CONTROL')}
        liClassName={this.activeNavBarMenu(['location-control'])}
      >
        <MenuLeaf
          id={URL.LOCATION.path}
          url={URL.LOCATION}
          label={RS.getString('LOCATION')}
          onClick={this.onClickMenuItem.bind(this, URL.LOCATION)}
          right={RIGHTS.VIEW_LOCATION}
          liClassName={this.activeNavBarMenu([URL.LOCATION.path])}
        />
        <MenuEdge
          id="handset"
          ulClassName="nav nav-third-level collapse"
          label={RS.getString('HANDSETS')}
          liClassName={this.activeNavBarMenu(['handset'])}
        >
          <MenuLeaf
            id={URL.HANDSET_SUMMARY.path}
            url={URL.HANDSET_SUMMARY}
            label={RS.getString('HANDSET_SUMMARY')}
            onClick={this.onClickMenuItem.bind(this, URL.HANDSET_SUMMARY)}
            right={RIGHTS.VIEW_HANDSET}
            liClassName={this.activeNavBarMenu([URL.HANDSET_SUMMARY.path])}
          />
          <MenuLeaf
            id={URL.HANDSETS.path}
            url={URL.HANDSETS}
            label={RS.getString('HANDSET_LIST')}
            onClick={this.onClickMenuItem.bind(this, URL.HANDSETS)}
            right={RIGHTS.VIEW_HANDSET}
            liClassName={this.activeNavBarMenu([URL.HANDSETS.path])}
          />
        </MenuEdge>
      </MenuEdge>
    )
  }
  onClickMenuItem(url, component, e) {
    browserHistory.push(getUrlPath(url));
  }

  renderAppHeader() {
    return (
      <div className="app-header" >
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div id="btn-open-menu" className="navbar-header">
              <div className="btn-open-menu-container">
                <img src={require("../../images/menu/burger-button.png")} />
              </div>
            </div>
            <div className="navbar-header logo">
              <img src={require("../../images/iWFALogo.png")} onClick={() => browserHistory.push('/')} />
            </div>
            <ul className="nav navbar-top-links navbar-right">
              <ClockInClockOutButtonContainer />
              <li>
                <PopupNotificationsContainer />
              </li>
              <li>
                <a onClick={() => {toastr.remove(), this.props.logout(this.props.curEmp) }}>
                  <i className="fa fa-sign-out"></i> {RS.getString('LOG_OUT')}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }

  renderNavbarSideProfile() {
    let photoUrl = _.get(this.props.employeeInfo, "contactDetail.photoUrl")
    return (
      <li className={"profile-dropdown " + this.activeNavBarMenu([URL.MY_PROFILE.path])}>
        <a
          data-toggle="collapse"
          data-target="#profile-menu"
        >
          {
            photoUrl ?
              <img className="nav-avatar" src={API_FILE + photoUrl} />
              : <img className="nav-avatar" src={require("../../images/avatarDefault.png")} />
          }
          <div>
            <div className="profile-name">
              {
                  _.get(this.props.employeeInfo,'contactDetail.fullName','')
              }
              <span className="fa arrow"></span>
            </div>
            <div className="profile-job">
              {
                  _.get(this.props.employeeInfo,'job.jobRole.name','')
              }</div>
          </div>
        </a>
        <ul id="profile-menu" className="nav nav-second-level collapse">
          <MenuLeaf
            url={URL.MY_PROFILE}
            label={RS.getString('MY_PROFILE')}
            onClick={this.onClickMenuItem.bind(this, URL.MY_PROFILE)}
            employeeRights={this.props.curEmp.rights}
            liClassName={this.activeNavBarMenu([URL.MY_PROFILE.path])}
          />
          {/* <MenuLeaf
            url={URL.APPLICATION_SETTING}
            label={RS.getString('SETTING')}
            onClick={this.onClickMenuItem.bind(this, URL.APPLICATION_SETTING)}
            employeeRights={this.props.curEmp.rights}
          /> */}
          <li>
            <a>
              <span>{RS.getString('LANGUAGE')} </span>
              <span className="fa arrow"></span>
            </a>
            <ul className="nav collapse">
              <li><a className="no-selected" onClick={() => { this.props.changeLanguage(configName.ENGLISH) }}>{RS.getString('ENGLISH')}</a></li>
              <li><a className="no-selected" onClick={() => { this.props.changeLanguage(configName.VIETNAMESE) }}>{RS.getString('VIETNAMESE')}</a></li>
            </ul>
          </li>
        </ul>

      </li>
    )
  }

  renderNavbarSide() {
    return (
      <NavbarSide
        employeeRights={this.props.curEmp.rights}
      >
        {this.renderNavbarSideProfile()}
        {this.createHomePageMenu()}
        {this.createEmployeeMenu()}
        {this.createLocationServicesMenu()}
        {this.createScheduleMenu()}
        {this.createCustomerMenu()}
        {/* {this.createSettingMenu()} */}
      </NavbarSide>
    )
  }
  render() {
    return (
      <div>
        <div id="app-root" className="mini">
          {this.renderAppHeader()}
          <div className="page-wrapper">
            {this.renderNavbarSide()}
            <div className="page-children-container">
              {this.props.children}
            </div>
          </div>
        </div>
        <LoadingIndicator
          containerId={LOADING_INDICATOR.APP_LOADING_INDICATOR}
          config={LOADING_INDICATOR_STYLE.app}
        />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  switchPersonDemo: PropTypes.func,
  checkAuthenticate: PropTypes.func
};
App.contextTypes = {
  router: React.PropTypes.object.isRequired
}
export default App;
