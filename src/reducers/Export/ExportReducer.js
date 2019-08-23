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
    relativeFile: []
};
export default function load(state = defaultState, action) {
    let newState;
    switch (action.type) {
        case types.EXPORT_EMPLOYEES: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.relativeFilePath = action.relativeFilePath;
            }
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
                }
            });
            return newState;

        case types.LOADING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: true
                    }
                }
            });
            return newState;
        default:
            return state;
    }
}
