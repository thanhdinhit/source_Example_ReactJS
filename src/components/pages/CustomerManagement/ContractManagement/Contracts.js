import React, { PropTypes } from "react";
import { browserHistory } from "react-router";

import { getUrlPath } from "../../../../core/utils/RoutesUtils";
import { URL } from "../../../../core/common/app.routes";
import RIGHTS from "../../../../constants/rights";
import { QUERY_STRING, CONTRACT_STATUS, TIMEFORMAT, WAITING_TIME } from "../../../../core/common/constants";
import RS, { Option } from "../../../../resources/resourceManager";
import FilterSearch from "../../../elements/Filter/FilterSearch";
import FilterModal from "../../../elements/Filter/FilterModal";
import RaisedButton from "../../../elements/RaisedButton";
import ShowHideColumn from "../../../elements/table/ShowHideColumn";
import FilterDateTime from "../../../elements/Filter/FilterDateTime";
import CommonSelect from "../../../elements/CommonSelect.component";
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import Pagination from '../../../elements/Paginate/Pagination';
import debounceHelper from '../../../../utils/debounceHelper';
import {
  MyHeader,
  MyTableHeader,
  MyRowHeader
} from "../../../elements/table/MyTable";
import dateHelper from "../../../../utils/dateHelper";
import * as apiHelper from '../../../../utils/apiHelper';
import * as arrayHelper from '../../../../utils/arrayHelper';
import _ from 'lodash';
import * as toastr from '../../../../utils/toastr';
import { hideAppLoadingIndicator } from "../../../../utils/loadingIndicatorActions";
import * as contractActions from '../../../../actionsv2/contractActions';


const redirect = getUrlPath(URL.CONTRACTS);

