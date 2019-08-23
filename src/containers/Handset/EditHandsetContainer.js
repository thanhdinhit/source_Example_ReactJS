import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as handsetsActions from '../../actions/handsetsActions';
import * as groupActions from '../../actions/groupActions';
import * as employeeActions from '../../actions/employeeActions';
import * as globalActions from '../../actions/globalAction';
import EditHandset from '../../components/pages/Handset/EditHandset';
import RIGHTS from '../../constants/rights';
import { authorization } from '../../services/common';

export const EditHandsetContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.MODIFY_HANDSET], this.props.curEmp, <EditHandset {...this.props} />, this.props.location.pathname)
        );
    }
});

function mapStateToProps(state) {
    return {
        employeeInfo: state.authReducer.employeeInfo,
        curEmp: state.authReducer.curEmp,
    };
}

export default connect(
    mapStateToProps,
    null
)(EditHandsetContainer);