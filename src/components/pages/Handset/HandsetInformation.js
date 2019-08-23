import React from 'react';
import RS, { Option } from "../../../resources/resourceManager";
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import TextView from '../../elements/TextView';
import CommonSelect from '../../elements/CommonSelect.component';
import { TOASTR, QUERY_STRING, WAITING_TIME, getHandsetStatusOptions, HANDSET_STATUS } from '../../../core/common/constants';
import { getEditHandsetConstraints } from '../../../validation/editHandsetConstraints';

class HandsetInformation extends React.Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    getValue() {
        let fields = ['serialNumber', 'imei'];
        let handsetInfo = {};
        _.forEach(fields, field => {
            handsetInfo[field] = this[field] && this[field].getValue();
        })
        return handsetInfo;
    }

    validate() {
        let fields = ['serialNumber', 'imei'];
        let isValid = true;
        _.forEach(fields, field => {
            if (this[field] && !this[field].validate()) {
                isValid = false;
            }
        })
        return isValid;
    }

    handleChange() {
        let hasChange = this.getValue().serialNumber != this.props.handset.serialNumber ||
            this.getValue().imei != this.props.handset.imei;
        this.props.handleChange && this.props.handleChange(hasChange);
    }

    render() {
        let { handset } = this.props;
        let canEdit = handset.status == HANDSET_STATUS.IN_STOCK;
        let editHandsetConstraints = getEditHandsetConstraints();
        return (
            <div className="handset-information">
                <div className="information-title">{RS.getString('HANDSET_INFORMATION')}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <CommonTextField
                            id="handsetType"
                            title={RS.getString('HANDSET_TYPE')}
                            fullWidth
                            defaultValue={_.get(handset, 'type.type')}
                            disabled
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <CommonTextField
                            id="handsetId"
                            title={RS.getString('HANDSET_ID')}
                            fullWidth
                            defaultValue={_.get(handset, 'identifier', '')}
                            disabled
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6">
                        <CommonTextField
                            required={canEdit}
                            id="serialNumber"
                            ref={input => this.serialNumber = input}
                            title={RS.getString('SERIAL_NUMBER')}
                            fullWidth
                            defaultValue={handset.serialNumber}
                            constraint={editHandsetConstraints.serialNumber}
                            onChange={this.handleChange}
                            disabled={!canEdit}
                        />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <CommonTextField
                            required={canEdit}
                            id="imei"
                            ref={input => this.imei = input}
                            title={RS.getString('IMEI')}
                            fullWidth
                            defaultValue={handset.imei}
                            constraint={editHandsetConstraints.imei}
                            onChange={this.handleChange}
                            disabled={!canEdit}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <CommonSelect
                            title={RS.getString('STORE_LOC')}
                            propertyItem={{ label: 'nameStore', value: 'id' }}
                            options={handset.storeLoc ? [handset.storeLoc] : []}
                            name="storeLocs"
                            value={handset.storeLoc || ''}
                            disabled
                        />
                    </div>
                </div>
                <hr />
            </div >
        )
    }
}

export default HandsetInformation;