import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Handsets from '../../../components/pages/EmployeePortal/Handsets';
import * as employeeActions from '../../../actions/employeeActions';
import * as globalAction from '../../../actions/globalAction';
import * as handsetsActions from '../../../actions/handsetsActions';

const propTypes = {
    loadEmployeeHandsets: PropTypes.func,
    employee: PropTypes.object
};

class HandsetsContainer extends React.Component {
    constructor(props, context) {
        super(props);
    }

    render() {
        return (
            <Handsets
                isEdit={true}
                {...this.props}
            />
        );
    }
}

HandsetsContainer.propTypes = propTypes;

function mapStateToProps(state) {
    let { curEmp } = state.authReducer;
    const { handsets, payload } = state.handsetsReducer;
    return {
        curEmp,
        payload,
        handsets,
        employee: state.employeeReducer.employee,
        employeeInfo: state.authReducer.employeeInfo
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadEmployeeHandsets: bindActionCreators(employeeActions.loadEmployeeHandsets, dispatch),
        returnHandset: bindActionCreators(handsetsActions.returnHandset, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HandsetsContainer);