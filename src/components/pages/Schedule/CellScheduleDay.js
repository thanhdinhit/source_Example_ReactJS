import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';

import RS from '../../../resources/resourceManager';
import dateHelper from '../../../utils/dateHelper';
import { DATETIME, TIMEFORMAT } from '../../../core/common/constants';
import CellScheduleShift from './CellScheduleShift';
import DialogCopyDayToDays from './DialogCopyDayToDays';
import * as scheduelActions from '../../../actionsv2/scheduleActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';
import * as toastr from '../../../utils/toastr';

const propTypes = {
    dateRange: PropTypes.object,
    day: PropTypes.object
}
class CellScheduleDay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { day, shifts, jobRoles, dateRange, hasAssignment, viewMode } = this.props;
        return (
            <div style={{ visibility: this.props.invisible ? 'hidden' : 'visible' }} className={`schedule-day ${viewMode ? 'view-mode' : ''}`}>
                <div className="day-info">
                    <span>{dateHelper.formatTimeWithPattern(day, DATETIME.DAY_OF_MONTH)}</span><br />
                    <span className="day-of-week">{dateHelper.formatTimeWithPattern(day, TIMEFORMAT.DAY_OF_WEEK_LONG)}</span>
                    {
                        !!shifts.length && dateRange.to.getTime() > new Date().getTime() &&
                        <i className="icon-copy" aria-hidden="true" onClick={this.props.handleOpenCopyScheduleShiftDay} />
                    }
                </div>
                <div className="day-detail">
                    <div className="shifts-cell">
                        {
                            this.props.viewMode ?
                                null
                                :
                                <div className="btn-add-shift" onClick={this.props.handleOpenDialogAddShift}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                    <span> {RS.getString("SHIFT")}</span>
                                </div>
                        }
                        {
                            _.map(shifts, (shift) => {
                                return (
                                    <CellScheduleShift
                                        day={day}
                                        key={shift.data.id}
                                        shift={shift}
                                        jobRoles={jobRoles}
                                        handleOpenDialogReplaceEmployee={this.props.handleOpenDialogReplaceEmployee}
                                        deleteScheduleShift={this.props.deleteScheduleShift}
                                        handleOpenDialogAssignEmployee={this.props.handleOpenDialogAssignEmployee}
                                        handleOpenDialogEditScheduleShift={this.props.handleOpenDialogEditScheduleShift}
                                        handleNotifyAssignment={this.props.handleNotifyAssignment}
                                        notifyShift={this.props.notifyShift}
                                        removeAssignment={this.props.removeAssignment}
                                        viewMode={viewMode}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

CellScheduleDay.propTypes = propTypes;

export default CellScheduleDay;