import React, { PropTypes } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';

import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import DialogChangeAvatar from '../DialogChangeAvatar';
import AvatarSelect from '../../../elements/AvatarSelect.component';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import MyCheckBox from '../../../elements/MyCheckBox';
import Toggle from '../../../elements/toggle/Toggle';
import EmployeeAddressVN from '../NewEmployee/EmployeeAddressVN';
import EmployeeAddressAU from '../NewEmployee/EmployeeAddressAU';
import { getGenderOptions, AVATAR_SIZE_LIMIT, STATUS, WAITING_TIME, getWorkingLocationTypeOptions, LOCATION_TYPE, USER_ROLES } from '../../../../core/common/constants';
import RS, { Option } from '../../../../resources/resourceManager';
import { COUNTRY, MAX_LENGTH_INPUT } from '../../../../core/common/config';
import { getEmployeeConstraints } from '../../../../validation/employeeConstraints';
import { loadAllMember } from '../../../../actions/employeeActions';
import EmergencyContacts from '../EmergencyContacts';
import CommonPhoneInput from '../../../elements/TextField/CommonPhoneInput.component';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import TextView from '../../../elements/TextView';

const propTypes = {
    contactDetail: PropTypes.object,
    originContactDetail: PropTypes.object,
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
    validateTotalFieldsEmployee: PropTypes.func
}

