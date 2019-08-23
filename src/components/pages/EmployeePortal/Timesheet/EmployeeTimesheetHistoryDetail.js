import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
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
  WAITING_TIME,
  STATUS,
  TIMEFORMAT,
  EXPIRED_TIME_TIMESHEET_DATA,
  QUERY_STRING,
  DATETIME,
  TIMESHEET_TYPE
} from "../../../../core/common/constants";
import RS, { Option } from "../../../../resources/resourceManager";
import { getUrlPath } from "../../../../core/utils/RoutesUtils";
import { URL } from "../../../../core/common/app.routes";
import dateHelper from '../../../../utils/dateHelper'
import RaisedButton from "../../../elements/RaisedButton";
import FilterSearch from "../../../elements/Filter/FilterSearch";
import ShowHideColumn from "../../../elements/table/ShowHideColumn";
import ResponsiveStatistic from '../../../elements/ResponsiveStatistic';
import PopoverIcon from './../../../elements/PopoverIcon/PopoverIcon';
import * as timesheetActions from '../../../../actionsv2/timesheetActions';
import * as groupActions from '../../../../actionsv2/groupActions';
import * as employeeActions from '../../../../actionsv2/employeeActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../../utils/loadingIndicatorActions';

const propTypes = {
  timesheetsOfEmployee: PropTypes.object,
  timesheetsActions: PropTypes.object,
  globalAction: PropTypes.object,
  payload: PropTypes.object,
  countErrorTimesheet: PropTypes.number,
  params: PropTypes.object,
  timesheetSetting: PropTypes.object,
  groupTimesheets: PropTypes.array,
  countAllPending: PropTypes.number
};
class EmployeeTimesheetHistoryDetail extends React.Component {
  constructor(props) {
    super(props);
    const filter = this.getFilterFromUrl();
    const groupId = parseInt(this.props.params.groupId);
    filter.groupId = groupId;

    this.state = {
      pendingNumbers: 0,
      columns: this.getInitialColumns(),
      filterEmployeeTimesheets: {
        prefilter: filter,
        filter: filter,
        checkIsOpenFilter: false
      },
      hoursStatWidth: 0,
      selectedEmployeeId: 0
    };

    this.queryString = {
      order_by: "id",
      is_desc: true,
      page_size: QUERY_STRING.PAGE_SIZE,
      page: 0
    };

    this.timesheetEmployees = {};
    this.queryString = this.convertFilterToQueryString(this.queryString, filter);
    this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);

