import React, { PropTypes } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';

import * as toastr from '../../../../utils/toastr';
import RS, { Option } from '../../../../resources/resourceManager';
import { COUNTRY, EMPLOYEE_ATTACHFILE, MAX_LENGTH_INPUT } from '../../../../core/common/config';
import { SCHEDULE_MODE, STATUS, WAITING_TIME, getContractRateTypeOptions } from '../../../../core/common/constants';
import { getExtension, getName } from '../../../../utils/iconUtils';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { API, URL } from '../../../../core/common/app.routes';
import { getContractConstraints } from '../../../../validation/contractConstraints';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import CommonSelect from '../../../elements/CommonSelect.component';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import MyCheckBox from '../../../elements/MyCheckBox';
import RaisedButton from '../../../elements/RaisedButton';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogSelectShiftTemplate from '../DialogSelectShiftTemplate';

import fieldValidation from '../../../../validation/common.field.validation';
import * as contractActions from '../../../../actionsv2/contractActions';
import { LOAD_ALL_CONTRACTS } from '../../../../constants/actionTypes';

class GeneralInformation extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contracts: [],
            errorText: '',
            openDialogAttach: false,
            openDialogConfirm: false,
            deleteDocumentSelected: undefined,
            contract: _.cloneDeep(props.newContract)
        };
        this.isLoading = false;
        this.isSubmit = false;
        this.constrants = getContractConstraints();

        this.renderContractInformation = this.renderContractInformation.bind(this);
        this.renderShift = this.renderShift.bind(this);
        this.renderAttachments = this.renderAttachments.bind(this);
        this.renderLinkedContracts = this.renderLinkedContracts.bind(this);
        this.renderContractValueCurrency = this.renderContractValueCurrency.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.handleAttachDocuments = this.handleAttachDocuments.bind(this);
        this.handleSubmitConfirmPopup = this.handleSubmitConfirmPopup.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSelectShiftTemplate = this.handleSelectShiftTemplate.bind(this);
        this.getShiftTemplate = this.getShiftTemplate.bind(this);
    }

    componentWillMount() {
        // if (this.props.shiftTemplates && this.props.shiftTemplates.length) {
        //     let contract = _.cloneDeep(this.state.contract);
        //     contract.shiftTemplate = this.getShiftTemplate(this.props.shiftTemplates);
        //     this.setState({ contract });
        // }
        // let contract = _.cloneDeep(this.state.contract);
        // // contract.shiftTemplate = this.getShiftTemplate(this.props.shiftTemplates);
        // this.setState({ contract });
    }

    componentWillReceiveProps(nextProps) {
        // if (!_.isEqual(this.props.shiftTemplates, nextProps.shiftTemplates) && nextProps.shiftTemplates && nextProps.shiftTemplates.length) {
        //     let contract = _.cloneDeep(this.state.contract);
        //     contract.shiftTemplate = this.getShiftTemplate(nextProps.shiftTemplates);
        //     this.setState({ contract });
        // }

        if (_.isEmpty(nextProps.newContract.group)) {
            this.group.setValue(nextProps.groups[0]);
        }
    }

    getShiftTemplate(shiftTemplates) {
        let contract = _.cloneDeep(this.state.contract);
        let shiftTemplate = null;
        if (_.get(contract, 'shiftTemplate.id')) {
            shiftTemplate = _.find(shiftTemplates, (item) => item.id == _.get(contract, 'shiftTemplate.id'));
            if (shiftTemplate) {
                _.each(shiftTemplate.shiftTimes, (item) => {
                    item.isSelected = !!_.find(_.get(this.state, 'contract.shiftTemplate.shiftTimes'), (time) => time.id == item.id);
                });
            }
        } else {
            shiftTemplate = _.find(shiftTemplates, (template) => template.isDefault);
            if (shiftTemplate) {
                _.each(shiftTemplate.shiftTimes, (item) => {
                    item.isSelected = true;
                });
            }
        }
        return shiftTemplate;
    }

    getValue() {
        // let shiftTemplate = _.cloneDeep(this.state.contract.shiftTemplate);
        // if (shiftTemplate) {
        //     shiftTemplate.shiftTimes = _.filter(shiftTemplate.shiftTimes, (item) => item.isSelected);
        // }
        return {
            customer: this.customer.getValue(),
            identifier: this.identifier.getValue(),
            startDate: this.startDate.getValue(),
            endDate: this.endDate.getValue(),
            group: this.group.getValue(),
            ratePrice: this.ratePrice.getValue(),
            rateType: this.rateType.getValue().value || this.rateType.getValue(),
            // shiftTemplate: shiftTemplate,
            attachments: this.state.contract.attachments,
            links: this.linkedContracts.getValue() ? [this.linkedContracts.getValue()] : [],

        };

    }

    handleSubmitNext = () => {
        if (!this.isLoading) {
            this.validate() && this.props.validateSuccess();
        } else {
            this.isSubmit = true;
        }
    }

    validate() {
        let rs = true;
        const fieldValidates = [
            'customer', 'identifier', 'startDate', 'endDate'
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

    handleSaveAsDraft = () => {
        if (!this.isLoading) {
            return this.validateForSaveAsDraft();
        }
        else {
            return false;
        }
    }

    validateForSaveAsDraft() {
        let rs = true;
        if (!this['customer'].validate() && rs) {
            rs = false;
        }
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

    handleChangeDate(field, value) {
        this.state.contract[field] = value
        this.forceUpdate(()=> this[field] && this[field].validate())
    }

    handleChangeShiftTime(shiftTimeId, checked) {
        let template = _.find(this.props.shiftTemplates, (template) => template.id == _.get(this.state, 'contract.shiftTemplate.id'));
        let contract = _.cloneDeep(this.state.contract);
        if (contract.shiftTemplate) {
            _.each(contract.shiftTemplate.shiftTimes, (item) => {
                if (item.id == shiftTimeId) {
                    item.isSelected = checked;
                }
            })
        }
        this.setState({ contract });
    }

    deleteDocument(element) {
        this.setState({
            openDialogConfirm: true,
            deleteDocumentSelected: element
        })
    }

    handleAttachDocuments(files) {
        let fileAttachs = [];
        files.forEach(function (file) {
            if (file.status == STATUS.COMPLETED) {
                fileAttachs.push({ docUrl: file.url });
            }
        }.bind(this));
        let contract = _.cloneDeep(this.state.contract);
        contract.attachments = [...this.state.contract.attachments, ...fileAttachs]
        this.setState({ contract });
    }

    handleSubmitConfirmPopup() {
        let contract = _.cloneDeep(this.state.contract);
        let attachments = _.filter(contract.attachments, x => x.docUrl != this.state.deleteDocumentSelected.docUrl);
        contract.attachments = attachments;
        this.setState({ openDialogConfirm: false, contract })
    }

    handleSelectShiftTemplate(shiftTemplate) {
        if (!shiftTemplate) {
            return;
        }
        _.each(shiftTemplate.shiftTimes, (item) => {
            item.isSelected = true;
        });
        let contract = _.cloneDeep(this.state.contract);
        contract.shiftTemplate = shiftTemplate;
        this.setState({ contract });
    }

    handleOnBlurContractId = (identifier) => {
        this.isLoading = true;
        contractActions.loadContractsByContractId(identifier, this.handleCallbackActions.bind(this, LOAD_ALL_CONTRACTS))
    }

    handleCallbackActions = (actionType, err, result) => {
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        } else {
            switch (actionType) {
                case LOAD_ALL_CONTRACTS: {
                    let constrants = _.assign({}, fieldValidation.unique([ _.get(result,'contracts[0].identifier')], RS.getString('E131', 'CONTRACT_ID')));
                    this.state.contracts = result.contracts;
                    if(this.identifier )
                    {
                        this.identifier.validate(constrants)
                        this.isLoading = false;
                        if (this.isSubmit) {
                            this.forceUpdate(()=>{
                                this.isSubmit = false;
                                this.validate() && this.props.validateSuccess();
                            })
                        }
                    }
                    break;
                }
            }
        }
    }

    renderContractInformation() {
        this.constrants.endDate.datetime.earliest = this.state.contract.startDate || new Date();
        let rateTypeOptions = getContractRateTypeOptions();

        let identifierContraints = !this.state.contracts.length ? this.constrants.identifier :
            _.assign({}, this.constrants.identifier, fieldValidation.unique([this.state.contracts[0].identifier], RS.getString('E131', 'CONTRACT_ID')));
        let startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('CONTRACT_INFORMATION')}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <CommonSelect
                            required
                            title={RS.getString('CUSTOMER')}
                            placeholder={RS.getString('SELECT')}
                            clearable={false}
                            searchable={false}
                            name="select-customer"
                            value={_.get(this.props, 'newContract.customer')}
                            propertyItem={{ label: 'customerName', value: 'id' }}
                            options={this.props.customers}
                            constraint={this.constrants.customer}
                            ref={(input) => this.customer = input}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <CommonTextField
                            required
                            ref={(input) => this.identifier = input}
                            title={RS.getString('CONTRACT_ID')}
                            id="contractId"
                            defaultValue={_.get(this.props, 'newContract.identifier')}
                            constraint={identifierContraints}
                            // errorText={this.state.errorText}
                            onBlur={this.handleOnBlurContractId}
                            maxLength={MAX_LENGTH_INPUT.CONTRACT_ID}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <CommonDatePicker
                            required
                            title={RS.getString('START_DATE')}
                            ref={(input) => this.startDate = input}
                            hintText="dd/mm/yyyy"
                            id="startDate"
                            constraint={this.constrants.startDate}
                            defaultValue={_.get(this.props, 'newContract.startDate')}
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                            onChange={this.handleChangeDate.bind(this,"startDate")}
                            startDate={startDate}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <CommonDatePicker
                            required
                            title={RS.getString('END_DATE')}
                            ref={(input) => this.endDate = input}
                            hintText="dd/mm/yyyy"
                            id="endDate"
                            constraint={this.constrants.endDate}
                            defaultValue={_.get(this.props, 'newContract.endDate')}
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                            onChange={this.handleChangeDate.bind(this,"endDate")}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <CommonSelect
                            title={RS.getString('GROUP')}
                            placeholder={RS.getString('SELECT')}
                            clearable={false}
                            searchable={false}
                            name="select-location"
                            value={_.get(this.props, 'newContract.group')}
                            propertyItem={{ label: 'name', value: 'id' }}
                            options={this.props.groups}
                            ref={(input) => this.group = input}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3 est-contract-rate" >
                        <div className="col-xs-7" >
                            <CommonTextField
                                type="text"
                                title={RS.getString('EST_CONTRACT_RATE')}
                                defaultValue={_.get(this.props, 'newContract.ratePrice') + ''}
                                ref={(input) => this.ratePrice = input}
                                onBlur={this.handleOnBlur}
                                constraint={this.constrants.ratePrice}
                                addon={<span>{this.renderContractValueCurrency()}</span>}
                            />
                        </div>
                        <div className="col-xs-5" >
                            <CommonSelect
                                clearable={false}
                                searchable={false}
                                name="select-rete-type"
                                value={_.get(this.props, 'newContract.rateType') || getContractRateTypeOptions()[0]}
                                options={rateTypeOptions}
                                ref={(input) => this.rateType = input}
                            />
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
                <div className="pull-right">
                    <RaisedButton
                        className="raised-button-first-secondary"
                        label={RS.getString('CHANGE_SHIFT_TEMPLATE')}
                        onClick={() => { this.setState({ openDialogSelectTemplate: true }) }}
                    />
                </div>
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
                <DialogSelectShiftTemplate
                    isOpen={this.state.openDialogSelectTemplate}
                    title={RS.getString("CHANGE_SHIFT_TEMPLATE", null, Option.UPPER)}
                    selectedShiftTemplate={this.state.contract.shiftTemplate}
                    shiftTemplates={this.props.shiftTemplates}
                    handleSave={this.handleSelectShiftTemplate}
                    handleClose={() => this.setState({ openDialogSelectTemplate: false })}
                />
            </div>
        );
    }

    renderAttachments() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('ATTACHMENTS')}</div>
                <div className="pull-right">
                    <RaisedButton
                        className="raised-button-first-secondary"
                        label={RS.getString('ATTACH_FILES')}
                        onClick={() => { this.setState({ openDialogAttach: true }) }}
                    />
                </div>
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
                                            <i className="attach-remove fa fa-trash-o trash-icon"
                                                onClick={this.deleteDocument.bind(this, element)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <DialogAttachFile
                    isOpen={this.state.openDialogAttach}
                    allowTypes={EMPLOYEE_ATTACHFILE.allowTypes}
                    maxSize={EMPLOYEE_ATTACHFILE.maxSize}
                    handleClose={() => { this.setState({ openDialogAttach: false }) }}
                    handleAttach={this.handleAttachDocuments}
                />
                <DialogConfirm
                    title={RS.getString('CONFIRM')}
                    isOpen={this.state.openDialogConfirm}
                    handleSubmit={this.handleSubmitConfirmPopup}
                    handleClose={() => this.setState({ openDialogConfirm: false })}
                    data={this.state.deleteDocumentSelected}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FILE')} </span>
                </DialogConfirm>
            </div>
        );
    }

    renderLinkedContracts() {
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('LINKED_CONTRACTS')}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6" >
                        <CommonSelect
                            searchable={true}
                            name="select-contract"
                            value={_.get(this.props, 'newContract.links[0]')}
                            propertyItem={{ label: 'identifier', value: 'id' }}
                            options={this.props.contracts || []}
                            valueComponent={this.renderValueComponent}
                            ref={(input) => this.linkedContracts = input}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderContractValueCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("AUD");
            case COUNTRY.VN:
                return RS.getString("VND");
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
                {this.renderAttachments()}
                {this.renderLinkedContracts()}
            </div>
        );
    }
}

GeneralInformation.propTypes = {
}

export default GeneralInformation;