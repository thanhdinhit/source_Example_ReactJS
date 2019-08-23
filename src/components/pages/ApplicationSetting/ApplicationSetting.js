import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Preloader from '../../elements/Preloader';
import VerticalTab from '../../elements/VerticalTab/VerticalTab';
import Tab from '../../elements/VerticalTab/Tab';
import RS from '../../../resources/resourceManager';
import { APPLICATION_SETTING } from '../../../core/common/constants';
import { URL } from '../../../core/common/app.routes';
import { getUrlPath } from '../../../core/utils/RoutesUtils';

const redirect = getUrlPath(URL.APPLICATION_SETTING);
const ApplicationSettingComponent = React.createClass({
    propTypes: {
        location: PropTypes.object,
        children: PropTypes.object,
        payload: PropTypes.object,
    },

    getInitialState: function () {
        return {
            tabSelected: APPLICATION_SETTING.PERSONAL_SETTINGS,
            queryString: {
                order_by: 'name',
                is_desc: false
            },
            isOpenMenu: false,
            isOverlay: false
        };
    },

    componentWillMount: function () {
        let pathArr = this.props.location.pathname.split('/');
        if (pathArr.length > 3) {
            this.switchToRoute(pathArr[pathArr.length - 1]);
        }
        // redirect to tab selected default
        else {
            this.redirectToChild(this.state.tabSelected);
        }
    },

    componentDidUpdate: function () {
        if (this.props.payload.success) {
            this.props.globalAction.resetState();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            this.props.globalAction.resetError();
        }
    },

    switchToRoute: function (path) {
        switch (path) {
            case URL.PERSONAL_SETTINGS.path:
                this.setState({ tabSelected: APPLICATION_SETTING.PERSONAL_SETTINGS });
                break;
            case URL.EMPLOYEE_MANAGEMENT.path:
                this.setState({ tabSelected: APPLICATION_SETTING.EMPLOYEE_MANAGEMENT });
                break;
            default:
                this.setState({ tabSelected: APPLICATION_SETTING.PERSONAL_SETTINGS });
                break;
        }
    },

 

    redirectToChild(value) {
        switch (value) {
            case APPLICATION_SETTING.PERSONAL_SETTINGS:
                browserHistory.push(getUrlPath(URL.PERSONAL_SETTINGS));
                break;
            case APPLICATION_SETTING.GENERAL_SETTINGS:
                browserHistory.push(getUrlPath(URL.GENERAL_SETTINGS));
                break;
            case APPLICATION_SETTING.EMPLOYEE_MANAGEMENT:
                browserHistory.push(getUrlPath(URL.EMPLOYEE_MANAGEMENT));
                break;
            default:
                break;
        }
    },

    handleChangeTab: function (value) {
        if (value === 'toggleMenu') {
            return this.toggleMenuSetting();
        }
        this.setState({ tabSelected: value });
        this.redirectToChild(value);
    },

    toggleMenuSetting: function () {
        this.setState({ isOpenMenu: !this.state.isOpenMenu });
    },

    renderContent: function () {
        const {
            PERSONAL_SETTINGS,
            GENERAL_SETTINGS,
            LEAVE_MANAGEMENT,
            EMPLOYEE_MANAGEMENT,
            SCHEDULE,
            ATTENDANCE,
            ALARM,
            DUREES,
            GEO_FENNCING,
            REPORT
        } = APPLICATION_SETTING;

        let stateClassName = (this.state.isOpenMenu ? 'menu-opened' : 'menu-collapsed');
        let tabClassName = (this.state.isOverlay ? 'overlay' : 'fixed');
        return (
            <div className="container page-application-setting">
                <div className={'row flexbox ' + stateClassName}>
                    <div className={'col left-menu ' + tabClassName}>
                        <div className="btn-overlay-config" onClick={() => { this.setState({ isOverlay: !this.state.isOverlay }) }}>
                            <i className={'fa fa-clone ' + (this.state.isOverlay ? 'primary' : '')} aria-hidden="true"></i>
                        </div>
                        <VerticalTab
                            isOpen={this.state.isOpenMenu}
                            valueSelected={this.state.tabSelected}
                            onChange={this.handleChangeTab}
                            isOpenMenu={this.state.isOpenMenu}
                        >
                            <Tab img="icon-menu.png" title="" value="toggleMenu" toggle />
                            <Tab img="personal-settings.png" title={RS.getString('PERSONAL_SETTINGS')} value={PERSONAL_SETTINGS} />
                            <Tab img="general-settings.png" title={RS.getString('GENERAL_SETTINGS')} value={GENERAL_SETTINGS} />
                            <Tab img="leave-icon.png" title={RS.getString('LEAVE_MANAGEMENT')} value={LEAVE_MANAGEMENT} />
                            <Tab img="employee-management.png" title={RS.getString('EMPLOYEE_MANAGEMENT')} value={EMPLOYEE_MANAGEMENT} />
                            <Tab img="schedule.png" title={RS.getString('SCHEDULE')} value={SCHEDULE} />
                            <Tab img="attendance.png" title={RS.getString('ATTENDANCE')} value={ATTENDANCE} />
                            <Tab img="alarm.png" title={RS.getString('ALARM')} value={ALARM} />
                            <Tab img="duress.png" title={RS.getString('DURESS')} value={DUREES} />
                            <Tab img="geo-fencing.png" title={RS.getString('GEOFENCING')} value={GEO_FENNCING} />
                            <Tab img="icon-report.png" title={RS.getString('REPORTS')} value={REPORT} />
                        </VerticalTab>
                    </div>
                    <div className={'col right-main ' + tabClassName}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    },
    render: function () {
        return (
            <div>
                {this.props.payload.isLoading ? <Preloader color="blue" /> : this.renderContent()}
            </div >
        );
    }
});


export default ApplicationSettingComponent;