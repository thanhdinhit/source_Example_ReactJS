import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globalAction from '../../../actions/globalAction';
import * as customerActions from '../../../actions/customerActions';
import { authorization } from '../../../services/common';
import NewOvertime from '../../../components/pages/EmployeePortal/Overtime/NewOvertime';
import RIGHTS from '../../../constants/rights';
import * as overtimeActions from '../../../actions/overtimeActions';
import * as locationActions from '../../../actions/locationActions';
import * as settingAction from '../../../actions/settingAction';
import * as contractActions from '../../../actions/contractActions';


export const NewOvertimeContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.CREATE_OVERTIME], this.props.curEmp, <NewOvertime {...this.props} />, this.props.location.pathname)
        );
    }
})

function mapStateToProps(state) {
    return {
        payRateSetting: state.settingReducer.payRateSetting,
        overtimeStatistic: state.overtimeReducer.overtimeStatistic,
        overtimeSetting: state.overtimeReducer.overtimeSetting,
        locations: state.settingReducer.locations,
        curEmp: state.authReducer.curEmp,
        payload: state.overtimeReducer.payload,
        newOvertime: state.overtimeReducer.newOvertime,
        customers: state.customerReducer.customers,
        contracts: state.contractReducer.contracts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        globalAction: bindActionCreators(globalAction, dispatch),
        overtimeActions: bindActionCreators(overtimeActions, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch),
        settingAction: bindActionCreators(settingAction, dispatch),
        loadCustomers: bindActionCreators(customerActions.loadCustomers, dispatch),
        loadAllContract : bindActionCreators(contractActions.loadAllContract, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)
    (NewOvertimeContainer);
