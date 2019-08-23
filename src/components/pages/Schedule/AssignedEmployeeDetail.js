import React, { PropTypes } from 'react';
import _ from 'lodash';
import PopoverIcon from '../../elements/PopoverIcon/PopoverIcon';
import { findDOMNode } from 'react-dom';
import RS, { Option } from '../../../resources/resourceManager';
import { TIMEFORMAT, SCHEDULE_STATUS } from '../../../core/common/constants';
import dateHelper from '../../../utils/dateHelper';

var AssignedEmployeeDetail = React.createClass({
    getInitialState: function () {
        return {
            isOpen: false,
            isOpenPopover: false,
            popoverMessage: ''
        };
    },

    showPopover: function (message, event) {
        if (!message) {
            return;
        }
        this.popoverIcon.show();
        this.setState({ popoverMessage: message })

        let dom = findDOMNode(this.popoverIcon);
        let offset = $(event.target).offset();
        var scroll = $(window).scrollTop();
        $(dom).css({ top: offset.top - scroll - 20, left: offset.left + 0 });
    },

    hidePopover: function () {
        this.popoverIcon.hide();
    },


    renderActions(assignment) {
        if ((!assignment.isOvertime && !_.get(assignment, 'replacement.isOvertime') && !this.props.isInPast)
            && !(assignment.isFromOtherGroup && assignment.status == SCHEDULE_STATUS.TO_BE_NOTIFY)) {
            return (
                <div className="actions">
                    {
                        assignment.status == SCHEDULE_STATUS.TO_BE_NOTIFY &&
                        <i className="icon-notify" aria-hidden="true" onClick={this.props.handleNotifyAssignment.bind(this, this.props.assignment)} />
                    }
                    <i className="icon-swap-icon-1" aria-hidden="true" onClick={this.props.handleOpenDialogReplaceEmployee} />
                    {_.isEmpty(assignment.replacement) &&
                        <i className="fa fa-trash" aria-hidden="true" onClick={this.props.handleOnClickRemove.bind(this, assignment)} />
                    }
                </div>
            )
        }
        return null;
    },

    render() {
        const avatarDefault = require("../../../images/avatarDefault.png");
        const { assignment } = this.props;
        let isMainEmpOvertime = assignment.isOvertime;
        let isReplaceEmpOvertime = !!_.get(assignment, 'replacement.isOvertime');
        let mainEmp = _.get(assignment, 'employee');
        let replaceEmp = _.get(assignment, 'replacement.employee');
        let statusClassName = assignment.error ? 'error' : _.toLower(assignment.status);
        let replaceFrom, replaceTo;
        let errorMsg = assignment.error;
        if (replaceEmp) {
            replaceFrom = dateHelper.formatTimeWithPattern(new Date(assignment.replacement.replaceFrom), TIMEFORMAT.TIME_PICKER);
            replaceTo = dateHelper.formatTimeWithPattern(new Date(assignment.replacement.replaceTo), TIMEFORMAT.TIME_PICKER);
            if (assignment.error)
                errorMsg = `${errorMsg} (${replaceFrom} - ${replaceTo})`;
        }
        return !!replaceEmp ? (
            <div>
                <PopoverIcon
                    className="assigned-empl-msg-popover popover-error"
                    ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                    message={`${this.state.popoverMessage}`}
                    iconFont="blank"
                />
                <div className="assigned-employee-item replacement" key={assignment.id}>
                    <div className="replacement-container">
                        <div className="main-employee">
                            <div className={`status ${statusClassName}`} onMouseEnter={this.showPopover.bind(this, errorMsg)} onMouseLeave={this.hidePopover}>
                            </div>
                            <div className="avatar-container">
                                <img src={mainEmp.photoUrl ? (API_FILE + mainEmp.photoUrl) : avatarDefault} />
                            </div>
                            <div className="cell-content">
                                <div className={`main-label ${statusClassName}`}>{mainEmp.fullName}</div>
                                <div className="sub-label">{mainEmp.jobRole.name}</div>
                            </div>
                            {
                                isMainEmpOvertime &&
                                <div className="overtime-flag">{RS.getString('OT')}</div>
                            }
                        </div>
                        <div className="replacement-employee">
                            <div className={`status ${statusClassName}`} onMouseEnter={this.showPopover.bind(this, errorMsg)} onMouseLeave={this.hidePopover}>
                            </div>
                            <div className="avatar-container">
                                <img src={replaceEmp.photoUrl ? (API_FILE + replaceEmp.photoUrl) : avatarDefault} />
                            </div>
                            <div className="cell-content">
                                <div className={`main-label ${statusClassName}`}>{replaceEmp.fullName}</div>
                                <div className="sub-label">{replaceEmp.jobRole.name} | {`${replaceFrom} - ${replaceTo}`}</div>
                            </div>
                            {
                                isReplaceEmpOvertime &&
                                <div className="overtime-flag">{RS.getString('OT')}</div>
                            }
                        </div>
                    </div>
                    {
                        this.renderActions(assignment)
                    }
                </div>
            </div>
        ) : (
                <div>
                    <PopoverIcon
                        className="assigned-empl-msg-popover popover-error"
                        ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                        message={`${this.state.popoverMessage}`}
                        iconFont="blank"
                    />
                    <div className="assigned-employee-item">
                        <div className={`status ${statusClassName}`} onMouseEnter={this.showPopover.bind(this, errorMsg)} onMouseLeave={this.hidePopover} >
                        </div>
                        <div className="avatar-container">
                            <img src={mainEmp.photoUrl ? (API_FILE + mainEmp.photoUrl) : avatarDefault} />
                        </div>
                        <div className="cell-content">
                            <div className={`main-label ${statusClassName}`}>{mainEmp.fullName}</div>
                            <div className="sub-label">{mainEmp.jobRole.name}</div>
                        </div>
                        {
                            isMainEmpOvertime &&
                            <div className="overtime-flag">{RS.getString('OT')}</div>
                        }
                        {
                            this.renderActions(assignment)
                        }
                    </div>
                </div>
            );
    }
});

export default AssignedEmployeeDetail;