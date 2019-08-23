import * as types from '../constants/actionTypes';
import { catchError } from '../services/common';
import { mapToDto, mapFromDto } from '../services/mapping/timeClockDTO';
import * as TimeClockService from '../services/timeClock.service';
import _ from 'lodash';

export function getCurrentStatus(redirect = "/") {
    return function (dispatch) {
        TimeClockService.getCurrentStatus(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_CURRENT_STATUS_TIMECLOCK, redirect);
            }
            let curStatus = mapFromDto(result.data)
            return dispatch({
                type: types.GET_CURRENT_STATUS_TIMECLOCK,
                curStatus
            })
        })
    }
}

export function clockTime(clockDto) {
    let data = mapToDto(clockDto)
    return function (dispatch) {
        TimeClockService.clockTime(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.CLOCK_TIME);
            }
            let curStatus = mapFromDto(result.data)
            return dispatch({
                type: types.CLOCK_TIME,
                curStatus
            })
        })
    }
}