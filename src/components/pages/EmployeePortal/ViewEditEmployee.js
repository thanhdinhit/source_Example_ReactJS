import React, { PropTypes } from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { EMPLOYEES_EMPLOYEEID } from '../../../constants/routeConfig';
import DialogChangeAvatar from './DialogChangeAvatar';
import RS, { Option } from '../../../resources/resourceManager';
import DialogResetPassword from '../../../containers/Login/DialogResetPasswordContainer';
import * as toastr from '../../../utils/toastr';
import RIGHTS from '../../../constants/rights';
import Breadcrumb from '../../elements/Breadcrumb';
import { COMPONENT_NAME, EMPLOYEE_TABS, FIXNUMBER_PAYRATE } from '../../../core/common/constants';
import ContactDetailsView from './ContactDetailsView';
import ContactDetailsEdit from './EditEmployee/ContactDetailsEdit';
import AvailabilityAndWorkingTimeView from './AvailabilityAndWorkingTimeView';
import AvailabilityAndWorkingTimeEdit from './AvailabilityAndWorkingTimeEdit';
import JobRoleAndSkillsView from './JobRoleAndSkillsView';
import JobRolesAndPayRate from './NewEmployee/JobRolesAndPayRate';
import JobRoleAndPayRateView from './JobRoleAndPayRateView';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import { EMPLOYEE_ATTACHFILE } from '../../../core/common/config';
import AttachmentEdit from './AttachmentEdit';
import { browserHistory } from 'react-router';
import Tabs from '../../elements/HorizontalTabs/HorizontalTab';
import _ from 'lodash';
import { getEmployeeConstraints } from '../../../validation/employeeConstraints';
import TerminationContainer from '../../../containers/EmployeePortal/ViewEditEmployee/TerminationContainer';
import DialogAlert from '../../elements/DialogAlert'
import PayRateView from "./PayRateView";
import PayRate from './NewEmployee/PayRate';
import DialogChangePayRate from './DialogChangePayRate';
import HandsetsContainer from '../../../containers/EmployeePortal/ViewEditEmployee/HandsetsContainer';
import EmployeeTransfer from './EmployeeTransfer';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';

