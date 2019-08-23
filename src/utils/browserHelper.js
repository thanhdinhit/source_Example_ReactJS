import _ from 'lodash'
export const ACTION = {
    PUSH: 'PUSH',
    REPLACE: 'REPLACE',
    POP: 'POP'
}
export const KEY_HISTORY = 'browserHistory'
export function setBrowserHistory(location) {
    let historyArr = []
    try {
        historyArr = JSON.parse(localStorage.getItem(KEY_HISTORY));
    } catch (error) {
        historyArr = []
    }
    historyArr = _.takeRight(historyArr, 10)
    switch (location.action) {
        case ACTION.POP:
        case ACTION.PUSH: {
            historyArr.push(location)
            break;
        }
        case ACTION.REPLACE: {
            if (historyArr.length) {
                historyArr[historyArr.length - 1] = location;
            }
            else {
                historyArr.push(location)
            }
            break;
        }
    }
    localStorage.setItem(KEY_HISTORY, JSON.stringify(historyArr))
}
export function getPreviousPage() {
    let historyArr = []
    try {
        historyArr = JSON.parse(localStorage.getItem(KEY_HISTORY));
    } catch (error) {
        historyArr = []
    }
    historyArr = _.takeRight(historyArr, 10)
    if (!historyArr.length) return { pathname: '/app', search: '' };
    let lastLocation = historyArr[historyArr.length - 1];
    let index = _.findLastIndex(historyArr, location => location.pathname != lastLocation.pathname);
    if (index >= 0)
        return historyArr[index];
    else return { pathname: '/app', search: '' };
}