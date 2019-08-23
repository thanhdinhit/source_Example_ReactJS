import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import { clone, handleCRUDAction } from '../../services/common';
import update from 'react-addons-update';
import _ from 'lodash';
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
let defaultState = {
    payload: clone(initGlobal.payload),
    meta: {},
    terminations: [],
    terminationReason: [],
    terminationSuccess: false,
    rejoinSuccess: false,
    rejoinError: initGlobal.error,
    terminationError: initGlobal.error,
};
export default function load(state = defaultState, action) {
    let newState;
    switch (action.type) {
        case types.GET_TERMINATIONS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.terminations = action.data;
                newState.payload.success = false;
            }
            return newState;
        }
        case types.GET_TERMINATION_REASON: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.terminationReason = action.data;
                newState.payload.success = false;
            }
            return newState;
        }
        case types.TERMINATION: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.terminationSuccess = true;
                return newState;
            }
            newState.terminationError = newState.payload.error;
            return newState;
        }
        case types.REJOIN: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.rejoinSuccess = true;
                return newState;
            }
            newState.rejoinError = newState.payload.error;
            return newState;
        }
        case types.RESET_STATE:
            newState = state;
            if (action.arrProp) {
                action.arrProp.forEach(function (element) {
                    newState = update(newState, {
                        [element]: {
                            $set: defaultState[element]
                        }
                    });
                });
            }
            return newState;
        case types.RESET_SUCCESS: {
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    }
                },
                terminationSuccess: {
                    $set: false
                },
                rejoinSuccess: {
                    $set: false
                }
            });
            return newState;
        }
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    }
                },
                terminationError: {
                    $set: initGlobal.error
                },
                rejoinError: {
                    $set: initGlobal.error
                }
            });
            return newState;

        default:
            return state;
    }
}
