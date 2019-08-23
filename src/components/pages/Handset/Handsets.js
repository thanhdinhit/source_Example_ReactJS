import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import * as toastr from '../../../utils/toastr';
import { QUERY_STRING, WAITING_TIME, getHandsetStatusOptions, HANDSET_STATUS } from '../../../core/common/constants';
import RS, { Option } from '../../../resources/resourceManager';
import RIGHTS from '../../../constants/rights';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import _ from 'lodash';
import FilterSearch from '../../elements/Filter/FilterSearch';
import FilterModal from "../../elements/Filter/FilterModal";
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import Pagination from '../../elements/Paginate/Pagination';
import ItemsDisplayPerPage from '../../elements/ItemsDisplayPerPage';
import debounceHelper from '../../../utils/debounceHelper';
import CommonSelect from '../../elements/CommonSelect.component';
import * as apiHelper from '../../../utils/apiHelper';
import { loadAllMember } from '../../../actions/employeeActions';
import DialogAddHanset from './DialogAddHanset';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import DialogConfirm from '../../elements/DialogConfirm';
import * as handsetActions from '../../../actionsv2/handsetActions';
import DialogTransferHandset from './DialogTransferHandset';
import DialogAssignSingleHandset from './DialogAssignSingleHandset';
import * as types from '../../../constants/actionTypes';

const redirect = getUrlPath(URL.HANDSETS);
class Handsets extends React.Component {
    constructor(props) {
        super(props)
        let { query } = this.props.location;
        let filter = this.getFilterFromUrl();
        this.state = {
            handsets: [],
            meta: null,
            storeLocs: [],
            filter: filter,
            prefilter: filter
        };
        this.queryString = {
            order_by: query.order_by ? query.order_by : 'handsetTypeId',
            is_desc: query.is_desc == 'true' ? true : false,
            page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
            page: parseInt(query.page) ? parseInt(query.page) : 0,
        };

        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);

        this.selectedHandsetId = null;

