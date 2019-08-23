import React from 'react';
import _ from 'lodash';
import RaisedButton from '../../../elements/RaisedButton';
import Breadcrumb from '../../../elements/Breadcrumb';
import { browserHistory } from 'react-router'
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import Pagination from '../../../elements/Paginate/Pagination'
import * as toastr from '../../../../utils/toastr';
import RIGHTS from '../../../../constants/rights';
import { STATUS, WAITING_TIME, FILTER_DATE, YEAR_LIMIT_DELTA, TIMEFORMAT, TIMESPAN, OVERTIME_LEVELS, getOvertimeStatusOptions, QUERY_STRING } from '../../../../core/common/constants';
import CommonSelect from '../../../elements/CommonSelect.component';
import debounceHelper from '../../../../utils/debounceHelper';
import dateHelper from '../../../../utils/dateHelper'
import * as apiHelper from '../../../../utils/apiHelper'
import MyTimeSliderWidget from '../../../elements/MyTimeSliderWidget';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import FilterModal from '../../../elements/Filter/FilterModal';
import FilterDateTime from '../../../elements/Filter/FilterDateTime';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

const redirect = getUrlPath(URL.OVERTIME);
class OvertimeStatistic extends React.Component {
    constructor(props) {
        super(props);
        let dateRange = { ...dateHelper.getDateRange(new Date(), TIMESPAN.MONTH), option: TIMESPAN.MONTH };

        this.state = {
            filterOvertimeStatistic: {
                filterSearch: '',
                prefilter: {},
                filter: {
                    overtimeFrom: {
                        from: dateRange.from,
                        to: dateRange.to,
                        option: TIMESPAN.MONTH
                    }
                },
                checkIsOpenFilter: false
            }
        }
        this.queryString = {
            order_by: 'hours',
            is_desc: true,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0
        };
        this.queryString.overtimeFrom = dateHelper.convertDateRangeToQueryString(dateRange);

        this.listSortActions = [
            { id: 'SortBy_First_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'FIRST_NAME']) },
            { id: 'SortBy_Last_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'LAST_NAME']) }
        ];

        if (!_.isEmpty(props.queryString)) this.queryString = _.cloneDeep(props.queryString);
        if (!_.isEmpty(props.filter)) this.state.filterOvertimeStatistic = _.cloneDeep(props.filter);

        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOpenFilterOvertimeStatistic = this.handleOpenFilterOvertimeStatistic.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleAddOvertime = this.handleAddOvertime.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadOvertimeSetting();
        this.props.overtimeActions.loadOvertimeStatistic(this.queryString, redirect);
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            this.props.overtimeActions.loadOvertimeStatistic(this.queryString, redirect);
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterOvertimeStatistic));
            this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)
        }, WAITING_TIME);
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.props.globalAction.resetState();
        }
        if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
            toastr.error(nextProps.payload.error.message, RS.getString('ERROR'))
            this.props.globalAction.resetError();
        }
    }

    handlePageClick(page) {
        this.queryString.page = page - 1;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadOvertimeStatistic(this.queryString, redirect);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page_size = pageSize;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadOvertimeStatistic(this.queryString, redirect);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    // filter
    handleSearch(value) {
        this.queryString.name = value;
        this.setState({
            filterOvertimeStatistic: {
                ...this.state.filterOvertimeStatistic,
                filterSearch: value
            }
        })
        this.handleSearchCallback(value);
    }

    handleOpenFilterOvertimeStatistic() {
        this.setState({ isOpenFilterOvertimeStatistic: true });
        this.handleGetData();
    }

    handleGetData() {
        if (!this.state.checkIsOpenFilter) {
            this.setState({ checkIsOpenFilter: true })
            setTimeout(() => {
                this.props.loadJobRolesSetting({});
                this.props.loadAllGroup({});
            }, 0);
        }
    }

    handleCloseFilter() {
        this.setState({
            isOpenFilterOvertimeStatistic: false,
            filterOvertimeStatistic: {
                ...this.state.filterOvertimeStatistic,
                filter: this.state.filterOvertimeStatistic.prefilter,
                filterMore: this.state.filterOvertimeStatistic.prefilterMore
            }
        })
        this.filterSearch.handleCloseFilter();
    }
    handleResetFilter() {
        this.setState({
            filterOvertimeStatistic: {
                prefilter: {},
                filter: {},
            }
        });
    }
    handleApplyFilter() {
        this.setState({
            isOpenFilterOvertimeStatistic: false,
            filterOvertimeStatistic: {
                ...this.state.filterOvertimeStatistic,
                prefilter: this.state.filterOvertimeStatistic.filter,
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterOvertimeStatistic));
        });
        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterOvertimeStatistic.filter);
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadOvertimeStatistic(this.queryString);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }
    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.jobRoleIds = apiHelper.getQueryStringListParams(filter.jobRole);
        query.groupIds = apiHelper.getQueryStringListParams(filter.group);
        query.hours = apiHelper.convertNumbersToQueryString(filter.hours);
        query.overtimeFrom = dateHelper.convertDateRangeToQueryString(filter.overtimeFrom);

        return query;
    }

    handleFilterChange(field, data, callback) {
        callback = callback || (() => { });
        this.setState({
            filterOvertimeStatistic: {
                ...this.state.filterOvertimeStatistic,
                filter: {
                    ...this.state.filterOvertimeStatistic.filter,
                    [field]: data
                }
            }
        }, callback);
    }

    handleDateRangeChange(from, to, option) {
        this.handleFilterChange('overtimeFrom', { from, to, option }, this.handleApplyFilter);
    }

    handleSortClick(index, columnNameInput, directionInput) {
        let columnName = '';
        switch (columnNameInput) {
            case 'group':
                columnName = 'group';
                break;
            case 'hours':
                columnName = 'hours';
                break;
            case 'SortBy_First_Name':
                columnName = 'firstName';
                break;
            case 'SortBy_Last_Name':
                columnName = 'lastName';
                break
            default:
                return null;
        }
        if (columnName === '')
            return null;
        this.queryString.order_by = columnName;
        this.queryString.is_desc = directionInput != 1;
        this.queryString.page = 0;
        this.props.overtimeActions.loadOvertimeStatistic(this.queryString);
    }
    handleAddOvertime(employee) {
        if (employee) {
            LoadingIndicatorActions.showAppLoadingIndicator();
            this.props.overtimeActions.updateNewOvertime("employees", [{ contactDetail: employee, id: employee.id }]);
        }
        browserHistory.push(getUrlPath(URL.NEW_OVERTIME));
    }
    renderDefaultFilter(filter) {
        let component = null;
        switch (filter.value) {
            case 'jobRole': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.props.jobRoles}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterOvertimeStatistic.filter.jobRole}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
            case 'group': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.props.groups}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterOvertimeStatistic.filter.group}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
            case 'hours': {
                component = (
                    <FilterDateTime
                        type="number"
                        selectedValue={this.state.filterOvertimeStatistic.filter.hours || {}}
                        onChange={(value) => this.handleFilterChange(filter.value, value)}
                    />
                );
                break;
            }
        }
        return React.cloneElement(component, { title: filter.name, field: filter.value, key: filter.name });
    }

    render() {
        let optionsDefault = [
            { name: RS.getString('JOBROLE'), value: 'jobRole' },
            { name: RS.getString('GROUP'), value: 'group' },
            { name: RS.getString('HOURS'), value: 'hours' }
        ];
        let maxOvertimeHours = _.get(this.props, 'overtimeSetting.maxHoursPerMonth');
        if (_.get(this.state.filterOvertimeStatistic.filter, 'overtimeFrom.option') == TIMESPAN.WEEK) {
            maxOvertimeHours = _.get(this.props, 'overtimeSetting.maxHoursPerWeek');
        }
        return (
            <div className="overtime-statistic">
                <div className="row-header">
                    <div className="time-slider">
                        <MyTimeSliderWidget.Tab
                            ref={(timeWidget) => this.timeWidget = timeWidget}
                            durations={[{ type: TIMESPAN.MONTH }, { type: TIMESPAN.WEEK }]}
                            startDate={_.get(this.state.filterOvertimeStatistic.filter, 'overtimeFrom.from')}
                            endDate={_.get(this.state.filterOvertimeStatistic.filter, 'overtimeFrom.to')}
                            selectedDuration={_.get(this.state.filterOvertimeStatistic.filter, 'overtimeFrom.option') || TIMESPAN.MONTH}
                            handleChange={this.handleDateRangeChange}
                        />
                    </div>
                    <div className="pull-right">
                        <FilterSearch
                            ref={(filterSearch) => this.filterSearch = filterSearch}
                            handleSearchChange={this.handleSearch}
                            defaultValue={this.state.filterOvertimeStatistic.filterSearch}
                        >
                            <FilterModal
                                ref={(filterModal) => this.filterModal = filterModal}
                                isOpen={this.state.isOpenFilterOvertimeStatistic}
                                handleOpenFilter={this.handleOpenFilterOvertimeStatistic}
                                handleApplyFilter={this.handleApplyFilter}
                                handleResetFilter={this.handleResetFilter}
                                handleCloseFilter={this.handleCloseFilter}
                            >
                                {
                                    _.map(optionsDefault, (option) => this.renderDefaultFilter(option))
                                }
                            </FilterModal>
                        </FilterSearch>
                        {
                            this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_OVERTIME) ?
                                <RaisedButton
                                    label={RS.getString('NEW_OVERTIME', null, Option.CAPEACHWORD)}
                                    onClick={() => this.handleAddOvertime()}
                                /> : null
                        }
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader
                                name={'fullName'}
                                enableSort
                                listActions={this.listSortActions}>
                                {RS.getString("EMPLOYEE")}
                            </MyTableHeader>
                            <MyTableHeader
                                name={'group'}
                                enableSort>
                                {RS.getString("GROUP")}
                            </MyTableHeader>
                            <MyTableHeader
                                name={'hours'}
                                enableSort>
                                {RS.getString("OVERTIME_HOURS")}
                            </MyTableHeader>
                            <MyTableHeader className="column-action">
                                {RS.getString("ACTION")}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            _.map(this.props.overtimeStatistic, (ot) => {
                                let percentage = 100 * ot.hours / maxOvertimeHours, overtimeClassName = '';
                                if (percentage >= OVERTIME_LEVELS.OVERLOAD) {
                                    overtimeClassName = 'progress-overload';
                                } else if (percentage >= OVERTIME_LEVELS.WARNING_2) {
                                    overtimeClassName = 'progress-warning-2';
                                } else if (percentage >= OVERTIME_LEVELS.WARNING_1) {
                                    overtimeClassName = 'progress-warning-1';
                                } else {
                                    overtimeClassName = 'progress-normal';
                                }
                                return (
                                    <tr key={ot.employee.id}>
                                        <td className="primary-avatar-cell">
                                            <img src={ot.employee.photoUrl ? (API_FILE + ot.employee.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {ot.employee.fullName}
                                                </div>
                                                <div className="sub-label">
                                                    {_.get(ot, 'employee.jobRole.name')}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {_.get(ot, 'group.name')}
                                        </td>
                                        <td className="progress-cell">
                                            <div className="text">{`${ot.hours} ${RS.getString('HRS')}`}</div>
                                            <div className="progress">
                                                <div className={"progress-bar progress-bar-info progress-bar-striped " + overtimeClassName}
                                                    role="progressbar" aria-valuenow={ot.hours}
                                                    aria-valuemin="0" aria-valuemax={maxOvertimeHours}
                                                    style={{ width: (ot.hours >= maxOvertimeHours ? 100 : (ot.hours / maxOvertimeHours * 100)) + "%" }}>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-action">
                                            <img style={{ width: "14px" }} src={require("../../../../images/svg/add-icon.svg")} onClick={this.handleAddOvertime.bind(this, ot.employee)} />
                                        </td>
                                    </tr>
                                );

                            })
                        }
                    </tbody>
                </table>

                {
                    this.props.meta != null && this.props.meta.count > 0 ?
                        <div className="listing-footer">
                            {/* <div className="pull-left">
                                <ItemsDisplayPerPage
                                    name="ItemsDisplayPerPage"
                                    value={this.queryString.page_size}
                                    totalRecord={this.props.meta.count}
                                    onChange={this.handleChangeDisplayPerPage}
                                />
                            </div> */}
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
        )
    }
}

export default OvertimeStatistic;