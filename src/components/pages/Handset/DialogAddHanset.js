import React from 'react';
import _ from 'lodash';
import RS, { Option } from '../../../resources/resourceManager';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../elements/CommonSelect.component';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import TextView from '../../elements/TextView';
import { COUNTRY } from '../../../core/common/config';
import * as toastr from '../../../utils/toastr';
import * as handsetActions from '../../../actionsv2/handsetActions';
import { HANDSET_TYPE_ALL } from '../../../core/common/constants';
import { ADD_HANDSET } from '../../../constants/actionTypes';
import { showAppLoadingIndicator, hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

class DialogAddHanset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handsetTypes: []
        };
        this.getValue = this.getValue.bind(this);
    }

    componentDidMount() {
        handsetActions.getHandsetTypes(this.handleCallbackActions.bind(this, HANDSET_TYPE_ALL));
    }

    handleCallbackActions = (actionType, err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        }
        else {
            switch (actionType) {
                case HANDSET_TYPE_ALL: {
                    this.setState({ handsetTypes: result.handsetTypes });
                    break;
                }
                case ADD_HANDSET: {
                    toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                    this.props.handleClose();
                    this.props.callback();
                    break;
                }
                default: break;
            }
        }
    }

    getValue() {
        let handset = {};
        const fields = [
            'handsetType', 'identifier', 'imei', 'receivedDate', 'serialNumber', 'storeLocs', 'notes',
            'vendor', 'purchaseOrder', 'unitPrice', 'wanrrantyEndDate'
        ];

        for (let field of fields) {
            handset[field] = this[field].getValue();
        }
        handset.updatedBy = this.props.curEmp.employeeId;
        this.setState({ handset })
        return _.cloneDeep(handset);
    }

    validateForm() {
        let rs = true;
        const fieldValidates = ['handsetType', 'imei', 'serialNumber', 'receivedDate', 'unitPrice'];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    }

    submitAddHandset() {
        if (this.validateForm()) {
            showAppLoadingIndicator();
            handsetActions.addHandset(this.getValue(), this.handleCallbackActions.bind(this, ADD_HANDSET))
        }
    }

    renderPayRateHoursCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("AUD");
            case COUNTRY.VN:
                return RS.getString("VND");
        }
    }

    render() {
        let handsetConstraints = getHandsetsConstraints();
        let updatedByPhotoUrl = _.get(this.props.employeeInfo, 'photoUrl', '');
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={<span className="label-icon">{RS.getString('SAVE_CLOSE')}</span>}
                onClick={() => this.submitAddHandset()}
            />,
            <RaisedButton
                key={2}
                label={<span className="label-icon">{RS.getString('SAVE_CONTINUE')}</span>}
                onClick={() => { }}
            />
        ];
        return (
            <Dialog
                title={(RS.getString('NEW_HANDSET', null, Option.UPPER))}
                isOpen={this.props.isOpen}
                handleClose={this.props.handleClose}
                style={{ widthBody: '579px' }}
                actions={actions}
                modal
            >
                <div className="dialog-add-handset">
                    <div className="handset-container-first">
                        <div className="title-header">{RS.getString('HANDSET_INFORMATION', null, Option.UPPER)}</div>
                        <div className="row">
                            <div className="col-md-6">
                                <CommonSelect
                                    required
                                    title={RS.getString('HANDSET_TYPE')}
                                    placeholder={RS.getString('SELECT_HANDSET_TYPE')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'type', value: 'id' }}
                                    options={this.state.handsetTypes}
                                    name="handsetType"
                                    ref={(input) => this.handsetType = input}
                                    constraint={handsetConstraints.handsetType}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonTextField                                    
                                    title={RS.getString('HANDSET_ID')}
                                    id="identifier"
                                    ref={(input) => this.identifier = input}                                    
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <CommonTextField
                                    required
                                    title={RS.getString('IMEI')}
                                    id="imei"
                                    ref={(input) => this.imei = input}
                                    constraint={handsetConstraints.imei}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonTextField
                                    required
                                    title={RS.getString('SERIAL_NUMBER')}
                                    id="serialNumber"
                                    ref={(input) => this.serialNumber = input}
                                    constraint={handsetConstraints.serialNumber}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <TextView
                                    disabled
                                    title={RS.getString('UPDATED_BY')}
                                    image={updatedByPhotoUrl ? API_FILE + updatedByPhotoUrl : require("../../../images/avatarDefault.png")}
                                    value={_.get(this.props.employeeInfo, 'fullName', '')}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('RECEIVED_DATE')}
                                    ref={(input) => this.receivedDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="receivedDate"
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    defaultValue={new Date()}
                                    constraint={handsetConstraints.receivedDate}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <CommonSelect
                                    title={RS.getString('STORE_LOC')}
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'nameStore', value: 'id' }}
                                    options={this.props.storeLocs}
                                    name="storeLocs"
                                    value={this.props.storeLocs[0] || ''}
                                    ref={(input) => this.storeLocs = input}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonTextField
                                    title={RS.getString('NOTES')}
                                    id="notes"
                                    ref={(input) => this.notes = input}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="handset-container-second">
                        <div className="title-header">{RS.getString('PURCHASE_WARRANTY', null, Option.UPPER)}</div>
                        <div className="row">
                            <div className="col-md-6">
                                <CommonTextField
                                    title={RS.getString('VENDOR')}
                                    id="vendor"
                                    ref={(input) => this.vendor = input}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonTextField
                                    title={RS.getString('PO')}
                                    id="purchaseOrder"
                                    ref={(input) => this.purchaseOrder = input}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <CommonTextField
                                    title={RS.getString('UNIT_PRICE')}
                                    id="unitPrice"
                                    ref={(input) => this.unitPrice = input}
                                    addon={<span> {this.renderPayRateHoursCurrency()}</span>}
                                    constraint={handsetConstraints.unitPrice}
                                />
                            </div>
                            <div className="col-md-6">
                                <CommonDatePicker
                                    title={RS.getString('WANRRANTY_END_DATE')}
                                    ref={(input) => this.wanrrantyEndDate = input}
                                    hintText="dd/mm/yyyy"
                                    id="wanrrantyEndDate"
                                    orientation="top auto"
                                    language={RS.getString("LANG_KEY")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }

}

export default DialogAddHanset;