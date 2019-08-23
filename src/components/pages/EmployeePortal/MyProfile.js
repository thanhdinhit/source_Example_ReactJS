import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { MY_PROFILE } from '../../../constants/routeConfig';
import DialogChangeAvatar from './DialogChangeAvatar';
import RS, { Option } from '../../../resources/resourceManager';
import DialogChangePassword from '../../../containers/Login/DialogChangePasswordContainer';
import * as toastr from '../../../utils/toastr';
import RIGHTS from '../../../constants/rights';
import Breadcrumb from '../../elements/Breadcrumb';
import { COMPONENT_NAME, EMPLOYEE_TABS } from '../../../core/common/constants';
import ContactDetailsView from './ContactDetailsView';
import ContactDetailsEditMyProfile from './ContactDetailsEditMyProfile';
import JobRoleAndPayRateView from './JobRoleAndPayRateView';
import AttachmentView from './AttachmentView';
import EmergencyContacts from './EmergencyContacts';
import { getEmployeeConstraints } from '../../../validation/employeeConstraints';
import DialogAlert from '../../elements/DialogAlert';
import Tabs from '../../elements/HorizontalTabs/HorizontalTab';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import HandsetsViewContainer from '../../../containers/EmployeePortal/ViewEditEmployee/HandsetsViewContainer';
import { returnHandset } from '../../../actions/handsetsActions';

