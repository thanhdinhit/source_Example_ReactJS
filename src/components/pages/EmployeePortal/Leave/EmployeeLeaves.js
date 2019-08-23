import React from 'react';
import Tabs from '../../../elements/HorizontalTabs/HorizontalTab';
import _ from 'lodash';
import { EMPLOYEE_LEAVES_TAB } from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import RequestList from './RequestList';
import LeaveBalance from './LeaveBalance';
import RIGHTS from "../../../../constants/rights";

class EmployeeLeaves extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curTab: EMPLOYEE_LEAVES_TAB.REQUEST_LIST,
    }
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.queryString = {
      [EMPLOYEE_LEAVES_TAB.REQUEST_LIST]: {},
      [EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE]: {}
    }
    this.filter = {
      [EMPLOYEE_LEAVES_TAB.REQUEST_LIST]: {},
      [EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE]: {}
    }

    this.tabs = []
    if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_MEMBER_LEAVE)) {
      this.tabs.push({
        value: EMPLOYEE_LEAVES_TAB.REQUEST_LIST,
        label: 'REQUEST_LIST'
      })
    }
    if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_LEAVE_STATISTIC)) {
      this.tabs.push({
        value: EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE,
        label: 'LEAVE_BALANCE'
      })
    }
  }

  handleChangeTab(value) {
    this.setState({ curTab: value })
  }

  convertToCorrectTabLanguage(tabs) {
    return tabs.map(function (tab) {
      tab.label = RS.getString(tab.label, null, Option.CAPEACHWORD);
      return tab;
    });
  }

  renderMenuTabs() {
    const tabs = this.convertToCorrectTabLanguage(_.cloneDeep(this.tabs));
    return (
      <Tabs
        ref={(tabs) => this.horizontalTabs = tabs}
        tabs={tabs}
        className="vertical-tabs"
        handleChangeTab={this.handleChangeTab}
        curTab={this.state.curTab}
        hold={this.state.isEdit}
      />
    );
  }
  handleOnChangeQueryTab(tab, queryString) {
    this.queryString[tab] = queryString
  }
  handleOnChangeFilterTab(tab, filter) {
    this.filter[tab] = filter
  }

  renderTab() {
    switch (this.state.curTab) {
      case EMPLOYEE_LEAVES_TAB.REQUEST_LIST: {
        return (
          <RequestList
            filter={this.filter[EMPLOYEE_LEAVES_TAB.REQUEST_LIST]}
            queryString={this.queryString[EMPLOYEE_LEAVES_TAB.REQUEST_LIST]}
            location={this.props.location}
            onChangeQueryString={this.handleOnChangeQueryTab.bind(this, EMPLOYEE_LEAVES_TAB.REQUEST_LIST)}
            onchangeFilter={this.handleOnChangeFilterTab.bind(this, EMPLOYEE_LEAVES_TAB.REQUEST_LIST)}
          />)
      }
      case EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE: {
        return (
          <LeaveBalance
            filter={this.filter[EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE]}
            queryString={this.queryString[EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE]}
            location={this.props.location}
            onChangeQueryString={this.handleOnChangeQueryTab.bind(this, EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE)}
            onchangeFilter={this.handleOnChangeFilterTab.bind(this, EMPLOYEE_LEAVES_TAB.LEAVE_BALANCE)}
          />)

      }
    }
  }

  render() {
    return (
      <div className="page-container employee-leaves" >
        <div className="header">
          {RS.getString('TEAM_LEAVES')}
        </div>
        {this.renderMenuTabs()}
        <div className="row row-body" >
          {this.renderTab()}
        </div>
      </div >
    )
  }
}

export default EmployeeLeaves;
