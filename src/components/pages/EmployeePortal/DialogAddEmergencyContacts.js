import React, { PropTypes } from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import DialogConfirm from '../../elements/DialogConfirm';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { getEmergencyConstraints } from '../../../validation/emergencyContactConstraints';
import { KEY_CODE } from '../../../core/common/constants';
import CommonPhoneInput from '../../elements/TextField/CommonPhoneInput.component';
import { COUNTRY } from '../../../core/common/config';
export default React.createClass({
    propTypes: {
        label: PropTypes.array,
        handleAddEmergencyContact: PropTypes.func.isRequired,
        handleCancel: PropTypes.func,
        isOpen: PropTypes.bool
    },

    getInitialState: function () {
        return {
            contactName: '',
            phoneNumber: ''
        };
    },

    handleAddEmergencyContact: function () {
        if (!this.validate()) return;
        this.props.handleAddEmergencyContact(this.getValues());
    },
    handleCancel: function () {
        this.props.handleCancel();
    },

    validate: function () {
        let rs = true;
        const fieldValidates = ['contactName', 'phoneNumber'];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    },
    getValues: function () {
        let contactDetails = {};
        const fields = ['contactName', 'phoneNumber'];
        fields.forEach(function (element) {
            contactDetails[element] = this[element].getValue();
        }, this);
        return contactDetails;
    },
    handleOnKeyPress: function (e) {
        if (e.keyCode === KEY_CODE.ENTER || e.which === KEY_CODE.ENTER) {
            return this.handleAddEmergencyContact();
        }
    },
    showHintText: function() {
        let hintText = '(+84) xxx xxx xxx';
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU: hintText = '(+61) xxx xxx xxx';
                return hintText;
                break;
            case COUNTRY.VN:
                return hintText;
                break;
        }
    },
    render: function () {
        const emergencyConstraints = getEmergencyConstraints();
        return (
            <DialogConfirm
                title={RS.getString('EMERGENCY_CONTACT', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleAddEmergencyContact}
                handleClose={this.handleCancel}
                label={this.props.label}
                modal = {true}
            >
                <div>
                    <CommonTextField
                        id="contactName"
                        required
                        title={RS.getString('CONTACT_NAME')}
                        fullWidth={true}
                        ref={(input) => this.contactName = input}
                        constraint={emergencyConstraints.name}
                        onKeyPress={this.handleOnKeyPress}
                    />
                    <CommonPhoneInput
                        required
                        fullWidth={true}
                        className="emergency-footer"
                        title={RS.getString('PHONE_NUMBER')}
                        ref={(input) => this.phoneNumber = input}
                        constraint={emergencyConstraints.phone}
                        onKeyPress={this.handleOnKeyPress}
                        hintText = {this.showHintText()}
                    />
                </div>
            </DialogConfirm>
        );
    }
});