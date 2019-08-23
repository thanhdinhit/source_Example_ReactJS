import React, { PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import * as toastr from '../../../../utils/toastr';
import * as apiHelper from '../../../../utils/apiHelper';
import { FLOAT_POINT_ROUNDING } from '../../../../core/common/config';
import { STATUS, TIMEFORMAT, TIMESPAN, TIMESHEET_TYPE, getTimesheetStatusOptions } from '../../../../core/common/constants';
import CommonSelect from '../../../elements/CommonSelect.component';
import dateHelper from '../../../../utils/dateHelper';
import ShowHideColumn from '../../../elements/table/ShowHideColumn';
import MyTimeSliderWidget from '../../../elements/MyTimeSliderWidget';
import PopoverIcon from './../../../elements/PopoverIcon/PopoverIcon';
import * as timesheetActions from '../../../../actionsv2/timesheetActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../../utils/loadingIndicatorActions';
import * as arrayHelper from '../../../../utils/arrayHelper'

const redirect = getUrlPath(URL.MY_TIMESHEETS);

const propTypes = {
    myTimesheets: PropTypes.array,
    timesheetActions: PropTypes.object,
    globalAction: PropTypes.object,
    payload: PropTypes.object
};
class MyTimeSheet extends React.Component {
    constructor(props) {
        super(props);
        
        const filter = this.getFilterFromUrl();
        filter.clockIn = filter.clockIn;
        filter.clockIn.option = filter.clockInOption || '';

        this.state = {
            columns: this.getInitialColumns(),
            isOpen: false,
            duration: TIMESPAN.WEEK,
            filterMyTimesheets: {
                filter: filter
            }
        };
        this.queryString = {
            order_by: "createdDate",
            is_desc: true,
            page: 0
        };

        this.queryString = this.convertFilterToQueryString(this.queryString, filter);

        this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
    }

    componentDidMount() {
        showAppLoadingIndicator();
        timesheetActions.searchMyTimesheets(this.queryString, (err, results) => {
            this.setState({ myTimesheets: results }, hideAppLoadingIndicator);
        });
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;
        query.status = apiHelper.getQueryStringListParams(filter.status);
        query.clockIn = dateHelper.convertDateTimeToQueryString(filter.clockIn.from, filter.clockIn.to);
        //query.clockInOption = filter.clockIn.option;
        query.name = filter.name;

        return query;
    }

    getFilterFromUrl() {
        let { query } = this.props.location;
        let dateRange = { ...dateHelper.getDateRange(new Date(), TIMESPAN.WEEK), option: TIMESPAN.WEEK };
        let filter = {
            name: query.name,
            status: apiHelper.convertQueryStringToList(query.status, false),
            clockIn: {
                from: query.from ? new Date(query.from) : new Date(dateRange.from),
                to: query.to ? new Date(query.to) : new Date(dateRange.to),
                option: _.get(query, 'clockInOption', null)
            },
            clockInOption: query.clockInOption ? query.clockInOption : dateRange.option
        };

        return arrayHelper.formatFilterFromUrl(filter)
    }

    handleSortClick(index, columnNameInput, directionInput) {
        let columnName = '';
        switch (columnNameInput) {
            case 'status':
                columnName = 'status';
                break;
            default:
                return null;
        }
        if (columnName === '')
            return null;
        this.queryString.order_by = columnName;
        this.queryString.is_desc = directionInput != 1;
        this.queryString.page = 0;
        this.handleApplyFilter();
    }

    handleApplyFilter() {
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterMyTimesheets.filter);
        this.handleFilterParamsChange();
        showAppLoadingIndicator();
        timesheetActions.searchMyTimesheets(this.queryString, (err, results) => {
            this.setState({ myTimesheets: results }, hideAppLoadingIndicator);
        });
    }

    handleFilterParamsChange() {
        let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
        }).join('&');
        browserHistory.replace(getUrlPath(URL.MY_TIMESHEETS) + '?' + paramsString);
    }

    handleFilterChange(field, data, callback) {
        callback = callback || (() => { });
        this.setState({
            filterMyTimesheets: {
                ...this.state.filterMyTimesheets,
                filter: {
                    ...this.state.filterMyTimesheets.filter,
                    [field]: data
                }
            }
        }, callback);
    }

    handleDateRangeChange(start, end, option) {
        this.setState({
            start: start,
            end: end,
            duration: option
        });

        this.queryString.from = dateHelper.localToUTC(start);
        this.queryString.to = dateHelper.localToUTC(to);
        showAppLoadingIndicator();
        timesheetActions.searchMyTimesheets(this.queryString, (err, results) => {
            this.setState({ myTimesheets: results }, hideAppLoadingIndicator);
        });
    }

    getInitialColumns() {
        return [{
            name: 'clockedIn',
            label: RS.getString('CLOCKED_IN'),
            show: true
        }, {
            name: 'clockedOut',
            label: RS.getString('CLOCKED_OUT'),
            show: true
        }, {
            name: 'clockedInLocation',
            label: RS.getString('CLOCKED_IN_LOCATION'),
            show: false
        }, {
            name: 'clockedOutLocation',
            label: RS.getString('CLOCKED_OUT_LOCATION'),
            show: false
        }, {
            name: 'location',
            label: RS.getString('LOCATION'),
            show: false
        }, {
            name: 'inBoundary',
            label: RS.getString('IN_BOUNDARY'),
            show: false
        }, {
            name: 'approvedHours',
            label: RS.getString('APPROVED_HOURS'),
            show: true
        }, {
            name: 'type',
            label: RS.getString('TYPE'),
            show: true
        }, {
            name: 'scheduleName',
            label: RS.getString('SCHEDULE_NAME'),
            show: false
        }, {
            name: 'status',
            label: RS.getString('STATUS'),
            show: true
        }, {
            name: 'clockedHours',
            label: RS.getString('CLOCKED_HOURS'),
            show: false
        }];
    }

    handleShowHideColumns(columns) {
        this.setState({ columns });
    }

    renderTable(timesheetByWeeks, columns) {
        const rows = [];
        _.forEach(timesheetByWeeks, (timesheetsByWeek, indexWeek) => {
            _.forEach(timesheetsByWeek.items, (timesheetByDate, index) => {
                rows.push(_.map(timesheetByDate.items, function (timesheet, index) {
                    let status = '';
                    switch (timesheet.timesheetStatus) {
                        case STATUS.PENDING:
                            status = RS.getString('STATUS_PENDING');
                            break;
                        case STATUS.DECLINED:
                            status = RS.getString('STATUS_DECLINED');
                            break;
                        case STATUS.APPROVED:
                            status = RS.getString('STATUS_APPROVED');
                            break;
                    }
                    return (
                        <tr data-id={timesheetByDate.date}
                            key={timesheet.id}
                            className={'disable-hover ' + timesheetByDate.date + (index ? ' not-first' : ' first-merge-row') + (indexWeek % 2 === 0 ? ' even-tr' : ' odd-tr')}>
                            {
                                !index &&
                                <td className="merge-row timesheet"
                                    rowSpan={timesheetByDate.items.length}>
                                    {timesheet.dayOfWeek}
                                </td>
                            }
                            {
                                columns['clockedIn'].show &&
                                <td className={!!timesheet.lateClockInMinutes ? 'wrong' : ''}>
                                    {
                                        timesheet.timesheetType.name == TIMESHEET_TYPE.LEAVE ? '' :
                                            timesheet.clockIn ? dateHelper.formatTimeWithPatternNoCheck(timesheet.clockIn, TIMEFORMAT.CLOCKED_IN_OUT) :
                                                <div className="has-popover">
                                                    <PopoverIcon
                                                        message={RS.getString('MISSING_CLOCKIN')}
                                                        show
                                                        iconFont
                                                        iconClassName="icon-warning"
                                                        className="popover-top-left popover-warning"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                    }
                                </td>
                            }
                            {
                                columns['clockedOut'].show &&
                                <td className={!!timesheet.earlyClockOutMinutes ? 'wrong' : ''}>
                                    {
                                        timesheet.timesheetType.name == TIMESHEET_TYPE.LEAVE ? '' :
                                            timesheet.clockOut ? (dateHelper.isEqualDateString(timesheet.clockOut, timesheet.clockIn) ?
                                                dateHelper.formatTimeWithPatternNoCheck(timesheet.clockOut, TIMEFORMAT.CLOCKED_IN_OUT) :
                                                dateHelper.formatTimeWithPatternNoCheck(timesheet.clockOut, TIMEFORMAT.CLOCKED_OUT_OVER)) :
                                                <div className="has-popover">
                                                    <PopoverIcon
                                                        message={RS.getString('MISSING_CLOCKOUT')}
                                                        show
                                                        iconFont
                                                        iconClassName="icon-warning"
                                                        className="popover-top-left popover-warning"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                    }
                                </td>
                            }
                            {
                                columns['clockedInLocation'].show &&
                                <td >
                                    {_.get(timesheet, 'clockedInLocation')}
                                </td>
                            }
                            {
                                columns['clockedOutLocation'].show &&
                                <td >
                                    {_.get(timesheet, 'clockedOutLocation')}
                                </td>
                            }
                            {
                                columns['location'].show &&
                                <td >
                                    {_.get(timesheet, 'location.name')}
                                </td>
                            }
                            {
                                columns['inBoundary'].show &&
                                <td className={timesheet.inBoundary ? 'correct' : 'wrong'}>
                                    <strong>{timesheet.inBoundary ? RS.getString('YES') : RS.getString('NO')}</strong>
                                </td>
                            }
                            {
                                columns['approvedHours'].show &&
                                <td >
                                    {(_.get(timesheet, 'approvedHours', 0)).toFixed(FLOAT_POINT_ROUNDING.WORKING_HOURS)}
                                </td>
                            }
                            {
                                columns['type'].show &&
                                <td className={timesheet.timesheetType.name == TIMESHEET_TYPE.UNKNOWN ? 'wrong' : ''}>
                                    {_.get(timesheet, 'timesheetType.name')}
                                    {
                                        timesheet.changeFromUnknown &&
                                        <div className="has-popover right-align">
                                            <PopoverIcon
                                                message={RS.getString('CHANGED_FROM_UNKNOWN_TYPE')}
                                                show
                                                iconFont
                                                iconClassName="icon-info"
                                                className="popover-top-left popover-normal"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    }
                                </td>
                            }
                            {
                                columns['scheduleName'].show &&
                                <td >
                                    {_.get(timesheet, 'scheduleName')}
                                </td>
                            }
                            {
                                columns['status'].show &&
                                <td>
                                    <div className={"status " + timesheet.timesheetStatus}>
                                        {status}
                                    </div>
                                    {timesheet.comment && timesheet.timesheetStatus === STATUS.APPROVED &&
                                        <div className="has-popover right-align">
                                            <PopoverIcon
                                                message={timesheet.comment}
                                                show
                                                iconPath="comment.png"
                                                iconClassName="img-popover-icon"
                                                className="popover-top-left popover-normal"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    }
                                </td>
                            }
                            {
                                columns['clockedHours'].show &&
                                <td >
                                    {(_.get(timesheet, 'clockedHours', 0)).toFixed(FLOAT_POINT_ROUNDING.WORKING_HOURS)}
                                </td>
                            }
                        </tr>
                    );
                }));
            });
        });
        return rows;
    }

    render() {
        let columns = _.keyBy(this.state.columns, 'name');
        let statusOptions = getTimesheetStatusOptions();

        return (
            <div className="page-container my-timesheet" >
                <div className="header">
                    {RS.getString('MY_TIMESHEET')}
                </div>
                <div className="row row-body" >
                    <div>
                        <div className="row-header">
                            <div className="filter-status">
                                <CommonSelect
                                    multi={true}
                                    options={statusOptions}
                                    allowOptionAll={true}
                                    optionAllText={RS.getString("ALL")}
                                    titleValue="Status: "
                                    titlePlaceHolder="Status: "
                                    value={this.state.filterMyTimesheets.filter.status}
                                    onChange={value => this.handleFilterChange('status', _.map(value, "value"), this.handleApplyFilter)}
                                />
                            </div>
                            <div className="time-slider">
                                <MyTimeSliderWidget.Dropdown
                                    startDate={_.get(this.state.filterMyTimesheets.filter, 'clockIn.from')}
                                    endDate={_.get(this.state.filterMyTimesheets.filter, 'clockIn.to')}
                                    selectedDuration={_.get(this.state.filterMyTimesheets.filter, 'clockIn.option') || TIMESPAN.WEEK}
                                    handleChange={(from, to, option) => {
                                        this.handleFilterChange('clockIn', { from, to, option }, this.handleApplyFilter)
                                    }}
                                />
                            </div>
                            <div className="pull-right">
                                <ShowHideColumn
                                    columns={this.state.columns}
                                    onChange={this.handleShowHideColumns}
                                />
                            </div>
                        </div>
                        <table className="metro-table">
                            <MyHeader sort={this.handleSortClick}>
                                <MyRowHeader>
                                    <MyTableHeader>
                                        {RS.getString('DATE')}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['clockedIn'].show}
                                    >
                                        {RS.getString('CLOCKED_IN')}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['clockedOut'].show}
                                    >
                                        {RS.getString("CLOCKED_OUT")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['clockedInLocation'].show}
                                    >
                                        {RS.getString("CLOCKED_IN_LOCATION")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['clockedOutLocation'].show}
                                    >
                                        {RS.getString("CLOCKED_OUT_LOCATION")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['location'].show}
                                    >
                                        {RS.getString("LOCATION")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['inBoundary'].show}
                                    >
                                        {RS.getString("IN_BOUNDARY")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['approvedHours'].show}
                                    >
                                        {RS.getString("APPROVED_HOURS")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['type'].show}
                                    >
                                        {RS.getString("TYPE")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['scheduleName'].show}
                                    >
                                        {RS.getString("SCHEDULE_NAME")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        enableSort
                                        name="status"
                                        show={columns['status'].show}
                                    >
                                        {RS.getString("STATUS")}
                                    </MyTableHeader>
                                    <MyTableHeader
                                        show={columns['clockedHours'].show}
                                    >
                                        {RS.getString("CLOCKED_HOURS")}
                                    </MyTableHeader>
                                </MyRowHeader>
                            </MyHeader>
                            <tbody>
                                {
                                    this.renderTable(this.state.myTimesheets, columns)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        );
    }
}

MyTimeSheet.propTypes = propTypes;
export default MyTimeSheet;