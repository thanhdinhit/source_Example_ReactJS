import React, { PropTypes } from "react";
import * as toastr from '../../../../utils/toastr';
import debounceHelper from "../../../../utils/debounceHelper";
import {
  MyHeader,
  MyTableHeader,
  MyRowHeader
} from "../../../elements/table/MyTable";
import _ from "lodash";
import {
  TIMESPAN,
  WAITING_TIME,
  STATUS,
  TIMEFORMAT,
  QUERY_STRING,
  TIMESHEET_PERIOD_TYPE
} from "../../../../core/common/constants";
import RS, { Option } from "../../../../resources/resourceManager";
import { getUrlPath } from "../../../../core/utils/RoutesUtils";
import { formatFilterFromUrl } from '../../../../utils/arrayHelper';
import { URL } from "../../../../core/common/app.routes";
import RIGHTS from "../../../../constants/rights";
import dateHelper from '../../../../utils/dateHelper'
import * as apiHelper from '../../../../utils/apiHelper'
import RaisedButton from "../../../elements/RaisedButton";
import FilterSearch from "../../../elements/Filter/FilterSearch";
import TimeSliderWidget from "../../../elements/TimeSliderWidget";
import CommonSelect from '../../../elements/CommonSelect.component';
import { browserHistory } from 'react-router';
import * as timesheetActions from '../../../../actionsv2/timesheetActions';
import * as groupActions from '../../../../actionsv2/groupActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from "../../../../utils/loadingIndicatorActions";
import DialogSubmitTimesheets from './DialogSubmitTimesheets';
import { rebuildTree } from '../../../../utils/arrayHelper';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import Pagination from '../../../elements/Paginate/Pagination';

const redirect = getUrlPath(URL.GROUP_TIMESHEETS);
const propTypes = {
  payload: PropTypes.object,
};
class GroupTimesheets extends React.Component {
  constructor(props) {
    super(props);
    let { query } = this.props.location;
    let filter = this.getFilterFromUrl();

    this.state = {
      filterGroupTimesheets: {
        filterSearch: "",
        filter: {
          ...filter
        }
      },
      durations: [{ type: TIMESPAN.MANUAL }],
      minDate: dateHelper.getStartOfWeek(new Date()),
      groupTimesheets: [],
      groupTimesheetStatistic: [],
      groups: []
    };
    this.statusOptions = [
      { name: STATUS.PENDING },
      { name: STATUS.APPROVED }
    ];

    this.queryString = {
      order_by: query.order_by ? query.order_by : 'id',
      is_desc: query.is_desc == 'false' ? false : true,
      page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
      page: parseInt(query.page) ? parseInt(query.page) : 0,
      // clockIn: dateHelper.convertDateTimeToQueryString(dateRange.from, dateRange.to),
      // clockInOption: dateRange.option,
      name: query.name
    };
    // this.queryString = this.convertFilterToQueryString(this.queryString, { ...filter, clockIn: dateRange });

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterStatus = this.handleFilterStatus.bind(this);
    this.handleFilterGroup = this.handleFilterGroup.bind(this);
    this.handleSubmitTimesheet = this.handleSubmitTimesheet.bind(this);
    this.handleCallBackAction = this.handleCallBackAction.bind(this);
    this.handleCallbackGetGroupTimesheetStatistic = this.handleCallbackGetGroupTimesheetStatistic.bind(this)
  }

  componentDidMount() {
    groupActions.loadAllGroup("", (err, result) => {
      this.handleCallBackGetAllGroups(err, result);
    });

    //timesheetActions.getGroupTimesheetStatistic(this.handleCallbackGetGroupTimesheetStatistic);
    timesheetActions.loadTimesheetSetting((err, result) => this.handleCallBackAction(err, result, 'timesheetSetting'));

    showAppLoadingIndicator();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => {
      this.handleCallbackGetGroupTimesheetStatistic(err, result);
    });

