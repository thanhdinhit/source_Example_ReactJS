import React, { PropTypes } from 'react';
import _ from 'lodash';

import RaisedButton from '../../elements/RaisedButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import TextArea from '../../elements/TextArea';
import TextView from '../../elements/TextView';

import RS from '../../../resources/resourceManager';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';

const propTypes = {
    handset: PropTypes.object,
    employeeInfo: PropTypes.object,
    date: PropTypes.object,
    notes: PropTypes.string
};
class AssignHandsetInfoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.validateForm = this.validateForm.bind(this);
    }

    getValues() {
        let handsetClone = _.cloneDeep(this.props.handset);
        handsetClone.reportedDate = this.date.getValue();
        handsetClone.notes = this.note.getValue();
        return handsetClone;
    }

    validateForm() {
        let rs = true;
        const fields = ['date'];
        let self = this;

        fields.forEach(function (field) {
            if (!self[field].validate()) {
                rs = false;
            }
        });
        return rs;
    }

    render() {
        const { handset } = this.props;
        const { contactDetail } = this.props.employeeInfo;
        const handsetsConstraints = getHandsetsConstraints();
        return (
            <div className="assign-handset-step">
                <div className="handset-type-title uppercase">{this.props.handset.type.type}</div>
                <div className="row">
                    <div className="col-md-6 col-xs-12 ">
                        <TextView
                            title={RS.getString('HANDSET_ID') + ':'}
                            value={handset.identifier}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <TextView
                            title={RS.getString('SERIAL_NUMBER') + ':'}
                            value={handset.serialNumber}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-xs-12 ">
                        <TextView
                            title={RS.getString('IMEI') + ':'}
                            value={handset.imei}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <TextView
                            title={RS.getString('REPORT_BY') + ':'}
                            image={contactDetail.photoUrl ? API_FILE + contactDetail.photoUrl : require("../../../images/avatarDefault.png")}
                            value={_.get(contactDetail, 'fullName', '')}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <CommonDatePicker
                            title={RS.getString('DATE')}
                            required
                            ref={(input) => this.date = input}
                            constraint={handsetsConstraints.handsetAssignDate}
                            startDate={handset.lastUpdatedStatusDate}
                            defaultValue={this.props.date}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <TextArea
                            title={RS.getString('NOTES')}
                            line={1}
                            ref={(input) => this.note = input}
                            defaultValue={this.props.notes}
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
AssignHandsetInfoComponent.propTypes = propTypes;
export default AssignHandsetInfoComponent;