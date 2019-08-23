import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonSelect from '../../elements/CommonSelect.component';
import TextArea from '../../elements/TextArea';
import TextView from '../../elements/TextView';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import * as apiHelper from '../../../utils/apiHelper';
import RS from '../../../resources/resourceManager';
import { HANDSET_STATUS, WAITING_TIME } from '../../../core/common/constants';

const propTypes = {
};
class TransferHandsetComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    validateForm() {
        let rs = true;
        const fields = ['transfer'];
        let self = this;

        fields.forEach(function (field) {
            if (!self[field].validate()) {
                rs = false;
            }
        });
        return rs;
    }

    getValues() {
        return {
            storeLoc: this.transfer.getValue(),
            notes: this.note.getValue(),
            updatedBy: this.props.employeeInfo
        };
    }

    render() {
        let { contactDetail } = this.props.employeeInfo;
        let storeLocOptions = _.cloneDeep(this.props.storeLocs);
        return (
            <div className="transfer-handset-step">
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
                            _.map(this.props.transferData.handsets, (handset, index) => {
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
                <div className="transfer-info-title uppercase">{RS.getString("TRANSFER_INFORMATION")}</div>
                <div className="row">
                    <div className="col-md-6 col-xs-12 ">
                        <TextView
                            title={RS.getString('UPDATED_BY')}
                            image={contactDetail.photoUrl ? API_FILE + contactDetail.photoUrl : require("../../../images/avatarDefault.png")}
                            value={_.get(contactDetail, 'fullName', '')}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <CommonSelect
                            required
                            ref={(input) => this.transfer = input}
                            title={RS.getString('TRANSFER')}
                            propertyItem={{ label: 'nameStore', value: 'id' }}
                            options={storeLocOptions}
                            clearable={false}
                            searchable={false}
                            value={this.props.transferData.storeLoc}
                            onChange={this.props.handleSelectStoreLoc}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <TextArea
                            title={RS.getString('NOTES')}
                            line={1}
                            ref={(input) => this.note = input}
                            defaultValue={this.props.transferData.notes}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TransferHandsetComponent.propTypes = propTypes;
export default TransferHandsetComponent;