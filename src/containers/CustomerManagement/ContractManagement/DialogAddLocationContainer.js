import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as contractActions from '../../../actions/contractActions';
import * as globalActions from '../../../actions/globalAction';
import * as locationActions from '../../../actions/locationActions';
import DialogAddLocation from '../../../components/pages/CustomerManagement/ContractManagement/DialogAddLocation';
import RIGHTS from '../../../constants/rights';
import { authorization } from '../../../services/common';

export const DialogAddLocationContainer = React.createClass({
    render: function () {
        return (
            authorization([RIGHTS.CREATE_LOCATION], this.props.curEmp, <DialogAddLocation
                {...this.props}
            />)
        );
    }
});

function mapStateToProps(state) {
    const { payload, locations } = state.settingReducer;
    const { curEmp } = state.authReducer;

    return {
        curEmp,
        payload,
        locations,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        globalActions: bindActionCreators(globalActions, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogAddLocationContainer);





