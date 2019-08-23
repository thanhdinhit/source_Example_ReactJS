import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as timeClockActions from '../../../actions/timeClockActions';
import * as globalAction from '../../../actions/globalAction';
import DialogClockInClockOut from '../../../components/pages/EmployeePortal/TimeClock/DialogClockInClockOut'

export const DialogClockInClockOutContainer = React.createClass({
    render: function () {
        return (
            <DialogClockInClockOut {...this.props} />
        );
    }
});

function mapStateToProps(state) {
    return {
        timeClock: state.timeClockReducer.timeClock,
        curEmp: state.authReducer.curEmp,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCurrentStatus: bindActionCreators(timeClockActions.getCurrentStatus, dispatch),
        clockTime: bindActionCreators(timeClockActions.clockTime, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogClockInClockOutContainer);

