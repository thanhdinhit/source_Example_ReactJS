import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TeamOverTime from '../../../components/pages/EmployeePortal/Overtime/TeamOverTime';
import * as globalAction from '../../../actions/globalAction';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

class TeamOverTimeContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            (authorization([RIGHTS.VIEW_MEMBER_OVERTIME], this.props.curEmp, <TeamOverTime {...this.props} />, this.props.location.pathname))
        );
    }
}

function mapStateToProps(state) {
    const { payload, meta } = state.overtimeReducer;
    return {
        payload,
        meta,
        curEmp: state.authReducer.curEmp
    };
}

function mapDispatchToProps(dispatch) {
    return {
        globalAction: bindActionCreators(globalAction, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamOverTimeContainer);