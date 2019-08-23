import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';

import RS from '../../../resources/resourceManager';
import dateHelper from '../../../utils/dateHelper';
import { DATETIME, TIMEFORMAT } from '../../../core/common/constants';
import { EMPLOYEE_GROUP_NUMBER } from '../../../core/common/config';

import CellScheduleShiftPopover from './CellScheduleShiftPopover';
import CustomPopover from '../../elements/CustomPopover';
import AssignedEmployeeDetailView from './AssignedEmployeeDetailView';

class CellScheduleShift extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
        this.handleOpenDialogReplaceEmployee = this.handleOpenDialogReplaceEmployee.bind(this)
        this.openPopover = this.openPopover.bind(this)
        this.closePopover = this.closePopover.bind(this)
    }
    handleOpenDialogReplaceEmployee(assignment) {
        this.props.handleOpenDialogReplaceEmployee(assignment, this.props.shift, this);
        this.cellScheduleShift.hide();
    }
    openPopover() {
        this.setState({ isOpenPopoverShiftDetail: true })
    }
    closePopover() {
        this.setState({ isOpenPopoverShiftDetail: false })
    }
    render() {
        const { shift, day, jobRoles } = this.props;

        let shiftDate = _.get(this.props, 'day');
        let shiftTime = _.get(this.props, 'shift.data.startTime');
        if (shiftDate && shiftTime) {
            shiftDate.setHours(shiftTime.getHours());
            shiftDate.setMinutes(shiftTime.getMinutes());
        }
        let isInPast = shiftDate.getTime() < new Date().getTime();

        const avatarDefault = require("../../../images/avatarDefault.png");
        let startTimeString = dateHelper.formatTimeWithPattern(shift.data.startTime, TIMEFORMAT.WITHOUT_SECONDS);
        let endTimeString = dateHelper.formatTimeWithPattern(shift.data.endTime, TIMEFORMAT.WITHOUT_SECONDS);
        let displayEmployees = _.take(shift.data.assignments, EMPLOYEE_GROUP_NUMBER);
        let numHiddenEmployees = _.size(shift.data.assignments) - _.size(displayEmployees);
        return (
            <div className="schedule-shift">
                <div
                    className={'schedule-shift-item' + (shift.status ? ` status-${shift.status}` : '') + (isInPast ? ' view-mode' : '')}
                    ref="target"
                    onClick={this.openPopover}
                >
                    <CustomPopover
                        isOpen={this.state.isOpenPopoverShiftDetail}
                        onHide={this.closePopover}
                        container={this}
                        ref={(popover) => this.cellScheduleShift = popover}
                    >
                        <CellScheduleShiftPopover
                            isInPast={isInPast}
                            shift={shift}
                            deleteScheduleShift={this.props.deleteScheduleShift}
                            jobRoles={jobRoles}
                            handleOpenDialogEditScheduleShift={this.props.handleOpenDialogEditScheduleShift.bind(this, shift)}
                            handleNotifyAssignment={(assignment)=> this.props.handleNotifyAssignment(shift, assignment) }
                            notifyShift={this.props.notifyShift}
                            removeAssignment={this.props.removeAssignment}
                            calculatePopover={() => this.cellScheduleShift.calcPosition(this)}
                            handleOpenDialogReplaceEmployee={this.handleOpenDialogReplaceEmployee}
                        />
                    </CustomPopover>
                    <div className="shift-time">{`${startTimeString} - ${endTimeString}`}</div>
                    {
                        _.map(displayEmployees, (assignment) => {
                            return (
                                <AssignedEmployeeDetailView
                                    key={assignment.id}
                                    assignment={assignment}
                                />
                            )
                        })
                    }
                    {
                        numHiddenEmployees > 0 &&
                        <div className="more-assigned">{RS.getString("MORE_ASSIGNED", numHiddenEmployees)}</div>
                    }
                    {
                        _.map(shift.jobTobeRemoves, (info, index) => {
                            return (
                                <div className="need-remove" key={index}>{`${info.number} ${info.jobRole.name} ${RS.getString("NEED_TO_REMOVE")}`}</div>
                            )

                        })
                    }
                    {
                        !isInPast &&
                        _.map(shift.jobMissing, (missing) => {
                            let handler = isInPast ? () => { } : () => { this.props.handleOpenDialogAssignEmployee(missing, shift) };
                            return (
                                <div className={'btn-add-employee' + (isInPast ? ' disabled' : '')} key={missing.jobRole.id} onClick={handler}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                    <span>{` ${missing.number} ${missing.jobRole.name}`}</span>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    isInPast && <div className ="shift--in-past" onClick={this.openPopover} />
                }
            </div>
        );
    }
}

export default CellScheduleShift;