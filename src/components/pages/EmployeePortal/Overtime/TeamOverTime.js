import React, { PropTypes } from 'react';
import _ from 'lodash';
import * as toastr from '../../../../utils/toastr';

import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import Pagination from '../../../elements/Paginate/Pagination';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import FilterModal from '../../../elements/Filter/FilterModal';
import CommonSelect from '../../../elements/CommonSelect.component';
import FilterDateTime from '../../../elements/Filter/FilterDateTime';
import ShowHideColumn from '../../../elements/table/ShowHideColumn';
import RaisedButton from '../../../elements/RaisedButton';
import DialogOvertimeActions from './DialogOvertimeActions';

import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import debounceHelper from '../../../../utils/debounceHelper';
import dateHelper from '../../../../utils/dateHelper';
import * as apiHelper from '../../../../utils/apiHelper';
import RIGHTS from '../../../../constants/rights';
import { STATUS, WAITING_TIME, FILTER_DATE, LEAVE_ACTION_TYPE, OVERTIME_ACTION_TYPE, getOvertimeStatusOptions, QUERY_STRING } from '../../../../core/common/constants';
import RS from '../../../../resources/resourceManager';
import { browserHistory } from 'react-router';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import { loadTeamOverTime, updateMemberOvertime } from '../../../../actionsv2/overtimeActions';
import { loadLocations } from '../../../../actionsv2/locationActions';
import { loadPayRateSetting } from '../../../../actionsv2/settingActions';
import * as types from '../../../../constants/actionTypes';

const propTypes = {
    globalAction: PropTypes.object,
    payload: PropTypes.object,
    onChangeQueryString: PropTypes.func,
    meta: PropTypes.object,
    curEmp: PropTypes.object,
    queryString: PropTypes.object,
    filter: PropTypes.object,
    onchangeFilter: PropTypes.func
};
const redirect = getUrlPath(URL.OVERTIME);


class TeamOverTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamOvertimes: undefined,
            isOpenLeaveDetail: false,
            isOpenFilterTeamOvertime: false,
            isOpenCancelOvertime: false,
            filterTeamOvertime: {
                filterSearch: '',
                prefilter: {
                    status: STATUS.PENDING
                },
                filter: {
                    status: STATUS.PENDING
                }
            },
            columns: this.getInitialColumns()
        };
        this.queryString = {
            is_desc: true,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0,
            order_by: 'id',
            overtimeStatus: STATUS.PENDING
        };
        this.overtimeSelected = null;

        if (!_.isEmpty(props.queryString)) this.queryString = _.cloneDeep(props.queryString);
        if (!_.isEmpty(props.filter)) this.state.filterTeamOvertime = _.cloneDeep(props.filter);

        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOpenFilterTeamOvertime = this.handleOpenFilterTeamOvertime.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
        this.handleCancelOvertimeRquest = this.handleCancelOvertimeRquest.bind(this);
        this.handleSubmitCancelOvertime = this.handleSubmitCancelOvertime.bind(this);
        this.handleFilterStatus = this.handleFilterStatus.bind(this);
        this.handleActionsCallback = this.handleActionsCallback.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterTeamOvertime));
            this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
        }, WAITING_TIME);
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.globalAction.resetState();
            loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
            this.setState({
                isOpenCancelOvertime: false
            });
        }
        if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
            toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
    }

    handlePageClick(page) {
        this.queryString.page = page - 1;
        LoadingIndicatorActions.showAppLoadingIndicator();
        loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page = 0;
        this.queryString.page_size = pageSize;
        LoadingIndicatorActions.showAppLoadingIndicator();
        loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }
    handleSearch(value) {
        this.queryString.name = value;
        this.setState({
            filterTeamOvertime: {
                ...this.state.filterTeamOvertime,
                filterSearch: value
            }
        });
        this.handleSearchCallback(value);
    }
    renderActions(overtime) {
        switch (overtime.overtimeStatus) {
            case STATUS.ACCEPTED:
            case STATUS.PENDING:
                return (
                    <span>
                        <i
                            onClick={this.handleCancelOvertimeRquest.bind(this, overtime)}
                            className="icon-close"
                            data-toggle="tooltip"
                            title={RS.getString('P125')}
                        />
                    </span>
                );
            case STATUS.CANCELED:
            case STATUS.DECLINED:
                return null;
        }
    }

    // filter
    handleOpenFilterTeamOvertime() {
        this.setState({ isOpenFilterTeamOvertime: true });
        this.handleGetData();
    }
    handleGetData() {
        setTimeout(() => {
            loadPayRateSetting({}, this.handleActionsCallback.bind(this, types.LOAD_PAY_RATE_SETTING));
            loadLocations({}, this.handleActionsCallback.bind(this, types.LOAD_LOCATIONS_SETTING));
        }, 0);
    }
    handleCloseFilter() {
        this.setState({
            isOpenFilterTeamOvertime: false,
            filterTeamOvertime: {
                ...this.state.filterTeamOvertime,
                filter: this.state.filterTeamOvertime.prefilter,
                filterMore: this.state.filterTeamOvertime.prefilterMore
            }
        });
        this.filterSearch.handleCloseFilter();
    }
    handleResetFilter() {
        this.setState({
            filterTeamOvertime: {
                prefilter: {},
                filter: {},
            }
        });
    }

    handleActionsCallback(type, err, result) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (result) {
            switch (type) {
                case types.LOAD_TEAM_OVERTIME:
                    this.setState({
                        teamOvertimes: result
                    }); break;
                case types.LOAD_LOCATION_SETTING:
                    this.setState({
                        locations: result
                    }); break;
                case types.LOAD_PAY_RATE_SETTING:
                    this.setState({
                        payRateSetting: result
                    });
            }
        }
        else {
            toastr.error(err.message, RS.getString('ERROR'));
        }
    }

    handleApplyFilter() {
        this.setState({
            isOpenFilterTeamOvertime: false,
            filterTeamOvertime: {
                ...this.state.filterTeamOvertime,
                prefilter: this.state.filterTeamOvertime.filter
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterTeamOvertime));
        });
        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterTeamOvertime.filter);
        LoadingIndicatorActions.showAppLoadingIndicator();
        loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }
    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.locationIds = apiHelper.getQueryStringListParams(filter.location);
        query.overtimeStatus = filter.status;
        query.startDate = dateHelper.convertDateToQueryString(filter.startDate);
        query.endDate = dateHelper.convertDateToQueryString(filter.endDate);
        query.payRateIds = apiHelper.getQueryStringListParams(filter.payRate);

        return query;
    }

    handleFilterChange(field, data) {
        this.setState({
            filterTeamOvertime: {
                ...this.state.filterTeamOvertime,
                filter: {
                    ...this.state.filterTeamOvertime.filter,
                    [field]: data
                }
            }
        });
    }
    renderDefaultFilter(filter) {
        let component = null;
        switch (filter.value) {
            case 'location': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.state.locations}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterTeamOvertime.filter.location}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
            case 'startDate': {
                component = (
                    <FilterDateTime
                        selectedValue={this.state.filterTeamOvertime.filter.startDate || {}}
                        onChange={this.handleFilterChange.bind(this, filter.value)}
                    />
                );
                break;
            }
            case 'endDate': {
                component = (
                    <FilterDateTime
                        selectedValue={this.state.filterTeamOvertime.filter.endDate || {}}
                        onChange={this.handleFilterChange.bind(this, filter.value)}
                    />
                );
                break;
            }
            case 'payRate': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.state.payRateSetting}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterTeamOvertime.filter.payRate}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
        }
        return React.cloneElement(component, { title: filter.name, field: filter.value, key: filter.name });
    }

    getInitialColumns() {
        return [{
            name: 'fullName',
            label: RS.getString('EMPLOYEE'),
            show: true
        }, {
            name: 'start',
            label: RS.getString('START'),
            show: true
        }, {
            name: 'end',
            label: RS.getString('END'),
            show: true
        }, {
            name: 'location',
            label: RS.getString('LOCATION'),
            show: true
        }, {
            name: 'requestedBy',
            label: RS.getString('REQUESTED_BY'),
            show: false
        }, {
            name: 'payRate',
            label: RS.getString('PAY_RATE'),
            show: false
        }, {
            name: 'comment',
            label: RS.getString('COMMENT'),
            show: false
        }, {
            name: 'status',
            label: RS.getString('STATUS'),
            show: true
        }, {
            name: 'contractId',
            label: RS.getString('CONTRACT_ID'),
            show: false
        }];
    }
    handleShowHideColumns(columns) {
        this.setState({ columns });
    }
    handleCancelOvertimeRquest(overtime, e) {
        e.stopPropagation();
        this.setState({
            isOpenCancelOvertime: true
        });
        this.overtimeSelected = _.cloneDeep(overtime);
    }
    handleSubmitCancelOvertime(reason) {
        this.overtimeSelected.commentDeclinedOrCanceled = reason;
        this.overtimeSelected.overtimeStatus = STATUS.CANCELED;
        LoadingIndicatorActions.showAppLoadingIndicator();
        updateMemberOvertime(this.overtimeSelected.id, this.overtimeSelected, this.handleActionsCallback);
    }

    handleFilterStatus(option) {
        option = option || {};
        this.setState({
            filterTeamOvertime: {
                ...this.state.filterTeamOvertime,
                filter: {
                    ...this.state.filterTeamOvertime.filter,
                    status: option.value
                },
                prefilter: {
                    ...
                    this.state.filterTeamOvertime.prefilter,
                    status: option.value
                }
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterTeamOvertime));
        });
        this.queryString.overtimeStatus = option.value;
        if (!option.value) {
            _.unset(this.queryString, 'overtimeStatus');
        }
        LoadingIndicatorActions.showAppLoadingIndicator();
        loadTeamOverTime(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_TEAM_OVERTIME));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {RS.getString('STATUS')}: </span>
                    {option.value.label}
                </span>
            </div>
        )
    }

    render() {
        let optionsDefault = [
            { name: RS.getString('LOCATION'), value: 'location' },
            { name: RS.getString('START_DATE'), value: 'startDate' },
            { name: RS.getString('END_DATE'), value: 'endDate' },
            { name: RS.getString('TYPE'), value: 'payRate' }
        ];
        let columns = _.keyBy(this.state.columns, 'name');
        return (
            <div className="team-overtime">
                <div className="filter-status">
                    <CommonSelect
                        options={getOvertimeStatusOptions()}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterTeamOvertime.filter.status}
                        onChange={this.handleFilterStatus}
                        valueComponent={this.renderValueComponent}
                        titlePlaceHolder={RS.getString("STATUS") + ": "}
                    />
                </div>
                <div className="pull-right">
                    <FilterSearch
                        ref={(filterSearch) => this.filterSearch = filterSearch}
                        handleSearchChange={this.handleSearch}
                        defaultValue={this.state.filterTeamOvertime.filterSearch}
                    >
                        <FilterModal
                            ref={(filterModal) => this.filterModal = filterModal}
                            isOpen={this.state.isOpenFilterTeamOvertime}
                            handleOpenFilter={this.handleOpenFilterTeamOvertime}
                            handleApplyFilter={this.handleApplyFilter}
                            handleResetFilter={this.handleResetFilter}
                            handleCloseFilter={this.handleCloseFilter}
                        >
                            {
                                _.map(optionsDefault, (option) => this.renderDefaultFilter(option))
                            }
                        </FilterModal>
                    </FilterSearch>
                    <ShowHideColumn
                        columns={this.state.columns}
                        onChange={this.handleShowHideColumns}
                    />
                    {
                        this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_OVERTIME) ?
                            <RaisedButton
                                label={RS.getString('NEW_OVERTIME', null, Option.CAPEACHWORD)}
                                onClick={() => { browserHistory.push(getUrlPath(URL.NEW_OVERTIME)) }}
                            /> : null
                    }
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader show={columns['fullName'].show}>{RS.getString("EMPLOYEE")}</MyTableHeader>
                            <MyTableHeader show={columns['start'].show}>{RS.getString("START")}</MyTableHeader>
                            <MyTableHeader show={columns['end'].show}>{RS.getString("END")}</MyTableHeader>
                            <MyTableHeader show={columns['location'].show}>{RS.getString("LOCATION")}</MyTableHeader>
                            <MyTableHeader show={columns['requestedBy'].show}>{RS.getString("REQUESTED_BY")}</MyTableHeader>
                            <MyTableHeader show={columns['payRate'].show}>{RS.getString("PAY_RATE")}</MyTableHeader>
                            <MyTableHeader show={columns['comment'].show}>{RS.getString("COMMENT")}</MyTableHeader>
                            <MyTableHeader show={columns['status'].show}>{RS.getString("STATUS")}</MyTableHeader>
                            <MyTableHeader show={columns['contractId'].show}>{RS.getString("CONTRACT_ID")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("ACTION")}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.teamOvertimes ?
                            this.state.teamOvertimes.map(function (overtime) {
                                return (
                                    <tr key={overtime.id}>
                                        {
                                            columns['fullName'].show &&
                                            <td className="primary-avatar-cell">
                                                <img
                                                    src={overtime.employee.photoUrl ? (API_FILE + overtime.employee.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                                <div className="cell-content">
                                                    <div className="main-label">
                                                        {overtime.employee.fullName}
                                                    </div>
                                                    <div className="sub-label">
                                                        {overtime.employee.jobRole.name}
                                                    </div>
                                                </div>
                                            </td>
                                        }
                                        {
                                            columns['start'].show &&
                                            <td>
                                                {overtime.overtimeFromString}
                                            </td>
                                        }
                                        {
                                            columns['end'].show &&
                                            <td>
                                                {overtime.overtimeToString}
                                            </td>
                                        }
                                        {
                                            columns['location'].show &&
                                            <td>
                                                {overtime.location.name}
                                            </td>
                                        }
                                        {
                                            columns['requestedBy'].show &&
                                            (
                                                overtime.manager ? <td className="primary-avatar-cell">
                                                    <img
                                                        src={overtime.manager.photoUrl ? (API_FILE + overtime.manager.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                                    <div className="cell-content">
                                                        <div className="main-label">
                                                            {overtime.manager.fullName}
                                                        </div>
                                                    </div>
                                                </td> : <td />
                                            )
                                        }
                                        {
                                            columns['payRate'].show &&
                                            <td>
                                                {overtime.payRate.name}
                                            </td>
                                        }
                                        {
                                            columns['comment'].show &&
                                            <td>
                                                {overtime.comment}
                                            </td>
                                        }
                                        {
                                            columns['status'].show &&
                                            <td>
                                                <div className={"status " + overtime.overtimeStatus}>
                                                    {overtime.overtimeStatus}
                                                </div>
                                            </td>
                                        }
                                        {
                                            columns['contractId'].show &&
                                            <td>
                                                {overtime.contract || ''}
                                            </td>
                                        }
                                        <td className="col-action">
                                            {
                                                this.renderActions(overtime)
                                            }
                                        </td>
                                    </tr>
                                );
                            }.bind(this)) : []}
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
                <DialogOvertimeActions
                    isOpen={this.state.isOpenCancelOvertime}
                    handleClose={() => this.setState({ isOpenCancelOvertime: false })}
                    handleSubmit={this.handleSubmitCancelOvertime}
                    actionType={OVERTIME_ACTION_TYPE.CANCEL_OVERTIME_REQUEST}
                />
            </div >
        );
    }
}

TeamOverTime.propTypes = propTypes;
export default TeamOverTime;