const redirect = MY_PROFILE;
export default React.createClass({
    getInitialState: function () {
        return {
            error: {},
            avatarCroped: undefined,
            avatarName: '',
            resultFileAvatar: undefined,
            openChangeAvatar: false,
            openConfirm: false,
            isEditMyprofile: false,
            openDialogChangePassword: false,
            isOpenContact: true,
            isOpenAvailabilityAndWorkingTime: false,
            isOpenJobRoleAndSkill: false,
            isOpenDialogLeaveTab: false,
            waitingTab: undefined,
            curTab: 0
        }
    },
    componentDidMount: function () {
        this.loadDataPrepareTab(this.state.curTab)
    },
    componentDidUpdate: function () {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFULLY'), RS.getString('SUCCESS'))
            this.props.resetState();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            if (this.props.payload.error.message != 'Old_Password_Is_Incorrect') {
                this.setState({ warning: this.props.payload.error.message });
            }
            this.props.resetError();
        }
    },
    handleFile: function (e) {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            if (file.size / 1024 < 300) {
                this.refs.inputAvatar.value = '';
                this.state.error.avatar = '';
                this.setState({
                    resultFileAvatar: upload.target.result,
                    openChangeAvatar: true,
                    avatarName: file.name
                });
            }
            else {
                toastr.error(RS.getString('E108'), RS.getString('ERROR'));
                this.forceUpdate();
            }
        };

        reader.readAsDataURL(file);
    },
    handleAvatarChange: function (result) {
        this.setState({ avatarCroped: result });
        this.props.uploadAvatar({
            contactDetail: _.cloneDeep(this.props.myProfile.contactDetail),
            avatar: { file: result, name: this.state.avatarName }
        });
    },
    handleClosePopup: function () {
        this.setState({
            openChangeAvatar: false,
            openConfirm: false
        });
    },
    handleSubmitPopup: function () {
        this.setState({
            openChangeAvatar: false
        });
    },
    handleRender: function (index) {
        this.setState({ curTab: index });
        this.loadDataPrepareTab(index)
    },
    handleEditMyProfile: function () {
        this.setState({
            isEditMyprofile: true,
        });
    },
    handleCancel: function () {
        this.setState({
            isEditMyprofile: false,
            infoHasChanged: false
        });
    },
    handleChangeTab: function (index) {
        if (this.state.isEditMyprofile && EMPLOYEE_TABS.CONTACT_DETAILS == this.state.curTab && this.state.infoHasChanged) {
            this.setState({ isOpenDialogLeaveTab: true });
            this.waitingTab = index;
            return;
        }
        this.loadDataPrepareTab(index);
        this.setState({ curTab: index });
    },
    handleLeaveTab: function () {
        this.setState({
            isOpenDialogLeaveTab: false,
            curTab: this.waitingTab,
            isEditMyprofile: false,
            infoHasChanged: false
        })
        this.loadDataPrepareTab(this.waitingTab);
    },
    handleCancelLeaveTab: function () {
        this.setState({ isOpenDialogLeaveTab: false })
    },
    handleSubmitEditContactDetails: function () {
        let contactDetail = this.contactDetailsEditMyProfile.getValue();

        if (contactDetail != null) {
            this.props.editMyProfileContactDetail(_.cloneDeep(contactDetail), redirect);
        }
        this.setState({ isEditMyprofile: false, infoHasChanged: false });
    },

    handleSave: function () {
        if(this.contactDetailsEditMyProfile.validateContactDetails()!= false){
            this.handleSubmitEditContactDetails();
            window.scrollTo(0, 0);
        }
    },

    handleDeleteEmergencyContact: function (emergencyContact) {
        this.props.emergencyContactActions.deleteEmergencyContactMyProfile(emergencyContact.id);
    },
    handleAddEmergencyContact: function (emergencyContact) {
        this.props.emergencyContactActions.addEmergencyContactMyProfile(emergencyContact);
    },
    loadDataPrepareTab: function (tab) {
        switch (tab) {
            case EMPLOYEE_TABS.CONTACT_DETAILS:
                this.props.loadCities();
                this.props.loadDistricts();
                this.props.loadStates();
                this.props.loadMyProfileContactDetail();
                this.props.loadMyProfileJobRoleSkills();
                break;
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                this.props.loadMyProfileJobRoleSkills();
                break;
            case EMPLOYEE_TABS.ATTACHMENT:
                this.props.loadMyProfileAttachment()
                break;
            case EMPLOYEE_TABS.HANDSETS:
                this.props.loadEmployeeHandsets(this.props.curEmp.employeeId);
                break;
        }
    },
    handleUpdateContactDto: function (contactDetail) {
        this.setState({
            infoHasChanged: _.isEqual(this.props.myProfile.contactDetail, contactDetail) ? false : true
        })
    },
    renderTab: function (curTab) {
        let myprofile = this.props.myProfile;
        this.employeeConstraints = getEmployeeConstraints();

        switch (curTab) {
            case EMPLOYEE_TABS.CONTACT_DETAILS:
                if (this.state.isEditMyprofile) {
                    return (
                        <ContactDetailsEditMyProfile
                            key={curTab}
                            employee={myprofile.contactDetail}
                            employeeConstraints={this.employeeConstraints}
                            ref={(contactDetailsEditMyProfile) => this.contactDetailsEditMyProfile = contactDetailsEditMyProfile}
                            locations={this.props.locations}
                            cities={this.props.cities}
                            districts={this.props.districts}
                            states={this.props.states}
                            updateContactDto={this.handleUpdateContactDto}
                        />
                    )
                }
                else {
                    return (
                        <ContactDetailsView
                            key={curTab}
                            employee={myprofile}
                        />
                    )
                }

                break;
            case EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE:
                return (
                    <JobRoleAndPayRateView
                        job={myprofile.job}
                        permissionEdit={false}
                        curEmp={this.props.curEmp}
                    />
                );
            case EMPLOYEE_TABS.ATTACHMENT:
                return (
                    <AttachmentView
                        attachment={myprofile.attachment}
                    />
                )
                break;
            case EMPLOYEE_TABS.HANDSETS: {
                return (
                    <HandsetsViewContainer />
                );
            }
        }
    },
    tabs: [
        {
            value: EMPLOYEE_TABS.CONTACT_DETAILS,
            icon: 'icon-contact-info',
            label: 'CONTACT_DETAILS'
        },
        {
            value: EMPLOYEE_TABS.JOBROLE_AND_PAY_RATE,
            icon: 'icon-jobrole-skill',
            label: 'JOB_ROLE_PAY_RATE'
        },
        {
            value: EMPLOYEE_TABS.ATTACHMENT,
            icon: 'icon-attachment',
            label: 'ATTACHMENT'
        },
        {
            value: EMPLOYEE_TABS.HANDSETS,
            icon: 'icon-handsets',
            label: 'HANDSETS'
        }
    ],
    convertToCorrectTabLanguage: function (tabs) {
        return tabs.map(function (tab) {
            tab.label = RS.getString(tab.label, null, Option.CAPEACHWORD);
            return tab;
        });
    },
    renderMenuProfile: function () {
        const { myProfile } = this.props;
        const tabs = this.convertToCorrectTabLanguage(_.cloneDeep(this.tabs));
        let photoUrl = _.get(myProfile, "contactDetail.photoUrl")
        return (
            <div className="profile-header">
                <div className="box-avatar">
                    {
                        this.state.avatarCroped ?
                            <img className="avatar-profile" src={this.state.avatarCroped} /> :
                            <img className="avatar-profile" src={photoUrl ? API_FILE + photoUrl
                                : require("../../../images/avatarDefault.png")} />
                    }
                    <label htmlFor="photoFile" className="img-button-upload">
                        <div className="input-camera">
                            <i className="icon-camera"></i>
                        </div>
                    </label>
                </div>
                <input ref="inputAvatar" className="inputfile" id="photoFile" type="file" onChange={this.handleFile} />
                <div className="name-profile">
                    <div>{myProfile && myProfile.contactDetail.fullName || ''}</div>
                    <div className="userrole-name">{_.get(myProfile, "job.jobRole.name", '')}</div>
                </div>
                {
                    (this.state.isEditMyprofile && this.state.curTab == EMPLOYEE_TABS.CONTACT_DETAILS) ?
                        <div className="header-button">
                            {this.props.curEmp.rights.find(x => x == RIGHTS.CHANGE_PASSWORD) ?
                                <RaisedButton
                                    className="cancel-button"
                                    label={RS.getString('CANCEL')}
                                    onClick={this.handleCancel}
                                /> : null}
                            {this.props.curEmp.rights.find(x => x == RIGHTS.MODIFY_MY_PROFILE) && this.state.curTab == 0 ?
                                <RaisedButton
                                    className="edit-button"
                                    label={RS.getString('SAVE')}
                                    onClick={this.handleSave}
                                    disabled={!this.state.infoHasChanged}
                                /> : null}
                        </div> :
                        <div className="header-button">
                            {this.props.curEmp.rights.find(x => x == RIGHTS.MODIFY_MY_PROFILE) && this.state.curTab == 0 ?
                                <RaisedButton
                                    className="edit-button"
                                    label={RS.getString('EDIT')}
                                    onClick={this.handleEditMyProfile}
                                /> : null}
                            {this.props.curEmp.rights.find(x => x == RIGHTS.CHANGE_PASSWORD) ?
                                <RaisedButton
                                    className="change-pw-button"
                                    label={RS.getString('CHANGE_PASSWORD')}
                                    onClick={() => this.setState({ openDialogChangePassword: true })}
                                /> : null}
                        </div>
                }
                {
                    this.props.curEmp.rights.find(x => x == RIGHTS.VIEW_MY_PROFILE) ?
                        <Tabs
                            ref={(tabs) => this.horizontalTabs = tabs}
                            tabs={tabs}
                            className="vertical-tabs"
                            handleChangeTab={this.handleChangeTab}
                            curTab={this.state.curTab}
                            hold={this.state.isEdit}
                        />
                        : null
                }
            </div>
        );
    },
    render: function () {
        let linkBreadcrumb = [];
        let actionAlert = [
            <RaisedButton
                key={0}
                label={RS.getString("YES")}
                onClick={this.handleLeaveTab}
            />,
            <RaisedButton
                key={1}
                label={RS.getString("NO")}
                onClick={this.handleCancelLeaveTab}
                className="raised-button-fourth"
            />
        ]
        return (
            <div className="page-container new-employee view-edit-employee">
                <Breadcrumb link={linkBreadcrumb} />
                <div className="row-header-profile">
                    {this.renderMenuProfile()}
                </div>
                <div >
                    {this.renderTab(this.state.curTab)}
                </div>
                <DialogChangePassword
                    isOpen={this.state.openDialogChangePassword}
                    handleCancel={() => this.setState({ openDialogChangePassword: false })}
                />
                <DialogAlert
                    modal={true}
                    icon={require("../../../images/warning.png")}
                    isOpen={this.state.isOpenDialogLeaveTab}
                    title="Warning"
                    actions={actionAlert}
                    handleClose={this.handleCancelLeaveTab}
                >
                    <div> {RS.getString("P110")}</div>
                    <div> {RS.getString("P111")} </div>
                </DialogAlert>
                <DialogChangeAvatar
                    avatar={this.state.resultFileAvatar}
                    onChange={this.handleAvatarChange}
                    isOpen={this.state.openChangeAvatar}
                    handleClose={this.handleClosePopup}
                    handleSubmit={this.handleSubmitPopup}
                    title={RS.getString('AVATAR')}
                />
            </div>
        );
    }
});