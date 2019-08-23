import React, { PropTypes } from 'react';
import RaisedButton from '../../elements/RadioButton';
import AssignedEmployeesPopover from './AssignedEmployeesPopover';
import RemoveAssignedEmployeePopover from './RemoveAssignedEmployeePopover';

const propTypes = {
    shift: PropTypes.object,
    jobRoles: PropTypes.array,
    isInPast: PropTypes.bool,
    handleOpenEditShift: PropTypes.func
}

const steps = {
    ASSIGNED_EMPLOYEES: 1,
    REMOVE_EMPLOYEE: 2,
    REPLACE_EMPLOYEE: 3,
    EDIT_SHIFT: 4
}

class CellScheduleShiftPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: steps.ASSIGNED_EMPLOYEES
        }
    }

    handleOnClickRemove = (assignment) => {
        this.setState({ step: steps.REMOVE_EMPLOYEE }, ()=> this.props.calculatePopover());
        this.assignmentSelected = assignment;
    }

    renderStep = () => {
        const { shift, isInPast } = this.props;
        switch (this.state.step) {
            case steps.ASSIGNED_EMPLOYEES: {
                return (
                    <AssignedEmployeesPopover
                        isInPast={isInPast}
                        shift={shift}
                        deleteScheduleShift={this.props.deleteScheduleShift}
                        handleOpenEditShift={this.props.handleOpenDialogEditScheduleShift}
                        handleOnClickRemove={this.handleOnClickRemove}
                        handleNotifyAssignment = {this.props.handleNotifyAssignment}
                        notifyShift = {this.props.notifyShift}
                        handleOpenDialogReplaceEmployee={this.props.handleOpenDialogReplaceEmployee}
                    />
                )
            }
            case steps.REMOVE_EMPLOYEE: {
                return (
                    <RemoveAssignedEmployeePopover
                        assignment={this.assignmentSelected}
                        handleGoBack={() => this.setState({ step: steps.ASSIGNED_EMPLOYEES })}
                        removeAssignment={this.props.removeAssignment.bind(this, shift.data.id)}
                        canGoBack
                        handleOnHide={() => this.setState({ step: steps.ASSIGNED_EMPLOYEES })}
                    />
                )
            }
            default: return null;
        }
    }

    render() {
        const { shift, isInPast } = this.props;
        return (
            <div className={`cell-schedule-shift-popover ${isInPast ? 'in-past' : ''} `}>
                {
                    this.renderStep()
                }
            </div>
        )
    }
}

CellScheduleShiftPopover.propTypes = propTypes;
export default CellScheduleShiftPopover;