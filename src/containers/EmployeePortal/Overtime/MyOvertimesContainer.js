import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyOvertimes from '../../../components/pages/EmployeePortal/Overtime/MyOvertimes';
import * as overtimeActions from '../../../actions/overtimeActions';
import * as globalAction from '../../../actions/globalAction';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common'
export const MyOvertimeContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_MY_OVERTIME], this.props.curEmp, <MyOvertimes {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    myOvertimes: state.overtimeReducer.myOvertimes,
    curEmp: state.authReducer.curEmp,
    payload: state.overtimeReducer.payload,
    meta: state.overtimeReducer.meta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    overtimeActions: bindActionCreators(overtimeActions, dispatch),
    globalAction: bindActionCreators(globalAction, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyOvertimeContainer);
