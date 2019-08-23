import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../../actions/notificationActions';
import * as leaveActions from '../../actions/leaveActions';
import * as overtimeActions from '../../actions/overtimeActions';
import NotificationDetail from '../../components/pages/Notification/NotificationDetail';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common'
import RIGHTS from '../../constants/rights';

export const NotificationDetailContainer = React.createClass({
  render: function () {
    return (
      <NotificationDetail {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    notification: state.notificationReducer.notification,
    leave: state.leaveReducer.leave,
    overtime: state.overtimeReducer.overtime,
    curEmp: state.authReducer.curEmp,
    payload: state.notificationReducer.payload,
    leavePayload: state.leaveReducer.payload,
    overtimePayload: state.overtimeReducer.payload,
    meta: state.notificationReducer.meta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalAction: bindActionCreators(globalAction, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
    leaveActions: bindActionCreators(leaveActions, dispatch),
    overtimeActions: bindActionCreators(overtimeActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationDetailContainer);

