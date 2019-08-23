import React, { PropTypes } from "react";
import * as toastr from '../../../../utils/toastr';
import { browserHistory } from 'react-router';
import debounceHelper from "../../../../utils/debounceHelper";
import ItemsDisplayPerPage from "../../../elements/ItemsDisplayPerPage";
import {
  MyHeader,
  MyTableHeader,
  MyRowHeader
} from "../../../elements/table/MyTable";
import Pagination from '../../../elements/Paginate/Pagination';
import _ from "lodash";
import {
  TIMESPAN,
  WAITING_TIME,
  WAITING_TIME_LOAD_STATE,
  STATUS,
  getTimesheetStatusOptions,
  EXPIRED_TIME_TIMESHEET_DATA,
  QUERY_STRING,
  TIMESHEET_PERIOD_TYPE,
  TIMESHEET_TYPE,
  RESPONSE_STATUS
} from "../../../../core/common/constants";
import RS, { Option } from "../../../../resources/resourceManager";
import { getUrlPath } from "../../../../core/utils/RoutesUtils";
import { URL } from "../../../../core/common/app.routes";
import RIGHTS from "../../../../constants/rights";
import dateHelper from '../../../../utils/dateHelper'
import * as apiHelper from '../../../../utils/apiHelper'
import RaisedButton from "../../../elements/RaisedButton";
import FilterSearch from "../../../elements/Filter/FilterSearch";
import ShowHideColumn from "../../../elements/table/ShowHideColumn";
import TimeSliderWidget from "../../../elements/TimeSliderWidget";
import CommonSelect from '../../../elements/CommonSelect.component';
import ResponsiveStatistic from '../../../elements/ResponsiveStatistic';
import PopoverIcon from './../../../elements/PopoverIcon/PopoverIcon';
import DialogViewEmployeeTimesheetDetail from './DialogViewEmployeeTimesheetDetail';
import DialogAlert from '../../../elements/DialogAlert';
import * as arrayHelper from '../../../../utils/arrayHelper';
import * as timesheetActions from '../../../../actionsv2/timesheetActions'
import * as groupActions from '../../../../actionsv2/groupActions'
import { hideAppLoadingIndicator, showAppLoadingIndicator } from "../../../../utils/loadingIndicatorActions";
import DialogSubmitTimesheets from './DialogSubmitTimesheets'

const propTypes = {
  globalAction: PropTypes.object,
  payload: PropTypes.object,
  countErrorTimesheet: PropTypes.number,
  params: PropTypes.object,
  timesheetSetting: PropTypes.object,
  groupTimesheets: PropTypes.array,
  groupStatusTimesheets: PropTypes.array
};
class EmployeeTimesheets extends React.Component {
  constructor(props) {
    super(props);
    let dateRange = { ...dateHelper.getDateRange(new Date(), TIMESPAN.WEEK), option: TIMESPAN.WEEK };
    const filter = this.getFilterFromUrl();
    const groupId = parseInt(this.props.params.groupId);
    filter.group = [groupId];
    filter.clockIn = filter.clockIn || dateRange;
    filter.clockIn.option = filter.clockInOption || '';

    this.state = {
      isOpenConfirmationApproveOne: false,
      isOpenConfirmationApproveAllEntry: false,
      isOpenConfirmationApproveAll: false,
      isOpenAlertTimesheetCantApprove: false,
      isOpenSubmit: false,
      pendingNumbers: 0,
      columns: this.getInitialColumns(),
      filter,
      hoursStatWidth: 0,
      selectedEmployeeId: 0,
      isOpenTimesheetDetail: false,
      employeeTimesheets: [],
      groupTimesheets: [],
      groups: [],
      timesheetEmployees: {},
      groupStatistic: {},
      minDate: dateHelper.getStartOfWeek(new Date())
    };

    this.queryString = {
      order_by: "id",
      is_desc: true,
      page_size: QUERY_STRING.PAGE_SIZE,
      page: 0
    };
    this.queryString = this.convertFilterToQueryString(this.queryString, filter);
    this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);

