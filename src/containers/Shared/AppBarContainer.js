import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from '../../actions/authenticateActions'
import * as PublicAction from '../../actions/publicAction'
import { browserHistory } from 'react-router';
import RIGHTS from '../../constants/rights';
import RS from '../../resources/resourceManager';
import * as routeConfig from '../../constants/routeConfig';
import * as configName from '../../constants/configName';
export function createMenu(Component) {

    class AppBar extends React.Component {
        constructor(props, context, value) {
            super(props, context);
            this.state = { isAuthenticate: false, activedMenu: undefined };
            this.createSettingMenu = this.createSettingMenu.bind(this);
            this.createLeaveMenu = this.createLeaveMenu.bind(this);

        }

        componentWillMount() {
        }

        switchPersonDemo() {
            console.log("switch clicked")
            this.switchPersonDemo();
        }
        activeMenu(value) {
            this.setState({ activedMenu: value })
        }
        createEmployeeMenu(value) {
            let childMenus = []
            let menu = '';
            // if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_EMPLOYEE)) {
            //     childMenus.push(
            //         <li key={0}><a onClick={() => { browserHistory.push("/employees"), this.setState({ activedMenu: value }) }} >{RS.getString('EMPLOYEE_MANAGEMENT')}</a></li>)
            // }
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_EMPLOYEE)) {
                childMenus.push(
                    <li key={1}><a onClick={() => {
                        browserHistory.push("/overtime"),
                            this.activeMenu(value)
                    }} >{RS.getString('OVERTIME')}</a></li>)
            }
            if (childMenus.length > 0) {
                menu = <li className="dropdown">
                    <a className="menu-horizional-tab dropdown-toggle employee" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        <div className={this.state.activedMenu == value ? 'appbar-actived' : ''}>
                            {RS.getString('EMPLOYEE_PORTAL')}
                            <span className="caret"></span>
                        </div>
                    </a>
                    <ul className="dropdown-menu">
                        {childMenus}
                    </ul>
                </li>
            }
            return menu;
        }
        createLeaveMenu(value) {
            let childMenus = []
            let menu = '';
            let menuTemBalanceItems = []
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_LEAVE)) {
                childMenus.push(
                    <li key={0}><a onClick={() => { browserHistory.push("/my-balance"), this.setState({ activedMenu: value }) }}>My balance</a></li>)
            }
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_MEMBER_LEAVE)) {
                menuTemBalanceItems.push(<li key={0} className="menu-item "><a onClick={() => { browserHistory.push("/member-leaves"), this.setState({ activedMenu: value }) }}>Member Leaves</a></li>
                )

            }
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_LEAVE_REPORT)) {
                menuTemBalanceItems.push(<li key={1} className="menu-item "><a onClick={() => { browserHistory.push("/member-reports"), this.setState({ activedMenu: value }) }}>Member Reports</a></li>
                )
            }
            if (menuTemBalanceItems.length > 0) {
                childMenus.push(<li key={1} className="menu-item dropdown dropdown-submenu"><a className="dropdown-toggle" data-toggle="dropdown">Team Balance</a>
                    <ul className="dropdown-menu">
                        {menuTemBalanceItems}
                    </ul>
                </li>)
            }
            if (childMenus.length > 0) {
                menu = <li className="dropdown">
                    <a className="menu-horizional-tab dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className={this.state.activedMenu == value ? 'appbar-actived' : ''}>{RS.getString('LEAVE')} <span className="caret"></span></div></a>
                    <ul className="dropdown-menu">
                        {childMenus}
                    </ul>
                </li>
            }
            return menu;
        }
        createSettingMenu(value) {

            let childMenus = []
            let menu = '';
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_SHIFTTEMPLATE)) {
                childMenus.push(
                    <li key={0} className="menu-item dropdown dropdown-submenu"><a className="dropdown-toggle" data-toggle="dropdown">Shift Management</a>
                        <ul className="dropdown-menu">
                            <li className="menu-item "><a onClick={() => { browserHistory.push("/shift-template"), this.setState({ activedMenu: value }) }}>Shift Template</a></li>
                        </ul>
                    </li>
                )
            }
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_JOBSKILL)) {
                childMenus.push(
                    <li key={1}><a onClick={() => { browserHistory.push("/skill-management"), this.setState({ activedMenu: value }) }} >Skill Management</a></li>)
            }
            if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_JOBROLE)) {
                childMenus.push(<li key={2}><a onClick={() => { browserHistory.push("/" + routeConfig.JOBROLE_MANAGEMENT), this.setState({ activedMenu: value }) }} >Job Role Management</a></li>)
            }
            // if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_REGION)) {
            //     childMenus.push(<li key={3}><a onClick={() => { browserHistory.push("/region-management"), this.setState({ activedMenu: value }) }}>Region Management</a></li>)
            // }
            // if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_LOCATION)) {
            //     childMenus.push(<li key={4}><a onClick={() => { browserHistory.push("/" + routeConfig.LOCATION_MANAGEMENT_ALL), this.setState({ activedMenu: value }) }}>Location Management</a></li>)
            // }
            // if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.VIEW_LEAVE_CONFIGURATION)) {
            //     childMenus.push(<li key={5}><a onClick={() => { browserHistory.push("/leave-setting"), this.setState({ activedMenu: value }) }}>Leave Setting</a></li>)
            // }
            if (childMenus.length > 0) {
                menu = <li className="dropdown">
                    <a className="menu-horizional-tab dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        <div className={this.state.activedMenu == value ? 'appbar-actived' : ''}>{RS.getString('SETTING')} <span className="caret"></span></div></a>
                    <ul className="dropdown-menu">
                        {childMenus}
                    </ul>
                </li>
            }
            return menu;
        }
        createApplicationSettingMenu(value) {

            let childMenus = []
            let menu = '';
            // if (this.props.curEmp.rights.find(x => x.toLowerCase() == RIGHTS.)) {
            menu = <li key={0} className="dropdown">
                <a onClick={() => { browserHistory.push("/" + routeConfig.APPLICATION_SETTING), this.setState({ activedMenu: value }) }} className="menu-horizional-tab dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <div className={this.state.activedMenu == value ? 'appbar-actived' : ''}>{RS.getString('APPLICATION_SETTING')} </div></a>
            </li>
            // }
            return menu;
        }

        renderMenuLeft(value) {
            if (this.props.payload.isAuthenticated) {
                return (
                    <div>
                        <ul className="nav navbar-nav">
                            {this.createEmployeeMenu(0)}
                            {/*{this.createLeaveMenu(1)}*/}
                            {this.createSettingMenu(2)}
                            {/*{this.createApplicationSettingMenu(3)}*/}
                        </ul>
                    </div>
                )
            }
            else
                return '';
        }
        renderMenuRight() {
            if (this.props.payload.isAuthenticated) {
                return (
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <a style={{ height: '80px', padding: '25px 0px' }} className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span>
                                    {
                                        this.props.employeeInfo && this.props.employeeInfo.photoUrl ?
                                            <img src={API_FILE + this.props.employeeInfo.photoUrl} style={{ width: '30px', height: '30px' }} className="user-avatar" /> : <img src={require("../../images/avatarDefault.png")} className="user-avatar" />
                                    }

                                </span> {
                                    this.props.employeeInfo && this.props.employeeInfo.fullName ?
                                        this.props.employeeInfo.fullName : 'admin'
                                } <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                {
                                    this.props.curEmp.employeeId && this.props.curEmp.employeeId != "null" ? <li><a onClick={() => { browserHistory.push(getUrlPath(URL.MY_PROFILE)) }}>Profile</a></li> : ''
                                }

                                <li><a onClick={() => { this.props.logout(this.props.curEmp) }}>Log Out</a></li>
                                <li><a onClick={() => { this.props.changeLanguage(configName.ENGLISH) }}>English</a></li>
                                <li><a onClick={() => { this.props.changeLanguage(configName.VIETNAMESE) }}>Vietnamese</a></li>

                            </ul>
                        </li>
                    </ul>
                )

            }
            else {
                return (
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={() => { browserHistory.push("/login") }}>Sign In </a>
                        </li>
                    </ul>)
            }
        }
        renderAppBar() {
            return (
                <nav style={{ border: '0px', height: '80px' }} className="navbar navbar-default">
                    <div className="container-fluid">
                        <div style={{ padding: '32px 15px' }} className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a style={{ borderRight: '0px', padding: '0px', height: '0px' }} className="navbar-brand" ><i style={{ cursor: 'pointer' }} onClick={() => { this.setState({ activedMenu: -1 }), browserHistory.push("/") }}>iWFA</i></a>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            {this.renderMenuLeft()}
                            {this.renderMenuRight()}
                        </div>

                    </div>
                </nav>
            )


        }
        render() {
            return (
                <div>
                    {this.renderAppBar()}
                    <br />
                    <div>
                        <Component {...this.props} />
                    </div>
                </div>
            );
        }
    }
    function mapStateToProps(state) {
        return {
            employeeInfo: state.authReducer.employeeInfo,
            curEmp: state.authReducer.curEmp,
            payload: state.authReducer.payload,
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            checkAuthenticate: bindActionCreators(AuthActions.checkAuthenticate, dispatch),
            logout: bindActionCreators(AuthActions.logout, dispatch),
            changeLanguage: bindActionCreators(PublicAction.changeLanguage, dispatch)
        };
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppBar);
}
