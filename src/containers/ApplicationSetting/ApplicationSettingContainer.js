import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ApplicationSetting from '../../components/pages/ApplicationSetting/ApplicationSetting';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common';
import RIGHTS from '../../constants/rights';

export const ApplicationSettingContainer = React.createClass({
  propTypes: {
    curEmp: PropTypes.object,
    location: PropTypes.object
  },

  render: function () {
    return (
      authorization(
        [],
        this.props.curEmp,
        <ApplicationSetting {...this.props} />,
        this.props.location.pathname
      )
    );
  }
});

function mapStateToProps(state) {
  return {
    curEmp: state.authReducer.curEmp,
    payload: state.settingReducer.payload,
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
)(ApplicationSettingContainer);





