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
    leaveSetting: clone(initialState.leaveSetting),
    leaveSettings: clone(initialState.leaveSettings),
    skills: [],
    regions: [],
    region: {},
    locations: [],
    allLocations: [],
    requiredDocuments: [],
    location: clone(initialState.location),
    shiftTemplates: [],
    jobRoles: [],
    userRoles: [],
    genders: [],
    payRateSetting: [],
    payload: clone(initGlobal.payload),
    meta: {},
}, action) {
    let newState;
    switch (action.type) {
        case types.SWITCH_TYPE_PAYLOAD:
            newState = update(state, {
                payload: {
                    type: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.LOAD_GENDERS:
            newState = handleCRUDAction(state, action);
            newState.genders = action.genders;
            newState.payload.success = false;
            return newState;

        case types.LOAD_USERROLES_SETTING:
            newState = handleCRUDAction(state, action);
            newState.userRoles = action.userRoles;
            newState.payload.success = false;
            return newState;
        case types.LOAD_JOBROLES_SETTING:
            if (action.error && action.error.code != 0 || action.error.exception) {
                newState = update(state, {
                    payload: {
                        error: {
                            $set: action.error
                        }
                    }

                })
                return newState;
            }
            newState = update(state, {
                jobRoles: {
                    $set: action.jobRoles
                }
            });
            return newState;

        case types.ADD_JOBROLES_SETTING:
        case types.EDIT_JOBROLES_SETTING:
        case types.DELETE_JOBROLES_SETTING:
            return handleCRUDAction(state, action);
        case types.LOAD_SHIFTTEMPLATES_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.shiftTemplates = action.shiftTemplates;
            newState.meta = action.meta;
            return newState;
        case types.ADD_SHIFTTEMPLATE_SETTING:
        case types.EDIT_SHIFTTEMPLATES_SETTING:
        case types.DELETE_SHIFTTEMPLATES_SETTING:
            return handleCRUDAction(state, action);
        case types.LOAD_REGIONS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.regions = action.regions;
            newState.meta = action.meta;

            if (newState.location.region && newState.location.region.id) {
                let regionSelected = clone(newState.regions.find(x => x.id == newState.location.region.id));
                regionSelected.value = regionSelected.id;
                regionSelected.label = regionSelected.name;
                newState = update(newState, {
                    location: {
                        region: {
                            $set: regionSelected
                        }
                    }
                })
            }
            return newState;

        case types.LOAD_REGION_DETAIL:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.region = action.region;
            return newState;

        case types.ADD_REGION_SETTING:
        case types.EDIT_REGION_SETTING:
        case types.DELETE_REGION_SETTING:
            return handleCRUDAction(state, action);
        case types.LOAD_SKILLS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.skills = action.skills
            return newState;
        case types.EDIT_SKILL_SETTING:
        case types.ADD_SKILL_SETTING:
        case types.DELETE_SKILL_SETTING:
            return handleCRUDAction(state, action);
        case types.LOAD_REQUIREDDOCUMENTS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.requiredDocuments = action.requiredDocuments;
            return newState;
        case types.LOAD_LOCATION_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.location = action.location;
            return newState;
        case types.LOAD_LOCATIONS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.locations = action.locations;
            newState.meta = action.meta;
            return newState;
        case types.LOAD_ALL_LOCATIONS_SETTING:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.allLocations = action.locations;
            return newState;
        case types.ADD_LOCATION_SETTING:
        case types.EDIT_LOCATION_SETTING:
        case types.DELETE_LOCATION_SETTING:

            return handleCRUDAction(state, action);
        case types.UPDATE_LOCATION_DTO:
            newState = update(state, {
                location: {
                    [action.fieldName]: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.UPDATE_FULL_LOCATION_DTO:
            newState = update(state, {
                location: {
                    $set: action.dto
                }
            })
            return newState;
        case types.LOAD_LOCATIONS_OF_REGIONID:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.locations = action.locations;
            newState.meta = action.meta;
            return newState;

        case types.UPDATE_LEAVE_SETTING:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    }
                }

            });
            if (action.error && action.error.code == 0 && !action.error.exception)
                newState.payload.success = true;
            newState.payload.error = action.error;
            return newState;
        case types.UPDATE_SETTING:
            newState = clone(state);

            switch (action.element.type) {
                case "Leave":
                    switch (action.element.subType) {
                        case "Sick": {
                            newState.leaveSettings.sick.forEach(function (element, index) {
                                newState.leaveSettings.sick[index].enable = action.element.enable;
                            }, this);
                            let index = newState.leaveSettings.sick.findIndex(x => x.id == action.element.id);
                            newState.leaveSettings.sick[index] = action.element;
                        }

                            break;
                        case "Long Service Leave": {
                            newState.leaveSettings.longServiceLeave.forEach(function (element, index) {
                                newState.leaveSettings.longServiceLeave[index].enable = action.element.enable;
                            }, this);
                            let index = newState.leaveSettings.longServiceLeave.findIndex(x => x.id == action.element.id);
                            newState.leaveSettings.longServiceLeave[index] = action.element;
                        }
                            break;
                        default: {
                            let index = newState.leaveSettings.leaveType.findIndex(x => x.id == action.element.id);
                            newState.leaveSettings.leaveType[index] = action.element;
                        }
                            break;
                    }

                    break;
                case "Remind":
                    {
                        let index = newState.leaveSettings.remindType.findIndex(x => x.id == action.element.id);
                        newState.leaveSettings.remindType[index] = action.element;
                    }
                    break;
                case "Escalate":
                    {
                        let index = newState.leaveSettings.escalateType.findIndex(x => x.id == action.element.id);
                        newState.leaveSettings.escalateType[index] = action.element;
                    }
                    break;
                case "Truncate":
                    {
                        let index = newState.leaveSettings.truncateType.findIndex(x => x.id == action.element.id);
                        newState.leaveSettings.truncateType[index] = action.element;
                    }
                    break;
                default:
                    break;
            }

            return newState;
        case types.LOAD_LEAVE_SETTING:
            newState = clone(state);
            if (action.error && action.error.code != 0 || action.error.exception) {
                newState.payload.error = action.error;
                return newState;
            }
            newState.leaveSettings = action.leaveSettings;
            newState.payload.error = clone(initGlobal.error);
            return newState;
        case types.LOAD_PAY_RATE_SETTING: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.payRateSetting = action.payRateSetting;
            }
            return newState;
        }
        case types.RESET_STATE:
        case types.RESET_LOCATION_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    }
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

        default:
            return state;
    }
}
