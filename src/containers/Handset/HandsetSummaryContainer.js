import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as handsetsActions from '../../actions/handsetsActions';
import * as globalActions from '../../actions/globalAction';
import HandsetSummary from '../../components/pages/Handset/HandsetSummary';
import RIGHTS from '../../constants/rights';
import { authorization } from '../../services/common';

export const HandsetSummaryContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_HANDSET], this.props.curEmp, <HandsetSummary {...this.props} />, this.props.location.pathname)
        );
    }
});

function mapStateToProps(state) {
    const { payload } = state.handsetsReducer;
    const { employeeInfo, curEmp } = state.authReducer;
    return {
        employeeInfo,
        curEmp,
        payload
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addHandsetType: bindActionCreators(handsetsActions.addHandsetType, dispatch),
        editHandsetType: bindActionCreators(handsetsActions.editHandsetType, dispatch),       
        resetError: bindActionCreators(globalActions.resetError, dispatch),
        resetState: bindActionCreators(globalActions.resetState, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HandsetSummaryContainer);