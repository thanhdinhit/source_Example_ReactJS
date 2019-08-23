import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Termination from '../../../components/pages/EmployeePortal/EditEmployee/Termination';
import * as terminationsActions from '../../../actions/terminationActions';
import * as globalAction from '../../../actions/globalAction';
import * as authenticateActions from '../../../actions/authenticateActions';

const propTypes = {
    terminationsActions: PropTypes.object,
    terminations: PropTypes.array,
    employee: PropTypes.object
};

class TerminationContainer extends React.Component {
    constructor(props, context) {
        super(props);
    }

    componentDidMount() {
        this.props.terminationsActions.getTerminationReason();
    }

    render() {
        return (
            <Termination
                {...this.props}
            />
        );
    }
}

TerminationContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const {
        terminations,
        terminationReason,
        terminationSuccess,
        rejoinSuccess,
        terminationError,
        rejoinError
        } = state.terminationReducer;
    return {
        terminations,
        terminationReason,
        terminationSuccess,
        rejoinSuccess,
        terminationError,
        rejoinError,
        employee: state.employeeReducer.employee,
        curEmp: state.authReducer.curEmp,
        confirmPW: state.passwordReducer.confirmPW,
        confirmPasswordPayload: state.passwordReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        confirmPassword: bindActionCreators(authenticateActions.confirmPassword, dispatch),
        terminationsActions: bindActionCreators(terminationsActions, dispatch),
        resetSuccess: bindActionCreators(globalAction.resetSuccess, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TerminationContainer);