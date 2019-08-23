import React, { PropTypes } from 'react';
import DiaLog from '../../elements/Dialog';
import RS from '../../../resources/resourceManager';
import RaisedButton from '../../../components/elements/RaisedButton';
import CommonSelect from '../../elements/CommonSelect.component';
import FilterSearch from '../../elements/Filter/FilterSearch';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import MyCheckBox from '../../elements/MyCheckBox';
import dateHelper from '../../../utils/dateHelper';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME, TIMEFORMAT } from '../../../core/common/constants';
import * as localStorageKey from '../../../constants/localStorageKey'

export default React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleSave: PropTypes.func.isRequired,
        handlePublish: PropTypes.func.isRequired,
        employees: PropTypes.array.isRequired,
        groups: PropTypes.array,
        block: PropTypes.object,
        updateBlock: PropTypes.func,
        searchAssignmentAvailability: PropTypes.func,
        scheduleGroup: PropTypes.object,
        loadManagedGroups: PropTypes.func.isRequired,
    },

    getInitialState: function () {
        return {
            filter: {
                groupIds: [],
                fullName: ''
            },
            showSelected: false,
            requestOvertime: false
        };
    },
    componentDidMount: function () {
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.props.searchAssignmentAvailability(this.state.filter);
        }, WAITING_TIME);
        let groupIds = localStorage.getItem(localStorageKey.SCHEDULE_ASSIGN_REPLACE_CHOICE);
        if (groupIds){
            groupIds = JSON.parse(groupIds);
            this.setState({
                filter:{
                    ...this.state.filter,
                    groupIds: groupIds
                }
            })
        }
    },

    componentWillReceiveProps: function (nextProps) {
        let filter = _.cloneDeep(this.state.filter);
        if (!this.props.isOpen && nextProps.isOpen) {
            let groupIds = localStorage.getItem(localStorageKey.SCHEDULE_ASSIGN_REPLACE_CHOICE);
            if (groupIds){
                groupIds = JSON.parse(groupIds);
                this.setState({
                    filter:{
                        ...this.state.filter,
                        groupIds: groupIds
                    }
                })
            }else{
                groupIds = [nextProps.scheduleGroup.id]
            }
            filter = _.assign({}, filter, {
                groupIds: groupIds,
                jobRoleId: nextProps.block.jobMissing.id,
                fullName: ''
            });
            this.setState({
                filter
            }, () => {
                this.props.loadManagedGroups(true);
                this.props.searchAssignmentAvailability(filter);
            });
        }
        if (this.props.isOpen && !nextProps.isOpen) {
            this.state = {
                filter: {
                    groupIds: [],
                    fullName: ''
                },
                showSelected: false,
                requestOvertime: false
            }
        }
        if (!_.isEqual(this.props.employees, nextProps.employees)) {
            this.setState({
                employees: this.mapEmployeeAssignments(nextProps.employees),
                showSelected: false
            });
        }

        if (!_.isEqual(this.props.block, nextProps.block)) {
            this.setState({
                filter: {
                    ...filter,
                    jobRoleId: nextProps.block.jobMissing.id
                }
            });
        }

        if (!_.isEqual(this.props.scheduleGroup, nextProps.scheduleGroup)) {
            this.setState({
                filter: {
                    ...filter,
                    groupIds: [nextProps.scheduleGroup.id]
                }
            });
        }
    },

    mapEmployeeAssignments: function (employees) {
        let employeesAssign = _.cloneDeep(employees);
        let block = _.cloneDeep(this.props.block);

        return _.map(employeesAssign, function (employee) {
            if (block.assignments.employees.find(x => x.id == employee.employee.id)) {
                employee.selected = true;
            }

            employee.selected = employee.selected || false;

            return employee;
        });
    },

    componentWillUnmount() {
        this.setState({
            filter: {
                ...this.state.filter,
                groupIds: [this.props.scheduleGroup.id]
            },
            employees: []
        })
    },

    handleCancel: function () {
        this.handleClose();
    },

    handleClose: function () {
        this.setState({
            showSelected: false,
            employees: this.props.employees,
            filter: {
                ...this.state.filter,
                fullName: ''
            },
            requestOvertime: false
        });

        this.props.handleClose();
    },

    handleSave: function () {
        this.handleClose();
        this.props.handleSave();
    },

    handlePublish: function () {
        this.handleClose();
        this.props.handlePublish();
    },

    handleFilterChange: function (groups) {
        let groupIds = [];

        if (groups && groups.length > 0) {
            _.map(groups, function (group) {
                groupIds.push(group.id);
            });
        } else {
            groupIds = [this.props.scheduleGroup.id]
        }

        this.setState({
            filter: {
                ...this.state.filter,
                groupIds: groupIds
            }
        });
        localStorage.setItem(localStorageKey.SCHEDULE_ASSIGN_REPLACE_CHOICE, JSON.stringify(groupIds));
        setTimeout(() => {
            this.props.searchAssignmentAvailability(this.state.filter);
        }, 0);
    },

    handleSearch: function (value) {
        this.setState({
            filter: {
                ...this.state.filter,
                fullName: value
            }
        }, this.handleSearchCallback);
    },

    handleAddAssignEmployee: function (index, checked) {
        let block = _.clone(this.props.block);
        let employees = [...this.state.employees];

        employees[index].selected = checked;

        if (checked) {
            block.assignments.employees.push(employees[index].employee);
        } else {
            block.assignments.employees = block.assignments.employees.filter(x => x.id != employees[index].employee.id);
        }

        if (block.assignments.employees.length === 0) {
            if (this.state.showSelected) {
                this.setState({
                    showSelected: false,
                    employees: this.mapEmployeeAssignments(this.props.employees)
                });
            }
        } else {
            this.setState({
                employees
            });
        }

        this.props.updateBlock(block);
    },

    setClassSelected: function (employeeId) {
        let block = _.clone(this.props.block);
        let className = '';

        if (block.assignments.employees) {
            if (block.assignments.employees.find(x => x.id == employeeId)) {
                className = className + ' is--selected';
            }
        }

        let disableCheckbox = this.disableCheckbox(employeeId);

        if (disableCheckbox) {
            className = className + ' is--disable';
        }

        return className;
    },

    getNumberEmployeeRequired: function () {
        let block = _.clone(this.props.block);

        let assigns = block.assignments.employees ? block.assignments.employees.length : 0;

        return [
            assigns,
            block.jobMissing.number,
            block.jobMissing.name
        ];
    },

    getNumberEmployeeAssigned: function () {
        let block = _.clone(this.props.block);
        return block.assignments.employees ? block.assignments.employees.length : 0;
    },

    toggleShowHideSelected: function () {
        let showSelected = _.clone(this.state.showSelected);
        let block = _.clone(this.props.block);

        this.setState({
            showSelected: !showSelected
        });

        if (this.state.showSelected) {
            let employees = _.cloneDeep(this.props.employees);

            let newEmployess = _.map(employees, (employee) => {
                if (block.assignments.employees.find(x => x.id == employee.employee.id)) {
                    employee.selected = true;
                }

                return employee;
            });

            this.setState({
                employees: this.mapEmployeeAssignments(newEmployess)
            });
        } else {
            let employees = _.clone(this.state.employees);
            let newEmployess = [];

            _.map(employees, (employee) => {
                if (block.assignments.employees.find(x => x.id == employee.employee.id)) {
                    newEmployess.push(employee);
                }
            });

            this.setState({
                employees: newEmployess
            });
        }
    },

    disableCheckbox: function (employeeId) {
        let block = _.clone(this.props.block);
        let numberRequire = block.jobMissing.number;
        let assigned = this.getNumberEmployeeAssigned();

        if (assigned === numberRequire) {
            if (block.assignments.employees.find(x => x.id == employeeId)) {
                return false;
            }

            return true;
        }
    },

    handleChangeOvertimeCheckBox: function (checked) {
        this.setState({ requestOvertime: checked });
    },

    renderEmployee: function (employeeAssign, index) {
        return (
            <tr
                key={index}
                className={this.setClassSelected(employeeAssign.employee.id)}
                onClick={this.handleAddAssignEmployee.bind(this, index, !employeeAssign.selected)}>
                <td className="primary-avatar-cell text-left">
                    <MyCheckBox
                        key={employeeAssign.employee.id}
                        className="filled-in"
                        id={employeeAssign.employee.id}
                        defaultValue={employeeAssign.selected || false}
                        disabled={this.disableCheckbox(employeeAssign.employee.id)}
                    />

                    <img
                        src={employeeAssign.employee.photoUrl ? (API_FILE + employeeAssign.employee.photoUrl) : require("../../../images/avatarDefault.png")} />
                    <div className="cell-content">
                        <div className="main-label">
                            {employeeAssign.employee.fullName}
                        </div>
                        <div className="sub-label">
                            {employeeAssign.employee.jobRole.name}
                        </div>
                    </div>
                </td>
                <td>
                    {_.get(employeeAssign, 'employee.group.name')}
                </td>
                <td>
                    {
                        _.get(employeeAssign, "contracts.length") > 0 ? _.map(employeeAssign.contracts, (contract, index) => (
                            <div key={index}>{contract.identifier}</div>
                        )) : null
                    }
                </td>
                <td>
                    {
                        _.get(employeeAssign, "locations.length") > 0 ? _.map(employeeAssign.locations, (location, index) => (
                            <div key={index}>{location.name}</div>
                        )) : null
                    }
                </td>
                <td>
                    {
                        _.get(employeeAssign, "shiftsOnThisDay.length") > 0 ? _.map(employeeAssign.shiftsOnThisDay, (shift, index) => {
                            return (
                                <div key={index}>{shift.startTimeString + ' - ' + shift.endTimeString}</div>
                            );
                        }) : RS.getString('NO_SHIFT')
                    }
                </td>
            </tr>
        );
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={0}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.handleCancel}
            />,
            <RaisedButton
                key={1}
                label={RS.getString('SAVE')}
                onClick={this.handleSave}
                disabled={this.props.block.assignments.employees.length === 0 || this.state.requestOvertime}
            />,
            this.state.requestOvertime ?
                <RaisedButton
                    key={2}
                    label={RS.getString('NEXT')}
                    onClick={this.props.handleNext}
                    disabled={this.props.block.assignments.employees.length === 0}
                /> :
                <RaisedButton
                    key={2}
                    label={RS.getString('NOTIFY')}
                    onClick={this.handlePublish}
                    disabled={this.props.block.assignments.employees.length === 0}
                />
        ];

        return (
            <DiaLog
                style={{ widthBody: '80%' }}
                title={RS.getString('EMPLOYEES')}
                actions={actions}
                modal={true}
                isOpen={this.props.isOpen}
                handleClose={this.handleClose}
                className="schedule-assign-employee"
            >
                <div className="dialog-parent">
                    <div className="dialog-child">
                        <div className="row">
                            <div className="col-md-6 col-sm-6">
                                <CommonSelect
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.groups}
                                    allowOptionAll={true}
                                    multi={true}
                                    value={this.state.filter.groupIds}
                                    onChange={(value) => this.handleFilterChange(value)}
                                    disabled={this.state.showSelected}
                                />
                            </div>
                            <div className="col-md-6 col-sm-6 pull-right">
                                <FilterSearch
                                    ref={(filterSearch) => this.filterSearch = filterSearch}
                                    handleSearchChange={this.handleSearch}
                                    defaultValue={this.state.filter.fullName}
                                    disabled={this.state.showSelected}
                                ></FilterSearch>
                            </div>
                        </div>
                        <div className="row employees-assign">
                            <div className="col-md-12 dialog-content-wrapper">
                                <div className="dialog-content">
                                    <table className="metro-table">
                                        <MyHeader>
                                            <MyRowHeader>
                                                <MyTableHeader>{RS.getString("EMPLOYEE")}</MyTableHeader>
                                                <MyTableHeader>{RS.getString("GROUP")}</MyTableHeader>
                                                <MyTableHeader>{RS.getString("ACTIVE_CONTRACT")}</MyTableHeader>
                                                <MyTableHeader>{RS.getString("LOCATION")}</MyTableHeader>
                                                <MyTableHeader>{RS.getString("SHIFT_ON_THIS_DAY")}</MyTableHeader>
                                            </MyRowHeader>
                                        </MyHeader>
                                        <tbody>
                                            {
                                                this.state.employees ?
                                                    this.state.employees.map((employee, index) => (
                                                        this.renderEmployee(employee, index)
                                                    ))
                                                    : null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-12 request-overtime">
                                <div className="col-md-6 ot-checkbox">
                                    <MyCheckBox
                                        ref={(input) => { this.createOTCheckbox = input; }}
                                        onChange={this.handleChangeOvertimeCheckBox}
                                        label={RS.getString('CREATE_OVERTIME_REQUEST')}
                                    />
                                </div>
                                <div className="col-md-6 employees-selected">
                                    {
                                        <a className="show-selected" href="javascript: void(0)"
                                            onClick={
                                                this.props.block.assignments.employees && this.props.block.assignments.employees.length > 0 ? this.toggleShowHideSelected : ''}>
                                            {this.state.showSelected ? RS.getString('SHOW_ALL') : RS.getString('SHOW_EMPLOYEE_SELECTED', this.getNumberEmployeeAssigned())}
                                        </a>
                                    }
                                    {' ' + RS.getString('SHOW_EMPLOYEE_REQUIRED', this.getNumberEmployeeRequired())}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DiaLog>
        );
    }
});