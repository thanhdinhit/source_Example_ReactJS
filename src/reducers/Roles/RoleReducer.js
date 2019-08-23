import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import { browserHistory } from 'react-router';
export default function load(state = {
    roles: [],
    allAccessRights: [],
    role: clone(initialState.role),
    meta: {},
    payload: clone(initGlobal.payload),
}, action) {
    let newState;
    switch (action.type) {
        case types.ADD_ROLE:
        case types.EDIT_ROLE:
        case types.DELETE_ROLE:
            return handleCRUDAction(state, action);
        case types.LOAD_ROLE_DETAIL:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            if (action.role)
                newState.role = action.role;
            return newState;
        case types.LOAD_ROLES:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.roles = action.roles;
            return newState;
        case types.LOAD_ACCESS_RIGHTS:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.allAccessRights = action.allAccessRights;
            return newState;
        case types.UPDATE_ROLE_DTO:
            newState = update(state, {
                role: {
                    [action.fieldName]: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    },
                },
                role: {
                    $set: clone(initialState.role)
                }
            });
            return newState;
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    }
                }
            })
            return newState;
        case types.SWITCH_TYPE_PAYLOAD:
            newState = update(state, {
                payload: {
                    type: {
                        $set: action.value
                    }
                }
            })
            return newState;
        default:
            return state;
    }
}
