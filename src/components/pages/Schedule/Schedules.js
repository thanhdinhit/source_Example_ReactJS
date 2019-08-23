import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import {
    WAITING_TIME,
    DATETIME,
    TIMEFORMAT,
    QUERY_STRING,
    CONTRACT_STATUS,
    SCHEDULE_STATUS,
    SCHEDULE_OPTION_VALUE,
    getSchedulesDateRangeOptions
} from "./../../../core/common/constants";
import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import _ from 'lodash';
import FilterSearch from '../../elements/Filter/FilterSearch';
import FilterModal from "../../elements/Filter/FilterModal";
import CommonSelect from "../../elements/CommonSelect.component";
import ShowHideColumn from "../../elements/table/ShowHideColumn";
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import Pagination from '../../elements/Paginate/Pagination';
import debounceHelper from '../../../utils/debounceHelper';
import * as apiHelper from '../../../utils/apiHelper';
import dateHelper from './../../../utils/dateHelper';
import { formatFilterFromUrl } from './../../../utils/arrayHelper';
import DialogAddSchedule from './DialogAddSchedule';
import { addSchedule, loadAllSchedules } from '../../../actionsv2/scheduleActions';
import * as toastr from '../../../utils/toastr';
import * as LoadingIndicatorActions from './../../../utils/loadingIndicatorActions';
import { loadManagedGroups } from '../../../actionsv2/groupActions';
import { loadLocations } from '../../../actionsv2/locationActions';
import * as actionTypes from '../../../constants/actionTypes'
const propTypes = {

};
class Schedules extends React.Component {
    constructor(props) {
        super(props);
        let { query } = this.props.location;
        let filter = this.getFilterFromUrl();

        this.state = {
            schedules: [],
            meta: {},
            isOpenFilter: false,
            filter: filter,
            columns: this.getInitialColumns(),
            isOpenDialogAddSchedule: false
        };

        this.queryString = {
            order_by: query.order_by ? query.order_by : 'status',
            is_desc: query.is_desc == 'true' ? true : false,
            page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
            page: parseInt(query.page) ? parseInt(query.page) : 0,
        };

        if (!filter.dateRange) {
            filter.dateRange = SCHEDULE_OPTION_VALUE.NEXT_30_DAYS;
        }

        this.queryString = this.convertFilterToQueryString(this.queryString, filter);
        this.renderSchedule = this.renderSchedule.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
        this.getContractStatusClass = this.getContractStatusClass.bind(this);
        this.renderDefaultFilter = this.renderDefaultFilter.bind(this);
        this.handleGetData = this.handleGetData.bind(this);
        this.handleOpenFilter = this.handleOpenFilter.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.renderStatus = this.renderStatus.bind(this);
        this.handleCallbackAction = this.handleCallbackAction.bind(this);
    }

    componentDidMount() {
        loadAllSchedules(this.queryString, this.handleCallbackAction.bind(this, actionTypes.LOAD_SCHEDULES));

        this.handleSearchCallback = debounceHelper.debounce(events => {
            this.queryString.page = 0;
            apiHelper.handleFilterParamsChange(URL.SCHEDULES, this.queryString);
            loadAllSchedules(this.queryString, this.handleCallbackAction.bind(this, actionTypes.LOAD_SCHEDULES));
        }, WAITING_TIME);
    }

    componentWillReceiveProps() {
        LoadingIndicatorActions.hideAppLoadingIndicator();

    }

    getInitialColumns() {
        return [
            {
                name: 'contractId',
                label: RS.getString('CONTRACT_ID'),
                show: false
            },
            {
                name: 'startDate',
                label: RS.getString('START_DATE'),
                show: false
            },
            {
                name: 'endDate',
                label: RS.getString('END_DATE'),
                show: false
            },
        ];
    }

    handleShowHideColumns(columns) {
        this.setState({ columns });
    }

    getFilterFromUrl() {
        let { query } = this.props.location;

        let filter = {
            searchText: query.searchText ? query.searchText : '',
            dateRange: query.dateRange,
            customer: apiHelper.convertQueryStringToList(query.customer),
            location: apiHelper.convertQueryStringToList(query.location)
        };

        return formatFilterFromUrl(filter);
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.searchText = filter.searchText;
        query.fromDate = new Date();
        switch (filter.dateRange) {
            case SCHEDULE_OPTION_VALUE.NEXT_30_DAYS:
                query.toDate = dateHelper.addDay(query.fromDate, 30);
                break;
            case SCHEDULE_OPTION_VALUE.NEXT_60_DAYS:
                query.toDate = dateHelper.addDay(query.fromDate, 60);
                break;
            case SCHEDULE_OPTION_VALUE.NEXT_90_DAYS:
                query.toDate = dateHelper.addDay(query.fromDate, 90);
                break;
            default:
                query.toDate = undefined;
                query.fromDate = undefined;
                break;
        }

        query.customer = apiHelper.getQueryStringListParams(filter.customer);
        query.location = apiHelper.getQueryStringListParams(filter.location);

        return query;
    }

