import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import debounceHelper from '../../../utils/debounceHelper';
import * as apiHelper from '../../../utils/apiHelper';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import ItemsDisplayPerPage from '../../elements/ItemsDisplayPerPage';
import { browserHistory } from 'react-router';
import RIGHTS from '../../../constants/rights';
import RS, { Option } from '../../../resources/resourceManager';
import Pagination from '../../elements/Paginate/Pagination';
import DialogConfirm from '../../elements/DialogConfirm';
import FilterMore from '../../elements/Filter/FilterMore';
import FilterSearch from '../../elements/Filter/FilterSearch';
import FilterModal from '../../elements/Filter/FilterModal';
import DropdownButton from '../../elements/DropdownButton';
import CommonSelect from '../../elements/CommonSelect.component';
import FilterMoreCommonSelect from '../../elements/Filter/FilterMoreCommonSelect';
import FilterMoreAvatarSelect from '../../elements/Filter/FilterMoreAvatarSelect';
import FilterMoreCommonTextField from '../../elements/Filter/FilterMoreCommonTextField';
import FilterMoreDateTime from '../../elements/Filter/FilterMoreDateTime';
import PopoverIcon from '../../elements/PopoverIcon/PopoverIcon';
import * as toastr from '../../../utils/toastr';
import {
  DATE, TIMEFORMAT, getTerminationType, WAITING_TIME,
  getGenderOptions, EMPLOYEE_STATUS, getStatusOptions, FILTER_DATE, IMPORT,
  EXPORT, QUERY_STRING, WORKING_TIME_TYPE, LOCATION_TYPE
} from '../../../core/common/constants';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import ImportContainer from '../../../containers/Import/ImportContainer';
import _ from 'lodash';
import ExportEmployeeContainer from '../../../containers/export/ExportEmployeesContainer';
import dateHelper from '../../../utils/dateHelper';
import ShowHideColumn from '../../elements/table/ShowHideColumn';
import FilterAddress from '../../elements/FilterAddress';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import * as arrayHelper from '../../../utils/arrayHelper'

const redirect = getUrlPath(URL.EMPLOYEES);
export default React.createClass({
  propTypes: {

  },
  getInitialState: function () {
    let { query } = this.props.location;
    let paginationParams = ['order_by', 'is_desc', 'page_size', 'page'];
    let defaultParams = ['jobRole', 'group', 'employeeType', 'status'];
    let filter = this.getFilterFromUrl();

    this.queryString = {
      order_by: query.order_by ? query.order_by : 'createdDate',
      is_desc: query.is_desc == 'false' ? false : true,
      page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
      page: parseInt(query.page) ? parseInt(query.page) : 0,
      searchText: query.searchText
    };

    this.queryString = this.convertFilterToQueryString(this.queryString, filter);
    let fields = _.keys(filter);

    let filterMore = _.without(fields, _.concat(paginationParams, defaultParams));
    return {
      open: false,
      filterEmployee: {
        filterSearch: '',
        prefilter: filter,
        filter: filter,
        prefilterMore: filterMore,
        filterMore: filterMore
      },
      columns: this.getInitialColumns(),
      employee: undefined,
      isOpenDialogDelete: false,
      isMultiSelect: false,
      isOpenFilterEmployee: false,
      isOpenDialogImport: false,
      checkIsOpenFilter: false,
      isOpenExportDialog: false
    };
  },
  handleTouchTap: function () {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  },
  handleRequestClose: function () {
    this.setState({
      open: false,
    });
  },
  componentDidMount: function () {
    LoadingIndicatorActions.showAppLoadingIndicator();
    this.props.loadAllEmployee(this.queryString, redirect);
    this.handleSearchCallback = debounceHelper.debounce(function () {
      this.queryString.page = 0;
      this.handleFilterParamsChange();
      this.props.loadAllEmployee(this.queryString, redirect);
    }, WAITING_TIME);
  },

  componentDidUpdate: function () {
    LoadingIndicatorActions.hideAppLoadingIndicator();
    if (this.props.payload.success) {
      toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
      this.props.resetState();
    }
    if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
      toastr.error(this.props.payload.error.message, RS.getString('ERROR'))
      this.props.resetError();
    }
  },

  queryString: {
    order_by: 'createdDate',
    is_desc: true,
    page_size: QUERY_STRING.PAGE_SIZE,
    page: 0,
  },

  listSortActions: [
    { id: 'SortBy_First_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'FIRST_NAME']) },
    { id: 'SortBy_Last_Name', name: RS.getString('SORT_BY_ITEM', ['SORT_BY', 'LAST_NAME']) }
  ],

  getFilterFromUrl: function () {
    let { query } = this.props.location;

    let queryParams = _.cloneDeep(query);

    if (!queryParams.status) {
      queryParams.status = apiHelper.getQueryStringListParams([EMPLOYEE_STATUS.ACTIVE]);
    }

    let filter = {
      filterSearch: query.searchText,
      jobRole: apiHelper.convertQueryStringToList(query.jobRoleIds),
      group: apiHelper.convertQueryStringToList(query.groupIds),
      location: apiHelper.convertQueryStringToList(query.locationIds),
      identifier: query.identifier,
      gender: apiHelper.convertQueryStringToList(query.gender, false),
      street: query.street,
      address: {
        districts: parseInt(query.districtIds) ? parseInt(query.districtIds) : undefined,
        cities: parseInt(query.cityIds) ? parseInt(query.cityIds) : undefined,
        states: parseInt(query.stateIds) ? parseInt(query.stateIds) : undefined
      },
      postCode: query.postCode,
      email: query.email,
      birthday: dateHelper.convertQueryStringToDate(query.birthday),
      workingMobile: query.workingMobile,
      privateMobile: query.privateMobile,
      startDate: dateHelper.convertQueryStringToDate(query.startDate),
      employeeType: apiHelper.convertQueryStringToList(query.employeeTypeIds),
      status: apiHelper.convertQueryStringToList(queryParams.status, false),
      userRole: apiHelper.convertQueryStringToList(query.userRoleIds),
      employeeJobSkill: apiHelper.convertQueryStringToList(query.employeeJobSkillIds),
      terminatedDate: dateHelper.convertQueryStringToDate(query.terminatedDate),
      terminationReason: apiHelper.convertQueryStringToList(query.terminationReason),
      terminationType: apiHelper.convertQueryStringToList(query.terminationType, false)
    };

    return arrayHelper.formatFilterFromUrl(filter)
  },

  handleFilterParamsChange: function () {
    let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
    }).join('&');
    browserHistory.replace(getUrlPath(URL.EMPLOYEES) + '?' + paramsString);
  },

  handleOpenPopup: function (id, isApproved) {
    this.setState({
      open: true,
      isApproved: isApproved,
      currentLeaveId: id,
      reason: ''
    });
  },
  handleOpenPopupFilter: function () {
    this.setState({
      openFilter: true
    });
  },
  handleSortClick: function (index, columnNameInput, directionInput) {
    let columnName = '';
    switch (columnNameInput) {
      case 'fullName':
        columnName = 'fullName';
        break;
      case 'group':
        columnName = 'group';
        break;
      case 'status':
        columnName = 'status';
        break;
      case 'SortBy_First_Name':
        columnName = 'firstName';
        break;
      case 'SortBy_Last_Name':
        columnName = 'lastName';
        break;
      case 'gender':
        columnName = 'gender';
        break;
      case 'employee_type':
        columnName = 'type.id';
        break;
      default:
        return null;
    }
    if (columnName === '')
      return null;
    this.queryString.order_by = columnName;
    this.queryString.is_desc = directionInput != 1;
    this.queryString.page = 0;
    this.handleFilterParamsChange();
    this.props.loadAllEmployee(this.queryString, redirect);
  },
  handleChangeDisplayPerPage: function (pageSize) {
    this.queryString.page_size = pageSize;
    this.queryString.page = 0;
    this.handleFilterParamsChange();
    this.props.loadAllEmployee(this.queryString, redirect);
  },
  handlePageClick: function (page) {
    this.queryString.page = page - 1;
    this.handleFilterParamsChange();
    this.props.loadAllEmployee(this.queryString, redirect);
  },
  handleChange: function (employee, e, name) {
    switch (name) {
      case "Delete": this.handleDelete(employee); break;
      case "Edit": this.handleEdit(employee); break;
      default:
        return null;
    }
  },
  handleEdit: function (employee) {
    browserHistory.push(getUrlPath(URL.EMPLOYEE, { employeeId: employee.id }))
  },
  handleDelete: function (employee) {
    this.setState({ isOpenDialogDelete: true, employee: employee });
  },
  handleCloseDialog: function () {
    this.setState({ isOpenDialogDelete: false });
  },
  handleDeleteEmployee: function () {
    this.props.deleteEmployee(this.state.employee, this.queryString, redirect);
    this.state.employee = undefined;
    this.handleCloseDialog();
  },
  handleNewEmployee: function () {
    this.props.resetState()
    browserHistory.push(getUrlPath(URL.NEW_EMPLOYEE))
  },
  handleImportExport: function (id) {
    if (id == 'Import') {
      this.setState({ isOpenDialogImport: true });
    }
    else if (id === EXPORT) {
      this.setState({
        isOpenExportDialog: true
      });
    }
  },
  //--- EXPORT---
  handleCloseExportDialog: function () {
    this.setState({
      isOpenExportDialog: false
    });
  },

  //-- FILTER --//
  handleOpenFilterEmployee: function () {
    this.setState({ isOpenFilterEmployee: true });
    this.handleGetData();
  },
  handleGetData: function () {
    if (!this.state.checkIsOpenFilter) {
      this.setState({ checkIsOpenFilter: true })
      setTimeout(() => {
        this.props.loadJobRolesSetting({});
        this.props.loadAllGroup({});
        this.props.loadLocations({});
        this.props.loadRoles({});
        this.props.loadAllBaseEmployee();
        this.props.loadAllEmployeeTypes({});
        this.props.loadCities();
        this.props.loadDistricts();
        this.props.loadStates();
        this.props.loadSkillsSetting({});
        this.props.getTerminationReason({});
      }, 0)
    }
  },
  handleSearch: function (value) {
    this.queryString.searchText = value;
    this.setState({
      filterEmployee: {
        ...this.state.filterEmployee,
        filterSearch: value
      }
    })
    this.handleSearchCallback(value);
  },
  handleAddFilterMore: function (field) {
    this.setState({
      filterEmployee: {
        ...this.state.filterEmployee,
        filterMore: [...this.state.filterEmployee.filterMore, field]
      }
    });
  },
  handleRemoveFilterMore: function (field) {
    let filter = _.cloneDeep(this.state.filterEmployee.filter);
    _.unset(filter, field);
    this.setState({
      filterEmployee: {
        ...this.state.filterEmployee,
        filter,
        filterMore: _.filter(this.state.filterEmployee.filterMore, (filter) => filter != field)
      }
    });
  },
  handleFilterChange: function (field, data) {
    this.setState({
      filterEmployee: {
        ...this.state.filterEmployee,
        filter: {
          ...this.state.filterEmployee.filter,
          [field]: data
        }
      }
    });
  },
  handleResetFilter: function () {
    this.setState({
      filterEmployee: {
        prefilter: {},
        filter: {},
        filterMore: [],
        prefilterMore: []
      }
    });
  },
  handleCloseFilter: function () {
    this.setState({
      isOpenFilterEmployee: false,
      filterEmployee: {
        ...this.state.filterEmployee,
        filter: this.state.filterEmployee.prefilter,
        filterMore: this.state.filterEmployee.prefilterMore
      },
    })
    this.filterSearch.handleCloseFilter();
  },
  handleApplyFilter: function () {
    this.setState({
      isOpenFilterEmployee: false,
      filterEmployee: {
        ...this.state.filterEmployee,
        prefilter: this.state.filterEmployee.filter,
        prefilterMore: this.state.filterEmployee.filterMore
      }
    });
    this.filterSearch.handleCloseFilter();
    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filterEmployee.filter);
    this.handleFilterParamsChange();
    this.props.loadAllEmployee(this.queryString);
  },
  handleClickShowPopover: function (employee, e) {
    e.stopPropagation()

  },
  convertFilterToQueryString: function (queryString, filter) {
    let query = _.assign({}, queryString);
    query.page = 0;

    query.jobRoleIds = apiHelper.getQueryStringListParams(filter.jobRole);
    query.groupIds = apiHelper.getQueryStringListParams(filter.group);
    query.reportToIds = apiHelper.getQueryStringListParams(filter.reportTo);
    query.locationIds = apiHelper.getQueryStringListParams(filter.location);
    query.identifier = filter.identifier;
    query.gender = apiHelper.getQueryStringListParams(filter.gender);
    query.street = filter.street;
    if (filter.address) {
      query.districtIds = filter.address.districts;
      query.cityIds = filter.address.cities;
      query.stateIds = filter.address.states;
    }
    query.postCode = filter.postCode;
    query.email = filter.email;
    query.birthday = dateHelper.convertDateToQueryString(filter.birthday);
    query.workingMobile = filter.workingMobile;
    query.privateMobile = filter.privateMobile;
    query.startDate = dateHelper.convertDateToQueryString(filter.startDate);
    query.employeeTypeIds = apiHelper.getQueryStringListParams(filter.employeeType);
    query.status = apiHelper.getQueryStringListParams(filter.status);
    query.userRoleIds = apiHelper.getQueryStringListParams(filter.userRole);
    query.employeeJobSkillIds = apiHelper.getQueryStringListParams(filter.employeeJobSkill);
    query.terminatedDate = dateHelper.convertDateToQueryString(filter.terminatedDate);
    query.terminationReason = apiHelper.getQueryStringListParams(filter.terminationReason);
    query.terminationType = apiHelper.getQueryStringListParams(filter.terminationType);

    return query;
  },

  //-- END FILTER --//
  getInitialColumns: function () {
    return [{
      name: 'fullName',
      label: RS.getString('EMPLOYEE'),
      show: true
    }, {
      name: 'address',
      label: RS.getString('ADDRESS'),
      show: false
    }, {
      name: 'date_of_birth',
      label: RS.getString('DATE_OF_BIRTH'),
      show: false
    }, {
      name: 'email',
      label: RS.getString('EMAIL'),
      show: true
    }, {
      name: 'employeeId',
      label: RS.getString('EMPLOYEE_ID'),
      show: false
    }, {
      name: 'employment_start_date',
      label: RS.getString('EMPLOYMENT_START_DATE'),
      show: false
    }, {
      name: 'employment_end_date',
      label: RS.getString('EMPLOYMENT_END_DATE'),
      show: false
    }, {
      name: 'employee_type',
      label: RS.getString('EMPLOYMENT_TYPE'),
      show: false
    }, {
      name: 'gender',
      label: RS.getString('GENDER'),
      show: false
    }, {
      name: 'group',
      label: RS.getString('GROUP'),
      show: true
    }, {
      name: 'working_mobile',
      label: RS.getString('WORKING_MOBILE'),
      show: true
    }, {
      name: 'deskPhone',
      label: RS.getString('DESK_PHONE'),
      show: true
    }, {
      name: 'reportTo',
      label: RS.getString('REPORT_TO'),
      show: false
    }, {
      name: 'status',
      label: RS.getString('STATUS'),
      show: false
    }, {
      name: 'terminated_date',
      label: RS.getString('TERMINATED_DATE'),
      show: false
    }, {
      name: 'termination_reason',
      label: RS.getString('TERMINATION_REASON'),
      show: false
    }, {
      name: 'termination_type',
      label: RS.getString('TERMINATION_TYPE'),
      show: false
    }, {
      name: 'userRole',
      label: RS.getString('USER_ROLE'),
      show: false
    }, {
      name: 'working_location',
      label: RS.getString('WORKING_LOCATION'),
      show: false
    }];
  },
  handleShowHideColumns: function (columns) {
    this.setState({ columns });
  },
  renderDefaultFilter: function (filter) {
    let component = null;
    switch (filter.value) {
      case 'jobRole': {
        component = (
          <CommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.jobRoles}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.jobRole}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
          />
        );
        break;
      }
      case 'group': {
        let groupOptions = this.props.groups;
        component = (
          <CommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={groupOptions}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.group}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
          />
        );
        break;
      }
      case 'employeeType': {
        let employeeTypeOptions = this.props.employeeTypes;
        component = (
          <CommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={employeeTypeOptions}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.employeeType}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
          />
        );
        break;
      }
      case 'status': {
        let statusOptions = getStatusOptions();
        component = (
          <CommonSelect
            multi={true}
            options={statusOptions}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.status || EMPLOYEE_STATUS.ACTIVE}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
          />
        );
        break;
      }
    }
    return React.cloneElement(component, { title: filter.name, field: filter.value, key: filter.name });
  },
  renderFilterMore: function (filter) {
    let component = null;
    switch (filter.value) {
      case 'identifier': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.identifier || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'address': {
        component = (
          <FilterAddress
            states={this.props.states}
            cities={this.props.cities}
            districts={this.props.districts}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            filterEmployee={this.state.filterEmployee.filter}
            handleFilterChange={(value) => this.handleFilterChange(filter.value, _.get(value, 'filter.address'))}
            value={this.state.filterEmployee.filter.address}
          />
        );
        break;
      }
      case 'gender': {
        let genderOptions = getGenderOptions();
        component = (
          <FilterMoreCommonSelect
            multi={true}
            options={genderOptions}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.gender}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'reportTo': {
        component = (
          <FilterMoreAvatarSelect
            multi={true}
            propertyItem={{ label: 'fullName', value: 'id', photoUrl: 'photoUrl' }}
            options={this.props.baseEmployees}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.reportTo}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'street': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.street || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'district': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.districts}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.district}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'city': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.cities}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.city}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'state': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.states}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.state}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'postCode': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.postCode || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'email': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.email || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'birthday': {
        component = (
          <FilterMoreDateTime
            selectedValue={this.state.filterEmployee.filter.birthday || {}}
            onChange={this.handleFilterChange.bind(this, filter.value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'workingMobile': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.workingMobile || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'privateMobile': {
        component = (
          <FilterMoreCommonTextField
            className="common-select"
            defaultValue={this.state.filterEmployee.filter.privateMobile || ''}
            onBlur={(value) => this.handleFilterChange(filter.value, value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
            clear
          />
        );
        break;
      }
      case 'userRole': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.roles}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.userRole}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'startDate': {
        component = (
          <FilterMoreDateTime
            selectedValue={this.state.filterEmployee.filter.startDate || {}}
            onChange={this.handleFilterChange.bind(this, filter.value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'employeeJobSkill': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.skills}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.employeeJobSkill}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'terminatedDate': {
        component = (
          <FilterMoreDateTime
            selectedValue={this.state.filterEmployee.filter.terminatedDate || {}}
            onChange={this.handleFilterChange.bind(this, filter.value)}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'terminationReason': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.terminationReason}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.terminationReason}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'terminationType': {
        let terminationType = getTerminationType();
        component = (
          <FilterMoreCommonSelect
            multi={true}
            options={terminationType}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.terminationType}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'value'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
      case 'location': {
        component = (
          <FilterMoreCommonSelect
            multi={true}
            propertyItem={{ label: 'name', value: 'id' }}
            options={this.props.locations}
            allowOptionAll={true}
            optionAllText={RS.getString('ALL')}
            value={this.state.filterEmployee.filter.location}
            onChange={(value) => this.handleFilterChange(filter.value, _.map(value, 'id'))}
            handleRemoveFilterMore={this.handleRemoveFilterMore.bind(this, filter.value)}
          />
        );
        break;
      }
    }
    return React.cloneElement(component, {
      filterTitle: filter.name,
      displayName: filter.name,
      field: filter.value,
      key: filter.value
    });
  },
  render: function () {
    let menus = [{
      id: IMPORT,
      name: RS.getString('IMPORT'),
      icon: (
        <img src={require("../../../images/import-icon.png")} />
      )
    }, {
      id: EXPORT,
      name: RS.getString('EXPORT'),
      icon: (
        <img src={require("../../../images/export-icon.png")} />
      )
    }]

    let optionsDefault = [
      { name: RS.getString('JOBROLE'), value: 'jobRole' },
      { name: RS.getString('GROUP'), value: 'group' },
      { name: RS.getString('EMPLOYMENT_TYPE'), value: 'employeeType' },
      { name: RS.getString('STATUS'), value: 'status' }
    ];

    let optionsMore = [
      { name: RS.getString('EMPLOYEE_ID'), value: 'identifier' },
      { name: RS.getString('GENDER'), value: 'gender' },
      { name: RS.getString('REPORT_TO'), value: 'reportTo' },
      { name: RS.getString('ADDRESS'), value: 'address' },
      { name: RS.getString('EMAIL'), value: 'email' },
      { name: RS.getString('DATE_OF_BIRTH'), value: 'birthday' },
      { name: RS.getString('WORKING_MOBILE'), value: 'workingMobile' },
      { name: RS.getString('PRIVATE_MOBILE'), value: 'privateMobile' },
      { name: RS.getString('USER_ROLE'), value: 'userRole' },
      { name: RS.getString('EMPLOYMENT_START_DATE'), value: 'startDate' },
      { name: RS.getString('SKILL'), value: 'employeeJobSkill' },
      { name: RS.getString('TERMINATED_DATE'), value: 'terminatedDate' },
      { name: RS.getString('TERMINATION_REASON'), value: 'terminationReason' },
      { name: RS.getString('TERMINATION_TYPE'), value: 'terminationType' },
      { name: RS.getString('WORKING_LOCATION'), value: 'location' }
    ];

    let columns = _.keyBy(this.state.columns, 'name');

    return (
      <div className="page-container page-employees">
        <div className="header">
          {RS.getString('MUL_EMPLOYEE')}
        </div>
        <div className="row row-header">
          <div className="employees-actions-group">
            <FilterSearch
              ref={(filterSearch) => this.filterSearch = filterSearch}
              handleSearchChange={this.handleSearch}
              defaultValue={this.queryString.searchText}
            >
              <FilterModal
                ref={(filterModal) => this.filterModal = filterModal}
                isOpen={this.state.isOpenFilterEmployee}
                handleOpenFilter={this.handleOpenFilterEmployee}
                handleApplyFilter={this.handleApplyFilter}
                handleResetFilter={this.handleResetFilter}
                handleCloseFilter={this.handleCloseFilter}
              >
                {
                  _.map(optionsDefault, (option) => this.renderDefaultFilter(option))
                }
                <FilterMore
                  selectedFilter={this.state.filterEmployee.filterMore || []}
                  handleAddFilterMore={this.handleAddFilterMore}
                  className="row"
                >
                  {
                    _.map(optionsMore, (option) => this.renderFilterMore(option))
                  }
                </FilterMore>
              </FilterModal>
            </FilterSearch>
            <DropdownButton
              isRight
              label="&bull;&bull;&bull;"
              listActions={menus}
              onClick={this.handleImportExport}
            />
            <ShowHideColumn
              columns={this.state.columns}
              onChange={this.handleShowHideColumns}
            />
            {
              this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_EMPLOYEE) ?
                <RaisedButton
                  label={RS.getString('ADD_NEW_EMPLOYEE', null, Option.CAPEACHWORD)}
                  onClick={this.handleNewEmployee}
                /> : null
            }
          </div>
        </div>
        <div className="row row-body">
          <div className="inner-container">
            <table className="metro-table">
              <MyHeader sort={this.handleSortClick}>
                <MyRowHeader>
                  <MyTableHeader
                    name={'fullName'}
                    style={{ minWidth: '200px' }}
                    enableSort
                    listActions={this.listSortActions}
                    show={columns['fullName'].show}
                  >
                    {RS.getString('EMPLOYEE')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'address'}
                    style={{ minWidth: '300px' }}
                    show={columns['address'].show}
                  >
                    {RS.getString('ADDRESS')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'date_of_birth'}
                    style={{ minWidth: '150px' }}
                    show={columns['date_of_birth'].show}
                  >
                    {RS.getString('DATE_OF_BIRTH')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'email'}
                    style={{ minWidth: '200px' }}
                    show={columns['email'].show}
                  >
                    {RS.getString('EMAIL')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'employeeId'}
                    style={{ minWidth: '150px' }}
                    show={columns['employeeId'].show}
                  >
                    {RS.getString('EMPLOYEE_ID')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '120px' }}
                    name={'employment_start_date'}
                    show={columns['employment_start_date'].show}
                  >
                    {RS.getString('START_DATE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '120px' }}
                    name={'employment_end_date'}
                    show={columns['employment_end_date'].show}
                  >
                    {RS.getString('END_DATE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '150px' }}
                    enableSort
                    name={'employee_type'}
                    show={columns['employee_type'].show}
                  >
                    {RS.getString('EMPLOYMENT_TYPE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '100px' }}
                    enableSort
                    name={'gender'}
                    show={columns['gender'].show}
                  >
                    {RS.getString('GENDER')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'group'}
                    enableSort
                    show={columns['group'].show}
                  >
                    {RS.getString('GROUPS')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'working_mobile'}
                    style={{ minWidth: '150px' }}
                    show={columns['working_mobile'].show}
                  >
                    {RS.getString('MOBILE_WORK')}
                  </MyTableHeader>
                  <MyTableHeader
                    name={'deskPhone'}
                    style={{ minWidth: '150px' }}
                    show={columns['deskPhone'].show}
                  >
                    {RS.getString('DESK_PHONE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'reportTo'}
                    enableSort
                    show={columns['reportTo'].show}
                  >
                    {RS.getString('REPORT_TO')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '150px' }}
                    name={'status'}
                    enableSort
                    show={columns['status'].show}
                  >
                    {RS.getString('STATUS')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'terminated_date'}
                    show={columns['terminated_date'].show}
                  >
                    {RS.getString('TERMINATED_DATE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'terminated_reason'}
                    show={columns['termination_reason'].show}
                  >
                    {RS.getString('TERMINATION_REASON')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'termination_type'}
                    show={columns['termination_type'].show}
                  >
                    {RS.getString('TERMINATION_TYPE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '200px' }}
                    name={'userRole'}
                    show={columns['userRole'].show}
                  >
                    {RS.getString('USER_ROLE')}
                  </MyTableHeader>
                  <MyTableHeader
                    style={{ minWidth: '250px' }}
                    name={'terminated_reason'}
                    show={columns['working_location'].show}
                  >
                    {RS.getString('WORKING_LOCATION')}
                  </MyTableHeader>
                </MyRowHeader>
              </MyHeader>
              <tbody>
                {this.props.employees ?
                  this.props.employees.map(function (employee) {
                    let location = '';
                    switch (employee.contactDetail.workingLocationType) {
                      case LOCATION_TYPE.DEPEND_ON_SHIFTS:
                        location = RS.getString("DEPEND_ON_SHIFTS");
                        break;
                      case LOCATION_TYPE.FIELD_SERVICE:
                        location = RS.getString("FIELD_SERVICE");
                        break;
                      case LOCATION_TYPE.LOCATION:
                        location = _.get(employee, 'contactDetail.location.name', '');
                        break;
                    }
                    return (
                      <tr
                        key={employee.id}
                        className="pointer"
                        onClick={this.handleEdit.bind(this, employee)}
                      >
                        {
                          columns['fullName'].show &&
                          <td className={"primary-avatar-cell td-hover"}>
                            {employee.iswarning ?
                              <div className="cell-content-second">
                                <PopoverIcon
                                  message={RS.getString(employee.iswarning)}
                                  ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                  show={true}
                                  iconPath='warning-icon.png'
                                  iconClassName="img-popover"
                                  className="popover-top-right popover-warning"
                                  onClick={this.handleClickShowPopover.bind(this, employee)}
                                />
                              </div> : ''
                            }
                            <div className="avatar-content">
                              <img src={_.get(employee,'contactDetail.photoUrl') ? (API_FILE + employee.contactDetail.photoUrl) : require("../../../images/avatarDefault.png")} />
                              <div className="cell-content">
                                <div className="main-label">
                                  {employee.contactDetail.fullName}
                                </div>
                                <div className="sub-label">
                                  {employee.job.jobRole.name}
                                </div>
                              </div>
                            </div>
                          </td>
                        }
                        {
                          columns['address'].show &&
                          <td className="address-cell">
                            {employee.contactDetail.address}
                          </td>
                        }
                        {
                          columns['date_of_birth'].show &&
                          <td >
                            {dateHelper.formatTimeWithPattern(employee.contactDetail.birthday, DATE.FORMAT)}
                          </td>
                        }
                        {
                          columns['email'].show &&
                          <td className="primary hyperlink-cell">
                            <a onClick={(e) => e.stopPropagation()} href={'mailto:' + employee.contactDetail.email} target="_top">{employee.contactDetail.email}</a>
                          </td>
                        }
                        {
                          columns['employeeId'].show &&
                          <td >
                            {_.get(employee, 'contactDetail.identifier', '')}
                          </td>
                        }
                        {
                          columns['employment_start_date'].show &&
                          <td>
                            {dateHelper.formatTimeWithPattern(employee.contactDetail.startDate, TIMEFORMAT.END_START_TIME)}
                          </td>
                        }
                        {
                          columns['employment_end_date'].show &&
                          <td>
                            {dateHelper.formatTimeWithPattern(employee.contactDetail.endDate, TIMEFORMAT.END_START_TIME) || ''}
                          </td>
                        }
                        {
                          columns['employee_type'].show &&
                          <td>
                            {employee.contactDetail.type.name}
                          </td>
                        }
                        {
                          columns['gender'].show &&
                          <td>
                            {employee.contactDetail.gender}
                          </td>
                        }
                        {
                          columns['group'].show &&
                          <td>
                            {employee.contactDetail.group.name}
                          </td>
                        }
                        {
                          columns['working_mobile'].show &&
                          <td >
                            {RS.formatPhone(employee.contactDetail.workMobile)}
                          </td>
                        }
                        {
                          columns['deskPhone'].show &&
                          <td >
                            {employee.contactDetail.deskPhone}
                          </td>
                        }
                        {
                          columns['reportTo'].show &&
                          <td className="primary-avatar-cell">
                            <img
                              src={_.get(employee, 'contactDetail.group.supervisor.photoUrl') ? (API_FILE + employee.contactDetail.group.supervisor.photoUrl) : require("../../../images/avatarDefault.png")} />
                            <div className="cell-content">
                              <div className="main-label">
                                {_.get(employee,'contactDetail.group.supervisor.fullName')}
                              </div>
                              <div className="sub-label">
                                {_.get(employee,'contactDetail.group.supervisor.jobRole.name')}
                              </div>
                            </div>
                          </td>
                        }
                        {
                          columns['status'].show &&
                          <td className="status-cell">
                            <span className={employee.status == EMPLOYEE_STATUS.ACTIVE ? 'status-active' : employee.status == EMPLOYEE_STATUS.TERMINATED ? 'status-terminated' : ''}>
                              {employee.status}
                            </span>
                          </td>
                        }
                        {
                          columns['terminated_date'].show &&
                          <td className="skill-cell">
                            <span>
                              {employee.terminatedDate ? dateHelper.formatUTCToLocalDate(employee.terminatedDate) : ''}
                            </span>
                          </td>
                        }
                        {
                          columns['termination_reason'].show &&
                          <td className="skill-cell">
                            <span>
                              {_.get(employee, 'terminationReason.name', '')}
                            </span>
                          </td>
                        }
                        {
                          columns['termination_type'].show &&
                          <td>
                            {employee.terminationType}
                          </td>
                        }
                        {
                          columns['userRole'].show &&
                          <td className="skill-cell">
                            <span>
                              {employee.contactDetail.accessRoles[0].name}
                            </span>
                          </td>
                        }
                        {
                          columns['working_location'].show &&
                          <td>
                            {location}
                          </td>
                        }
                      </tr>
                    );
                  }.bind(this)) : []}
              </tbody>
            </table>
          </div>
          {this.props.meta != null && this.props.meta.count > 0 ?
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
          }
          <DialogConfirm title={RS.getString('DELETE_TITLE')}
            isOpen={this.state.isOpenDialogDelete}
            handleSubmit={this.handleDeleteEmployee}
            handleClose={this.handleCloseDialog}>
            <span>{RS.format('CONFIRM_DELETE_EMPLOYEE')}  {this.state.employee ? <b>{this.state.employee.name}</b> : ''} {'?'} </span>
          </DialogConfirm>
          <ImportContainer
            isOpen={this.state.isOpenDialogImport}
            handleClose={() => { this.setState({ isOpenDialogImport: false }) }}
          />
          <ExportEmployeeContainer
            isOpen={this.state.isOpenExportDialog}
            handleClose={this.handleCloseExportDialog}
          />
        </div>
      </div>
    );
  }
});



