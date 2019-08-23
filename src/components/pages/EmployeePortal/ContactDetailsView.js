import React, { PropTypes } from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import TextView from '../../elements/TextView';
import MultiValueTextView from '../../elements/MultiValueTextView';
import dateHelper from '../../../utils/dateHelper';
import RaisedButton from '../../elements/RaisedButton';
import Toggle from '../../elements/toggle/Toggle';
import { COUNTRY } from '../../../core/common/config';
import MyCheckBox from '../../elements/MyCheckBox';
import EmergencyContacts from './EmergencyContacts';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
const ContactDetailsView = React.createClass({
    propTypes: {
        employee: PropTypes.object.isRequired
    },
    renderPersonalInfo: function () {
        const { employee } = this.props;
        let reportToPhotoUrl = _.get(employee, 'contactDetail.reportTo.photoUrl', '');
        return (
            <div className="new-employee-info-container">
                <div className="new-employee-title uppercase">{RS.getString('EMPLOYEE_INFORMATION', null, Option.UPPER)}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('FIRST_NAME')}
                            value={employee.contactDetail.firstName}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('LAST_NAME')}
                            value={employee.contactDetail.lastName}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('ID_CARD')}
                            value={employee.contactDetail.cardIdNumber}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <div className="col-xs-12 col-sm-6 first-col" >
                            <TextView
                                title={RS.getString('DATE_OF_BIRTH')}
                                value={employee.contactDetail.birthday ? dateHelper.handleFormatDateAsian(employee.contactDetail.birthday) : ''}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-6 last-col" >
                            <TextView
                                title={RS.getString('GENDER')}
                                value={employee.contactDetail.gender.value || employee.contactDetail.gender}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('GROUP')}
                            value={_.get(employee, 'contactDetail.group.name', '')}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            disabled
                            title={RS.getString('REPORT_TO')}
                            image={reportToPhotoUrl ? API_FILE + reportToPhotoUrl : require("../../../images/avatarDefault.png")}
                            value={_.get(employee, 'contactDetail.reportTo.fullName', '')}
                            href={getUrlPath(URL.EMPLOYEE, { employeeId: _.get(employee, 'contactDetail.reportTo.id', '') })}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('EMPLOYEE_ID')}
                            value={employee.contactDetail.identifier}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('EMPLOYMENT_TYPE')}
                            value={_.get(employee, 'contactDetail.type.name', '')}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <div className="col-xs-12 col-sm-12 row title-start-end-date">
                            <span>{RS.getString(['EMPLOYMENT_START_DATE_END_DATE'])}</span>
                        </div>
                        <div className="col-xs-12 col-sm-6 box-start-date">
                            <TextView
                                title=''
                                value={employee.contactDetail.startDate ? dateHelper.handleFormatDateAsian(employee.contactDetail.startDate) : ''}
                            />
                        </div>
                        <span style={{ float: "left" }}>-</span>
                        <div className="col-xs-12 col-sm-6 box-end-date" >
                            <TextView
                                title=''
                                value={employee.contactDetail.endDate ? dateHelper.handleFormatDateAsian(employee.contactDetail.endDate) : ''}
                            />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('USER_ROLE')}
                            value={_.get(employee, 'contactDetail.accessRoles.name', '')}
                        />
                    </div>
                </div>
            </div>
        )
    },

    renderContactInfo: function () {
        const { employee } = this.props;
        return (
            <div className="new-employee-info-container">
                <div className="new-employee-title with-sub-header uppercase">{RS.getString('CONTACT_INFORMATION', null, Option.UPPER)}</div>
                <div className="sub-header"> {RS.getString('WORK', null, Option.CAPEACHWORD)} </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('MOBILE')}
                            value={employee.contactDetail.workMobile}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('DESK_PHONE')}
                            value={employee.contactDetail.deskPhone}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('EMAIL')}
                            value={employee.contactDetail.email}
                        />
                    </div>
                </div>
                <div className="sub-header"> {RS.getString('PRIVATE', null, Option.CAPEACHWORD)} </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('MOBILE')}
                            value={employee.contactDetail.privateMobile}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            title={RS.getString('HOME_PHONE')}
                            value={employee.contactDetail.homePhone}
                        />
                    </div>
                </div>
                <div className="sub-header"> {RS.getString('EMPLOYEE_ADDRESS', null, Option.CAPEACHWORD)} </div>
                {
                    LOCALIZE.COUNTRY == COUNTRY.VN &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-6" >
                            <TextView
                                title={RS.getString('STREET')}
                                value={employee.contactDetail.street}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('DISTRICT')}
                                value={employee.contactDetail.district}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('CITY')}
                                value={_.get(employee, 'contactDetail.city.name', '')}
                            />
                        </div>
                    </div>
                }
                {
                    LOCALIZE.COUNTRY == COUNTRY.AU &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('STREET')}
                                value={employee.contactDetail.street}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('CITY')}
                                value={_.get(employee, 'contactDetail.city.name', '')}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('STATE')}
                                value={_.get(employee, 'contactDetail.state.name', '')}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-3" >
                            <TextView
                                title={RS.getString('POST_CODE')}
                                value={employee.contactDetail.postCode}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    },

    renderWorkingLocation: function () {
        const { employee } = this.props;
        return (
            <div className="new-employee-info-container">
                <div className="new-employee-title uppercase">{RS.getString('WORKING_LOCATION', null, Option.UPPER)}</div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3" >
                        <TextView
                            value={_.get(employee, 'contactDetail.location.name', '')}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4 toggle-container">
                        <MyCheckBox
                            label={RS.getString('GPS_TRACKING')}
                            defaultValue={employee.contactDetail.isIgnoreGpsTracking}
                            disabled={true}
                        />
                        <MyCheckBox
                            label={RS.getString('REQUIRE_TO_CLOCKIN_CLOCKOUT')}
                            disabled={true}
                            defaultValue={employee.contactDetail.isRequireTimeClock}
                        />
                    </div>
                </div>
            </div>
        );
    },

    renderEmergencyContacts: function () {
        return (
            <div className="new-employee-info-container">
                <div className="new-employee-title with-sub-header uppercase" >{RS.getString('EMERGENCY_CONTACTS', null, Option.CAPEACHWORD)}</div>
                <div>
                    <div>
                        <EmergencyContacts
                            emergencyContacts={this.props.employee.contactDetail.emergencyContacts}
                            isEdit={false}
                        />
                    </div>
                </div>
            </div>
        )
    },

    render: function () {
        const { employee } = this.props;
        return (
            <div className="employee-contact-detail">
                {this.renderPersonalInfo()}
                {this.renderWorkingLocation()}
                {this.renderContactInfo()}
                {this.renderEmergencyContacts()}
            </div>
        );
    }
})

export default ContactDetailsView;