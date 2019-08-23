import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globalActions from '../../../actions/globalAction';
import EmployeeOrganization from '../../../components/pages/EmployeePortal/Organization/EmployeeOrganization';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const EmployeeOrganizationContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_GROUP], this.props.curEmp, <EmployeeOrganization {...this.props} />, this.props.location.pathname)
        );
    }
});

function mapStateToProps(state) {
    return {
        curEmp: state.authReducer.curEmp,
        payload: state.groupReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        resetError: bindActionCreators(globalActions.resetError, dispatch),
        resetState: bindActionCreators(globalActions.resetState, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeOrganizationContainer);