import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authorization } from '../../../services/common';
import RIGHTS from '../../../constants/rights';
import Contracts from '../../../components/pages/CustomerManagement/ContractManagement/Contracts';
import * as contractAction from '../../../actions/contractActions';
import * as globalAction from '../../../actions/globalAction';
import * as customerActions from '../../../actions/customerActions';

export const ContractsContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_CONTRACT], this.props.curEmp, <Contracts {...this.props} />, this.props.location.pathname)
        )
    }
});

function mapStateToProps(state) {
    const { payload, contracts, meta } = state.contractReducer;
    return {
        payload,
        contracts,
        meta,
        customers: state.customerReducer.customers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllContract: bindActionCreators(contractAction.loadAllContract, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        loadCustomers: bindActionCreators(customerActions.loadCustomers, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
        updateContractDto: bindActionCreators(contractAction.updateContractDto, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContractsContainer);