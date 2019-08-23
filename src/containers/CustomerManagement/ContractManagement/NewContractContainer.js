import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as contractActions from '../../../actions/contractActions';
import * as customerActions from '../../../actions/customerActions';
import * as groupActions from '../../../actions/groupActions';
import * as shiftTemplateSettingActions from '../../../actions/shiftTemplateSettingAction';
import * as globalActions from '../../../actions/globalAction';
import * as jobRoleSettingAction from '../../../actions/jobRoleSettingAction';
import * as locationActions from '../../../actions/locationActions';
import NewContract from '../../../components/pages/CustomerManagement/ContractManagement/NewContract';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const NewContractContainer = React.createClass({
  render: function () {
    return (
      authorization([RIGHTS.CREATE_CONTRACT], this.props.curEmp, <NewContract
        {...this.props}
      />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  const { payload, newContract, contract, contracts } = state.contractReducer;
  const { curEmp } = state.authReducer;
  const { customers } = state.customerReducer;
  const { groups, groupSubs } = state.groupReducer;
  const { shiftTemplates, jobRoles, locations } = state.settingReducer;

  return {
    curEmp,
    payload,
    newContract,
    contract,
    contracts,
    customers,
    groups,
    shiftTemplates,
    jobRoles,
    locations,
    groupSubs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    contractActions: bindActionCreators(contractActions, dispatch),
    globalActions: bindActionCreators(globalActions, dispatch),
    shiftTemplateSettingActions: bindActionCreators(shiftTemplateSettingActions, dispatch),
    loadCustomers: bindActionCreators(customerActions.loadCustomers, dispatch),
    loadAllGroup: bindActionCreators(groupActions.loadAllGroup, dispatch),
    loadGroupSubs: bindActionCreators(groupActions.loadGroupSubs, dispatch),
    // this.props.jobRoleSettingAction.loadJobRolesSetting({});
    //             this.props.locationActions.loadLocations({});
    jobRoleSettingAction: bindActionCreators(jobRoleSettingAction, dispatch),
    locationActions: bindActionCreators(locationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewContractContainer);





