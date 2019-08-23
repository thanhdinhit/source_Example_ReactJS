import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState'
import { clone, handleCRUDAction } from '../../services/common'
import initialState from './initialState'
import update from 'react-addons-update'
import * as leaveManagementSettingDTO from '../../services/mapping/leaveManagementSettingDTO'
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = {
    employeeManagerment: clone(initialState.employeeManagerment),
    leaveManagement: clone(initialState.leaveManagement),
    rawLeaveConfigs: [],
    payload: clone(initGlobal.payload),
    meta: {}
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_REQUIREDDOCUMENTS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState = update(newState, {
                employeeManagerment: {
                    requiredDocuments: {
                        $set: action.requiredDocuments
                    }
                }
            })
            // newState.employeeManagerment.requiredDocuments = action.requiredDocuments;
            return newState;
        case types.ADD_REQUIREDDOCUMENT_SETTING:
        case types.EDIT_REQUIREDDOCUMENT_SETTING:
        case types.DELETE_REQUIREDDOCUMENT_SETTING:
            return handleCRUDAction(state, action);
        case types.LOAD_LEAVEMANAGEMENT_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            if (action.leaveManagement && action.rawLeaveConfigs) {
                newState = update(newState, {
                    leaveManagement: {
                        $set: action.leaveManagement
                    },
                    rawLeaveConfigs: {
                        $set: action.rawLeaveConfigs
                    }
                })
            }


            return newState;
        case types.UPDATE_LEAVEMANAGEMENT_DTO:
            newState = update(state, {
                leaveManagement: {
                    [action.filedName]: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.EDIT_LEAVEMANAGEMENT_SETTING:
            newState = handleCRUDAction(state, action);
            if (action.leaveManagement && action.rawLeaveConfigs) {
                newState = update(newState, {
                    leaveManagement: {
                        $set: action.leaveManagement
                    },
                    rawLeaveConfigs: {
                        $set: action.rawLeaveConfigs
                    }
                })
            }
            return newState;
        case types.UPDATE_RAWLEAVECONFIG_DTO:
            newState = update(state, {
                rawLeaveConfigs: {
                    $set: action.value
                }
            })
            newState = update(newState, {
                leaveManagement: {
                    $set: leaveManagementSettingDTO.mapFromDtos(newState.rawLeaveConfigs)
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
            });
            return newState;
        case types.RESET_STATE:
            newState = clone(state);
            newState.payload.success = false;
            // newState.location = clone(initialState.location)
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
        default:
            return state;
    }
}
