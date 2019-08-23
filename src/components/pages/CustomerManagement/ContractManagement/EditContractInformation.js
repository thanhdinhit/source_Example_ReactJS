import React, { PropTypes } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';
import RS, { Option } from '../../../../resources/resourceManager';
import { COUNTRY } from '../../../../core/common/config';
import { WAITING_TIME } from '../../../../core/common/constants';
import { getContractConstraints } from '../../../../validation/contractConstraints';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';

class EditContractInformation extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            startDate: null
        }
        this.constrants = getContractConstraints();

        this.renderContractValueCurrency = this.renderContractValueCurrency.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.contract.startDate, nextProps.contract.startDate)) {
            this.setState({ startDate: nextProps.contract.startDate });
        }
    }

    getValue() {
        let fields = {};
        _.forEach(['startDate', 'endDate'], field => {
            fields[field] = this[field].getValue();
        });
        return fields;
    }

    validate() {
        let rs = true;
        const fieldValidates = [
            'startDate', 'endDate'
        ];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        if (!rs) {
            Promise.delay(200).then(() => {
                let errorDiv = $('.has-error').first();
                if (errorDiv.length) {
                    let scrollPos = errorDiv.offset().top - 100;
                    $('html, body').animate({ scrollTop: scrollPos }, WAITING_TIME);
                }
            });
        }
        return rs;
    }

    handleChangeStartDate(value) {
        this.setState({ startDate: value });
        this.props.handleChangeStartDate(value);
        setTimeout(() => {
            this.endDate && this.endDate.validate();
        }, 200);
    }

    handleChangeEndDate(value) {
        this.props.handleChangeEndDate(value);
    }

    renderContractValueCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("AUD");
            case COUNTRY.VN:
                return RS.getString("VND");
        }
    }

    render() {
        let currency = null;
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                currency = RS.getString("AUD");
                break;
            case COUNTRY.VN:
                currency = RS.getString("VND");
                break;
        }
        this.constrants.endDate.datetime.earliest = this.state.startDate || null;
        return (
            <div className="new-contract-info-container">
                <div className="new-contract-title uppercase" >{RS.getString('CONTRACT_INFORMATION')}</div>
                <div className="contract-information-preview">
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <div className="row">
                                <div className="col-xs-3 field-title-edit">
                                    {RS.getString("CONTRACT_ID")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.props, 'contract.identifier')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("CUSTOMER")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.props, 'contract.customer.customerName')}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("GROUP")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.props, 'contract.group.name')}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("EST_CONTRACT_RATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.props, 'contract.ratePrice') + ' ' + currency + " " + RS.getString(_.get(this.props, 'contract.rateType'), null, Option.LOWER)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title-edit">
                                    {RS.getString("START_DATE")}:
                                </div>
                                <div className="col-xs-9">
                                    <CommonDatePicker
                                        ref={(input) => this.startDate = input}
                                        hintText="dd/mm/yyyy"
                                        id="startDate"
                                        constraint={this.constrants.startDate}
                                        defaultValue={this.props.contract.startDate}
                                        orientation="bottom auto"
                                        language={RS.getString("LANG_KEY")}
                                        onChange={this.handleChangeStartDate}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title-edit">
                                    {RS.getString("END_DATE")}:
                                </div>
                                <div className="col-xs-9">
                                    <CommonDatePicker
                                        ref={(input) => this.endDate = input}
                                        hintText="dd/mm/yyyy"
                                        id="endDate"
                                        constraint={this.constrants.endDate}
                                        defaultValue={this.props.contract.endDate}
                                        orientation="bottom auto"
                                        language={RS.getString("LANG_KEY")}
                                        onChange={this.handleChangeEndDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EditContractInformation.propTypes = {
}

export default EditContractInformation;