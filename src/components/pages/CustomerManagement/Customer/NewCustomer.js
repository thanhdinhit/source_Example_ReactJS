import React, { PropTypes } from 'react';
import RS, { Option } from '../../../../resources/resourceManager';
import { browserHistory } from 'react-router';
import { CONTRACT_STATUS, AVATAR_SIZE_LIMIT, REGEX_IMAGE } from "../../../../core/common/constants";
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import _ from 'lodash';
import Breadcrumb from '../../../elements/Breadcrumb';
import RaisedButton from '../../../elements/RaisedButton';
import { getExtension, getName } from '../../../../utils/iconUtils';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import toastr from 'toastr';
import DialogChangeAvatar from '../../EmployeePortal/DialogChangeAvatar';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import AvatarSelect from '../../../elements/AvatarSelect.component';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import { CUSTOMER_ATTACHFILE } from '../../../../core/common/config';
import { getCustomerConstraints } from '../../../../validation/customerConstraints';
import { getPreviousPage } from '../../../../utils/browserHelper';
import DialogAlert from '../../../elements/DialogAlert';

const redirect = getUrlPath(URL.CUSTOMERS_DETAIL);
const propTypes = {
    customerActions: PropTypes.object
};

class NewCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDialogWarning: false,
            avatar: {
                name: '',
                file: undefined,
                resultFileAvatar: undefined,
            },
            openChangeAvatar: false,
            openDialogAttach: false,
            update: false,
            supervisors: []
        };

        this.attachedFiles = [];

        this.handleFile = this.handleFile.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.handleAttachFiles = this.handleAttachFiles.bind(this);
        this.handleSaveCustomer = this.handleSaveCustomer.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.loadSupervisors();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ supervisors: nextProps.supervisors }, function () {
            LoadingIndicatorActions.hideAppLoadingIndicator();
        });
        if (nextProps.payload.success) {
            this.props.globalActions.resetState();
            LoadingIndicatorActions.hideAppLoadingIndicator();
            browserHistory.push(getUrlPath(URL.CUSTOMERS));
        } else if (nextProps.payload.error.message === 'Customer_Name_Is_Existed') {
            toastr.error(RS.getString(nextProps.payload.error.message), RS.getString('ERROR'))
            this.props.globalActions.resetError();
            LoadingIndicatorActions.hideAppLoadingIndicator();
        }
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
                this.refs.inputAvatar.value = "";
                this.setState({
                    avatar: {
                        resultFileAvatar: upload.target.result,
                        name: file.name
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
        let avatar = this.state.avatar;
        avatar.file = result;
        this.setState({ avatar })
    }

    handleClosePopup() {
        this.setState({
            openChangeAvatar: false
        })
    }

    handleSubmitPopup() {
        this.handleClosePopup();
    }

    deleteDocument(index) {
        this.attachedFiles.splice(index, 1);
        this.setState({ update: true });
    }
    handleCancel() {
        this.setState({
            isOpenDialogWarning: true
        });
    }
    handleAttachFiles(files) {
        let self = this;
        _.each(files, function (file) {
            if (file.status === CONTRACT_STATUS.COMPLETED) {
                let obj = {
                    filename: file.name,
                    docUrl: file.url
                };
                self.attachedFiles.push(obj);
            }
        });
        self.setState({ update: true });
    }
    confirmLeavePage() {
        let nextUrl = getPreviousPage();
        let next = nextUrl.pathname + nextUrl.search;
        browserHistory.push(next)

    }
    handleSaveCustomer() {
        let self = this;
        let isValid = true;
        const fieldsToValidate = ['customerName', 'contactName', 'position', 'email', 'mobilePhone', 'telephone', 'billingAddress', 'supervisor'];
        _.each(fieldsToValidate, function (fieldToValidate) {
            if (!self[fieldToValidate].validate()) {
                isValid = false;
            }
        });

        if (isValid) {
            let clonedattachedFiles = _.cloneDeep(self.attachedFiles);
            _.each(clonedattachedFiles, function (item) {
                delete item.filename;
            });

            let newCustomer = {
                customerName: self.customerName.getValue(),
                contactName: self.contactName.getValue(),
                position: self.position.getValue(),
                contactEmail: self.email.getValue(),
                mobilePhone: self.mobilePhone.getValue(),
                telePhone: self.telephone.getValue(),
                address: self.billingAddress.getValue(),
                supervisor: { id: self.supervisor.getValue().id },
                attachments: clonedattachedFiles,
                avatar: this.state.avatar.file
            };

            LoadingIndicatorActions.showAppLoadingIndicator();
            this.props.customerActions.addCustomer(newCustomer);
        }
    }

    renderCustomerInformation() {
        return (
            <div>
                <div className="customers">
                    <div className="customers-info-container">
                        <div className="customers-title uppercase">{RS.getString('CUSTOMER_INFORMATION')}</div>
                        <div className="row">
                            <div className="avatar-container col-xs-12 col-sm-3" >
                                <div className="photo-upload">
                                    {this.state.avatar.file ?
                                        <img className="img-upload" src={this.state.avatar.file} /> :
                                        <img
                                            className="img-upload"
                                            src={require("../../../../images/avatarDefault.png")}
                                        />
                                    }
                                    <label htmlFor="photoFile" className="img-button-upload">
                                        <div>
                                            <img className="icon-camera" src={require("../../../../images/camera.png")} />
                                        </div>
                                    </label>
                                </div>
                                <input ref="inputAvatar" className="inputfile" id="photoFile" type="file" onChange={this.handleFile} />
                                <div className="error normal-font-size" ></div>
                            </div>
                            <div className="col-xs-12 col-sm-9">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-4" >
                                        <CommonTextField
                                            required
                                            title={RS.getString('CUSTOMER_NAME')}
                                            id="customerName"
                                            constraint={getCustomerConstraints().customerName}
                                            ref={(input) => this.customerName = input}
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
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <CommonTextField
                                            required
                                            title={RS.getString('POSITION')}
                                            id="position"
                                            constraint={getCustomerConstraints().position}
                                            ref={(input) => this.position = input}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <CommonTextField
                                            required
                                            title={RS.getString('EMAIL')}
                                            id="email"
                                            constraint={getCustomerConstraints().email}
                                            ref={(input) => this.email = input}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <CommonTextField
                                            required
                                            title={RS.getString('MOBILE_PHONE')}
                                            id="mobilePhone"
                                            constraint={getCustomerConstraints().mobilePhone}
                                            ref={(input) => this.mobilePhone = input}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <CommonTextField
                                            required
                                            title={RS.getString('TELEPHONE')}
                                            id="telephone"
                                            constraint={getCustomerConstraints().telePhone}
                                            ref={(input) => this.telephone = input}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-8" >
                                        <CommonTextField
                                            required
                                            title={RS.getString('BILLING_ADDRESS')}
                                            id="billingAddress"
                                            constraint={getCustomerConstraints().billingAddress}
                                            ref={(input) => this.billingAddress = input}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-4" >
                                        <AvatarSelect
                                            required
                                            title={RS.getString('MANAGED_BY')}
                                            placeholder={RS.getString('SELECT')}
                                            options={this.state.supervisors}
                                            propertyItem={{ label: 'fullName', value: 'id' }}
                                            clearable={false}
                                            searchable={true}
                                            name="select-manager"
                                            constraint={getCustomerConstraints().supervisors}
                                            ref={(input) => this.supervisor = input}
                                        />
                                    </div>
                                </div>
                            </div>
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
                                this.attachedFiles.map((attachment, index) => {
                                    return (
                                        <div className="col-sm-3 attachments" key={index}>
                                            <div className="attachments-box-container">
                                                <img className="icon-type-file"
                                                    src={require('../../../../images/svg/' + getExtension(attachment.filename))} />
                                                <span className="document-name">
                                                    {getName(attachment.filename)}
                                                </span>
                                                <i className="attach-remove fa fa-trash-o trash-icon"
                                                    onClick={this.deleteDocument.bind(this, index)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
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

    render() {
        let linkBreadcrumb = [{
            key: RS.getString("CUSTOMERS"),
            value: getUrlPath(URL.CUSTOMERS)
        }];
        let actionAlert = [
            <RaisedButton
                key={0}
                label={RS.getString("NO")}
                onClick={() => { this.setState({ isOpenDialogWarning: false }) }}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString("YES")}
                onClick={this.confirmLeavePage}
            />
        ];
        return (
            <div className="page-container customers">
                <div className="header">
                    {RS.getString("NEW_CUSTOMER")}
                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <div>
                    {this.renderCustomerInformation()}
                    {this.renderAttachments()}
                    <div className="del-button">
                        <RaisedButton
                            label={RS.getString('SAVE')}
                            className="raised-button-first right-button"
                            onClick={this.handleSaveCustomer}
                            pullright
                        />
                        <RaisedButton
                            label={RS.getString('CANCEL')}
                            className="raised-button-fourth right-button"
                            onClick={this.handleCancel}
                            pullright
                        />
                    </div>
                </div>
                <DialogAlert
                    ref={(dialog) => this.dialogWarning = dialog}
                    icon={require("../../../../images/warning.png")}
                    isOpen={this.state.isOpenDialogWarning}
                    title="Warning"
                    actions={actionAlert}
                    handleClose={() => this.setState({ isOpenDialogWarning: false })}
                >
                    <div> {RS.getString("P110")}</div>
                    <div> {RS.getString("P111")} </div>
                </DialogAlert>
            </div>
        );
    }
}
NewCustomer.propTypes = propTypes;
export default NewCustomer;