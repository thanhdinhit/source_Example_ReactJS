import React, { PropTypes } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';

import CommonTextField from '../../elements/TextField/CommonTextField.component';
import AvatarSelect from '../../elements/AvatarSelect.component';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../elements/CommonSelect.component';
import MyCheckBox from '../../elements/MyCheckBox';
import Toggle from '../../elements/toggle/Toggle';
import EmployeeAddressVN from './NewEmployee/EmployeeAddressVN';
import EmployeeAddressAU from './NewEmployee/EmployeeAddressAU';

import MultiValueTextView from '../../elements/MultiValueTextView';
import dateHelper from '../../../utils/dateHelper';
import { getGenderOptions, AVATAR_SIZE_LIMIT, STATUS, WAITING_TIME} from '../../../core/common/constants';
import RS, { Option } from '../../../resources/resourceManager';
import { COUNTRY, MAX_LENGTH_INPUT } from '../../../core/common/config';
import { getEmployeeConstraints } from '../../../validation/employeeConstraints';
import { loadAllMember } from '../../../actions/employeeActions';
import TextView from '../../elements/TextView';
import EmergencyContacts from './EmergencyContacts';
const propTypes = {
    employee: PropTypes.object,
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

class ContactDetailsEditMyProfile extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.state = {
            contactDetail: {}
        };
        this.loadReportToEmployee = this.loadReportToEmployee.bind(this);
        this.setValue = this.setValue.bind(this);
        this.updateContactDto = this.updateContactDto.bind(this);
        this.getValue = this.getValue.bind(this);
        this.checkFieldEmployee = this.checkFieldEmployee.bind(this);
        this.handleAddEmergencyContact = this.handleAddEmergencyContact.bind(this);
        this.handleDeleteEmergencyContact = this.handleDeleteEmergencyContact.bind(this);
    }

    componentDidMount() {
        this.setState({ contactDetail: _.cloneDeep(this.props.employee) })
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.validatedResult, this.props.validatedResult) || this.isSubmit) {
            this.isPass = true;
            const fieldValidatedFromServer = ['identifier'];
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
        }
    }
    setValue(contactDetail) {
        this.setState({ contactDetail })
    }

    getValue() {
        let contactDetail = this.state.contactDetail;

        const fields = [ 
        'workMobile', 'deskPhone', 'email', 'privateMobile', 'homePhone']

        for (let field of fields) {
            contactDetail[field] = this[field].getValue();
        }

        // let geographic = {};
        // switch (LOCALIZE.COUNTRY) {
        //     case COUNTRY.AU:
        //         geographic = this.employeeAddressAU.getValue();
        //         break;
        //     case COUNTRY.VN:
        //         geographic = this.employeeAddressVN.getValue();
        //         break;
        // }
        // contactDetail = _.assign(contactDetail, geographic);
        if (_.isEqual(contactDetail, this.props.employee)) {
            contactDetail = null;
        }
        else {
            this.setState({ contactDetail });
        }
        return _.cloneDeep(contactDetail);
    }

    updateContactDto(fieldName, value) {
        let contactDetail = this.state.contactDetail;
        contactDetail[fieldName] = value;
        this.setState({ contactDetail }, () => {
            this.props.updateContactDto && this.props.updateContactDto(contactDetail)
        })
    }

    validateContactDetails() {
        let rs = true;
        const fieldValidates = [
           'email', 'privateMobile', 'homePhone', 'deskPhone', 'cardIdNumber'
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
        this.isSubmit = true;
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
        })
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
                        originContactDetail={this.props.employee}
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
                        originContactDetail={this.props.employee}
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
        this.employeeConstraints = this.props.employeeConstraints;
        const { contactDetail } = this.state
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
                                disabled
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
                                disabled
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                required
                                title={RS.getString('ID_CARD')}
                                id="cardIdNumber"
                                defaultValue={contactDetail.cardIdNumber}
                                constraint={this.employeeConstraints.cardIdNumber}
                                ref={(input) => this.cardIdNumber = input}
                                disabled
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
                                    disabled
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
                                    onChange={this.updateContactDto.bind(this, 'gender')}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonSelect
                                required
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
                                disabled
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <AvatarSelect
                                placeholder="---"
                                title={RS.getString('REPORT_TO')}
                                ref={(input) => this.reportTo = input}
                                disabled
                                noResultsText="No employee found"
                                name="reportTo"
                                value={contactDetail.group ? contactDetail.group.supervisor : undefined}
                                propertyItem={propertyItemReportTo}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('EMPLOYEE_ID')}
                                value={contactDetail.identifier}
                                disabled
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonSelect
                                required
                                title={RS.getString('EMPLOYEE_TYPE')}
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-employeeType"
                                value={contactDetail.type}
                                options={this.props.employeeTypes}
                                onChange={this.updateContactDto.bind(this, "type")}
                                propertyItem={propertyItem}
                                ref={(type) => this.type = type}
                                constraint={this.employeeConstraints.type}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
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
                                    disabled
                                    id="startDate"
                                    defaultValue={contactDetail.startDate}
                                    orientation="bottom auto"
                                    language={RS.getString("LANG_KEY")}
                                />
                            </div>
                            <span style={{ float: "left" }}>-</span>
                            <div className="col-xs-12 col-sm-6 box-end-date" >
                                <CommonDatePicker
                                    ref={(input) => this.endDate = input}
                                    hintText="dd/mm/yyyy"
                                    title=''
                                    disabled
                                    id="endDate"
                                    defaultValue={contactDetail.endDate}
                                    orientation="bottom auto"
                                    constraint={this.employeeConstraints.endDate}
                                    language={RS.getString("LANG_KEY")}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonSelect
                                required
                                disabled
                                title={RS.getString('USER_ROLE')}
                                placeholder={RS.getString('SELECT')}
                                clearable={true}
                                searchable={true}
                                name="select-userRoles"
                                propertyItem={propertyItem}
                                value={contactDetail.accessRoles}
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
                                required
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="select-location"
                                disabled
                                value={contactDetail.location}
                                propertyItem={propertyItem}
                                options={this.props.locations}
                                onChange={this.updateContactDto.bind(this, 'location')}
                                ref={(workingLocation) => this.workingLocation = workingLocation}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-4 toggle-container">
                            <MyCheckBox
                                label={RS.getString('GPS_TRACKING')}
                                defaultValue={contactDetail.isIgnoreGpsTracking}
                                disabled={true}
                            />
                            <MyCheckBox
                                label={RS.getString('REQUIRE_TO_CLOCKIN_CLOCKOUT')}
                                disabled={true}
                                defaultValue={contactDetail.isRequireTimeClock}
                            />
                        </div>
                    </div>
                </div>
                <div className="new-employee-info-container">
                    <div className="new-employee-title with-sub-header uppercase" >{RS.getString('CONTACT_INFORMATION', null, Option.CAPEACHWORD)}</div>
                    <div className="sub-header"> {RS.getString('WORK', null, Option.CAPEACHWORD)} </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                title={RS.getString('MOBILE')}
                                id="workMobile"
                                disabled
                                defaultValue={contactDetail.workMobile}
                                ref={(input) => this.workMobile = input}
                                hintText={this.showHintText()}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                ref={(input) => this.deskPhone = input}
                                title={RS.getString('DESK_PHONE')}
                                id="deskPhone"
                                constraint={this.employeeConstraints.deskPhone}
                                defaultValue={contactDetail.deskPhone || ''}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                                onChange={(e, val) => this.updateContactDto('deskPhone', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <CommonTextField
                                title={RS.getString('EMAIL')}
                                onBlur={this.checkEmail}
                                id="Email"
                                constraint={this.employeeConstraints.email}
                                disabled
                                defaultValue={contactDetail.email}
                                ref={(input) => this.email = input}
                            />
                        </div>
                    </div>
                    <div className="sub-header"> {RS.getString('PRIVATE', null, Option.CAPEACHWORD)} </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                ref={(input) => this.privateMobile = input}
                                title={RS.getString('MOBILE')}
                                id="privateMobile"
                                constraint={this.employeeConstraints.phone}
                                defaultValue={contactDetail.privateMobile || ''}
                                hintText={this.showHintText()}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                                onChange={(e, val) => this.updateContactDto('privateMobile', val)}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <CommonTextField
                                ref={(input) => this.homePhone = input}
                                title={RS.getString('HOME_PHONE', null, Option.CAPEACHWORD)}
                                id="homePhone"
                                defaultValue={contactDetail.homePhone || ''}
                                hintText={this.showHintText()}
                                constraint={this.employeeConstraints.phone}
                                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
                                onChange={(e, val) => this.updateContactDto('homePhone', val)}
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

ContactDetailsEditMyProfile.propTypes = propTypes;
export default ContactDetailsEditMyProfile;