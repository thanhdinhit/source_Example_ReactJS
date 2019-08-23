import React from 'react';
import RaisedButton from '../../../elements/RaisedButton';
import { EMPLOYEES, NEW_EMPLOYEE } from '../../../../constants/routeConfig';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import * as toastr from '../../../../utils/toastr';
import { STATUS, WAITING_TIME, CONTRACT_TABS, CONTRACT_STATUS, BACK_TO_URL, THINGS_COME_TO, CUSTOMIZE_SCHEDULE_TEMPLATE } from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import Breadcrumb from '../../../elements/Breadcrumb';
import Stepper from '../../../elements/Stepper/Stepper';
import RIGHTS from '../../../../constants/rights';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import _ from 'lodash';
import GeneralInformation from './GeneralInformation';
import WorkingLocation from './WorkingLocation';
import Preview from './Preview';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import { loadContractSchedules, editContract, addContract } from '../../../../actionsv2/contractActions';

class NewContract extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            curStep: CONTRACT_TABS.GENERAL_INFORMATION,
            enableNextStep: false,
            isLoading: false
        }
        this.routerWillLeave = this.routerWillLeave.bind(this);
        this.enableNextStep = this.enableNextStep.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.backToUrl = null;
        this.bringCustomer = {};
        this.isSaveCurrentPage = false;
    }
    componentDidMount() {
        this.loadDataPrepareStep(this.state.curStep)
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        if(!this.isSaveCurrentPage) {
            window.onbeforeunload = function (ev) {
              ev.preventDefault();
              return ev.returnValue = RS.getString("P115");
          }
        }
        this.setState({ enableNextStep: this.enableNextStep() });
        if (_.isNull(this.backToUrl) && !_.isNull(localStorage.getItem(BACK_TO_URL))) {
            this.backToUrl = localStorage.getItem(BACK_TO_URL);
            localStorage.removeItem(BACK_TO_URL);
        }
    }

    componentDidUpdate() {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            setTimeout(() => {
                this.setState({ isSaved: true, isLoading: false }, () => {
                    if (this.state.gotoSchedule) {
                        loadContractSchedules(this.props.contract.id, null, (err, contractSchedules) => {
                            if (err) {
                                toastr.error(err.message, RS.getString('ERROR'));
                            }
                            else {
                                browserHistory.push(getUrlPath(URL.SCHEDULE, { scheduleId: _.get(contractSchedules, 'schedules[0].id') }));
                            }
                        });
                    } else {
                        switch (this.props.location.pathname) {
                            case getUrlPath(URL.CONTRACT, { contractId: this.props.contract.id }): {
                                browserHistory.push(getUrlPath(URL.CONTRACT, { contractId: this.props.contract.id }));
                                break;
                            }
                            default: {
                                if (!this.gotoCustomerDetail()) {
                                    browserHistory.push(getUrlPath(URL.CONTRACTS));
                                }
                                break;
                            }
                        }
                    }
                });

            }, WAITING_TIME);
            this.props.globalActions.resetState();
            LoadingIndicatorActions.hideAppLoadingIndicator();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            this.setState({ isLoading: false });
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'));
            this.props.globalActions.resetError();
            LoadingIndicatorActions.hideAppLoadingIndicator();
        }
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
        this.props.contractActions.resetNewContractDto();
    }

    gotoCustomerDetail() {
        if (!_.isNull(this.backToUrl)) {
            browserHistory.push(this.backToUrl);
            return true;
        }
        return false;
    }

    routerWillLeave() {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        if (!this.state.isSaved && !this.isSaveCurrentPage)
            return RS.getString("P115");
    }

    loadDataPrepareStep(step) {
        switch (step) {
            case CONTRACT_TABS.GENERAL_INFORMATION:
                setTimeout(() => {
                    this.props.loadCustomers({});
                    this.props.loadAllGroup({});
                    this.props.contractActions.loadAllContract({});
                    this.props.shiftTemplateSettingActions.loadShiftTemplatesSetting({});
                }, 0);
                break;
            case CONTRACT_TABS.CONTENT:
                setTimeout(() => {
                    this.props.locationActions.loadLocations({});
                    this.props.jobRoleSettingAction.loadJobRolesSetting({});
                    this.props.loadGroupSubs(this.props.newContract.group.id || '');
                });
                break;
            case CONTRACT_TABS.PREVIEW:
                break;
        }
    }

    enableNextStep() {
        let enableNextStep = this.state.enableNextStep;
        switch (this.state.curStep) {
            case CONTRACT_TABS.GENERAL_INFORMATION:
                enableNextStep = true;
                break;
            case CONTRACT_TABS.CONTENT:
                enableNextStep = this.workingLocationRef.validate();
                break;
            case CONTRACT_TABS.PREVIEW:
                enableNextStep = true;
                break;
        }
        return enableNextStep;
    }

    handleCancel() {
        browserHistory.goBack();
    }

    handleSaveAsDraft() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        let contract = _.cloneDeep(this.props.newContract);
        let customerValid = false;
        switch (this.state.curStep) {
            case CONTRACT_TABS.GENERAL_INFORMATION:
                customerValid = this.generalInformation.handleSaveAsDraft();

                const fields = [
                    'customer', 'identifier', 'startDate', 'endDate',
                    'group', 'ratePrice', 'rateType', 'shiftTemplate', 'attachments', 'links'
                ];
                let values = this.generalInformation.getValue();
                _.each(fields, (field) => {
                    contract[field] = values[field];
                });

                break;
            case CONTRACT_TABS.CONTENT:
                let contentValue = this.workingLocationRef.getValue();
                contract['schedules'] = contentValue.workingLocations;
                contract['flexibleSchedules'] = contentValue.flexibleWorkingTimes;
                break;
        }
        contract.status = CONTRACT_STATUS.DRAFT;
        if (customerValid) {
            if (contract.id) {
                editContract(contract, this.handleCallbackAction);
            } else {
                addContract(contract, this.handleCallbackAction);
            }
        } else {
            LoadingIndicatorActions.hideAppLoadingIndicator();
        }
    }

    handlePreviousStep() {
        this.setState({ curStep: this.state.curStep - 1 }, () => {
            this.setState({ enableNextStep: this.enableNextStep() });
        });
    }

    handleValidateGeneralInfoSuccess = (callback) => {
        const fields = [
            'customer', 'identifier', 'startDate', 'endDate',
            'group', 'rateType', 'ratePrice', 'attachments', 'links'
        ];

        let values = this.generalInformation.getValue();

        _.each(fields, (field) => {
            this.props.contractActions.updateContractDto(field, values[field]);
        });

        if (this.props.newContract.group.id != values.group.id) {
            _.forEach(['schedules', 'flexibleSchedules'], field => {
                let schedules = _.map(this.props.newContract[field], working => {
                    let workingClone = _.cloneDeep(working);
                    workingClone.group = values.group;
                    return workingClone;
                });
                this.props.contractActions.updateContractDto(field, schedules);
            })
        }
        this.loadDataPrepareStep(this.state.curStep + 1);
        this.setState({ curStep: this.state.curStep + 1 }, () => {
            this.setState({ enableNextStep: this.enableNextStep() });
        });
        window.scrollTo(0, 0);
    }

    handleNextStep(e, gotoSchedule) {
        let callback = () => {
            this.setState({ enableNextStep: this.enableNextStep() });
        };
        switch (this.state.curStep) {
            case CONTRACT_TABS.GENERAL_INFORMATION: {
                this.generalInformation.handleSubmitNext();
                break;
            }
            case CONTRACT_TABS.CONTENT:
                if (this.workingLocationRef.validate()) {
                    let contentValue = this.workingLocationRef.getValue();
                    this.props.contractActions.updateContractDto('schedules', contentValue.workingLocations);
                    this.props.contractActions.updateContractDto('flexibleSchedules', contentValue.flexibleWorkingTimes);

                    this.setState({ curStep: this.state.curStep + 1 }, callback);
                    window.scrollTo(0, 0);
                }
                break;

            case CONTRACT_TABS.PREVIEW:
                this.setState({ gotoSchedule }, () => {
                    let contract = _.cloneDeep(this.props.newContract);
                    contract.status = CONTRACT_STATUS.ACTIVE;
                    this.setState({ isLoading: true });
                    if (contract.id) {
                        editContract(contract, this.handleCallbackAction);
                    } else {
                        addContract(contract, this.handleCallbackAction);
                    }
                });
                break;
        }
    }

    handleCallbackAction = (err) => {
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'));
        } else {
            this.isSaveCurrentPage = true;
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.state.gotoSchedule ? browserHistory.push(getUrlPath(URL.SCHEDULES)) : browserHistory.push(getUrlPath(URL.CONTRACTS));
        }
    }

    renderStep() {
        switch (this.state.curStep) {
            case CONTRACT_TABS.GENERAL_INFORMATION:
                return (
                    <GeneralInformation
                        newContract={this.props.newContract}
                        contracts={this.props.contracts}
                        customers={this.props.customers}
                        groups={this.props.groups}
                        validateSuccess={this.handleValidateGeneralInfoSuccess}
                        ref={(component) => this.generalInformation = component}
                    />
                );
            case CONTRACT_TABS.CONTENT:
                return (
                    <WorkingLocation
                        contractTime={{
                            startDate: this.props.newContract.startDate,
                            endDate: this.props.newContract.endDate
                        }}
                        group={this.props.newContract.group}
                        groupSubs={this.props.groupSubs}
                        jobRoles={this.props.jobRoles}
                        locations={this.props.locations}
                        shiftTemplates={this.props.shiftTemplates}
                        ref={input => this.workingLocationRef = input}
                        scheduleTemplate={CUSTOMIZE_SCHEDULE_TEMPLATE}
                        workingLocations={this.props.newContract.schedules || []}
                        flexibleWorkingTimes={this.props.newContract.flexibleSchedules || []}
                        onChange={(value) => this.setState({ enableNextStep: this.state.curStep == CONTRACT_TABS.CONTENT && value })}
                    />
                );
            case CONTRACT_TABS.PREVIEW:
                return (
                    <Preview
                        newContract={this.props.newContract}
                        jobRoles={_.cloneDeep(this.props.jobRoles)}
                        locations={_.cloneDeep(this.props.locations)}
                        ref={(component) => this.scheduleTemplate = component}
                    />
                );
        }
    }

    renderContent() {
        return (
            <div>
                {this.renderStep()}
                <div className="footer-container text-right">
                    <RaisedButton
                        label={RS.getString('CANCEL')}
                        onClick={this.handleCancel.bind(this)}
                        className="raised-button-fourth"
                        disabled={this.state.isLoading}
                    />
                    <RaisedButton
                        label={RS.getString('SAVE_AS_DRAFT')}
                        onClick={this.handleSaveAsDraft.bind(this)}
                        className="raised-button-first-secondary"
                        disabled={this.state.isLoading}
                    />
                    {
                        this.state.curStep > CONTRACT_TABS.GENERAL_INFORMATION ?
                            <RaisedButton
                                label={RS.getString('BACK')}
                                onClick={this.handlePreviousStep.bind(this)}
                                icon={<i className="icon-back-arrow" aria-hidden="true"></i>}
                                disabled={this.state.isLoading}
                            /> : null
                    }
                    {
                        this.state.curStep < CONTRACT_TABS.PREVIEW ?
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('NEXT')}<i className="icon-next-arrow" aria-hidden="true"></i></span>}
                                onClick={this.handleNextStep.bind(this)}
                                disabled={!this.state.enableNextStep || this.state.isLoading}
                            /> : null
                    }
                    {
                        this.state.curStep === CONTRACT_TABS.PREVIEW ?
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE_AND_CLOSE')}</span>}
                                onClick={this.handleNextStep.bind(this)}
                                disabled={this.state.isLoading}
                            /> : null
                    }
                    {
                        this.state.curStep === CONTRACT_TABS.PREVIEW ?
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE_AND_GOTO_SCHEDULE')}</span>}
                                onClick={this.handleNextStep.bind(this, null, true)}
                                disabled={this.state.isLoading}
                            /> : null
                    }
                </div>
            </div>
        )
    }
    render() {
        let linkBreadcrumb = [{
            key: RS.getString("CONTRACTS"),
            value: getUrlPath(URL.CONTRACTS)
        }]
        return (
            <div className="page-container new-contract">
                <div className="header">
                    {RS.getString("NEW_CONTRACT")}
                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <div className="stepper-container">
                    <Stepper
                        steps={
                            [
                                {
                                    title: RS.getString('GENERAL_INFORMATION', null, Option.CAPEACHWORD),
                                    icon: 'icon-contact-info'
                                },
                                {
                                    title: RS.getString('CONTENT', null, Option.CAPEACHWORD),
                                    icon: 'icon-calendar'
                                },
                                {
                                    title: RS.getString('PREVIEW', null, Option.CAPEACHWORD),
                                    icon: 'icon-review'
                                }
                            ]
                        }
                        curStep={this.state.curStep}
                    />
                </div>
                {
                    this.renderContent()
                }
            </div>
        )
    }

}
NewContract.contextTypes = {
    router: React.PropTypes.object.isRequired
}
export default NewContract;
