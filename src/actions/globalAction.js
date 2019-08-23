import * as types from '../constants/actionTypes';

export function resetSuccess() {
    return {
        type: types.RESET_SUCCESS
    };
}
export function resetError() {
    return {
        type: types.RESET_ERROR
    };
}
export function resetState(arrProp) {
    return {
        type: types.RESET_STATE,
        arrProp
    };
}

export function resetScheduleState() {
    return {
        type: types.RESET_SCHEDULE_STATE,
    };
}

export function resetLocationState(){
    return{
        type: types.RESET_LOCATION_STATE
    }
}

export function loading() {
    return {
        type: types.LOADING
    };
}
export function switchTypePayload(type) {
    //type: 'VIEW', 'EDIT', 'NEW'
    return {
        type: types.SWITCH_TYPE_PAYLOAD,
        value: type
    };
}