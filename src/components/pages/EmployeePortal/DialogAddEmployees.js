import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../elements/CommonSelect.component';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import MyCheckBox from '../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../elements/MyCheckBoxSpecial';

import RS from '../../../resources/resourceManager';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME } from '../../../core/common/constants';
import * as apiHelper from '../../../utils/apiHelper';

const propTypes = {
    isOpen: PropTypes.bool,
    curEmp: PropTypes.object,
    employees: PropTypes.array,
    selectedEmployees: PropTypes.array,
    locations: PropTypes.array,
    jobRoles: PropTypes.array,
    employeeActions: PropTypes.object,
    jobRoleSettingAction: PropTypes.object,
    locationActions: PropTypes.object,
    handleClose: PropTypes.func,
    handleAddEmployees: PropTypes.func
};

class DialogAddEmployees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            selectedEmployees: [],
            isShowSelected: false,
            searchTxt: ''
        };
        this.queryString = {
            is_desc: true,
            page: 0
        };
        this.types = {
            CUSTOMER: 'CUSTOMER',
            CONTRACT_ID: 'CONTRACT_ID',
            JOBROLE: 'JOBROLE',
            LOCATION: 'LOCATION'
        }
        this.ALL = 'ALL';
        this.handleOk = this.handleOk.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleItemChecked = this.handleItemChecked.bind(this);
        this.handleOnChangeSearchText = this.handleOnChangeSearchText.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.toggleShowHideSelected = this.toggleShowHideSelected.bind(this);
        this.renderValueComponent = this.renderValueComponent.bind(this);
    }

    componentDidMount() {
        this.queryString.reportToIds = apiHelper.getQueryStringListParams([this.props.curEmp.employeeId]);
        if (this.props.isOpen) {
            setTimeout(() => {
                this.props.employeeActions.loadAllEmployee(this.queryString);
                this.props.jobRoleSettingAction.loadJobRolesSetting({});
                this.props.locationActions.loadLocations({});
            }, 300);
        }
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.queryString.page = 0;
            this.props.employeeActions.loadAllEmployee(this.queryString);
        }, WAITING_TIME);
        this.setState({ selectedEmployees: this.props.selectedEmployees || [] })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen && !this.props.isOpen) {
            setTimeout(() => {
                this.props.employeeActions.loadAllEmployee(this.queryString);
                this.props.jobRoleSettingAction.loadJobRolesSetting({});
                this.props.locationActions.loadLocations({});
            }, 300);
        }
        const nextSelectedIds = this.mapToIds(nextProps.selectedEmployees);
        const currentSelectedIds = this.mapToIds(this.props.selectedEmployees);
        if (_.isEqual(nextSelectedIds, currentSelectedIds)) {
            const employees = this.mapEmployeesAndSelectedEmployees(nextProps.employees, this.state.selectedEmployees);
            this.setState({ employees });
        } else {
            const employees = this.mapEmployeesAndSelectedEmployees(this.state.employees, nextProps.selectedEmployees);
            this.setState({ employees, selectedEmployees: nextProps.selectedEmployees });
        }
    }

    mapToIds(employees) {
        return _.map(employees, item => {
            return item.id;
        });
    }

    mapEmployeesAndSelectedEmployees(employees, selecteds) {
        let cloneEmployees = _.cloneDeep(employees);
        let selectedOnEmployees = _.intersectionBy(selecteds, cloneEmployees, 'id');

        let count = 0;
        const selectedNumber = selectedOnEmployees.length;

        _.some(selectedOnEmployees, selected => {
            _.some(cloneEmployees, emp => {
                if (selected.id === emp.id) {
                    emp.selected = true;
                    count++;
                    return true;
                }
            });
            if (count === selectedNumber) {
                return true;
            }
        });
        return cloneEmployees;
    }

    toggleShowHideSelected() {
        let employees = [];
        if (this.state.isShowSelected) {
            employees = this.mapEmployeesAndSelectedEmployees(this.props.employees, this.state.selectedEmployees);
            this.handleSearchCallback();
        } else {
            employees = _.filter(this.state.selectedEmployees, item => {
                item.selected = true;
                return _.includes(item.contactDetail.fullName.toUpperCase(), this.state.searchTxt.toUpperCase());
            });
        }
        this.setState({ employees, isShowSelected: !this.state.isShowSelected });
    }

    handleOnChangeSearchText(e, value) {
        this.queryString.fullName = value;
        this.setState({ searchTxt: value });

        if (this.state.isShowSelected) {
            const employees = _.filter(this.state.selectedEmployees, item => {
                return _.includes(item.contactDetail.fullName.toUpperCase(), value.toUpperCase());
            });
            return this.setState({ employees });
        }
        this.handleSearchCallback();
    }

    getSelectedEmployees() {
        const employees = _.cloneDeep(this.state.selectedEmployees);
        return _.map(employees, item => {
            delete item['selected'];
            return item;
        });
    }

    handleOk() {
        this.props.handleAddEmployees && this.props.handleAddEmployees(this.getSelectedEmployees());
    }

    handleCheckAll(hasItem) {
        const employees = _.cloneDeep(this.state.employees);

        _.forEach(employees, item => {
            item.selected = !hasItem;
        });
        if (!hasItem) {
            const unselectedEmployees = _.filter(this.state.employees, item => !item.selected);
            this.setState({
                selectedEmployees: [...this.state.selectedEmployees, ...unselectedEmployees],
                employees
            });
        } else {
            const selectedCurrentEmployees = _.filter(this.state.employees, 'selected');
            const selectedEmployees = _.differenceBy(this.state.selectedEmployees, selectedCurrentEmployees, 'id');
            this.setState({
                selectedEmployees,
                employees
            });
        }
    }

    handleItemChecked(index, checked) {
        let employees = [...this.state.employees];
        employees[index].selected = checked;

        if (checked) {
            this.setState({
                employees,
                selectedEmployees: [...this.state.selectedEmployees, ...[employees[index]]]
            });
        } else {
            let selectedEmployees = [...this.state.selectedEmployees];
            selectedEmployees = _.filter(selectedEmployees, (item) => {
                return item.id !== employees[index].id;
            });
            this.setState({
                employees,
                selectedEmployees
            });
        }
    }
    handleOnchange(type, value) {
        switch (type) {
            case this.types.CUSTOMER: {
                break;
            }
            case this.types.CONTRACT_ID: {
                break;
            }
            case this.types.LOCATION: {
                this.queryString.locationIds = this.convertToQueryString(value);
                break;
            }
            case this.types.JOBROLE: {
                this.queryString.jobRoleIds = this.convertToQueryString(value);
                break;
            }
        }
        this.handleSearchCallback();
    }

    convertToQueryString(value) {
        return value && (value.id !== this.ALL) ? (apiHelper.getQueryStringListParams([value.id])) : undefined;
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
        const propertyItem = { label: 'name', value: 'id' };
        const locations = [{ id: this.ALL, name: RS.getString('ALL') }, ...this.props.locations];
        const jobRoles = [{ id: this.ALL, name: RS.getString('ALL') }, ...this.props.jobRoles];
        const customers = [{ id: this.ALL, name: RS.getString('ALL') }];
        const contractIds = [{ id: this.ALL, name: RS.getString('ALL') }];

        const actions = [
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
            />,
            <RaisedButton
                key={0}
                label={RS.getString('OK')}
                onClick={this.handleOk}
            />
        ];
        const itemChecked = _.filter(this.state.employees, 'selected').length || 0;
        const cssCheckAll = itemChecked === this.state.employees.length ? "checkbox-special" : "checkbox-special-type2";
        return (
            <Dialog
                style={{ widthBody: '1118px' }}
                isOpen={this.props.isOpen}
                title={RS.getString('ADD_EMPLOYEES', null, 'UPPER')}
                actions={actions}
                handleClose={this.props.handleClose}
                className="dialog-add-employees"
                modal={false}
            >
                <div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-2-5" >
                            <CommonSelect
                                required
                                disabled={this.state.isShowSelected}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                value={customers[0]}
                                options={customers}
                                onChange={this.handleOnchange.bind(this, this.types.CUSTOMER)}
                                valueComponent={this.renderValueComponent.bind(this, this.types.CUSTOMER)}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-2-5" >
                            <CommonSelect
                                required
                                disabled={this.state.isShowSelected}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                value={contractIds[0]}
                                options={contractIds}
                                onChange={this.handleOnchange.bind(this, this.types.CONTRACT_ID)}
                                valueComponent={this.renderValueComponent.bind(this, this.types.CONTRACT_ID)}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-2-5" >
                            <CommonSelect
                                required
                                disabled={this.state.isShowSelected}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                onChange={this.handleOnchange.bind(this, this.types.LOCATION)}
                                valueComponent={this.renderValueComponent.bind(this, this.types.LOCATION)}
                                value={locations[0]}
                                options={locations}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-2-5" >
                            <CommonSelect
                                required
                                disabled={this.state.isShowSelected}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                onChange={this.handleOnchange.bind(this, this.types.JOBROLE)}
                                valueComponent={this.renderValueComponent.bind(this, this.types.JOBROLE)}
                                value={jobRoles[0]}
                                options={jobRoles}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-2-5" >
                            <div className="search" >
                                <CommonTextField
                                    clear
                                    onChange={this.handleOnChangeSearchText}
                                    hintText={RS.getString('SEARCH_BY', 'EMPLOYEE')}
                                    fullWidth
                                    ref={(input) => this.searchText = input}
                                    defaultValue={this.state.searchTxt}
                                />
                                <img className={'img-search img-gray-brightness'} src={require("../../../images/search.png")} />
                            </div>
                        </div>
                    </div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader>
                                    <div className={cssCheckAll}>
                                        <MyCheckBoxSpecial
                                            onChange={this.handleCheckAll.bind(this, itemChecked > 0)}
                                            checked={itemChecked > 0}
                                            className="filled-in"
                                            id="all-employee"
                                        />
                                    </div>
                                </MyTableHeader>
                                <MyTableHeader>{RS.getString('EMPLOYEE')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('GROUP')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('WORKING_LOCATION')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('ADDRESS')}</MyTableHeader>
                                <MyTableHeader className="selected-items">
                                    <span onClick={this.toggleShowHideSelected}>
                                        {this.state.isShowSelected ? RS.getString('SHOW_ALL') : RS.format('SHOW_SELECTED', [this.state.selectedEmployees.length])}
                                    </span></MyTableHeader>
                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                            {this.state.employees ?
                                this.state.employees.map(function (employee, index) {
                                    return (
                                        <tr
                                            key={employee.id}
                                            className={"pointer" + (employee.selected ? ' active' : '')}
                                            onClick={this.handleItemChecked.bind(this, index, !employee.selected)}
                                        >
                                            <td>
                                                <MyCheckBox
                                                    id={'export_column_name' + employee.id}
                                                    defaultValue={employee.selected || false}

                                                />
                                            </td>
                                            <td className="primary-avatar-cell">
                                                <img
                                                    src={employee.contactDetail.photoUrl ?
                                                        (API_FILE + employee.contactDetail.photoUrl) : require("../../../images/avatarDefault.png")}
                                                />
                                                <div className="cell-content">
                                                    <div className="main-label">
                                                        {employee.contactDetail.fullName}
                                                    </div>
                                                    <div className="sub-label">
                                                        {employee.job.jobRole.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td >
                                                {employee.contactDetail.group.name}
                                            </td>
                                            <td >
                                                {_.get(employee, 'contactDetail.location.name', '')}
                                            </td>
                                            <td>
                                                {employee.contactDetail.street}
                                            </td>
                                            <td />
                                        </tr>
                                    );
                                }.bind(this)) : []}
                        </tbody>
                    </table>
                </div>
            </Dialog >
        );
    }
}

DialogAddEmployees.propTypes = propTypes;
export default DialogAddEmployees;