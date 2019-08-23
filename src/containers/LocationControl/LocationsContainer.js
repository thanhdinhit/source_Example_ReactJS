import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as locationActions from '../../actions/locationActions';
import Locations from '../../components/pages/LocationControl/Location/Locations';
import * as globalActions from '../../actions/globalAction';
import RIGHTS from '../../constants/rights';
import { authorization } from '../../services/common';

export const LocationsContainer = React.createClass({

  render: function () {
    return (
      authorization([RIGHTS.VIEW_LOCATION], this.props.curEmp, <Locations
        {...this.props}
      />, this.props.location.pathname)
    );
  }
});

function mapStateToProps(state) {
  return {
    locations: state.settingReducer.locations,
    meta: state.settingReducer.meta,
    curEmp: state.authReducer.curEmp,
    payload: state.settingReducer.payload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    locationActions: bindActionCreators(locationActions, dispatch),
    globalActions: bindActionCreators(globalActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationsContainer);





