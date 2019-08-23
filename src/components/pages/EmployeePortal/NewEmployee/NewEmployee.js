
import React from 'react';
import RaisedButton from '../../../elements/RaisedButton';
import { EMPLOYEES, NEW_EMPLOYEE } from '../../../../constants/routeConfig';
import { loadAllMember } from '../../../../actions/employeeActions';
import { validateEmail, clone } from '../../../../services/common';
import Preloader from '../../../elements/Preloader';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import DialogAlert from '../../../elements/DialogAlert';
import { getIconImage } from '../../../../utils/iconUtils';
import * as toastr from '../../../../utils/toastr';
import { STATUS, WAITING_TIME, EMPLOYEE_TABS } from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import Breadcrumb from '../../../elements/Breadcrumb';
import Stepper from '../../../elements/Stepper/Stepper';
import RIGHTS from '../../../../constants/rights';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { getEmployeeConstraints } from '../../../../validation/employeeConstraints';
import ContactDetails from './ContactDetails';
import AvailabilityAndWorkingtimeEdit from '../AvailabilityAndWorkingTimeEdit';
import JobRolesAndSkills from './JobRolesAndSkills';
import JobRolesAndPayRate from './JobRolesAndPayRate';
import AttachFiles from './AttachFiles';
import _ from 'lodash';
import { getPreviousPage } from '../../../../utils/browserHelper';

