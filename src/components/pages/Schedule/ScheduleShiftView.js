
import React, { PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import * as apiHelper from '../../../utils/apiHelper';
import dateHelper, { days } from '../../../utils/dateHelper';
import CellScheduleDay from './CellScheduleDay';
import DialogCopySchedule from '../../elements/Dialog';
import DialogAddScheduleShift from '../CustomerManagement/ContractManagement/DialogAddLocationShifts';
import DialogAssignEmployee from './DialogAssignEmployee';
import DialogCreateOvertime from './DialogCreateOvertime';
import DialogEditLocationShift from '../CustomerManagement/ContractManagement/DialogEditLocationShift';
import DialogReplaceEmployee from './DialogReplaceEmployee';
import DialogAddEmployee from './DialogAddEmployee';
import DialogCopyDayToDays from './DialogCopyDayToDays';

import { DATETIME, TIMEFORMAT, SCHEDULE_STATUS, defaultColor, REPLACE_OPTIONS } from '../../../core/common/constants';
import DialogConfirm from '../../elements/DialogConfirm';
import * as scheduelActions from '../../../actionsv2/scheduleActions';
import * as overtimeActions from '../../../actionsv2/overtimeActions';
import * as employeeActions from '../../../actionsv2/employeeActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';
import * as toastr from '../../../utils/toastr';

const propTypes = {
    days: PropTypes.array,
    dateRange: PropTypes.object
};
class ScheduleShiftView extends React.Component {
    constructor(props) {
        super(props);

        let blockDefault = {
            assignments: {
                employees: []
            },
            requirementNumber: 0,
            jobMissing: {
                id: undefined
            },
            scheduleShiftId: undefined
        };

        this.handleSendOvertimeRequest = null;
        this.handleBackFromOvertimeRequest = null;

        this.state = {
            isOpenDialogAddShift: false,
            isOpenDialogDeleteShift: false,
            isOpenDialogReplaceEmployee: false,
            isOpenDialogAddEmployee: false,
            isOpenDialogCreateOvertime: false,
            isOpenEditShift: false,
            isOpenCopyDialog: false,
            isOpenDialogAssignEmployee: false,
            employeesToAssign: [],
            employeesToReplace: [],
            overtimeRate: [],
            block: blockDefault,
            selectedShift: {},
            selectedAssignment: {},
            selectedReplacement: {},
            replacementData: {},
            overtimeEmployees: [],

        }

        this.handleOpenDialogAddShift = this.handleOpenDialogAddShift.bind(this);
        this.handleAddShifts = this.handleAddShifts.bind(this);
        this.handleOpenDialogAssignEmployee = this.handleOpenDialogAssignEmployee.bind(this);
        this.handleCloseDialogAssignEmployee = this.handleCloseDialogAssignEmployee.bind(this);
        this.handleBackFromOvertimeRequestToAssign = this.handleBackFromOvertimeRequestToAssign.bind(this);
        this.handleOpenDialogReplaceEmployee = this.handleOpenDialogReplaceEmployee.bind(this);
        this.handleCloseDialogReplaceEmployee = this.handleCloseDialogReplaceEmployee.bind(this);
        this.handleOpenDialogAddEmployee = this.handleOpenDialogAddEmployee.bind(this);
        this.handleCloseDialogAddEmployee = this.handleCloseDialogAddEmployee.bind(this);
        this.handleNextFromReplaceToOvertimeRequest = this.handleNextFromReplaceToOvertimeRequest.bind(this);
        this.handleBackFromOvertimeRequestToReplace = this.handleBackFromOvertimeRequestToReplace.bind(this);
        this.handleAddEmployee = this.handleAddEmployee.bind(this);
        this.handleReplaceEmployee = this.handleReplaceEmployee.bind(this);
        this.handleSaveAssignEmployee = this.handleSaveAssignEmployee.bind(this);
        this.handlePublishAssignEmployee = this.handlePublishAssignEmployee.bind(this);
        this.handleAssignEmployee = this.handleAssignEmployee.bind(this);
        this.handleNextFromAssignToOvertimeRequest = this.handleNextFromAssignToOvertimeRequest.bind(this);
        this.handleSendWithOT = this.handleSendWithOT.bind(this);
        this.updateBlock = this.updateBlock.bind(this);
        this.deleteScheduleShift = this.deleteScheduleShift.bind(this);
        this.openDialogDeleteScheduleShift = this.openDialogDeleteScheduleShift.bind(this)
        this.handleOpenDialogEditScheduleShift = this.handleOpenDialogEditScheduleShift.bind(this)
        this.handleEditScheduleShift = this.handleEditScheduleShift.bind(this);
        this.handleCallBackAction = this.handleCallBackAction.bind(this);
        this.handleNotifyAssignment = this.handleNotifyAssignment.bind(this);
        this.notifyShift = this.notifyShift.bind(this);
        this.handleRemoveAssignment = this.handleRemoveAssignment.bind(this);
        this.searchAssignmentAvailability = this.searchAssignmentAvailability.bind(this);
        this.searchReplacementAvailability = this.searchReplacementAvailability.bind(this);
        this.searchResourcePool = this.searchResourcePool.bind(this);
    }

    componentDidMount() {
        overtimeActions.getOvertimeRateSetting((err, results) => {
            this.setState({
                overtimeRate: results || []
            });
        });
    }

    handleOpenDialogAddShift(weekday) {
        this.setState({
            isOpenDialogAddShift: true,
            weekday
        });
    }

    handleOpenDialogAssignEmployee(jobMissing, shift) {
        let blockAssignEmployee = {
            scheduleShiftId: shift.data.id,
            jobMissing: {
                id: jobMissing.jobRole.id,
                name: jobMissing.jobRole.name,
                number: jobMissing.number,
                requirementId: jobMissing.requirementId
            },
            assignments: {
                scheduleShiftId: shift.data.id,
                employees: [],
                status: null
            },
            requirementNumber: _.sumBy(shift.data.requirements, 'number') - _.size(shift.data.assignments)
        };
        this.setState({
            isOpenDialogAssignEmployee: true,
            block: {
                ...this.state.block,
                ...blockAssignEmployee
            },
            selectedShift: shift.data
        });
    }

    handleCloseDialogAssignEmployee() {
        this.setState({
            isOpenDialogAssignEmployee: false,
            block: {
                ...this.state.block,
                assignments: {
                    employees: []
                }
            },
            isOpenDialogCreateOvertime: false
        });
    }

    handleBackFromOvertimeRequestToAssign() {
        this.setState({
            isOpenDialogCreateOvertime: false
        })
    }

    handleOpenDialogReplaceEmployee(assignment, shift, cellScheduleShift) {
        this.setState({
            isOpenDialogReplaceEmployee: true,
            selectedAssignment: assignment,
            selectedReplacement: _.cloneDeep(assignment.replacement) || {},
            selectedShift: shift.data
        });
        this.cellScheduleShift = cellScheduleShift;
    }

    handleCloseDialogReplaceEmployee() {
        this.setState({
            isOpenDialogReplaceEmployee: false,
            isOpenDialogCreateOvertime: false,
            selectedAssignment: {},
            replaceInfo: null
        });
        this.cellScheduleShift.openPopover();
    }

    handleOpenDialogAddEmployee(replaceInfo) {
        this.setState({
            isOpenDialogReplaceEmployee: false,
            isOpenDialogAddEmployee: true,
            replaceInfo
        });
    }

    handleCloseDialogAddEmployee() {
        this.setState({
            isOpenDialogReplaceEmployee: true,
            isOpenDialogAddEmployee: false
        });
    }

    handleNextFromReplaceToOvertimeRequest(employees, replaceInfo) {
        this.setState({
            isOpenDialogReplaceEmployee: false,
            isOpenDialogCreateOvertime: true,
            overtimeEmployees: employees
        });
        this.handleSendOvertimeRequest = this.handleReplaceEmployee.bind(this, replaceInfo);
        this.handleBackFromOvertimeRequest = this.handleBackFromOvertimeRequestToReplace;
    }

    handleBackFromOvertimeRequestToReplace(employees) {
        this.setState({
            isOpenDialogReplaceEmployee: true,
            isOpenDialogCreateOvertime: false
        });
    }

    handleAddEmployee(employee) {
        this.setState({
            selectedReplacement: _.assign({}, this.state.selectedReplacement, { employee })
        });
    }

    handleReplaceEmployee(replaceInfo, overtimeRate, comment) {
        let data = {
            replacementEmployeeId: replaceInfo.replacementEmployeeId,
            action: replaceInfo.action
        };
        let scheduleId = this.props.schedule.id;
        let shiftId = this.state.selectedShift.id;
        let assignmentId = this.state.selectedAssignment.id;
        switch (replaceInfo.replaceOption) {
            case REPLACE_OPTIONS.SELECTED_SHIFT_ONLY:
                data.option = 'Full';
                data.isOvertime = replaceInfo.isOvertime;
                if (data.isOvertime) {
                    data.payRateTypeId = overtimeRate.id;
                    data.comment = comment;
                }
                scheduelActions.replaceEmployeeSingleShift(scheduleId, shiftId, assignmentId, data, this.callbackReplaceEmployee);
                break;
            case REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT:
                data.option = 'Partial';
                data.isOvertime = replaceInfo.isOvertime;
                if (data.isOvertime) {
                    data.payRateTypeId = overtimeRate.id;
                    data.comment = comment;
                }
                scheduelActions.replaceEmployeeSingleShift(scheduleId, shiftId, assignmentId, data, this.callbackReplaceEmployee);
                break;
            case REPLACE_OPTIONS.IN_DATE_RANGE:
                data.from = replaceInfo.replaceFrom;
                data.to = replaceInfo.replaceTo;
                scheduelActions.replaceEmployeeMultipleShift(scheduleId, assignmentId, data, this.callbackReplaceEmployee);
                break;
            case REPLACE_OPTIONS.ALL:
                data.from = null;
                data.to = null;
                scheduelActions.replaceEmployeeMultipleShift(scheduleId, assignmentId, data, this.callbackReplaceEmployee);
                break;
        }
    }

    callbackReplaceEmployee = (err) => {
        !err && this.handleCloseDialogReplaceEmployee();
        this.handleCallBackAction(err)
    }

    searchAssignmentAvailability(filter) {
        filter.from = this.state.selectedShift.startTime;
        filter.to = this.state.selectedShift.endTime;

        let queryString = this.convertFilterToQueryString(filter);
        employeeActions.searchAssignmentAvailability(queryString, (err, results) => {
            this.setState({ employeesToAssign: results });
        });
    }

    searchReplacementAvailability(filter) {
        switch (_.get(this.state, 'replaceInfo.replaceOption')) {
            case REPLACE_OPTIONS.SELECTED_SHIFT_ONLY:
                filter.from = this.state.selectedShift.startTime;
                filter.to = this.state.selectedShift.endTime;
                break;
            case REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT:
                filter.from = this.state.selectedAssignment.replacement.replaceFrom;
                filter.to = this.state.selectedAssignment.replacement.replaceTo;
                break;
            case REPLACE_OPTIONS.IN_DATE_RANGE:
                filter.from = this.state.replaceInfo.replaceFrom;
                filter.to = this.state.replaceInfo.replaceTo;
                break;
            case REPLACE_OPTIONS.ALL:
                filter.from = undefined;
                filter.to = undefined;
                break;
            default:
                filter.from = this.state.selectedShift.startTime;
                filter.to = this.state.selectedShift.endTime;
                break;
        }
        filter.replacedEmployeeId = this.state.selectedAssignment.employee.id
        let queryString = this.convertFilterToQueryString(filter);
        employeeActions.searchReplacementAvailability(queryString, (err, results) => {
            if (!err)
                this.setState({ employeesToReplace: results });
        });
    }

    searchResourcePool(filter) {
        employeeActions.searchResourcePool(filter, (err, results) => {
            this.setState({ employeesToReplace: results });
        });
    }

    handleAddShifts(date, shifts) {
        showAppLoadingIndicator();
        _.each(shifts, (shift) => {
            shift.scheduleId = this.props.schedule.id;
            _.each(['startTime', 'endTime', 'breakTimeFrom', 'breakTimeTo'], (field) => {
                if (shift[field]) {
                    let hour = shift[field].getHours();
                    let minute = shift[field].getMinutes();
                    shift[field] = new Date(date);
                    shift[field].setHours(hour);
                    shift[field].setMinutes(minute);
                }
            });
            if (shift.endTime < shift.startTime) {
                shift.endTime.setDate(shift.endTime.getDate() + 1);
            }
            if (shift.breakTimeFrom && shift.breakTimeTo && shift.breakTimeTo < shift.breakTimeFrom) {
                shift.breakTimeTo.setDate(shift.breakTimeTo.getDate() + 1);
            }
        });
        scheduelActions.addMultipleScheduleShift(shifts, this.callbackAddScheduleShifts);
    }

    callbackAddScheduleShifts = (results) => {
        hideAppLoadingIndicator();
        let partitions = _.partition(results, 'error');
        if (partitions[0].length) {
            let messages = _.map(partitions[0], (item) => {
                return `${RS.getString("SHIFT")} ${item.shift.startTimeString}-${item.shift.endTimeString}: ${item.error.message}`;
            });
            toastr.error(_.join(messages, '<br />'), RS.getString('ERROR'));
        }
        if (partitions[1].length) {
            toastr.success(`${RS.getString('ACTION_SUCCESSFUL')} ${partitions[1].length} ${RS.getString('SHIFT')}`, RS.getString('SUCCESSFUL'));
            let scheduleRequest = this.props.getEmployeeScheduleParams();
            this.props.loadEmployeSchedules(scheduleRequest.params, scheduleRequest.mappingData);
        }
    }

    openDialogDeleteScheduleShift(shift) {
        this.deleteShift = shift;
        this.setState({ isOpenDialogDeleteShift: true })
    }

    deleteScheduleShift() {
        scheduelActions.deleteScheduleShift(this.props.schedule.id, this.deleteShift.data.id, this.handleCallBackAction);
        this.deleteShift = undefined;
        this.setState({ isOpenDialogDeleteShift: false })
        showAppLoadingIndicator()
    }

    handleSaveAssignEmployee() {
        this.handleAssignEmployee(SCHEDULE_STATUS.TO_BE_NOTIFY);
    }

    handlePublishAssignEmployee() {
        this.handleAssignEmployee(SCHEDULE_STATUS.NOTIFIED);
    }

    handleNextFromAssignToOvertimeRequest() {
        this.setState({
            isOpenDialogCreateOvertime: true,
            overtimeEmployees: _.get(this.state, 'block.assignments.employees')
        });
        this.handleSendOvertimeRequest = this.handleSendWithOT;
        this.handleBackFromOvertimeRequest = this.handleBackFromOvertimeRequestToAssign;
    }

    handleSendWithOT(overtimeRate, comment) {
        this.handleAssignEmployee(SCHEDULE_STATUS.NOTIFIED, true, overtimeRate, comment);
    }

    handleAssignEmployee(status, isRequestOT, overtimeRate, commentOTRequest) {
        showAppLoadingIndicator();
        let scheduleShiftAssigMentsDto = {
            scheduleId: this.props.schedule.id,
            employees: _.get(this.state, 'block.assignments.employees'),
            scheduleShiftId: _.get(this.state, 'block.assignments.scheduleShiftId'),
            requirementId: _.get(this.state, 'block.jobMissing.requirementId')
        };
        scheduleShiftAssigMentsDto.status = status;
        if (isRequestOT) {
            scheduleShiftAssigMentsDto.isOvertime = true;
            scheduleShiftAssigMentsDto.payRateTypeId = overtimeRate.id;
            scheduleShiftAssigMentsDto.comment = commentOTRequest;
        }

        scheduelActions.assignMultipleEmployees(scheduleShiftAssigMentsDto, this.callbackAssignEmployees);
    }

    callbackAssignEmployees = (results) => {
        hideAppLoadingIndicator();
        this.handleCloseDialogAssignEmployee();
        let partitions = _.partition(results, 'error');
        if (partitions[0].length) {
            let messages = _.map(partitions[0], (item) => {
                return `${item.employee.fullName}: ${item.error.message}`;
            });
            toastr.error(_.join(messages, '<br />'), RS.getString('ERROR'));
        }
        if (partitions[1].length) {
            toastr.success(`${RS.getString('ACTION_SUCCESSFUL')} ${partitions[1].length} ${RS.getString('EMPLOYEES')}`, RS.getString('SUCCESSFUL'));
            let scheduleRequest = this.props.getEmployeeScheduleParams();
            this.props.loadEmployeSchedules(scheduleRequest.params, scheduleRequest.mappingData);
        }
    }

    updateBlock(block) {
        this.setState({
            block: {
                ...this.state.block,
                assignments: block.assignments
            }
        });
    }

    convertFilterToQueryString(filter) {
        let query = {};
        query.fullName = filter.fullName;
        query.jobRoleId = filter.jobRoleId;
        query.groupIds = apiHelper.getQueryStringListParams(filter.groupIds);
        query.scheduleId = this.props.schedule.id;
        query.fromDate = filter.from ? dateHelper.localToUTC(filter.from) : undefined;
        query.toDate = filter.to ? dateHelper.localToUTC(filter.to) : undefined;
        query.replacedEmployeeId = filter.replacedEmployeeId

        return query;
    }

    handleOpenDialogEditScheduleShift(shift) {
        this.shiftSelected = shift.data;
        this.setState({ isOpenEditShift: true });
    }

    handleEditScheduleShift(shift) {
        scheduelActions.editScheduleShift(
            this.shiftSelected.scheduleId,
            this.shiftSelected.id,
            _.assign({}, this.shiftSelected, shift),
            this.callbackEditScheduleShift
        );
        showAppLoadingIndicator();
    }

    callbackEditScheduleShift = (err) => {
        !err && this.setState({ isOpenEditShift: false });
        this.handleCallBackAction(err)
    }

    handleNotifyAssignment(shift, assignment) {
        showAppLoadingIndicator();
        scheduelActions.notifyAssignment(this.props.schedule.id, shift.id, assignment.id, this.handleCallBackAction)
    }

    notifyShift(shiftId) {
        showAppLoadingIndicator();
        scheduelActions.notifyShift(this.props.schedule.id, shiftId, this.handleCallBackAction)
    }

    handleSubmitCopy = (dateRangeCopy) => {
        let destination = _.map(dateRangeCopy, day => {
            return {
                from: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0),
                to: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999)
            }
        })

        let data = {
            source: [{
                from: new Date(this.daySelected.getFullYear(), this.daySelected.getMonth(), this.daySelected.getDate(), 0, 0, 0, 0),
                to: new Date(this.daySelected.getFullYear(), this.daySelected.getMonth(), this.daySelected.getDate(), 23, 59, 59, 999)
            }],
            destination
        }
        showAppLoadingIndicator();
        scheduelActions.copyScheduleShifts(this.props.schedule.id, data, (err) => {
            !err && this.setState({ isOpenCopyDialog: false });
            this.handleCallBackAction(err)
        });
    }

    handleCallBackAction(err) {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'))
        }
        else {
            let scheduleRequest = this.props.getEmployeeScheduleParams();
            this.props.loadEmployeSchedules(scheduleRequest.params, scheduleRequest.mappingData);
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
        }
    }

    handleRemoveAssignment(shiftId, data) {
        showAppLoadingIndicator();
        if (data.assignmentId) {
            scheduelActions.removeAssignment(
                this.props.schedule.id,
                shiftId,
                data.assignmentId,
                this.handleCallBackAction
            )
        } else {
            scheduelActions.removeAssignmentEmployee(
                this.props.schedule.id,
                data.employeeId,
                {
                    from: data.from || new Date(),
                    to: data.to || this.props.schedule.endDate
                },
                this.handleCallBackAction
            )
        }

    }

    render() {
        let { startTime, endTime } = this.state.selectedShift;
        const { dateRange } = this.props;
        startTime = _.get(this.state, 'selectedAssignment.replacement.replaceFrom', startTime);
        endTime = _.get(this.state, 'selectedAssignment.replacement.replaceTo', endTime);
        let timeOt = {
            from: dateHelper.formatTimeWithPattern(startTime, TIMEFORMAT.END_START_TIME) + ' ' + dateHelper.formatTimeWithPattern(startTime, TIMEFORMAT.WITHOUT_SECONDS),
            to: dateHelper.formatTimeWithPattern(endTime, TIMEFORMAT.END_START_TIME) + ' ' + dateHelper.formatTimeWithPattern(endTime, TIMEFORMAT.WITHOUT_SECONDS),
        };

        let unCopyableDays = [];
        _.forEach(_.get(this.props.scheduleShiftView, 'data', []), day => {
            if (day.hasAssignment) {
                unCopyableDays.push(day.date)
            }
        })

        return (
            <div className="schedule shift-view">
                <div className="schedule-table">
                    {
                        _.map(_.get(this.props.scheduleShiftView, 'data', []), (shiftView, index) => {
                            return (
                                <CellScheduleDay
                                    invisible={shiftView.invisible}
                                    viewMode={shiftView.viewMode}
                                    key={index}
                                    day={shiftView.date}
                                    shifts={shiftView.data}
                                    jobRoles={this.props.jobRoles}
                                    selectedShift={this.state.selectedShift}
                                    handleOpenDialogReplaceEmployee={this.handleOpenDialogReplaceEmployee}
                                    handleOpenDialogAddShift={this.handleOpenDialogAddShift.bind(this, shiftView.date)}
                                    deleteScheduleShift={this.openDialogDeleteScheduleShift}
                                    handleOpenDialogAssignEmployee={this.handleOpenDialogAssignEmployee}
                                    handleOpenDialogEditScheduleShift={this.handleOpenDialogEditScheduleShift}
                                    handleNotifyAssignment={this.handleNotifyAssignment}
                                    notifyShift={this.notifyShift}
                                    removeAssignment={this.handleRemoveAssignment}
                                    dateRange={this.props.dateRange}
                                    hasAssignment={shiftView.hasAssignment}
                                    handleOpenCopyScheduleShiftDay={() => { this.daySelected = shiftView.date; this.setState({ isOpenCopyDialog: true }) }}
                                />
                            );
                        })
                    }
                </div>
                <DialogAddScheduleShift
                    isOpen={this.state.isOpenDialogAddShift}
                    title={RS.getString("ADD_SHIFT")}
                    handleAddShifts={this.handleAddShifts}
                    handleClose={() => { this.setState({ isOpenDialogAddShift: false }); }}
                    shiftTemplates={this.props.shiftTemplates}
                    jobRoles={this.props.jobRoles}
                    weekday={this.state.weekday}
                    curEmp={this.props.curEmp}
                    isValidatePastShift={true}
                />
                <DialogAssignEmployee
                    isOpen={this.state.isOpenDialogAssignEmployee}
                    handleClose={this.handleCloseDialogAssignEmployee}
                    handleSave={this.handleSaveAssignEmployee}
                    handlePublish={this.handlePublishAssignEmployee}
                    handleNext={this.handleNextFromAssignToOvertimeRequest}
                    groups={this.props.managedGroups}
                    employees={this.state.employeesToAssign}
                    block={this.state.block}
                    updateBlock={this.updateBlock}
                    scheduleGroup={_.get(this.props, 'schedule.group') || {}}
                    loadManagedGroups={this.props.loadManagedGroups}
                    searchAssignmentAvailability={this.searchAssignmentAvailability}
                />
                <DialogCreateOvertime
                    isOpen={this.state.isOpenDialogCreateOvertime}
                    employees={this.state.overtimeEmployees}
                    handleClose={this.handleBackFromOvertimeRequest}
                    handleSend={this.handleSendOvertimeRequest}
                    schedule={this.props.schedule}
                    timeOt={timeOt}
                    overtimeRate={this.state.overtimeRate}
                />
                <DialogConfirm
                    style={{ 'widthBody': '400px' }}
                    title={RS.getString('DELETE')}
                    isOpen={this.state.isOpenDialogDeleteShift}
                    handleSubmit={this.deleteScheduleShift}
                    handleClose={() => this.setState({ isOpenDialogDeleteShift: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'SHIFT')} </span>
                </DialogConfirm>
                <DialogEditLocationShift
                    isOpen={this.state.isOpenEditShift}
                    title={RS.getString("EDIT_SHIFT", null, Option.UPPER)}
                    className="dialog-add-location-shift edit-schedule-shift"
                    shift={this.shiftSelected}
                    handleSubmit={this.handleEditScheduleShift}
                    handleClose={() => { this.setState({ isOpenEditShift: false }); }}
                    jobRoles={this.props.jobRoles}
                    curEmp={this.props.curEmp}
                />
                <DialogReplaceEmployee
                    isOpen={this.state.isOpenDialogReplaceEmployee}
                    title={RS.getString("REPLACE", null, Option.UPPER)}
                    jobRole={_.get(this.state, 'selectedAssignment.employee.jobRole')}
                    scheduleGroup={_.get(this.props, 'schedule.group', {})}
                    shift={this.state.selectedShift}
                    assignment={this.state.selectedAssignment}
                    replacement={this.state.selectedReplacement}
                    employeesToAssign={this.state.employeesToReplace}
                    searchReplacementAvailability={this.searchReplacementAvailability}
                    searchResourcePool={this.searchResourcePool}
                    handleOpenDialogAddEmployee={this.handleOpenDialogAddEmployee}
                    handleCancel={this.handleCloseDialogReplaceEmployee}
                    handleClose={this.handleCloseDialogReplaceEmployee}
                    handleNext={this.handleNextFromReplaceToOvertimeRequest}
                    handleReplaceEmployee={this.handleReplaceEmployee}
                />
                <DialogAddEmployee
                    isOpen={this.state.isOpenDialogAddEmployee}
                    title={RS.getString("EMPLOYEES", null, Option.UPPER)}
                    handleClose={this.handleCloseDialogAddEmployee}
                    handleAdd={this.handleAddEmployee}
                    groups={this.props.managedGroups}
                    employees={this.state.employeesToReplace}
                    searchReplacementAvailability={this.searchReplacementAvailability}
                    jobRole={_.get(this.state, 'selectedAssignment.employee.jobRole')}
                    scheduleGroup={_.get(this.props, 'schedule.group', {})}
                    loadManagedGroups={this.props.loadManagedGroups}
                />
                <DialogCopyDayToDays
                    isOpen={this.state.isOpenCopyDialog}
                    title={RS.getString("COPY_SCHEDULE", null, 'UPPER')}
                    handleClose={() => this.setState({ isOpenCopyDialog: false })}
                    from={dateRange.from.getTime() < new Date().getTime() ? new Date() : dateRange.from}
                    to={dateRange.to}
                    daySelected={this.daySelected}
                    unCopyableDays={unCopyableDays}
                    handleSubmitCopy={this.handleSubmitCopy}
                    isShowSpecificDate
                />
            </div>
        );
    }
}
ScheduleShiftView.propTypes = propTypes;
export default ScheduleShiftView;