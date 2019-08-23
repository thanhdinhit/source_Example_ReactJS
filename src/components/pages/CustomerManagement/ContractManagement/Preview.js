import React, { PropTypes } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';
import RS, { Option } from '../../../../resources/resourceManager';
import { COUNTRY } from '../../../../core/common/config';
import { WAITING_TIME, CUSTOMIZE_SCHEDULE_TEMPLATE, DATE } from '../../../../core/common/constants';
import { getExtension, getName } from '../../../../utils/iconUtils';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { API, URL } from '../../../../core/common/app.routes';
import { getContractConstraints } from '../../../../validation/contractConstraints';
import dateHelper from '../../../../utils/dateHelper';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import WorkingLocation from './WorkingLocation';

class Preview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openDialogAttach: false,
            openDialogConfirm: false,
            contract: _.cloneDeep(props.newContract)
        };

        this.constrants = getContractConstraints();

        this.renderContractInformation = this.renderContractInformation.bind(this);
        this.renderShift = this.renderShift.bind(this);
        this.renderLocationInformation = this.renderLocationInformation.bind(this);
        this.renderAttachments = this.renderAttachments.bind(this);
        this.renderLinkedContracts = this.renderLinkedContracts.bind(this);
        this.renderContractValueCurrency = this.renderContractValueCurrency.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.shiftTemplates, nextProps.shiftTemplates) && nextProps.shiftTemplates && nextProps.shiftTemplates.length) {
            let contract = _.cloneDeep(this.state.contract);
            let shiftTemplate = null;
            if (_.get(contract, 'shiftTemplate.id')) {
                shiftTemplate = _.find(nextProps.shiftTemplates, (item) => item.id == _.get(contract, 'shiftTemplate.id'));
                if (shiftTemplate) {
                    _.each(shiftTemplate.shiftTimes, (item) => {
                        item.isSelected = !!_.find(_.get(this.state, 'contract.shiftTemplate.shiftTimes'), (time) => time.id == item.id);
                    });
                }
            } else {
                shiftTemplate = _.find(nextProps.shiftTemplates, (template) => template.isDefault);
                if (shiftTemplate) {
                    _.each(shiftTemplate.shiftTimes, (item) => {
                        item.isSelected = true;
                    });
                }
            }
            contract.shiftTemplate = shiftTemplate;
            this.setState({ contract });
        }
    }

    validate() {
        let rs = true;
        const fieldValidates = [
            'customer', 'identifier', 'startDate', 'endDate', 'ratePrice'
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

    renderContractInformation() {
        this.constrants.endDate.datetime.earliest = this.state.contract.startDate || null;
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
                                    {_.get(this.state, 'contract.identifier')}
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
                                    {_.get(this.state, 'contract.customer.customerName')}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("GROUP")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.state, 'contract.group.name')}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("EST_CONTRACT_RATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {_.get(this.state, 'contract.ratePrice') + ' ' + currency + " " + RS.getString(_.get(this.state, 'contract.rateType'), null, Option.LOWER)}
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
                                    {dateHelper.formatTimeWithPattern(_.get(this.state, 'contract.startDate'), DATE.FORMAT)}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <div className="row">
                                <div className="col-xs-3 field-title">
                                    {RS.getString("END_DATE")}:
                                </div>
                                <div className="col-xs-9 field-value">
                                    {dateHelper.formatTimeWithPattern(_.get(this.state, 'contract.endDate'), DATE.FORMAT)}
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
                            _.map(_.get(this.state, 'contract.shiftTemplate.shiftTimes'), (item, index) => {
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
                    viewMode={true}
                    contractTime={{
                        startDate: this.props.newContract.startDate,
                        endDate: this.props.newContract.endDate
                    }}
                    jobRoles={this.props.jobRoles}
                    locations={this.props.locations}
                    scheduleTemplate={CUSTOMIZE_SCHEDULE_TEMPLATE}
                    ref={input => this.workingLocationRef = input}
                    shiftTemplate={this.props.newContract.shiftTemplate}
                    workingLocations={this.props.newContract.schedules}
                    flexibleWorkingTimes={this.props.newContract.flexibleSchedules}
                />
            </div>
        )
    }

    renderAttachments() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('ATTACHMENTS')}</div>
                <div className="row attach-body">
                    <div className="attachment-position">
                        {
                            _.map(this.state.contract.attachments, (element, index) => {
                                return (
                                    <div className="col-sm-12 col-md-6 col-lg-3" key={index} >
                                        <div className="document-view">
                                            <img className="icon-type-file" src={require('../../../../images/svg/' + getExtension(element.docUrl))} />
                                            <a className="document-name" target="_blank" href={API_FILE + element.docUrl}>
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
                        _.map(_.get(this.props, 'newContract.links'), (link, index) => {
                            return (
                                <a key={index} target="_blank" href={getUrlPath(URL.CONTRACT, { contractId: link.id })} > {link.identifier}</a>
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

Preview.propTypes = {
}

export default Preview;