    this.expandCollapseDelayTime = 350;
    this.expandCollapseLastClick = new Date().getTime();

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleExpandCollapseClick = this.handleExpandCollapseClick.bind(this);
    this.renderSubTabTable = this.renderSubTabTable.bind(this);
    this.getInitialColumns = this.getInitialColumns.bind(this);
    this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.handleConfirmApproveAllEntry = this.handleConfirmApproveAllEntry.bind(this);
    this.handleApproveAllEntry = this.handleApproveAllEntry.bind(this);
    this.renderValueComponent = this.renderValueComponent.bind(this);
    this.handleSubmitTimesheet = this.handleSubmitTimesheet.bind(this);
    this.handleConfirmApproveOne = this.handleConfirmApproveOne.bind(this);
    this.handleApproveAll = this.handleApproveAll.bind(this);
    this.handleConfirmApproveAll = this.handleConfirmApproveAll.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.handleCallbackAction = this.handleCallbackAction.bind(this);
    this.handleExpandCollapseClick = this.handleExpandCollapseClick.bind(this);
    this.handleCallbackLoadTimesheetsOfEmployee = this.handleCallbackLoadTimesheetsOfEmployee.bind(this);
    this.handleCallbackGetGroupTimesheetStatistic = this.handleCallbackGetGroupTimesheetStatistic.bind(this);
    this.handleCallbackLoadGroupTimesheetSummary = this.handleCallbackLoadGroupTimesheetSummary.bind(this);
    this.handleCallbackApproveAll = this.handleCallbackApproveAll.bind(this);
    this.handleCallbackApproveOne = this.handleCallbackApproveOne.bind(this);
  }

  componentDidMount() {
    showAppLoadingIndicator();
    timesheetActions.loadTimesheetTypes((err, timesheetTypes) => this.handleCallbackAction(err, timesheetTypes, "timesheetTypes"))
    groupActions.loadAllGroup({}, (err, groups) => this.handleCallbackAction(err, groups, "groups"))
    timesheetActions.loadTimesheetSetting((err, timesheetSetting) => this.handleCallbackAction(err, timesheetSetting, "timesheetSetting"))

    let params = this.queryString;
    params.groupIds = parseInt(this.props.params.groupId);
    timesheetActions.loadGroupTimesheets(params, (err, groupTimesheets) => this.handleCallbackAction(err, groupTimesheets, "groupTimesheets"));

    timesheetActions.getGroupTimesheetStatistic(this.handleCallbackGetGroupTimesheetStatistic)
    timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
    this.handleSearchCallback = debounceHelper.debounce(function (events) {
      this.queryString.page = 0;
      timesheetActions.loadGroupTimesheets(params, (err, groupTimesheets) => this.handleCallbackAction(err, groupTimesheets, "groupTimesheets"));
      timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
    }, WAITING_TIME);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpenConfirmationApproveOne && nextProps.countErrorTimesheet) {
      this.setState({
        isOpenAlertTimesheetCantApprove: true,
        isOpenConfirmationApproveOne: false
      });
    }
    if (this.state.isOpenConfirmationApproveAllEntry && nextProps.countErrorTimesheet) {
      this.setState({
        isOpenAlertTimesheetCantApprove: true
      });
    }
    if (this.state.isOpenConfirmationApproveAll && nextProps.countErrorTimesheet) {
      this.setState({
        isOpenAlertTimesheetCantApprove: true,
        isOpenConfirmationApproveAll: false
      });
    }
  }

  loadEmployeeTimesheets = () => {
    timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
    if (this.state.selectedEmployeeId) {
      this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
      timesheetActions.loadTimesheetOfEmployee(this.state.selectedEmployeeId, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
    }
  }

  handleCallbackAction(err, result, field) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"))
    }
    else {
      this.setState({
        [field]: result
      })
    }
  }

  handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"))
    }
    else {
      this.state.timesheetEmployees[timesheetsOfEmployee.employeeId] = {
        value: timesheetsOfEmployee.timesheets,
        updatedTime: new Date().getTime()
      };
      this.setState(this.state)
    }
  }

  handleCallbackGetGroupTimesheetStatistic(err, groupTimesheetStatistic) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"))
    }
    else {
      let groupStatistic = _.find(groupTimesheetStatistic, x => x.id == this.state.filter.group[0])
      if (groupStatistic) {
        this.setState({ groupStatistic, minDate: groupStatistic.lastSubmission })
      }
    }
  }

  handleCallbackLoadGroupTimesheetSummary(err, groupTimesheets) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"))
    }
    else {
      this.setState({
        isOpenConfirmationApproveAll: true,
        countAllPending: _.get(_.first(groupTimesheets), 'countPendings')
      });
    }
  }

  handleCallbackApproveOne(err, result) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"));
      this.setState({
        isOpenConfirmationApproveOne: false
      });
    }
    else {
      this.handleSearchCallback();
      if (this.state.selectedEmployeeId) {
        timesheetActions.loadTimesheetOfEmployee(this.state.selectedEmployeeId, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => {this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee)});
      }
      switch (result.status) {
        case RESPONSE_STATUS.SUCCESS:
          toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
          this.setState({
            isOpenConfirmationApproveOne: false
          });
          break;
        case RESPONSE_STATUS.ERROR:
          this.setState({
            isOpenAlertTimesheetCantApprove: true,
            isOpenConfirmationApproveOne: false,
            countErrorTimesheet: result.count
          });
      }
    }
  }

  handleCallbackApproveAll(err, result) {
    hideAppLoadingIndicator()
    if (err) {
      toastr.error(err.message, RS.getString("ERROR"));
      this.setState({
        isOpenConfirmationApproveAll: false,
        isOpenConfirmationApproveAllEntry: false
      });
    }
    else {
      this.handleSearchCallback();
      if (this.state.selectedEmployeeId) {
        this.state.employeeTimesheets.forEach(statusMap => {
          if(statusMap.employee.id)
            timesheetActions.loadTimesheetOfEmployee(statusMap.employee.id, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
        });
      }
      switch (result.status) {
        case RESPONSE_STATUS.SUCCESS:
          toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
          this.setState({
            isOpenConfirmationApproveAll: false,
            isOpenConfirmationApproveAllEntry: false
          });
          break;
        case RESPONSE_STATUS.ERROR:
          this.setState({
            isOpenAlertTimesheetCantApprove: true,
            isOpenConfirmationApproveAll: false,
            isOpenConfirmationApproveAllEntry: false,
            countErrorTimesheet: result.count
          });
      }
    }
  }

  getFilterFromUrl() {
    let { query } = this.props.location;
    let filter = {
      name: query.name,
      status: apiHelper.convertQueryStringToList(query.status, false),
      clockIn: { ...dateHelper.convertDateTimeStringToDate(query.clockIn), option: _.get(query, 'clockIn.option', null) },
      clockInOption: query.clockInOption
    };

    return arrayHelper.formatFilterFromUrl(filter)
  }

  convertQuerytoQueryGetTimesheet(query) {
    let result = _.cloneDeep(query);
    //delete result['page_size'];
    result.order_by = 'createdDate';
    return result;
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
  }

  handleApplyFilter() {
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
    this.handleFilterParamsChange();
    timesheetActions.loadEmployeeTimesheets(this.state.filter.group[0], this.queryString, (err, employeeTimesheets) => this.handleCallbackAction(err, employeeTimesheets, "employeeTimesheets"));
    if (this.state.selectedEmployeeId) {
      this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
      timesheetActions.loadTimesheetOfEmployee(this.state.selectedEmployeeId, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
    }
  }

  convertFilterToQueryString(queryString, filter) {
    let query = _.assign({}, queryString);
    query.page = 0;
    //query.groupIds = apiHelper.getQueryStringListParams(filter.group);
    query.status = apiHelper.getQueryStringListParams(filter.status);
    query.clockIn = dateHelper.convertDateTimeToQueryString(filter.clockIn.from, filter.clockIn.to);
    query.clockInOption = filter.clockIn.option;
    if(filter.name != null)
     query.name = filter.name.trim();
    return query;
  }

  handleFilterChange(field, data, callback) {
    callback = callback || (() => { });
    if(data != null && data != '')
    this.setState({
      filter: {
        ...this.state.filter,
        [field]: data
      }
    }, callback);
  }

  handleFilterParamsChange() {
    let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
    }).join('&');
    browserHistory.replace(getUrlPath(URL.GROUP_TIMESHEETS_DETAIL, { groupId: this.state.filter.group[0] }) + '?' + paramsString);
  }

  handleExpandCollapseClick(employeeId) {
    let now = new Date().getTime();
    if (this.expandCollapseLastClick + this.expandCollapseDelayTime > now) {
      return;
    }
    this.expandCollapseLastClick = now;
    if (this.state.selectedEmployeeId == employeeId) {
      this.setState({ selectedEmployeeId: 0 });
      $('#timesheets-details-' + employeeId).collapse('hide');
    } else {
      if (!this.state.timesheetEmployees[employeeId] ||
        (this.state.timesheetEmployees[employeeId].updatedTime + EXPIRED_TIME_TIMESHEET_DATA < new Date().getTime())) {
        this.queryStringLoadTimesheet.clockIn = this.queryString.clockIn;
        timesheetActions.loadTimesheetOfEmployee(employeeId, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
      }
      $('.timesheets-details').removeClass('in');
      this.setState({ selectedEmployeeId: employeeId });
      $('#timesheets-details-' + employeeId).collapse('show');
    }
  }

  getInitialColumns() {
    return [{
      name: 'location',
      label: RS.getString('LOCATION'),
      show: false
    },
    {
      name: 'clockedInLocation',
      label: RS.getString('CLOCKED_IN_LOCATION'),
      show: false
    },
    {
      name: 'clockedOutLocation',
      label: RS.getString('CLOCKED_OUT_LOCATION'),
      show: false
    },
    {
      name: 'clockedHours',
      label: RS.getString('CLOCKED_HOURS'),
      show: false
    }, {
      name: 'scheduleName',
      label: RS.getString('SCHEDULE_NAME'),
      show: false
    }];
  }

  handleShowHideColumns(columns) {
    this.setState({ columns });
  }

  handleEditTimesheet(timesheet) {
    this.setState({
      isOpenTimesheetDetail: true
    });
    this.timesheetIdSelected = timesheet.id;
  }

  handleApproveTimesheet(timesheet) {
    this.setState({
      isOpenConfirmationApproveOne: true
    });
    this.timesheetIdSelected = timesheet.id;
  }

  handleApproveAll() {
    let countPending = 0;
    this.state.employeeTimesheets.forEach(statusMap => {
      if(statusMap.employee.id || !this.state.timesheetEmployees[statusMap.employee.id] ||
        (this.state.timesheetEmployees[statusMap.employee.id].updatedTime + EXPIRED_TIME_TIMESHEET_DATA < new Date().getTime()))
      {
        this.queryStringLoadTimesheet.clockIn = this.queryString.clockIn;
        timesheetActions.loadTimesheetOfEmployee(statusMap.employee.id, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
      }
      $('.timesheets-details').removeClass('in');
    }, WAITING_TIME_LOAD_STATE);
    this.state.employeeTimesheets.forEach(statusMap => { if(statusMap.statusMap.Pending) countPending += statusMap.statusMap.Pending});
    countPending && this.setState({ isOpenConfirmationApproveAll: true, countAllPending : countPending});
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
    this.handleFilterParamsChange();
    timesheetActions.loadTimesheetOfEmployee(this.state.selectedEmployeeId, this.queryStringLoadTimesheet, (err, timesheetsOfEmployee) => this.handleCallbackLoadTimesheetsOfEmployee(err, timesheetsOfEmployee));
  }

  handleConfirmApproveOne() {
    timesheetActions.approveTimesheet(this.timesheetIdSelected, this.handleCallbackApproveOne);
  }

  handleConfirmApproveAll() {
  let timesheetIds = [];
  let queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
  _.each(this.state.timesheetEmployees, (timesheetEmployees) => {
    _.each(timesheetEmployees.value, (week) => {
      _.each(week.items, (date) => {
        _.each(date.items, (item) => {
          if (item.timesheetStatus == STATUS.PENDING && item.group.id ==  queryStringLoadTimesheet.groupIds ) {
            timesheetIds.push(item.id);
          }
        });
      });
    });
  });
    let params = {
      groupId: this.props.params.groupId,
      timesheetIds: timesheetIds,
      ...this.timeSlider.props
    };
    timesheetActions.approveAllTimesheets(params, this.handleCallbackApproveAll);
  }

  renderActions(timesheet) {
    return (
      <span>
        <i
          className={
            "icon-approve" + (timesheet.timesheetStatus === STATUS.APPROVED ? ' invisible' : '')
          }
          data-toggle="tooltip"
          title={RS.getString('P124')}
          onClick={this.handleApproveTimesheet.bind(this, timesheet)}
        />
        <i
          className="fa fa-pencil"
          aria-hidden="true"
          data-toggle="tooltip"
          title={RS.getString('P126')}
          onClick={this.handleEditTimesheet.bind(this, timesheet)}
        />
      </span>
    );
  }

  renderSubTabTable(timesheetByWeeks, columns) {
    const rows = [];

    _.forEach(timesheetByWeeks, (timesheetsByWeek, indexWeek) => {
      _.forEach(timesheetsByWeek.items, (timesheetByDate) => {
        rows.push(_.map(timesheetByDate.items, (timesheet, index) => {
          let status = '';
          switch (timesheet.timesheetStatus) {
            case STATUS.PENDING:
              status = RS.getString('STATUS_PENDING');
              break;
            case STATUS.APPROVED:
              status = RS.getString('STATUS_APPROVED');
              break;
          }
          return (
            <tr
              data-id={timesheetByDate.date}
              key={timesheet.id}
              className={timesheetByDate.date + (index ? ' not-first' : ' first-merge-row')}
            >
              {
                !index &&
                <td
                  className="merge-row timesheet"
                  rowSpan={timesheetByDate.items.length}
                >
                  {timesheet.dayOfWeek}
                </td>
              }
              <td className={!!timesheet.minutesOfLateArrival ? 'wrong' : ''}>
                {
                  timesheet.timesheetType.name == TIMESHEET_TYPE.LEAVE ? '' :
                    timesheet.clockIn ||
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
              <td className={!!timesheet.minutesOfLeftEarly ? 'wrong' : ''}>
                {
                  timesheet.timesheetType.name == TIMESHEET_TYPE.LEAVE ? '' :
                    timesheet.clockOut ||
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

              {
                columns['location'].show &&
                <td >
                  {_.get(timesheet, 'location.name')}
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
                columns['clockedHours'].show &&
                <td >
                  {(_.get(timesheet, 'clockedHours', 0)).toFixed(1)}
                </td>
              }

              <td >
                {(_.get(timesheet, 'approvedHours', 0)).toFixed(1)}
              </td>

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

              {
                columns['scheduleName'].show &&
                <td >
                  {_.get(timesheet, 'scheduleName')}
                </td>
              }

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

              <td className="col-action">
                {this.renderActions(timesheet)}
              </td>
            </tr>
          );
        }));
      });
    });

    return rows;
  }

  handleDateRangeChange(from, to, option) {
    this.handleFilterChange('clockIn', { from, to, option }, this.handleApplyFilter);
  }

  handleApproveAllEntry(pendingNumbers) {
    pendingNumbers && this.setState({ isOpenConfirmationApproveAllEntry: true, pendingNumbers });
  }

  handleConfirmApproveAllEntry() {
    let timesheetIds = [];
    _.each(this.state.timesheetEmployees[this.state.selectedEmployeeId].value, (week) => {
      _.each(week.items, (day) => {
        _.each(day.items, (item) => {
          if (item.timesheetStatus == STATUS.PENDING) {
            timesheetIds.push(item.id);
          }
        });
      });
    });
    let params = {
      groupId: this.props.params.groupId,
      timesheetIds: timesheetIds,
      ...this.timeSlider.props
    };
    timesheetActions.approveAllTimesheets(params, this.handleCallbackApproveAll);
  }

  renderValueComponent(option) {
    return (
      <div className="Select-value">
        <span className="Select-value-label" role="option" aria-selected="true" >
          <span className="select-value-label-normal"> {RS.getString('GROUP')}: </span>
          {option.value.label}
        </span>
      </div>
    );
  }

  handleSubmitTimesheet(timesheets) {
    showAppLoadingIndicator()
    timesheetActions.submitTeamTimesheet(timesheets, (err) => {
      hideAppLoadingIndicator();
      if (err) {
        toastr.error(err.message, RS.getString("ERROR"))
      }
      else {
        toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
        this.setState({ isOpen: false })
      }
    })
  }

  render() {

    const canSubmit = !this.state.groupStatistic.timesheetDisabled && this.state.groupStatistic.checked && !this.state.groupStatistic.notAllowSubmit

    let columns = _.keyBy(this.state.columns, 'name');

    let actionConfirmApproveOne = [
      <RaisedButton
        key={0}
        label={RS.getString("CANCEL")}
        onClick={() => { this.setState({ isOpenConfirmationApproveOne: false }); }}
        className="raised-button-fourth"
      />,
      <RaisedButton
        key={1}
        label={RS.getString("CONFIRM")}
        onClick={this.handleConfirmApproveOne}
      />
    ];

    let actionConfirmApproveEntry = [
      <RaisedButton
        key={0}
        label={RS.getString("CANCEL")}
        onClick={() => { this.setState({ isOpenConfirmationApproveAllEntry: false }); }}
        className="raised-button-fourth"
      />,
      <RaisedButton
        key={1}
        label={RS.getString("CONFIRM")}
        onClick={this.handleConfirmApproveAllEntry}
      />
    ];

    let actionConfirmApproveAll = [
      <RaisedButton
        key={0}
        label={RS.getString("CANCEL")}
        onClick={() => { this.setState({ isOpenConfirmationApproveAll: false }); }}
        className="raised-button-fourth"
      />,
      <RaisedButton
        key={1}
        label={RS.getString("CONFIRM")}
        onClick={this.handleConfirmApproveAll}
        disabled={!this.state.countAllPending}
      />
    ];

    let statusOptions = getTimesheetStatusOptions();

    let durations = [{ type: TIMESPAN.MANUAL }];
    let period = _.get(this.state, 'timesheetSetting.periodType');
    switch (period) {
      // Add a comment to this line
      case TIMESHEET_PERIOD_TYPE.MONTH:
        durations = [{ type: TIMESPAN.FROM_LAST_SUBMISSION }, { type: TIMESPAN.WEEK }, { type: TIMESPAN.FORTNIGHT }, { type: TIMESPAN.MONTH }, { type: TIMESPAN.MANUAL }];
        break;
      case TIMESHEET_PERIOD_TYPE.FORTNIGHT:
        durations = [{ type: TIMESPAN.FROM_LAST_SUBMISSION }, { type: TIMESPAN.WEEK }, { type: TIMESPAN.FORTNIGHT }, { type: TIMESPAN.MANUAL }];
        break;
      case TIMESHEET_PERIOD_TYPE.WEEK:
        durations = [{ type: TIMESPAN.FROM_LAST_SUBMISSION }, { type: TIMESPAN.WEEK }, { type: TIMESPAN.MANUAL }];
        break;
    }
    return (
      <div className="page-container page-employee-timesheets">
        <div className="header">{RS.getString("EMPLOYEE_TIMESHEETS")}</div>
        <div className="row row-body">
          <div className="employee-timesheets">
            <div className="row-header">
              {this.state.groupTimesheets && this.state.groupTimesheets.length ?
                <RaisedButton
                  className="back-button raised-button-first-secondary"
                  label={RS.getString('BACK', null, Option.CAPEACHWORD)}
                  icon={<i className="icon-back-arrow" aria-hidden="true" />}
                  onClick={() => { return browserHistory.push(getUrlPath(URL.GROUP_TIMESHEETS)); }}
                /> : ''
              }
              <div className="pull-right">
                <RaisedButton
                  className="raised-button-first-secondary"
                  label={RS.getString('VIEW_HISTORY', null, Option.CAPEACHWORD)}
                  onClick={() => browserHistory.push(getUrlPath(URL.TIMESHEETS_HISTORY, { groupIds: apiHelper.getQueryStringListParams(this.state.filter.group) }))}
                />
                {this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_MEMBER_TIMESHEET) ?
                  (
                    <RaisedButton
                      disabled={!canSubmit}
                      className="btn-submit-timesheet"
                      label={RS.getString(
                        "SUBMIT",
                        null,
                        Option.CAPEACHWORD
                      )}
                      onClick={() => {
                        showAppLoadingIndicator();
                        timesheetActions.getGroupTimesheetStatistic(this.handleCallbackGetGroupTimesheetStatistic);
                        this.setState({ isOpenSubmit: true });
                      }}
                    />
                  ) : null}
                {this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_MEMBER_TIMESHEET) ?
                  (
                    <RaisedButton
                      label={RS.getString("APPROVE_ALL", null, Option.CAPEACHWORD)}
                      onClick={this.handleApproveAll.bind(this)}
                    />
                  ) : null}
              </div>
            </div>
            <div className="row-header">
              <div className="filter-status">
                <CommonSelect
                  multi={true}
                  options={statusOptions}
                  allowOptionAll={true}
                  optionAllText={RS.getString("ALL")}
                  titleValue="Status: "
                  titlePlaceHolder="Status: "
                  value={this.state.filter.status}
                  onChange={value => this.handleFilterChange('status', _.map(value, "value"), this.handleApplyFilter)}
                />
              </div>
              <div className="filter-group">
                <CommonSelect
                  clearable={false}
                  propertyItem={{ label: "name", value: "id" }}
                  options={this.state.groups}
                  titlePlaceHolder="Group: "
                  valueComponent={this.renderValueComponent}
                  value={this.state.filter.group[0]}
                  onChange={value => {
                    let params = this.queryString;
                    const groupIds = value ? [value.id] : [];
                    params.groupIds = groupIds;
                    this.props.timesheetsActions.loadGroupTimesheets(params);
                    this.handleFilterChange('group', groupIds, this.handleApplyFilter);
                  }
                  }
                />
              </div>
              <div className="time-slider">
                <TimeSliderWidget.Dropdown
                  ref={(input) => this.timeSlider = input}
                  timeDurations={durations}
                  defaultDate={this.state.minDate}
                  startDate={_.get(this.state.filter, 'clockIn.from')}
                  endDate={_.get(this.state.filter, 'clockIn.to')}
                  selectedDuration={_.get(this.state.filter, 'clockIn.option') || TIMESPAN.WEEK}
                  handleChange={this.handleDateRangeChange}
                />
              </div>
              <div className="pull-right">
                <FilterSearch
                  ref={filterSearch => (this.filterSearch = filterSearch)}
                  handleSearchChange={(value) => { this.handleFilterChange('name', value, this.handleApplyFilter); }}
                  defaultValue={this.state.filter.name}
                />
                <ShowHideColumn
                  columns={this.state.columns}
                  onChange={this.handleShowHideColumns}
                />
              </div>
            </div>
            <div className="employee-timsheets-listing">
              {
                _.map(this.state.employeeTimesheets, (timesheet, index) => {
                  let timesheetTypeMap = _.map(this.state.timesheetTypes, (item) => {
                    return {
                      name: item.name,
                      value: timesheet.timesheetTypeMap[item.name] || 0
                    };
                  });
                  return (
                    <div key={index}>
                      <div
                        className={'list-item ' + (this.state.selectedEmployeeId == timesheet.employee.id ? 'selected' : '')}
                        onClick={this.handleExpandCollapseClick.bind(this, timesheet.employee.id)}
                      >
                        <div className="item-content">
                          <div className="toggle-details">
                            <i
                              className={this.state.selectedEmployeeId == timesheet.employee.id ? "icon-dropdown-arrow" : "icon-next-arrow"}
                            />
                          </div>
                          <div className="cell-avatar">
                            <img src={_.get(timesheet, 'employee.photoUrl') ?
                              (API_FILE + _.get(timesheet, 'employee.photoUrl')) : require("../../../../images/avatarDefault.png")}
                            />
                            <div className="cell-content">
                              <div className="main-label">{_.get(timesheet, 'employee.fullName')}</div>
                              <div className="sub-label">{_.get(timesheet, 'employee.jobRole.name')}</div>
                            </div>
                          </div>
                          <div className="group-status-stat">
                            <div className="cell-status-stat">
                              <span>{timesheet.statusMap.Pending || 0}</span>
                              <div className={"status Pending"}>{RS.getString('STATUS_PENDING')}</div>
                            </div>
                            {/* <div className="cell-status-stat">
                              <span>{timesheet.statusMap.Declined || 0}</span>
                              <div className={"status Declined"}>{RS.getString('STATUS_DECLINED')}</div>
                            </div> */}
                            <div className="cell-status-stat">
                              <span>{timesheet.statusMap.Approved || 0}</span>
                              <div className={"status Approved"}>{RS.getString('STATUS_APPROVED')}</div>
                            </div>
                            {/* <div className="cell-status-stat">
                              <span>{timesheet.statusMap.Submitted || 0}</span>
                              <div className={"status Submitted"}>{RS.getString('STATUS_SUBMITTED')}</div>
                            </div> */}
                          </div>
                          <ResponsiveStatistic items={timesheetTypeMap} />
                        </div>
                      </div>
                      <div id={'timesheets-details-' + timesheet.employee.id} className="timesheets-details collapse">
                        <div className="pull-right">
                          <RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('APPROVE_ALL', null, Option.CAPEACHWORD)}
                            disabled={!timesheet.statusMap.Pending}
                            onClick={this.handleApproveAllEntry.bind(this, timesheet.statusMap.Pending)}
                          />
                        </div>
                        <div>
                          <table className="metro-table subtab">
                            <MyHeader sort={this.handleSortClick}>
                              <MyRowHeader>
                                <MyTableHeader>
                                  {RS.getString('DATE')}
                                </MyTableHeader>
                                <MyTableHeader>
                                  {RS.getString('CLOCKED_IN')}
                                </MyTableHeader>
                                <MyTableHeader>
                                  {RS.getString("CLOCKED_OUT")}
                                </MyTableHeader>
                                <MyTableHeader
                                  show={columns['location'].show}
                                >
                                  {RS.getString("LOCATION")}
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
                                  show={columns['clockedHours'].show}
                                >
                                  {RS.getString("CLOCKED_HOURS")}
                                </MyTableHeader>
                                <MyTableHeader>
                                  {RS.getString("APPROVED_HOURS")}
                                </MyTableHeader>
                                <MyTableHeader >
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
                                >
                                  {RS.getString("STATUS")}
                                </MyTableHeader>
                                <MyTableHeader className="col-action">
                                  {RS.getString("ACTION")}
                                </MyTableHeader>
                              </MyRowHeader>
                            </MyHeader>
                            <tbody>
                              {
                                this.state.timesheetEmployees[timesheet.employee.id] &&
                                this.renderSubTabTable(this.state.timesheetEmployees[timesheet.employee.id].value, columns)
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              {
                this.props.meta != null && this.props.meta.count > 0 ?
                  <div className="listing-footer">
                    <div className="pull-left">
                      <ItemsDisplayPerPage
                        name="ItemsDisplayPerPage"
                        value={this.queryString.page_size}
                        totalRecord={this.props.meta.count}
                        onChange={this.handleChangeDisplayPerPage}
                      />
                    </div>
                    <div className="pull-right">
                      {
                        this.props.meta.count > this.queryString.page_size ?
                          <Pagination
                            firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                            lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                            prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                            nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                            activePage={this.queryString.page + 1}
                            itemsCountPerPage={this.queryString.page_size}
                            totalItemsCount={this.props.meta.count}
                            onChange={this.handlePageClick}
                          /> : null
                      }

                    </div>
                  </div>
                  : null
              }
            </div>
          </div>
        </div>
        <DialogViewEmployeeTimesheetDetail
          isOpen={this.state.isOpenTimesheetDetail}
          timesheetTypes={this.state.timesheetTypes}
          timesheetId={this.timesheetIdSelected}
          handleClose={() => this.setState({ isOpenTimesheetDetail: false })}
          timesheetsActions={this.props.timesheetsActions}
          loadEmployeeTimesheets={this.loadEmployeeTimesheets}
        />
        <DialogAlert
          modal={true}
          icon={require("../../../../images/info-icon.png")}
          isOpen={this.state.isOpenConfirmationApproveOne}
          title={RS.getString('CONFIRMATION')}
          actions={actionConfirmApproveOne}
          handleClose={() => this.setState({ isOpenConfirmationApproveOne: false })}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: `${RS.getString('P152')}`
            }}
          />
        </DialogAlert>
        <DialogAlert
          modal={true}
          icon={require("../../../../images/info-icon.png")}
          isOpen={this.state.isOpenConfirmationApproveAllEntry}
          title={RS.getString('CONFIRMATION')}
          actions={actionConfirmApproveEntry}
          handleClose={() => this.setState({ isOpenConfirmationApproveAllEntry: false })}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: `${RS.getString('THERE_ARE')}
                <strong>${this.state.pendingNumbers} ${RS.getString('PENDING', null, 'LOWER')}</strong> ${RS.getString('TIMESHEET_ENTRIES')}. ${RS.getString('P127')}`
            }}
          />
        </DialogAlert>
        <DialogAlert
          modal={true}
          icon={require("../../../../images/info-icon.png")}
          isOpen={this.state.isOpenConfirmationApproveAll}
          title={RS.getString('CONFIRMATION')}
          actions={actionConfirmApproveAll}
          handleClose={() => this.setState({ isOpenConfirmationApproveAll: false })}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: `${RS.getString('THERE_ARE')}
                <strong>${this.state.countAllPending} ${RS.getString('PENDING', null, 'LOWER')}</strong> ${RS.getString('TIMESHEET_ENTRIES')}. ${RS.getString('P127')}`
            }}
          />
        </DialogAlert>
        <DialogAlert
          modal={true}
          icon={require("../../../../images/warning.png")}
          isOpen={this.state.isOpenAlertTimesheetCantApprove}
          title={RS.getString('ALERT')}
          handleClose={() => this.setState({ isOpenAlertTimesheetCantApprove: false })}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: `${RS.getString('THERE_ARE')}
                <strong>${this.state.countErrorTimesheet} ${RS.getString('TIMESHEET_ENTRIES')}</strong> ${RS.getString('P128')}`
            }}
          />
        </DialogAlert>
        <DialogSubmitTimesheets
          isOpen={this.state.isOpenSubmit}
          title={RS.getString('SUBMIT_TIMESHEET', null, 'UPPER')}
          handleClose={() => { this.setState({ isOpenSubmit: false }); }}
          groups={[this.state.groupStatistic]}
          handleSubmitTimesheet={this.handleSubmitTimesheet}
        />
      </div >
    );
  }
}

EmployeeTimesheets.propTypes = propTypes;
export default EmployeeTimesheets;