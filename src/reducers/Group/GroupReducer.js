import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState'
import { clone, handleCRUDAction } from '../../services/common'
import initialState from './initialState'
import update from 'react-addons-update'
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = {
    group: clone(initialState.group),
    groupType: clone(initialState.groupType),
    groups: [],
    groupTypes: [],
    states: [],
    payload: clone(initGlobal.payload),
    meta: {},
    supervisors: [],
    groupSubs: [],
    managedGroups: []
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_ALL_GROUP_TYPE:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.groupTypes = action.groupTypes;
            return newState;
        case types.LOAD_ALL_SUPERVISOR:
            newState = handleCRUDAction(state, action);
            if(newState.payload.success){
                newState.payload.success = false;
                newState.supervisors = action.supervisors;
            }
            return newState;
        case types.LOAD_GROUP_TYPE:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.groupType = action.groupType;
            return newState;
        case types.ADD_GROUP_TYPE:
        case types.EDIT_GROUP_TYPE:
        case types.DELETE_GROUP_TYPE:
            return handleCRUDAction(state, action);

        case types.LOAD_ALL_BASE_GROUP:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.baseGroups = action.baseGroups;
            return newState;
        case types.LOAD_ALL_GROUP:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.groups = action.groups;
            newState.meta = action.meta;
            return newState;
        case types.LOAD_GROUP:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.group = action.group;
            return newState;
        case types.LOAD_MANAGED_GROUPS:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.managedGroups = action.managedGroups;

            return newState;
        case types.ADD_GROUP:
        case types.EDIT_GROUP:
        case types.DELETE_GROUP:
            return handleCRUDAction(state, action);
        case types.RESET_STATE:
            newState = clone(state);
            newState.payload.success = false;
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
        case types.LOAD_GROUPS_SUB: {
            newState = handleCRUDAction(state, action);
            newState.groupSubs = action.groupSubs;

            return newState;
        }
        case types.ADD_EDIT_GROUP_ORGANIZATION: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        default:
            return state;
    }
}
