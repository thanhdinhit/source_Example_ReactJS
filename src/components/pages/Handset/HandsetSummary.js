import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import * as toastr from '../../../utils/toastr';
import { QUERY_STRING, WAITING_TIME } from '../../../core/common/constants';
import RS, { Option } from '../../../resources/resourceManager';
import RIGHTS from '../../../constants/rights';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import _ from 'lodash';
import FilterSearch from '../../elements/Filter/FilterSearch';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import Pagination from '../../elements/Paginate/Pagination';
import ItemsDisplayPerPage from '../../elements/ItemsDisplayPerPage';
import debounceHelper from '../../../utils/debounceHelper';
import CommonSelect from '../../elements/CommonSelect.component';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import DialogAddHandsetType from './DialogAddHandsetType';
import * as apiHelper from '../../../utils/apiHelper';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import DialogTransferHandset from './DialogTransferHandset';
import DialogAssignMultipleHandset from './DialogAssignMultipleHandset';

import * as handsetActions from '../../../actionsv2/handsetActions';
import { LOAD_STORE_LOCS, LOAD_HANDSET_SUMMARY } from '../../../constants/actionTypes';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const redirect = getUrlPath(URL.HANDSET_SUMMARY);
class HandsetSummary extends React.Component {
    constructor(props) {
        super(props)
        let { query } = this.props.location;
        this.state = {
            filter: this.getFilterFromUrl(),
            storeLocs: [],
            handsetSummary: []
        }
        this.queryString = {
            order_by: query.order_by ? query.order_by : 'type',
            is_desc: query.is_desc == 'true' ? true : false,
            page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
            page: parseInt(query.page) ? parseInt(query.page) : 0,
        };

        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    componentDidMount() {
        handsetActions.loadStoreLocs(this.handleCallbackActions.bind(this, LOAD_STORE_LOCS));
        this.handleLoadHandsetSummary();
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            apiHelper.handleFilterParamsChange(URL.HANDSET_SUMMARY, this.queryString);
            this.handleLoadHandsetSummary();
        }, WAITING_TIME);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.setState({ isOpenAddHandsetType: false, isOpenTransferHandset: false, isOpenAssignHandset: false, selectedId: null });
            this.handleLoadHandsetSummary();
            this.props.resetState();
        }
        if (nextProps.payload.error.message != '') {
            toastr.error(RS.getString(nextProps.payload.error.message), RS.getString('ERROR'));
            this.props.resetError();
        }
    }

    handleLoadHandsetSummary = () => {
        showAppLoadingIndicator();
        handsetActions.loadHandsetSummary(this.queryString, this.handleCallbackActions.bind(this, LOAD_HANDSET_SUMMARY))
    }

    handleCallbackActions = (actionType, err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        }
        else {
            switch (actionType) {
                case LOAD_STORE_LOCS: {
                    this.setState({ storeLocs: result.storeLocs });
                    break;
                }
                case LOAD_HANDSET_SUMMARY: {
                    const { handsetSummary, meta } = result;
                    this.setState({
                        handsetSummary,
                        meta
                    });
                    break;
                }
                default: break;
            }
        }
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.handsetType = filter.handsetType;
        query.storeLocIds = apiHelper.getQueryStringListParams(filter.storeLocIds);

        return query;
    }
    handleSearch(value) {
        this.queryString.handsetType = value;
        this.setState({
            filter: {
                ...this.state.filter,
                handsetType: value
            }
        })
        this.handleSearchCallback(value);
    }
    handleFilterChange(storeLocIds) {
        this.setState({
            filter: {
                ...this.state.filter,
                storeLocIds: storeLocIds
            }
        }, () => {
            this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
            apiHelper.handleFilterParamsChange(URL.HANDSET_SUMMARY, this.queryString);
            this.handleLoadHandsetSummary();
        })
    }
    getFilterFromUrl() {
        let { query } = this.props.location;
        let filter = {
            handsetType: query.handsetType,
            storeLocIds: apiHelper.convertQueryStringToList(query.storeLocIds),
        }
        return filter;
    }
    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page_size = pageSize;
        this.queryString.page = 0;
        apiHelper.handleFilterParamsChange(URL.HANDSET_SUMMARY, this.queryString);
        this.handleLoadHandsetSummary();
    }
    handlePageClick(page) {
        this.queryString.page = page - 1;
        apiHelper.handleFilterParamsChange(URL.HANDSET_SUMMARY, this.queryString);
        this.handleLoadHandsetSummary();
    }
    editHandsetType(handsetType) {
        if (!this.handsetType.validate()) {
            return;
        }
        let type = _.cloneDeep(handsetType);
        if (type.type == this.handsetType.getValue()) {
            this.setState({ selectedId: null });
        } else {
            type.type = this.handsetType.getValue();
            this.props.editHandsetType(handsetType.id, type);
        }
    }
    handleSelectHandsetType(type) {
        this.setState({
            selectedHandsetType: type,
            isOpenAssignHandset: true
        });
    }

    render() {
        let constraint = getHandsetsConstraints();
        return (
            <div className="page-container handset-summary">
                <div className="header">
                    {RS.getString('HANDSET_SUMMARY')}
                </div>
                <div className="row col-md-3">
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'nameStore', value: 'id' }}
                        options={this.state.storeLocs}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.storeLocIds}
                        onChange={(value) => this.handleFilterChange(_.map(value, 'id'))}
                        titleValue={RS.getString("STORE_LOC") + ": "}
                        titlePlaceHolder={RS.getString("STORE_LOC") + ": "}
                    />
                </div>
                <div className="row row-header">
                    <div className="actions-group">
                        <FilterSearch
                            ref={(filterSearch) => this.filterSearch = filterSearch}
                            handleSearchChange={this.handleSearch}
                            defaultValue={this.state.filter.handsetType}
                            placeholder={RS.getString("W2", ["SEARCH", "HANDSET_TYPE"])}
                        >
                        </FilterSearch>
                        <RaisedButton
                            label={RS.getString('TRANSFER_HANDSET', null, Option.CAPEACHWORD)}
                            onClick={() => this.setState({ isOpenTransferHandset: true })}
                        />
                        <RaisedButton
                            label={RS.getString('NEW_HANDSET_TYPE', null, Option.CAPEACHWORD)}
                            onClick={() => this.setState({ isOpenAddHandsetType: true })}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_TYPE', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_IN_STOCK')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_ASSIGNED')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_LOST')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_FAULTY')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_DISPOSED')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('HANDSET_SENT_FOR_REPARING')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ACTION')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.handsetSummary ?
                            this.state.handsetSummary.map((summary) => {
                                return (
                                    <tr key={summary.type.id}>
                                        <td className="editable-cell">
                                            {
                                                this.state.selectedId == summary.type.id ?
                                                    <CommonTextField
                                                        required
                                                        id={summary.type.id}
                                                        defaultValue={summary.type.type}
                                                        constraint={constraint.handsetType}
                                                        ref={(input) => this.handsetType = input}
                                                    /> :
                                                    <div className="cell-view">{summary.type.type}</div>
                                            }
                                            {
                                                this.state.selectedId == summary.type.id ?
                                                    <i className="fa fa-save" data-toggle="tooltip"
                                                        onClick={this.editHandsetType.bind(this, summary.type)}></i> :
                                                    <i className="fa fa-pencil" data-toggle="tooltip"
                                                        onClick={() => { this.setState({ selectedId: summary.type.id }) }}></i>
                                            }
                                            {
                                                this.state.selectedId == summary.type.id &&
                                                <i className="icon-close" data-toggle="tooltip"
                                                    onClick={() => { this.setState({ selectedId: null }) }}></i>
                                            }
                                        </td>
                                        <td>
                                            {summary.inStockNum}
                                        </td>
                                        <td>
                                            {summary.assignedNum}
                                        </td>
                                        <td>
                                            {summary.lostNum}
                                        </td>
                                        <td>
                                            {summary.faultyNum}
                                        </td>
                                        <td>
                                            {summary.disposedNum}
                                        </td>
                                        <td>
                                            {summary.sentForRepairingNum}
                                        </td>
                                        <td className="col-action">
                                            <span>
                                                {
                                                    this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_HANDSET) ?
                                                        <i className="fa fa-user" data-toggle="tooltip"
                                                            onClick={this.handleSelectHandsetType.bind(this, summary.type)}></i>
                                                        : null
                                                }
                                                {
                                                    this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_HANDSET) ?
                                                        <i className="fa fa-pencil" data-toggle="tooltip"
                                                            onClick={() => { }}></i>
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
                    this.state.isOpenAddHandsetType &&
                    <DialogAddHandsetType
                        isOpen={this.state.isOpenAddHandsetType}
                        handleClose={() => this.setState({ isOpenAddHandsetType: false })}
                        callback={this.handleLoadHandsetSummary}
                    />
                }
                {
                    this.state.isOpenTransferHandset &&
                    <DialogTransferHandset
                        storeLocs={this.state.storeLocs}
                        isOpen={this.state.isOpenTransferHandset}
                        employeeInfo={this.props.employeeInfo}
                        callback={this.handleLoadHandsetSummary}
                        handleClose={() => this.setState({ isOpenTransferHandset: false })}
                    />
                }
                {
                    this.state.isOpenAssignHandset &&
                    <DialogAssignMultipleHandset
                        isOpen={this.state.isOpenAssignHandset}
                        disableFilter
                        employeeInfo={this.props.employeeInfo}
                        handsetType={this.state.selectedHandsetType}
                        callback={this.handleLoadHandsetSummary}
                        handleClose={() => this.setState({ isOpenAssignHandset: false })}
                    />
                }
            </div>
        )
    }
}
export default HandsetSummary;