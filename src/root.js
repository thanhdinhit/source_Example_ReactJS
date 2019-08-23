import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { loginSuccess } from './actions/authenticateActions';
import { loadGeneralSetting } from './actions/publicAction';
import routes from './routes';
import { Router, browserHistory } from 'react-router';
import { setBrowserHistory } from './utils/browserHelper';

// Create an enhanced history that syncs navigation events with the store
export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
let token = localStorage.getItem('token');
let employeeId = localStorage.getItem('employeeId');
let language = localStorage.getItem('language');
let firstLogin = localStorage.getItem('firstLogin')
let secret = localStorage.getItem('secret');
let userName = localStorage.getItem('userName');
let accessRights = []
try {
    accessRights = JSON.parse(localStorage.getItem('accessRights'));
}
catch (err) {

}
store.dispatch(loadGeneralSetting())
if (token !== null) {
    store.dispatch(loginSuccess({ token, userPreference: { userLanguage: language }, employeeId, userName, accessRights, firstLogin , secret}, '/', {}));

}
else {
    localStorage.clear();
}

browserHistory.listen(location => {
    setBrowserHistory(location)
});

export default React.createClass({
    render: function () {
        return (
            <Provider store={store}>
                <Router history={history} routes={routes} />
            </Provider>
        )
    }
})