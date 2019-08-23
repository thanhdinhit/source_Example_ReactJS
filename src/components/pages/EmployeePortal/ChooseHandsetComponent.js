import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonSelect from '../../elements/CommonSelect.component';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import ItemsDisplayPerPage from '../../elements/ItemsDisplayPerPage';
import Pagination from '../../elements/Paginate/Pagination';
import * as apiHelper from '../../../utils/apiHelper';
import RS from '../../../resources/resourceManager';
import { HANDSET_STATUS, HANDSET_TYPE_ALL, WAITING_TIME } from '../../../core/common/constants';

const propTypes = {
    handsets: PropTypes.array,
    handsetTypes: PropTypes.array,
    isOpen: PropTypes.bool,
    handsetsActions: PropTypes.object,
    meta: PropTypes.object,
    handleSelectHandset: PropTypes.func,
    searchTxt: PropTypes.string,
    handsetSelected: PropTypes.object,
    query: PropTypes.object
};
class ChooseHandsetComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTxt: '',
            handsetSelected: null,
            storeLocIds: []
        };

        this.query = {
            status: HANDSET_STATUS.IN_STOCK,
            is_desc: false,
            page_size: 5,
            page: 0,
            storeLocs: []
        };

        this.handleSearchHandset = this.handleSearchHandset.bind(this);
        this.selectHandset = this.selectHandset.bind(this);
        this.handleOnChangeSearchText = this.handleOnChangeSearchText.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleOnchangeType = this.handleOnchangeType.bind(this);
        this.handleOnChangeStoreLoc = this.handleOnChangeStoreLoc.bind(this)
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.props.query && (this.query = this.props.query);

            this.props.handsetsActions.getHandsetTypes();
            this.props.handsetsActions.loadStoreLocs()
            this.handleSearchHandset();
            this.setState({
                searchTxt: this.props.searchTxt,
                handsetSelected: this.props.handsetSelected
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.handsets, this.props.handsets)) {
            this.setState({ handsetSelected: null });
            this.props.handleSelectHandset && this.props.handleSelectHandset(null);
        }
    }

    getValues() {
        return this.query;
    }

    handleOnChange(e, value) {
        this.setState({ searchTxt: value });
    }

    handleSearchHandset() {
        this.props.handsetsActions.searchHandsets(this.query);
    }

    handleOnchangeType(type) {
        let id = Number( type.id);
        this.query.handsetTypeId = (id && id !== HANDSET_TYPE_ALL) ? id : undefined;
        this.handleSearchHandset();
    }

    handleOnChangeStoreLoc(storeLocIds) {
        this.state.storeLocIds = _.map(storeLocIds, 'id')
        this.query.storeLocIds = apiHelper.getQueryStringListParams(this.state.storeLocIds)
        this.handleSearchHandset();
    }

    handleOnChangeSearchText(e, searchTxt) {
        this.setState({ searchTxt });
        this.query.identifier = searchTxt ? searchTxt : undefined;
        setTimeout(this.handleSearchHandset(), WAITING_TIME);
    }

    selectHandset(handset) {
        this.setState({ handsetSelected: handset });
        this.props.handleSelectHandset && this.props.handleSelectHandset(handset);
    }

    handleChangeDisplayPerPage(pageSize) {
        this.query.page_size = pageSize;
        this.query.page = 0;
        this.handleSearchHandset();
    }

    handlePageClick(page) {
        this.query.page = page - 1;
        this.handleSearchHandset();
    }

    render() {
        let handsetTypes = [{ id: HANDSET_TYPE_ALL, type: RS.getString('HANDSET_TYPE_ALL') }, ...this.props.handsetTypes,];
        const handsetType = this.query.type && _.find(handsetTypes, { id: this.query.type.id }) || handsetTypes[0];
        return (
            <div className="choose-handset-step">
                <div className="filter">
                    <CommonSelect
                        multi={true}
                        propertyItem={{ label: 'nameStore', value: 'id' }}
                        options={this.props.storeLocs}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.query.storeLocIds}
                        onChange={this.handleOnChangeStoreLoc}
                        titlePlaceHolder={RS.getString("STORE_LOC") + ": "}
                    />
                    <CommonSelect
                        required
                        placeholder={RS.getString('SELECT')}
                        clearable={false}
                        searchable={false}
                        name="select-employeeType"
                        onChange={this.handleOnchangeType}
                        value={handsetType}
                        options={handsetTypes}
                        propertyItem={{ label: 'type', value: 'id' }}
                        ref={(type) => this.type = type}
                    />
                    <div className="search" >
                        <CommonTextField
                            onChange={this.handleOnChangeSearchText}
                            hintText={RS.getString('SEARCH_BY', 'DEVICE_ID')}
                            fullWidth={true}
                            ref={(input) => this.searchText = input}
                            defaultValue={this.state.searchTxt}
                        />
                        <img className={'img-search img-gray-brightness'} src={require("../../../images/search.png")} />
                    </div>
                </div>
                <div className="clear" />
                <div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader
                                    name={'handset_id'}
                                    style={{ width: '20%' }}
                                >
                                    {RS.getString('HANDSET_ID')}
                                </MyTableHeader>
                                <MyTableHeader
                                    name={'handset_type'}
                                    style={{ width: '27%' }}
                                >
                                    {RS.getString('HANDSET_TYPE')}
                                </MyTableHeader>
                                <MyTableHeader
                                    name={'imei'}
                                    style={{ width: '27%' }}
                                >
                                    {RS.getString('IMEI')}
                                </MyTableHeader>
                                <MyTableHeader
                                    name={'serial_number'}
                                >
                                    {RS.getString('SERIAL_NUMBER')}
                                </MyTableHeader>
                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                            {this.props.handsets.map(function (handset, index) {
                                return (
                                    <tr className={_.get(this.state.handsetSelected, 'id', '') === handset.id ? 'active' : ''}
                                        key={index}
                                        onClick={this.selectHandset.bind(this, handset)}
                                    >
                                        <td>{handset.identifier}</td>
                                        <td>{handset.type.type}</td>
                                        <td>{handset.imei}</td>
                                        <td>{handset.serialNumber}</td>
                                    </tr>
                                );
                            }, this)}
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
                            <Pagination
                                firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                activePage={this.query.page + 1}
                                itemsCountPerPage={this.query.page_size}
                                totalItemsCount={this.props.meta.count}
                                onChange={this.handlePageClick}
                            />
                        </div>
                    </div>) : null
                }
                <div className="clear" />
            </div>
        );
    }
}

ChooseHandsetComponent.propTypes = propTypes;
export default ChooseHandsetComponent;