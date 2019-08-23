import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as handsetsActions from '../../actions/handsetsActions';
import * as globalActions from '../../actions/globalAction';
import Handsets from '../../components/pages/Handset/Handsets';
import RIGHTS from '../../constants/rights';
import { authorization } from '../../services/common';

export const HandsetsContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.VIEW_HANDSET], this.props.curEmp, <Handsets {...this.props} />, this.props.location.pathname)
        );
    }
});

function mapStateToProps(state) {
    return {
        curEmp: state.authReducer.curEmp,
        employeeInfo: state.authReducer.employeeInfo
    };
}

export default connect(
    mapStateToProps,
    null
)(HandsetsContainer);