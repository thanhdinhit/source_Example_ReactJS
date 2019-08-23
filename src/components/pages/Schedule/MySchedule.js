import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import { WAITING_TIME, TIMESPAN, TIMEFORMAT, DATETIME, WEEKDAYS } from '../../../core/common/constants';
import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import _ from 'lodash';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import dateHelper from '../../../utils/dateHelper';
import * as apiHelper from '../../../utils/apiHelper';
import Breadcrumb from '../../elements/Breadcrumb';
import Moment from 'moment';
import TimeSlider from '../../elements/TimeSlider';
import * as toastr from '../../../utils/toastr';
import OverlayOverTimeRequestMySchedule from './OverlayOverTimeRequestMySchedule';
import { MY_SCHEDULE_STATUS, STATUS, OVERTIME_ACTION_TYPE } from '../../../core/common/constants';
import DialogOvertimeActions from '../EmployeePortal/Overtime/DialogOvertimeActions';

const redirect = getUrlPath(URL.SCHEDULES);
const propTypes = {}
class MySchedule extends React.Component {
    constructor(props) {
        super(props);
        let { query } = this.props.location;
        this.state = {
            filter: this.getFilterFromUrl(),
            isOpen: false
        }
        this.queryString = {};

        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
        this.handleFilterParamsChange = this.handleFilterParamsChange.bind(this);
        this.getQueryParams = this.getQueryParams.bind(this);
    }

    selectedOvertime = {}
    componentDidMount() {
        // let scheduleId = Number(this.props.params.scheduleId)
        // if (!scheduleId) {
        //     browserHistory.replace(`/page_not_found`)
        // }
        this.props.scheduleAction.loadMySchedule({
            from: this.state.filter.shiftDateFrom,
            to: this.state.filter.shiftDateTo
        })
        // this.props.loadAllContract({});
    }

    componentDidUpdate() {
        if (this.props.payload.success || this.props.payloadOvertime.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.globalAction.resetState();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
        if (this.props.payloadOvertime.error.message != '' || this.props.payloadOvertime.error.exception) {
            toastr.error(this.props.payloadOvertime.error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
    }

    getFilterFromUrl() {
        let { query } = this.props.location;
        let filter = {};
        filter = _.assign(filter, {
            shiftDateFrom: query.shiftDateFrom ? new Date(Moment(query.shiftDateFrom).startOf('isoWeek')) : new Date(Moment().startOf('isoWeek')),
        })
        filter.shiftDateTo = dateHelper.getDateRange(filter.shiftDateFrom, TIMESPAN.WEEK).to;
        return filter;
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString, filter);
        delete query.shiftDateTo
        query.shiftDateFrom = Moment.utc(query.shiftDateFrom).format();
        // query.shiftDateTo = Moment.utc(query.shiftDateTo).format();
        return query;
    }

    handleFilterParamsChange() {
        let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
        }).join('&');
        browserHistory.replace(getUrlPath(URL.MY_SCHEDULE) + '?' + paramsString);
    }