    this.expandCollapseDelayTime = 350;
    this.expandCollapseLastClick = new Date().getTime();

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleExpandCollapseClick = this.handleExpandCollapseClick.bind(this);
    this.renderSubTabTable = this.renderSubTabTable.bind(this);
    this.getInitialColumns = this.getInitialColumns.bind(this);
    this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
    this.renderValueComponent = this.renderValueComponent.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.searchGroupTeamTimesheetHistories = this.searchGroupTeamTimesheetHistories.bind(this);
    this.searchEmployeeTimesheetHistories = this.searchEmployeeTimesheetHistories.bind(this);
    this.handleCallBackAction = this.handleCallBackAction.bind(this);
  }

  componentDidMount() {
    showAppLoadingIndicator();
    if (!this.queryString.submitDate) {
      browserHistory.replace(getUrlPath(URL.PAGE_NOT_FOUND));
      return;
    }
    let loadGroup = new Promise((resolve, reject) => {
      groupActions.loadGroup(this.queryString.groupId, (err, result) => {
        if (err || !result) {
          this.handleNotFoundCallBackAction(err || new Error());
          reject(err);
        } else {
          this.setState({ group: result }, resolve);
        }
      })
    });

    let loadEmployee = new Promise((resolve, reject) => {
      employeeActions.loadEmployee(this.queryString.submitterId, (err, result) => {
        if (err || !result) {
          this.handleNotFoundCallBackAction(err || new Error());
          reject(err);
        } else {
          this.setState({ employee: result }, resolve);
        }
      })
    });

    Promise.all([loadGroup, loadEmployee]).then(() => {
      let loadTimesheetType = new Promise((resolve, reject) => {
        timesheetActions.loadTimesheetTypes((err, results) => {
          if (err) {
            this.handleCallBackAction(err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      let loadGroupTeamTimesheetHistories = new Promise((resolve, reject) => {
        timesheetActions.searchGroupTeamTimesheetHistories(this.queryString, (err, results) => {
          if (err) {
            this.handleCallBackAction(err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      return Promise.all([loadTimesheetType, loadGroupTeamTimesheetHistories]).then((results) => {
        this.setState({
          timesheetTypes: results[0],
          groupTeamTimesheetHistories: results[1]
        }, hideAppLoadingIndicator);
      });
    }).catch(hideAppLoadingIndicator);

    this.handleSearchCallback = debounceHelper.debounce(function (events) {
      this.queryString.page = 0;
      this.searchGroupTeamTimesheetHistories();
    }, WAITING_TIME);
  }

  searchGroupTeamTimesheetHistories() {
    showAppLoadingIndicator();
    timesheetActions.searchGroupTeamTimesheetHistories(this.queryString, (err, results) => {
      if (err) {
        this.handleCallBackAction(err);
      } else {
        this.setState({ groupTeamTimesheetHistories: results }, hideAppLoadingIndicator);
      }
    });
  }

  searchEmployeeTimesheetHistories() {
    showAppLoadingIndicator();
    this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
    let query = {
      ...this.queryStringLoadTimesheet,
      employeeId: this.state.selectedEmployeeId
    };
    timesheetActions.searchEmployeeTimesheetHistories(query, (err, result) => {
      if (err) {
        this.handleCallBackAction(err);
      } else {
        this.timesheetEmployees[result.employeeId] = {
          value: result.timesheets,
          updatedTime: new Date().getTime()
        };
        this.forceUpdate();
        hideAppLoadingIndicator();
      }
    });
  }

  handleCallBackAction(err) {
    hideAppLoadingIndicator();
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'))
    }
  }

  handleNotFoundCallBackAction(err) {
    hideAppLoadingIndicator();
    if (err) {
      browserHistory.replace(getUrlPath(URL.PAGE_NOT_FOUND));
    }
  }

  getFilterFromUrl() {
    let { query } = this.props.location;
    let filter = {
      name: query.name,
      submitterId: parseInt(query.submitterId),
      submitDate: dateHelper.convertStringToSingleDateTime(query.submitDate)
    };
    return filter;
  }

  convertQuerytoQueryGetTimesheet(query) {
    let result = _.cloneDeep(query);
    delete result['page_size'];
    result.order_by = 'createdDate';
    return result;
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    this.searchGroupTeamTimesheetHistories();
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    this.searchGroupTeamTimesheetHistories();
  }

  handleApplyFilter() {
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterEmployeeTimesheets.filter);
    this.handleFilterParamsChange();
    this.searchGroupTeamTimesheetHistories();
    if (this.state.selectedEmployeeId) {
      this.searchEmployeeTimesheetHistories();
    }
  }


  convertFilterToQueryString(queryString, filter) {
    let query = _.assign({}, queryString);
    query.page = 0;
    query.groupId = filter.groupId;
    query.submitterId = filter.submitterId;
    query.submitDate = filter.submitDate ? filter.submitDate.toISOString().replace(/\.[0-9]{3}/, '') : null;
    query.name = filter.name;

    return query;
  }

  handleFilterChange(field, data, callback) {
    callback = callback || (() => { });
    this.setState({
      filterEmployeeTimesheets: {
        ...this.state.filterEmployeeTimesheets,
        filter: {
          ...this.state.filterEmployeeTimesheets.filter,
          [field]: data
        }
      }
    }, callback);
  }

  handleFilterParamsChange() {
    let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
    }).join('&');
    browserHistory.replace(getUrlPath(URL.GROUP_TIMESHEET_HISTORY_DETAIL, { groupId: this.state.filterEmployeeTimesheets.filter.groupId }) + '?' + paramsString);
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
      $('.timesheets-details').removeClass('in');
      this.setState({ selectedEmployeeId: employeeId }, () => {
        if (!this.timesheetEmployees[employeeId] || (this.timesheetEmployees[employeeId].updatedTime + EXPIRED_TIME_TIMESHEET_DATA < new Date().getTime())) {
          this.searchEmployeeTimesheetHistories();
        }
      });
      $('#timesheets-details-' + employeeId).collapse('show');
    }
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
      name: 'inBoundary',
      label: RS.getString('IN_BOUNDARY'),
      show: false
    }, {
      name: 'clockedHours',
      label: RS.getString('CLOCKED_HOURS'),
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
    }];
  }

  handleShowHideColumns(columns) {
    this.setState({ columns });
  }

  handleSortClick(index, columnNameInput, directionInput) {
    let columnName = '';
    switch (columnNameInput) {
      case 'clockIn':
        columnName = 'clockIn';
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
    this.searchEmployeeTimesheetHistories();
  }

  renderSubTabTable(timesheetByWeeks, columns) {
    const rows = [];
    _.forEach(timesheetByWeeks, (timesheetsByWeek, indexWeek) => {
      _.forEach(timesheetsByWeek.items, (timesheetByDate) => {
        rows.push(_.map(timesheetByDate.items, (timesheet, index) => {
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
              {
                columns['clockedIn'].show &&
                <td className={!!timesheet.lateClockInMinutes ? 'wrong' : ''}>
                  {
                    timesheet.timesheetType.name == TIMESHEET_TYPE.LEAVE ? '' :
                      timesheet.clockedIn ?
                        <div>
                          <span>{dateHelper.formatTimeWithPattern(timesheet.clockedIn, DATETIME.MONTH_AND_DATE) + ', '}</span>
                          <span>{dateHelper.formatTimeWithPattern(timesheet.clockedIn, TIMEFORMAT.CLOCKED_IN_OUT)}</span>
                        </div>
                       :
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
                      timesheet.clockedOut ?
                        <div>
                          <span>{dateHelper.formatTimeWithPattern(timesheet.clockedOut, DATETIME.MONTH_AND_DATE) + ', '}</span>
                          <span>{dateHelper.formatTimeWithPattern(timesheet.clockedOut, TIMEFORMAT.CLOCKED_IN_OUT)}</span>
                        </div> :
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
                columns['inBoundary'].show &&
                <td className={timesheet.inBoundary ? 'correct' : 'wrong'}>
                  <strong>{timesheet.inBoundary ? RS.getString('YES') : RS.getString('NO')}</strong>
                </td>
              }
              {
                columns['clockedHours'].show &&
                <td >
                  {(_.get(timesheet, 'clockedHours', 0)).toFixed(1)}
                </td>
              }
              {
                columns['approvedHours'].show &&
                <td >
                  {(_.get(timesheet, 'approvedHours', 0)).toFixed(1)}
                </td>
              }
              {
                columns['type'].show &&
                <td className={timesheet.timesheetType == TIMESHEET_TYPE.UNKNOWN ? 'wrong' : ''}>
                  {_.get(timesheet, 'timesheetType')}
                  {
                    timesheet.isChangeFromUnknown &&
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
                <td>
                  {timesheet.comment && timesheet.status === STATUS.APPROVED &&
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
            </tr>
          );
        }));
      });
    });

    return rows;
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

  getTime(date) {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
    }
    return 0;
  }

  render() {
    let columns = _.keyBy(this.state.columns, 'name');
    return (
      <div className="page-container page-employee-timesheets">
        <div className="header">{RS.getString("EMPLOYEE_TIMESHEET_HISTORY")}</div>
        <div className="row row-body">
          <div className="employee-timesheets">
            <div className="row-header">
              <RaisedButton
                className="back-button raised-button-first-secondary"
                label={RS.getString('BACK', null, Option.CAPEACHWORD)}
                icon={<i className="icon-back-arrow" aria-hidden="true" />}
                onClick={() => { return browserHistory.push(getUrlPath(URL.GROUP_TIMESHEET_HISTORIES)); }}
              />
              <div className="text-view">
                  <span className="title">{RS.getString("GROUP")}: </span>
                  <span className="value">{_.get(this.state, 'group.name')}</span>
                  <span className="divider">|</span>
                  <span className="title">{RS.getString("SUBMITTED_BY")} </span>
                  <span className="value">{_.get(this.state, 'employee.contactDetail.fullName')}</span>
                  <span className="title"> {RS.getString("ON", null, Option.LOWER)} </span>
                  <span className="value">{dateHelper.formatTimeWithPattern(this.state.filterEmployeeTimesheets.filter.submitDate, DATETIME.DATE_TIMESHEET)}</span>
              </div>
              <div className="pull-right">
                <FilterSearch
                  ref={filterSearch => (this.filterSearch = filterSearch)}
                  handleSearchChange={(value) => { this.handleFilterChange('name', value, this.handleApplyFilter); }}
                  defaultValue={this.state.filterEmployeeTimesheets.filter.name}
                />
                <ShowHideColumn
                  columns={this.state.columns}
                  onChange={this.handleShowHideColumns}
                />
                <RaisedButton
                  className="raised-button-first-secondary"
                  label={RS.getString('EXPORT', null, Option.CAPEACHWORD)}
                  onClick={() => { }}
                />
              </div>
            </div>
            <div className="employee-timsheets-listing">
              {
                _.map(this.state.groupTeamTimesheetHistories, (timesheet, index) => {
                  let timesheetTypeMap = _.map(this.state.timesheetTypes, (item) => {
                    return {
                      name: item.name,
                      value: timesheet['number' + item.name] || 0
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
                          <ResponsiveStatistic items={timesheetTypeMap} />
                        </div>
                      </div>
                      <div id={'timesheets-details-' + timesheet.employee.id} className="timesheets-details collapse">
                        <div>
                          <table className="metro-table subtab">
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
                                  show={columns['inBoundary'].show}
                                >
                                  {RS.getString("IN_BOUNDARY")}
                                </MyTableHeader>
                                <MyTableHeader
                                  show={columns['clockedHours'].show}
                                >
                                  {RS.getString("WORKING_HOURS")}
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
                                <MyTableHeader></MyTableHeader>
                              </MyRowHeader>
                            </MyHeader>
                            <tbody>
                              {
                                this.timesheetEmployees[timesheet.employee.id] &&
                                this.renderSubTabTable(this.timesheetEmployees[timesheet.employee.id].value, columns)
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
      </div >
    );
  }
}

EmployeeTimesheetHistoryDetail.propTypes = propTypes;
export default EmployeeTimesheetHistoryDetail;