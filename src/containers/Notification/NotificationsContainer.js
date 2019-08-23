import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../../actions/notificationActions';
import Notifications from '../../components/pages/Notification/Notifications';
import PopupNotifications from '../../components/pages/Notification/PopupNotifications';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common'
import RIGHTS from '../../constants/rights';

export const NotificationsContainer = React.createClass({
  render: function () {
    return (
      <Notifications {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    notifications: state.notificationReducer.notifications,
    curEmp: state.authReducer.curEmp,
    payload: state.notificationReducer.payload,
    meta: state.notificationReducer.meta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalAction: bindActionCreators(globalAction, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsContainer);