class ContactDetailsEdit extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.state = {
            error: {
                email: '',
                accountName: '',
                workMobile: ''
            },
            contactDetail: {}
        };
        this.loadReportToEmployee = this.loadReportToEmployee.bind(this);
        this.setValue = this.setValue.bind(this);
        this.updateContactDto = this.updateContactDto.bind(this);
        this.getValue = this.getValue.bind(this);
        this.checkFieldEmployee = this.checkFieldEmployee.bind(this);
        this.handleAddEmergencyContact = this.handleAddEmergencyContact.bind(this);
        this.handleDeleteEmergencyContact = this.handleDeleteEmergencyContact.bind(this);
        this.renderValue = this.renderValue.bind(this);
    }

    componentDidMount() {
        this.setState({ contactDetail: _.cloneDeep(this.props.contactDetail) })
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.validatedResult, this.props.validatedResult) || this.isSubmit) {
            this.isPass = true;
            const fieldValidatedFromServer = ['identifier', 'cardIdNumber'];
            let error = this.state.error;
            for (let field of fieldValidatedFromServer) {
                if (nextProps.validatedResult[field]) {
                    if (nextProps.validatedResult[field].result === STATUS.ACCEPTED ||
                        _.isEqual(this[field].getValue(), this.props.originContactDetail[field])) {
                        error[nextProps.validatedResult[field].fieldOnUI] = "";
                    } else {
                        if (nextProps.validatedResult[field].result === STATUS.IS_EXISTED) {
                            error[nextProps.validatedResult[field].fieldOnUI] = this.setErrorText(nextProps.validatedResult[field].fieldOnUI);
                            this.isPass = false;
                        }
                    }
                }
            }
            if (this.isSubmit && this.isPass) {
                this.props.validatedSuccess();
                this.isSubmit = false;
                this.isPass = false;
            }
            this.setState({ error })
        }
    }

    isPass = false
    isSubmit = false

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

        // let geographic = {}
        // switch (LOCALIZE.COUNTRY) {
        //     case COUNTRY.AU:
        //         geographic = this.employeeAddressAU.getValue();
        //         break;
        //     case COUNTRY.VN:
        //         geographic = this.employeeAddressVN.getValue();
        //         break;
        // }
        // contactDetail = _.assign(contactDetail, geographic)
        this.setState({ contactDetail })
        return _.cloneDeep(contactDetail);

    }

    updateContactDto(fieldName, value) {
        let contactDetail = this.state.contactDetail;
        contactDetail[fieldName] = value;
        this.setState({ contactDetail }, () => {
            this.props.updateContactDto && this.props.updateContactDto(contactDetail)
        })
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

        const fieldServerValidate = [
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
        this.isSubmit = true;
        this.props.validateTotalFieldsEmployee(fieldServerValidate);
    }

    loadReportToEmployee(input) {
        if (!this.state.isMounted) return;
        return loadAllMember(this.props.curEmp, input);
    }
    checkFieldEmployee(fieldOnServer, fieldOnUI) {
        if (this[fieldOnUI].validate() &&
            !_.isEqual(this[fieldOnUI].getValue(), this.props.originContactDetail[fieldOnUI])) {
            this.props.validateFieldEmployee(fieldOnServer, fieldOnUI, this[fieldOnUI].getValue());
        }
    }

    handleChangeStartDate(value) {
        let contactDetail = _.cloneDeep(this.state.contactDetail);
        contactDetail.startDate = value;
        this.setState({ contactDetail }, () => {
            this.props.updateContactDto && this.props.updateContactDto(contactDetail);
        });
        setTimeout(() => {
            this.endDate && this.endDate.validate();
        }, 200);
    }

    handleDeleteEmergencyContact(e) {
        let contactDetail = this.state.contactDetail;
        contactDetail = _.assign(contactDetail, { emergencyContacts: e })
        this.setState({ contactDetail }, () => {
            this.props.updateContactDto && this.props.updateContactDto(contactDetail);
        });
    }

    handleAddEmergencyContact(e) {
        let contactDetail = this.state.contactDetail;
        contactDetail = _.assign(contactDetail, { emergencyContacts: e })
        this.setState({ contactDetail }, () => {
            this.props.updateContactDto && this.props.updateContactDto(contactDetail);
        });
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
                        originContactDetail={this.props.originContactDetail}
                        contactDetail={this.state.contactDetail}
                        updateContactDto={this.updateContactDto}
                        employeeConstraints={this.employeeConstraints}
                        districts={this.props.districts}
                        states={this.props.states}
                        cities={this.props.cities}
                        ref={(employeeAddressAU) => this.employeeAddressAU = employeeAddressAU}
                    />
                )
            case COUNTRY.VN:
                return (
                    <EmployeeAddressVN
                        originContactDetail={this.props.originContactDetail}
                        contactDetail={this.state.contactDetail}
                        updateContactDto={this.updateContactDto}
                        employeeConstraints={this.employeeConstraints}
                        districts={this.props.districts}
                        cities={this.props.cities}
                        ref={(employeeAddressVN) => this.employeeAddressVN = employeeAddressVN}
                    />
                )
        }
    }
    renderValue(option) {
        return (
            <span>
                {
                    option.isDefault ?
                        <span>{option.label} <span className="font-weight-normal">{' (' + RS.getString('DEFAULT') + ')'}</span></span>
                        : option.label
                }
            </span>
        );

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

        const { originContactDetail } = this.props;
        let genderOptions = getGenderOptions();
        let workingLocationTypeOptions = getWorkingLocationTypeOptions();
        workingLocationTypeOptions = _.filter(workingLocationTypeOptions, x => x.id !== LOCATION_TYPE.LOCATION);
        const { contactDetail } = this.state;
        let locations = [...workingLocationTypeOptions, ...this.props.locations];
        this.employeeConstraints = _.cloneDeep(this.props.employeeConstraints);
        this.employeeConstraints.endDate.datetime.earliest = contactDetail.startDate;
        return (
            <div className="employee-contact-detail">
                <div className="new-employee-info-container">
                    <div className="new-employee-title uppercase">{RS.getString('EMPLOYEE_INFORMATION')}</div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                required
                                title={RS.getString('FIRST_NAME')}
                                id="firstName"
                                defaultValue={contactDetail.firstName}
                                constraint={this.employeeConstraints.firstName}
                                ref={(input) => this.firstName = input}
                                maxLength={MAX_LENGTH_INPUT.NAME}
                                onChange={(e, val) => this.updateContactDto('firstName', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                required
                                title={RS.getString('LAST_NAME')}
                                id="lastName"
                                defaultValue={contactDetail.lastName}
                                constraint={this.employeeConstraints.lastName}
                                ref={(input) => this.lastName = input}
                                maxLength={MAX_LENGTH_INPUT.NAME}
                                onChange={(e, val) => this.updateContactDto('lastName', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
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
                                onChange={(e, val) => this.updateContactDto('cardIdNumber', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <div className="col-xs-12 col-sm-6 first-col">
                                <CommonDatePicker
                                    required
                                    title={RS.getString('DATE_OF_BIRTH')}
                                    ref={(input) => this.birthday = input}
                                    hintText="dd/mm/yyyy"
                                    id="birthday"
                                    constraint={this.employeeConstraints.birthday}
                                    defaultValue={contactDetail.birthday}
                                    endDate="0d"
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                    onChange={this.updateContactDto.bind(this, 'birthday')}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 last-col">
                                <CommonSelect
                                    title={RS.getString('GENDER')}
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    name="select-gender"
                                    value={contactDetail.gender}
                                    options={genderOptions}
                                    onChange={(option) => {
                                        this.updateContactDto(
                                            'gender',
                                            option.value == originContactDetail.gender ? originContactDetail.gender : option
                                        )
                                    }}
                                />

                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-3">
                            <CommonSelect
                                required
                                disabled
                                title={RS.getString('GROUP')}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="group"
                                value={contactDetail.group}
                                options={this.props.groups}
                                propertyItem={propertyItem}
                                onChange={this.updateContactDto.bind(this, 'group')}
                                ref={(group) => this.group = group}
                                constraint={this.employeeConstraints.group}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <TextView
                                disabled
                                title={RS.getString('REPORT_TO')}
                                image={_.get(contactDetail, 'reportTo.photoUrl', '') ? API_FILE + _.get(contactDetail, 'reportTo.photoUrl', '') : require("../../../../images/avatarDefault.png")}
                                value={_.get(contactDetail, 'reportTo.fullName', '')}
                                href={getUrlPath(URL.EMPLOYEE, { employeeId: _.get(contactDetail, 'reportTo.id', '') })}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                required
                                title={RS.getString('EMPLOYEE_ID')}
                                id="identifier"
                                defaultValue={contactDetail.identifier}
                                constraint={this.employeeConstraints.identifier}
                                ref={(input) => this.identifier = input}
                                onBlur={this.checkFieldEmployee.bind(this, 'identifier', 'identifier')}
                                errorText={this.state.error.identifier}
                                maxLength={MAX_LENGTH_INPUT.EMPLOYEE_ID}
                                onChange={(e, val) => this.updateContactDto('identifier', val)}
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
                                value={contactDetail.type}
                                options={this.props.employeeTypes}
                                onChange={(option) => this.updateContactDto(
                                    "type",
                                    option.id == _.get(originContactDetail, 'type.id', null) ? originContactDetail.type : option
                                )}
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
                                    defaultValue={contactDetail.startDate}
                                    orientation="bottom auto"
                                    onChange={this.handleChangeStartDate.bind(this)}
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
                                    defaultValue={contactDetail.endDate}
                                    orientation="bottom auto"
                                    constraint={this.employeeConstraints.endDate}
                                    language={RS.getString("LANG_KEY")}
                                    onChange={this.updateContactDto.bind(this, 'endDate')}
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
                                value={contactDetail.accessRoles}
                                valueRenderer={this.renderValue}
                                optionRenderer={this.renderValue}
                                options={this.props.userRoles}
                                onChange={(option) => this.updateContactDto(
                                    "accessRoles",
                                    option.id == _.get(originContactDetail, 'accessRoles.id', null) ? originContactDetail.accessRoles : option
                                )}
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
                                required
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-location"
                                value={contactDetail.location}
                                propertyItem={propertyItem}
                                options={locations}
                                onChange={(option) => this.updateContactDto(
                                    "location",
                                    option.id == _.get(originContactDetail, 'location.id', null) ? originContactDetail.location : option
                                )}
                                constraint={this.employeeConstraints.location}
                                ref={(workingLocation) => this.workingLocation = workingLocation}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4 toggle-container" >
                            <MyCheckBox
                                label={RS.getString('GPS_TRACKING')}
                                className="filled-in"
                                id="gps"
                                defaultValue={contactDetail.isIgnoreGpsTracking}
                                onChange={this.updateContactDto.bind(this, 'isIgnoreGpsTracking')}
                            />
                            <MyCheckBox
                                label={RS.getString('REQUIRE_TO_CLOCKIN_CLOCKOUT')}
                                className="filled-in"
                                id="lockin-clockout"
                                defaultValue={contactDetail.isRequireTimeClock}
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
                                defaultValue={contactDetail.workMobile}
                                ref={(input) => this.workMobile = input}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                                errorText={this.state.error.workMobile}
                                onBlur={this.updateContactDto.bind(this, 'workMobile')}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                ref={(input) => this.deskPhone = input}
                                title={RS.getString('DESK_PHONE')}
                                id="deskPhone"
                                defaultValue={contactDetail.extensionPhone || ''}
                                constraint={this.employeeConstraints.deskPhone}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                                onChange={(e, val) => this.updateContactDto('deskPhone', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                title={RS.getString('EMAIL')}
                                onBlur={this.checkEmail}
                                id="Email"
                                defaultValue={contactDetail.email}
                                constraint={this.employeeConstraints.email}
                                ref={(input) => this.email = input}
                                maxLength={MAX_LENGTH_INPUT.EMAIL}
                                onChange={(e, val) => this.updateContactDto('email', val)}
                            />
                        </div>
                    </div>
                    <div className="sub-header"> {RS.getString('PRIVATE', null, Option.CAPEACHWORD)} </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonPhoneInput
                                ref={(input) => this.privateMobile = input}
                                title={RS.getString('MOBILE')}
                                id="personalPhone"
                                defaultValue={contactDetail.personalPhone || ''}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                                onBlur={this.updateContactDto.bind(this, 'privateMobile')}
                                onChange={(e, val) => this.updateContactDto('privateMobile', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonPhoneInput
                                ref={(input) => this.homePhone = input}
                                title={RS.getString('HOME_PHONE', null, Option.CAPEACHWORD)}
                                id="homePhone"
                                defaultValue={contactDetail.homePhone || ''}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                                onBlur={this.updateContactDto.bind(this, 'homePhone')}
                                onChange={(e, val) => this.updateContactDto('homePhone', val)}
                                privateMobile
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
                                emergencyContacts={contactDetail.emergencyContacts}
                                handleDelete={this.handleDeleteEmergencyContact}
                                handleAddContact={this.handleAddEmergencyContact}
                                isEdit={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ContactDetailsEdit.propTypes = propTypes;
export default ContactDetailsEdit;