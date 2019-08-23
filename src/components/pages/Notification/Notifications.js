import React from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import dateHelper from '../../../utils/dateHelper';
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS, DATETIME, QUERY_STRING } from '../../../core/common/constants';
import RaisedButton from '../../elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import * as toastr from '../../../utils/toastr';
import moment from 'moment';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: { confirmations: [], informations: [] },
            notificationType: NOTIFICATION_TYPE.CONFIRMATION,
            selectedNotifications: [],
            isSelectAll: false
        },
            this.handleChangeType = this.handleChangeType.bind(this);
        this.handleSelectNotification = this.handleSelectNotification.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleViewDetails = this.handleViewDetails.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.notificationActions.loadNotifications({ employeeId: this.props.curEmp.employeeId });
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        this.setState({ notifications: nextProps.notifications });
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.notificationActions.loadNotifications({ employeeId: this.props.curEmp.employeeId });
            this.props.globalAction.resetState();
            this.setState({ isSelectAll: false })
        }
        if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
            toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
    }

    handleChangeType(notificationType) {
        this.setState({ notificationType, isSelectAll: false, notifications: this.props.notifications });
    }

    handleRemoveNotifications(notifications) {
        let itemChecked = [];
        _.map(notifications, items => {
            if (items.isSelected)
                itemChecked.push(items.id);
        });
        this.props.notificationActions.deleteNotifications(itemChecked);
    }

    handleSelectNotification(notification, checked) {
        let notifications = _.cloneDeep(this.state.notifications);
        let { confirmations, informations } = notifications;
        let updateSelected = (items = []) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id == notification.id) {
                    items[i].isSelected = checked;
                    break;
                }
            }
            return items;
        }
        switch (notification.type) {
            case NOTIFICATION_TYPE.CONFIRMATION:
                confirmations = updateSelected(confirmations);
                break;
            case NOTIFICATION_TYPE.INFORMATION:
                informations = updateSelected(informations);
                break;
        }
        this.setState({ notifications: { confirmations, informations } });
    }

    handleSelectAll(checked) {
        let notifications = _.cloneDeep(this.props.notifications);
        let { confirmations, informations } = notifications;
        let updateSelected = (items = []) => {
            for (let i = 0; i < items.length; i++) {
                items[i].isSelected = checked;
            }
            return items;
        }
        switch (this.state.notificationType) {
            case NOTIFICATION_TYPE.CONFIRMATION:
                confirmations = updateSelected(confirmations);
                break;
            case NOTIFICATION_TYPE.INFORMATION:
                informations = updateSelected(informations);
                break;
        }
        this.setState({ isSelectAll: checked, notifications: { confirmations, informations } });
    }

    handleViewDetails(notificationId) {
        browserHistory.push(getUrlPath(URL.NOTIFICATION_DETAILS, { notificationId }));
    }

    renderTimeNotifications(time) {
        let currentDate = new Date();
        let newTime = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0)
        currentDate.setSeconds(0)
        newTime = moment(time).fromNow();
        if (currentDate.getTime() >= time.getTime()) {
            newTime = dateHelper.formatTimeWithPattern(time, DATETIME.DATE_NOTIFICATION);
        }
        return newTime;
    }

    render() {
        let notifications = [];
        switch (this.state.notificationType) {
            case NOTIFICATION_TYPE.CONFIRMATION:
                notifications = this.state.notifications.confirmations;
                break;
            case NOTIFICATION_TYPE.INFORMATION:
                notifications = this.state.notifications.informations;
                break;
        }
        const itemChecked = _.filter(notifications, 'isSelected').length;
        let cssCheckAll = "";
        if (itemChecked == notifications.length) {
            cssCheckAll = itemChecked > 0 ? 'checkbox-special' : '';
        } else if (itemChecked > 0) {
            cssCheckAll = "checkbox-special-type2";
        }
        let isSelected = this.state.isSelectAll || itemChecked > 0;
        return (
            <div className="page-container page-your-notifications">
                <div className="header">
                    {RS.getString('YOUR_NOTIFICATIONS')}
                </div>
                <div className="row row-header">
                    <div className="noti-type-switch">
                        <div
                            className={this.state.notificationType == NOTIFICATION_TYPE.CONFIRMATION ? 'active' : ''}
                            onClick={this.handleChangeType.bind(this, NOTIFICATION_TYPE.CONFIRMATION)}>
                            {`${RS.getString('CONFIRMATION_TYPE')} (${this.props.notifications.totalConfirmation})`}
                        </div>
                        <div
                            className={this.state.notificationType == NOTIFICATION_TYPE.INFORMATION ? 'active' : ''}
                            onClick={this.handleChangeType.bind(this, NOTIFICATION_TYPE.INFORMATION)}>
                            {`${RS.getString('INFORMATION_TYPE')} (${this.props.notifications.totalInformation})`}
                        </div>
                    </div>
                </div>
                <div className="row row-actions">
                    <div className={'select-all ' + cssCheckAll}>
                        <MyCheckBox
                            id="select-all"
                            ref={(input) => this.selectAll = input}
                            defaultValue={isSelected}
                            onChange={this.handleSelectAll}
                            label={RS.getString('SELECT_ALL')}
                        />
                    </div>
                    <div className="notification-actions-group">
                        <RaisedButton
                            className="raised-button-third-secondary"
                            label={RS.getString('DELETE', null, Option.CAPEACHWORD)}
                            onClick={this.handleRemoveNotifications.bind(this, notifications)}
                            disabled={itemChecked == 0 ? true : false}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <tbody>
                        {
                            _.map(notifications, (notification) => {
                                let className = '';
                                if (notification.status == NOTIFICATION_STATUS.UNREAD) {
                                    className = 'status-unread';
                                } else {
                                    className = 'status-read';
                                }
                                if (notification.isSelected) {
                                    className += ' selected';
                                }
                                return (
                                    <tr key={notification.id} className={className} onClick={this.handleViewDetails.bind(this, notification.id)}>
                                        <td>
                                            <MyCheckBox
                                                defaultValue={notification.isSelected}
                                                onChange={this.handleSelectNotification.bind(this, notification)}
                                            />
                                            <div className="cell-content">
                                                <div className="main-label">
                                                    {notification.subject}
                                                </div>
                                                <div className="sub-label">
                                                    {notification.content}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {this.renderTimeNotifications(notification.createdDate)}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
Notifications.propTypes = {};

export default Notifications;