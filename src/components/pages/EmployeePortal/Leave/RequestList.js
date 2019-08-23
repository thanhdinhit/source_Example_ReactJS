import React, { PropTypes } from 'react';
import _ from 'lodash';

import RaisedButton from '../../../elements/RaisedButton';
import Breadcrumb from '../../../elements/Breadcrumb';
import { browserHistory } from 'react-router';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import Pagination from '../../../elements/Paginate/Pagination'
import * as toastr from '../../../../utils/toastr';
import RIGHTS from '../../../../constants/rights';
import { STATUS, WAITING_TIME, FILTER_DATE, LEAVE_ACTION_TYPE, QUERY_STRING, LEAVE_TYPES } from '../../../../core/common/constants';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import FilterModal from '../../../elements/Filter/FilterModal';
import CommonSelect from '../../../elements/CommonSelect.component';
import debounceHelper from '../../../../utils/debounceHelper';
import dateHelper from '../../../../utils/dateHelper'
import * as apiHelper from '../../../../utils/apiHelper'
import FilterDateTime from '../../../elements/Filter/FilterDateTime';
import DialogViewEmployeeLeaveDetail from './DialogViewEmployeeLeaveDetail';
import DialogLeaveActions from './DialogLeaveActions';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as jobRoleSettingActions from '../../../../actionsv2/jobRoleSettingActions';
import * as leaveActions from '../../../../actionsv2/leaveActions';

const propTypes = {
    globalAction: PropTypes.object,
    leaveActions: PropTypes.object
};
const redirect = getUrlPath(URL.TEAM_LEAVES);
class RequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenLeaveDetail: false,
            isOpenFilterEmployeeLeaves: false,
            filterEmployeeLeaves: {
                filterSearch: '',
                prefilter: {},
                filter: {
                    status: { name: STATUS.PENDING, value: STATUS.PENDING }
                },
            },
            isOpenDialogLeaveAction: false,
            actionLeaveType: null
        };
        this.queryString = {
            order_by: 'createdDate',
            is_desc: true,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0
        };
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterEmployeeLeaves.filter);
        this.leaveSelected = null;
        if (!_.isEmpty(props.queryString)) this.queryString = _.cloneDeep(props.queryString);
        if (!_.isEmpty(props.filter)) this.state.filterEmployeeLeaves = _.cloneDeep(props.filter);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOpenFilterEmployeeLeaves = this.handleOpenFilterEmployeeLeaves.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleClickLeaveAction = this.handleClickLeaveAction.bind(this);
        this.handleApproveLeave = this.handleApproveLeave.bind(this);
        this.handleSendLeaveAction = this.handleSendLeaveAction.bind(this);
        this.handleFilterStatus = this.handleFilterStatus.bind(this);
        this.handleCallbackAction = this.handleCallbackAction.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterEmployeeLeaves));
            this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)
        }, WAITING_TIME);
    }

    handleCallbackAction(err, result, meta, field) {
        if (err) {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            this.setState({
                isOpenLeaveDetail: false,
                isOpenDialogLeaveAction: false
            });
            LoadingIndicatorActions.hideAppLoadingIndicator();
            return;
        }
        switch (field) {
            case 'employeeLeaves':
                this.setState({ employeeLeaves: result, meta: meta }, LoadingIndicatorActions.hideAppLoadingIndicator);
                break;
            case 'leave':
                this.setState({ leave: result }, LoadingIndicatorActions.hideAppLoadingIndicator);
                break;
            case 'jobRoles':
                this.setState({ jobRoles: result });
                break;
            case 'leaveTypes':
                this.setState({ leaveTypes: result });
                break;
            case 'updatedLeave':
                this.setState({ leave: {}, isOpenDialogLeaveAction: false });
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
        }
    }

    handlePageClick(page) {
        this.queryString.page = page - 1;
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)

    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page = 0;
        this.queryString.page_size = pageSize;
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)
    }
    handleSearch(value) {
        this.queryString.name = value;
        this.setState({
            filterEmployeeLeaves: {
                ...this.state.filterEmployeeLeaves,
                filterSearch: value
            }
        })
        this.handleSearchCallback(value);

    }
    renderActions(leave) {
        switch (leave.leaveStatus) {
            case STATUS.PENDING:
                return (
                    <span>
                        <i
                            onClick={this.handleApproveLeave.bind(this, leave)}
                            className="icon-approve"
                            data-toggle="tooltip"
                            title={RS.getString('P124')}
                        />
                        <i
                            onClick={this.handleClickLeaveAction.bind(this, LEAVE_ACTION_TYPE.DECLINE, leave)}
                            className="icon-decline"
                            data-toggle="tooltip"
                            title={RS.getString('P125')}
                        />
                    </span>
                );
            case STATUS.APPROVED:
                return (
                    <i
                        onClick={this.handleClickLeaveAction.bind(this, LEAVE_ACTION_TYPE.CANCEL_EMPLOYEE_LEAVE, leave)}
                        className="icon-close"
                        data-toggle="tooltip"
                        title={RS.getString('P120')}
                    />
                );
            case STATUS.CANCELED:
            case STATUS.DECLINED:
                return null;
        }
    }

    // filter
    handleOpenFilterEmployeeLeaves() {
        this.setState({ isOpenFilterEmployeeLeaves: true });
        this.handleGetData();
    }
    handleGetData() {
        setTimeout(() => {
            jobRoleSettingActions.loadJobRolesSetting({}, (err, result) => this.handleCallbackAction(err, result, null, 'jobRoles'));
            leaveActions.loadLeaveTypes((err, result) => this.handleCallbackAction(err, result, null, 'leaveTypes'));
        }, 0);
    }
    handleCloseFilter() {
        this.setState({
            isOpenFilterEmployeeLeaves: false,
            filterEmployeeLeaves: {
                ...this.state.filterEmployeeLeaves,
                filter: this.state.filterEmployeeLeaves.prefilter,
                filterMore: this.state.filterEmployeeLeaves.prefilterMore
            }
        })
        this.filterSearch.handleCloseFilter();
    }
    handleResetFilter() {
        this.setState({
            filterEmployeeLeaves: {
                prefilter: {},
                filter: {},
            }
        });
    }
    handleApplyFilter() {
        this.setState({
            isOpenFilterEmployeeLeaves: false,
            filterEmployeeLeaves: {
                ...this.state.filterEmployeeLeaves,
                prefilter: this.state.filterEmployeeLeaves.filter,
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterEmployeeLeaves));
        });
        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterEmployeeLeaves.filter);
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }
    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.jobRoleIds = apiHelper.getQueryStringListParams(filter.jobRole);
        query.startDate = dateHelper.convertDateToQueryString(filter.startDate);
        query.endDate = dateHelper.convertDateToQueryString(filter.endDate);
        query.leaveType = apiHelper.getQueryStringListParams(filter.leaveType);
        query.leaveStatus = apiHelper.getQueryStringListParams([filter.status.value]);

        return query;
    }

    handleFilterChange(field, data) {
        this.setState({
            filterEmployeeLeaves: {
                ...this.state.filterEmployeeLeaves,
                filter: {
                    ...this.state.filterEmployeeLeaves.filter,
                    [field]: data
                }
            }
        });
    }
    renderDefaultFilter(filter) {
        let component = null;
        switch (filter.value) {
            case 'jobRole': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.state.jobRoles}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterEmployeeLeaves.filter.jobRole}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
            case 'startDate': {
                component = (
                    <FilterDateTime
                        selectedValue={this.state.filterEmployeeLeaves.filter.startDate || {}}
                        onChange={this.handleFilterChange.bind(this, filter.value)}
                    />
                );
                break;
            }
            case 'endDate': {
                component = (
                    <FilterDateTime
                        selectedValue={this.state.filterEmployeeLeaves.filter.endDate || {}}
                        onChange={this.handleFilterChange.bind(this, filter.value)}
                    />
                );
                break;
            }
            case 'leaveType': {
                component = (
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'name', value: 'id' }}
                        options={this.state.leaveTypes}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterEmployeeLeaves.filter.leaveType}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
                    />
                );
                break;
            }
        }
        return React.cloneElement(component, { title: filter.name, field: filter.value, key: filter.name });
    }

    handleClickLeaveAction(actionType, leave, e) {
        e.stopPropagation();
        this.setState({
            actionLeaveType: actionType,
            isOpenDialogLeaveAction: true
        });
        this.leaveSelected = _.cloneDeep(leave);
    }

    handleSendLeaveAction(reason) {
        this.leaveSelected.commentDeclinedOrCanceled = reason;

        switch (this.state.actionLeaveType) {
            case LEAVE_ACTION_TYPE.CANCEL_EMPLOYEE_LEAVE: {
                this.leaveSelected.leaveStatus = STATUS.CANCELED;
                break;
            }
            case LEAVE_ACTION_TYPE.DECLINE: {
                this.leaveSelected.leaveStatus = STATUS.DECLINED;
                break;
            }
        }
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.updateEmployeeLeave(this.leaveSelected.id, this.leaveSelected, (err, result) => this.handleCallbackAction(err, result, null, 'updatedLeave'));
    }

    handleApproveLeave(leave, e) {
        e.stopPropagation();
        const leaveToUpdate = _.cloneDeep(leave);
        leaveToUpdate.leaveStatus = STATUS.APPROVED;
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.updateEmployeeLeave(leave.id, leaveToUpdate, (err, result) => this.handleCallbackAction(err, result, null, 'updatedLeave'));
    }

    handleOnClickLeave(leaveId) {
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeave(leaveId, (err, result) => {
            this.setState({
                isOpenLeaveDetail: true
            });
            this.handleCallbackAction(err, result, null, 'leave');
        });
    }

    handleFilterStatus(option) {
        option = option || {};
        this.setState({
            filterEmployeeLeaves: {
                ...this.state.filterEmployeeLeaves,
                filter: {
                    ...this.state.filterEmployeeLeaves.filter,
                    status: option.value
                },
                prefilter: {
                    ...
                    this.state.filterEmployeeLeaves.prefilter,
                    status: option.value
                }
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterEmployeeLeaves));
        });
        this.queryString.leaveStatus = apiHelper.getQueryStringListParams([option.value]);
        if (!option.value) {
            _.unset(this.queryString, 'leaveStatus');
        }
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'employeeLeaves'));
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
            { name: RS.getString('JOBROLE'), value: 'jobRole' },
            { name: RS.getString('START_DATE'), value: 'startDate' },
            { name: RS.getString('END_DATE'), value: 'endDate' },
            { name: RS.getString('LEAVE_TYPE'), value: 'leaveType' },
        ];
        let statusOptions = [
            { name: STATUS.PENDING },
            { name: STATUS.APPROVED },
            { name: STATUS.DECLINED },
            { name: STATUS.CANCELED }
        ]
        return (
            <div className="employee-request-list">
                <div className="filter-status">
                    <CommonSelect
                        searchable={false}
                        propertyItem={{ label: 'name', value: 'name' }}
                        options={statusOptions}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filterEmployeeLeaves.filter.status}
                        onChange={this.handleFilterStatus}
                        valueComponent={this.renderValueComponent}
                        titlePlaceHolder={RS.getString("STATUS") + ": "}
                    />
                </div>
                <div className="pull-right">
                    <FilterSearch
                        ref={(filterSearch) => this.filterSearch = filterSearch}
                        handleSearchChange={this.handleSearch}
                        defaultValue={this.state.filterEmployeeLeaves.filterSearch}
                    >
                        <FilterModal
                            ref={(filterModal) => this.filterModal = filterModal}
                            isOpen={this.state.isOpenFilterEmployeeLeaves}
                            handleOpenFilter={this.handleOpenFilterEmployeeLeaves}
                            handleApplyFilter={this.handleApplyFilter}
                            handleResetFilter={this.handleResetFilter}
                            handleCloseFilter={this.handleCloseFilter}
                        >
                            {
                                _.map(optionsDefault, (option) => this.renderDefaultFilter(option))
                            }
                        </FilterModal>
                    </FilterSearch>
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>{RS.getString("EMPLOYEE")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("START")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("END")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("LEAVE_HOURS")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("TYPE")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("STATUS")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("ACTION")}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.employeeLeaves ?
                            this.state.employeeLeaves.map(function (leave) {
                                return (
                                    <tr key={leave.id} onClick={this.handleOnClickLeave.bind(this, leave.id)}>
                                        <td className="primary-avatar-cell">
                                            <img
                                                src={leave.employee.photoUrl ? (API_FILE + leave.employee.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {leave.employee.fullName}
                                                </div>
                                                <div className="sub-label">
                                                    {leave.employee.jobRole.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={leave.leaveFrom.getTime() < (new Date()).getTime() ? 'overdue-warning' : ''}>
                                            {leave.leaveFromString}
                                        </td>
                                        <td className={leave.leaveFrom.getTime() < (new Date()).getTime() ? 'overdue-warning' : ''}>
                                            {leave.leaveToString}
                                        </td>
                                        <td>
                                            {leave.leaveHours.toFixed(1) || ""}
                                        </td>
                                        <td>
                                            {leave.leaveType.name}
                                        </td>
                                        <td>
                                            <div className={"status " + leave.leaveStatus}>
                                                {leave.leaveStatus}
                                            </div>
                                        </td>
                                        <td className="col-action">
                                            {
                                                this.renderActions(leave)
                                            }
                                        </td>
                                    </tr>
                                );

                            }.bind(this)) : []}
                    </tbody>
                </table>

                {
                    this.state.meta != null && this.state.meta.count > 0 ?
                        <div className="listing-footer">
                            <div className="pull-left">
                                <ItemsDisplayPerPage
                                    name="ItemsDisplayPerPage"
                                    value={this.queryString.page_size}
                                    totalRecord={this.state.meta.count}
                                    onChange={this.handleChangeDisplayPerPage}
                                />
                            </div>
                            {
                                this.state.meta.count > this.queryString.page_size &&
                                <div className="pull-right">
                                    <Pagination
                                        firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                        lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                        prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                        nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                        activePage={this.queryString.page + 1}
                                        itemsCountPerPage={this.queryString.page_size}
                                        totalItemsCount={this.state.meta.count}
                                        onChange={this.handlePageClick}
                                    />
                                </div>
                            }
                        </div>
                        : null
                }
                <DialogLeaveActions
                    isOpen={this.state.isOpenDialogLeaveAction}
                    handleClose={() => this.setState({ isOpenDialogLeaveAction: false })}
                    handleSubmit={this.handleSendLeaveAction}
                    actionType={this.state.actionLeaveType}
                />
                <DialogViewEmployeeLeaveDetail
                    isOpen={this.state.isOpenLeaveDetail}
                    leave={this.state.leave}
                    handleClose={() => this.setState({ isOpenLeaveDetail: false })}
                />
            </div>
        )
    }
}

RequestList.propTypes = propTypes;
export default RequestList;