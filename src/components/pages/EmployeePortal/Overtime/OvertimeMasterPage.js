import React, { PropTypes } from 'react';
import RS, { Options } from '../../../../resources/resourceManager';
import _ from 'lodash';
import { EMPLOYEE_OVERTIMES_TAB } from '../../../../core/common/constants';
import Tabs from '../../../elements/HorizontalTabs/HorizontalTab';
import MyOvertimesContainer from '../../../../containers/EmployeePortal/Overtime/MyOvertimesContainer';
import TeamOvertimeContainer from '../../../../containers/EmployeePortal/Overtime/TeamOverTimeContainer';
import OvertimeStatisticContainer from '../../../../containers/EmployeePortal/Overtime/OvertimeStatisticContainer';
const propTypes = {

}
class OverTimeMasterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTab: EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME,
        }
        this.handleChangeTab = this.handleChangeTab.bind(this)
        this.queryString = {
            [EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME]: {},
            [EMPLOYEE_OVERTIMES_TAB.STATISTIC]: {},
            [EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME]: {},
        };
        this.filter = {
            [EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME]: {},
            [EMPLOYEE_OVERTIMES_TAB.STATISTIC]: {},
            [EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME]: {}
        };
        this.tabs = [
            {
                value: EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME,
                label: 'TEAM_OVERTIME'
            },
            {
                value: EMPLOYEE_OVERTIMES_TAB.STATISTIC,
                label: 'STATISTIC'
            },
            {
                value: EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME,
                label: 'MY_OVERTIME'
            },
        ];

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
        this.queryString[tab] = queryString;
    }

    handleOnChangeFilterTab(tab, filter) {
        this.filter[tab] = filter;
    }

    renderTab() {
        switch (this.state.curTab) {
            case EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME: {
                return (
                    <TeamOvertimeContainer
                        filter={this.filter[EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME]}
                        queryString={this.queryString[EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME]}
                        location={this.props.location}
                        onChangeQueryString={this.handleOnChangeQueryTab.bind(this, EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME)}
                        onchangeFilter={this.handleOnChangeFilterTab.bind(this, EMPLOYEE_OVERTIMES_TAB.TEAM_OVERTIME)}
                    />
                );
            }
            case EMPLOYEE_OVERTIMES_TAB.STATISTIC: {
                return (
                    <OvertimeStatisticContainer
                        location={this.props.location}
                        filter={this.filter[EMPLOYEE_OVERTIMES_TAB.STATISTIC]}
                        queryString={this.queryString[EMPLOYEE_OVERTIMES_TAB.STATISTIC]}
                        onChangeQueryString={this.handleOnChangeQueryTab.bind(this, EMPLOYEE_OVERTIMES_TAB.STATISTIC)}
                        onchangeFilter={this.handleOnChangeFilterTab.bind(this, EMPLOYEE_OVERTIMES_TAB.STATISTIC)}
                    />
                );
            }
            case EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME: {
                return (
                    <MyOvertimesContainer
                        location={this.props.location}
                        filter={this.filter[EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME]}
                        queryString={this.queryString[EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME]}
                        onChangeQueryString={this.handleOnChangeQueryTab.bind(this, EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME)}
                        onchangeFilter={this.handleOnChangeFilterTab.bind(this, EMPLOYEE_OVERTIMES_TAB.MY_OVERTIME)}
                    />
                );
            }
        }
    }

    render() {
        return (
            <div className="page-container overtime" >
                <div className="header">
                    {RS.getString('OVERTIME')}
                </div>
                {this.renderMenuTabs()}
                <div className="row row-body" >
                    {this.renderTab()}
                </div>
            </div >
        )
    }

}
OverTimeMasterPage.propTypes = propTypes;
export default OverTimeMasterPage;

