import * as types from '../constants/actionTypes';
import { catchError, checkError } from '../services/common';
import { mapFromDtos } from '../services/mapping/availabilityDTO';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as SettingService from '../services/setting.service';

export function loadAvailabilitySetting(redirect = '/') {
    return function (dispatch) {
        SettingService.getAvailability(function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.LOAD_AVAILABILITY_SETTING, redirect);
            }
            error = checkError(result, xhr.status);
            let availabilitySetting = mapFromDtos(result.data.availabilityTime);
            return dispatch({
                type: types.LOAD_AVAILABILITY_SETTING,
                availabilitySetting,
                error: error
            });
        });
    };
}

export function loadWorkingTimeSetting(redirect = '/') {
    return function (dispatch) {
        SettingService.getWorkingTime(function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.LOAD_WORKINGTIME_SETTING, redirect);
            }
            error = checkError(result, xhr.status);
            let workingTimeSetting = mapFromDtos(result.data.dayTimes);
            return dispatch({
                type: types.LOAD_WORKINGTIME_SETTING,
                workingTimeSetting,
                error: error
            });
        });
    };
}