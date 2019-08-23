import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customerActions from '../../../actions/customerActions';
import * as groupActions from '../../../actions/groupActions';
import * as globalActions from '../../../actions/globalAction';
import Customers from '../../../components/pages/CustomerManagement/Customer/Customers';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const NewContractContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_CUSTOMER], this.props.curEmp, <Customers
        {...this.props}
      />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {

  const { payload, meta, customers } = state.customerReducer;
  const { supervisors } = state.groupReducer;
  const { curEmp } = state.authReducer;

  return {
    curEmp,
    payload,
    meta,
    customers,
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
)(NewContractContainer);





