import React, { PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../../../resources/resourceManager';
import { COUNTRY, EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';
import { SCHEDULE_MODE, STATUS, WAITING_TIME, DATETIME, SCHEDULE_TEMPLATES } from '../../../../core/common/constants';
import { getExtension, getName } from '../../../../utils/iconUtils';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { API, URL } from '../../../../core/common/app.routes';
import RIGHTS from '../../../../constants/rights';
import dateHelper from '../../../../utils/dateHelper';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import Breadcrumb from '../../../elements/Breadcrumb';
import CommonSelect from '../../../elements/CommonSelect.component';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import MyCheckBox from '../../../elements/MyCheckBox';
import RaisedButton from '../../../elements/RaisedButton';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogSelectShiftTemplate from '../DialogSelectShiftTemplate';
import WorkingLocation from './WorkingLocation';

class ViewContract extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.renderContractInformation = this.renderContractInformation.bind(this);
        this.renderShift = this.renderShift.bind(this);
        this.renderLocationInformation = this.renderLocationInformation.bind(this);
        this.renderAttachments = this.renderAttachments.bind(this);
        this.renderLinkedContracts = this.renderLinkedContracts.bind(this);
        this.renderContractValueCurrency = this.renderContractValueCurrency.bind(this);
    }

    renderContractInformation() {
        let currency = null;
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                currency = RS.getString("AUD");
                break;
            case COUNTRY.VN:
                currency = RS.getString("VND");
                break;
        }
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('CONTRACT_INFORMATION')}</div>
                <div className="contract-information-preview">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            <div className="row">
                                <div className="col-xs-1 field-title">
                                    {RS.getString("CONTRACT_ID")}:
                                </div>
                                <div className="col-xs-11 field-value">
                                    <strong> {_.get(this.props, 'contract.identifier')}</strong>
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
                                    <strong>{_.get(this.props, 'contract.customer.customerName')}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("GROUP")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    <strong>{_.get(this.props, 'contract.group.name')}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("EST_CONTRACT_RATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    <strong>{_.get(this.props, 'contract.ratePrice') + ' ' + currency + " " + RS.getString(_.get(this.props, 'contract.rateType'), null, Option.LOWER)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("START_DATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    <strong>{dateHelper.formatTimeWithPattern(_.get(this.props, 'contract.startDate'), DATETIME.DATE_CONTRACT)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("END_DATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    <strong>{dateHelper.formatTimeWithPattern(_.get(this.props, 'contract.endDate'), DATETIME.DATE_CONTRACT)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderShift() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('SHIFT')}</div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('SHIFT')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString("WORKING_TIME")}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString("BREAK_TIME")}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString("REGULAR_HOURS")}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            _.map(_.get(this.props, 'contract.shiftTemplate.shiftTimes'), (item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <div className="template-name">
                                                <div className="template-color" style={{ backgroundColor: item.color }} />
                                                <div>{item.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {item.startTime} - {item.endTime}
                                        </td>
                                        <td>
                                            {item.breakTimeFrom ? item.breakTimeFrom + ' - ' + item.breakTimeTo : RS.getString("NONE")}
                                        </td>
                                        <td>
                                            <strong>{item.regularHours + ' ' + RS.getString('HRS')}</strong>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    renderLocationInformation() {
        return (
            <div className="new-contract-info-container" >
                <WorkingLocation
                    viewMode
                    isShowHistory
                    contractTime={{
                        startDate: this.props.contract.startDate,
                        endDate: this.props.contract.endDate
                    }}
                    jobRoles={this.props.jobRoles}
                    locations={this.props.locations}
                    scheduleTemplate={_.find(SCHEDULE_TEMPLATES, (template) => template.id == this.props.contract.scheduleTemplate)}
                    ref={input => this.workingLocationRef = input}
                    shiftTemplate={this.props.contract.shiftTemplate}
                    workingLocations={this.props.contract.schedules}
                    flexibleWorkingTimes={this.props.contract.flexibleSchedules || []}
                />
            </div>
        );
    }

    renderAttachments() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('ATTACHMENTS')}</div>
                <div className="row attach-body">
                    <div className="attachment-position">
                        {
                            _.map(this.props.contract.attachments, (element, index) => {
                                return (
                                    <div className="col-sm-12 col-md-6 col-lg-3" key={index} >
                                        <div className="document-view">
                                            <img className="icon-type-file" src={require('../../../../images/svg/' + getExtension(element.docUrl))} />
                                            <a className="document-name" target="_blank" href={API_FILE + element.docUrl }>
                                                <div>{getName(element.docUrl)}</div>
                                            </a>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderLinkedContracts() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('LINKED_CONTRACTS')}</div>
                <div className="col-xs-12 linked-contracts" >
                    {
                        _.map(_.get(this.props, 'contract.links'), (link, index) => {
                            return (
                                <a key={index} target="_blank" href={getUrlPath(URL.CONTRACT, { contractId: link.linkId })} > {link.contractLinkIdentifier}</a>
                            )
                        })
                    }
                </div>
            </div>
        );
    }

    renderContractValueCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("PAYRATE_HOUR_AU");
            case COUNTRY.VN:
                return RS.getString("PAYRATE_HOUR_VN");
        }
    }

    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <a href={getUrlPath(URL.CONTRACT, { contractId: option.value.value })} target="_blank">{option.value.label}</a>
                </span>
            </div>
        )
    }

    render() {
        return (
            <div className="contract-detail">
                {this.renderContractInformation()}
                {/* {this.renderShift()} */}
                {this.renderLocationInformation()}
                {this.renderAttachments()}
                {this.renderLinkedContracts()}
            </div>
        );
    }
}

ViewContract.propTypes = {
}

export default ViewContract;