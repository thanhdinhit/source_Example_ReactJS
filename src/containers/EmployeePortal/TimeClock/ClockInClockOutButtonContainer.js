import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as timeClockActions from '../../../actions/timeClockActions';
import * as globalAction from '../../../actions/globalAction';
import ClockInClockOutButton from '../../../components/pages/EmployeePortal/TimeClock/ClockInClockOutButton'

export const DialogClockInClockOutContainer = React.createClass({
    render: function () {
        return (
            <ClockInClockOutButton {...this.props} />
        );
    }
});

function mapStateToProps(state) {
    return {
        timeClock: state.timeClockReducer.timeClock,
        curEmp: state.authReducer.curEmp,
        payload: state.authReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCurrentStatus: bindActionCreators(timeClockActions.getCurrentStatus, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogClockInClockOutContainer);

