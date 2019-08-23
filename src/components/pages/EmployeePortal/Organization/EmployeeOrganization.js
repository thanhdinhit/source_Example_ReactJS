import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import debounceHelper from '../../../../utils/debounceHelper';

import Breadcrumb from '../../../elements/Breadcrumb';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import RS from '../../../../resources/resourceManager';
import RIGHTS from '../../../../constants/rights';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RaisedButton from '../../../elements/RaisedButton';
import FilterSearch from '../../../elements/Filter/FilterSearch';
import FilterModal from '../../../elements/Filter/FilterModal';
import FilterMore from '../../../elements/Filter/FilterMore';
import CommonSelect from '../../../elements/CommonSelect.component';
import { COUNTRY } from '../../../../core/common/config';
import * as apiHelper from '../../../../utils/apiHelper';
import * as arrayHelper from '../../../../utils/arrayHelper'
import * as toastr from '../../../../utils/toastr';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogAlert from '../../../elements/DialogAlert';
import DialogAddEditOrganization from './DialogAddEditOrganization';
import { MODE_PAGE, WAITING_TIME } from '../../../../core/common/constants';
import { loadAllGroup, deleteGroup, loadAllBaseGroup } from '../../../../actionsv2/groupActions';
import { loadStates } from '../../../../actionsv2/geographicActions';
import DialogEmployeeTransfer from './../../../pages/EmployeePortal/DialogEmployeeTransfer';
import * as loadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import { transferEmployee, loadAllBaseEmployee } from '../../../../actionsv2/employeeActions';
import * as types from '../../../../constants/actionTypes';

const redirect = getUrlPath(URL.ORGANIZATION);

const propTypes = {
    payload: PropTypes.object,
};

class EmployeeOrganization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenFilterModal: false,
            isOpenDeleteDenied: false,
            activeTree: true,
            activeOrgChart: false,
            filter: {
                name: '',
                managedBy: [],
                parentGroup: [],
                state: []
            },
            isOpenDialogAddEditOrganization: false,
            isOpenConfirmTransfer: false,
            mode: '',
            fullName: '',
            parentGroup: ''
        };

        this.optionFilter = [
            { name: RS.getString('MANAGED_BY'), value: 'managedBy' },
            { name: RS.getString('PARENT_GROUP'), value: 'parentGroup' },
            { name: RS.getString('COUNTRY_STATE'), value: 'state' }
        ];

        this.groupIdSelected = null;
        this.errorMessage = '';

        this.queryString = {
            name: '',
            supervisorIds: [],
            parentIds: [],
            stateIds: []
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleOpenFilter = this.handleOpenFilter.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleResetFilter = this.handleResetFilter.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.renderFilter = this.renderFilter.bind(this);
        this.handleActiveTreeClick = this.handleActiveTreeClick.bind(this);
        this.handleActiveOrgChartClick = this.handleActiveOrgChartClick.bind(this);
        this.renderOptionFilter = this.renderOptionFilter.bind(this);
        this.renderTreegrid = this.renderTreegrid.bind(this);
        this.getManagedBy = this.getManagedBy.bind(this);
        this.getParentGroup = this.getParentGroup.bind(this);
        this.getState = this.getState.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleShowConfirmDelete = this.handleShowConfirmDelete.bind(this);
        this.handleOnClickSupervisor = this.handleOnClickSupervisor.bind(this);
        this.handleActionsCallback = this.handleActionsCallback.bind(this);
        this.handleOpendialogConfirm = this.handleOpendialogConfirm.bind(this);
        this.handleTransferEmployee = this.handleTransferEmployee.bind(this);
        this.handleLoadAllGroup = this.handleLoadAllGroup.bind(this);
    }

    getFilterFromUrl() {
        let { query } = this.props.location;

        let filter = {
            name: query.name ? query.name : '',
            managedBy: apiHelper.convertQueryStringToList(query.supervisorIds),
            parentGroup: apiHelper.convertQueryStringToList(query.parentIds),
            state: apiHelper.convertQueryStringToList(query.stateIds)
        };

        return arrayHelper.formatFilterFromUrl(filter)
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString);

        query.name = filter.name;
        query.supervisorIds = apiHelper.getQueryStringListParams(filter.managedBy);
        query.parentIds = apiHelper.getQueryStringListParams(filter.parentGroup);
        query.stateIds = apiHelper.getQueryStringListParams(filter.state);

        return query;
    }

    handleFilterParamsChange() {
        let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
        }).join('&');
        browserHistory.replace(getUrlPath(URL.ORGANIZATION) + '?' + paramsString);
    }

    componentWillMount() {
        this.setState({
            activeTree: true,
            activeOrgChart: false
        });

        let filter = this.getFilterFromUrl();

        this.queryString = this.convertFilterToQueryString(this.queryString, filter);
    }

    componentDidMount() {
        this.handleLoadAllGroup();
        this.handleSearchCallback = debounceHelper.debounce(function () {
            this.queryString.page = 0;
            this.handleFilterParamsChange();
            this.handleLoadAllGroup();
        }, WAITING_TIME);
    }

    handleLoadAllGroup(){
        loadAllGroup(this.queryString, this.handleActionsCallback.bind(this, types.LOAD_ALL_GROUP));
    }

    handleActionsCallback(type, err, value) {
        if (value) {
            switch (type) {
                case types.LOAD_ALL_GROUP:
                    this.setState({
                        groups: value
                    }); break;
                case types.LOAD_ALL_BASE_EMPLOYEE:
                    this.setState({
                        baseEmployees: value
                    }); break;
                case types.LOAD_ALL_BASE_GROUP:
                    this.setState({
                        baseGroups: value
                    }); break;
                case types.LOAD_ALL_STATE:
                    this.setState({
                        loadStates: value
                    }); break;
            }
        }
        else {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
        }
    }

    handleDeleteGroup() {
        deleteGroup(this.groupIdSelected, (err) => {
            if (err) {
                toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            }
            else {
                this.setState({ showDeleteGroup: false });
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                this.handleLoadAllGroup();
                loadAllBaseGroup();
            }
        });
    }

    handleShowConfirmDelete(id) {
        this.groupIdSelected = id;
        this.setState({ showDeleteGroup: true });
    }

    handleSearch(value) {
        this.queryString.name = value;

        this.setState({
            filter: {
                ...this.state.filter,
                name: this.queryString.name
            }
        });
        this.handleSearchCallback(value);

    }

    handleOpenFilter() {
        this.setState({
            isOpenFilterModal: true
        });

        setTimeout(() => {
            this.getManagedBy();
            loadAllBaseGroup(this.handleActionsCallback.bind(this, types.LOAD_ALL_BASE_GROUP));
            loadStates({}, this.handleActionsCallback.bind(this, types.LOAD_ALL_STATE));
            loadAllBaseEmployee(this.handleActionsCallback.bind(this, types.LOAD_ALL_BASE_EMPLOYEE));
        }, 0);
    }

    handleApplyFilter() {
        this.setState({
            isOpenFilterModal: false,
            filter: this.state.filter
        });

        this.filterSearch.handleCloseFilter();
        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
        this.handleFilterParamsChange();
        this.handleLoadAllGroup();
    }

    handleResetFilter() {
        this.setState({
            filter: {
                name: '',
                managedBy: [],
                parentGroup: [],
                state: []
            }
        });
    }

    handleCloseFilter() {
        this.setState({
            isOpenFilterModal: false,
            filter: this.state.filter
        });

        this.filterSearch.handleCloseFilter();
    }

    handleActiveTreeClick() {
        this.setState({
            activeOrgChart: false,
            activeTree: true
        });
    }

    handleActiveOrgChartClick() {
        this.setState({
            activeTree: false,
            activeOrgChart: true
        });
    }

    handleFormatFilter(data, label) {
        let dataClone = _.cloneDeep(data);

        return _.map(dataClone, (g, idx) => {
            return {
                value: g.id,
                label: g[label]
            };
        });
    }

    getManagedBy() {
        return this.handleFormatFilter(this.state.baseEmployees, 'fullName');
    }

    getParentGroup() {
        return this.handleFormatFilter(this.state.baseGroups, 'name');
    }

    getState() {
        return this.handleFormatFilter(this.state.states, 'name');
    }

    handleFilterChange(field, data) {
        this.setState({
            filter: {
                ...this.state.filter,
                [field]: data
            }
        });
    }
    handleOnClickSupervisor(supervisor, e) {
        browserHistory.push(getUrlPath(URL.EMPLOYEE, { employeeId: supervisor.id }))
    }
    renderOptionView() {
        return (
            <div className="btn-group btn-group-switch-view">
                <button type="button" className={this.state.activeTree ? 'btn dropdown-toggle is--active' : 'btn dropdown-toggle'} data-toggle="dropdown" onClick={this.handleActiveTreeClick}>
                    <i className="fa fa-list-ul" aria-hidden="true"></i>
                </button>
                <button type="button" className={this.state.activeOrgChart ? 'btn dropdown-toggle is--active' : 'btn dropdown-toggle'} data-toggle="dropdown" onClick={this.handleActiveOrgChartClick}>
                    <i className="fa fa-sitemap" aria-hidden="true"></i>
                </button>
            </div>
        );
    }

    renderOptionFilter(filter) {
        let component = null;

        switch (filter.value) {
            case 'managedBy': {
                component = (
                    <CommonSelect
                        multi={true}
                        options={this.getManagedBy()}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.managedBy}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                )

                break;
            }
            case 'parentGroup': {
                component = (
                    <CommonSelect
                        multi={true}
                        options={this.getParentGroup()}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.parentGroup}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                );

                break;
            }
            case 'state': {
                component = (
                    <CommonSelect
                        multi={true}
                        options={this.getState()}
                        allowOptionAll={true}
                        optionAllText={RS.getString('ALL')}
                        value={this.state.filter.state}
                        onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
                    />
                )

                break;
            }
            default: {
                break;
            }
        }

        return React.cloneElement(component, { title: filter.name, field: filter.value, key: filter.name });
    }

    renderFilter() {
        return (
            <div className="row row-header">
                <div className="employees-actions-group">
                    <FilterSearch
                        ref={(filterSearch) => this.filterSearch = filterSearch}
                        placeholder={RS.getString('SEARCH_GROUP_NAME')}
                        handleSearchChange={this.handleSearch}
                        defaultValue={this.queryString.name}
                        inputType='text'
                        inputId='searchGroupName'
                    >
                        <FilterModal
                            ref={(filterModal) => this.filterModal = filterModal}
                            isOpen={this.state.isOpenFilterModal}
                            handleOpenFilter={this.handleOpenFilter}
                            handleApplyFilter={this.handleApplyFilter}
                            handleResetFilter={this.handleResetFilter}
                            handleCloseFilter={this.handleCloseFilter}
                            size="md-small"
                            blockSize="col-lg-4"
                        >
                            {_.map(this.optionFilter, (filter) => this.renderOptionFilter(filter))}
                        </FilterModal>
                    </FilterSearch>
                    {this.renderOptionView()}
                    {
                        this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_GROUP) ?
                            <RaisedButton
                                label={RS.getString('NEW_GROUP', null, Option.CAPEACHWORD)}
                                onClick={() => this.setState({ isOpenDialogAddEditOrganization: true, mode: MODE_PAGE.NEW, groupSelected: null })}
                            /> : null
                    }
                </div>
            </div>
        );
    }

    renderTreegrid(groups) {
        if (!groups || groups.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">Record not found</td>
                </tr>
            );
        }
        return _.map(groups, (group, index) => {
            return (
                <tr
                    key={index + group.name}
                    className={'tree-node treegrid-' + group.id + (group.parent ? ' treegrid-parent-' + group.parent.id : '') + ' tr-expand'}
                >
                    <td>
                        {group.name}
                    </td>
                    {
                        LOCALIZE.COUNTRY != COUNTRY.VN ?
                            <td>
                                {group.state.name}
                            </td>
                            : null
                    }

                    <td className="primary-avatar-cell">
                        {group.supervisor ?
                            <div className="avatar-content" onClick={this.handleOnClickSupervisor.bind(this, group.supervisor)}>
                                <img src={_.get(group.supervisor, 'photoUrl', '') ? (API_FILE + group.supervisor.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                <div className="cell-content">
                                    <div className="main-label">
                                        {_.get(group.supervisor, 'fullName', '')}
                                    </div>
                                    <div className="sub-label">
                                        {_.get(group.supervisor, 'jobRole.name', '')}
                                    </div>
                                </div>
                            </div> : null
                        }
                    </td>
                    <td className="col-action">
                        <span>
                            {
                                this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_GROUP) ?
                                    <i className="fa fa-plus-circle" data-toggle="tooltip" title="Create Group"
                                        onClick={() => this.setState({ isOpenDialogAddEditOrganization: true, mode: MODE_PAGE.NEW, groupSelected: group })}></i>
                                    : null
                            }

                            {
                                this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_GROUP) ?
                                    <i className="fa fa-pencil" data-toggle="tooltip" title="Modify Group"
                                        onClick={() => this.setState({ isOpenDialogAddEditOrganization: true, mode: MODE_PAGE.EDIT, groupSelected: group })}></i>
                                    : null
                            }

                            {
                                (this.props.curEmp.rights.find(x => x === RIGHTS.DELETE_GROUP) && group.parent) ?
                                    <i
                                        className="fa fa-trash-o"
                                        data-toggle="tooltip"
                                        title="Delete Group"
                                        onClick={this.handleShowConfirmDelete.bind(this, group.id)}
                                    ></i>
                                    : null
                            }
                        </span>
                    </td>
                </tr>
            )
        })
    }

    handleOpendialogConfirm(value, fullName, parentGroup, nearestParent, employeeId) {
        this.setState({
            fullName,
            parentGroup,
            isOpenConfirmTransfer: value,
            nearestParent: nearestParent ? _.find(this.state.groups, x => x.id == nearestParent.id) : nearestParent,
            isOpenDialogAddEditOrganization: false,
            employeeId
        });
    }

    handleTransferEmployee(employeeTransfer) {
        loadingIndicatorActions.showAppLoadingIndicator();
        transferEmployee(this.state.employeeId, employeeTransfer, (err, value) => {
            loadingIndicatorActions.hideAppLoadingIndicator();
            if (err) {
                toastr.error(RS.getString(err.message), RS.getString('ERROR'));
            }
            else {
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                this.setState({ isOpenDialogTransfer: false });
            }
        });
    }

    renderBody() {
        return (
            <div className="row row-body">
                <table className="tree metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('GROUP')}
                            </MyTableHeader>
                            {
                                LOCALIZE.COUNTRY != COUNTRY.VN ?
                                    <MyTableHeader>
                                        {RS.getString('COUNTRY_STATE')}
                                    </MyTableHeader>
                                    : null
                            }
                            <MyTableHeader>
                                {RS.getString('MANAGED_BY')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ACTION2')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.renderTreegrid(this.state.groups)}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="page-container page-employees employee-organization">
                <div className="header">
                    {RS.getString('ORGANIZATION')}
                </div>
                {this.renderFilter()}
                {this.renderBody()}
                <DialogConfirm
                    style={{ 'widthBody': '400px' }}
                    title={RS.getString('DELETE')}
                    isOpen={this.state.showDeleteGroup}
                    handleSubmit={this.handleDeleteGroup}
                    handleClose={() => this.setState({ showDeleteGroup: false })}
                >
                    <span>{RS.getString('P140')}</span>
                </DialogConfirm>
                <DialogAlert
                    modal={false}
                    icon={require("../../../../images/warning.png")}
                    isOpen={this.state.isOpenDeleteDenied}
                    title={RS.getString('ACTION_DENIED')}
                    handleClose={() => { this.setState({ isOpenDeleteDenied: false }); }}
                >
                    {this.errorMessage == 'This_group_is_referred_by_other_objects' ? RS.getString('P141') : ''}
                </DialogAlert>
                <DialogAddEditOrganization
                    isOpen={this.state.isOpenDialogAddEditOrganization}
                    handleClose={() => this.setState({ isOpenDialogAddEditOrganization: false })}
                    mode={this.state.mode}
                    groups={this.state.groups}
                    loadStates={this.props.loadStates}
                    states={this.props.states}
                    groupSelected={this.state.groupSelected}
                    editEmployeeOrganization={this.props.editEmployeeOrganization}
                    addNewEmployeeOrganization={this.props.addNewEmployeeOrganization}
                    curEmp={this.props.curEmp}
                    handleOpendialogConfirm={this.handleOpendialogConfirm}
                    handleLoadAllGroup={this.handleLoadAllGroup}
                    ref={input => this.DialogAddEditOrganization = input}
                />
                <DialogConfirm
                    title={RS.getString('CONFIRM')}
                    isOpen={this.state.isOpenConfirmTransfer}
                    handleClose={() => this.setState({ isOpenConfirmTransfer: false, isOpenDialogAddEditOrganization: true })}
                    handleSubmit={() => {
                        this.DialogAddEditOrganization.clearDefaultManagedBy();
                        this.setState({ isOpenDialogTransfer: true, isOpenConfirmTransfer: false });
                    }}
                >
                    <div dangerouslySetInnerHTML={{
                        __html: `${RS.getString('CONFIRM_TRANSFER', [this.state.fullName, this.state.parentGroup], Option.FIRSTCAP)}`
                    }} />
                </DialogConfirm>
                <DialogEmployeeTransfer
                    isOpen={this.state.isOpenDialogTransfer}
                    handleCancel={() => this.setState({ isOpenDialogTransfer: false })}
                    label={[RS.getString('SAVE'), RS.getString('CANCEL')]}
                    handleTransferEmployee={this.handleTransferEmployee}
                    groups={this.state.groups}
                    disabled={true}
                    defaultValue={this.state.nearestParent}
                />
            </div>
        );
    }
}

EmployeeOrganization.propTypes = propTypes;

export default EmployeeOrganization;