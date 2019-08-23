import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OvertimeMasterPage from '../../../components/pages/EmployeePortal/Overtime/OvertimeMasterPage';
import * as globalAction from '../../../actions/globalAction';
import { authorization } from '../../../services/common';
import RIGHTS from '../../../constants/rights';
import * as overtimeActions from '../../../actions/overtimeActions';


export const OvertimeMasterPageContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_MY_OVERTIME], this.props.curEmp, <OvertimeMasterPage {...this.props} />, this.props.location.pathname)
        );
    }
});

function mapStateToProps(state) {
    return {
        curEmp: state.authReducer.curEmp,
        payload: state.overtimeReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        overtimeActions: bindActionCreators(overtimeActions, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OvertimeMasterPageContainer);

