import React, { PropTypes } from 'react';
import _ from 'lodash';
import DiaLog from '../../elements/Dialog';
import RS from '../../../resources/resourceManager';
import RaisedButton from '../../../components/elements/RaisedButton';
import CommonSelect from '../../elements/CommonSelect.component';
import FilterSearch from '../../elements/Filter/FilterSearch';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import dateHelper from '../../../utils/dateHelper';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME, TIMEFORMAT } from '../../../core/common/constants';
import * as localStorageKey from '../../../constants/localStorageKey'

export default React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func,
        handleAdd: PropTypes.func,
        employees: PropTypes.array.isRequired,
        groups: PropTypes.array.isRequired,
        block: PropTypes.object,
        updateBlock: PropTypes.func,
        searchReplacementAvailability: PropTypes.func,
        scheduleGroup: PropTypes.object,
        jobRole: PropTypes.object
    },

    getInitialState: function () {
        return {
            filter: {
                groupIds: [],
                fullName: ''
            },
            employeeSelected: null
        };
    },

    componentDidMount: function () {
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            this.props.searchReplacementAvailability(_.cloneDeep(this.state.filter));
        }, WAITING_TIME);
        let groupIds = localStorage.getItem(localStorageKey.SCHEDULE_ASSIGN_REPLACE_CHOICE);
        if (groupIds) {
            groupIds = JSON.parse(groupIds);
            this.setState({
                filter: {
                    ...this.state.filter,
                    groupIds: groupIds
                }
            })
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            let filter = { ...this.state.filter };
            let groupIds = localStorage.getItem(localStorageKey.SCHEDULE_ASSIGN_REPLACE_CHOICE);
            if (groupIds) {
                groupIds = JSON.parse(groupIds);
                this.setState({
                    filter: {
                        ...this.state.filter,
                        groupIds: groupIds
                    }
                })
            } else {
                groupIds = [_.get(nextProps, 'scheduleGroup.id')]
            }

            filter = {
                ...filter,
                groupIds: groupIds,
                jobRoleId: _.get(nextProps, 'jobRole.id')
            };
     
            this.setState({ filter });
            setTimeout(() => {
                this.props.searchReplacementAvailability(_.cloneDeep(this.state.filter));
            }, 300);
        }
    },

    handleCancel: function () {
        this.handleClose();
    },

    handleClose: function () {
        this.setState({
            filter: {
                groupIds: [this.props.scheduleGroup.id],
                jobRoleId: this.props.jobRole.id,
                fullName: ''
            }
        });

        this.props.handleClose();
    },

    handleAdd: function () {
        let assignee = _.cloneDeep(this.state.employeeSelected);
        const employee = assignee.employee;
        employee.shifts = assignee.shifts;
        this.props.handleAdd(employee);
        this.handleClose();
        this.setState({ employeeSelected: null });
    },

    handleFilterChange: function (groups) {
        let groupIds = [];

        if (groups && groups.length > 0) {
            _.map(groups, function (group) {
                groupIds.push(group.id);
            });
        } else {
            groupIds = [this.props.scheduleGroup.id];
        }

        this.setState({
            filter: {
                ...this.state.filter,
                groupIds: groupIds
            }
        }, () => {
            setTimeout(() => {
                this.props.searchReplacementAvailability(_.cloneDeep(this.state.filter));
            }, 0);
        });
    },

    handleSearch: function (value) {
        this.setState({
            filter: {
                ...this.state.filter,
                fullName: value
            }
        });

        this.handleSearchCallback(value);
    },

    handleSelectEmployee: function (index) {
        this.setState({ employeeSelected: this.props.employees[index] });
    },

    renderEmployee: function (employeeAssign, index) {
        return (
            <tr
                key={index}
                className={employeeAssign.employee.id === _.get(this.state.employeeSelected, 'employee.id') ? 'is--selected' : ''}
                onClick={this.handleSelectEmployee.bind(this, index)} >
                <td className="primary-avatar-cell text-left">
                    <img
                        src={employeeAssign.employee.photoUrl ?
                            (API_FILE + employeeAssign.employee.photoUrl) : require("../../../images/avatarDefault.png")} />
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
                        !_.isEmpty(employeeAssign.contracts) ? _.map(employeeAssign.contracts, (contract, index) => (
                            <div key={index}>{contract.identifier}</div>
                        )) : null
                    }
                </td>
                <td>
                    {
                        !_.isEmpty(employeeAssign.locations) ? _.map(employeeAssign.locations, (location, index) => (
                            <div key={index}>{location.name}</div>
                        )) : null
                    }
                </td>
                <td>
                    {
                        !_.isEmpty(employeeAssign.shiftOnThisDay) ? _.map(employeeAssign.shiftOnThisDay, (shift, index) => {
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
                label={RS.getString('OK')}
                onClick={this.handleAdd}
                disabled={!this.state.employeeSelected}
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
                                />
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
                                                this.props.employees ?
                                                    this.props.employees.map((employee, index) => (
                                                        this.renderEmployee(employee, index)
                                                    ))
                                                    : null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DiaLog>
        );
    }
});