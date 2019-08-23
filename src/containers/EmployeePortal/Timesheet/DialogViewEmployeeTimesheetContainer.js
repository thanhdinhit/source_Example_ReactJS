import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DialogViewEmployeeTimesheetDetail from '../../../components/pages/EmployeePortal/Timesheet/DialogViewEmployeeTimesheetDetail';
import * as locationSettingActions from '../../../actions/locationActions';
import * as timesheetsActions from '../../../actions/timesheetsActions';
import * as globalAction from '../../../actions/globalAction';

class DialogViewEmployeeTimesheetContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogViewEmployeeTimesheetDetail
                {...this.props}
            />
        );
    }
}


function mapStateToProps(state) {
    return {
        timesheetTypes: state.timesheetsReducer.timesheetTypes,
        locations: state.settingReducer.locations,
        curEmp: state.authReducer.curEmp,
        payload: state.timesheetsReducer.payload,
        meta: state.timesheetsReducer.meta,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadLocations: bindActionCreators(locationSettingActions.loadLocations, dispatch),
        timesheetsActions: bindActionCreators(timesheetsActions, dispatch),
        globalActions: bindActionCreators(globalAction, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogViewEmployeeTimesheetContainer);