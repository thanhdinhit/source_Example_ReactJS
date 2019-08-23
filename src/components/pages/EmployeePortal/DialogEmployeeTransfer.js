import React, { PropTypes } from 'react';

import TextArea from '../../elements/TextArea';
import RS, { Option } from '../../../resources/resourceManager';
import DialogConfirm from '../../elements/DialogConfirm';
import CommonSelect from '../../elements/CommonSelect.component';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import { getEmployeeTransferContraints } from '../../../validation/employeeTransferConstrants';
import { KEY_CODE } from '../../../core/common/constants';

export default React.createClass({
    propTypes: {
        label: PropTypes.array,
        handleTransferEmployee: PropTypes.func.isRequired,
        handleCancel: PropTypes.func,
        isOpen: PropTypes.bool,
        groups: PropTypes.array
    },

    handleTransferEmployee: function () {
        if (!this.validate()) return;
        this.props.handleTransferEmployee(this.getValues());
    },
    handleCancel: function () {
        this.props.handleCancel();
    },

    validate: function () {
        let rs = true;
        const fieldValidates = ['group', 'startDate'];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    },
    getValues: function () {
        let employeeTransfer = {};
        const fields = ['group', 'startDate', 'notes'];
        fields.forEach(function (element) {
            employeeTransfer[element] = this[element].getValue();
        }, this);
        return employeeTransfer;
    },
    handleOnKeyPress: function (e) {
        if (e.keyCode === KEY_CODE.ENTER || e.which === KEY_CODE.ENTER) {
            return this.handleTransferEmployee();
        }
    },
    render: function () {
        const employeeTransferConstraints = getEmployeeTransferContraints();
        let validDateConstraints = employeeTransferConstraints.startDate(this.props.startDate, this.props.endDate)
        const propertyItem = {
            label: 'name',
            value: 'id',
        };
        return (
            <DialogConfirm
                title={RS.getString('EMPLOYEE_TRANSFER', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleTransferEmployee}
                handleClose={this.handleCancel}
                label={this.props.label}
            >
                <div>
                    <CommonSelect
                        id="group"
                        required
                        title={RS.getString('TARGET_GROUP')}
                        clearable={false}
                        searchable={true}
                        name="group"
                        options={this.props.groups}
                        propertyItem={propertyItem}
                        ref={(group) => this.group = group}
                        constraint={employeeTransferConstraints.group}
                        placeholder=""
                        value={this.props.defaultValue || ''}
                        disabled={this.props.disabled}
                    />
                    <CommonDatePicker
                        required
                        title={RS.getString('START_FROM')}
                        ref={(input) => this.startDate = input}
                        id="start-from"
                        constraint={validDateConstraints}
                        orientation="bottom auto"
                        language={RS.getString("LANG_KEY")}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                    />
                    <TextArea
                        title={RS.getString('NOTES')}
                        line={4}
                        ref={(input) => this.notes = input}
                    />
                </div>
            </DialogConfirm>
        );
    }
});