import React from 'react';
import _ from 'lodash';
import RS from '../../../resources/resourceManager';
import dateHelper from '../../../utils/dateHelper';
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS, DATETIME } from '../../../core/common/constants';
import { browserHistory } from 'react-router';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import moment from 'moment';
import * as LoadingIndicatorActions from '../../../../src/utils/loadingIndicatorActions';
import io from 'socket.io-client';

let socket = null;

class PopupNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            notifications: { confirmations: [], informations: [] },
            notificationType: NOTIFICATION_TYPE.CONFIRMATION
        };
        this.queryString = {
            order_by: 'createdDate',
            is_desc: true,
            page_size: undefined,
            page: 0,
            employeeId: this.props.curEmp.employeeId,
            type: undefined
        };
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    componentDidMount() {
        socket = io.connect(SOCKET_DATA);
        socket.on('socket-notification', (data) => {
            if (data.employeeId == this.props.curEmp.employeeId) {
                this.props.notificationActions.loadNotifications({ employeeId: this.props.curEmp.employeeId });
            }
        });
        this.props.notificationActions.loadNotifications({ employeeId: this.props.curEmp.employeeId });
    }

    componentWillUnmount() {
        if (socket) {
            socket.disconnect();
        }
    }

    componentWillReceiveProps() {
        LoadingIndicatorActions.hideAppLoadingIndicator();
    }

    handleChangeType(notificationType) {
        this.setState({ notificationType, notifications: this.props.notifications });
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
        let notifications = {};
        switch (this.state.notificationType) {
            case NOTIFICATION_TYPE.CONFIRMATION:
                notifications = this.props.notifications.confirmations;
                break;
            case NOTIFICATION_TYPE.INFORMATION:
                notifications = this.props.notifications.informations;
                break;
        }
        let index = _.get(this.props.notifications, 'totalConfirmation', 0) + _.get(this.props.notifications, 'totalInformation', 0);
        return (
            <div className="notification">
                <div>
                    <i className="icon-noti icon-notification" onClick={() => this.setState({ isOpen: true })} >
                        {index > 0 ?
                            <div className="number-noti">
                                {index}
                            </div> : null
                        }
                    </i>
                </div>
                {this.state.isOpen ?
                    <div>
                        <div key="div" className="arrow-up" />
                        <div className="notification-modal">
                            <div
                                className={'modal-content '}
                                style={{ width: this.props.style ? this.props.style.widthBody : '' }}>
                                <div className="page-container page-your-notifications">
                                    <div className="row row-header">
                                        <div className="noti-type-switch">
                                            <div
                                                className={this.state.notificationType == NOTIFICATION_TYPE.CONFIRMATION ? 'active' : ''}
                                                onClick={this.handleChangeType.bind(this, NOTIFICATION_TYPE.CONFIRMATION)}>
                                                {`${RS.getString('CONFIRM')} (${this.props.notifications.totalConfirmation})`}
                                            </div>
                                            <div
                                                className={this.state.notificationType == NOTIFICATION_TYPE.INFORMATION ? 'active' : ''}
                                                onClick={this.handleChangeType.bind(this, NOTIFICATION_TYPE.INFORMATION)}>
                                                {`${RS.getString('INFORMATION_TYPE')} (${this.props.notifications.totalInformation})`}
                                            </div>
                                        </div>
                                    </div>
                                    <table className="metro-table">
                                        <tbody>
                                            {notifications.length ?
                                                _.map(notifications, (notification, index) => {
                                                    let className = '';
                                                    if (notification.status == NOTIFICATION_STATUS.UNREAD) {
                                                        className = 'status-unread';
                                                    } else {
                                                        className = 'status-read';
                                                    }
                                                    if (index < 5) {
                                                        return (
                                                            <tr key={notification.id} className={className} onClick={() => this.setState({ isOpen: false },
                                                                browserHistory.push(getUrlPath(URL.NOTIFICATION_DETAILS, { notificationId: notification.id })))}
                                                            >
                                                                <td>
                                                                    <div className="cell-content">
                                                                        <div className="main-label">
                                                                            {notification.subject}
                                                                        </div>
                                                                        <div className="sub-label">
                                                                            {notification.content}
                                                                        </div>
                                                                        <div className="time-label">
                                                                            {this.renderTimeNotifications(notification.createdDate)}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                }) :
                                                <div className="noti-empty">
                                                    {RS.getString("E147")}
                                                </div>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a className="see-all" onClick={() => this.setState({ isOpen: false }, browserHistory.push(getUrlPath(URL.NOTIFICATIONS)))}>{RS.getString("SEE_ALL")}</a>
                            </div>
                        </div>
                        <div className="background-dialog" onClick={() => this.setState({ isOpen: false })}>
                            <div className="background-dialog-container"></div>
                        </div>
                    </div> : null
                }

            </div>
        );
    }
}

export default PopupNotification;