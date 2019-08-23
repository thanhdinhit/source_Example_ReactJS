import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authorization } from '../../../services/common';
import RIGHTS from '../../../constants/rights';
import ContractAppendix from '../../../components/pages/CustomerManagement/ContractManagement/ContractAppendix';
import * as contractActions from '../../../actions/contractActions';
import * as globalAction from '../../../actions/globalAction';
import * as groupActions from '../../../actions/groupActions';
import * as locationActions from '../../../actions/locationActions';
import * as jobRoleSettingAction from '../../../actions/jobRoleSettingAction';
import * as shiftTemplateSettingActions from '../../../actions/shiftTemplateSettingAction';

export const ContractAppendixContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_CONTRACT], this.props.curEmp, <ContractAppendix {...this.props} />, this.props.location.pathname)
        )
    }
});

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        contractActions: bindActionCreators(contractActions, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContractAppendixContainer);