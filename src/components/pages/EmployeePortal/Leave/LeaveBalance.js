import React from 'react'
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import Pagination from '../../../elements/Paginate/Pagination'
import { STATUS, WAITING_TIME, QUERY_STRING } from '../../../../core/common/constants';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import CommonSelect from '../../../elements/CommonSelect.component';
import debounceHelper from '../../../../utils/debounceHelper';
import * as apiHelper from '../../../../utils/apiHelper'
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import ShowHideColumn from '../../../elements/table/ShowHideColumn';
import * as toastr from '../../../../utils/toastr'
import * as groupActions from '../../../../actionsv2/groupActions';
import * as leaveActions from '../../../../actionsv2/leaveActions';
import { LOAD_EMPLOYEE_LEAVE_BALANCES, LOAD_ALL_GROUP } from '../../../../constants/actionTypes';

class LeaveBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeLeaveBalances:[],
            meta: {},
            filterLeaveBalance: {
                filterSearch: '',
                filter: {}
            },
            columns: this.getInitialColumns()
        }
        this.queryString = {
            order_by: 'createdDate',
            is_desc: true,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0
        }
        let date = new Date();
        this.queryString.year = date.getFullYear();
        this.listSortActions = [
            { id: 'SortBy_First_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'FIRST_NAME']) },
            { id: 'SortBy_Last_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'LAST_NAME']) }
        ]

        if (!_.isEmpty(props.queryString)) this.queryString = props.queryString
        if (!_.isEmpty(props.filter)) this.state.filterLeaveBalance = _.cloneDeep(props.filter);
        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilterGroup = this.handleFilterGroup.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
        this.loadEmployeeLeaveBalances = this.loadEmployeeLeaveBalances.bind(this);
    }

    componentDidMount() {
        groupActions.loadAllGroup({}, (err, result) => this.handleCallbackAction(err, result, null, LOAD_ALL_GROUP));
        this.loadEmployeeLeaveBalances();
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            this.loadEmployeeLeaveBalances();
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterLeaveBalance));
            this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)
        }, WAITING_TIME);
    }

    handleCallbackAction(err, result, meta, field) {
        if (err) {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            LoadingIndicatorActions.hideAppLoadingIndicator();
            return;
        }
        switch (field) {
            case LOAD_EMPLOYEE_LEAVE_BALANCES:
                this.setState({ employeeLeaveBalances: result, meta: meta }, LoadingIndicatorActions.hideAppLoadingIndicator);
                break;
            case LOAD_ALL_GROUP:
                this.setState({ groups: result });
        }
    }

    getInitialColumns() {
        return [{
            name: 'group',
            label: RS.getString('GROUP'),
            show: false
        }, {
            name: 'employeeId',
            label: RS.getString('EMPLOYEE_ID'),
            show: false
        },]
    }

    loadEmployeeLeaveBalances() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        leaveActions.loadEmployeeLeaveBalances(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, LOAD_EMPLOYEE_LEAVE_BALANCES));
    }

    handleShowHideColumns(columns) {
        this.setState({ columns });
    }
    handlePageClick(page) {
        this.queryString.page = page - 1;
        this.loadEmployeeLeaveBalances();
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)

    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page = 0;
        this.queryString.page_size = pageSize;
        this.loadEmployeeLeaveBalances();
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString)

    }
    handleSearch(value) {
        this.queryString.name = value;
        this.setState({
            filterLeaveBalance: {
                ...this.state.filterLeaveBalance,
                filterSearch: value
            }
        })
        this.handleSearchCallback(value);
    }

    renderActions(leaveStatus) {
        switch (leaveStatus) {
            case STATUS.PENDING:
                return (
                    <span>
                        <i className="icon-decline" data-toggle="tooltip" title={RS.getString('P120')}></i>
                        <i className="icon-approve" data-toggle="tooltip" title={RS.getString('P120')}></i>
                    </span>
                )
                break;
            case STATUS.APPROVED:
                return (
                    <i className="icon-close" data-toggle="tooltip" title={RS.getString('P120')}></i>
                )
                break;
            case STATUS.CANCELED:
            case STATUS.DECLINED:
                return null;
                break;
        }
    }
    handleFilterGroup(option) {
        option = option || {};
        this.setState({
            filterLeaveBalance: {
                ...this.state.filterLeaveBalance,
                filter: {
                    ...this.state.filterLeaveBalance.filter,
                    group: option.value
                }
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filterLeaveBalance));
        });
        this.queryString.groupIds = apiHelper.getQueryStringListParams([option.value]);
        if (!option.value) {
            _.unset(this.queryString, 'groupIds');
        }
        this.loadEmployeeLeaveBalances();
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleSortClick(index, columnNameInput, directionInput) {
        let columnName = '';
        switch (columnNameInput) {
            case 'SortBy_First_Name':
                columnName = 'employee.firstName';
                break;
            case 'SortBy_Last_Name':
                columnName = 'employee.lastName';
                break;
        }
        if (columnName === '')
            return null;
        this.queryString.order_by = columnName;
        this.queryString.is_desc = directionInput != 1;
        this.queryString.page = 0;
        this.loadEmployeeLeaveBalances();
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {RS.getString('GROUP')}: </span>
                    {option.value.label}
                </span>
            </div>
        )
    }

    // filter
    render() {
        let columns = _.keyBy(this.state.columns, 'name');
        return (
            <div className="employee-leave-balance">
                <div className="row-header">
                    <div className="filter-status">
                        <CommonSelect
                            propertyItem={{ label: 'name', value: 'id' }}
                            options={this.state.groups}
                            allowOptionAll={true}
                            optionAllText={RS.getString('ALL')}
                            value={this.state.filterLeaveBalance.filter.group}
                            onChange={this.handleFilterGroup}
                            titlePlaceHolder={RS.getString("GROUP") + ": "}
                            valueComponent={this.renderValueComponent}
                            matchProp = "label"
                        />
                    </div>
                    <div className="employees-actions-group">
                        <FilterSearch
                            ref={(filterSearch) => this.filterSearch = filterSearch}
                            handleSearchChange={this.handleSearch}
                            defaultValue={this.state.filterLeaveBalance.filterSearch}
                        />
                        <ShowHideColumn
                            columns={this.state.columns}
                            onChange={this.handleShowHideColumns}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader
                                show={columns['group'].show}
                            >
                                {RS.getString("GROUP")}
                            </MyTableHeader>
                            <MyTableHeader
                                enableSort
                                listActions={this.listSortActions}
                            >
                                {RS.getString("EMPLOYEE")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['employeeId'].show}
                            >{RS.getString("EMPLOYEE_ID")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("ANNUAL_LEAVE_HOUR")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("SICK_LEAVE_HOUR")}</MyTableHeader>
                            <MyTableHeader>{RS.getString("LONG_SERVICE_LEAVE_HOUR")}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.employeeLeaveBalances ?
                            this.state.employeeLeaveBalances.map(function (leaveBalance) {
                                return (
                                    <tr key={leaveBalance.id}>
                                        {
                                            columns['group'].show &&
                                            <td>{_.get(leaveBalance.employee, "group.name")}</td>
                                        }

                                        <td className="primary-avatar-cell">
                                            <img
                                                src={leaveBalance.employee.photoUrl ? (API_FILE + leaveBalance.employee.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {leaveBalance.employee.fullName}
                                                </div>
                                                <div className="sub-label">
                                                    {leaveBalance.employee.jobRole.name}
                                                </div>
                                            </div>
                                        </td>
                                        {
                                            columns['employeeId'].show &&
                                            <td>
                                                {leaveBalance.employeeId}
                                            </td>
                                        }
                                        <td>
                                            {leaveBalance.annualLeave ? leaveBalance.annualLeave.toFixed(1) : '0.0'}
                                        </td>
                                        <td>
                                            {leaveBalance.sickLeave ? leaveBalance.sickLeave.toFixed(1) : '0.0'}
                                        </td>
                                        <td>
                                            {leaveBalance.longServiceLeave ?
                                                leaveBalance.longServiceLeave.toFixed(1) : '0.0'}
                                        </td>
                                    </tr>
                                );

                            }.bind(this)) : []}
                    </tbody>
                </table>

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

            </div>
        )
    }
}

export default LeaveBalance;