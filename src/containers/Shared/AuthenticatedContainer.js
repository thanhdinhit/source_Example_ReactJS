import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as AuthActions from '../../actions/authenticateActions';
import { browserHistory } from 'react-router';
export function requireAuthentication(Component) {

    var AuthenticateComponent = React.createClass({
        componentWillMount: function () {
            this.checkAuth(this.props.payload.isAuthenticated);
        },

        componentWillReceiveProps: function (nextProps) {
            this.checkAuth(nextProps.payload.isAuthenticated);
        },
        checkAuth: function (isAuthenticated) {
            if (!isAuthenticated) {
                let redirectAfterLogin = this.props.location.pathname;
                if(redirectAfterLogin) {
                    browserHistory.push(`/login?next=${redirectAfterLogin}`);
                } else {
                    browserHistory.push(`/login`);
                }                
            }
        },

        render: function () {
            return (
                <div>
                    {this.props.payload.isAuthenticated === true
                        ? <Component {...this.props} />
                        : null
                    }
                </div>
            )

        }

    })
    function mapStateToProps(state) {
        return {
            curEmp: state.authReducer.curEmp,
            payload: state.authReducer.payload
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(AuthActions, dispatch),
        };
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(AuthenticateComponent);
}
