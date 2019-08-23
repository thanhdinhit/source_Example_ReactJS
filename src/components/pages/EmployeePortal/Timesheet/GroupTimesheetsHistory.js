import React from "react";
import ReactDOM from "react-dom";
import { browserHistory } from 'react-router';
import * as toastr from '../../../../utils/toastr';
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
  EXPIRED_TIME_TIMESHEET_DATA,
  QUERY_STRING,
  DATETIME
} from "../../../../core/common/constants";
import RS, { Option } from "../../../../resources/resourceManager";
import { getUrlPath } from "../../../../core/utils/RoutesUtils";
import { URL } from "../../../../core/common/app.routes";
import dateHelper from '../../../../utils/dateHelper';
import * as apiHelper from '../../../../utils/apiHelper';
import MyTimeSliderWidget from "../../../elements/MyTimeSliderWidget";
import CommonSelect from '../../../elements/CommonSelect.component';
import Breadcrumb from '../../../elements/Breadcrumb';
import * as timesheetActions from '../../../../actionsv2/timesheetActions';
import { hideElementLoadingIndicator, showElementLoadingIndicator } from '../../../../utils/loadingIndicatorActions';

const redirect = getUrlPath(URL.TIMESHEETS_HISTORY);
class GroupTimesheetsHistory extends React.Component {
  constructor(props) {
    super(props);
    let filter = this.getDefaultFilter();
    filter = _.assign({}, filter, this.getFilterFromUrl());
    this.state = {
      submittedGroups: {},
      groupsTimesheetsHistory: [],
      filter,
      selectedGroupId: 0,
      minDate: dateHelper.getStartOfWeek(new Date())
    };

    this.queryString = {
      order_by: "id",
      is_desc: true,
      page_size: QUERY_STRING.PAGE_SIZE,
      page: 0
    };

    this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
    this.queryString = this.convertFilterToQueryString(this.queryString, filter);
    this.expandCollapseDelayTime = 350;
    this.expandCollapseLastClick = new Date().getTime();
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleExpandCollapseClick = this.handleExpandCollapseClick.bind(this);
    this.renderSubTabTable = this.renderSubTabTable.bind(this);
    this.renderValueComponent = this.renderValueComponent.bind(this);
  }

  componentDidMount() {
    this.props.timesheetsActions.loadTimesheetTypes();
    this.props.loadAllGroup({});
    this.handleLoadGroupsTimesheetsHistory(this.queryString);
    this.props.timesheetsActions.loadTimesheetSetting();
    this.handleSearchCallback = debounceHelper.debounce(function (events) {
      this.queryString.page = 0;
      this.handleFilterParamsChange();
      this.handleLoadGroupsTimesheetsHistory(this.queryString);
    }, WAITING_TIME);
    let dateRange = dateHelper.getDateRange(this.state.minDate, TIMESPAN.LAST_MONTH);
    this.setState({
      filter: {
        ...this.state.filter,
        timeSliderWidgetOption: {
          from: dateRange.from,
          to: dateRange.to,
        }
      }
    });
  }

  handleLoadGroupsTimesheetsHistory = (query) => {
    showElementLoadingIndicator();
    timesheetActions.loadGroupsTimesheetsHistory(query, this.handleReciveGroupsTimesheetsHistory)
  }