    handleGetData() {
        if (!this.state.checkIsOpenFilter) {
            this.setState({ checkIsOpenFilter: true })
            setTimeout(() => {
                this.props.loadCustomers({})
                this.props.loadLocations({});
            }, 0)
        }
    }

    handleSearch(value) {
        this.queryString.searchText = value;

        this.setState({
            filter: {
                ...this.state.filter,
                searchText: this.queryString.searchText
            }
        });

        this.handleSearchCallback(value);
    }

    handlePageClick(page) {
        this.queryString.page = page - 1;
        apiHelper.handleFilterParamsChange(URL.SCHEDULES, this.queryString);
    }

    handleEdit(schedule) {
        browserHistory.push(getUrlPath(URL.SCHEDULE, { scheduleId: schedule.scheduleId }))
    }

    getContractStatusClass(status) {
        let className = '';

        switch (status) {
            case CONTRACT_STATUS.DRAFT: {
                className = 'status-draft';
                break;
            }
            case CONTRACT_STATUS.ACTIVE: {
                className = 'status-active';
                break;
            }
            case CONTRACT_STATUS.SUSPENDED: {
                className = 'status-suspended';
                break;
            }
            case CONTRACT_STATUS.COMPLETED: {
                className = 'status-completed';
                break;
            }
            default:
                break;
        }

        return className;
    }

    getClassName(field) {
        let className = '';
        let statusStr = '';
        let classNameOfNumber = '';

        switch (field) {
            case 'numberOfError': {
                className = 'status-error';
                classNameOfNumber = 'number-error';
                statusStr = 'STATUS_REQUIRE_ACTION';
                break;
            }
            case 'numberOfMissing': {
                className = 'status-missing';
                classNameOfNumber = 'number-missing';
                statusStr = 'STATUS_MISSING_RESOURCE';
                break;
            }
            case 'numberOfUnpublish': {
                className = 'status-unpublish';
                classNameOfNumber = 'number-unpublish';
                statusStr = 'STATUS_UNPUBLISHED';
                break;
            }
        }

        return {
            className: className,
            classNameOfNumber: classNameOfNumber,
            statusStr: statusStr
        }
    }

    renderStatus(schedule) {
        switch (schedule.status) {
            case SCHEDULE_STATUS.INITIAL: {
                let classNameInitial = 'status-initial';

                if (schedule.startDate && schedule.endDate && schedule.startDate.getTime() < new Date().getTime()) {
                    classNameInitial = 'status-error';
                }

                return (
                    <div className="cell-status-stat schedule__status">
                        <span className={"status " + classNameInitial}>{RS.getString('INITIAL')}</span>
                    </div>
                );

                break;
            }
            case SCHEDULE_STATUS.INPROGRESS: {
                return _.map(['numberOfError', 'numberOfMissing', 'numberOfUnpublish'], (field, index) => {
                    if (schedule[field] && schedule[field] != 0) {
                        return (
                            <div className="cell-status-stat schedule__status" key={index}>
                                <span className={'number ' + this.getClassName(field).classNameOfNumber}>{schedule[field] || 0}</span>
                                <div className={"status " + this.getClassName(field).className}>{RS.getString(this.getClassName(field).statusStr)}</div>
                            </div>
                        );
                    }
                });

                break;
            }
            // case SCHEDULE_STATUS.DONE: {
            //     return (
            //         <div className="cell-status-stat schedule__status">
            //             <span className="status status-done">{RS.getString('DONE')}</span>
            //         </div>
            //     );

            //     break;
            // }
            default: {
                return null;
            }
        }
    }

    renderSchedule(schedule, columns) {
        return (
            <tr
                key={schedule.scheduleId}
                onClick={this.handleEdit.bind(this, schedule)}
            >
                {
                    <td >
                        {schedule.scheduleName}
                    </td>
                }
                {
                    columns['contractId'].show &&
                    <td >
                        {schedule.contractIdentifier}
                    </td>
                }
                {
                    <td >
                        {schedule.location}
                    </td>
                }
                {
                    <td >
                        {schedule.flexiableName}
                    </td>
                }
                {
                    columns['startDate'].show &&
                    <td >
                        {schedule.startDate ? dateHelper.formatTimeWithPattern(schedule.startDate, TIMEFORMAT.CONTRACT_DATETIME) : ''}
                    </td>
                }
                {
                    columns['endDate'].show &&
                    <td >
                        {schedule.endDate ? dateHelper.formatTimeWithPattern(schedule.endDate, TIMEFORMAT.CONTRACT_DATETIME) : ''}
                    </td>
                }
                {
                    <td className="group-status-stat status-cell">
                        {
                            this.renderStatus(schedule)
                        }
                    </td>
                }
            </tr>
        );
    }

