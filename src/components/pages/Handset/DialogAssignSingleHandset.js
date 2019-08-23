import React from 'react';
import _ from 'lodash';
import RS, { Option } from '../../../resources/resourceManager';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../elements/CommonSelect.component';
import TextView from '../../elements/TextView';
import TextArea from '../../elements/TextArea';
import { COUNTRY } from '../../../core/common/config';
import { DATE } from '../../../core/common/constants';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import * as  apiHelper from '../../../utils/apiHelper';
import dateHelper from '../../../utils/dateHelper';
import * as toastr from '../../../utils/toastr';

import * as groupActions from '../../../actionsv2/groupActions';
import * as employeeActions from '../../../actionsv2/employeeActions';
import * as handsetActions from '../../../actionsv2/handsetActions';
import { LOAD_ALL_EMPLOYEE, LOAD_ALL_GROUP, ASSIGNED_HANDSET } from '../../../constants/actionTypes';
import { showAppLoadingIndicator, hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

class DialogAssignSingleHandset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            groups: [],
            date: new Date()
        };
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
        groupActions.loadAllGroup({}, this.handleCallbackActions.bind(this, LOAD_ALL_GROUP))
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

    submitAssignHandset() {
        if (this.validateForm()) {
            let handset = _.cloneDeep(this.props.handset);
            handset.reportedDate = this.assignedDate.getValue();
            handset.notes = this.note.getValue();

            showAppLoadingIndicator();
            handsetActions.assignHandset(
                handset,
                this.assignee.getValue().id,
                this.handleCallbackActions.bind(this, ASSIGNED_HANDSET)
            );
        }
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

    handleCallbackActions = (actionType, err, result) => {
        hideAppLoadingIndicator();
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
                case ASSIGNED_HANDSET: {
                    toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                    this.props.handleClose();
                    this.props.callback();
                }
                default: break;
            }
        }
    }

    renderUnitPriceCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("AUD");
            case COUNTRY.VN:
                return RS.getString("VND");
        }
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
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={<span className="label-icon">{RS.getString('SAVE')}</span>}
                onClick={() => this.submitAssignHandset()}
            />
        ];
        return (
            <Dialog
                title={(RS.getString('ASSIGN_HANDSET', null, Option.UPPER))}
                isOpen={this.props.isOpen}
                handleClose={this.props.handleClose}
                className="dialog-assign-single-handset"
                style={{ widthBody: '579px' }}
                actions={actions}
                modal
            >
                <div>
                    <div className="handset-container-first">
                        <div className="title-header">{RS.getString('HANDSET_INFORMATION', null, Option.UPPER)}</div>
                        <div className="handset-information-preview">
                            <div className="row">
                                <div className="col-md-6 col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-5 field-title">
                                            {RS.getString("HANDSET_TYPE")}
                                        </div>
                                        <div className="col-xs-7 field-value">
                                            {_.get(this.props.handset, 'type.type')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-6 field-title">
                                            {RS.getString("VENDOR")}
                                        </div>
                                        <div className="col-xs-6 field-value">
                                            {_.get(this.props.handset, 'vendor')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-5 field-title">
                                            {RS.getString("IMEI")}
                                        </div>
                                        <div className="col-xs-7 field-value">
                                            {_.get(this.props.handset, 'imei')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-6 field-title">
                                            {RS.getString("PO")}
                                        </div>
                                        <div className="col-xs-6 field-value">
                                            {_.get(this.props.handset, 'purchaseOrder')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-5 field-title">
                                            {RS.getString("SERIAL_NUMBER")}
                                        </div>
                                        <div className="col-xs-7 field-value">
                                            {_.get(this.props.handset, 'serialNumber')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-6 field-title">
                                            {RS.getString("UNIT_PRICE")}
                                        </div>
                                        <div className="col-xs-6 field-value">
                                            {_.get(this.props.handset, 'unitPrice') + ' ' + this.renderUnitPriceCurrency()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-5 field-title">
                                            {RS.getString("STORE_LOC")}
                                        </div>
                                        <div className="col-xs-7 field-value">
                                            {_.get(this.props.handset, 'storeLoc.nameStore')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12" >
                                    <div className="row">
                                        <div className="col-xs-6 field-title">
                                            {RS.getString("WARRANTY_END_DATE")}
                                        </div>
                                        <div className="col-xs-6 field-value">
                                            {dateHelper.formatTimeWithPattern(_.get(this.props.handset, 'warrantyEndDate'), DATE.FORMAT)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="handset-container-second">
                        <div className="title-header">{RS.getString('ASSIGN_INFORMATION', null, Option.UPPER)}</div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('ASSIGNED_DATE')}
                                    hintText="dd/mm/yyyy"
                                    id="assignedDate"
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    defaultValue={this.state.date}
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
                                    ref={(input) => this.assignee = input}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextArea
                                    title={RS.getString('NOTES')}
                                    line={1}
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
                </div>
            </Dialog>
        )
    }

}

export default DialogAssignSingleHandset;