  handleReciveSubmittedGroupsTimesheetsHistory = (err, submittedGroupsTimesheetsHistory) => {
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'));
    } else {
      if (!_.isEmpty(submittedGroupsTimesheetsHistory)) {
        this.setState({
          submittedGroups: _.assign({}, this.state.submittedGroups, {
            [submittedGroupsTimesheetsHistory[0].groupId]: {
              value: submittedGroupsTimesheetsHistory,
              updatedTime: new Date().getTime()
            }
          })
        })
      }
      else {
        this.setState({
          submittedGroups: _.assign({}, this.state.submittedGroups, {
            [this.state.selectedGroupId]: {
              value: [],
              updatedTime: new Date().getTime()
            }
          })
        })
      }
    }
  }

  handleReciveGroupsTimesheetsHistory = (err, groupsTimesheetsHistory) => {
    hideElementLoadingIndicator();
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'));
    } else {
      this.setState({ groupsTimesheetsHistory });
    }
  }

  getDefaultFilter() {
    let filter = {};
    let dateRange = { ...dateHelper.getDateRange(new Date(), TIMESPAN.LAST_MONTH), option: TIMESPAN.LAST_MONTH };
    filter.timeSliderWidgetOption = dateRange;
    return filter;
  }

  convertFilterToQueryString(queryString, filter) {
    let query = _.assign({}, queryString);
    query.groupIds = apiHelper.getQueryStringListParams(filter.groupIds);
    query.fromDate = dateHelper.localToUTC(new Date(filter.timeSliderWidgetOption.from));
    query.toDate = dateHelper.localToUTC(new Date(filter.timeSliderWidgetOption.to));
    return query;
  }

  getFilterFromUrl() {
    let { query } = this.props.location;
    let filter = {
      fromDate: query.fromDate,
      toDate: query.toDate,
      groupIds: apiHelper.convertQueryStringToList(query.groupIds)
    };
    let isEmptyParams = function (item) {
      if (_.isUndefined(item) || _.isNull(item) || item == '') {
        return true;
      }
      if (_.isArray(item) && item.length == 0) {
        return true;
      }
      if (_.isObject(item) && _.isEmpty(_.omitBy(item, isEmptyParams))) {
        return true;
      }
      return false;
    };

    return _.omitBy(filter, (item) => {
      return isEmptyParams(item);
    });
  }

  handleFilterParamsChange() {
    let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
    }).join('&');
    browserHistory.replace(getUrlPath(URL.TIMESHEETS_HISTORY) + '?' + paramsString);
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    this.handleLoadGroupsTimesheetsHistory(this.queryString);
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    this.handleLoadGroupsTimesheetsHistory(this.queryString);
  }

  convertQuerytoQueryGetTimesheet(query) {
    let result = _.cloneDeep(query);
    delete result['page_size'];
    result.order_by = 'createdDate';
    return result;
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

  handleApplyFilter() {
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
    this.handleFilterParamsChange();
    this.handleLoadGroupsTimesheetsHistory(this.queryString);
    if (this.state.selectedGroupId) {
      this.queryStringLoadTimesheet = this.convertQuerytoQueryGetTimesheet(this.queryString);
      timesheetActions.loadsubmittedGroupsTimesheetsHistory(this.state.selectedGroupId, this.state.filter, this.handleReciveSubmittedGroupsTimesheetsHistory);
    }
  }

  handleFilterChange(field, data, callback) {
    callback = callback || (() => { });
    this.setState({
      filter: {
        ...this.state.filter,
        [field]: data
      }
    }, callback);
  }

  handleDateRangeChange(from, to, option) {
    this.handleFilterChange('timeSliderWidgetOption', { from, to, option }, this.handleApplyFilter);
  }

  handleExpandCollapseClick(groupId) {
    let now = new Date().getTime();
    if (this.expandCollapseLastClick + this.expandCollapseDelayTime > now) {
      return;
    }
    this.expandCollapseLastClick = now;
    if (this.state.selectedGroupId == groupId) {
      this.setState({ selectedGroupId: 0 });
      $('#timesheets-details-' + groupId).collapse('hide');
    } else {
      if (!this.state.submittedGroups[groupId] ||
        (this.state.submittedGroups[groupId].updatedTime + EXPIRED_TIME_TIMESHEET_DATA < new Date().getTime())) {
        this.queryStringLoadTimesheet.clockIn = this.queryString.clockIn;
        timesheetActions.loadsubmittedGroupsTimesheetsHistory(groupId, this.state.filter, this.handleReciveSubmittedGroupsTimesheetsHistory);
      }
      $('.timesheets-details').removeClass('in');
      this.setState({ selectedGroupId: groupId });
      $('#timesheets-details-' + groupId).collapse('show');
    }
  }

  renderSubTabTable(timesheetByGroup) {
    const rows = _.map(timesheetByGroup, (item, index) => {
      let params = {
        groupId: item.groupId,
        submitterId: item.submittedBy.id,
        submitDate: dateHelper.localToUTC(item.submitOn)
      };
      return (
        <tr key={index}
        onClick={() => browserHistory.push(getUrlPath(URL.GROUP_TIMESHEET_HISTORY_DETAIL, params))}
        >
          <td></td>
          <td className="primary-avatar-cell">
            <div className="avatar-content">
              <img src={_.get(item, 'submittedBy.photoUrl') ? (API_FILE + _.get(item, 'submittedBy.photoUrl')) : require("../../../../images/avatarDefault.png")} />
              <div className="cell-content">
                <div className="main-label">
                  {_.get(item, 'submittedBy.fullName')}
                </div>
                <div className="sub-label">
                  {_.get(item, 'submittedBy.jobRole.name')}
                </div>
              </div>
            </div>
          </td>
          <td>
            {dateHelper.formatTimeWithPattern(_.get(item, 'submitOn'), DATETIME.DATE_LEAVE)}
          </td>
          <td></td>
        </tr>
      );
    })
    return rows;
  }

  render() {
    const linkBreadcrumb = [{
      key: RS.getString("EMPLOYEE_TIMESHEETS"),
      value: getUrlPath(URL.GROUP_TIMESHEETS)
    }]
    let durations = [{ type: TIMESPAN.LAST_MONTH }, { type: TIMESPAN.LAST_FORTNIGHT }, { type: TIMESPAN.LAST_WEEK }, { type: TIMESPAN.MANUAL }];
    return (
      <div className="page-container page-group-timesheets-history">
        <div className="header">{RS.getString("TEAM_TIMESHEET_HISTORY")}</div>
        <Breadcrumb link={linkBreadcrumb} />
        <div className="row row-body">
          <div className="employee-timesheets">
            <div className="row-header">
              <div className="filter-group">
                <CommonSelect
                  multi
                  propertyItem={{ label: 'name', value: 'id' }}
                  options={this.props.groups}
                  allowOptionAll={true}
                  optionAllText={RS.getString('ALL')}
                  value={_.get(this.state.filter, 'groupIds', '')}
                  onChange={this.handleFilterGroup}
                  valueComponent={this.renderValueComponent}
                  titlePlaceHolder={RS.getString("GROUP") + ": "}
                  onChange={value => {
                    const groupId = [];
                    _.map(value, item => {
                      groupId.push(item.id);
                    });
                    this.handleFilterChange('groupIds', groupId, this.handleApplyFilter);
                  }
                  }
                />
              </div>
              <div className="time-slider">
                <MyTimeSliderWidget.Dropdown
                  durations={durations}
                  startDate={_.get(this.state.filter, 'timeSliderWidgetOption.from', '')}
                  endDate={_.get(this.state.filter, 'timeSliderWidgetOption.to', '')}
                  selectedDuration={_.get(this.state.filter, 'timeSliderWidgetOption.option', TIMESPAN.LAST_MONTH)}
                  handleChange={this.handleDateRangeChange}
                />
              </div>
            </div>
            <div className="employee-timsheets-listing">
              <div>
                <table className="metro-table">
                  <MyHeader>
                    <MyRowHeader>
                      <MyTableHeader>
                      </MyTableHeader>
                      <MyTableHeader>
                        {RS.getString("GROUP_NAME")}
                      </MyTableHeader>
                      <MyTableHeader>
                        {RS.getString("MANAGED_BY")}
                      </MyTableHeader>
                      <MyTableHeader>
                        {RS.getString("NUMBER_OF_SUBMISSIONS")}
                      </MyTableHeader>
                    </MyRowHeader>
                  </MyHeader>
                </table>
                {
                  _.map(this.state.groupsTimesheetsHistory, (timesheet, index) => {
                    return (
                      timesheet.numberOfSubmissions >= 0 ?
                        <div key={index} className="display-item">
                          < div
                            className={'list-item ' + (this.state.selectedGroupId == timesheet.group.id ? 'selected' : '')}
                            onClick={this.handleExpandCollapseClick.bind(this, timesheet.group.id)}
                          >
                            <div className="item-content">
                              <div className="toggle-details">
                                <i
                                  className={this.state.selectedGroupId == timesheet.group.id ? "icon-dropdown-arrow" : "icon-next-arrow"} />
                              </div>
                              <div><span className="group-name">{_.get(timesheet, 'group.name')}</span></div>
                              <div className="avatar-content">
                                <img src={_.get(timesheet, 'group.supervisor.photoUrl') ? (API_FILE + _.get(timesheet, 'group.supervisor.photoUrl')) : require("../../../../images/avatarDefault.png")} />
                                <div className="cell-content">
                                  <div className="main-label">
                                    {_.get(timesheet, 'group.supervisor.fullName')}
                                  </div>
                                  <div className="sub-label">
                                    {_.get(timesheet, 'group.supervisor.jobRole.name')}
                                  </div>
                                </div>
                              </div>
                              <div>
                                {_.get(timesheet, 'numberOfSubmissions')}
                              </div>
                            </div>
                            <div id={'timesheets-details-' + timesheet.group.id} className="timesheets-details collapse row ">
                              <table className="metro-table">
                                <MyHeader>
                                  <MyRowHeader>
                                    <MyTableHeader>
                                    </MyTableHeader>
                                    <MyTableHeader>
                                      {RS.getString("SUBMITTED_BY")}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                      {RS.getString("SUBMITTED_ON")}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                    </MyTableHeader>
                                  </MyRowHeader>
                                </MyHeader>
                                <tbody>
                                  {
                                    this.state.submittedGroups[timesheet.group.id] &&
                                    this.renderSubTabTable(this.state.submittedGroups[timesheet.group.id].value)
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div> : null
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
        </div>
      </div>
    );
  }
}

export default GroupTimesheetsHistory;