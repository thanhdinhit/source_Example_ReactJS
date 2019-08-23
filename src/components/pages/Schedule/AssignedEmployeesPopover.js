import React, { PropTypes, Component } from 'react';

import RS, { Option } from '../../../resources/resourceManager';
import { SCHEDULE_STATUS } from '../../../core/common/constants';
import RaisedButton from '../../elements/RaisedButton';
import AssignedEmployeeDetail from './AssignedEmployeeDetail';

var AssignedEmployeesPopover = React.createClass({
    render: function () {
        const { shift, isInPast } = this.props;
        let canNotify = _.find(shift.data.assignments, (item) => item.status == SCHEDULE_STATUS.TO_BE_NOTIFY);
        return (
            <div className="assigned-employees-popover">
                <div className={`assigned-employee-list ${!isInPast ? 'notInPast' : ''} ${!shift.data.assignments.length ? 'no-employees' : ''}`}>
                    {
                        !shift.data.assignments.length && <span>{RS.getString('NO_EMPLOYEE_ASSIGNED')}</span>
                    }
                    {
                        _.map(shift.data.assignments, (assignment) => {
                            return (
                                <AssignedEmployeeDetail
                                    isInPast={isInPast}
                                    key={assignment.id}
                                    assignment={assignment}
                                    handleNotifyAssignment = {this.props.handleNotifyAssignment}
                                    handleOnClickRemove={this.props.handleOnClickRemove}
                                    handleOpenDialogReplaceEmployee={this.props.handleOpenDialogReplaceEmployee.bind(this,assignment)}
                                />
                            );
                        })
                    }
                </div>
                {
                    !this.props.isInPast &&
                    <div className="actions pull-right">
                        <RaisedButton
                            className="raised-button-third-secondary"
                            label={RS.getString('DELETE_SHIFT', null, Option.CAPEACHWORD)}
                            onClick={() => { this.props.deleteScheduleShift(this.props.shift) }}
                        />
                        <RaisedButton
                            className="raised-button-first-secondary edit-shift"
                            label={RS.getString('EDIT_SHIFT1', null, Option.CAPEACHWORD)}
                            onClick={this.props.handleOpenEditShift}
                        />
                        <RaisedButton
                            label={RS.getString('NOTIFY', null, Option.CAPEACHWORD)}
                            disabled={!canNotify}
                            onClick={() => { this.props.notifyShift(this.props.shift.data.id)}}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default AssignedEmployeesPopover;