        this.handleSearch = this.handleSearch.bind(this);
        this.handleStoreLocChange = this.handleStoreLocChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleOpenFilter = this.handleOpenFilter.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.loadAllEmployees = this.loadAllEmployees.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleDeleteHandset = this.handleDeleteHandset.bind(this);
        this.handleEditHanset = this.handleEditHanset.bind(this);
    }
    componentDidMount() {
        this.setState({ isMounted: true });
        handsetActions.loadStoreLocs(this.handleCallbackActions.bind(this, types.LOAD_STORE_LOCS));
        this.handleSearchHandsets();
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
            this.handleSearchHandsets();
        }, WAITING_TIME);
    }

    handleSearchHandsets = () => {
        LoadingIndicatorActions.showAppLoadingIndicator();
        handsetActions.searchHandsets(this.queryString, this.handleCallbackActions.bind(this, types.GET_HANDSETS));
    }

    handleCallbackActions = (actionType, err, result) => {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
            this.setState({ isOpenDeleteDialog: false });
        }
        else {
            switch (actionType) {
                case types.LOAD_STORE_LOCS: {
                    this.setState({ storeLocs: result.storeLocs });
                    break;
                }
                case types.HANDSET_TYPES: {
                    this.setState({ handsetTypes: result.handsetTypes });
                    break;
                }
                case types.GET_HANDSETS: {
                    const { handsets, meta } = result;
                    this.setState({
                        handsets,
                        meta
                    });
                    break;
                }
                case types.DELETE_HANDSET: {
                    toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                    this.setState({ isOpenDeleteDialog: false });
                    this.handleSearchHandsets();
                    break;
                }
                default: break;
            }
        }
    }

    getFilterFromUrl() {
        let { query } = this.props.location;
        let filter = {
            identifier: query.identifier,
            storeLocIds: apiHelper.convertQueryStringToList(query.storeLocIds),
            status: apiHelper.convertQueryStringToList(query.status, false),
            assignee: apiHelper.convertQueryStringToList(query.assignee)
        };
        return filter;
    }
    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.identifier = filter.identifier;
        query.status = apiHelper.getQueryStringListParams(filter.status);
        query.assignee = apiHelper.getQueryStringListParams(filter.assignee);
        query.storeLocIds = apiHelper.getQueryStringListParams(filter.storeLocIds);

        return query;
    }
    handleSearch(value) {
        this.queryString.identifier = value;
        this.setState({
            filter: {
                ...this.state.filter,
                identifier: value
            }
        })
        this.handleSearchCallback(value);
    }
    handleStoreLocChange(storeLocIds) {
        this.setState({
            filter: {
                ...this.state.filter,
                storeLocIds: storeLocIds
            }
        }, () => {
            this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
            apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
            this.handleSearchHandsets();
        })
    }
    handleFilterChange(field, data) {
        this.setState({
            filter: {
                ...this.state.filter,
                [field]: data
            }
        });
    }
    handleOpenFilter() {
        this.setState({ isOpenFilter: true });
    }
    handleResetFilter() {
        this.setState({
            filter: {
                storeLocIds: this.state.storeLocIds
            },
            prefilter: {
                storeLocIds: this.state.storeLocIds
            }
        });
    }
    handleCloseFilter() {
        this.setState({
            isOpenFilter: false,
            filter: this.state.prefilter,
        })
        this.filterSearch.handleCloseFilter();
    }
    handleApplyFilter() {
        this.setState({
            isOpenFilter: false,
            prefilter: this.state.filter
        });
        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
        apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
        this.handleSearchHandsets();
    }
    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page_size = pageSize;
        this.queryString.page = 0;
        apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
        this.handleSearchHandsets();
    }
    handlePageClick(page) {
        this.queryString.page = page - 1;
        apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
        this.handleSearchHandsets();
    }
    handleSortClick(index, columnNameInput, directionInput) {
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
        apiHelper.handleFilterParamsChange(URL.HANDSETS, this.queryString);
        this.handleSearchHandsets();
    }
    loadAllEmployees(input) {
        if (!this.state.isMounted) return;
        return loadAllMember(input);
    }
    handleOpenDeleteHandset(handsetId) {
        this.selectedHandsetId = handsetId;
        this.setState({ isOpenDeleteDialog: true });
    }
    handleDeleteHandset() {
        LoadingIndicatorActions.showAppLoadingIndicator()
        handsetActions.deleteHandset(this.selectedHandsetId, this.handleCallbackActions.bind(this, types.DELETE_HANDSET));
        this.selectedHandsetId = null;
    }
    optionsDefault() {
        return [
            { name: RS.getString("STATUS"), value: "status" },
            { name: RS.getString("ASSIGNEE"), value: "assignee" }
        ];
    }
    renderDefaultFilter(filter) {
        let component = null;

        switch (filter.value) {
            case "status": {
                component = (
                    <CommonSelect
                        multi={true}
                        options={getHandsetStatusOptions()}
                        allowOptionAll={true}
                        optionAllText={RS.getString("ALL")}
                        value={this.state.filter.status}
                        onChange={value => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                );
                break;
            }
            case "assignee": {
                component = (
                    <CommonSelect
                        multi={true}
                        className="has-avatar"
                        propertyItem={{ label: 'fullName', value: 'id' }}
                        allowOptionAll={true}
                        optionAllText={RS.getString("ALL")}
                        loadOptions={this.loadAllEmployees}
                        searchable={true}
                        valueRenderer={this.valueRenderer}
                        optionRenderer={this.valueRenderer}
                        value={this.state.filter.assignee}
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
    renderOption(option) {
        return (
            <div className="parent-groups">
                {option.name}
            </div>
        );
    }
    valueRenderer(option) {
        option.label = option.fullName;
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={option.photoUrl ? (API_FILE + option.photoUrl)
                    : require('../../../images/avatarDefault.png')} />
                <span className="avatar-label">{option.label}</span>
            </div>
        );
    }

    handleEditHanset(handsetId) {
        browserHistory.push(getUrlPath(URL.EDIT_HANDSET, { handsetId }));
    }

    handleOpenAssignHandsetDialog(handset) {
        this.setState({
            isOpenAssignHandset: true,
            selectedHandset: handset
        });
    }

    render() {
        return (
            <div className="page-container handsets">
                <div className="header">
                    {RS.getString('HANDSETS')}
                </div>
                <div className="row col-md-3">
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'nameStore', value: 'id' }}
                        options={this.state.storeLocs}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.storeLocIds}
                        onChange={(value) => this.handleStoreLocChange(_.map(value, 'id'))}
                        titleValue={RS.getString("STORE_LOC") + ": "}
                        titlePlaceHolder={RS.getString("STORE_LOC") + ": "}
                    />
                </div>
                <div className="row row-header">
                    <div className="actions-group">
                        <FilterSearch
                            ref={(filterSearch) => this.filterSearch = filterSearch}
                            handleSearchChange={this.handleSearch}
                            defaultValue={this.state.filter.identifier}
                            placeholder={RS.getString("W2", ["SEARCH", "HANDSET_ID"])}
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
                        <RaisedButton
                            label={RS.getString('TRANSFER_HANDSET', null, Option.CAPEACHWORD)}
                            onClick={() => this.setState({ isOpenTransferHandset: true })}
                        />
                        <RaisedButton
                            label={RS.getString('NEW_HANDSET', null, Option.CAPEACHWORD)}
                            onClick={() => this.setState({ isOpenAddHandset: true })}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_ID')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_TYPE', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('IMEI')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('SERIAL_NUMBER')}
                            </MyTableHeader>
                            <MyTableHeader name={"status"} enableSort>
                                {RS.getString('STATUS')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ASSIGNEE')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ACTION')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.handsets ?
                            this.state.handsets.map((item) => {
                                let statusOptions = getHandsetStatusOptions();
                                let status = _.find(statusOptions, (option) => option.value == item.status);
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            {item.identifier}
                                        </td>
                                        <td>
                                            {item.type.type}
                                        </td>
                                        <td>
                                            {item.imei}
                                        </td>
                                        <td>
                                            {item.serialNumber}
                                        </td>
                                        <td className="status-cell">
                                            <span className={`status-${item.status}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="primary-avatar-cell">
                                            {item.assignee ?
                                                <div className="avatar-content">
                                                    <img src={_.get(item.assignee, 'photoUrl', '') ? (API_FILE + item.assignee.photoUrl) : require("../../../images/avatarDefault.png")} />
                                                    <div className="cell-content">
                                                        <div className="main-label">
                                                            {_.get(item.assignee, 'fullName', '')}
                                                        </div>
                                                        <div className="sub-label">
                                                            {_.get(item.assignee, 'jobRole.name', '')}
                                                        </div>
                                                    </div>
                                                </div> : null
                                            }
                                        </td>
                                        <td className="col-action">
                                            <span>
                                                {
                                                    this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_HANDSET) ?
                                                        <i className="fa fa-pencil" data-toggle="tooltip"
                                                            onClick={this.handleEditHanset.bind(this, item.id)}></i>
                                                        : null
                                                }
                                                {
                                                    this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_HANDSET) && item.status == HANDSET_STATUS.IN_STOCK ?
                                                        <i className="fa fa-user" data-toggle="tooltip"
                                                            onClick={this.handleOpenAssignHandsetDialog.bind(this, item)}></i>
                                                        : null
                                                }
                                                {
                                                    this.props.curEmp.rights.find(x => x === RIGHTS.DELETE_HANDSET) && item.status == HANDSET_STATUS.IN_STOCK ?
                                                        <i className="fa fa-trash-o" data-toggle="tooltip"
                                                            onClick={this.handleOpenDeleteHandset.bind(this, item.id)}
                                                        ></i>
                                                        : null
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }) : null
                        }
                    </tbody>
                </table>
                {this.state.meta != null && this.state.meta.count > 0 ?
                    <div className="listing-footer">
                        <div className="pull-left">
                            <ItemsDisplayPerPage
                                name="ItemsDisplayPerPage"
                                value={this.queryString.page_size}
                                totalRecord={this.state.meta.count}
                                onChange={this.handleChangeDisplayPerPage}
                            />
                        </div>
                        <div className="pull-right">
                            {
                                this.state.meta.count > this.queryString.page_size ? <Pagination
                                    firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                    lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                    prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                    nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                    activePage={this.queryString.page + 1}
                                    itemsCountPerPage={this.queryString.page_size}
                                    totalItemsCount={this.state.meta.count}
                                    onChange={this.handlePageClick}
                                /> : null
                            }
                        </div>
                    </div> : null
                }
                {
                    this.state.isOpenAddHandset &&
                    <DialogAddHanset
                        isOpen={this.state.isOpenAddHandset}
                        handleClose={() => this.setState({ isOpenAddHandset: false })}
                        employeeInfo={this.props.employeeInfo.contactDetail}
                        curEmp={this.props.curEmp}
                        storeLocs={this.state.storeLocs}
                        callback={this.handleSearchHandsets}
                    />
                }
                <DialogConfirm
                    style={{ 'widthBody': '400px' }}
                    title={RS.getString('DELETE')}
                    isOpen={this.state.isOpenDeleteDialog}
                    handleSubmit={this.handleDeleteHandset}
                    handleClose={() => this.setState({ isOpenDeleteDialog: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', ['HANDSET'], Option.FIRSTCAP)}</span>
                </DialogConfirm>
                {
                    this.state.isOpenTransferHandset &&
                    <DialogTransferHandset
                        storeLocs={this.state.storeLocs}
                        isOpen={this.state.isOpenTransferHandset}
                        employeeInfo={this.props.employeeInfo}
                        callback={this.handleSearchHandsets}
                        handleClose={() => this.setState({ isOpenTransferHandset: false })}
                    />
                }
                {
                    this.state.isOpenAssignHandset &&
                    <DialogAssignSingleHandset
                        isOpen={this.state.isOpenAssignHandset}
                        employeeInfo={this.props.employeeInfo}
                        handset={this.state.selectedHandset}
                        callback={this.handleSearchHandsets}
                        handleClose={() => this.setState({ isOpenAssignHandset: false })}
                    />
                }
            </div>
        )
    }
}
export default Handsets;