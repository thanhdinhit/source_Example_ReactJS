import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customerActions from '../../../actions/customerActions';
import * as contractActions from '../../../actions/contractActions';
import * as groupActions from '../../../actions/groupActions';
import * as globalActions from '../../../actions/globalAction';
import CustomerDetail from '../../../components/pages/CustomerManagement/Customer/CustomerDetail';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const CustomersDetailContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.VIEW_CUSTOMER], this.props.curEmp, <CustomerDetail
        {...this.props}
      />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {

  const { payload, meta, customer } = state.customerReducer;
  const { supervisors } = state.groupReducer;
  const { curEmp } = state.authReducer;

  return {
    curEmp,
    payload,
    meta,
    customer,
    supervisors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    globalActions: bindActionCreators(globalActions, dispatch),
    customerActions: bindActionCreators(customerActions, dispatch),
    loadSupervisors: bindActionCreators(groupActions.loadSupervisors, dispatch),
    contractActions: bindActionCreators(contractActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersDetailContainer);





