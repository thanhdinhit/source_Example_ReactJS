import React, { PropTypes } from 'react';
import {
    getGenderOptions,
    AVATAR_SIZE_LIMIT,
    STATUS, WAITING_TIME,
    getWorkingLocationTypeOptions,
    LOCATION_TYPE,
    USER_ROLES,
    REGEX_IMAGE
} from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import { getEmployeeConstraints } from '../../../../validation/employeeConstraints';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import MyCheckBox from '../../../elements/MyCheckBox';
import { loadAllMember } from '../../../../actions/employeeActions';
import Toggle from '../../../elements/toggle/Toggle';
import EmployeeAddressVN from './EmployeeAddressVN';
import EmployeeAddressAU from './EmployeeAddressAU';
import { COUNTRY, MAX_LENGTH_INPUT } from '../../../../core/common/config';
import DialogChangeAvatar from '../DialogChangeAvatar';
import _ from 'lodash';
import AvatarSelect from '../../../elements/AvatarSelect.component';
import Promise from 'bluebird';
import CommonPhoneInput from '../../../elements/TextField/CommonPhoneInput.component';
import EmergencyContacts from '../EmergencyContacts';
import TextView from '../../../elements/TextView';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';

class ContactDetails extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.state = {
            avatar: {
                name: '',
                file: undefined,
                resultFileAvatar: undefined,
            },
            error: {
                email: '',
                avatar: '',
            },
            contactDetail: {},
            openChangeAvatar: false
        };
        this.loadReportToEmployee = this.loadReportToEmployee.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.setValue = this.setValue.bind(this);
        this.updateContactDto = this.updateContactDto.bind(this);
        this.getValue = this.getValue.bind(this);
        this.checkFieldEmployee = this.checkFieldEmployee.bind(this);
        this.handleAddEmergencyContact = this.handleAddEmergencyContact.bind(this);
        this.handleDeleteEmergencyContact = this.handleDeleteEmergencyContact.bind(this);
    }

    componentDidMount() {
        this.setState({ contactDetail: _.cloneDeep(this.props.contactDetail), avatar: this.props.avatar })
    }

    componentWillReceiveProps(nextProps) {
        !this.isValidating && this.setState({ contactDetail: _.cloneDeep(nextProps.contactDetail), avatar: nextProps.avatar })
        if (!_.isEqual(nextProps.validatedResult, this.props.validatedResult) || this.isSubmit) {
            this.isPass = true;
            const fieldValidatedFromServer = ['identifier', 'cardIdNumber'];
            let error = this.state.error;
            for (let field of fieldValidatedFromServer) {
                if (nextProps.validatedResult[field]) {
                    if (nextProps.validatedResult[field].result === STATUS.IS_EXISTED) {
                        error[nextProps.validatedResult[field].fieldOnUI] = this.setErrorText(nextProps.validatedResult[field].fieldOnUI)
                    }
                    if (nextProps.validatedResult[field].result === STATUS.ACCEPTED) {
                        error[nextProps.validatedResult[field].fieldOnUI] = "";
                    }
                    else {
                        this.isPass = false;
                    }
                }
            }
            if (this.isSubmit && this.isPass) {
                this.props.validatedSuccess();
                this.isSubmit = false;
                this.isPass = false;
            }
            this.setState({ error })
            this.isValidating = false;
        }
    }

    isPass = false
    isSubmit = false
    isValidating = false

    setErrorText(field) {
        switch (field) {
            case 'identifier': return RS.getString('E131', 'EMPLOYEE_ID');
            case 'cardIdNumber': return RS.getString('E131', 'ID_CARD')
        }
    }
    setValue(contactDetail) {
        this.setState({ contactDetail })
    }

    getValue() {
        let contactDetail = this.state.contactDetail

        const fields = [
            'firstName', 'lastName', 'birthday', 'identifier', 'startDate', 'endDate',
            'workMobile', 'deskPhone', 'email', 'privateMobile', 'homePhone', 'cardIdNumber'
        ]

        for (let field of fields) {
            contactDetail[field] = this[field].getValue();
        }

        let geographic = {}
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                geographic = this.employeeAddressAU.getValue();
                break;
            case COUNTRY.VN:
                geographic = this.employeeAddressVN.getValue();
                break;
        }
        contactDetail = _.assign(contactDetail, geographic)
        this.setState({ contactDetail })
        return {
            avatar: _.clone(this.state.avatar),
            contactDetail: _.cloneDeep(contactDetail)
        };
    }

    updateContactDto(fieldName, value) {
        let contactDetail = this.state.contactDetail;
        contactDetail[fieldName] = value;
        this.setState({ contactDetail })
        this.state.error[fieldName] = '';
    }

    validateContactDetails() {
        let rs = true;
        const fieldValidates = [
            'firstName', 'lastName', 'birthday', 'identifier', 'group',
            'startDate', 'endDate', 'type', 'accessRoles', 'workingLocation', 'email',
            'workMobile', 'privateMobile', 'homePhone', 'deskPhone', 'cardIdNumber'
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
            })
            return rs;
        }

        let fieldServerValidate = [
            {
                fieldOnServer: 'identifier',
                fieldOnUI: 'identifier',
                value: this.identifier.getValue()
            },
            {
                fieldOnServer: 'cardIdNumber',
                fieldOnUI: 'cardIdNumber',
                value: this.cardIdNumber.getValue()
            },
        ]

        fieldServerValidate = fieldServerValidate.filter(x => this[x.fieldOnUI].getValue() != this.props.originEmployee.contactDetail[x.fieldOnUI])

        if (!fieldServerValidate.length) {
            this.props.validatedSuccess();
        }
        this.isSubmit = true;
        this.props.validateTotalFieldsEmployee(fieldServerValidate);
    }

    loadReportToEmployee(input) {
        if (!this.state.isMounted) return;
        return loadAllMember(this.props.curEmp, input);
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
                this.refs.inputAvatar.value = ""
                this.state.error.avatar = ""
                this.setState({
                    avatar: {
                        resultFileAvatar: upload.target.result,
                        name: file.name
                    },
                    openChangeAvatar: true,
                });
            }

            else {
                alert(RS.getString('E108'));
            }
        };

        reader.readAsDataURL(file);
    }
    handleClosePopup() {
        this.setState({
            openChangeAvatar: false
        })
    }
    handleSubmitPopup() {
        this.handleClosePopup();
    }
    handleAvatarChange(result) {
        let avatar = this.state.avatar;
        avatar.file = result
        this.setState({ avatar })
    }
    checkFieldEmployee(fieldOnServer, fieldOnUI) {
        if (this[fieldOnUI].validate() && this[fieldOnUI].getValue() != this.props.originEmployee.contactDetail[fieldOnUI]) {
            this.isValidating = true;
            this.props.validateFieldEmployee(fieldOnServer, fieldOnUI, this[fieldOnUI].getValue());
        }
    }
    handleChangeStartDate(value) {
        let contactDetail = _.cloneDeep(this.state.contactDetail);
        contactDetail.startDate = value;
        this.setState({ contactDetail });
        setTimeout(() => {
            this.endDate && this.endDate.validate();
        }, 200);
    }
    handleDeleteEmergencyContact(e) {
        let contactDetail = this.state.contactDetail;
        contactDetail = _.assign(contactDetail, { emergencyContacts: e })
        this.setState({ contactDetail });
    }

    handleAddEmergencyContact(e) {
        let contactDetail = this.state.contactDetail;
        contactDetail = _.assign(contactDetail, { emergencyContacts: e })
        this.setState({ contactDetail })
    }
    showHintText() {
        let hintText = '(+84) xxx xxx xxx';
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU: hintText = '(+61) xxx xxx xxx';
                return hintText;
                break;
            case COUNTRY.VN:
                return hintText;
                break;
        }
    }
    renderAddress() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return (
                    <EmployeeAddressAU
                        contactDetail={this.state.contactDetail}
                        updateContactDto={this.updateContactDto}
                        districts={this.props.districts}
                        states={this.props.states}
                        cities={this.props.cities}
                        ref={(employeeAddressAU) => this.employeeAddressAU = employeeAddressAU}
                    />
                )
            case COUNTRY.VN:
                return (
                    <EmployeeAddressVN
                        contactDetail={this.state.contactDetail}
                        updateContactDto={this.updateContactDto}
                        districts={this.props.districts}
                        cities={this.props.cities}
                        ref={(employeeAddressVN) => this.employeeAddressVN = employeeAddressVN}
                    />
                )
        }
    }
    render() {
        let propertyItem = {
            label: 'name',
            value: 'id',
        }
        let propertyItemReportTo = {
            label: 'fullName',
            value: 'id',
            photoUrl: 'photoUrl'
        }

        let genderOptions = getGenderOptions();
        let workingLocationTypeOptions = getWorkingLocationTypeOptions();
        workingLocationTypeOptions = _.filter(workingLocationTypeOptions, x => x.id !== LOCATION_TYPE.LOCATION);
        let locations = [...workingLocationTypeOptions, ...this.props.locations]
        this.employeeConstraints = this.props.employeeConstraints
        if (this.state.contactDetail.startDate) {
            let earliest = new Date(this.state.contactDetail.startDate);
            earliest.setDate(earliest.getDate() + 1)
            this.employeeConstraints.endDate.datetime.earliest = earliest;
        }
        return (
            <div className="employee-contact-detail">
                <div className="new-employee-info-container">
                    <div className="new-employee-title uppercase">{RS.getString('EMPLOYEE_INFORMATION')}</div>
                    <div className="row">
                        <div className="avatar-container col-xs-12 col-sm-3" >
                            <div className="photo-upload">
                                {this.state.avatar.file ?
                                    <img className="img-upload" src={this.state.avatar.file} /> :
                                    <img
                                        className="img-upload"
                                        src={this.state.contactDetail.photoUrl ? API_FILE + this.state.contactDetail.photoUrl : require("../../../../images/avatarDefault.png")}
                                    />
                                }
                                <label htmlFor="photoFile" className="img-button-upload">
                                    <div>
                                        <img className="icon-camera" src={require("../../../../images/camera.png")} />
                                    </div>
                                </label>
                            </div>
                            <input ref="inputAvatar" className="inputfile" id="photoFile" type="file" onChange={this.handleFile} />
                            <div className="error normal-font-size" > {this.state.error.avatar} </div>
                        </div>
                        <div className="col-xs-12 col-sm-9">
                            <div className="row">
                                <div className="col-xs-12 col-sm-4" >
                                    <CommonTextField
                                        required
                                        title={RS.getString('FIRST_NAME')}
                                        id="firstName"
                                        defaultValue={this.state.contactDetail.firstName}
                                        constraint={this.employeeConstraints.firstName}
                                        ref={(input) => this.firstName = input}
                                        maxLength={MAX_LENGTH_INPUT.NAME}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <CommonTextField
                                        required
                                        title={RS.getString('LAST_NAME')}
                                        id="lastName"
                                        defaultValue={this.state.contactDetail.lastName}
                                        constraint={this.employeeConstraints.lastName}
                                        ref={(input) => this.lastName = input}
                                        maxLength={MAX_LENGTH_INPUT.NAME}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <CommonTextField
                                        required
                                        title={RS.getString('ID_CARD')}
                                        id="lastName"
                                        defaultValue={this.state.contactDetail.cardIdNumber}
                                        constraint={this.employeeConstraints.cardIdNumber}
                                        ref={(input) => this.cardIdNumber = input}
                                        maxLength={MAX_LENGTH_INPUT.CARD_ID_NUMBER}
                                        onBlur={this.checkFieldEmployee.bind(this, 'cardIdNumber', 'cardIdNumber')}
                                        errorText={this.state.error.cardIdNumber}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <div className="col-xs-12 col-sm-6 first-col">
                                        <CommonDatePicker
                                            required
                                            title={RS.getString('DATE_OF_BIRTH')}
                                            ref={(input) => this.birthday = input}
                                            hintText="dd/mm/yyyy"
                                            id="birthday"
                                            constraint={this.employeeConstraints.birthday}
                                            defaultValue={this.state.contactDetail.birthday}
                                            endDate="0d"
                                            orientation="bottom auto"
                                            language={RS.getString("LANG_KEY")}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-6 last-col">
                                        <CommonSelect
                                            title={RS.getString('GENDER')}
                                            placeholder={RS.getString('SELECT')}
                                            clearable={false}
                                            searchable={false}
                                            name="select-gender"
                                            value={this.state.contactDetail.gender}
                                            options={genderOptions}
                                            onChange={this.updateContactDto.bind(this, 'gender')}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <CommonSelect
                                        required
                                        title={RS.getString('GROUP')}
                                        placeholder={RS.getString('SELECT')}
                                        clearable={false}
                                        searchable={false}
                                        name="group"
                                        value={this.state.contactDetail.group}
                                        options={this.props.groups}
                                        propertyItem={propertyItem}
                                        onChange={this.updateContactDto.bind(this, 'group')}
                                        ref={(group) => this.group = group}
                                        constraint={this.employeeConstraints.group}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <TextView
                                        disabled
                                        title={RS.getString('REPORT_TO')}
                                        image={_.get(this.state.contactDetail, 'group.supervisor.photoUrl') ? API_FILE + _.get(this.state.contactDetail, 'group.supervisor.photoUrl') : require("../../../../images/avatarDefault.png")}
                                        value={_.get(this.state.contactDetail, 'group.supervisor.fullName', '')}
                                        href={getUrlPath(URL.EMPLOYEE, { employeeId: _.get(this.state.contactDetail, 'group.supervisor.id', '') })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                required
                                title={RS.getString('EMPLOYEE_ID')}
                                id="identifier"
                                defaultValue={this.state.contactDetail.identifier}
                                constraint={this.employeeConstraints.identifier}
                                ref={(input) => this.identifier = input}
                                onBlur={this.checkFieldEmployee.bind(this, 'identifier', 'identifier')}
                                errorText={this.state.error.identifier}
                                maxLength={MAX_LENGTH_INPUT.EMPLOYEE_ID}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonSelect
                                required
                                title={RS.getString('EMPLOYMENT_TYPE')}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                value={this.state.contactDetail.type}
                                options={this.props.employeeTypes}
                                onChange={this.updateContactDto.bind(this, "type")}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                                constraint={this.employeeConstraints.type}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <div className="col-xs-12 col-sm-12 row title-start-end-date">
                                <span dangerouslySetInnerHTML={{ __html: RS.getString(['START_DATE_END_DATE_OPTIONAL']) }} />
                            </div>
                            <div className="col-xs-12 col-sm-6 box-start-date">
                                <CommonDatePicker
                                    required
                                    ref={(input) => this.startDate = input}
                                    hintText="dd/mm/yyyy"
                                    title=''
                                    id="startDate"
                                    defaultValue={this.state.contactDetail.startDate}
                                    orientation="bottom auto"
                                    constraint={this.employeeConstraints.startDate}
                                    onChange={this.handleChangeStartDate.bind(this)}
                                    startDate="0d"
                                    language={RS.getString("LANG_KEY")}
                                />
                            </div>
                            <span style={{ float: "left" }}>-</span>
                            <div className="col-xs-12 col-sm-6 box-end-date" >
                                <CommonDatePicker
                                    ref={(input) => this.endDate = input}
                                    hintText="dd/mm/yyyy"
                                    title=''
                                    id="endDate"
                                    defaultValue={this.state.contactDetail.endDate}
                                    orientation="bottom auto"
                                    constraint={this.employeeConstraints.endDate}
                                    language={RS.getString("LANG_KEY")}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonSelect
                                required
                                title={RS.getString('USER_ROLE')}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-userRoles"
                                propertyItem={propertyItem}
                                value={this.state.contactDetail.accessRoles}
                                options={this.props.userRoles}
                                onChange={this.updateContactDto.bind(this, "accessRoles")}
                                constraint={this.employeeConstraints.accessRoles}
                                ref={(accessRoles) => this.accessRoles = accessRoles}
                            />
                        </div>
                    </div>
                </div>
                <div className="new-employee-info-container" >
                    <div className="new-employee-title uppercase" >{RS.getString('WORKING_LOCATION')}</div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3" >
                            <CommonSelect
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-location"
                                value={this.state.contactDetail.location}
                                propertyItem={propertyItem}
                                options={locations}
                                onChange={this.updateContactDto.bind(this, 'location')}
                                constraint={this.employeeConstraints.location}
                                ref={(workingLocation) => this.workingLocation = workingLocation}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4 toggle-container" >
                            <MyCheckBox
                                label={RS.getString('GPS_TRACKING')}
                                className="filled-in"
                                id="gps"
                                defaultValue={this.state.contactDetail.isIgnoreGpsTracking}
                                onChange={this.updateContactDto.bind(this, 'isIgnoreGpsTracking')}
                            />
                            <MyCheckBox
                                label={RS.getString('REQUIRE_TO_CLOCKIN_CLOCKOUT')}
                                className="filled-in"
                                id="lockin-clockout"
                                defaultValue={this.state.contactDetail.isRequireTimeClock}
                                onChange={this.updateContactDto.bind(this, 'isRequireTimeClock')}
                            />
                        </div>
                    </div>
                </div>
                <div className="new-employee-info-container">
                    <div className="new-employee-title with-sub-header uppercase" >{RS.getString('CONTACT_INFORMATION', null, Option.CAPEACHWORD)}</div>
                    <div className="sub-header"> {RS.getString('WORK', null, Option.CAPEACHWORD)} </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonPhoneInput
                                title={RS.getString('MOBILE')}
                                id="workMobile"
                                defaultValue={this.state.contactDetail.workMobile}
                                ref={(input) => this.workMobile = input}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                ref={(input) => this.deskPhone = input}
                                title={RS.getString('DESK_PHONE')}
                                id="deskPhone"
                                defaultValue={this.state.contactDetail.extensionPhone || ''}
                                constraint={this.employeeConstraints.deskPhone}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                title={RS.getString('EMAIL')}
                                onBlur={this.checkEmail}
                                id="Email"
                                defaultValue={this.state.contactDetail.email}
                                constraint={this.employeeConstraints.email}
                                ref={(input) => this.email = input}
                                maxLength={MAX_LENGTH_INPUT.EMAIL}
                            />
                        </div>
                    </div>
                    <div className="sub-header"> {RS.getString('PRIVATE', null, Option.CAPEACHWORD)} </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonPhoneInput
                                ref={(input) => this.privateMobile = input}
                                title={RS.getString('MOBILE')}
                                id="privateMobile"
                                defaultValue={this.state.contactDetail.privateMobile || ''}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonPhoneInput
                                ref={(input) => this.homePhone = input}
                                title={RS.getString('HOME_PHONE', null, Option.CAPEACHWORD)}
                                id="homePhone"
                                defaultValue={this.state.contactDetail.homePhone || ''}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                            />
                        </div>
                    </div>
                    <div className="sub-header"> {RS.getString('EMPLOYEE_ADDRESS', null, Option.CAPEACHWORD)} </div>
                    {this.renderAddress()}
                </div>
                <div className="new-employee-info-container">
                    <div className="new-employee-title with-sub-header uppercase" >{RS.getString('EMERGENCY_CONTACTS', null, Option.CAPEACHWORD)}</div>
                    <div>
                        <div>
                            <EmergencyContacts
                                emergencyContacts={this.state.contactDetail.emergencyContacts}
                                handleDelete={this.handleDeleteEmergencyContact}
                                handleAddContact={this.handleAddEmergencyContact}
                                isEdit={true}
                            />
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
        )
    }
}

ContactDetails.propTypes = {
    contactDetail: PropTypes.object,
    originEmployee: PropTypes.object,
    employeeConstraints: PropTypes.object,
    groups: PropTypes.array,
    validateFieldEmployee: PropTypes.func,
    validatedResult: PropTypes.object,
    employeeTypes: PropTypes.array,
    userRoles: PropTypes.array,
    locations: PropTypes.array,
    cities: PropTypes.array,
    districts: PropTypes.array,
    states: PropTypes.array,
    validatedSuccess: PropTypes.func,
    avatar: PropTypes.object
}

export default ContactDetails;