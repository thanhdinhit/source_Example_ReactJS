import React from 'react';
import RS, { Option } from "../../../resources/resourceManager";
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { getEditHandsetConstraints } from '../../../validation/editHandsetConstraints';
import { COUNTRY } from '../../../core/common/config';
import { HANDSET_STATUS } from '../../../core/common/constants';
import DateHelper from '../../../utils/dateHelper';

class PurchaseAndWarrantyHandset extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    renderUnitPriceCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("AUD");
            case COUNTRY.VN:
                return RS.getString("VND");
        }
    }

    getValue() {
        let result = {}
        let fields = ['vendor', 'purchaseOrder', 'unitPrice', 'warrantyEndDate'];
        _.forEach(fields, field => {
            result[field] = this[field] && this[field].getValue();
        })
        return result;
    }

    handleChange() {
        let fields = ['vendor', 'purchaseOrder', 'unitPrice'];
        let values = this.getValue();
        let hasChange = false;
        _.forEach(fields, field => {
            if (this.props.handset[field] != values[field]) {
                hasChange = true;
            }
        })
        if (!DateHelper.isEqualDate(this.props.handset.warrantyEndDate, values.warrantyEndDate)) {
            hasChange = true;
        }
        this.props.handleChange && this.props.handleChange(hasChange);
    }

    render() {
        let { handset } = this.props;
        let editHandsetConstraints = getEditHandsetConstraints();
        let canEdit = handset.status == HANDSET_STATUS.IN_STOCK;
        return (
            <div className="purchase-waranty-handset">
                <div className="purchase-warranty-title">{RS.getString('PURCHASE_WARRANTY')}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <CommonTextField
                            id="vendor"
                            title={RS.getString('VENDOR')}
                            fullWidth
                            defaultValue={handset.vendor}
                            disabled={!canEdit}
                            ref={input => this.vendor = input}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6">
                        <CommonTextField
                            id="purchaseOrder"
                            title={RS.getString('PO')}
                            fullWidth
                            defaultValue={handset.purchaseOrder}
                            disabled={!canEdit}
                            ref={input => this.purchaseOrder = input}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <CommonTextField
                            type="text"
                            title={RS.getString('UNIT_PRICE')}
                            id="unitPrice"
                            defaultValue={handset.unitPrice ? handset.unitPrice.toString() : ''}
                            ref={(input) => this.unitPrice = input}
                            addon={<span> {this.renderUnitPriceCurrency()}</span>}
                            disabled={!canEdit}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <CommonDatePicker
                            title={RS.getString('WARRANTY_END_DATE')}
                            ref={(input) => this.warrantyEndDate = input}
                            hintText="dd/mm/yyyy"
                            id="warrantyEndDate"
                            defaultValue={handset.warrantyEndDate}
                            endDate="0d"
                            orientation="top auto"
                            language={RS.getString("LANG_KEY")}
                            disabled={!canEdit}
                            onBlur={this.handleChange}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PurchaseAndWarrantyHandset;