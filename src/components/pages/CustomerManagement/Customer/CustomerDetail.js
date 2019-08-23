import React, { PropTypes } from 'react';
import RS, { Option } from '../../../../resources/resourceManager';
import RIGHTS from '../../../../constants/rights';
import { browserHistory } from 'react-router';
import { QUERY_STRING, CONTRACT_STATUS, TIMEFORMAT, MODE_PAGE, AVATAR_SIZE_LIMIT, BACK_TO_URL, THINGS_COME_TO, REGEX_IMAGE } from "../../../../core/common/constants";
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import _ from 'lodash';
import Breadcrumb from '../../../elements/Breadcrumb';
import TextView from '../../../elements/TextView';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import dateHelper from '../../../../utils/dateHelper';
import RaisedButton from '../../../elements/RaisedButton';
import { getExtension, getName } from '../../../../utils/iconUtils';
import DialogDeleteCustomer from './DialogDeleteCustomer';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as toastr from '../../../../utils/toastr';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import { getCustomerConstraints } from '../../../../validation/customerConstraints';
import AvatarSelect from '../../../elements/AvatarSelect.component';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import { CUSTOMER_ATTACHFILE } from '../../../../core/common/config';
import DialogChangeAvatar from '../../EmployeePortal/DialogChangeAvatar';

const redirect = getUrlPath(URL.CUSTOMERS_DETAIL);
const propTypes = {
    customerActions: PropTypes.object
};

class CustomerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choose: MODE_PAGE.VIEW,
            openDialogAttach: false,
            update: false,

            avatar: {
                resultFileAvatar: undefined
            },
            openChangeAvatar: false
        };
        this.isPressDelete = false;
        this.isPressEdit = false;
        this.getValues = this.getValues.bind(this);
        this.getValuesProps = this.getValuesProps.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
        this.showDialogDeleteCustomer = this.showDialogDeleteCustomer.bind(this);
        this.handleAttachFiles = this.handleAttachFiles.bind(this);
        this.handleEditCustomer = this.handleEditCustomer.bind(this);
        this.chooseEdit = this.chooseEdit.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.handleconfirmDeleteCustomer = this.handleconfirmDeleteCustomer.bind(this);
        this.addContract = this.addContract.bind(this);
    }

    componentDidMount() {
        this.isPressDelete = false; // after add contract , come back here
        this.isPressEdit = false; //after add contract , come back here
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.customerActions.loadCustomerDetail(this.props.params.customerId, redirect);
        this.props.loadSupervisors();
    }

    componentDidUpdate() {
        LoadingIndicatorActions.hideAppLoadingIndicator();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.payload.success) {
            if (this.isPressDelete) {
                this.isPressDelete = false;
                this.props.globalActions.resetState();
                LoadingIndicatorActions.hideAppLoadingIndicator();
                browserHistory.push(getUrlPath(URL.CUSTOMERS));
            } else if (this.isPressEdit) {
                this.isPressEdit = false;
                this.props.globalActions.resetState();
                toastr.success(RS.getString('ACTION_SUCCESSFULLY'), RS.getString('SUCCESS'));
                this.setState({ choose: MODE_PAGE.VIEW });
            }
        } else {
            if (this.isPressDelete) {
                this.isPressDelete = false;
                toastr.error(RS.getString('ACTION_DENIED'), RS.getString('ERROR'))
                this.props.globalActions.resetError();
                LoadingIndicatorActions.hideAppLoadingIndicator();
            }
        }
    }

    getValues() {
        return (
            {
                id: this.props.customer.id,
                customerName: this.customerName.getValue(),
                contactName: this.contactName.getValue(),
                position: this.position.getValue(),
                contactEmail: this.email.getValue(),
                mobilePhone: this.mobilePhone.getValue(),
                telePhone: this.telePhone.getValue(),
                address: this.billingAddress.getValue(),
                supervisor: { id: this.supervisor.getValue().id },
                attachments: this.props.customer.attachments,
                photoUrl: this.props.customer.photoUrl,
                stamp: this.props.customer.stamp
            }
        );
    }

    getValuesProps() {
        return (
            {
                id: this.props.customer.id,
                customerName: this.props.customer.customerName,
                contactName: this.props.customer.contactName,
                position: this.props.customer.position,
                contactEmail: this.props.customer.contactEmail,
                mobilePhone: this.props.customer.mobilePhone,
                telePhone: this.props.customer.telePhone,
                address: this.props.customer.address,
                supervisor: { id: this.props.customer.supervisor.id },
                attachments: this.props.customer.attachments,
                photoUrl: this.props.customer.photoUrl,
                stamp: this.props.customer.stamp
            }
        );
    }

    renderViewCustomerInfo(customer, reportToPhotoUrl) {
        return (
            <div className="col-xs-12 col-sm-9">
                <div className="row">
                    <div className="col-xs-12 col-sm-4" >
                        <TextView
                            title={RS.getString('CUSTOMER_NAME')}
                            value={customer.customerName}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <TextView
                            title={RS.getString('CONTACT_NAME')}
                            value={customer.contactName}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <TextView
                            title={RS.getString('POSITION')}
                            value={customer.position}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <TextView
                            title={RS.getString('EMAIL')}
                            value={customer.contactEmail}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <TextView
                            title={RS.getString('MOBILE_PHONE')}
                            value={customer.mobilePhone}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <TextView
                            title={RS.getString('TELEPHONE')}
                            value={customer.telePhone}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-8" >
                        <TextView
                            title={RS.getString('BILLING_ADDRESS')}
                            value={customer.address}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4" >
                        <TextView
                            title={RS.getString('MANAGED_BY')}
                            image={reportToPhotoUrl ? API_FILE + reportToPhotoUrl : require("../../../../images/avatarDefault.png")}
                            value={_.get(customer, 'supervisor.fullName', '')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    handleEditCustomer() { // save only data
        let self = this;
        let isValid = true;
        const fieldsToValidate = ['customerName', 'contactName', 'position', 'email', 'mobilePhone', 'telePhone', 'billingAddress', 'supervisor'];
        _.each(fieldsToValidate, function (fieldToValidate) {
            if (!self[fieldToValidate].validate()) {
                isValid = false;
            }
        });

        if (isValid) {
            let customerDto = this.getValues();
            if (_.isEqual(customerDto, this.getValuesProps())) {
                this.setState({ choose: MODE_PAGE.VIEW });
            } else {
                this.isPressEdit = true;
                LoadingIndicatorActions.showAppLoadingIndicator();
                this.props.customerActions.editCustomer(customerDto);
            }
        }
    }

    renderEditCustomerInfor(customer) {
        const { supervisors } = this.props;
        return (
            <div>
                <div className="col-xs-12 col-sm-9">
                    <div className="row">
                        <div className="col-xs-12 col-sm-4" >
                            <CommonTextField
                                required
                                title={RS.getString('CUSTOMER_NAME')}
                                id="customerName"
                                constraint={getCustomerConstraints().customerName}
                                ref={(input) => this.customerName = input}
                                defaultValue={customer.customerName}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <CommonTextField
                                required
                                title={RS.getString('CONTACT_NAME')}
                                id="contactName"
                                defaultValue={''}
                                constraint={getCustomerConstraints().contactName}
                                ref={(input) => this.contactName = input}
                                defaultValue={customer.contactName}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <CommonTextField
                                required
                                title={RS.getString('POSITION')}
                                id="position"
                                constraint={getCustomerConstraints().position}
                                ref={(input) => this.position = input}
                                defaultValue={customer.position}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <CommonTextField
                                required
                                title={RS.getString('EMAIL')}
                                id="email"
                                constraint={getCustomerConstraints().email}
                                ref={(input) => this.email = input}
                                defaultValue={customer.contactEmail}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <CommonTextField
                                required
                                title={RS.getString('MOBILE_PHONE')}
                                id="mobilePhone"
                                constraint={getCustomerConstraints().mobilePhone}
                                ref={(input) => this.mobilePhone = input}
                                defaultValue={customer.mobilePhone}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <CommonTextField
                                required
                                title={RS.getString('TELEPHONE')}
                                id="telephone"
                                constraint={getCustomerConstraints().telePhone}
                                ref={(input) => this.telePhone = input}
                                defaultValue={customer.telePhone}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-8" >
                            <CommonTextField
                                required
                                title={RS.getString('BILLING_ADDRESS')}
                                id="billingAddress"
                                constraint={getCustomerConstraints().billingAddress}
                                ref={(input) => this.billingAddress = input}
                                defaultValue={customer.address}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4" >
                            <AvatarSelect
                                required
                                title={RS.getString('MANAGED_BY')}
                                placeholder={RS.getString('SELECT')}
                                options={this.props.supervisors}
                                propertyItem={{ label: 'fullName', value: 'id' }}
                                clearable={false}
                                searchable={false}
                                name="select-manager"
                                constraint={getCustomerConstraints().supervisors}
                                ref={(input) => this.supervisor = input}
                            />
                        </div>
                    </div>
                </div>
                <div className="edit-customer-group-button">
                    <RaisedButton
                        label={RS.getString('CANCEL', null, Option.CAPEACHWORD)}
                        onClick={() => { this.setState({ choose: MODE_PAGE.VIEW }) }}
                        className="raised-button-first-secondary"
                        pullright
                    />
                    <RaisedButton
                        label={RS.getString('SAVE', null, Option.CAPEACHWORD)}
                        onClick={this.handleEditCustomer}
                        className="raised-button-first-secondary"
                        pullright
                    />
                </div>
            </div>
        );
    }

    chooseEdit() {
        this.setState({ choose: MODE_PAGE.EDIT }, function () {
            this.supervisor.setValue(this.props.customer.supervisor);
        });
    }

    handleFile(e) {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            if (!REGEX_IMAGE.test(file.type)) {
                alert(RS.getString('E141'));
                return;
            }
            if (file.size / 1024 < AVATAR_SIZE_LIMIT) {
                this.setState({
                    avatar: {
                        resultFileAvatar: upload.target.result,
                    },
                    openChangeAvatar: true
                });
            }
            else {
                alert(RS.getString('E108'));
            }
        };
        reader.readAsDataURL(file);
    }

    handleAvatarChange(result) {
        let customer = _.cloneDeep(this.getValuesProps());
        this.isPressEdit = true;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.customerActions.changeAvatar(result, customer);
    }

    handleClosePopup() {
        this.setState({
            openChangeAvatar: false
        })
    }

    handleSubmitPopup() {
        this.handleClosePopup();
    }

    renderCustomerInformation() {
        const { customer } = this.props;
        let reportToPhotoUrl = _.get(customer, 'supervisor.photoUrl', '');
        return (
            <div>
                <div className={this.state.choose === MODE_PAGE.VIEW ? 'customers' : 'customers customers-background'}>
                    <div className={this.state.choose === MODE_PAGE.VIEW ? 'customers-info-container' : 'customers-info-container edit'}>
                        <div className="customers-title uppercase">{RS.getString('CUSTOMER_INFORMATION')}
                            {
                                this.state.choose === MODE_PAGE.VIEW ?
                                    <i className="edit-customers fa fa-pencil" aria-hidden="true" onClick={this.chooseEdit}></i> : null
                            }
                        </div>
                        <div className="row">
                            <div className="avatar-container col-xs-12 col-sm-3" >
                                <div className="photo-upload">
                                    <img
                                        className="img-upload"
                                        src={this.props.customer.photoUrl ? API_FILE + this.props.customer.photoUrl : require("../../../../images/avatarDefault.png")}
                                    />
                                    <label htmlFor="photoFile" className="img-button-upload">
                                        <div>
                                            <img className="icon-camera" src={require("../../../../images/camera.png")} />
                                        </div>
                                    </label>
                                </div>
                                <input ref="inputAvatar" className="inputfile" id="photoFile" type="file" onChange={this.handleFile} />
                                <div className="error normal-font-size" ></div>
                            </div>
                            {
                                this.state.choose === MODE_PAGE.VIEW ? this.renderViewCustomerInfo(customer, reportToPhotoUrl) : this.renderEditCustomerInfor(customer)
                            }
                        </div>
                    </div>
                </div>
                <DialogChangeAvatar
                    avatar={this.state.avatar.resultFileAvatar}
                    onChange={this.handleAvatarChange}
                    isOpen={this.state.openChangeAvatar}
                    handleClose={this.handleClosePopup}
                    handleSubmit={this.handleSubmitPopup}
                    title={RS.getString('CROP_PICTURE', null, Option.UPPER)}
                />
            </div>
        );
    }

    addContract() {
        localStorage.setItem(BACK_TO_URL, getUrlPath(URL.CUSTOMERS_DETAIL, { customerId: this.props.customer.id }));
        this.props.contractActions.updateContractDto("customer", this.props.customer)
        browserHistory.push(getUrlPath(URL.NEW_CONTRACT));
    }

    renderContracts() {
        return (
            <div className="customers">
                <div className="customers-info-container">
                    <div className="customers-title uppercase">{RS.getString('CONTRACTS')}
                        <RaisedButton
                            label={RS.getString('NEW_CONTRACT', null, Option.CAPEACHWORD)}
                            onClick={this.addContract}
                            className="raised-button-first-secondary right-button"
                            pullright
                        />
                    </div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader
                                    name={'contractId'}
                                >
                                    {RS.getString('CONTRACT_ID', null, Option.CAPEACHWORD)}
                                </MyTableHeader>
                                <MyTableHeader
                                    name="startDate"
                                >
                                    {RS.getString('START_DATE')}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('END_DATE', null, Option.CAPEACHWORD)}
                                </MyTableHeader>
                                <MyTableHeader>
                                    {RS.getString('STATUS', null, Option.CAPEACHWORD)}
                                </MyTableHeader>
                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                            {this.props.customer.contracts ?
                                this.props.customer.contracts.map((contract, index) => {
                                    let contractStatus = '';
                                    switch (contract.status) {
                                        case CONTRACT_STATUS.ACTIVE:
                                            contractStatus = 'status-active';
                                            break;
                                        case CONTRACT_STATUS.DRAFT:
                                            contractStatus = 'status-draft';
                                            break;
                                        case CONTRACT_STATUS.SUSPENDED:
                                            contractStatus = 'status-suspended';
                                            break;
                                        case CONTRACT_STATUS.COMPLETED:
                                            contractStatus = 'status-completed';
                                            break;
                                        case CONTRACT_STATUS.TERMINATED:
                                            contractStatus = 'status-terminated';
                                            break;
                                    }
                                    return (
                                        <tr key={index} onClick={() => browserHistory.push(getUrlPath(URL.CONTRACT, { contractId: contract.id }))}>
                                            <td>
                                                {contract.identifier}
                                            </td>
                                            <td>
                                                {contract.startDate ? dateHelper.formatTimeWithPattern(contract.startDate, TIMEFORMAT.CONTRACT_DATETIME) : ''}
                                            </td>
                                            <td>
                                                {contract.endDate ? dateHelper.formatTimeWithPattern(contract.endDate, TIMEFORMAT.CONTRACT_DATETIME) : ''}
                                            </td>
                                            <td className="status-cell">
                                                <span className={contractStatus}>
                                                    {contract.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    handleAttachFiles(files) {
        let self = this;
        let customerDto = _.cloneDeep(this.getValuesProps());
        _.each(files, function (file) {
            if (file.status === CONTRACT_STATUS.COMPLETED) {
                customerDto.attachments.push({ docUrl: file.url });
            }
        });

        this.isPressEdit = true;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.customerActions.editCustomer(customerDto);
    }

    deleteDocument(index) {
        let customerDto = _.cloneDeep(this.getValuesProps());
        customerDto.attachments.splice(index, 1);
        this.isPressEdit = true;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.customerActions.editCustomer(customerDto);
    }

    renderAttachments() {
        return (
            <div>
                <div className="customers">
                    <div className="customers-info-container">
                        <div className="customers-title uppercase">{RS.getString('ATTACHMENTS')}
                            <RaisedButton
                                label={RS.getString('ATTACH_FILES', null, Option.CAPEACHWORD)}
                                onClick={() => { this.setState({ openDialogAttach: true }) }}
                                className="raised-button-first-secondary right-button"
                                pullright
                            />
                        </div>
                        <div className="row">
                            {
                                this.props.customer.attachments ?
                                    this.props.customer.attachments.map((attachment, index) => {
                                        return (
                                            <div className="col-sm-3 attachments" key={index}>
                                                <div className="attachments-box-container">
                                                    <img className="icon-type-file"
                                                        src={require('../../../../images/svg/' + getExtension(attachment.docUrl))} />
                                                    <a className="document-name"
                                                        href={API_FILE + attachment.docUrl}>
                                                        <div>{getName(attachment.docUrl)}</div>
                                                    </a>
                                                    <i className="attach-remove fa fa-trash-o trash-icon"
                                                        onClick={this.deleteDocument.bind(this, index)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }) : ''
                            }
                        </div>
                    </div>
                </div>
                <DialogAttachFile
                    isOpen={this.state.openDialogAttach}
                    allowTypes={CUSTOMER_ATTACHFILE.allowTypes}
                    maxSize={CUSTOMER_ATTACHFILE.maxSize}
                    handleClose={() => { this.setState({ openDialogAttach: false }) }}
                    handleAttach={this.handleAttachFiles}
                />
            </div>
        )
    }

    showDialogDeleteCustomer() {
        this.DialogDeleteCustomer.handleOpen();
    }

    handleconfirmDeleteCustomer() {
        this.isPressDelete = true;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.customerActions.deleteCustomer(this.props.customer.id)
    }

    render() {
        let linkBreadcrumb = [{
            key: RS.getString("CUSTOMERS"),
            value: getUrlPath(URL.CUSTOMERS)
        }];
        return (
            <div>
                <div className="page-container customers">
                    <div className="header">
                        {RS.getString("CUSTOMER")}
                    </div>
                    <Breadcrumb link={linkBreadcrumb} />
                    <div>
                        {this.renderCustomerInformation()}
                        {this.renderContracts()}
                        {this.renderAttachments()}
                        <div className="del-button">
                            <RaisedButton
                                label={RS.getString('DELETE', null, Option.CAPEACHWORD)}
                                onClick={this.showDialogDeleteCustomer}
                                className="raised-button-third right-button"
                                pullright
                            />
                        </div>
                    </div>
                </div>
                <DialogDeleteCustomer
                    ref={(DialogDeleteCustomer) => this.DialogDeleteCustomer = DialogDeleteCustomer}
                    handleconfirm={this.handleconfirmDeleteCustomer}
                />
            </div>
        );
    }
}
//CustomerDetail.propTypes = propTypes;
export default CustomerDetail;