const redirect = EMPLOYEES_EMPLOYEEID;
const ViewEditEmployee = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes: {
        getTerminations: PropTypes.func,
        params: PropTypes.object,
        employee: PropTypes.object,
        editEmployeeContactDetail: PropTypes.func,
        payload: PropTypes.object,
        jobRoles: PropTypes.array,
        skills: PropTypes.array,
        editEmployeeJob: PropTypes.func,
        editEmployeePayRate: PropTypes.func,
        loadEmployeeTransfers: PropTypes.func,
        transferEmployee: PropTypes.func,
        employeeTransfers: PropTypes.array
    },


    getInitialState: function () {
        this.tabs = []
        if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_EMPLOYEE)) {
            this.tabs.push({
                value: EMPLOYEE_TABS.CONTACT_DETAILS,
                icon: 'icon-contact-info',
                label: 'CONTACT_DETAILS'
            })
            if (this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_EMPLOYEE)) {
                this.tabs.push(
                    {
                        value: EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME,
                        icon: 'icon-working-time',
                        label: 'AVAILABILITY_WORKING_TIME'
                    },
                    {
                        value: EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE,
                        icon: 'icon-jobrole-skill',
                        label: 'JOB_ROLE_PAY_RATE'
                    },
                    {
                        value: EMPLOYEE_TABS.ATTACHMENT,
                        icon: 'icon-attachment',
                        label: 'ATTACHMENTS'
                    },
                    {
                        value: EMPLOYEE_TABS.HANDSETS,
                        icon: 'icon-handsets',
                        label: 'HANDSETS'
                    },
                    {
                        value: EMPLOYEE_TABS.EMPLOYEE_TRANSFER,
                        icon: 'icon-transfer',
                        label: 'EMPLOYEE_TRANSFER'
                    },
                    {
                        value: EMPLOYEE_TABS.TERMINATION,
                        icon: 'icon-termination',
                        label: 'TERMINATION'
                    }
                );
            }
        }
        return {
            error: {},
            avatarCroped: undefined,
            avatarName: '',
            resultFileAvatar: undefined,
            openChangeAvatar: false,
            openConfirm: false,
            isEditContactDetails: false,
            isEditAvaibilityAndWorkingTime: false,
            isEditJobRoleAndSkills: false,
            isOpenContact: true,
            isOpenAvailabilityAndWorkingTime: false,
            isOpenJobRoleAndSkill: false,
            curTab: EMPLOYEE_TABS.CONTACT_DETAILS,
            isEdit: false,
            isShowEdit: false,
            isEditPayRate: false,
            isResetPassword: false,
            isOpenDialogChangePayRate: false,
            payRateRegular: 0,
            isOpenDialogLeaveTab: false,
            infoHasChanged: false
        };
    },
    componentDidMount: function () {
        if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_EMPLOYEE)) {
            let employeeId = Number(this.props.params.employeeId)
            if (!employeeId) {
                browserHistory.replace(`/page_not_found`)
            }
            this.props.loadEmployee(this.props.params.employeeId)
            LoadingIndicatorActions.showAppLoadingIndicator();
        }
        this.loadDataPrepareStep(this.state.curTab);
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
    },
    componentDidUpdate: function () {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFULLY'), RS.getString('SUCCESS'))
            if (this.props.payload.success === "deleted") {
                //this is temporary solution, need disscuss more...
                browserHistory.push(getUrlPath(URL.EMPLOYEES))
            }
            this.props.resetState();
            window.onbeforeunload = null;
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(
                RS.getString(this.props.payload.error.message, this.props.employee.id) || this.props.payload.error.message,
                RS.getString('ERROR')
            );
            this.props.resetError();
        }
    },
    componentWillReceiveProps: function (nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (!_.isEqual(this.props.params.employeeId, nextProps.params.employeeId)) {
            this.props.loadEmployee(nextProps.params.employeeId);
            this.loadDataPrepareStep(this.state.curTab);
            LoadingIndicatorActions.showAppLoadingIndicator();
        }
    },

    componentWillUnmount: function () {
        this.props.resetEmployeeDto();
        window.onbeforeunload = null;
    },
    waitingTab: undefined,
    routerWillLeave: function (nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        if (this.state.isEdit && this.state.infoHasChanged)
            return RS.getString("P115");
    },
    loadDataPrepareStep: function (step) {
        switch (step) {
            case EMPLOYEE_TABS.CONTACT_DETAILS:
                setTimeout(() => {
                    this.props.loadUserRoleOptions({}, this.props.location.pathname);
                    this.props.loadAllEmployeeTypes();
                    this.props.loadAllGroup({});
                    this.props.loadLocations({});
                    this.props.loadCities();
                    this.props.loadDistricts();
                    this.props.loadStates();
                }, 0)

                this.setState({ isShowEdit: true })
                break;
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME:
                if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_EMPLOYEE_MANAGEMENT_SETTING)) {
                    this.props.loadAvailabilitySetting();
                    this.props.loadWorkingTimeSetting();
                }
                this.setState({ isShowEdit: true })
                break;
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                this.props.loadSkillsSetting({}, this.props.location.pathname);
                this.props.loadJobRolesSetting({}, this.props.location.pathname);
                this.setState({ isShowEdit: true })
                break;
            case EMPLOYEE_TABS.ATTACHMENT:
                this.setState({ isShowEdit: false })
                break;
            case EMPLOYEE_TABS.TERMINATION:
                this.props.getTerminations(this.props.params.employeeId);
                this.setState({ isShowEdit: false });
                break;
            case EMPLOYEE_TABS.HANDSETS: {
                this.props.loadEmployeeHandsets(this.props.params.employeeId);
                this.setState({ isShowEdit: false });
                break;
            }
            case EMPLOYEE_TABS.EMPLOYEE_TRANSFER: {
                setTimeout(() => {
                    this.props.loadEmployeeTransfers(this.props.params.employeeId);
                    this.props.loadAllGroup({});
                }, 0);
                this.setState({ isShowEdit: false });
                break;
            }
        }
    },

    employeeConstraints: {},

    handleFile: function (e) {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            if (file.size / 1024 < EMPLOYEE_ATTACHFILE.MAX_SIZE_AVATAR_KB) {
                this.refs.inputAvatar.value = '';
                this.state.error.avatar = '';
                this.setState({
                    resultFileAvatar: upload.target.result,
                    openChangeAvatar: true,
                    avatarName: file.name
                });
            }
            else {
                toastr.error(RS.getString('E108'), RS.getString('ERROR'));
                this.forceUpdate();
            }
        };

        reader.readAsDataURL(file);
    },
    handleAvatarChange: function (result) {
        this.setState({ avatarCroped: result });
        let employeeFinalDto = {
            avatar: {
                file: result,
                name: this.state.avatarName
            },
            employeeDto: this.props.employee
        }
        this.props.editEmployee(employeeFinalDto, false)
    },
    handleClosePopup: function () {
        this.setState({
            openChangeAvatar: false,
            openConfirm: false
        });
    },
    handleSubmitPopup: function () {
        this.setState({
            openChangeAvatar: false
        });
    },

    handleChangeTab: function (index) {
        if (this.state.isEdit && index != this.state.curTab && this.state.infoHasChanged) {
            this.setState({ isOpenDialogLeaveTab: true });
            this.waitingTab = index;
            return;
        }
        this.loadDataPrepareStep(index);
        this.setState({ curTab: index });
    },

    editEmployee: function (modifiedEmployee) {
        let employeeFinalDto = {
            avatar: {},
            employeeDto: _.assign(_.cloneDeep(this.props.employee), { attachment: modifiedEmployee })
        }
        this.props.editEmployee(employeeFinalDto, true, redirect);
    },

    handleSubmitChangePayRate: function () {
        this.setState({ isOpenDialogChangePayRate: false });
    },

    handleCancelPayRate: function () {
        this.jobRoleAndPayRate.setPayRate(_.get(this.props.employee.job, "payRate", 0).toFixed(FIXNUMBER_PAYRATE));
        this.setState({ isOpenDialogChangePayRate: false });
    },

    handleSave: function () {
        switch (this.state.curTab) {
            case EMPLOYEE_TABS.CONTACT_DETAILS: {
                return this.contactDetails.validateContactDetails();
            }
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME: {
                if (this.availability.validate()) {
                    this.props.editEmployeeTime(this.props.employee.id, this.availability.getValue());
                    this.handleReturnAfterSave();
                }
                break;
            }
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                if (this.jobRoleAndPayRate.validate()) {
                    this.props.editEmployeeJob(
                        this.props.employee.id,
                        this.jobRoleAndPayRate.getValue()
                    );
                    this.handleReturnAfterSave();
                }
                break;
        }
    },
    handleReturnAfterSave: function () {
        this.setState({
            isEdit: false,
            isShowEdit: true
        })
    },
    contactDetailValidatedSuccess: function () {
        this.props.editEmployeeContactDetail(this.props.employee.id, this.contactDetails.getValue());
        window.scrollTo(0, 0);
        this.handleReturnAfterSave();
    },

    handleOnBlurPayRate: function (value) {
        if (this.jobRoleAndPayRate.validatePayRate()) {
            this.setState({
                isOpenDialogChangePayRate: true,
                payRateRegular: value
            });
        }
    },

    handleEdit: function () {
        this.setState({
            isEdit: true
        });
    },
    onBeforeUnload: function (event) {
        event.preventDefault();
        return event.returnValue = RS.getString("P115");
    },
    handleLeaveTab: function () {
        this.setState({ isOpenDialogLeaveTab: false, curTab: this.waitingTab, infoHasChanged: false });
        this.loadDataPrepareStep(this.waitingTab);
    },
    handleCancelLeaveTab: function () {
        this.setState({ isOpenDialogLeaveTab: false })
    },
    handleCancel: function () {
        this.setState({ isEdit: false, isShowEdit: true, infoHasChanged: false })
        window.onbeforeunload = null;
    },

    handleResetPassword: function () {
        this.setState({
            isResetPassword: true
        })

    },
    handleUpdateContactDto: function (contactDetail) {
        let infoHasChanged = _.isEqual(this.props.originEmployee.contactDetail, contactDetail) ? false : true
        window.onbeforeunload = infoHasChanged ? this.onBeforeUnload : null
        this.setState({
            infoHasChanged
        })
    },
    renderContactDetail: function () {
        if (this.state.isEdit) {
            return (
                <ContactDetailsEdit
                    contactDetail={this.props.employee.contactDetail}
                    originContactDetail={this.props.originEmployee.contactDetail}
                    employeeConstraints={this.employeeConstraints}
                    validateEmailEmployee={this.props.validateEmailEmployee}
                    ref={(contactDetails) => contactDetails && (this.contactDetails = contactDetails)}
                    validateAccountEmployee={this.props.validateAccountEmployee}
                    groups={this.props.groups}
                    validateFieldEmployee={this.props.validateFieldEmployee}
                    validatedResult={this.props.validatedResult}
                    employeeTypes={this.props.employeeTypes}
                    userRoles={this.props.userRoles}
                    locations={this.props.locations}
                    cities={this.props.cities}
                    districts={this.props.districts}
                    states={this.props.states}
                    validateTotalFieldsEmployee={this.props.validateTotalFieldsEmployee}
                    validatedSuccess={this.contactDetailValidatedSuccess}
                    updateContactDto={this.handleUpdateContactDto}
                />
            );
        }
        return (
            <ContactDetailsView
                key={EMPLOYEE_TABS.CONTACT_DETAILS}
                employee={this.props.employee}
            />
        );
    },

    handleUpdateJobRoleAndPayRate: function (value) {
        const { job } = this.props.employee;
        const infoHasChanged = !_.isEqual(job.employeeJobSkills, value.employeeJobSkills)
            || job.jobRole.id != value.jobRole.id || job.payRate != value.payRate;
        this.setState({ infoHasChanged });
    },

    renderJobRoleAndPayRate: function () {
        if (this.state.isEdit) {
            return (
                <JobRolesAndPayRate
                    job={this.props.employee.job}
                    jobRoles={this.props.jobRoles}
                    skills={this.props.skills}
                    employeeConstraints={this.employeeConstraints}
                    onBlurPayRate={this.handleOnBlurPayRate}
                    ref={(component) => this.jobRoleAndPayRate = component}
                    onUpdateJobRolesAndPayRate={this.handleUpdateJobRoleAndPayRate}
                    curEmp={this.props.curEmp}
                />
            );
        }
        return (
            <JobRoleAndPayRateView
                permissionEdit={
                    this.props.curEmp.rights.find(x => x == RIGHTS.MODIFY_EMPLOYEE) != undefined}
                job={this.props.employee.job}
                curEmp={this.props.curEmp}
            />
        );
    },

    renderPayRateTab: function () {
        if (this.state.isEdit) {
            return (
                <PayRate
                    regular={this.props.employee.payRate.regular}
                    ref={(payRate) => this.payRate = payRate}
                />
            );
        }
        return (
            <PayRateView
                payRate={this.props.employee.payRate}
                permissionEdit={this.props.curEmp.rights.find(x => x == RIGHTS.MODIFY_EMPLOYEE) != undefined}
            />
        );
    },

    updateAvailabilityAndWorkingTime: function (time) {
        this.setState({ infoHasChanged: _.isEqual(time, this.props.employee.time) ? false : true });
    },

    renderTab: function (curTab) {
        switch (curTab) {
            case EMPLOYEE_TABS.CONTACT_DETAILS: {
                return this.renderContactDetail();
            }
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME:
                if (this.state.isEdit) {
                    return (
                        <AvailabilityAndWorkingTimeEdit
                            key={curTab}
                            employee={this.props.employee}
                            ref={(input) => input && (this.availability = input)}
                            availabilitySetting={this.props.availabilitySetting}
                            workingTimeSetting={this.props.workingTimeSetting}
                            updateAvailabilityAndWorkingTime={this.updateAvailabilityAndWorkingTime}
                        />
                    );
                }
                else
                    return (
                        <AvailabilityAndWorkingTimeView
                            key={curTab}
                            employee={this.props.employee}
                            workingTimeSetting={this.props.workingTimeSetting}
                        />
                    );
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE: {
                return this.renderJobRoleAndPayRate();
            }
            case EMPLOYEE_TABS.ATTACHMENT:
                return (
                    <AttachmentEdit
                        employee={this.props.employee}
                        handleEditEmployee={this.editEmployee}
                    />
                );
            case EMPLOYEE_TABS.TERMINATION: {
                return (
                    <TerminationContainer />
                );
            }
            case EMPLOYEE_TABS.HANDSETS: {
                return (
                    <HandsetsContainer />
                );
            }
            case EMPLOYEE_TABS.EMPLOYEE_TRANSFER: {
                return (
                    <EmployeeTransfer
                        employeeTransfers={this.props.employeeTransfers}
                        transferEmployee={this.props.transferEmployee}
                        groups={this.props.groups}
                        employeeId={this.props.params.employeeId}
                        payload={this.props.payload}
                        loadEmployeeTransfers={this.props.loadEmployeeTransfers}
                        contactDetail={this.props.employee.contactDetail}
                    />
                );
            }
        }
    },

    tabs: [
        {
            value: EMPLOYEE_TABS.CONTACT_DETAILS,
            icon: 'icon-contact-info',
            label: 'CONTACT_DETAILS'
        },
        {
            value: EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME,
            icon: 'icon-working-time',
            label: 'AVAILABILITY_WORKING_TIME'

        },
        {
            value: EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE,
            icon: 'icon-jobrole-skill',
            label: 'JOB_ROLE_PAY_RATE'
        },
        {
            value: EMPLOYEE_TABS.ATTACHMENT,
            icon: 'icon-attachment',
            label: 'ATTACHMENTS'
        },
        {
            value: EMPLOYEE_TABS.HANDSETS,
            icon: 'icon-handsets',
            label: 'HANDSETS'
        },
        {
            value: EMPLOYEE_TABS.EMPLOYEE_TRANSFER,
            icon: 'icon-transfer',
            label: 'EMPLOYEE_TRANSFER'
        },
        {
            value: EMPLOYEE_TABS.TERMINATION,
            icon: 'icon-termination',
            label: 'TERMINATION'
        }
    ],

    // tabMore: [
    //     {
    //         value: EMPLOYEE_TABS.HANDSETS,
    //         icon: 'icon-handsets',
    //         label: 'HANDSETS'
    //     },
    //     {
    //         value: EMPLOYEE_TABS.TERMINATION,
    //         icon: 'icon-termination',
    //         label: 'TERMINATION'
    //     }
    // ],

    convertToCorrectTabLanguage: function (tabs) {
        return tabs.map(function (tab) {
            tab.label = RS.getString(tab.label, null, Option.CAPEACHWORD);
            return tab;
        });
    },

    renderMenuProfile: function () {
        const { employee } = this.props;

        const tabs = this.convertToCorrectTabLanguage(_.cloneDeep(this.tabs));
        // const tabMore = this.convertToCorrectTabLanguage(_.cloneDeep(this.tabMore));
        let photoUrl = _.get(employee, "contactDetail.photoUrl", undefined);

        return (
            <div>
                <div className="profile-header">
                    <div className="box-avatar">
                        {this.state.avatarCroped ?
                            <img className="avatar-profile" src={this.state.avatarCroped} /> :
                            <img className="avatar-profile" src={photoUrl ? API_FILE + photoUrl
                                : require("../../../images/avatarDefault.png")} />
                        }
                        <label htmlFor="photoFile" className="img-button-upload">
                            <div className="input-camera">
                                <i className="icon-camera"></i>
                            </div>
                        </label>
                    </div>
                    <input ref="inputAvatar" className="inputfile" id="photoFile" type="file" onChange={this.handleFile} />
                    {/* <div className="error"> {this.state.error.avatar} </div> */}
                    <div className="name-profile">
                        <div>{employee && employee.contactDetail.fullName || ''}&nbsp; </div>
                        <div className="userrole-name">{_.get(employee, 'job.jobRole.name', '')} </div>
                    </div>
                    {
                        (this.props.curEmp.rights.find(x => x == RIGHTS.MODIFY_EMPLOYEE)) ?
                            <div className="header-button">
                                {
                                    (this.state.isShowEdit && !this.state.isEdit) ?
                                        <RaisedButton
                                            label={RS.getString('EDIT')}
                                            onClick={this.handleEdit}
                                        /> : null
                                }
                                {
                                    (this.state.isEdit && this.state.isShowEdit) ?
                                        [<RaisedButton
                                            key={1}
                                            label={RS.getString('CANCEL')}
                                            className="raised-button-fourth"
                                            onClick={this.handleCancel}
                                        />, <RaisedButton
                                            key={0}
                                            label={RS.getString('SAVE')}
                                            onClick={this.handleSave}
                                            disabled={!this.state.infoHasChanged}
                                        />]
                                        : null
                                }
                                {
                                    (this.props.curEmp.rights.find(x => x == RIGHTS.RESET_PASSWORD)
                                        && (!this.state.isEdit || !this.state.isShowEdit)) ?
                                        <RaisedButton
                                            label={RS.getString('RESET_PASSWORD')}
                                            onClick={this.handleResetPassword}
                                        /> : null
                                }
                            </div> : null
                    }
                </div>
                {this.props.curEmp.rights.find(x => x == RIGHTS.VIEW_EMPLOYEE) ?
                    <Tabs
                        ref={(tabs) => this.horizontalTabs = tabs}
                        tabs={tabs}
                        // more={tabMore}
                        className="vertical-tabs"
                        handleChangeTab={this.handleChangeTab}
                        curTab={this.state.curTab}
                        hold={this.state.isEdit}
                    />
                    : null}
            </div>
        );
    },
    render: function () {
        let linkBreadcrumb = [{
            key: RS.getString("EMPLOYEES"),
            value: getUrlPath(URL.EMPLOYEES)
        }];
        this.employeeConstraints = getEmployeeConstraints();
        let actionAlert = [
            <RaisedButton
                key={1}
                label={RS.getString("NO")}
                onClick={this.handleCancelLeaveTab}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={0}
                label={RS.getString("YES")}
                onClick={this.handleLeaveTab}
            />
        ];
        return (
            <div className="page-container new-employee view-edit-employee">
                <Breadcrumb link={linkBreadcrumb} />
                <div className="row-header-profile">
                    {this.renderMenuProfile()}
                </div>
                <div>
                    {this.renderTab(this.state.curTab)}
                </div>
                <DialogChangeAvatar
                    avatar={this.state.resultFileAvatar}
                    onChange={this.handleAvatarChange}
                    isOpen={this.state.openChangeAvatar}
                    handleClose={this.handleClosePopup}
                    handleSubmit={this.handleSubmitPopup}
                    title={RS.getString('AVATAR')}
                />
                <DialogAlert
                    modal={true}
                    icon={require("../../../images/warning.png")}
                    isOpen={this.state.isOpenDialogLeaveTab}
                    title="Warning"
                    actions={actionAlert}
                    handleClose={this.handleCancelLeaveTab}
                >
                    <div> {RS.getString("P110")}</div>
                    <div> {RS.getString("P111")} </div>
                </DialogAlert>
                <DialogChangePayRate
                    oldValue={(_.get(this.props.employee, "job.payRate", 0) || 0).toFixed(FIXNUMBER_PAYRATE)}
                    newValue={this.state.payRateRegular}
                    isOpen={this.state.isOpenDialogChangePayRate}
                    handleSubmit={this.handleSubmitChangePayRate}
                    handleCancel={this.handleCancelPayRate}
                    label={[RS.getString('OK'), RS.getString('CANCEL')]}
                />
                {
                    this.state.isResetPassword &&
                    <DialogResetPassword
                        employee={this.props.employee}
                        isOpen={this.state.isResetPassword}
                        handleCancel={() => this.setState({ isResetPassword: false })}
                        dialogFirst={false}
                        curEmp = {this.props.curEmp}
                    />
                }
            </div>
        );
    }
});

export default ViewEditEmployee;