import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../../elements/Dialog';
import TextView from '../../../elements/TextView';
import MyCheckBox from '../../../elements/MyCheckBox';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import RaisedButton from '../../../elements/RaisedButton';
import EmailView from './EmailView';
import FileAttachment from './FileAttachment';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogLeaveActions from './DialogLeaveActions';

import { STATUS, LEAVE_ACTION_TYPE, LEAVE_TYPES } from '../../../../core/common/constants';
import { EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';
import RS from '../../../../resources/resourceManager';

const propTypes = {
    isOpen: PropTypes.bool,
    leave: PropTypes.object,
    handleClose: PropTypes.func,
    leaveActions: PropTypes.object,
    leaveId: PropTypes.number
};

class DialogViewEmployeeLeaveDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDeclineApprove: false,
            isOpenDialogLeaveAction: false,
            showWarningBox: true,
            actionLeaveType: null
        };
        this.renderAttachments = this.renderAttachments.bind(this);
        this.renderCcEmails = this.renderCcEmails.bind(this);
        this.handleApproveLeave = this.handleApproveLeave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.setState({ showWarningBox: true });
        }
        if (!_.isEqual(nextProps.leave, this.props.leave)) {
            this.setState({ isOpenDialogLeaveAction: false });
        }
    }

    renderAttachments(attachedFiles) {
        let result = [];

        result = _.map(attachedFiles, (element, index) => {
            return (
                <FileAttachment
                    key={index}
                    file={element}
                    canDelete={false}
                />
            );
        });

        return result;
    }

    renderCcEmails(ccEmails) {
        if (ccEmails) {
            const emails = ccEmails.split(';');
            return _.map(emails, function (email, index) {
                return (
                    <EmailView
                        key={index}
                        email={email}
                    />
                );
            });
        }
        return null;
    }

    handleApproveLeave() {
        const { leave } = this.props;
        const leaveToUpdate = _.cloneDeep(leave);
        leaveToUpdate.leaveStatus = STATUS.APPROVED;
        this.props.leaveActions.updateEmployeeLeave(leave.id, leaveToUpdate);
    }

    handleSendLeaveAction(reason) {
        let leaveSelected = _.cloneDeep(this.props.leave);
        leaveSelected.commentDeclinedOrCanceled = reason;

        switch (this.state.actionLeaveType) {
            case LEAVE_ACTION_TYPE.CANCEL_EMPLOYEE_LEAVE: {
                leaveSelected.leaveStatus = STATUS.CANCELED;
                break;
            }
            case LEAVE_ACTION_TYPE.DECLINE: {
                leaveSelected.leaveStatus = STATUS.DECLINED;
                break;
            }
        }

        this.props.leaveActions.updateEmployeeLeave(leaveSelected.id, leaveSelected);
    }

    handleClickLeaveAction(actionType, leave) {
        this.setState({
            actionLeaveType: actionType,
            isOpenDialogLeaveAction: true
        });
    }

    render() {
        if (_.isEmpty(this.props.leave)) return null;
        const { leave } = this.props;
        const actions = [
            <RaisedButton
                key="close"
                className="raised-button-fourth"
                label={RS.getString('CLOSE')}
                onClick={this.props.handleClose}
            />,

        ];
        let photoUrl = _.get(leave, 'employee.photoUrl');
        return (
            <div>
                <Dialog
                    style={'496px'}
                    isOpen={this.props.isOpen}
                    title={RS.getString('TEAM_LEAVE', null, 'UPPER')}
                    handleClose={this.props.handleClose}
                    actions={actions}
                    className="view-leave-detail"
                    modal
                >
                    <div className="view-leave-detail">
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <div className="profile-avatar">
                                    <img src={photoUrl ? API_FILE + photoUrl : require("../../../../images/avatarDefault.png")} />
                                    <div className="name-profile">
                                        <div className="name">{_.get(leave, 'employee.fullName')}</div>
                                        <div className="userrole-name">{_.get(leave, 'employee.jobRole.name')}</div>
                                    </div>
                                </div>
                            </div>
                            {/*
                                this.state.showWarningBox && leave.leaveFrom.getTime() < (new Date()).getTime() &&
                                <div className="col-md-6 col-xs-12">
                                    <div className="warning-due-date">
                                        <div className="warning-title">Warning</div>
                                        <div className="warning-content">
                                            <span>{RS.getString('DUE_DATE_REACH_WARNING')}</span>
                                        </div>
                                    </div>
                                </div>
                            */}
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    title={RS.getString('LEAVE_TYPE')}
                                    value={leave.leaveType.name}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <div className="text-view">
                                    <div className="title" />
                                    <div className={"status " + leave.leaveStatus}>
                                        <span>{leave.leaveStatus}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    title={RS.getString('START')}
                                    value={leave.leaveFromString}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <TextView
                                    title={RS.getString('END')}
                                    value={leave.leaveToString}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    title={RS.getString('APPROVER')}
                                    value={leave.approver.fullName}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <TextView
                                    title={RS.getString('LEAVE_HOURS')}
                                    value={leave.leaveHours.toFixed(1) || '0.0'}
                                />
                            </div>
                        </div>
                        {
                            leave.leaveType.name == LEAVE_TYPES.SPECIAL_LEAVE &&
                            <div className="row">
                                <div className="col-md-12">
                                    <TextView
                                        title={RS.getString('REASON')}
                                        value={leave.reason}
                                    />
                                </div>
                            </div>
                        }
                        {
                            (leave.leaveType.name == LEAVE_TYPES.SICK_LEAVE || leave.leaveType.name == LEAVE_TYPES.SICK_LEAVE_WITH_CERTIFICATE) &&
                            <div className="row">
                                <div className="col-md-12">
                                    <MyCheckBox
                                        label={RS.getString('WITH_MEDICAL_CERTIFICATE')}
                                        defaultValue={leave.leaveType.name == LEAVE_TYPES.SICK_LEAVE_WITH_CERTIFICATE}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </Dialog>
                <DialogLeaveActions
                    isOpen={this.state.isOpenDialogLeaveAction}
                    handleClose={() => this.setState({ isOpenDialogLeaveAction: false })}
                    handleSubmit={this.handleSendLeaveAction.bind(this)}
                    actionType={this.state.actionLeaveType}
                />
            </div>
        );
    }
}

DialogViewEmployeeLeaveDetail.propTypes = propTypes;
export default DialogViewEmployeeLeaveDetail;