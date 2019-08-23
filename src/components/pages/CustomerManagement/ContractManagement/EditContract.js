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
import EditContractInformation from './EditContractInformation';

class EditContract extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openDialogAttach: false,
            openDialogConfirm: false,
            contract: {}
        };

        this.renderContractInformation = this.renderContractInformation.bind(this);
        this.renderShift = this.renderShift.bind(this);
        this.renderLocationInformation = this.renderLocationInformation.bind(this);
        this.renderAttachments = this.renderAttachments.bind(this);
        this.renderLinkedContracts = this.renderLinkedContracts.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.handleAttachDocuments = this.handleAttachDocuments.bind(this);
        this.handleSubmitConfirmPopup = this.handleSubmitConfirmPopup.bind(this);
        this.renderContractValueCurrency = this.renderContractValueCurrency.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }

    componentDidMount() {
        this.setState({ contract: this.props.contract });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.contract, nextProps.contract)) {
            this.setState({
                contract: nextProps.contract
            });
        }
    }

    getValue() {
        let contract = _.cloneDeep(this.state.contract);
        let contractInfo = this.contractInfoRef.getValue();
        contract = _.assign({}, contract, contractInfo);
        let linkedContracts = this.linkedContracts.getValue();
        contract.schedules = this.workingLocationRef.getValue().workingLocations;
        contract.flexibleSchedules = this.workingLocationRef.getValue().flexibleWorkingTimes;
        contract.links = linkedContracts ? linkedContracts : [];

        return _.cloneDeep(contract);
    }

    validate() {
        let isValid = true;
        const formToValidates = ['contractInfoRef', 'workingLocationRef'];
        _.forEach(formToValidates, form => {
            if (!this[form].validate()) {
                isValid = false;
            }
        });
        return isValid;
    }

    deleteDocument(element) {
        this.setState({
            openDialogConfirm: true,
            deleteDocumentSelected: element
        });
    }

    handleAttachDocuments(files) {
        let fileAttachs = [];
        _.forEach(files, file => {
            if (file.status == STATUS.COMPLETED) {
                fileAttachs.push({ docUrl: file.url });
            }
        });
        let contract = _.cloneDeep(this.state.contract);
        contract.attachments = [...this.state.contract.attachments, ...fileAttachs];
        this.setState({ contract });
    }

    handleSubmitConfirmPopup() {
        let contract = _.cloneDeep(this.state.contract);
        let attachments = _.filter(contract.attachments, x => x.docUrl != this.state.deleteDocumentSelected.docUrl);
        contract.attachments = attachments;
        this.setState({ openDialogConfirm: false, contract });
    }

    handleChangeStartDate(startDate) {
        let contract = _.assign({}, this.state.contract, { startDate });
        this.setState({ contract });
    }

    handleChangeEndDate(endDate) {
        let contract = _.assign({}, this.state.contract, { endDate });
        this.setState({ contract });
    }

    renderContractInformation() {
        return (
            <EditContractInformation
                {...this.props}
                ref={input => this.contractInfoRef = input}
                handleChangeStartDate={this.handleChangeStartDate}
                handleChangeEndDate={this.handleChangeEndDate}
            />
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
                    contractTime={{
                        startDate: this.state.contract.startDate,
                        endDate: this.state.contract.endDate
                    }}
                    jobRoles={this.props.jobRoles}
                    locations={this.props.locations}
                    scheduleTemplate={_.find(SCHEDULE_TEMPLATES, (template) => template.id == this.state.contract.scheduleTemplate)}
                    ref={input => this.workingLocationRef = input}
                    shiftTemplates={this.props.shiftTemplates}
                    workingLocations={this.state.contract.schedules}
                    flexibleWorkingTimes={this.state.contract.flexibleSchedules || []}
                    groupSubs={this.props.groups || []}
                    group={this.state.contract.group}
                />
            </div>
        )
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
                                            <a
                                                className="document-name"
                                                target="_blank"
                                                href={API_FILE + element.docUrl}
                                            >
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
        let linkOptions = _.filter(this.props.contracts, x => x.id != _.get(this.state, "contract.id"));
        return (
            <div className="new-contract-info-container" >
                <div className="new-contract-title uppercase" >{RS.getString('LINKED_CONTRACTS')}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6" >
                        <CommonSelect
                            multi={true}
                            searchable={true}
                            name="select-contract"
                            value={_.get(this.state, 'contract.links')}
                            propertyItem={{ label: 'identifier', value: 'id' }}
                            options={linkOptions}
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
                return RS.getString("PAYRATE_HOUR_AU");
            case COUNTRY.VN:
                return RS.getString("PAYRATE_HOUR_VN");
        }
    }

    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <a href={getUrlPath(URL.CONTRACT, { contractId: option.value.id })} target="_blank">{option.value.identifier}</a>
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

EditContract.propTypes = {
}

export default EditContract;