export default React.createClass({
  contextTypes: {
    contracts: React.PropTypes.array,
    payload: React.PropTypes.object,
    meta: React.PropTypes.object
  },
  getInitialState: function () {
    let filter = this.getFilterFromUrl();
    let { query } = this.props.location;

    this.queryString = {
      order_by: query.order_by ? query.order_by : "status",
      is_desc: query.is_desc === "false" ? false : true,
      page_size: parseInt(query.page_size)
        ? parseInt(query.page_size)
        : QUERY_STRING.PAGE_SIZE
    };

    this.queryString = this.convertFilterToQueryString(this.queryString, filter);

    return {
      isOpenFilter: false,
      filter: filter,
      filterDefault: {},
      columns: this.getInitialColumns()
    };
  },


  componentDidMount: function () {
    this.props.loadAllContract(this.queryString);

    this.handleSearchCallback = debounceHelper.debounce(function () {
      this.queryString.page = 0;
      this.handleFilterParamsChange();
      this.props.loadAllContract(this.queryString, redirect);
    }, WAITING_TIME);
  },
  componentWillReceiveProps: function () {
    hideAppLoadingIndicator();
  },
  componentDidUpdate: function () {
    if (this.props.payload.success) {
      toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
      this.props.resetState();
    }
    if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
      toastr.error(this.props.payload.error.message, RS.getString('ERROR'))
      this.props.resetError();
    }
  },

  getInitialColumns: function () {
    return [
      {
        name: "customer",
        label: RS.getString("CUSTOMER"),
        show: false
      }
      // {
      //   name: "pricePerMonth",
      //   label: RS.getString("PRICE_PER_HOUR"),
      //   show: false
      // }
    ];
  },

  getFilterFromUrl: function () {
    let { query } = this.props.location;

    let queryParams = _.clone(query);

    if (!queryParams.status) {
      queryParams.status = apiHelper.getQueryStringListParams(this.defaultStatus());
    }

    let startDate = Date.parse(queryParams.startDate);
    let endDate = Date.parse(queryParams.endDate)

    let filter = {
      identifier: queryParams.identifier ? queryParams.identifier : '',
      customerIds: apiHelper.convertQueryStringToList(queryParams.customerIds),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: apiHelper.convertQueryStringToList(queryParams.status, false),
      // pricePerMonth: queryParams.pricePerMonth
    };

    return arrayHelper.formatFilterFromUrl(filter);
  },

  optionsDefault: function () {
    return [
      { name: RS.getString("CUSTOMER"), value: "customerIds" },
      { name: RS.getString("START_DATE"), value: "startDate" },
      { name: RS.getString("END_DATE"), value: "endDate" },
      { name: RS.getString("STATUS"), value: "status" }
    ];
  },

  getData: function () {
    setTimeout(() => {
      this.props.loadCustomers({});
    }, 0);
  },

  convertFilterToQueryString: function (queryString, filter) {
    let query = _.assign({}, queryString);
    query.page = 0;

    filter.endDate && filter.endDate.setHours(23, 59);

    query.identifier = filter.identifier;
    query.customerIds = apiHelper.getQueryStringListParams(filter.customerIds);
    query.startDate = filter.startDate ? dateHelper.localToUTC(filter.startDate) : undefined;
    query.endDate = filter.endDate ? dateHelper.localToUTC(filter.endDate) : undefined;
    query.status = apiHelper.getQueryStringListParams(filter.status);
    // query.pricePerMonth = apiHelper.convertNumbersToQueryString(filter.pricePerMonth, true);

    return query;
  },

  handleSearch: function (value) {
    this.queryString.identifier = value;
    this.setState({
      filter: {
        ...this.state.filter,
        identifier: this.queryString.identifier
      }
    })
    this.handleSearchCallback(value);
  },

  handleOpenFilter: function () {
    this.setState({
      isOpenFilter: true
    });

    this.getData();
  },

  handleApplyFilter: function () {
    this.setState({
      isOpenFilter: false,
      filter: this.state.filter,
      filterDefault: this.state.filterDefault,
    });
    this.filterSearch.handleCloseFilter();
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
    this.handleFilterParamsChange();
    this.props.loadAllContract(this.queryString);
  },

  handleResetFilter: function () {
    this.setState({
      filter: {},
      filterDefault: {},
    });
  },

  handleCloseFilter: function () {
    this.setState({
      isOpenFilter: false
    });

    this.filterSearch.handleCloseFilter();
  },

  handleAddContract: function () {
    this.props.resetState();
    browserHistory.push(getUrlPath(URL.NEW_CONTRACT));
  },


  handleFilterChange: function (field, data) {
    this.setState({
      filter: {
        ...this.state.filter,
        [field]: data
      }
    });
  },


  handleShowHideColumns: function (columns) {
    this.setState({
      columns
    });
  },

  handleFilterParamsChange: function () {
    let paramsString = _.map(
      _.keys(_.omitBy(this.queryString, _.isUndefined)),
      key => {
        return (
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(this.queryString[key])
        );
      }
    ).join("&");
    browserHistory.replace(redirect + "?" + paramsString);
  },

  handleSortClick: function (index, columnNameInput, directionInput) {
    let columnName = "";

    switch (columnNameInput) {
      case "status": {
        columnName = "status";
        break;
      }
      default:
        return null;
    }

    this.queryString.order_by = columnName;
    this.queryString.is_desc = directionInput != 1;
    this.queryString.page = 0;
    this.handleFilterParamsChange();
    this.props.loadAllContract(this.queryString, redirect);
  },

  handlePageClick: function (page) {
    this.queryString.page = page - 1;
    this.handleFilterParamsChange();
    this.props.loadAllContract(this.queryString, redirect);
  },

  handleChangeDisplayPerPage: function (pageSize) {
    this.queryString.page_size = pageSize;
    this.queryString.page = 0;
    this.handleFilterParamsChange();
    this.props.loadAllContract(this.queryString, redirect);
  },

  handleFormatFilter: function (data, label) {
    let dataClone = _.cloneDeep(data);

    return _.map(dataClone, (g, idx) => {
      return {
        value: g.id,
        label: g[label]
      };
    });
  },

  getCustomerOptions: function () {
    return this.handleFormatFilter(this.props.customers, 'customerName');
  },

  getStatusOptions: function () {
    return [
      {
        value: CONTRACT_STATUS.DRAFT,
        label: RS.getString('STATUS_DRAFT')
      },
      {
        value: CONTRACT_STATUS.ACTIVE,
        label: RS.getString('STATUS_ACTIVE')
      },
      {
        value: CONTRACT_STATUS.SUSPENDED,
        label: RS.getString('STATUS_SUSPENDED')
      },
      {
        value: CONTRACT_STATUS.COMPLETED,
        label: RS.getString('STATUS_COMPLETED')
      }
    ];
  },

  getContractStatusClass: function (status) {
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
  },

  defaultStatus: function () {
    return [
      CONTRACT_STATUS.DRAFT,
      CONTRACT_STATUS.ACTIVE,
      CONTRACT_STATUS.SUSPENDED
    ];
  },

  renderDefaultFilter: function (filter) {
    let component = null;

    switch (filter.value) {
      case "customerIds": {
        component = (
          <CommonSelect
            multi={true}
            options={this.getCustomerOptions()}
            allowOptionAll={true}
            optionAllText={RS.getString("ALL")}
            value={this.state.filter.customerIds}
            onChange={value =>
              this.handleFilterChange(filter.value, _.map(value, "value"))
            }
          />
        );
        break;
      }
      case "startDate": {
        component = (
          <CommonDatePicker
            hintText='dd/mm/yyyy'
            defaultValue={this.state.filter.startDate}
            onChange={this.handleFilterChange.bind(this, filter.value)}
          />
        );
        break;
      }
      case "endDate": {
        component = (
          <CommonDatePicker
            hintText='dd/mm/yyyy'
            defaultValue={this.state.filter.endDate}
            onChange={this.handleFilterChange.bind(this, filter.value)}
          />
        );
        break;
      }
      case "status": {
        component = (
          <CommonSelect
            multi={true}
            options={this.getStatusOptions()}
            allowOptionAll={true}
            optionAllText={RS.getString("ALL")}
            value={
              this.state.filter.status || this.defaultStatus()
            }
            onChange={value =>
              this.handleFilterChange(filter.value, _.map(value, "value"))
            }
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
  },


  renderFilter: function () {
    return (
      <div className="row row-header">
        <div className="employees-actions-group">
          <FilterSearch
            ref={filterSearch => (this.filterSearch = filterSearch)}
            handleSearchChange={this.handleSearch}
            placeholder={RS.getString("SEARCH_CONTRACT_ID")}
          >
            <FilterModal
              ref={filterModal => (this.filterModal = filterModal)}
              isOpen={this.state.isOpenFilter}
              handleOpenFilter={this.handleOpenFilter}
              handleApplyFilter={this.handleApplyFilter}
              handleResetFilter={this.handleResetFilter}
              handleCloseFilter={this.handleCloseFilter}
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
          {this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_CONTRACT) ? (
            <RaisedButton
              label={RS.getString("NEW_CONTRACT", null, Option.CAPEACHWORD)}
              onClick={this.handleAddContract}
            />
          ) : null}
        </div>
      </div>
    );
  },

  redirectToContract: function (contract) {
    if (contract.status == CONTRACT_STATUS.DRAFT) {
      const loadContractDetail = new Promise((resolve, reject) => {
        contractActions.loadContractDetail(contract.id, (err, contract) => {
          if (err) {
            toastr.error(err.message, RS.getString('ERROR'));
            reject();
          }
          for (let field in contract) {
            this.props.updateContractDto(field, contract[field]);
          }
          resolve();
        });
      });

      const loadContractSchedules = new Promise((resolve, reject) => {
        contractActions.loadContractSchedules(contract.id, undefined, (err, result) => {
          if (err) {
            toastr.error(err.message, RS.getString('ERROR'));
            reject();
          }
          ['schedules', 'flexibleSchedules'].forEach(field => {
            result[field].forEach(item => {
              contractActions.loadContractSchedulesShift(item.contractId, item.id, undefined, (err, shifts) => {
                if (err) {
                  toastr.error(err.message, RS.getString('ERROR'));
                }
                else if (shifts.length) {
                  let items = result[field];
                  let indexItem = _.findIndex(items, x => x.id == item.id);
                  items[indexItem].shifts = shifts;
                  this.props.updateContractDto(field, items);
                }
              });
            });
          });
          resolve();
        });
      });
      Promise.all([loadContractDetail, loadContractSchedules]).then(() => {
        browserHistory.push(getUrlPath(URL.NEW_CONTRACT));
      });
    } else {
      browserHistory.push(getUrlPath(URL.CONTRACT, { contractId: contract.id }));
    }
  },

  renderTable: function () {
    let columns = _.keyBy(this.state.columns, "name");

    return (
      <div className="row row-body">
        <div className="inner-container">
          <table className="metro-table">
            <MyHeader sort={this.handleSortClick}>
              <MyRowHeader>
                <MyTableHeader>
                  {RS.getString("CONTRACT_ID")}
                </MyTableHeader>
                <MyTableHeader
                  name={"customer"}
                  show={columns["customer"].show}
                >
                  {RS.getString("CUSTOMER")}
                </MyTableHeader>
                <MyTableHeader>
                  {RS.getString("GROUP")}
                </MyTableHeader>

                {/* <MyTableHeader
                  name={"pricePerMonth"}
                  show={columns["pricePerMonth"].show}
                >
                  {RS.getString("PRICE_PER_HOUR")}
                </MyTableHeader> */}
                <MyTableHeader>
                  {RS.getString("START_DATE")}
                </MyTableHeader>
                <MyTableHeader>
                  {RS.getString("END_DATE")}
                </MyTableHeader>
                <MyTableHeader
                  enableSort
                >
                  {RS.getString("STATUS")}
                </MyTableHeader>
              </MyRowHeader>
            </MyHeader>
            <tbody>
              {
                _.map(this.props.contracts, contract => (
                  <tr
                    key={contract.id}
                    className="pointer row-freeze"
                    onClick={this.redirectToContract.bind(this, contract)}
                  >
                    <td>{contract.identifier}</td>
                    {columns["customer"].show &&
                      <td>{contract.customer.customerName}</td>
                    }
                    <td>{contract.group.name}</td>
                    <td>
                      {dateHelper.formatTimeWithPattern(
                        contract.startDate,
                        TIMEFORMAT.CONTRACT_DATETIME
                      )}
                    </td>

                    <td>
                      {dateHelper.formatTimeWithPattern(
                        contract.endDate,
                        TIMEFORMAT.CONTRACT_DATETIME
                      )}
                    </td>
                    <td className="status-cell">
                      <span
                        className={this.getContractStatusClass(contract.status)}
                      >
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  },

  renderPagination: function () {
    return (
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
              this.props.meta.count > this.queryString.page_size ? <Pagination
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
        </div> : null
    );
  },

  render: function () {
    return (
      <div className="page-container page-employees contracts-management">
        <div className="header">{RS.getString("CONTRACTS")}</div>
        {this.renderFilter()}
        {this.renderTable()}
        {this.renderPagination()}
      </div>
    );
  }
});
