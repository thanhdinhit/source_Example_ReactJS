import React from 'react';
import RaisedButton from '../../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import * as toastr from '../../../../utils/toastr';
import { QUERY_STRING, WAITING_TIME } from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import RIGHTS from '../../../../constants/rights';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import _ from 'lodash';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import Pagination from '../../../elements/Paginate/Pagination';
import debounceHelper from '../../../../utils/debounceHelper';
import CommonSelect from '../../../elements/CommonSelect.component';
import * as apiHelper from '../../../../utils/apiHelper';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { LOAD_ALL_CUSTOMER, LOAD_ALL_SUPERVISOR } from '../../../../constants/actionTypes';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as customerActions from '../../../../actionsv2/customerActions';
import * as groupActions from '../../../../actionsv2/groupActions';

class Customers extends React.Component {
    constructor(props) {
        super(props)
        let { query } = this.props.location;
        this.state = {
            customers: [],
            meta: {},
            filter: this.getFilterFromUrl()
        }
        this.queryString = {
            order_by: query.order_by ? query.order_by : 'customerName',
            is_desc: query.is_desc == 'true' ? true : false,
            page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
            page: parseInt(query.page) ? parseInt(query.page) : 0,
        };

        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter)
        this.listSortActions = [
            { id: 'SortBy_First_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'FIRST_NAME']) },
            { id: 'SortBy_Last_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'LAST_NAME']) }
        ]
        this.handleSortClick = this.handleSortClick.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.loadCustomers = this.loadCustomers.bind(this)
        this.handleCallbackAction = this.handleCallbackAction.bind(this);
    }
    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        groupActions.loadSupervisors((err, result) => {
            this.handleCallbackAction(err, result, null, LOAD_ALL_SUPERVISOR);
            this.loadCustomers();
        });
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            apiHelper.handleFilterParamsChange(URL.CUSTOMERS, this.queryString);
            this.loadCustomers();
        }, WAITING_TIME);
    }
    loadCustomers() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        customerActions.loadCustomers(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, LOAD_ALL_CUSTOMER));
    }
    handleCallbackAction(err, result, meta, field) {
        if (err) {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            LoadingIndicatorActions.hideAppLoadingIndicator();
            return;
        }
        switch (field) {
            case LOAD_ALL_CUSTOMER:
                this.setState({ customers: result, meta: meta }, LoadingIndicatorActions.hideAppLoadingIndicator);
                break;
            case LOAD_ALL_SUPERVISOR:
                this.setState({ supervisors: result });
        }
    }
    handleSortClick(index, columnNameInput, directionInput) {
        switch (columnNameInput) {
            case 'SortBy_First_Name':
                columnNameInput = 'supervisor.firstName';
                break;
            case 'SortBy_Last_Name':
                columnNameInput = 'supervisor.lastName';
                break;
        }
        this.queryString.order_by = columnNameInput;
        this.queryString.is_desc = directionInput != 1;
        this.queryString.page = 0;
        apiHelper.handleFilterParamsChange(URL.CUSTOMERS, this.queryString);
        this.loadCustomers();
    }
    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.customerName = filter.supervisor;
        query.supervisorIds = apiHelper.getQueryStringListParams(filter.supervisorIds);

        return query;
    }
    handleSearch(value) {
        this.queryString.customerName = value;
        this.setState({
            filter: {
                ...this.state.filter,
                customerName: value
            }
        })
        this.handleSearchCallback(value);
    }
    handleFilterChange(supervisorIds) {
        this.setState({
            filter: {
                ...this.state.filter,
                supervisorIds: supervisorIds
            }
        }, () => {
            this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
            apiHelper.handleFilterParamsChange(URL.CUSTOMERS, this.queryString);
            this.loadCustomers();
        })
    }
    getFilterFromUrl() {
        let { query } = this.props.location;
        let filter = {
            customerName: query.customerName,
            supervisorIds: apiHelper.convertQueryStringToList(query.supervisorIds),
        }
        return filter;
    }
    handlePageClick(page) {
        this.queryString.page = page - 1;
        apiHelper.handleFilterParamsChange(URL.CUSTOMERS, this.queryString);
        this.loadCustomers();
    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page_size = pageSize;
        this.queryString.page = 0;
        apiHelper.handleFilterParamsChange(URL.CUSTOMERS, this.queryString);
        this.loadCustomers();
      }

    openAddCustomer() {
        browserHistory.push(getUrlPath(URL.NEW_CUSTOMER));
    }
    render() {
        return (
            <div className="page-container customers">
                <div className="header">
                    {RS.getString('CUSTOMERS')}
                </div>
                <div className="row col-md-3">
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'fullName', value: 'id' }}
                        options={this.state.supervisors}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.supervisorIds}
                        onChange={(value) => this.handleFilterChange(_.map(value, 'id'))}
                        titleValue={RS.getString("MANAGED_BY") + ": "}
                        titlePlaceHolder={RS.getString("MANAGED_BY") + ": "}
                    />
                </div>
                <div className="row row-header">
                    <div className="customers-actions-group">
                        <FilterSearch
                            ref={(filterSearch) => this.filterSearch = filterSearch}
                            handleSearchChange={this.handleSearch}
                            defaultValue={this.state.filter.customerName}
                            placeholder={RS.getString("W2", ["SEARCH", "CUSTOMER"])}
                        >
                        </FilterSearch>
                        <RaisedButton
                            label={RS.getString('NEW_CUSTOMER', null, Option.CAPEACHWORD)}
                            onClick={this.openAddCustomer}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader
                                name={'customerName'}
                                enableSort
                            >
                                {RS.getString('CUSTOMER_NAME', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('CONTACT_NAME', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('MOBILE_PHONE', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('EMAIL', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader
                                name="supervisor"
                                enableSort
                                listActions={this.listSortActions}
                            >
                                {RS.getString('MANAGED_BY')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.customers ?
                            this.state.customers.map((customer) => {
                                return (
                                    <tr key={customer.id} onClick={() => browserHistory.push(getUrlPath(URL.CUSTOMERS_DETAIL, { customerId: customer.id }))}>
                                        <td>
                                            {customer.customerName}
                                        </td>
                                        <td className="primary-avatar-cell">
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {customer.contactName}
                                                </div>
                                                <div className="sub-label">
                                                    {customer.position}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {customer.contactPhone}
                                        </td>
                                        <td className="hyperlink-cell">
                                            {customer.contactEmail}
                                        </td>
                                        <td className="primary-avatar-cell">
                                            <img
                                                src={customer.supervisor.photoUrl ? (API_FILE + customer.supervisor.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {customer.supervisor.fullName}
                                                </div>
                                                <div className="sub-label">
                                                    {_.get(customer, "supervisor.jobRole.name")}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : null
                        }
                    </tbody>
                </table>
                <div className="listing-footer">
                    <div className="pull-left">
                        <ItemsDisplayPerPage
                            name="ItemsDisplayPerPage"
                            value={this.queryString.page_size}
                            totalRecord={this.state.meta.count}
                            onChange={this.handleChangeDisplayPerPage.bind(this)}
                        />
                    </div>
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
                                    onChange={this.handlePageClick.bind(this)}
                                /> : undefined
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default Customers;