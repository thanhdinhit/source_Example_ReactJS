import * as PersonalSettingsService from '../services/personalSetting.service';
import * as types from '../constants/actionTypes';
import { catchError } from '../services/common';

// personal settings actions
export function getPersonalSettingsCommons(redirect) {
    return function (dispatch) {
        PersonalSettingsService.getPersonalSettings(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.GET_COMMONS_PERSONAL_SETTINGS, redirect);
            }
            return dispatch({
                type: types.GET_COMMONS_PERSONAL_SETTINGS,
                data: result.data
            });
        });
    };
}

export function getDelegateLeave(redirect) {
    return function (dispatch) {
        PersonalSettingsService.getDelegateLeave(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_DELEGATION_LEAVE, redirect);
            }
            return dispatch({
                type: types.GET_DELEGATION_LEAVE,
                data: result.data
            });
        });
    };
}

export function getDelegateTimeClock(redirect) {
    return function (dispatch) {
        PersonalSettingsService.getDelegateTimeClock(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_DELEGATION_TIME_CLOCK, redirect);
            }
            return dispatch({
                type: types.GET_DELEGATION_TIME_CLOCK,
                data: result.data
            });
        });
    };
}

export function editCommonsPersonalSettings(commonsPersonalSettings) {
    return function (dispatch) {
        PersonalSettingsService.editCommonsPersonalSettings(commonsPersonalSettings, function (error) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_COMMONS_PERSONAL_SETTINGS);
            }
            return dispatch({
                type: types.EDIT_COMMONS_PERSONAL_SETTINGS
            });
        });
    };
}

export function editDelegateLeave(id, delegateLeave) {
    return function (dispatch) {
        PersonalSettingsService.editDelegateLeave(id, delegateLeave, function (error) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_DELEGATION_LEAVE);
            }
            return dispatch({
                type: types.EDIT_DELEGATION_LEAVE
            });
        });
    };
}

export function editDelegationTimeClock(id, delegateTimeClock) {
    return function (dispatch) {
        PersonalSettingsService.editDelegateTimeClock(id, delegateTimeClock, function (error) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_DELEGATION_LEAVE);
            }
            return dispatch({
                type: types.EDIT_DELEGATION_TIME_CLOCK
            });
        });
    };
}