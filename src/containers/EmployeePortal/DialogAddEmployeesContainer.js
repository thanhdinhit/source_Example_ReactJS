import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DialogAddEmployees from '../../components/pages/EmployeePortal/DialogAddEmployees';

import * as employeeActions from '../../actions/employeeActions';
import * as jobRoleSettingAction from '../../actions/jobRoleSettingAction';
import * as locationActions from '../../actions/locationActions';


class DialogAddEmployeesContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogAddEmployees
                {...this.props}
            />
        );
    }
}
function mapStateToProps(state) {
    const { payload, employees, meta } = state.employeeReducer;
    const { jobRoles, locations } = state.settingReducer;
    return {
        employees,
        meta,
        payload,
        jobRoles,
        locations,
        curEmp: state.authReducer.curEmp,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        employeeActions: bindActionCreators(employeeActions, dispatch),
        jobRoleSettingAction: bindActionCreators(jobRoleSettingAction, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogAddEmployeesContainer);