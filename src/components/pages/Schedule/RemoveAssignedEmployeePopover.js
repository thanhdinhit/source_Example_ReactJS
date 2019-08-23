import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';

import RS, { Option } from '../../../resources/resourceManager';
import { SCHEDULE_STATUS } from '../../../core/common/constants';
import RaisedButton from '../../elements/RaisedButton';
import RadioButton from '../../elements/RadioButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';

const REMOVE_OPTIONS = {
    SELECTED_SHIFT_ONLY: 1,
    IN_DATE_RANGE: 2,
    ALL: 3
};

const propTypes = {
    assignment: PropTypes.object
}

class RemoveAssignedEmployeePopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            removeOption: REMOVE_OPTIONS.SELECTED_SHIFT_ONLY,
            removeFrom: new Date(),
            removeTo: new Date()
        }
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOnChangeRemoveOption = this.handleOnChangeRemoveOption.bind(this);
    }

    handleOnChangeRemoveOption(option) {
        this.setState({
            removeOption: option
        });
    }

    handleRemove() {
        let { assignment } = this.props;
        let data = {};
        switch (this.state.removeOption) {
            case REMOVE_OPTIONS.SELECTED_SHIFT_ONLY:
                data = {
                    assignmentId: assignment.id
                };
                break;
            case REMOVE_OPTIONS.IN_DATE_RANGE:
                data = {
                    employeeId: assignment.employee.id,
                    from: this.state.removeFrom,
                    to: this.state.removeTo
                };
                break;
            case REMOVE_OPTIONS.ALL:
                data = {
                    employeeId: assignment.employee.id
                };

                break;
        }
        this.props.removeAssignment(data);
        this.props.handleOnHide();
    }

    render() {
        let { assignment } = this.props;
        const defaultAvatar = require("../../../images/avatarDefault.png");
        return (
            <div className="remove-employee-popover-content">
                <div className="popover-header">
                    {
                        this.props.canGoBack &&
                        <div className="go-back" onClick={this.props.handleGoBack}><i className="icon-back-arrow" />{RS.getString("BACK")}</div>
                    }
                    <div className="popover-title">{RS.getString("REMOVE_EMPLOYEE", null, Option.UPPER)}</div>
                </div>
                <div className="popover-body">
                    <div className="avatar-content">
                        <img src={assignment.employee.photoUrl ? (API_FILE + assignment.employee.photoUrl) : defaultAvatar} />
                        <div className="cell-content">
                            <div className="main-label">
                                {assignment.employee.fullName}
                            </div>
                            <div className="sub-label">
                                {assignment.employee.jobRole.name}
                            </div>
                        </div>
                    </div>
                    <div>
                        <RadioButton
                            title={RS.getString("REMOVE_THIS_SHIFT_ONLY")}
                            checked={this.state.removeOption == REMOVE_OPTIONS.SELECTED_SHIFT_ONLY}
                            onChange={this.handleOnChangeRemoveOption.bind(this, REMOVE_OPTIONS.SELECTED_SHIFT_ONLY)}
                        />
                    </div>
                    <div>
                        <RadioButton
                            title={RS.getString("REMOVE_FROM")}
                            checked={this.state.removeOption == REMOVE_OPTIONS.IN_DATE_RANGE}
                            onChange={this.handleOnChangeRemoveOption.bind(this, REMOVE_OPTIONS.IN_DATE_RANGE)}
                        />
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateA = input}
                            hintText="dd/mm/yyyy"
                            id="start-date"
                            defaultValue={this.state.removeFrom}
                            onChange={(value) => this.setState({ removeFrom: value })}
                            disabled={this.state.removeOption != REMOVE_OPTIONS.IN_DATE_RANGE}
                        />
                        <span>{RS.getString("TO")}</span>
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateB = input}
                            hintText="dd/mm/yyyy"
                            id="end-date"
                            defaultValue={this.state.removeTo}
                            startDate={this.state.removeFrom}
                            onChange={(value) => this.setState({ removeTo: value })}
                            disabled={this.state.removeOption != REMOVE_OPTIONS.IN_DATE_RANGE}
                        />
                    </div>
                    <div>
                        <RadioButton
                            title={RS.getString("REMOVE_ALL")}
                            checked={this.state.removeOption == REMOVE_OPTIONS.ALL}
                            onChange={this.handleOnChangeRemoveOption.bind(this, REMOVE_OPTIONS.ALL)}
                        />
                    </div>
                </div>
                <div className="popover-footer pull-right">
                    <RaisedButton
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL', null, Option.CAPEACHWORD)}
                        onClick={this.props.handleOnHide}
                    />
                    {
                        assignment.status == SCHEDULE_STATUS.TO_BE_NOTIFY &&
                        this.state.removeOption == REMOVE_OPTIONS.SELECTED_SHIFT_ONLY &&
                        < RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('SAVE', null, Option.CAPEACHWORD)}
                            onClick={this.handleRemove}
                        />
                    }
                    {
                        (assignment.status == SCHEDULE_STATUS.NOTIFIED ||
                            this.state.removeOption != REMOVE_OPTIONS.SELECTED_SHIFT_ONLY) &&
                        <RaisedButton
                            label={RS.getString('NOTIFY', null, Option.CAPEACHWORD)}
                            onClick={this.handleRemove}
                        />
                    }
                </div>
            </div>
        );
    }
};

export default RemoveAssignedEmployeePopover;