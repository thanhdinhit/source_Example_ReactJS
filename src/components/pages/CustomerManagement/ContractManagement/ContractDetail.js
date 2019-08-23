import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../../../resources/resourceManager';
import { CONTRACT_STATUS, CONTRACT_RATE_TYPE } from '../../../../core/common/constants';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { API, URL } from '../../../../core/common/app.routes';
import RIGHTS from '../../../../constants/rights';
import Breadcrumb from '../../../elements/Breadcrumb';
import RaisedButton from '../../../elements/RaisedButton';
import ViewContract from './ViewContract';
import DialogContractAction from './DialogContractAction';
import EditContract from './EditContract';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogAlert from '../../../elements/DialogAlert'
import DialogAppendix from '../../../elements/Dialog';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';


import fieldValidations from '../../../../validation/common.field.validation';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import dateHelper from '../../../../utils/dateHelper';
import LoadingIndicator from '../../../elements/LoadingIndicator/LoadingIndicator';
import { LOADING_INDICATOR } from '../../../../core/common/constants';
import { LOADING_INDICATOR_STYLE } from '../../../../core/common/config';
import * as toastr from '../../../../utils/toastr';
import * as contractActions from '../../../../actionsv2/contractActions';

class ContractDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contract: {
                customer: {},
                identifier: '',
                group: {},
                rateType: CONTRACT_RATE_TYPE.PER_MONTH,
                ratePrice: 0,
                startDate: undefined,
                endDate: undefined,
                status: undefined,
                attachments: [],
                links: [],
                schedules: []
            },
            showSuspendDialog: false,
            showTerminateDialog: false,
            isEditMode: false,
            showResumeDialog: false,
            showDeleteContract: false,
            isOpenAlertDialog: false,
            handleSaveEditContract: false
        };
        this.contractToEdit = null;
        this.handleClickSaveButton = this.handleClickSaveButton.bind(this);
        this.handleSwitchEditMode = this.handleSwitchEditMode.bind(this);
        this.handleTerminateContract = this.handleTerminateContract.bind(this);
        this.handleSuspendContract = this.handleSuspendContract.bind(this);
        this.handleResumeContract = this.handleResumeContract.bind(this);
        this.handleDeleteContract = this.handleDeleteContract.bind(this);
        this.handleViewAppendix = this.handleViewAppendix.bind(this);
        this.handleLoadContractCallBackAction = this.handleLoadContractCallBackAction.bind(this)
    }

    componentDidMount() {
        if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_CONTRACT)) {
            let contractId = Number(this.props.params.contractId)
            if (!contractId) {
                browserHistory.replace(`/page_not_found`)
            }
            LoadingIndicatorActions.showAppLoadingIndicator();
            setTimeout(() => {
                this.loadContractData(contractId)
            }, 0);
        }
    }

    componentDidUpdate() {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.props.resetState();
            this.setState({
                showSuspendDialog: false,
                showTerminateDialog: false,
                showResumeDialog: false,
                showDeleteContract: false,
                isEditMode: false
            });
            LoadingIndicatorActions.hideAppLoadingIndicator();
            if (this.props.isDeleteContractSuccess) {
                //redirect to contracts
                browserHistory.push(getUrlPath(URL.CONTRACTS));
            }
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'))
            this.props.resetError();
            LoadingIndicatorActions.hideAppLoadingIndicator();
        }
    }

    loadContractData = (contractId) => {
        contractActions.loadContractDetail(contractId, (err, result) => { this.handleLoadContractCallBackAction(err, result) });
        contractActions.loadContractSchedules(contractId, undefined, (err, result) => { this.handleLoadContractCallBackAction(err, result, ['schedules', 'flexibleSchedules']) });
        contractActions.loadContractAppendix(contractId, (err, result) => {
            this.handleLoadContractCallBackAction(err, { appendix: result }, ['appendix'])
        })
    }
    viewSchedule() {
        let scheduleId = _.get(this.state, 'contract.schedules[0].id');
        if (!scheduleId) {
            browserHistory.replace(`/page_not_found`)
        } else {
            browserHistory.push(getUrlPath(URL.SCHEDULE, { scheduleId }));
        }
    }

    handleClickSaveButton() {
        if (this.editContractRef.validate()) {
            this.contractToEdit = this.editContractRef.getValue();
            let contractToEditClone = _.cloneDeep(this.contractToEdit);

            let originContract = _.cloneDeep(this.state.contract);
            _.forEach([originContract, contractToEditClone], contract => {
                _.forEach(['schedules', 'flexibleSchedules'], field => {
                    _.forEach(contract[field], item => {
                        _.unset(item, 'group.supervisor');
                        _.forEach(item.shifts, shift => {
                            _.forEach(shift.requires, require => {
                                _.unset(require, 'id');
                                _.unset(require, 'jobRole.color');
                            })
                        })
                    })
                })
            })
            const isFutureContract = dateHelper.getTimeOfOnlyDate(this.state.contract.startDate) >= dateHelper.getTimeOfOnlyDate(new Date());
            const isDifferenceSchedules = !_.isEqual(contractToEditClone.flexibleSchedules, originContract.flexibleSchedules)
                || !_.isEqual(contractToEditClone.schedules, originContract.schedules);

            if (isDifferenceSchedules && !isFutureContract) {
                this.setState({ isOpenAlertDialog: true });
            } else {
                this.handleSaveEditContract();
            }
        }
    }

    handleSaveEditContract = () => {
        LoadingIndicatorActions.showAppLoadingIndicator();
        let contractToEdit = _.cloneDeep(this.contractToEdit);
        if (this.state.isOpenEffectedDate) {
            if (!this.effectedDate.validate()) return;
            contractToEdit.appendixEffectDate = this.effectedDate.getValue();
        }
        contractActions.editContract(contractToEdit, (err) => {
            if (!err) {
                this.setState({ isEditMode: false, isOpenEffectedDate: false, contract:contractToEdit });
            }
            this.handleCallBackAction(err);
        })
    }

    handleCallBackAction = (err, data) => {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (data) {
            this.setState({
                contract: {
                    ...this.state.contract,
                    status: data.status
                },
                showSuspendDialog: false,
                showTerminateDialog: false,
                showResumeDialog: false,
                showDeleteContract: false,
                isEditMode: false
            });
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
        }
        else {
            toastr.error(err.message, RS.getString('ERROR'))
        }
    }

    handleSwitchEditMode() {
        this.setState({ isEditMode: true });
        setTimeout(() => {
            this.props.locationActions.loadLocations({});
            this.props.jobRoleSettingAction.loadJobRolesSetting({});
            this.props.contractActions.loadAllContract({});
            this.props.groupActions.loadGroupSubs(this.state.contract.group.id);
            this.props.shiftTemplateSettingActions.loadShiftTemplatesSetting({});
        });
    }

    handleSuspendContract(date, reason) {
        let contract = _.cloneDeep(this.state.contract);
        if (date) {
            contract.suspendDate = date;
        }
        contract.suspendReason = reason;
        LoadingIndicatorActions.showAppLoadingIndicator();
        contractActions.suspendContract(contract, this.handleCallBackAction);
    }

    handleTerminateContract(date, reason) {
        let contract = _.cloneDeep(this.state.contract);
        if (date) {
            contract.terminateDate = date;
        }
        contract.terminateReason = reason;
        LoadingIndicatorActions.showAppLoadingIndicator();
        contractActions.terminateContract(contract, this.handleCallBackAction);
    }

    handleResumeContract(date, reason) {
        let contract = _.cloneDeep(this.state.contract);
        if (date) {
            contract.resumeDate = date;
        }
        contract.resumeReason = reason;
        LoadingIndicatorActions.showAppLoadingIndicator();
        contractActions.resumeContract(contract, this.handleCallBackAction);
    }

    handleDeleteContract() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.contractActions.deleteContract(this.state.contract.id);
    }

    handleLoadContractCallBackAction(err, result, fields) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'))
        }
        else {
            if (fields) {
                fields.forEach(field => {
                    if (field == 'schedules' || field == 'flexibleSchedules') {
                        result[field].forEach(item => {
                            contractActions.loadContractSchedulesShift(item.contractId, item.id, undefined, (err, shifts) => {
                                LoadingIndicatorActions.hideAppLoadingIndicator();
                                if (err) {
                                    toastr.error(err.message, RS.getString('ERROR'));
                                }
                                else if (shifts.length) {
                                    let items = _.cloneDeep(this.state.contract[field])
                                    let indexItem = _.findIndex(items, x => x.id == item.id);
                                    items[indexItem].shifts = shifts;
                                    this.setState({
                                        contract: {
                                            ...this.state.contract,
                                            [field]: items
                                        }
                                    });
                                }
                            });
                        });
                    }
                    this.state.contract[field] = result[field];
                });
                this.setState({
                    contract: this.state.contract
                });
            } else {
                this.setState({
                    contract: {
                        ...this.state.contract,
                        ...result
                    }
                });
            }
        }
    }
    handleViewAppendix() {
        let lastAppendix = _.last(this.state.contract.appendix);
        if (lastAppendix) {
            browserHistory.push(getUrlPath(URL.CONTRACT_APPENDIX, { contractId: this.state.contract.id, appendixId: lastAppendix.id }))
        }
    }
    render() {
        let linkBreadcrumb = [{
            key: RS.getString("CONTRACTS"),
            value: getUrlPath(URL.CONTRACTS)
        }];
        let groups = [...this.props.groupSubs, ...(_.get(this.state.contract, 'group', []))];
        let completedOrTerminated = _.includes([CONTRACT_STATUS.COMPLETED, CONTRACT_STATUS.TERMINATED], this.state.contract.status);
        let actionAlert = [
            <RaisedButton
                key={0}
                label={RS.getString("CANCEL")}
                onClick={() => { this.setState({ isOpenAlertDialog: false }) }}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString("CONFIRM")}
                onClick={() => { this.setState({ isOpenAlertDialog: false, isOpenEffectedDate: true }) }}
            />
        ];
        const { startDate, endDate } = this.state.contract;

        let effectedDateConstraint =
            _.assign({}, fieldValidations.date, fieldValidations.dateRange(startDate, endDate, RS.format('INVALID_DATE', ['START_DATE', 'END_DATE'])));

        if (dateHelper.getTimeOfOnlyDate(startDate) < dateHelper.getTimeOfOnlyDate(new Date())) {
            const startDateValue = moment(new Date()).add(1, 'days');
            effectedDateConstraint = _.assign({}, fieldValidations.date, fieldValidations.dateRange(startDateValue, endDate, RS.format('INVALID_DATE', ['TODAY', 'END_DATE'])));
        }
        return (
            <div className="page-container new-contract contract-detail">
                <div className="header">
                    {_.get(this.state, 'contract.identifier')}
                    {_.get(this.state, 'contract.status') ?
                        <span className={"status " + _.get(this.state, 'contract.status')}>
                            {_.get(this.state, 'contract.status')}
                        </span>
                        : null
                    }
                    {
                        this.state.contract.appendix && this.state.contract.appendix.length ?
                            <RaisedButton
                                label={RS.getString('VIEW_APPENDIX')}
                                onClick={this.handleViewAppendix}
                                className="raised-button-first-secondary right"
                            /> : null
                    }

                </div>
                <Breadcrumb link={linkBreadcrumb} />
                {
                    this.state.isEditMode ?
                        <EditContract
                            {...this.props}
                            contract={this.state.contract}
                            groups={groups}
                            ref={component => this.editContractRef = component}
                        /> :
                        <ViewContract
                            {...this.props}
                            contract={this.state.contract}
                        />
                }
                <div>
                    {
                        this.state.isEditMode ?
                            <div className="footer-container text-right">
                                <RaisedButton
                                    label={RS.getString('CANCEL')}
                                    onClick={() => this.setState({ isEditMode: false })}
                                    className="raised-button-fourth"
                                />
                                <RaisedButton
                                    label={RS.getString('SAVE')}
                                    onClick={this.handleClickSaveButton}
                                />
                            </div> :
                            <div className="footer-container text-right">
                                <RaisedButton
                                    label={RS.getString('DELETE')}
                                    onClick={() => { this.setState({ showDeleteContract: true }) }}
                                    className="raised-button-third"
                                />
                                {
                                    !completedOrTerminated &&
                                    <RaisedButton
                                        label={RS.getString('TERMINATE')}
                                        onClick={() => { this.setState({ showTerminateDialog: true }); }}
                                        className="raised-button-third-secondary"
                                    />
                                }
                                {
                                    !completedOrTerminated &&
                                    (
                                        this.state.contract.status == CONTRACT_STATUS.SUSPENDED ?
                                            <RaisedButton
                                                label={RS.getString('RESUME')}
                                                onClick={() => { this.setState({ showResumeDialog: true }); }}
                                                className="raised-button-first-secondary"
                                            /> :
                                            <RaisedButton
                                                label={RS.getString('SUSPEND')}
                                                onClick={() => { this.setState({ showSuspendDialog: true }); }}
                                                className="raised-button-third-secondary"
                                            />
                                    )
                                }
                                {
                                    this.state.contract.status !== CONTRACT_STATUS.COMPLETED &&
                                    <RaisedButton
                                        label={RS.getString('VIEW_SCHEDULE')}
                                        onClick={this.viewSchedule.bind(this)}
                                        className="raised-button-first-secondary"
                                    />
                                }
                                {
                                    !completedOrTerminated &&
                                    <RaisedButton
                                        label={RS.getString('EDIT')}
                                        onClick={this.handleSwitchEditMode}
                                    />
                                }
                            </div>
                    }
                </div>
                <DialogContractAction
                    isOpen={this.state.showSuspendDialog}
                    title={RS.getString('SUSPEND_CONTRACT', null, 'UPPER')}
                    option1={{
                        title: RS.getString('P134'),
                        checked: true
                    }}
                    option2={{
                        title: RS.getString('P135')
                    }}
                    contract={this.state.contract}
                    handleCancel={() => this.setState({ showSuspendDialog: false })}
                    handleSubmit={this.handleSuspendContract}
                />
                <DialogContractAction
                    isOpen={this.state.showTerminateDialog}
                    title={RS.getString('TERMINATE_CONTRACT', null, 'UPPER')}
                    option1={{
                        title: RS.getString('P136'),
                        checked: true
                    }}
                    option2={{
                        title: RS.getString('P137')
                    }}
                    contract={this.state.contract}
                    handleCancel={() => this.setState({ showTerminateDialog: false })}
                    handleSubmit={this.handleTerminateContract}
                />
                <DialogContractAction
                    isOpen={this.state.showResumeDialog}
                    title={RS.getString('RESUME_CONTRACT', null, 'UPPER')}
                    option1={{
                        title: RS.getString('P138'),
                        checked: true
                    }}
                    option2={{
                        title: RS.getString('P139')
                    }}
                    contract={this.state.contract}
                    handleCancel={() => this.setState({ showResumeDialog: false })}
                    handleSubmit={this.handleResumeContract}
                />
                <DialogConfirm
                    style={{ 'widthBody': '400px' }}
                    title={RS.getString('DELETE')}
                    isOpen={this.state.showDeleteContract}
                    handleSubmit={this.handleDeleteContract}
                    handleClose={() => this.setState({ showDeleteContract: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'CONTRACT')} </span>
                </DialogConfirm>
                <DialogAlert
                    modal={false}
                    icon={require("../../../../images/infoIcon.png")}
                    isOpen={this.state.isOpenAlertDialog}
                    title={RS.getString('CONFIRMATION')}
                    handleClose={() => this.setState({ isOpenAlertDialog: false })}
                    actions={actionAlert}
                >
                    <div dangerouslySetInnerHTML={{ __html: RS.getString('P151') }} />
                </DialogAlert>
                <DialogAppendix
                    style={{ widthBody: '510px' }}
                    isOpen={this.state.isOpenEffectedDate}
                    title={RS.getString('APPENDIX', null, 'UPPER')}
                    actions={[
                        <RaisedButton
                            key={1}
                            className="raised-button-fourth"
                            label={RS.getString('CANCEL')}
                            onClick={() => { this.setState({ isOpenEffectedDate: false }); }}
                        />,
                        <RaisedButton
                            key={0}
                            label={RS.getString('SAVE')}
                            onClick={this.handleSaveEditContract}
                        />
                    ]}
                    handleClose={() => { this.setState({ isOpenEffectedDate: false }); }}
                    modal
                >
                    <div className="affected-date">
                        <span>{RS.getString('EFFECTED_DATE')} {RS.getString('FROM', null, 'LOWER')}</span>
                        <CommonDatePicker
                            ref={(input) => this.effectedDate = input}
                            hintText="dd/mm/yyyy"
                            id="effectedDate"
                            defaultValue={new Date()}
                            orientation="top auto"
                            language={RS.getString("LANG_KEY")}
                            constraint={effectedDateConstraint}
                        />
                        <span> {RS.getString('P142')}</span>
                    </div>
                </DialogAppendix>
                <LoadingIndicator
                    containerId={LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR}
                    config={LOADING_INDICATOR_STYLE.app}
                />
            </div>
        );
    }
}

ContractDetail.propTypes = {
}

export default ContractDetail;