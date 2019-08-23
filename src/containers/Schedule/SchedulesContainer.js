import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scheduleAction from '../../actions/scheduleAction';
import * as customerActions from '../../actions/customerActions';
import * as locationActions from '../../actions/locationActions';
import Schedules from '../../components/pages/Schedule/Schedules';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common'
import RIGHTS from '../../constants/rights';

export const SchedulesContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_EMPLOYEE], this.props.curEmp, <Schedules {...this.props} />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    schedules: state.scheduleReducer.schedules,
    customers: state.customerReducer.customers,
    locations: state.settingReducer.locations,
    curEmp: state.authReducer.curEmp,
    payload: state.scheduleReducer.payload,
    meta: state.scheduleReducer.meta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalAction: bindActionCreators(globalAction, dispatch),
    loadCustomers: bindActionCreators(customerActions.loadCustomers, dispatch),
    loadLocations: bindActionCreators(locationActions.loadLocations, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchedulesContainer);

