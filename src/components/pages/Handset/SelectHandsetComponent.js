import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonSelect from '../../elements/CommonSelect.component';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import ItemsDisplayPerPage from '../../elements/ItemsDisplayPerPage';
import Pagination from '../../elements/Paginate/Pagination';
import MyCheckBoxSpecial from '../../elements/MyCheckBoxSpecial';
import MyCheckBox from '../../elements/MyCheckBox';
import * as apiHelper from '../../../utils/apiHelper';
import RS from '../../../resources/resourceManager';
import * as types from '../../../constants/actionTypes';
import { HANDSET_STATUS, WAITING_TIME, QUERY_STRING } from '../../../core/common/constants';
import TextView from '../../elements/TextView';
import debounceHelper from '../../../utils/debounceHelper';
import * as toastr from '../../../utils/toastr';

import * as handsetActions from '../../../actionsv2/handsetActions';
import { showAppLoadingIndicator, hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const propTypes = {
    handsetTypes: PropTypes.array,
    isOpen: PropTypes.bool,
    handsetsActions: PropTypes.object,
    meta: PropTypes.object,
    transferData: PropTypes.object,
    storeLocs: PropTypes.array
};

class SelectHandsetComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedHandsets: [],
            handsetTypes: [],
            handsets: [],
            filter: {
                storeLoc: null,
                handsetType: null
            }
        };

        this.query = {
            status: HANDSET_STATUS.IN_STOCK,
            is_desc: false,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0
        };

        this.handleSearchHandsets = this.handleSearchHandsets.bind(this);
        this.selectHandset = this.selectHandset.bind(this);
        this.handleOnChangeSearchText = this.handleOnChangeSearchText.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleOnchangeType = this.handleOnchangeType.bind(this);
        this.handleOnChangeStoreLoc = this.handleOnChangeStoreLoc.bind(this)
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.handleSearchCallback = debounceHelper.debounce(function () {
                this.query.page = 0;
                this.handleSearchHandsets();
            }, WAITING_TIME);
            if (!_.isEmpty(this.props.filter)) {
                let storeLocIds = apiHelper.convertQueryStringToList(this.props.filter.storeLocIds);
                let filter = {
                    storeLoc: storeLocIds ? { id: _.first(storeLocIds) } : null,
                    handsetType: this.props.filter.type,
                    identifier: this.props.filter.identifier
                };
                this.setState({ filter });
                this.query = this.props.filter;
            }
            if (!_.isEmpty(this.props.selectedHandsets)) {
                this.setState({
                    selectedHandsets: this.props.selectedHandsets
                });
            }
            if (!this.props.disableFilter) {
                handsetActions.getHandsetTypes(this.handleCallbackActions.bind(this, types.HANDSET_TYPES));       
            }
            this.handleSearchHandsets();
        }
    }

    handleCallbackActions = (actionType, err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"))
        }
        else {
            switch (actionType) {
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
                default: break;
            }
        }
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);
        query.page = 0;

        query.storeLocIds = filter.storeLoc ? apiHelper.getQueryStringListParams([filter.storeLoc.id]) : undefined;
        query.type = filter.type;
        query.identifier = filter.identifier ? filter.identifier : undefined;

        return query;
    }

    getFilter() {
        return this.query;
    }

    getValues() {
        return {
            handsets: this.state.selectedHandsets
        };
    }

    handleCheckAll(checkAll) {
        let handsets = [];
        if (checkAll) {
            handsets = _.cloneDeep(this.state.handsets);
        }
        this.setState({ selectedHandsets: handsets });
        this.props.handleSelectHandset && this.props.handleSelectHandset(handsets);
    }

    selectHandset(checked, handset) {
        let selectedHandsets = [];
        if (checked) {
            selectedHandsets = [...this.state.selectedHandsets, handset];
        } else {
            selectedHandsets = _.filter(this.state.selectedHandsets, (item) => item.id != handset.id);
        }
        this.setState({
            selectedHandsets
        });
        this.props.handleSelectHandset && this.props.handleSelectHandset(selectedHandsets);
    }

    handleSearchHandsets() {
        showAppLoadingIndicator();        
        handsetActions.searchHandsets(this.query, this.handleCallbackActions.bind(this, types.GET_HANDSETS));
    }

    handleOnchangeType(type) {
        let handsetType = type.id ? { id: type.id } : undefined;
        this.setState({
            filter: {
                ...this.state.filter,
                handsetType
            }
        });
        this.query.type = handsetType;
        this.handleSearchHandsets();
    }

    handleOnChangeStoreLoc(storeLoc) {
        let handsetStoreLoc = storeLoc.id ? { id: storeLoc.id } : undefined;
        this.setState({
            filter: {
                ...this.state.filter,
                storeLoc: handsetStoreLoc
            }
        });

        this.query.storeLocIds = handsetStoreLoc ? apiHelper.getQueryStringListParams([storeLoc.id]) : undefined;
        this.handleSearchHandsets();
    }

    handleOnChangeSearchText(e, searchTxt) {
        this.setState({
            filter: {
                ...this.state.filter,
                identifier: searchTxt
            }
        });
        this.query.identifier = searchTxt ? searchTxt : undefined;
        this.handleSearchCallback(e);
    }

    handleChangeDisplayPerPage(pageSize) {
        this.query.page_size = pageSize;
        this.query.page = 0;
        this.handleSearchHandsets();
    }

    handlePageClick(page) {
        this.query.page = page - 1;
        this.handleSearchHandsets();
    }

    renderValueComponent(type, option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {RS.getString(type)}: </span>
                    {option.value.label}
                </span>
            </div>
        );
    }

    render() {
        const { handsets } = this.state;
        let storeLocOptions = [], storeLoc, handsetTypeOptions = [], handsetType;
        if (!this.props.disableFilter) {
            storeLocOptions = [{ id: null, nameStore: RS.getString('ALL') }, ...this.props.storeLocs,];
            storeLoc = this.state.filter.storeLoc && _.find(storeLocOptions, { id: this.state.filter.storeLoc.id }) || storeLocOptions[0];
            handsetTypeOptions = [{ id: null, type: RS.getString('ALL') }, ...this.state.handsetTypes,];
            handsetType = this.state.filter.handsetType && _.find(handsetTypeOptions, { id: this.state.filter.handsetType.id }) || handsetTypeOptions[0];
        }
        const itemChecked = this.state.selectedHandsets.length || 0;
        const cssCheckAll = itemChecked === (handsets && handsets.length) ? "checkbox-special" : "checkbox-special-type2";
        return (
            <div className="choose-handset-step">
                <div className="filter">
                    {
                        !this.props.disableFilter &&
                        <CommonSelect
                            propertyItem={{ label: 'nameStore', value: 'id' }}
                            options={storeLocOptions}
                            clearable={false}
                            searchable={false}
                            value={storeLoc}
                            onChange={this.handleOnChangeStoreLoc}
                            titlePlaceHolder={RS.getString("STORE_LOC") + ": "}
                            valueComponent={this.renderValueComponent.bind(this, 'STORE_LOC')}
                        />
                    }
                    {
                        !this.props.disableFilter &&
                        <CommonSelect
                            clearable={false}
                            searchable={false}
                            name="select-employeeType"
                            onChange={this.handleOnchangeType}
                            value={handsetType}
                            options={handsetTypeOptions}
                            propertyItem={{ label: 'type', value: 'id' }}
                            valueComponent={this.renderValueComponent.bind(this, 'HANDSET_TYPE')}
                        />
                    }
                    {
                        this.props.disableFilter && this.props.handsetType &&
                        <div className="text-view">
                            <span>{RS.getString("HANDSET_TYPE")}: </span>
                            <span>{this.props.handsetType.type}</span>
                        </div>
                    }
                    <div className="search" >
                        <CommonTextField
                            onChange={this.handleOnChangeSearchText}
                            hintText={RS.getString('SEARCH_BY', 'DEVICE_ID')}
                            fullWidth={true}
                            ref={(input) => this.searchText = input}
                            defaultValue={this.state.filter.identifier}
                        />
                        <img className={'img-search img-gray-brightness'} src={require("../../../images/search.png")} />
                    </div>
                </div>
                <div className="clear" />
                <div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader>
                                    <div className={cssCheckAll}>
                                        <MyCheckBoxSpecial
                                            onChange={this.handleCheckAll.bind(this, itemChecked == 0)}
                                            checked={itemChecked > 0}
                                            className="filled-in"
                                            id="all-handset"
                                        />
                                    </div>
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('HANDSET_ID')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('IMEI')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('SERIAL_NUMBER')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('STORE_LOC')}
                                </MyTableHeader>
                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                            {
                                _.map(handsets, (handset, index) => {
                                    let selected = !!_.find(this.state.selectedHandsets, (item) => item.id == handset.id);
                                    return (
                                        <tr className={selected ? 'active' : ''}
                                            key={index}
                                            onClick={this.selectHandset.bind(this, !selected, handset)}
                                        >
                                            <td>
                                                <MyCheckBox
                                                    id={handset.id}
                                                    defaultValue={selected || false}
                                                />
                                            </td>
                                            <td>{handset.identifier}</td>
                                            <td>{handset.imei}</td>
                                            <td>{handset.serialNumber}</td>
                                            <td>{_.get(handset, 'storeLoc.nameStore')}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {this.props.meta != null && this.props.meta.count > 0 ?
                    (<div className="listing-footer">
                        <div className="pull-left">
                            <ItemsDisplayPerPage
                                name="ItemsDisplayPerPage"
                                value={this.query.page_size}
                                totalRecord={this.props.meta.count}
                                onChange={this.handleChangeDisplayPerPage}
                            />
                        </div>
                        <div className="pull-right">
                            {
                                this.props.meta.count > this.query.page_size && <Pagination
                                    firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                    lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                    prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                    nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                    activePage={this.query.page + 1}
                                    itemsCountPerPage={this.query.page_size}
                                    totalItemsCount={this.props.meta.count}
                                    onChange={this.handlePageClick}
                                />
                            }
                        </div>
                    </div>) : null
                }
                <div className="clear" />
            </div>
        );
    }
}

SelectHandsetComponent.propTypes = propTypes;
export default SelectHandsetComponent;