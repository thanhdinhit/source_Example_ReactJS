import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scheduleAction from '../../actions/scheduleAction';
import MySchedule from '../../components/pages/Schedule/MySchedule';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common'
import RIGHTS from '../../constants/rights';
import * as overtimeActions from '../../actions/overtimeActions';

export const MyScheduleContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_MY_SCHEDULE], this.props.curEmp, <MySchedule {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    mySchedule: state.scheduleReducer.mySchedule,
    curEmp: state.authReducer.curEmp,
    payload: state.scheduleReducer.payload,
    meta: state.scheduleReducer.meta,
    payloadOvertime: state.overtimeReducer.payload  
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalAction: bindActionCreators(globalAction, dispatch),
    scheduleAction: bindActionCreators(scheduleAction, dispatch),
    overtimeActions: bindActionCreators(overtimeActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyScheduleContainer);

