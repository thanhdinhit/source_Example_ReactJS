import React from 'react';
import RS, { Option } from "../../../resources/resourceManager";
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import TextView from '../../elements/TextView';
import CommonSelect from '../../elements/CommonSelect.component';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import AvatarSelect from '../../elements/AvatarSelect.component';
import RaisedButton from '../../elements/RaisedButton';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import dateHelper from '../../../utils/dateHelper';
import { TOASTR, DATE, WAITING_TIME, getHandsetStatusOptions, HANDSET_STATUS } from '../../../core/common/constants';
import { getEditHandsetConstraints } from '../../../validation/editHandsetConstraints';
import { COUNTRY, MAX_LENGTH_INPUT } from '../../../core/common/config';

import { loadAllGroup } from '../../../actionsv2/groupActions';
import { loadAllEmployee } from '../../../actionsv2/employeeActions';
import { LOAD_EMPLOYEE, LOAD_GROUP, LOAD_ALL_GROUP, LOAD_ALL_EMPLOYEE } from '../../../constants/actionTypes';
import { hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

class HandsetStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            employees: [],
            status: null
        };
        this.renderHandsetStatus = this.renderHandsetStatus.bind(this);
        this.handleChangeGroup = this.handleChangeGroup.bind(this);
        this.renderHistory = this.renderHistory.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.validate = this.validate.bind(this);
    }
    componentDidMount() {
        if (this.props.handset.status) {
            if (this.props.handset.status == HANDSET_STATUS.ASSIGNED) {
                this.handleLoadGroup();
                this.handleLoadEmployee(this.props.handset.assignee.group.id);
            }
            this.setState({ status: this.props.handset.status });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.handset.status !== nextProps.handset.status || this.props.handset.id != nextProps.handset.id) {
            if (nextProps.handset.status == HANDSET_STATUS.ASSIGNED) {
                this.handleLoadGroup();
                this.handleLoadEmployee(nextProps.handset.assignee.group.id);
            }
            this.setState({ status: nextProps.handset.status });
            this.props.changeStatus && this.props.changeStatus(false);
        }
    }

    handleLoadGroup = () => {
        loadAllGroup({}, this.handleCallbackActions.bind(this, LOAD_ALL_GROUP));
    }

    handleLoadEmployee = (groupId) => {
        loadAllEmployee(
            { groupIds: `(${groupId})` },
            this.handleCallbackActions.bind(this, LOAD_ALL_EMPLOYEE)
        );
    }

    handleCallbackActions = (actionType, err, result) => {
        hideAppLoadingIndicator();
        switch (actionType) {
            case LOAD_ALL_EMPLOYEE: {
                this.setState({ employees: result.employees });
                break;
            }
            case LOAD_ALL_GROUP: {
                this.setState({ groups: result });
                break;
            }
            default: break;
        }
    }

    loadEmployeesOfGroup(groupId) {
        loadAllEmployee({ groupIds: `(${groupId})` }, this.handleCallbackActions.bind(this, LOAD_ALL_EMPLOYEE));
    }

    handleChangeStatus = (option) => {
        if (option.value == this.state.status) {
            return;
        }
        switch (option.value) {
            case HANDSET_STATUS.ASSIGNED: {
                this.handleLoadGroup();
            }
        }
        this.setState({ status: option.value });
        this.props.handleChange && this.props.handleChange(option.value !== this.props.handset.status)
    }

    handleChangeGroup(group) {
        this.assignee.setValue(null);
        loadAllEmployee({ groupIds: `(${group.id})` }, this.handleCallbackActions.bind(this, LOAD_ALL_EMPLOYEE));
    }

    getValue() {
        let handsetStatus = { status: this.state.status, assignee: {} };
        if (this.assignee) {
            handsetStatus.assignee = this.assignee.getValue();
            handsetStatus.assignee.group = this.group.getValue();
        }
        let fields = ['lastUpdatedStatusDate', 'notes'];
        _.forEach(fields, field => {
            if (this[field]) {
                handsetStatus[field] = this[field].getValue();
            }
        })

        return handsetStatus;
    }

    validate() {
        let fields = ['lastUpdatedStatusDate', 'group', 'assignee'];
        let isValid = true;
        _.forEach(fields, field => {
            if (this[field] && !this[field].validate()) {
                isValid = false;
            }
        })
        return isValid;
    }

    renderOption(option) {
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={_.get(option, 'contactDetail.photoUrl') ? (API_FILE + option.contactDetail.photoUrl)
                    : require('../../../images/avatarDefault.png')} />
                <span className="avatar-label">{_.get(option, 'contactDetail.fullName')}</span>
            </div>
        );
    }

    renderHistory() {
        return (
            <div className="handset-status-history">
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('DATE')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('STATUS')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('NOTES')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('UPDATED_BY')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            this.props.handset.history &&
                            _.map(this.props.handset.history, (item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {dateHelper.formatTimeWithPattern(item.date, DATE.FORMAT)}
                                        </td>
                                        <td>
                                            {item.status}
                                        </td>
                                        <td>
                                            {item.notes}
                                        </td>
                                        <td className="primary-avatar-cell">
                                            <div className="avatar-content">
                                                <img src={_.get(item.reportedBy, 'photoUrl', '') ? (API_FILE + item.reportedBy.photoUrl)
                                                    : require("../../../images/avatarDefault.png")}
                                                />
                                                <div className="cell-content">
                                                    <div className="main-label">
                                                        {_.get(item.reportedBy, 'fullName', '')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    getHandsetStatusOptions() {
        let statusOptions = getHandsetStatusOptions();
        if (!_.get(this.props.handset, 'status')) {
            return statusOptions;
        }
        switch (this.props.handset.status) {
            case HANDSET_STATUS.ASSIGNED: {
                return _.filter(statusOptions, option => {
                    let valid = false;
                    let options = [HANDSET_STATUS.ASSIGNED, HANDSET_STATUS.IN_STOCK, HANDSET_STATUS.FAULTY, HANDSET_STATUS.LOST];
                    for (let i = 0; i < options.length; i++) {
                        if (option.value == options[i]) {
                            valid = true;
                            break;
                        }
                    }
                    return valid;
                })
            }
            case HANDSET_STATUS.IN_STOCK: {
                return _.filter(statusOptions, option => {
                    return option.value != HANDSET_STATUS.SENT_FOR_REPAIRING;
                })
            }
            case HANDSET_STATUS.FAULTY: {
                return _.filter(statusOptions, option => {
                    let valid = false;
                    let options = [HANDSET_STATUS.FAULTY, HANDSET_STATUS.SENT_FOR_REPAIRING, HANDSET_STATUS.DISPOSED, HANDSET_STATUS.LOST];
                    for (let i = 0; i < options.length; i++) {
                        if (option.value == options[i]) {
                            valid = true;
                            break;
                        }
                    }
                    return valid;
                })
            }
            case HANDSET_STATUS.SENT_FOR_REPAIRING: {
                return _.filter(statusOptions, option => {
                    let valid = false;
                    let options = [HANDSET_STATUS.SENT_FOR_REPAIRING, HANDSET_STATUS.IN_STOCK];
                    for (let i = 0; i < options.length; i++) {
                        if (option.value == options[i]) {
                            valid = true;
                            break;
                        }
                    }
                    return valid;
                })
            }
            case HANDSET_STATUS.DISPOSED:
            case HANDSET_STATUS.LOST: {
                return _.filter(statusOptions, option => {
                    return option.value == this.props.handset.status;
                })
            }
        }
    }
    renderHandsetStatus(status) {
        let { handset } = this.props;
        let editHandsetConstraints = getEditHandsetConstraints();
        let lastedUpdate = handset.history[handset.history.length - 1];
        let statusOptions = this.getHandsetStatusOptions();
        let dateConstraint = lastedUpdate ? editHandsetConstraints.date(lastedUpdate.date) : editHandsetConstraints.date();
        switch (status) {
            case HANDSET_STATUS.ASSIGNED: {
                return (
                    <div className="status-component">
                        <div className="status-component-title">{RS.getString('STATUS')}</div>
                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <CommonSelect
                                    title={RS.getString('CURRENT_STATUS')}
                                    options={statusOptions}
                                    name="status"
                                    clearable={false}
                                    value={_.find(statusOptions, { value: handset.status })}
                                    onChange={this.handleChangeStatus}
                                />
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('ASSIGNED_DATE')}
                                    ref={(input) => this.lastUpdatedStatusDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="warrantyEndDate"
                                    constraint={this.props.hasChange ? dateConstraint : {}}
                                    defaultValue={this.props.hasChange ? new Date() : lastedUpdate ? lastedUpdate.date : new Date()}
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    disabled={!this.props.hasChange}
                                />
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <TextView
                                    disabled
                                    title={RS.getString('UPDATED_BY')}
                                    image={
                                        _.get(this.props.employeeInfo, 'contactDetail.photoUrl') ?
                                            API_FILE + this.props.employeeInfo.contactDetail.photoUrl : require("../../../images/avatarDefault.png")
                                    }
                                    value={_.get(this.props.employeeInfo, 'contactDetail.fullName', '')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <CommonSelect
                                    required
                                    title={RS.getString('GROUP')}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.state.groups}
                                    ref={input => this.group = input}
                                    clearable={false}
                                    name="group"
                                    value={_.get(handset, 'assignee.group.id', null)}
                                    constraint={editHandsetConstraints.group}
                                    onChange={this.handleChangeGroup}
                                    disabled={!this.props.hasChange}
                                />
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <CommonSelect
                                    required
                                    title={RS.getString('ASSIGNEE')}
                                    propertyItem={{ label: 'contactDetail.fullName', value: 'id' }}
                                    options={this.state.employees}
                                    name="assignee"
                                    clearable={false}
                                    searchable
                                    value={_.get(handset, 'assignee.id', null)}
                                    valueRenderer={this.renderOption}
                                    optionRenderer={this.renderOption}
                                    constraint={editHandsetConstraints.assignee}
                                    className="has-avatar"
                                    ref={input => this.assignee = input}
                                    disabled={!this.props.hasChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-8">
                                <CommonTextField
                                    title={RS.getString('NOTES')}
                                    id="notes"
                                    defaultValue={handset.notes}
                                    ref={(input) => this.notes = input}
                                    disabled={!this.props.hasChange}
                                    maxLength={MAX_LENGTH_INPUT.NOTES}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-7">
                                <RaisedButton
                                    key="print"
                                    className="raised-button-first-secondary print-asset-button"
                                    label={RS.getString('PRINT_ASSET_HANDOVER_FORM')}
                                    icon={<img src={require("../../../images/printer.png")} />}
                                    onClick={() => { }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            case HANDSET_STATUS.IN_STOCK: {
                return (
                    <div className="status-component">
                        <div className="status-component-title">{RS.getString('STATUS')}</div>
                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <CommonSelect
                                    title={RS.getString('CURRENT_STATUS')}
                                    options={statusOptions}
                                    name="status"
                                    value={_.find(statusOptions, { value: handset.status })}
                                    clearable={false}
                                    onChange={this.handleChangeStatus}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            case HANDSET_STATUS.FAULTY:
            case HANDSET_STATUS.SENT_FOR_REPAIRING:
            case HANDSET_STATUS.DISPOSED:
            case HANDSET_STATUS.LOST: {
                let dateTitle = '';
                switch (status) {
                    case HANDSET_STATUS.FAULTY: {
                        dateTitle = RS.getString('FAULTY_DATE');
                        break;
                    }
                    case HANDSET_STATUS.SENT_FOR_REPAIRING: {
                        dateTitle = RS.getString('SENT_DATE');
                        break;
                    }
                    case HANDSET_STATUS.DISPOSED: {
                        dateTitle = RS.getString('DISPOSED_DATE');
                        break;
                    }
                    case HANDSET_STATUS.LOST: {
                        dateTitle = RS.getString('LOST_DATE');
                        break;
                    }
                }
                return (
                    <div className="status-component">
                        <div className="status-component-title">{RS.getString('STATUS')}</div>
                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <CommonSelect
                                    title={RS.getString('CURRENT_STATUS')}
                                    options={statusOptions}
                                    name="status"
                                    clearable={false}
                                    value={_.find(statusOptions, { value: handset.status })}
                                    onChange={this.handleChangeStatus}
                                />
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <CommonDatePicker
                                    required
                                    title={dateTitle}
                                    ref={(input) => this.lastUpdatedStatusDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="date"
                                    constraint={this.props.hasChange ? dateConstraint : {}}
                                    defaultValue={this.props.hasChange ? new Date() : lastedUpdate ? lastedUpdate.date : new Date()}
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    disabled={!this.props.hasChange}
                                />
                            </div>
                            <div className="col-xs-12 col-md-4">
                                <TextView
                                    disabled
                                    title={RS.getString('UPDATED_BY')}
                                    image={
                                        _.get(this.props.employeeInfo, 'contactDetail.photoUrl') ?
                                            API_FILE + this.props.employeeInfo.contactDetail.photoUrl : require("../../../images/avatarDefault.png")
                                    }
                                    value={_.get(this.props.employeeInfo, 'contactDetail.fullName', '')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-8">
                                <CommonTextField
                                    title={RS.getString('NOTES')}
                                    id="notes"
                                    defaultValue={handset.notes}
                                    ref={(input) => this.notes = input}
                                    disabled={!this.props.hasChange}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }

    render() {
        if (_.isEmpty(this.props.handset)) {
            return null;
        }
        return (
            <div className="handset-status">
                <div className="status-title">{RS.getString('HANDSET_STATUS')}</div>
                {this.renderHandsetStatus(this.state.status)}
                <div className="history-component">
                    <div className="history-component-title">{RS.getString('HISTORY')}</div>
                    {this.renderHistory()}
                </div>
            </div>
        )
    }
}

export default HandsetStatus;