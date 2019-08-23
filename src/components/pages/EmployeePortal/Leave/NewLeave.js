import React, { PropTypes } from 'react';
import _ from 'lodash';
import * as toastr from '../../../../utils/toastr';

import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import CommonTimePicker from '../../../elements/DatePicker/CommonTimePicker';
import FileAttachment from './FileAttachment';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import AvatarSelect from '../../../elements/AvatarSelect.component';
import MyCheckBox from '../../../elements/MyCheckBox';
import RS from '../../../../resources/resourceManager';
import { STATUS, LEAVE_TYPES } from '../../../../core/common/constants';
import { getNewLeaveConstraints } from '../../../../validation/newLeaveConstraints';
import { EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as myProfileActions from '../../../../actionsv2/myProfileActions';
import * as leaveActions from '../../../../actionsv2/leaveActions';

let propTypes = {
    leaveTypes: PropTypes.array
};

class NewLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialogAttach: false,
            openDialogConfirm: false,
            attachedFiles: [],
            deleteDocumentSelected: null,
            isOpenLeaveTypeInfo: false,
            hoursAvailable: 0,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            leaveType: null,
            approvers: [],
            leaveBalances: [],
            leaveHours: 0
        };
        this.DATETIME_TYPE = {
            START_DATE: 'startDate',
            END_DATE: 'endDate',
            START_TIME: 'startTime',
            END_TIME: 'endTime'
        }
        this.dateTime = {};
        this.emails = '';
        this.handleAttachDocuments = this.handleAttachDocuments.bind(this);
        this.renderAttachments = this.renderAttachments.bind(this);
        this.openDialogAttachFile = this.openDialogAttachFile.bind(this);
        this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
        //this.handleSubmitConfirmPopup = this.handleSubmitConfirmPopup.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this);
        this.hasFullInfoTimeLeave = this.hasFullInfoTimeLeave.bind(this);
        this.handleOnChangeLeaveType = this.handleOnChangeLeaveType.bind(this);
        this.handleMedicalCertificateChange = this.handleMedicalCertificateChange.bind(this);
        this.getPrepareData = this.getPrepareData.bind(this);
        this.handleCallbackAction = this.handleCallbackAction.bind(this);
    }

    componentDidMount() {
        this.getPrepareData();
    }

    getPrepareData() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        let loadApprovers = new Promise((resolve, reject) => {
            myProfileActions.loadApprovers((err, result) => {
                this.handleCallbackAction(err, result, 'approvers');
                resolve();
            });
        });
        let loadMyLeaveBalances = new Promise((resolve, reject) => {
            leaveActions.loadMyLeaveBalances((err, result) => {
                this.handleCallbackAction(err, result, 'leaveBalances');
                resolve();
            })
        });
        Promise.all([loadApprovers, loadMyLeaveBalances]).then(LoadingIndicatorActions.hideAppLoadingIndicator);
    }

    handleCallbackAction(err, result, field) {
        if (err) {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            LoadingIndicatorActions.hideAppLoadingIndicator();
            if (field == 'submittedLeave') {
                this.props.handleClose();
            }
            return;
        }
        switch (field) {
            case 'approvers':
                this.setState({ approvers: result });
                if (result && result.length) {
                    this.approver.setValue(result[0]);
                }
                break;
            case 'leaveBalances':
                this.setState({ leaveBalances: result });
                break;
            case 'leaveHours':
                this.setState({ leaveHours: result });
                LoadingIndicatorActions.hideAppLoadingIndicator();
                break;
            case 'submittedLeave':
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                LoadingIndicatorActions.hideAppLoadingIndicator();
                this.props.handleSubmitSuccess();
                
        }
    }

    validateForm() {
        let rs = true;
        const fieldValidates = [
            'leaveType', 'startDate', 'startTime', 'endDate', 'endTime', 'approver'];
        if (_.get(this.state, 'leaveType.name') == LEAVE_TYPES.SPECIAL_LEAVE) {
            fieldValidates.push('reason');
        }
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    }

    handleOnChangeLeaveType(type) {
        const self = this;
        _.some(this.state.leaveBalances, function (item) {
            if (item.leaveType && item.leaveType.id === type.id) {
                self.setState({
                    leaveType: item.leaveType,
                    hoursAvailable: item.balance
                });
            }
        });
    }

    handleOnBlurDateTime(type, value) {
        if (this.hasFullInfoTimeLeave()) {
            LoadingIndicatorActions.showAppLoadingIndicator();
            leaveActions.calculateHours(this.getLeaveTime(), (err, result) => this.handleCallbackAction(err, result, 'leaveHours'));
            type && this.setState({ [type]: value }, () => {
                switch (type) {
                    case 'startDate': {
                        this.validateFieldHasErrors(['startTime', 'endDate', 'endTime']);
                        break;
                    }
                    case 'startTime': {
                        this.validateFieldHasErrors(['endTime']);
                        break;
                    }
                    case 'endDate': {
                        this.validateFieldHasErrors(['startDate', 'startTime', 'endTime']);
                        break;
                    }
                    case 'endTime': {
                        this.validateFieldHasErrors(['startTime']);
                        break;
                    }
                }
            });
        } else {
            type && this.setState({ [type]: value }, () => {
                if (this.dateTime['startDate'] && this.dateTime['endDate']) {
                    switch (type) {
                        case 'startDate': {
                            this.validateFieldHasErrors(['endDate']);
                            break;
                        }
                        case 'endDate': {
                            this.validateFieldHasErrors(['startDate']);
                            break;
                        }
                    }
                }
            });
        }
    }

    validateFieldHasErrors(fields) {
        const fieldErrors = this.getFieldHasErrors(fields);
        this.validateFields(fieldErrors);
    }

    getFieldHasErrors(fields) {
        let fieldValidates = [];
        _.forEach(fields, (item) => {
            this[item].hasError() && fieldValidates.push(item);
        });
        return fieldValidates;
    }

    validateFields(fields) {
        _.forEach(fields, (field) => {
            this[field].validate();
        });
    }

    getLeaveTime() {
        const { startDate, startTime, endDate, endTime } = this.dateTime;
        const leaveFrom = new Date(
            startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes(), 0
        );
        const leaveTo = new Date(
            endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes(), 0
        );
        return {
            leaveFrom,
            leaveTo
        };
    }

    hasFullInfoTimeLeave() {
        const fields = ['startDate', 'startTime', 'endDate', 'endTime'];
        const self = this;
        let isValid = true;

        _.forEach(fields, function (field) {
            const value = self[field].getValue();
            self.dateTime[field] = value;
            !value && (isValid = false);
        });

        return isValid;
    }

    handleDeleteDocument(element) {
        this.setState({
            openDialogConfirm: true,
            deleteDocumentSelected: element
        });
    }

    // handleSubmitConfirmPopup() {
    //     let attachedFiles = this.state.attachedFiles.filter(
    //         x => x.fileUrl != this.state.deleteDocumentSelected.fileUrl
    //     );
    //     this.setState({
    //         openDialogConfirm: false,
    //         attachedFiles
    //     });
    // }

    openDialogAttachFile() {
        this.setState({
            openDialogAttach: true
        });
    }

    handleAttachDocuments(files) {
        let fileAttachs = [];
        files.forEach(function (file) {
            if (file.status == STATUS.COMPLETED) {
                fileAttachs.push({ fileUrl: file.url });
            }
        }.bind(this));

        this.setState({
            attachedFiles: [...this.state.attachedFiles, ...fileAttachs]
        });
    }

    renderAttachments(attachedFiles) {
        let result = [];
        result = _.map(attachedFiles, (element, index) => {
            return (
                <FileAttachment
                    className="attached-file"
                    key={index}
                    file={element}
                    canDelete
                    deleteDocument={this.handleDeleteDocument}
                />
            );
        });

        result.push(
            <div className="attached-file attach-files" key="9999">
                <img onClick={this.openDialogAttachFile} src={require('../../../../images/add-icon.png')} />
                <span onClick={this.openDialogAttachFile}>{RS.getString('ATTACH_FILES')}</span>
            </div>
        );

        return result;
    }

    handleCancel() {
        this.props.handleClose();
    }

    handleSubmit() {
        if (this.validateForm()) {
            LoadingIndicatorActions.showAppLoadingIndicator();
            leaveActions.submitNewMyLeave(this.getValues(), (err, result) => this.handleCallbackAction(err, result, 'submittedLeave'));
        }
    }

    handleMedicalCertificateChange(checked) {
        let typeName = checked ? LEAVE_TYPES.SICK_LEAVE_WITH_CERTIFICATE : LEAVE_TYPES.SICK_LEAVE;
        let balance = _.find(this.state.leaveBalances, (balance) => balance.leaveType.name == typeName);
        if (balance && balance.leaveType) {
            this.handleOnChangeLeaveType(balance.leaveType);
        }
    }

    getValues() {
        const self = this;
        const leave = {};

        const leaveTime = this.getLeaveTime();
        leave.leaveType = this.state.leaveType;
        leave.leaveFrom = leaveTime.leaveFrom;
        leave.leaveTo = leaveTime.leaveTo;
        leave.leaveHours = this.state.leaveHours;
        //leave.attachedFiles = this.state.attachedFiles;
        const fields = [
            'approver', 'reason'
        ];
        fields.forEach(function (field) {
            if (self[field]) {
                leave[field] = self[field].getValue();
            }
        });
        return leave;
    }

    render() {
        const actions = [
            <RaisedButton
                key={0}
                className="raised-button-fourth"
                label={RS.getString('CLOSE')}
                onClick={() => this.setState({ isOpenLeaveTypeInfo: false })}
            />
        ];
        const leaveTypeOptions = _.filter(this.state.leaveBalances, (balance) => {
            return balance.leaveType && balance.leaveType.name != LEAVE_TYPES.SICK_LEAVE_WITH_CERTIFICATE;
        });
        let selectedLeaveTypeName = _.get(this.state, 'leaveType.name');

        const newLeaveConstraints = getNewLeaveConstraints();

        const startDateConstraint = newLeaveConstraints.startDate(this.state.endDate);
        const endDateConstraint = newLeaveConstraints.endDate(this.state.startDate);

        let startTimeConstraint = newLeaveConstraints.startTime(null);
        let endTimeConstraint = newLeaveConstraints.endTime(null);

        if (this.state.startDate && this.state.endDate
            && (this.state.startDate.getTime() === this.state.endDate.getTime())) {
            startTimeConstraint = newLeaveConstraints.startTime(this.state.endTime);
            let startTime = this.state.startTime;
            if (this.state.startTime) {
                startTime = new Date(this.state.startTime);
                startTime.setSeconds(this.state.startTime.getSeconds() + 10);
            }
            endTimeConstraint = newLeaveConstraints.endTime(startTime);
        }

        let hrString = this.state.hoursAvailable == 0 ? RS.getString("HR") : RS.getString("HRS");

        return (
            <div className="new-leave">
                {/* <div className="header">
                    {RS.getString('NEW_LEAVE')}
                </div>
                <div className="row row-header">
                    <div className="col col-md-6">
                        <Breadcrumb link={breadCrumb} />
                    </div>
                </div> */}
                <div className="row row-body">
                    <div className="text-view">
                        <div className="hours-available"
                            dangerouslySetInnerHTML={{
                                __html: `<span>${RS.getString('HOURS_AVAILABLE')}:<strong>
                                            ${this.state.hoursAvailable.toFixed(1)} ${hrString}
                                            </strong></span>`
                            }}
                        />
                    </div>
                    <div className="newleave-container">
                        <div className="row">
                            <div className="col-xs-12 col-md-12">
                                <div className="title leave-type-title">
                                    <span className="title required">{RS.getString('LEAVE_TYPE')}</span>
                                </div>
                                <CommonSelect
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={_.map(leaveTypeOptions, (option) => option.leaveType)}
                                    name="select-leave-type"
                                    constraint={newLeaveConstraints.leaveType}
                                    ref={(input) => this.leaveType = input}
                                    onChange={this.handleOnChangeLeaveType}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('START')}
                                    ref={(input) => this.startDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="start-date"
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.START_DATE)}
                                    constraint={startDateConstraint}
                                />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <CommonTimePicker
                                    title={' '}
                                    ref={(timePicker) => this.startTime = timePicker}
                                    onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.START_TIME)}
                                    constraint={startTimeConstraint}
                                />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('END')}
                                    ref={(input) => this.endDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="end-date"
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.END_DATE)}
                                    constraint={endDateConstraint}
                                />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <CommonTimePicker
                                    title={' '}
                                    ref={(timePicker) => this.endTime = timePicker}
                                    onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.END_TIME)}
                                    constraint={endTimeConstraint}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-12">
                                <CommonTextField
                                    title={RS.getString('LEAVE_HOURS')}
                                    id="leaveHours"
                                    defaultValue={this.state.leaveHours.toFixed(1)}
                                    ref={(input) => this.leaveHours = input}
                                    disabled
                                />
                            </div>
                            <div className="col-xs-12 col-md-12">
                                <AvatarSelect
                                    title={RS.getString('APPROVER')}
                                    placeholder={RS.getString('SELECT')}
                                    options={this.state.approvers}
                                    propertyItem={{ label: 'fullName', value: 'id' }}
                                    clearable={false}
                                    searchable={false}
                                    name="select-approver"
                                    constraint={newLeaveConstraints.approver}
                                    ref={(input) => this.approver = input}
                                    disabled
                                />
                            </div>
                            {
                                selectedLeaveTypeName == LEAVE_TYPES.SPECIAL_LEAVE &&
                                <div className="col-xs-12 col-md-12" >
                                    <CommonTextField
                                        required
                                        title={RS.getString('REASON')}
                                        id="reason"
                                        constraint={newLeaveConstraints.reason}
                                        ref={(input) => this.reason = input}
                                        hintText={RS.getString('WRITE_YOUR_REASON')}
                                    />
                                </div>
                            }
                            {
                                (selectedLeaveTypeName == LEAVE_TYPES.SICK_LEAVE || selectedLeaveTypeName == LEAVE_TYPES.SICK_LEAVE_WITH_CERTIFICATE) &&
                                <div className="col-xs-12 col-md-12">
                                    <MyCheckBox
                                        bodyClassName="with-medical-certificate"
                                        label={RS.getString('WITH_MEDICAL_CERTIFICATE')}
                                        defaultValue={false}
                                        onChange={this.handleMedicalCertificateChange}
                                    />
                                </div>
                            }
                        </div>
                        <div className="row">
                            <div className="footer-container text-right">
                                <RaisedButton
                                    label={RS.getString('CANCEL')}
                                    onClick={this.handleCancel}
                                    className="raised-button-fourth"
                                />
                                <RaisedButton
                                    label={<span className="label-icon">{RS.getString('SUBMIT')}</span>}
                                    onClick={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <DialogAttachFile
                    isOpen={this.state.openDialogAttach}
                    allowTypes={EMPLOYEE_ATTACHFILE.allowTypes}
                    maxSize={EMPLOYEE_ATTACHFILE.maxSize}
                    handleClose={() => {
                        this.setState({ openDialogAttach: false });
                    }}
                    handleAttach={this.handleAttachDocuments}
                />
                {/* <DialogConfirm
                    title={RS.getString('CONFIRM')}
                    isOpen={this.state.openDialogConfirm}
                    handleSubmit={this.handleSubmitConfirmPopup}
                    handleClose={() =>
                        this.setState({ openDialogConfirm: false })
                    }
                    data={this.state.deleteDocumentSelected}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FILE')} </span>
                </DialogConfirm> */}
                <Dialog
                    isOpen={this.state.isOpenLeaveTypeInfo}
                    title={RS.getString('REGULARTIONS_ON_PAID_LEAVE', null, 'UPPER')}
                    actions={actions}
                    handleClose={() => this.setState({ isOpenLeaveTypeInfo: false })}
                    className="leave-type-info"
                >
                    <div>
                        <div className="title">{RS.getString('ANNUAL_LEAVE', null, 'UPPER')}</div>
                        <span>{RS.getString('P122')}</span>
                        <div className="title">{RS.getString('SICK_LEAVE', null, 'UPPER')}</div>
                        <span>{RS.getString('P123')}</span>
                    </div>
                </Dialog>
            </div>
        );
    }
}

NewLeave.propTypes = propTypes;
export default NewLeave;