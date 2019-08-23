import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authorization } from '../../../services/common';
import RIGHTS from '../../../constants/rights';
import ContractDetail from '../../../components/pages/CustomerManagement/ContractManagement/ContractDetail';
import * as contractActions from '../../../actions/contractActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import * as locationActions from '../../../actions/locationActions';
import * as jobRoleSettingAction from '../../../actions/jobRoleSettingAction';
import * as shiftTemplateSettingActions from '../../../actions/shiftTemplateSettingAction';

export const ContractDetailContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_CONTRACT], this.props.curEmp, <ContractDetail {...this.props} />, this.props.location.pathname)
        )
    }
});

function mapStateToProps(state) {
    return {
        payload: state.contractReducer.payload,
        contract: state.contractReducer.contract,
        meta: state.contractReducer.meta,
        isDeleteContractSuccess: state.contractReducer.isDeleteContractSuccess,
        groupSubs: state.groupReducer.groupSubs,
        jobRoles: state.settingReducer.jobRoles,
        locations: state.settingReducer.locations,
        contracts: state.contractReducer.contracts,
        shiftTemplates: state.settingReducer.shiftTemplates
    };
}

function mapDispatchToProps(dispatch) {
    return {
        contractActions: bindActionCreators(contractActions, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch),
        jobRoleSettingAction: bindActionCreators(jobRoleSettingAction, dispatch),
        groupActions: bindActionCreators(groupActions, dispatch),
        shiftTemplateSettingActions: bindActionCreators(shiftTemplateSettingActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContractDetailContainer);