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
    personalSettings: [],
    delegationLeave: {},
    delegationTimeClock: {},
    editCommonsPersonalSettingsSuccess: false,
    editDelegationLeaveSuccess: false,
    editDelegationTimeClockSuccess: false,
    errorEditCommonsPersonalSettings: initGlobal.error,
    errorEditDelegationLeave: initGlobal.error,
    errorEditDelegationTimeClock: initGlobal.error,
    members: []
};
export default function load(state = defaultState, action) {
    let newState;
    switch (action.type) {
        case types.GET_COMMONS_PERSONAL_SETTINGS: {
            newState = handleCRUDAction(state, action);
            newState.personalSettings = action.data.personalSettings;
            return newState;
        }
        case types.GET_DELEGATION_LEAVE: {
            newState = handleCRUDAction(state, action);
            newState.delegationLeave = action.data;
            return newState;
        }
        case types.GET_DELEGATION_TIME_CLOCK: {
            newState = handleCRUDAction(state, action);
            newState.delegationTimeClock = action.data;
            return newState;
        }
        case types.GET_MEMBERS: {
            newState = handleCRUDAction(state, action);
            let members = _.map(action.members, function (member) {
                return member.data;
            });
            newState.members = members;
            return newState;
        }
        case types.EDIT_COMMONS_PERSONAL_SETTINGS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.editCommonsPersonalSettingsSuccess = true;
                return newState;
            }
            newState.errorEditCommonsPersonalSettings = newState.payload.error;
            return newState;
        }
        case types.EDIT_DELEGATION_LEAVE: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.editDelegationLeaveSuccess = true;
                return newState;
            }
            newState.errorEditDelegationLeave = newState.payload.error;
            return newState;
        }
        case types.EDIT_DELEGATION_TIME_CLOCK: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.editDelegationTimeClockSuccess = true;
                return newState;
            }
            newState.errorEditDelegationTimeClock = newState.payload.error;
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
                editCommonsPersonalSettingsSuccess: {
                    $set: false
                },
                editDelegationLeaveSuccess: {
                    $set: false
                },
                editDelegationTimeClockSuccess: {
                    $set: false
                },
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
                errorEditCommonsPersonalSettings: {
                    $set: initGlobal.error
                },
                errorEditDelegationLeave: {
                    $set: initGlobal.error
                },
                errorEditDelegationTimeClock: {
                    $set: initGlobal.error
                }
            });
            return newState;

        default:
            return state;
    }
}