    changeShiftDate(shiftDateFrom, shiftDateTo) {
        this.setState({
            filter: {
                ...this.state.filter,
                shiftDateFrom,
                shiftDateTo
            }
        }, () => {
            this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter)
            this.handleFilterParamsChange()
            this.props.scheduleAction.loadMySchedule(
                {
                    from: this.state.filter.shiftDateFrom,
                    to: this.state.filter.shiftDateTo
                }
            )
        });
    }

    getQueryParams() {
        let filter = this.getFilterFromUrl();
        let queryString = this.queryString;

        queryString.from = this.state.filter.shiftDateFrom;
        queryString.to = this.state.filter.shiftDateTo

        return {
            queryEmployeeSchedules: queryString
        };
    }

    handleOnClickOvertime(shift, target, move) {
        if (_.isEmpty(shift.overtime) || shift.overtime.overtimeStatus !== STATUS.PENDING) {
            return;
        }

        const data = {
            requester: shift.overtime.manager.fullName,
            shift: shift.name,
            duration: dateHelper.formatTimeWithPatternNoCheck(shift.overtime.overtimeFrom, TIMEFORMAT.WITHOUT_SECONDS) +
                ' - ' + dateHelper.formatTimeWithPatternNoCheck(shift.overtime.overtimeTo, TIMEFORMAT.WITHOUT_SECONDS),
            comment: shift.overtime.comment,
        }

        this.selectedOvertime = _.cloneDeep(shift.overtime);
        this.OverlayOverTimeRequestMySchedule.handleShow(data, target, move);
    }

    handleDeclineOvertime() {
        this.setState({ isOpen: true });
    }

    handleAcceptOvertime() {
        this.selectedOvertime.overtimeStatus = STATUS.ACCEPTED;
        this.props.overtimeActions.updateOvertime(this.selectedOvertime.id, this.selectedOvertime);
    }

    handleSubmitDeclineOvertime(reason) {
        this.selectedOvertime.commentDeclinedOrCanceled = reason;
        this.selectedOvertime.overtimeStatus = STATUS.DECLINED;
        this.props.overtimeActions.updateOvertime(this.selectedOvertime.id, this.selectedOvertime);
        this.setState({ isOpen: false });
    }

    renderView() {
        let { mySchedule } = this.props;
        return (
            <div className="my-schedule">
                <div className="my-schedule-tb">
                    <div className="tb-row tb-header">
                        <div className="tb-cell"></div>
                        {
                            _.map(_.get(mySchedule, 'dates'), (date, index) => {
                                let weekday = dateHelper.formatTimeWithPattern(date, TIMEFORMAT.DAY_OF_WEEK_LONG);
                                let isEndOfWeek = weekday == WEEKDAYS.SAT || weekday == WEEKDAYS.SUN;
                                return (
                                    <div className={'tb-cell ' + (isEndOfWeek ? 'end-of-week' : '')} key={index}>
                                        <div>
                                            <div className="weekday">{dateHelper.formatTimeWithPattern(date, TIMEFORMAT.DAY_OF_WEEK)}</div>
                                            <div>{dateHelper.formatTimeWithPattern(date, DATETIME.DATE_SHIFT_VIEW)}</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {
                        _.map(_.get(mySchedule, 'data'), (item, index) => {
                            return (
                                <div className="tb-row" key={index}>
                                    <div className="tb-cell">
                                        <div className="location-name">{_.get(item, 'location.name')}</div>
                                    </div>
                                    {
                                        _.map(_.get(item, 'data'), (shifts, shiftsIndex) => {
                                            let weekday = dateHelper.formatTimeWithPattern(shifts.date, TIMEFORMAT.DAY_OF_WEEK_LONG);
                                            let isEndOfWeek = weekday == WEEKDAYS.SAT || weekday == WEEKDAYS.SUN;
                                            return (
                                                <div className={'tb-cell ' + (isEndOfWeek ? 'end-of-week' : '')} key={shiftsIndex}>
                                                    {
                                                        _.map(_.get(shifts, 'data'), (shift, shiftIndex) => {
                                                            let shiftFrom = _.get(shift, 'startTime');
                                                            let shiftTo = _.get(shift, 'endTime');
                                                            let leaveFrom = _.get(shift, 'leave.leaveFromInHour');
                                                            let leaveTo = _.get(shift, 'leave.leaveToInHour');
                                                            let isLeaveAllShift = leaveFrom == shiftFrom && leaveTo == shiftTo;
                                                            let className = `schedule-shift ${isLeaveAllShift ? 'leave-only' : ''}`;
                                                            let move = '';
                                                            let isLast = (shiftsIndex === _.cloneDeep(mySchedule.dates.length) - 1);
                                                            if (shiftIndex === 0 && !isLast) {
                                                                move = MY_SCHEDULE_STATUS.MOVE_BOTTOM;
                                                            } else if (isLast) {
                                                                move = MY_SCHEDULE_STATUS.MOVE_LEFT;
                                                            }

                                                            return (
                                                                <div className={className} style={{ backgroundColor: _.get(shift, 'color') }} key={shiftIndex}
                                                                    id={"block" + item.location.id + shiftsIndex + shiftIndex} //care
                                                                    onClick={this.handleOnClickOvertime.bind(this, shift, "block" + item.location.id + shiftsIndex + shiftIndex, move)}
                                                                >
                                                                    {
                                                                        !isLeaveAllShift &&
                                                                        <div className="shift-name">{_.get(shift, 'name')}</div>
                                                                    }
                                                                    {
                                                                        !isLeaveAllShift &&
                                                                        <div className="shift-time">{shiftFrom} - {shiftTo}</div>
                                                                    }
                                                                    {
                                                                        !!_.get(shift, 'leave') &&
                                                                        <div className="on-leave">
                                                                            <div className="shift-name">{RS.getString("ON_LEAVE")}</div>
                                                                            <div className="shift-time">{leaveFrom} - {leaveTo}</div>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        !!_.get(shift, 'overtime') &&
                                                                        <div className="schedule-overtime">
                                                                            <i className="fa fa-clock-o" aria-hidden="true" />
                                                                            {RS.getString("OVERTIME")}
                                                                        </div>
                                                                    }
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
                <OverlayOverTimeRequestMySchedule
                    ref={(OverlayOverTimeRequestMySchedule) => this.OverlayOverTimeRequestMySchedule = OverlayOverTimeRequestMySchedule}
                    handleDecline={this.handleDeclineOvertime.bind(this)}
                    handleAccept={this.handleAcceptOvertime.bind(this)}
                />
                <DialogOvertimeActions
                    isOpen={this.state.isOpen}
                    handleClose={() => this.setState({ isOpen: false })}
                    handleSubmit={this.handleSubmitDeclineOvertime.bind(this)}
                    actionType={OVERTIME_ACTION_TYPE.DECLINE}
                />
            </div>
        );
    }

    render() {
        let linkBreadcrumb = [{
            key: RS.getString("SCHEDULES"),
            value: getUrlPath(URL.SCHEDULES)
        }];
        return (
            <div className="page-container page-my-schedule">
                <div className="header">
                    {RS.getString('MY_SCHEDULE')}
                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <div className="row row-action">
                    <div className="col-md-6">
                        <TimeSlider
                            startDate={this.state.filter.shiftDateFrom}
                            endDate={this.state.filter.shiftDateTo}
                            onChange={(from, to) => this.changeShiftDate(from, to)}
                            timeSpan={TIMESPAN.WEEK}
                        />
                    </div>
                </div>
                {this.renderView()}
            </div>
        )
    }
}
MySchedule.propTypes = propTypes;
export default MySchedule;