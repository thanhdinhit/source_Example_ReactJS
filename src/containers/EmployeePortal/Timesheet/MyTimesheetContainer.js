import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyTimesheet from '../../../components/pages/EmployeePortal/Timesheet/MyTimesheet';
import * as timesheetActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';
import * as locationActions from '../../../actions/locationActions';
import * as settingAction from '../../../actions/settingAction';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

class MyTimesheetContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            (authorization([RIGHTS.VIEW_MY_TIMESHEET], this.props.curEmp, <MyTimesheet {...this.props} />, this.props.location.pathname))
        );
    }
}

function mapStateToProps(state) {
    const { payload, meta, myTimesheets } = state.timesheetsReducer;
    return {
        payload,
        meta,
        myTimesheets,
        curEmp: state.authReducer.curEmp
    };
}

function mapDispatchToProps(dispatch) {
    return {
        timesheetActions: bindActionCreators(timesheetActions, dispatch),
        globalAction: bindActionCreators(globalAction, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyTimesheetContainer);