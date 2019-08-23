import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmployeeLeaves from '../../../components/pages/EmployeePortal/Leave/EmployeeLeaves';
import * as globalAction from '../../../actions/globalAction';


export const EmployeeLeavesContainer = React.createClass({

  render: function () {
    return (
      <EmployeeLeaves {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    curEmp: state.authReducer.curEmp,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeLeavesContainer);
