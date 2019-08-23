import React from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import dateHelper from '../../../utils/dateHelper';
import * as toastr from '../../../utils/toastr';
import {
    NOTIFICATION_TYPE,
    NOTIFICATION_STATUS,
    NOTIFICATION_FEATURE,
    DATETIME,
    STATUS,
    LEAVE_ACTION_TYPE,
    OVERTIME_ACTION_TYPE
} from '../../../core/common/constants';
import RaisedButton from '../../elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import DialogLeaveActions from '../EmployeePortal/Leave/DialogLeaveActions';
import DialogOvertimeActions from '../EmployeePortal/Overtime/DialogOvertimeActions';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import { loadNotificationDetail } from '../../../actionsv2/notificationActions';

class NotificationDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDialogLeaveAction: false,
            isOpenDialogOvertimeAction: false
        }
    }

    componentDidMount() {
        let notificationId = Number(this.props.params.notificationId)
        if (!notificationId) {
            browserHistory.replace(`/page_not_found`)
        }
        this.props.notificationActions.loadNotificationDetail(this.props.params.notificationId);
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (this.props.params.notificationId != nextProps.params.notificationId) {
            this.props.notificationActions.loadNotificationDetail(nextProps.params.notificationId);
        }
        if (!_.isEqual(this.props.notification, nextProps.notification) && nextProps.notification && nextProps.notification.id) {
            if (nextProps.notification.status == NOTIFICATION_STATUS.UNREAD) {
                let notification = _.cloneDeep(nextProps.notification);
                notification.status = NOTIFICATION_STATUS.READ;
                this.props.notificationActions.updateNotification(notification.id, notification);
            }
            if (nextProps.notification.type == NOTIFICATION_TYPE.CONFIRMATION && nextProps.notification.objectId) {
                switch (nextProps.notification.notificationFeature) {
                    case NOTIFICATION_FEATURE.LEAVE:
                        this.props.leaveActions.loadEmployeeLeave(nextProps.notification.objectId);
                        break;
                    case NOTIFICATION_FEATURE.OVERTIME:
                        this.props.overtimeActions.loadMyOvertime(nextProps.notification.objectId);
                        break;
                }
            }
        }
        _.each(['payload', 'leavePayload', 'overtimePayload'], (item) => {
            let payload = nextProps[item];
            if (payload.success) {
                toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
                this.setState({ isOpenDialogLeaveAction: false, isOpenDialogOvertimeAction: false }, () => browserHistory.push(getUrlPath(URL.NOTIFICATIONS)));
                this.props.globalAction.resetState();
                this.props.notificationActions.deleteNotification(nextProps.notification.id);
            }
            if (payload.error.message != '' || payload.error.exception) {
                toastr.error(payload.error.message, RS.getString('ERROR'));
                this.props.globalAction.resetError();
            }
        });
    }

    handleUpdateLeave(status) {
        const leaveToUpdate = _.cloneDeep(this.props.leave);
        leaveToUpdate.leaveStatus = status;
        this.props.leaveActions.updateEmployeeLeave(leaveToUpdate.id, leaveToUpdate);
        LoadingIndicatorActions.showAppLoadingIndicator()
    }

    handleUpdateOvertime(status) {
        loadNotificationDetail(this.props.params.notificationId, (error, value) => {
            if (value) {
                const overtimeToUpdate = _.cloneDeep(this.props.overtime);
                overtimeToUpdate.overtimeStatus = status;
                this.props.overtimeActions.updateOvertime(overtimeToUpdate.id, overtimeToUpdate);
                LoadingIndicatorActions.showAppLoadingIndicator()
            }
            if (error || !value) {
                toastr.error(RS.getString('E146'), RS.getString('ERROR'));
            }
        });
    }

    handleSendLeaveAction(reason) {
        loadNotificationDetail(this.props.params.notificationId, (error, value) => {
            if (value) {
                const leaveToUpdate = _.cloneDeep(this.props.leave);
                leaveToUpdate.commentDeclinedOrCanceled = reason;
                leaveToUpdate.leaveStatus = STATUS.DECLINED;
                this.props.leaveActions.updateEmployeeLeave(leaveToUpdate.id, leaveToUpdate);
                LoadingIndicatorActions.showAppLoadingIndicator()
            }
            if (error || !value) {
                toastr.error(RS.getString('E146'), RS.getString('ERROR'));
            }
        });
    }

    handleSendOvertimeAction(reason) {
        loadNotificationDetail(this.props.params.notificationId, (error, value) => {
            if (value) {
                const overtimeToUpdate = _.cloneDeep(this.props.overtime);
                overtimeToUpdate.commentDeclinedOrCanceled = reason;
                overtimeToUpdate.overtimeStatus = STATUS.DECLINED;
                this.props.overtimeActions.updateOvertime(overtimeToUpdate.id, overtimeToUpdate);
                LoadingIndicatorActions.showAppLoadingIndicator();
            }
            if (error || !value) {
                toastr.error(RS.getString('E146'), RS.getString('ERROR'));
            }
        });
    }

    handleDeleteNotification(notification) {
        this.props.notificationActions.deleteNotifications([notification.id]);
    }

    render() {
        let { notification, leave, overtime } = this.props;
        return (
            <div className="page-container page-notification-details">
                <div className="header">
                    {RS.getString('YOUR_NOTIFICATIONS')}
                </div>
                <div className="row row-actions">
                    <RaisedButton
                        className="raised-button-first-secondary go-back"
                        label={RS.getString('BACK', null, Option.CAPEACHWORD)}
                        onClick={() => browserHistory.push(getUrlPath(URL.NOTIFICATIONS))}
                        icon={<i className="icon-back-arrow" />}
                    />
                    <div className="notification-actions-group">
                        <RaisedButton
                            className="raised-button-third-secondary"
                            label={RS.getString('DELETE', null, Option.CAPEACHWORD)}
                            disabled={!notification}
                            onClick={this.handleDeleteNotification.bind(this, notification)}
                        />
                    </div>
                </div>
                {
                    !_.isEmpty(notification) &&
                    <div className="notification-wrapper">
                        <div className="notification-header">
                            <div className="subject">{notification.subject}</div>
                            <div className="created-date pull-right">{dateHelper.formatTimeWithPattern(notification.createdDate, DATETIME.DATE_NOTIFICATION)}</div>
                        </div>
                        <div className="notification-content">
                            {notification.content}
                            <br />
                            {(!_.isEmpty(leave) || !_.isEmpty(overtime)) && `${RS.getString("DETAILS")}: `}
                            <br />
                            {
                                !_.isEmpty(leave) &&
                                <div className="confirmation-details">
                                    <div>{`- ${RS.getString("REQUESTER")}: `}<strong>{leave.employee.fullName}</strong></div>
                                    <div>{`- ${RS.getString("GROUP")}: `}<strong>{leave.employee.group.name}</strong></div>
                                    <div>{`- ${RS.getString("LEAVE_FROM")}: `}<strong>{leave.leaveFromString}</strong> {RS.getString("TO", null, Option.LOWER)} <strong>{`${leave.leaveToString} (${leave.leaveHours} ${RS.getString("HOURS")})`}</strong></div>
                                    <div>{`- ${RS.getString("LEAVE_TYPE")}: `}<strong>{leave.leaveType.name}</strong></div>
                                    {
                                        !!leave.reason &&
                                        <div>{`- ${RS.getString("REASON")}: `}<strong>{leave.reason}</strong></div>
                                    }
                                    {
                                        leave.leaveStatus == STATUS.PENDING &&
                                        <div className="confirmation-actions">
                                            <RaisedButton
                                                className="raised-button-third"
                                                label={RS.getString('DECLINE', null, Option.CAPEACHWORD)}
                                                onClick={() => this.setState({ isOpenDialogLeaveAction: true })}
                                            />
                                            <RaisedButton
                                                className="raised-button-second"
                                                label={RS.getString('APPROVE', null, Option.CAPEACHWORD)}
                                                onClick={this.handleUpdateLeave.bind(this, STATUS.APPROVED)}
                                            />
                                        </div>
                                    }
                                </div>
                            }
                            {
                                !_.isEmpty(overtime) &&
                                <div className="confirmation-details">
                                    <div>{`- ${RS.getString("REQUESTER")}: `}<strong>{overtime.manager.fullName}</strong></div>
                                    <div>{`- ${RS.getString("WORKING_LOCATION")}: `}<strong>{overtime.location.name}</strong></div>
                                    <div>{`- ${RS.getString("DURATION")}: `}<strong>{overtime.overtimeFromString}</strong> {RS.getString("TO", null, Option.LOWER)} <strong>{overtime.overtimeToString}</strong></div>
                                    {
                                        !!overtime.comment &&
                                        <div>{`- ${RS.getString("COMMENT")}: `}<strong>{overtime.comment}</strong></div>
                                    }
                                    {
                                        overtime.overtimeStatus == STATUS.PENDING &&
                                        <div className="confirmation-actions">
                                            <RaisedButton
                                                className="raised-button-third"
                                                label={RS.getString('DECLINE', null, Option.CAPEACHWORD)}
                                                onClick={() => this.setState({ isOpenDialogOvertimeAction: true })}
                                            />
                                            <RaisedButton
                                                className="raised-button-second"
                                                label={RS.getString('ACCEPT', null, Option.CAPEACHWORD)}
                                                onClick={this.handleUpdateOvertime.bind(this, STATUS.ACCEPTED)}
                                            />
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                }
                <DialogLeaveActions
                    isOpen={this.state.isOpenDialogLeaveAction}
                    handleClose={() => this.setState({ isOpenDialogLeaveAction: false })}
                    handleSubmit={this.handleSendLeaveAction.bind(this)}
                    actionType={LEAVE_ACTION_TYPE.DECLINE}
                />
                <DialogOvertimeActions
                    isOpen={this.state.isOpenDialogOvertimeAction}
                    handleClose={() => this.setState({ isOpenDialogOvertimeAction: false })}
                    handleSubmit={this.handleSendOvertimeAction.bind(this)}
                    actionType={OVERTIME_ACTION_TYPE.DECLINE}
                />
            </div>
        )
    }
}
NotificationDetail.propTypes = {};

export default NotificationDetail;