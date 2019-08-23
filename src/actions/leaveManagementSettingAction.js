import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams, clone } from '../services/common';
import { loading } from './globalAction';
import { mapFromDtos, mapToDto } from '../services/mapping/leaveManagementSettingDTO';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as apiHelper from '../utils/apiHelper';
export function loadLeaveManagementSetting(redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'regions?' + query,
        //  url:".../apis/leaveManagement.json",
        //  API_DATA + apis.LEAVECONFIGS,
        $.ajax({
            url:  apiEndpoints.LEAVECONFIGS_GET_PUT,
            method: 'get',
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.LOAD_LEAVEMANAGEMENT_SETTING,
                    leaveManagement: rs,
                    rawLeaveConfigs: clone(data.items),
                    meta: data.meta,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_LEAVEMANAGEMENT_SETTING, redirect)
            }
        });
    }
}

export function editLeaveManagementSetting(rawLeaveConfigs, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        let data = mapToDto(rawLeaveConfigs)
        //   url:  API_URL +  SETTING + 'regions?' + query,
        //  url:".../apis/leaveManagement.json",
        //  API_DATA + apis.LEAVECONFIGS,
        $.ajax({
            url:  apiEndpoints.LEAVECONFIGS_GET_PUT,
            method: 'put',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.EDIT_LEAVEMANAGEMENT_SETTING,
                    leaveManagement: rs,
                    rawLeaveConfigs: clone(data.items),
                    meta: data.meta,
                    error: error
                });
            },
            error: function (xhr) {
                dispatch(loadLeaveManagementSetting())
                return catchError(xhr, dispatch, types.EDIT_LEAVEMANAGEMENT_SETTING, redirect)
            }
        });
    }
}

export function updateLeaveManagementDto(filedName, value) {
    return {
        type: types.UPDATE_LEAVEMANAGEMENT_DTO,
        filedName,
        value
    }
}


export function updateRawLeaveConfigDto(value) {
    return {
        type: types.UPDATE_RAWLEAVECONFIG_DTO,
        value
    }
}