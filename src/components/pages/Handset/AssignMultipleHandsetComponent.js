import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonSelect from '../../elements/CommonSelect.component';
import TextArea from '../../elements/TextArea';
import TextView from '../../elements/TextView';
import RaisedButton from '../../elements/RaisedButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import * as apiHelper from '../../../utils/apiHelper';
import RS, { Option } from '../../../resources/resourceManager';
import { HANDSET_STATUS, WAITING_TIME } from '../../../core/common/constants';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import { LOAD_ALL_EMPLOYEE, LOAD_ALL_GROUP } from '../../../constants/actionTypes';

import * as groupActions from '../../../actionsv2/groupActions';
import * as employeeActions from '../../../actionsv2/employeeActions';
import { hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const propTypes = {
};
class AssignMultipleHandsetComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
        groupActions.loadAllGroup({}, this.handleCallbackActions.bind(this, LOAD_ALL_GROUP))
    }

    handleCallbackActions = (actionType, err, result) => {
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"))
        }
        else {
            switch (actionType) {
                case LOAD_ALL_EMPLOYEE: {
                    this.setState({ employees: result.employees });
                    break;
                }
                case LOAD_ALL_GROUP: {
                    this.setState({ groups: result })
                    break;
                }
                default: break;
            }
        }
    }

    validateForm() {
        let rs = true;
        const fieldValidates = ['assignedDate', 'group', 'assignee'];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    }

    getValues() {
        return {
            assignDate: this.assignedDate.getValue(),
            group: this.group.getValue(),
            assignee: this.assignee.getValue(),
            notes: this.note.getValue()
        };
    }

    handleChangeGroup(group) {
        if (_.isEqual(group, this.state.group)) {
            return;
        }
        this.assignee.setValue(null);
        this.setState({ group });
        let groupIds = apiHelper.getQueryStringListParams([group.id]);
        employeeActions.loadAllEmployee({ groupIds }, this.handleCallbackActions.bind(this, LOAD_ALL_EMPLOYEE));
    }

    optionRenderer(option) {
        return (
            <div>
                <img src={_.get(option, 'contactDetail.photoUrl') ? (API_FILE + _.get(option, 'contactDetail.photoUrl')) : require('../../../images/avatarDefault.png')} />
                <div className="avatar-content">
                    <div className="main-label">
                        {_.get(option, 'contactDetail.fullName')}
                    </div>
                    <div className="sub-label">
                        {`${_.get(option, 'job.jobRole.name', '')} | ${RS.getString('ID', null, Option.UPPER)}: ${_.get(option, 'contactDetail.identifier')}`}
                    </div>
                </div>
            </div>
        );
    }

    valueRenderer(option) {
        option.label = _.get(option, 'contactDetail.fullName');
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={_.get(option, 'contactDetail.photoUrl') ? (API_FILE + _.get(option, 'contactDetail.photoUrl'))
                    : require('../../../images/avatarDefault.png')} />
                <span className="avatar-label">{option.label}</span>
            </div>
        );
    }

    render() {
        let handsetConstraints = getHandsetsConstraints();
        let updatedByPhotoUrl = _.get(this.props.employeeInfo, 'contactDetail.photoUrl', '');
        let employeeOptions = this.state.group ? this.state.employees : [];
        return (
            <div className="assign-multiple-handset-step">
                <div className="handset-list-title uppercase">{RS.getString("HANDSET_LIST")}</div>
                <div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader>
                                    {RS.getString('HANDSET_ID')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('HANDSET_TYPE')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('IMEI')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('SERIAL_NUMBER')}
                                </MyTableHeader>
                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                        {
                            _.map(this.props.assignData.handsets, (handset, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{handset.identifier}</td>
                                        <td>{handset.type.type}</td>
                                        <td>{handset.imei}</td>
                                        <td>{handset.serialNumber}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="assign-info-title uppercase">{RS.getString("ASSIGN_INFORMATION")}</div>
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <CommonDatePicker
                            required
                            title={RS.getString('ASSIGNED_DATE')}
                            hintText="dd/mm/yyyy"
                            id="assignedDate"
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                            defaultValue={this.props.assignData.assignDate}
                            constraint={handsetConstraints.handsetAssignDate}
                            ref={(input) => this.assignedDate = input}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <TextView
                            disabled
                            title={RS.getString('UPDATED_BY')}
                            image={updatedByPhotoUrl ? API_FILE + updatedByPhotoUrl : require("../../../images/avatarDefault.png")}
                            value={_.get(this.props.employeeInfo, 'contactDetail.fullName', '')}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <CommonSelect
                            required
                            title={RS.getString('CHOOSE_GROUP')}
                            placeholder={RS.getString('SELECT')}
                            clearable={false}
                            searchable={true}
                            propertyItem={{ label: 'name', value: 'id' }}
                            options={this.state.groups}
                            name="group"
                            onChange={this.handleChangeGroup.bind(this)}
                            constraint={handsetConstraints.group}
                            value={this.props.assignData.group}
                            ref={(input) => this.group = input}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <CommonSelect
                            required
                            className="has-avatar"
                            title={RS.getString('ASSIGNEE')}
                            placeholder={RS.getString('SELECT')}
                            clearable={false}
                            searchable={true}
                            propertyItem={{ label: 'fullName', value: 'id' }}
                            options={employeeOptions}
                            name="assignee"
                            valueRenderer={this.valueRenderer}
                            optionRenderer={this.optionRenderer}
                            constraint={handsetConstraints.assignee}
                            value={this.props.assignData.assignee}
                            ref={(input) => this.assignee = input}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <TextArea
                            title={RS.getString('NOTES')}
                            line={1}
                            defaultValue={this.props.assignData.notes}
                            ref={(input) => this.note = input}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-7">
                        <RaisedButton
                            key="print"
                            className="raised-button-fourth print-asset-button"
                            label={RS.getString('PRINT_ASSET_HANDOVER_FORM')}
                            icon={<img src={require("../../../images/printer.png")} />}
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AssignMultipleHandsetComponent.propTypes = propTypes;
export default AssignMultipleHandsetComponent;