    this.handleSearchCallback = debounceHelper.debounce(function (events) {
      this.queryString.page = 0;
      this.handleFilterParamsChange();
      timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
    }, WAITING_TIME);
  }

  handleCallBackGetAllGroups(err, groups) {
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'));
    } else {
      this.setState({ groups });
    }
  }

  handleCallbackGetGroupTimesheetStatistic(err, groupTimesheetStatistic) {
    hideAppLoadingIndicator();
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'));
    } else {
      const groups = rebuildTree(_.map(groupTimesheetStatistic, group => {
        const groupClone = _.cloneDeep(group);
        groupClone.group.disabled = groupClone.countPendings != 0;
        groupClone.group.checked = !groupClone.group.disabled;
        groupClone.group.countPendings = groupClone.countPendings;
        return groupClone.group;
      }));
      this.setState({ groups });

      let minDate = _.minBy(groupTimesheetStatistic, 'group.lastSubmission');
      if (minDate) {
        if (_.get(this.state, 'filterGroupTimesheets.filter.clockIn.option') == TIMESPAN.FROM_LAST_SUBMISSION || !_.get(this.state, 'filterGroupTimesheets.filter.clockIn.option')) {
          this.state.filterGroupTimesheets.filter.clockIn = {
            from: minDate.group.lastSubmission,
            to: new Date(),
            option: TIMESPAN.FROM_LAST_SUBMISSION
          }
        }
        this.state.minDate = minDate.group.lastSubmission;
      }
      else {
        let dateRange = dateHelper.getDateRange(new Date(), TIMESPAN.WEEK);
        this.state.filterGroupTimesheets.filter.clockIn = {
          from: dateRange.from,
          to: dateRange.to,
          option: TIMESPAN.WEEK
        }
      }
      this.setState(this.state, () => {
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterGroupTimesheets.filter);
        this.handleFilterParamsChange();
        this.setState({
          groupTimesheetStatistic
        }, () => timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets')));
      });

      if (groupTimesheetStatistic.length == 1) {
        browserHistory.push(getUrlPath(URL.GROUP_TIMESHEETS_DETAIL, { groupId: groupTimesheetStatistic[0].group.id }));
      }
    }
  }

  getTime(date) {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
    }
    return 0;
  }

  getFilterFromUrl() {
    let { query } = this.props.location;

    let filter = {
      filterSearch: query.name,
      status: apiHelper.convertQueryStringToList(query.status, false),
      group: apiHelper.convertQueryStringToList(query.groupIds),
      clockIn: { ...dateHelper.convertQueryStringToDateRange(query.clockIn), option: query.clockInOption }
    };

    return formatFilterFromUrl(filter)
  }

  handleFilterParamsChange() {
    let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
    }).join('&');
    browserHistory.replace(getUrlPath(URL.GROUP_TIMESHEETS) + '?' + paramsString);
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    this.handleFilterParamsChange();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    this.handleFilterParamsChange();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
  }

  handleSearch(value) {
    this.queryString.name = value;
    this.setState({
      filterGroupTimesheets: {
        ...this.state.filterGroupTimesheets,
        filterSearch: value
      }
    });
    this.handleSearchCallback(value);
  }

  handleApplyFilter() {
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterGroupTimesheets.filter);
    this.handleFilterParamsChange();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
  }

  convertFilterToQueryString(queryString, filter) {
    let query = _.assign({}, queryString);
    query.page = 0;

    query.groupIds = apiHelper.getQueryStringListParams(filter.group);
    query.status = apiHelper.getQueryStringListParams(filter.status ? [filter.status] : filter.status);
    query.clockIn = dateHelper.convertDateTimeToQueryString(filter.clockIn.from, filter.clockIn.to);
    query.clockInOption = filter.clockIn.option;

    return query;
  }

  handleFilterChange(field, data, callback) {
    callback = callback || (() => { });
    this.setState({
      filterGroupTimesheets: {
        ...this.state.filterGroupTimesheets,
        filter: {
          ...this.state.filterGroupTimesheets.filter,
          [field]: data
        }
      }
    }, callback);
  }

  handleDateRangeChange(from, to, option) {
    this.handleFilterChange('clockIn', { from, to, option }, this.handleApplyFilter);
  }

  handleFilterGroup(option) {
    option = option || {};
    this.setState({
      filterGroupTimesheets: {
        ...this.state.filterGroupTimesheets,
        filter: {
          ...this.state.filterGroupTimesheets.filter,
          group: option.value
        }
      }
    });
    this.queryString.groupIds = apiHelper.getQueryStringListParams([option.value]);
    if (!option.value) {
      _.unset(this.queryString, 'groupIds');
    }
    this.handleFilterParamsChange();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
  }

  handleFilterStatus(option) {
    option = option || {};
    this.setState({
      filterGroupTimesheets: {
        ...this.state.filterGroupTimesheets,
        filter: {
          ...this.state.filterGroupTimesheets.filter,
          status: option.value
        }
      }
    });

    this.queryString.status = apiHelper.getQueryStringListParams([option.value]);
    if (!option.value) {
      _.unset(this.queryString, 'status');
    }
    this.handleFilterParamsChange();
    timesheetActions.loadGroupTimesheets(this.queryString, (err, result) => this.handleCallBackAction(err, result, 'groupTimesheets'));
  }

  handleCallBackAction(err, result, field) {
    hideAppLoadingIndicator();
    if (err) {
      toastr.error(err.message, RS.getString('ERROR'));
    }
    else {
      switch (field) {
        case 'groupTimesheets':
          let getParentPath = function (group) {
            if (group) {
              if (group.parent) {
                return [...getParentPath(group.parent), group.name];
              }
              return [group.name];
            }
            return [];
          };
          _.forEach(result, groupTimesheet => {
            let parents = getParentPath(_.get(groupTimesheet, 'group.parent'));
            groupTimesheet.group.parentName = [...parents, ''].join(' / ');
          });
          const groups = rebuildTree(_.map(result, group => {
            const groupClone = _.cloneDeep(group);
            groupClone.group.disabled = groupClone.countPendings != 0;
            groupClone.group.checked = !groupClone.group.disabled;
            groupClone.group.countPendings = groupClone.countPendings;
            return groupClone.group;
          }));
          this.setState({ groups });
          break;
        case 'timesheetSetting':
          let durations = []
          let period = _.get(result, 'periodType');
          switch (period) {
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
          this.state.durations = durations;
          break;
        default:
          break;
      }
      this.state[field] = result;
      this.setState({ ...this.state });
    }
  }

  handleSubmitTimesheet(timesheets) {
    showAppLoadingIndicator();
    timesheetActions.submitTeamTimesheet(timesheets, (err) => {
      hideAppLoadingIndicator();
      if (err) {
        toastr.error(err.message, RS.getString("ERROR"));
      }
      else {
        toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
        this.setState({ isOpen: false });
      }
    });
  }

  renderValueComponent(labelPrefix, option) {
    return (
      <div className="Select-value" >
        <span className="Select-value-label" role="option" aria-selected="true" >
          <span className="select-value-label-normal"> {labelPrefix}: </span>
          {option.value.label}
        </span>
      </div>
    );
  }

  callbackGetGroupTimesheetStatistic(groupStatusTimesheets) {
    let groupsClone = _.cloneDeep(this.state.groups);
    _.forEach(groupsClone, group => {
      const groupStatusTimesheet = _.find(groupStatusTimesheets, item => {
        return item.id === group.id;
      });

      const lastSubmission = groupStatusTimesheet ? groupStatusTimesheet.lastSubmission : null;
      const submitTo = groupStatusTimesheet ? groupStatusTimesheet.submitTo : null;

      if ((!lastSubmission && !submitTo) || (submitTo && this.getTime(submitTo) > new Date().getTime())) {
        group.disabled = true;
      }

      if (groupStatusTimesheet) {
        group.timesheetDisabled = groupStatusTimesheet.timesheetDisabled;
        group.notAllowSubmit = groupStatusTimesheet.notAllowSubmit;
      }

    });
    this.setState({ groups: groupsClone });
  }

  render() {
    const canSubmit = _.find(this.state.groups, group => {
      return (group.disabled = false && group.checked);
    });

    let status = this.state.filterGroupTimesheets.filter.status;
    status = _.isArray(status) && status.length ? status[0] : status;
    let group = this.state.filterGroupTimesheets.filter.group;
    group = _.isArray(group) && group.length ? group[0] : group;

    return (
      <div className="page-container page-group-timesheets">
        <div className="header">
          {RS.getString("EMPLOYEE_TIMESHEETS")}
        </div>
        <div className="row row-body">
          <div>
            <div className="row-header">
              <div className="col-md-1-5 col-sm-6 col-xs-12 filter-status">
                <CommonSelect
                  propertyItem={{ label: 'name', value: 'name' }}
                  options={this.statusOptions}
                  allowOptionAll={true}
                  optionAllText={RS.getString('ALL')}
                  value={status}
                  onChange={this.handleFilterStatus}
                  valueComponent={this.renderValueComponent.bind(this, RS.getString('STATUS'))}
                  titlePlaceHolder={RS.getString("STATUS") + ": "}
                />
              </div>
              <div className="col-md-1-5 col-sm-6 col-xs-12 filter-group">
                <CommonSelect
                  propertyItem={{ label: 'name', value: 'id' }}
                  options={this.state.groups}
                  allowOptionAll={true}
                  optionAllText={RS.getString('ALL')}
                  value={group}
                  onChange={this.handleFilterGroup}
                  valueComponent={this.renderValueComponent.bind(this, RS.getString('GROUP'))}
                  titlePlaceHolder={RS.getString("GROUP") + ": "}
                />
              </div>
              <div className="time-slider">
                <TimeSliderWidget.Dropdown
                  timeDurations={this.state.durations}
                  defaultDate={this.state.minDate}
                  startDate={_.get(this.state.filterGroupTimesheets.filter, 'clockIn.from')}
                  endDate={_.get(this.state.filterGroupTimesheets.filter, 'clockIn.to')}
                  selectedDuration={_.get(this.state.filterGroupTimesheets.filter, 'clockIn.option') || TIMESPAN.WEEK}
                  handleChange={this.handleDateRangeChange}
                />
              </div>
              <div className="pull-right">
                <FilterSearch
                  ref={filterSearch => (this.filterSearch = filterSearch)}
                  handleSearchChange={this.handleSearch}
                  defaultValue={this.state.filterGroupTimesheets.filterSearch}
                  placeholder={RS.getString("SEARCH_GROUP")}
                />
                {this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_MEMBER_TIMESHEET) ?
                  (
                    <RaisedButton
                      className="raised-button-first-secondary"
                      label={RS.getString("VIEW_HISTORY", null, Option.CAPEACHWORD)}
                      onClick={() => browserHistory.push(getUrlPath(URL.TIMESHEETS_HISTORY))}
                    />
                  ) : null}
                {this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_MEMBER_TIMESHEET) ?
                  (
                    <RaisedButton
                      // disabled={!canSubmit}
                      label={RS.getString("SUBMIT", null, Option.CAPEACHWORD)}
                      onClick={() => {
                        showAppLoadingIndicator();
                        timesheetActions.getGroupTimesheetStatistic((err, result) => {
                          hideAppLoadingIndicator();
                          if (err) {
                            toastr.error(err.message, RS.getString('ERROR'));
                          }
                          else {
                            this.callbackGetGroupTimesheetStatistic(result);
                            this.setState({
                              groupTimesheetStatistic: result,
                              isOpen: true,
                            });
                          }
                        });

                      }}
                    />
                  ) : null}
              </div>
            </div>
            <table className="metro-table">
              <MyHeader>
                <MyRowHeader>
                  <MyTableHeader>
                    {RS.getString("GROUP_NAME")}
                  </MyTableHeader>
                  <MyTableHeader>
                    {RS.getString("MANAGED_BY")}
                  </MyTableHeader>
                  <MyTableHeader>
                    {RS.getString("LAST_SUBMISSION")}
                  </MyTableHeader>
                  <MyTableHeader>{' '}</MyTableHeader>
                </MyRowHeader>
              </MyHeader>
              <tbody>
                {
                  _.map(this.state.groupTimesheets, function (timesheet, index) {
                    return (
                      <tr key={index} onClick={() => browserHistory.push(getUrlPath(URL.GROUP_TIMESHEETS_DETAIL, { groupId: timesheet.group.id }))}>
                        <td className="group-path-cell">
                          <span>{_.get(timesheet, 'group.parentName')}</span><span className="group-name">{_.get(timesheet, 'group.name')}</span>
                        </td>
                        <td className="primary-avatar-cell">
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
                        </td>
                        <td>
                          {_.get(timesheet, 'group.lastSubmission') ? dateHelper.formatTimeWithPattern(_.get(timesheet, 'group.lastSubmission'), TIMEFORMAT.GROUP_TIMESHEET) : ''}
                        </td>
                        <td className="group-status-stat">
                          <div className="cell-status-stat">
                            <span>{timesheet.countPendings || 0}</span>
                            <div className={"status Pending"}>{RS.getString('STATUS_PENDING')}</div>
                          </div>
                          <div className="cell-status-stat">
                            <span>{timesheet.countApproveds || 0}</span>
                            <div className={"status Approved"}>{RS.getString('STATUS_APPROVED')}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
            <div className="listing-footer">
                    <div className="pull-left">
                        <ItemsDisplayPerPage
                            name="ItemsDisplayPerPage"
                            value={this.queryString.page_size}
                            totalRecord={this.state.groupTimesheets.length}
                            onChange={this.handleChangeDisplayPerPage}
                        />
                    </div>
                    <div className="pull-right">
                        {
                            this.state.groupTimesheets.length > this.queryString.page_size ?
                                <Pagination
                                    firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                    lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                    prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                    nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                    activePage={this.queryString.page + 1}
                                    itemsCountPerPage={this.queryString.page_size}
                                    totalItemsCount={this.state.groupTimesheets.length}
                                    onChange={this.handlePageClick}
                                /> : undefined
                        }
                    </div>
                </div>
          </div>
        </div>
        <DialogSubmitTimesheets
          isOpen={this.state.isOpen}
          title={RS.getString('SUBMIT_TIMESHEET', null, 'UPPER')}
          handleClose={() => this.setState({ isOpen: false })}
          groups={this.state.groups}
          handleSubmitTimesheet={this.handleSubmitTimesheet}
        />
      </div>
    );
  }
}

GroupTimesheets.propTypes = propTypes;
export default GroupTimesheets;