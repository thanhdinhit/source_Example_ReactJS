import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customerActions from '../../../actions/customerActions';
import * as groupActions from '../../../actions/groupActions';
import * as globalActions from '../../../actions/globalAction';
import NewCustomer from '../../../components/pages/CustomerManagement/Customer/NewCustomer';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const NewCustomerContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_CUSTOMER], this.props.curEmp, <NewCustomer
        {...this.props}
      />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  const { payload} = state.customerReducer;
  const { supervisors } = state.groupReducer;

  return {
    payload,
    supervisors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalActions: bindActionCreators(globalActions, dispatch),
    customerActions: bindActionCreators(customerActions, dispatch),
    loadSupervisors: bindActionCreators(groupActions.loadSupervisors, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCustomerContainer);





