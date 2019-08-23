import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Handsets from '../../../components/pages/EmployeePortal/Handsets';
import * as employeeActions from '../../../actions/employeeActions';
import * as globalAction from '../../../actions/globalAction';

const propTypes = {
    loadEmployeeHandsets: PropTypes.func,
    employee: PropTypes.object
};

class HandsetsViewContainer extends React.Component {
    constructor(props, context) {
        super(props);
    }

    render() {
        return (
            <Handsets
                {...this.props}
            />
        );
    }
}

HandsetsViewContainer.propTypes = propTypes;

function mapStateToProps(state) {
    let { curEmp } = state.authReducer;
    const { handsets, payload } = state.handsetsReducer;
    return {
        curEmp,
        payload,
        handsets,
        employee: state.employeeReducer.employee
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadEmployeeHandsets: bindActionCreators(employeeActions.loadEmployeeHandsets, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HandsetsViewContainer);