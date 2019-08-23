import * as types from '../../constants/actionTypes';
import _ from 'lodash';
import update from 'react-addons-update';
import initialState from './initialState';
import { handleCRUDAction } from '../../services/common';
import initGlobal from '../Auth/initialState';

export default function load(state = {
    timeClock: _.clone(initialState.timeClock),
    payload: _.clone(initGlobal.payload),
}, action) {
    let newState;
    switch (action.type) {
        case types.GET_CURRENT_STATUS_TIMECLOCK:
        case types.CLOCK_TIME:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.timeClock = action.curStatus
            }
            return newState;
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    }
                }
            });
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                timeClock: {
                    $set: _.cloneDeep(initialState.timeClock)
                },
                payload: {
                    success: {
                        $set: false
                    },
                },
            });
            return newState;
        default:
            return state;
    }
}