const redirect = NEW_EMPLOYEE;
export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            error: {
                email: '',
                avatar: '',
                accountName: '',
                workMobile: ''
            },
            isOpenDialogWarning: false,
            openRemoveECConfirm: false,
            title: RS.getString('NEW_EMPLOYEE'),
            curStep: EMPLOYEE_TABS.CONTACT_DETAILS,
        }
    },

    componentDidMount: function () {
        this.loadDataPrepareStep(this.state.curStep)
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        window.onbeforeunload = function (ev) {
            ev.preventDefault();
            return ev.returnValue = RS.getString("P115");
        }

    },
    routerWillLeave: function (nextLocationBrowserHistory) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        if (!this.state.isSaved) {
            this.setState({
                nextLocation: nextLocationBrowserHistory.pathname,
                isOpenDialogWarning: true
            })
            return false
        }

    },

    componentWillReceiveProps: function (nextProps) {
    },

    componentDidUpdate: function () {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            setTimeout(() => {
                this.setState({ isSaved: true }, () => {
                    switch (this.props.location.pathname) {
                        case getUrlPath(URL.EMPLOYEE, { employeeId: this.props.employee.id }): {
                            browserHistory.push(getUrlPath(URL.EMPLOYEE, { employeeId: this.props.employee.id }));
                            break;
                        }
                        default: {
                            browserHistory.push(getUrlPath(URL.EMPLOYEES));
                            break;
                        }
                    }
                })

            }, WAITING_TIME);
            this.props.resetState();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'));
            this.props.resetError();
        }
    },
    componentWillUnmount: function () {
        window.onbeforeunload = null;
        this.props.resetNewEmployeeDto();
    },
    avatar: {},
    employeeConstraints: {},
    isCheckFieldAsync: false,
    confirmLeavePage() {
        this.setState({
            isSaved: true
        }, () => browserHistory.push(this.state.nextLocation))

    },
    checkAccount: function () {
        if (this.accountName.validate())
            if (this.accountName.getValue() != this.props.originEmployee.accountName) {
                this.props.validateAccountEmployee({ accountName: this.accountName.getValue() });
            }
            else if (this.isCheckFieldAsync) {
                this.validateAllowNextStepAfterAsync(this.props)
            }

    },
    checkWorkingPhone: function () {
        if (this.workMobile.validate())
            if (this.workMobile.getValue() != this.props.originEmployee.workMobile) {
                this.props.validateWorkingPhoneEmployee({ workingPhone: this.workMobile.getValue() });
            }
            else if (this.isCheckFieldAsync) {
                this.validateAllowNextStepAfterAsync(this.props);
            }
    },
    handleCheckFieldAsync: function (nextProps) {
        let error = _.clone(this.state.error)
        if (nextProps.validated.validatedEmailResult === STATUS.IS_EXISTED) {
            error.email = RS.getString('E131', 'EMAIL');
        }
        if (nextProps.validated.validatedEmailResult === STATUS.ACCEPTED) {
            error.email = "";
            if (this.isCheckFieldAsync) {
                this.validateAllowNextStepAfterAsync(nextProps);
            }
        }

        if (nextProps.validated.validatedAccountResult === STATUS.IS_EXISTED) {
            error.accountName = RS.getString('E131', 'ACCOUNT_NAME');
        }
        if (nextProps.validated.validatedAccountResult === STATUS.ACCEPTED) {
            error.accountName = "";
            if (this.isCheckFieldAsync) {
                this.validateAllowNextStepAfterAsync(nextProps);
            }
        }

        if (nextProps.validated.validatedWorkingPhoneResult === STATUS.IS_EXISTED) {
            error.workMobile = RS.getString('E131', 'WORK_PHONE');
        }
        if (nextProps.validated.validatedWorkingPhoneResult === STATUS.ACCEPTED) {
            error.workMobile = "";
            if (this.isCheckFieldAsync) {
                this.validateAllowNextStepAfterAsync(nextProps);
            }
        }
        this.setState({ error: error })
    },
    validateSkillsJobroles: function () {
        let rs = true;
        let employeeJobSkills = _.cloneDeep(this.props.newEmployee.employeeJobSkills)
        employeeJobSkills.forEach(function (skill, index) {
            if (skill.jobSkill.requireCertificate && _.isEmpty(skill.certificates)) {
                rs = false;
                skill.jobSkill.errorText = RS.getString('REQUIRE_CERTIFICATE')
            }
        }, this)
        this.props.updateEmployeeDto('employeeJobSkills', employeeJobSkills);
        return rs;
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

                }, 0);
                break;
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME:
                if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_EMPLOYEE_MANAGEMENT_SETTING)) {
                    this.props.loadAvailabilitySetting();
                    this.props.loadWorkingTimeSetting();
                }
                break;
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                setTimeout(() => {
                    this.props.loadSkillsSetting({}, this.props.location.pathname);
                    this.props.loadJobRolesSetting({}, this.props.location.pathname);
                }, 0);
                break;
            case EMPLOYEE_TABS.ATTACHMENT:

                break;
        }
    },
    handleNextStep: function () {
        switch (this.state.curStep) {
            case EMPLOYEE_TABS.CONTACT_DETAILS:
                this.contactDetails.validateContactDetails();
                break;
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME:
                if (this.availability.validate()) {
                    this.props.updateEmployeeDto("time", this.availability.getValue());
                    this.loadDataPrepareStep(this.state.curStep + 1);
                    this.setState({ curStep: this.state.curStep + 1 });
                    window.scrollTo(0, 0);
                }
                break;
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                if (this.jobRoleAndPayRate.validate()) {
                    this.props.updateEmployeeDto('job', this.jobRoleAndPayRate.getValue());
                    this.setState({ curStep: this.state.curStep + 1 });
                    window.scrollTo(0, 0);
                }
                break;
            case EMPLOYEE_TABS.ATTACHMENT:
                let files = this.attachFiles.getValue();
                this.props.updateEmployeeDto('attachment', { files })
                this.hanleSubmitEmployee(_.assign({}, this.props.newEmployee, { attachment: { files } }), getUrlPath(URL.EMPLOYEES));
                window.scrollTo(0, 0);
                break;
        }
    },
    handlePreviousStep: function () {
        this.setState({ curStep: this.state.curStep - 1 })
    },
    validateContactDetails: function () {
        let rs = true;
        const fieldValidates = [
            'firstName', 'lastName', 'identifier', 'accountName', 'workMobile',
            'address', 'email', 'birthday', 'startDate', 'reportTo'
        ];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);

        if (!rs) return;
        this.isCheckFieldAsync = true;

        this.checkEmail();
        this.checkAccount();
        this.checkWorkingPhone();
    },
    validateAllowNextStepAfterAsync: function (nextProps) {
        if ((nextProps.validated.validatedEmailResult == STATUS.ACCEPTED || this.email.getValue() === this.props.originEmployee.email)
            && (nextProps.validated.validatedWorkingPhoneResult == STATUS.ACCEPTED || this.workMobile.getValue() === this.props.originEmployee.workMobile)
            && (nextProps.validated.validatedAccountResult == STATUS.ACCEPTED || this.accountName.getValue() === this.props.originEmployee.accountName)) {
            this.loadDataPrepareStep(this.curStep + 1)
            this.setState({ curStep: this.state.curStep + 1 })
            window.scrollTo(0, 0);
            this.isCheckFieldAsync = false;
            this.setValueContactDetails();
            this.props.resetValidate()
        }
    },
    setValueContactDetails: function () {
        const fields = [
            'firstName', 'lastName', 'identifier', 'accountName', 'workMobile',
            'address', 'email', 'birthday', 'startDate', 'personalPhone',
            'homePhone', 'extensionPhone'
        ];
        fields.forEach(function (field) {
            this.props.updateEmployeeDto(field, this[field].getValue())
        }.bind(this))
    },

    handleCancel: function () {
        if (!this.state.isSaved) {
            let nextUrl = getPreviousPage();

            this.setState({
                nextLocation: nextUrl.pathname + nextUrl.search,
                isOpenDialogWarning: true
            })
        }
    },
    hanleSubmitEmployee: function (newEmployee) {
        let employeeFinalDto = {
            avatar: this.avatar,
            employeeDto: newEmployee
        }
        // this.props.addEmployee(employeeFinalDto)
        this.props.submitEmployee(employeeFinalDto)
    },
    contactDetailValidatedSuccess: function () {
        let rs = this.contactDetails.getValue();
        this.avatar = rs.avatar;
        let contactDetail = rs.contactDetail
        this.props.updateEmployeeDto('contactDetail', contactDetail)
        this.loadDataPrepareStep(this.state.curStep + 1)
        this.setState({ curStep: this.state.curStep + 1 })
        window.scrollTo(0, 0);
    },
    renderStep: function () {
        switch (this.state.curStep) {
            case EMPLOYEE_TABS.CONTACT_DETAILS:
                return (
                    <ContactDetails
                        avatar={this.avatar}
                        contactDetail={this.props.newEmployee.contactDetail}
                        originEmployee={this.props.originEmployee}
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
                    />
                )
            case EMPLOYEE_TABS.AVAILABILITY_WORKING_TIME:
                return (
                    <AvailabilityAndWorkingtimeEdit
                        employee={this.props.newEmployee}
                        ref={(input) => input && (this.availability = input) && input.setValue(this.props.newEmployee)}
                        availabilitySetting={this.props.availabilitySetting}
                        workingTimeSetting={this.props.workingTimeSetting}
                    />
                )
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                return (
                    <JobRolesAndPayRate
                        job={this.props.newEmployee.job}
                        jobRoles={this.props.jobRoles}
                        skills={this.props.skills}
                        employeeConstraints={this.employeeConstraints}
                        ref={(component) => this.jobRoleAndPayRate = component}
                        curEmp={this.props.curEmp}
                    />
                );
            case EMPLOYEE_TABS.ATTACHMENT:
                return (
                    <AttachFiles
                        ref={(attachFiles) => attachFiles && (this.attachFiles = attachFiles)}
                    />
                );
        }
    },
    renderContent: function () {
        if (!this.props.newEmployee) {
            browserHistory.replace(`/page_not_found`)
            return null;
        }

        return (
            <div>
                {this.renderStep()}
                <div className="footer-container text-right">

                    <RaisedButton
                        label={RS.getString('CANCEL')}
                        onClick={this.handleCancel}
                        className="raised-button-fourth"
                    />
                    {
                        this.state.curStep > EMPLOYEE_TABS.CONTACT_DETAILS ?
                            <RaisedButton
                                label={RS.getString('BACK')}
                                onClick={this.handlePreviousStep}
                                icon={<i className="icon-back-arrow" aria-hidden="true"></i>}
                            /> : null
                    }
                    {
                        this.state.curStep < EMPLOYEE_TABS.ATTACHMENT ?
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('NEXT')}<i className="icon-next-arrow" aria-hidden="true"></i></span>}
                                onClick={this.handleNextStep}
                            /> : null
                    }
                    {
                        this.state.curStep === EMPLOYEE_TABS.ATTACHMENT ?
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE')}<i className="icon-next-arrow" aria-hidden="true"></i></span>}
                                onClick={this.handleNextStep}
                            /> : null
                    }
                </div>
            </div>
        )
    },
    render: function () {
        let linkBreadcrumb = [{
            key: RS.getString("EMPLOYEES"),
            value: getUrlPath(URL.EMPLOYEES)
        }]
        this.employeeConstraints = getEmployeeConstraints();
        let actionAlert = [
            <RaisedButton
                key={0}
                label={RS.getString("NO")}
                onClick={() => { this.setState({ isOpenDialogWarning: false }) }}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString("YES")}
                onClick={this.confirmLeavePage}
            />
        ]
        return (
            <div className="page-container new-employee">
                <div className="header">
                    {RS.getString(this.props.title)}
                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <div className="stepper-container">
                    <Stepper
                        steps={
                            [
                                {
                                    title: RS.getString('CONTACT_DETAILS', null, Option.CAPEACHWORD),
                                    icon: 'icon-contact-info'
                                },
                                {
                                    title: RS.getString('AVAILABILITY_WORKING_TIME'),
                                    icon: 'icon-working-time',
                                },
                                {
                                    title: RS.getString('JOB_ROLE_PAY_RATE'),
                                    icon: 'icon-jobrole-skill'
                                },
                                {
                                    title: RS.getString('ATTACHMENTS'),
                                    icon: 'icon-attachment'
                                }
                            ]
                        }
                        curStep={this.state.curStep}
                    />
                </div>
                {
                    this.renderContent()
                }
                <DialogAlert
                    ref={(dialog) => this.dialogWarning = dialog}
                    icon={require("../../../../images/warning.png")}
                    isOpen={this.state.isOpenDialogWarning}
                    title="Warning"
                    actions={actionAlert}
                    handleClose={() => this.setState({ isOpenDialogWarning: false })}
                >
                    <div> {RS.getString("P110")}</div>
                    <div> {RS.getString("P111")} </div>
                </DialogAlert>
            </div>
        )
    }
})