    optionsDefault() {
        return [
            { name: RS.getString("CUSTOMER"), value: "customer" },
            { name: RS.getString("LOCATION"), value: "location" }
        ];
    }

    handleOpenFilter() {
        this.setState({
            isOpenFilter: true
        });
        this.handleGetData();
    }

    handleFilterChange(field, data) {
        this.setState({
            filter: {
                ...this.state.filter,
                [field]: data
            }
        });
    }

    handleApplyFilter() {
        this.setState({
            isOpenFilter: false,
            filter: this.state.filter
        });

        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);

        apiHelper.handleFilterParamsChange(URL.SCHEDULES, this.queryString);
        loadAllSchedules(this.queryString, this.handleCallbackAction.bind(this, actionTypes.LOAD_SCHEDULES));
    }

    handleResetFilter() {
        this.setState({
            filter: {}
        });
    }

    handleCloseFilter() {
        this.setState({
            isOpenFilter: false
        });

        this.filterSearch.handleCloseFilter();
    }

    handleSortClick(index, columnNameInput, directionInput) {
        let columnName = "";

        switch (columnNameInput) {
            case "scheduleStatus": {
                columnName = "status";
                break;
            }
            default:
                return null;
        }

        this.queryString.order_by = columnName;
        this.queryString.is_desc = directionInput != 1;
        this.queryString.page = 0;
        apiHelper.handleFilterParamsChange(URL.SCHEDULES, this.queryString);
        loadAllSchedules(this.queryString, this.handleCallbackAction.bind(this, actionTypes.LOAD_SCHEDULES));
    }

    handleChangeDateRange(value) {
        this.setState({
            filter: {
                ...this.state.filter,
                ['dateRange']: value
            }
        }, () => {
            this.handleApplyFilter();
        });
    }

    renderDefaultFilter(filter) {
        let component = null;

        switch (filter.value) {
            case "customer": {
                component = (
                    <CommonSelect
                        multi={true}
                        options={this.props.customers}
                        propertyItem={{ label: 'customerName', value: 'id' }}
                        allowOptionAll={true}
                        optionAllText={RS.getString("ALL")}
                        value={this.state.filter.customer}
                        onChange={value => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                );
                break;
            }
            case "location": {
                component = (
                    <CommonSelect
                        multi={true}
                        options={this.props.locations}
                        propertyItem={{ label: 'name', value: 'id' }}
                        allowOptionAll={true}
                        optionAllText={RS.getString("ALL")}
                        value={this.state.filter.location}
                        onChange={value => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                );
                break;
            }
            default:
                break;
        }

        return React.cloneElement(component, {
            title: filter.name,
            field: filter.value,
            key: filter.name
        });
    }

    handleSaveSchedule = (schedule) => {
        addSchedule(schedule, this.handleCallbackAction.bind(this, actionTypes.ADD_SCHEDULE));
        this.isSaveAndContinue = false;
    }

    handleSaveContinueSchedule = (schedule) => {
        addSchedule(schedule, this.handleCallbackAction.bind(this, actionTypes.ADD_SCHEDULE));
        this.isSaveAndContinue = true;
    }

    handleCallbackAction(type, error, data) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (error) {
            toastr.error(error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
        else {
            switch (type) {
                case actionTypes.ADD_SCHEDULE:
                    toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                    if (!this.isSaveAndContinue) {
                        loadAllSchedules(this.queryString, this.handleCallbackAction.bind(this, actionTypes.LOAD_SCHEDULES));
                        LoadingIndicatorActions.showAppLoadingIndicator();
                    } else {
                        browserHistory.push(getUrlPath(URL.SCHEDULE, { scheduleId: data.id }))
                    }
                    break;
                case actionTypes.LOAD_SCHEDULES:
                    this.setState({
                        schedules: data.schedules,
                        meta: data.meta
                    })
                default:
                    break;
            }

        }
    }

    handleOpenDialogAddSchedule() {
        loadManagedGroups(true, (err, manageGroups) => {
            if (manageGroups) {
                this.setState({
                    manageGroups
                });
            }
        });
        loadLocations({}, (err, locations) => {
            if (locations) {
                this.setState({
                    locations
                });
            }
        });
        this.setState({ isOpenDialogAddSchedule: true })
    }

    render() {
        let columns = _.keyBy(this.state.columns, 'name');
        let from = new Date(), to, dateRangeText;
        switch (this.state.filter.dateRange) {
            case SCHEDULE_OPTION_VALUE.NEXT_30_DAYS:
                to = dateHelper.addDay(from, 30);
                break;
            case SCHEDULE_OPTION_VALUE.NEXT_60_DAYS:
                to = dateHelper.addDay(from, 60);
                break;
            case SCHEDULE_OPTION_VALUE.NEXT_90_DAYS:
                to = dateHelper.addDay(from, 90);
                break;
        }
        if (to) {
            dateRangeText = `${RS.getString('STATUS_OF')} ${dateHelper.formatTimeWithPattern(from, DATETIME.MONTH_AND_DATE)} - ${dateHelper.formatTimeWithPattern(to, DATETIME.DATE)}`;
        } else {
            dateRangeText = RS.getString('STATUS_OF_ALL');
        }

        return (
            <div className="page-container page-employees schedules">
                <div className="header">
                    {RS.getString('SCHEDULES')}
                </div>
                <div className="row col-md-2">
                    <CommonSelect
                        optionAllText={RS.getString("ALL")}
                        allowOptionAll={true}
                        options={getSchedulesDateRangeOptions()}
                        value={this.state.filter.dateRange}
                        onChange={option => this.handleChangeDateRange(option ? option.value : undefined)}
                    />
                </div>
                <div className="row row-header">
                    <div className="employees-actions-group">
                        <FilterSearch
                            ref={filterSearch => (this.filterSearch = filterSearch)}
                            handleSearchChange={this.handleSearch}
                            placeholder={RS.getString("SEARCH_SCHEDULE")}
                        >
                            <FilterModal
                                ref={filterModal => (this.filterModal = filterModal)}
                                isOpen={this.state.isOpenFilter}
                                handleOpenFilter={this.handleOpenFilter}
                                handleApplyFilter={this.handleApplyFilter}
                                handleResetFilter={this.handleResetFilter}
                                handleCloseFilter={this.handleCloseFilter}
                                blockSize="col-lg-6"
                                size="md-small"
                            >
                                {_.map(this.optionsDefault(), option =>
                                    this.renderDefaultFilter(option)
                                )}
                            </FilterModal>
                        </FilterSearch>
                        <ShowHideColumn
                            columns={this.state.columns}
                            onChange={this.handleShowHideColumns}
                        />
                        <RaisedButton
                            label={RS.getString('NEW_SCHEDULE')}
                            onClick={() => this.handleOpenDialogAddSchedule()}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader
                                name={"scheduleName"}
                            >
                                {RS.getString('SCHEDULE_NAME')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"contractId"}
                                show={columns['contractId'].show}
                            >
                                {RS.getString('CONTRACT_ID')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"location"}
                            >
                                {RS.getString('LOCATION')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"flexibleWT"}
                            >
                                {RS.getString('FLEXIBLE_WORKING_TIME')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"startDate"}
                                show={columns['startDate'].show}
                            >
                                {RS.getString('START_DATE')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"endDate"}
                                show={columns['endDate'].show}
                            >
                                {RS.getString('END_DATE')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={"scheduleStatus"}
                            >
                                {dateRangeText}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            _.map(this.state.schedules, schedule => {
                                if (schedule.status != SCHEDULE_STATUS.DONE)
                                    return this.renderSchedule(schedule, columns);
                            })
                        }
                    </tbody>
                </table>
                <div className="pull-right">
                    {
                        this.state.meta.count > this.queryString.page_size ?
                            <Pagination
                                firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                activePage={this.queryString.page + 1}
                                itemsCountPerPage={this.queryString.page_size}
                                totalItemsCount={this.state.meta.count}
                                onChange={this.handlePageClick}
                            /> : undefined
                    }

                </div>
                <DialogAddSchedule
                    isOpen={this.state.isOpenDialogAddSchedule}
                    title={RS.getString("NEW_SCHEDULE", null, Option.UPPER)}
                    handleClose={() => { this.setState({ isOpenDialogAddSchedule: false }); }}
                    locations={this.state.locations}
                    manageGroups={this.state.manageGroups}
                    handleSave={this.handleSaveSchedule}
                    handleSaveContinue={this.handleSaveContinueSchedule}
                    curEmp={this.props.curEmp}
                />
            </div>
        )
    }
}
Schedules.propTypes = propTypes;
export default Schedules;


