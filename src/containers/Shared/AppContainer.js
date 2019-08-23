import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppComponent from '../../components/shared/App'
import * as AuthActions from '../../actions/authenticateActions'
import * as myProfileActions from '../../actions/myProfileActions'
import * as PublicAction from '../../actions/publicAction';

var app = React.createClass({
    render: function () {
        return (
            <AppComponent {...this.props}/>
        )
    }
})
function mapStateToProps(state) {
    return {
        employeeInfo: state.authReducer.employeeInfo,
        curEmp: state.authReducer.curEmp,
        payload: state.authReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        checkAuthenticate: bindActionCreators(AuthActions.checkAuthenticate, dispatch),
        logout: bindActionCreators(AuthActions.logout, dispatch),
        changeLanguage: bindActionCreators(PublicAction.changeLanguage, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(app);

