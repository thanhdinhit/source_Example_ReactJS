import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../../elements/Dialog';
import TextView from '../../../elements/TextView';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import RaisedButton from '../../../elements/RaisedButton';
import DialogConfirm from '../../../elements/DialogConfirm';
import CommonSelect from '../../../elements/CommonSelect.component';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonTimePicker from '../../../elements/DatePicker/CommonTimePicker';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import TextArea from '../../../elements/TextArea';

import * as timesheetActions from '../../../../actionsv2/timesheetActions';
import { searchSchedules } from '../../../../actionsv2/scheduleActions';
import { loadCustomers } from '../../../../actionsv2/customerActions';
import * as toastr from '../../../../utils/toastr';
import { STATUS, LEAVE_ACTION_TYPE, TIMESHEET_TYPE, getOptionNone, WORKING_TIME_TYPE } from '../../../../core/common/constants';
import { EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';
import RS from '../../../../resources/resourceManager';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from "../../../../utils/loadingIndicatorActions";
import { getTimesheetDetailConstraints } from '../../../../validation/timesheetDetailConstraint';

const propTypes = {
    isOpen: PropTypes.bool,
    timesheet: PropTypes.object,
    loadEmployeeTimesheets: PropTypes.func,
    handleClose: PropTypes.func,
    timesheetId: PropTypes.number,
    customers: PropTypes.array,
    timesheetTypes: PropTypes.array
};

class DialogViewEmployeeTimesheetDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timesheet: null,
            isOpenDeclineApprove: false,
            isOpenDialogTimesheetAction: false,
            showWarningBox: true,
            actionTimesheetType: null,
            timesheetType: null,
            customers: [],
            schedules: []
        };
        this.validate = this.validate.bind(this);
        this.handleUpdateTimesheet = this.handleUpdateTimesheet.bind(this);
        this.handleChangeTimesheetType = this.handleChangeTimesheetType.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            loadCustomers({}, this.handleCallbackAction.bind(this, 'customers'));
            searchSchedules('', this.handleCallbackAction.bind(this, 'schedules'));
        }, 0);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.timesheetId) {
            timesheetActions.loadMemberTimesheetDetail(nextProps.timesheetId, this.handleCallbackAction.bind(this, 'timesheet'));
        }
        if (!nextProps.isOpen) {
            this.setState({ timesheet: null })
        }
    }

    handleCallbackAction = (field, err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'));
            return;
        }
        switch (field) {
            case 'timesheet': {
                this.setState({ timesheet: result, timesheetType: { name: _.get(result, 'timesheetType.name') } });
                return;
            }
            case 'customers':
            case 'schedules': {
                this.setState({ [field]: result });
                return;
            }
            case 'updateTimesheet': {
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                this.props.handleClose();
                this.props.loadEmployeeTimesheets();
            }
            default: return;
        }
    }

    validate() {
        let rs = true;
        let fieldValidates = ['type', 'approvedHours', 'approvedMinute', 'comment'];
        if (this.state.timesheetType.name == TIMESHEET_TYPE.UNKNOWN) {
            fieldValidates = ['customer', 'schedule', 'comment'];
        }
        _.forEach(fieldValidates, field => {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        })
        return rs;
    }

    handleUpdateTimesheet(isApproved) {
        if (this.validate()) {
            let timesheetToEdit = {};
            const { timesheet } = this.state;

            timesheetToEdit.employee = timesheet.employee;
            timesheetToEdit.approver = timesheet.approver;
            timesheetToEdit.location = timesheet.location;
            timesheetToEdit.clockIn = timesheet.clockIn;
            timesheetToEdit.clockOut = timesheet.clockOut;
            timesheetToEdit.approvedHours = timesheet.approvedHours;
            timesheetToEdit.timesheetType = timesheet.timesheetType;
            timesheetToEdit.employee = timesheet.employee;
            timesheetToEdit.timesheetStatus = timesheet.timesheetStatus;
            timesheetToEdit.group = timesheet.group;

            timesheetToEdit.comment = this.comment.getValue();

            if (this.state.timesheetType.name == TIMESHEET_TYPE.UNKNOWN) {
                timesheetToEdit = _.assign({}, timesheetToEdit, {
                    customer: this.customer.getValue() || timesheet.customer,
                    //scheduleId: this.schedule.getValue().id || timesheet.scheduleId
                });

                if (timesheetToEdit.customer.id == null) timesheetToEdit.customer = null;

            } else {
                timesheetToEdit.approvedHours = _.toNumber(this.approvedHours.getValue()) + _.toNumber((this.approvedMinute.getValue()) / 60);
            }
            
            if (isApproved) {
                timesheetToEdit.timesheetStatus = STATUS.APPROVED;
            }
            
            showAppLoadingIndicator();
            timesheetActions.updateMemberTimesheet(timesheet.id, timesheetToEdit, this.handleCallbackAction.bind(this, 'updateTimesheet'));
        }
    }

    handleClickTimesheetAction(actionType, timesheet) {
        this.setState({
            actionTimesheetType: actionType,
            isOpenDialogTimesheetAction: true
        });
    }

    handleChangeTimesheetType(type) {
        this.setState({ timesheetType: type })
    }

    renderOption = (option) => {
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={_.get(option, 'photoUrl') ? (API_FILE + option.photoUrl)
                    : require('../../../../images/avatarDefault.png')} />
                <span className="avatar-label">{_.get(option, 'fullName')}</span>
            </div>
        );
    }

    render() {
        if (!this.state.timesheet) return null;
        const { timesheet } = this.state;
        const actions = [
            <RaisedButton
                key="close"
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
            />,
            <RaisedButton
                key="save"
                className="raised-button-first"
                label={RS.getString('SAVE')}
                onClick={this.handleUpdateTimesheet.bind(this, false)}
            />
        ];
        switch (timesheet.timesheetStatus) {
            case STATUS.PENDING:
                actions.push(
                    <RaisedButton
                        key="approve"
                        className="raised-button-first"
                        label={RS.getString('APPROVE')}
                        onClick={this.handleUpdateTimesheet.bind(this, true)}
                    />
                );
                break;
        }
        let clockedInLocation = timesheet.clockedInLocation == _.get(timesheet, 'location.name') ? timesheet.location : { name: RS.getString('UNKNOWN'), id: null };
        let clockedOutLocation = timesheet.clockedOutLocation == _.get(timesheet, 'location.name') ? timesheet.location : { name: RS.getString('UNKNOWN'), id: null };

        let constraints = getTimesheetDetailConstraints();
        let canEditMandatoryFields = _.get(this.state.timesheetType, 'name') == TIMESHEET_TYPE.UNKNOWN;
        const timesheetTypes = [...this.props.timesheetTypes, { name: TIMESHEET_TYPE.UNKNOWN }];

        let schedule = { name: 'None', id: null }, customer = { customerName: 'None', id: null };
        let customers = [{ customerName: 'None', id: null }], schedules = [{ name: 'None', id: null }];
        if (_.get(timesheet, 'employee.workingTimeType') == WORKING_TIME_TYPE.DEPEND_ON_SHIFTS) {
            customers = this.state.customers;
            schedules = this.state.schedules;
            schedule = _.find(this.state.schedules, schedule => {
                return schedule.id == timesheet.scheduleId;
            })
            customer = _.find(this.state.customers, customer => {
                return customer.id = timesheet.customerId;
            })
        }

        return (
            <div>
                <Dialog
                    style={'496px'}
                    isOpen={this.props.isOpen}
                    title={RS.getString('EDIT_TIMESHEET_ENTRY', null, 'UPPER')}
                    handleClose={this.props.handleClose}
                    actions={actions}
                    className="view-timesheet-detail"
                    modal
                >
                    <div className="view-leave-detail">
                        <div className="row">
                            <div className="col-md-12 col-xs-12">
                                <CommonSelect
                                    clearable={false}
                                    disabled={!canEditMandatoryFields}
                                    title={RS.getString('CUSTOMER_NAME')}
                                    placeholder={RS.getString('SELECT')}
                                    name="customerName"
                                    propertyItem={{ label: 'customerName', value: 'id' }}
                                    options={customers}
                                    value={customer}
                                    ref={input => this.customer = input}
                                    constraint={constraints.customer}
                                // onChange={this.handleChangeCustomer}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-xs-12">
                                <CommonSelect
                                    clearable={false}
                                    disabled={!canEditMandatoryFields}
                                    title={RS.getString('SCHEDULE_NAME')}
                                    placeholder={RS.getString('SELECT')}
                                    name="scheduleName"
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={schedules}
                                    value={schedule}
                                    ref={input => this.schedule = input}
                                    // onChange={this.handleChangeSchedule}
                                    constraint={constraints.schedule}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-xs-12">
                                <CommonSelect
                                    clearable={false}
                                    disabled
                                    title={RS.getString('LOCATION')}
                                    placeholder={RS.getString('SELECT')}
                                    name="location"
                                    ref={(location) => this.location = location}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={[timesheet.location]}
                                    value={_.get(timesheet, 'location.id')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <CommonSelect
                                    disabled
                                    required
                                    className="has-avatar"
                                    title={RS.getString('EMPLOYEE')}
                                    placeholder={RS.getString('SELECT')}
                                    name="employee"
                                    propertyItem={{ label: 'fullName', value: 'id' }}
                                    options={[timesheet.employee]}
                                    value={_.get(timesheet, 'employee.id')}
                                    valueRenderer={this.renderOption}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <CommonSelect
                                    required
                                    title={RS.getString('TYPE')}
                                    placeholder={RS.getString('SELECT')}
                                    name="type"
                                    constraint={constraints.type}
                                    ref={(type) => this.type = type}
                                    propertyItem={{ label: 'name', value: 'name' }}
                                    options={timesheetTypes}
                                    value={this.state.timesheetType}
                                    onChange={this.handleChangeTimesheetType}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <div className="col-xs-12 col-sm-6 clocked-in-date">
                                    <CommonDatePicker
                                        disabled
                                        required
                                        title={RS.getString('CLOCKED_IN')}
                                        hintText="dd/mm/yyyy"
                                        orientation="bottom auto"
                                        language={RS.getString("LANG_KEY")}
                                        defaultValue={new Date(timesheet.clockIn)}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 clocked-in-time">
                                    <CommonTimePicker
                                        disabled
                                        title={' '}
                                        defaultValue={new Date(timesheet.clockIn)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <CommonSelect
                                    disabled
                                    title={RS.getString('CLOCKED_IN_LOCATION')}
                                    placeholder={RS.getString('SELECT')}
                                    name="clockedInLocation"
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={[clockedInLocation]}
                                    value={clockedInLocation}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <div className="col-xs-12 col-sm-6 clocked-out-date">
                                    <CommonDatePicker
                                        required
                                        disabled
                                        title={RS.getString('CLOCKED_OUT')}
                                        hintText="dd/mm/yyyy"
                                        orientation="bottom auto"
                                        language={RS.getString("LANG_KEY")}
                                        defaultValue={new Date(timesheet.clockOut)}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 clocked-out-time">
                                    <CommonTimePicker
                                        disabled
                                        title={' '}
                                        defaultValue={new Date(timesheet.clockOut)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <CommonSelect
                                    disabled
                                    title={RS.getString('CLOCKED_OUT_LOCATION')}
                                    placeholder={RS.getString('SELECT')}
                                    name="clockedOutLocation"
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={[clockedOutLocation]}
                                    value={clockedOutLocation}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <div className="col-xs-12 col-sm-6 clocked-hours">
                                    <TextView
                                        required
                                        title={RS.getString('CLOCKED_HOURS')}
                                        value={_.toString(_.floor(timesheet.clockedHours))}
                                        addon={<span className="input-group-addon text-view">{RS.getString('HOUR_PLURAL')}</span>}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 clocked-minutes">
                                    <TextView
                                        title={' '}
                                        value={_.toString(_.floor(timesheet.clockedHours * 60 % 60))}
                                        addon={<span className="input-group-addon text-view">{RS.getString('MINUTE_PLURAL')}</span>}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <div className="col-xs-12 col-sm-6 approved-hours">
                                    <CommonTextField
                                        disabled={canEditMandatoryFields}
                                        type="number"
                                        id="regular"
                                        required
                                        title={RS.getString('APPROVED_HOURS')}
                                        defaultValue={
                                            canEditMandatoryFields ? '0' :
                                                _.toString(_.floor(timesheet.approvedHours))
                                        }
                                        ref={(approvedHour) => this.approvedHours = approvedHour}
                                        constraint={constraints.approvedHour}
                                        onChange={this.handleOnChange}
                                        addon={<span>{RS.getString('HOUR_PLURAL')}</span>}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 approved-minutes">
                                    <CommonTextField
                                        disabled={canEditMandatoryFields}
                                        type="number"
                                        id="regular"
                                        title={' '}
                                        defaultValue={
                                            canEditMandatoryFields ? '0' :
                                                _.toString(_.floor(timesheet.approvedHours * 60 % 60))
                                        }
                                        ref={(approvedMinute) => this.approvedMinute = approvedMinute}
                                        constraint={constraints.approvedMinute}
                                        onChange={this.handleOnChange}
                                        addon={<span>{RS.getString('MINUTE_PLURAL')}</span>}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <TextArea
                                    required
                                    title={RS.getString('COMMENT')}
                                    line={5}
                                    constraint={constraints.comment}
                                    onBlur={this.handleCommentOnBlur}
                                    ref={(comment) => this.comment = comment}
                                    defaultValue={timesheet.comment}
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

DialogViewEmployeeTimesheetDetail.propTypes = propTypes;

export default DialogViewEmployeeTimesheetDetail;