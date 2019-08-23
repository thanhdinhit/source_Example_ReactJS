import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
// import settingDto from '../services/mapping/settingDto';
import { mapFromDto, mapToDto } from '../services/mapping/jobRoleSettingDto';
import * as apiEndpoints from '../constants/apiEndpoints';
import { loading } from './globalAction';
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
import stringUtil from '../utils/stringUtil';
import * as JobRoleService from '../services/jobRole.service';

export function loadJobRolesSetting(queryString, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'skills?' + query,
        //   url:"../apis/jobRole.json",
        let params = getParams(queryString);
        let query = $.param(params);

        JobRoleService.searchJobRoles(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_JOBROLES_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            let jobRoles = mapFromDto(result.items);

            return dispatch({
                type: types.LOAD_JOBROLES_SETTING,
                jobRoles,
                error
            });
        });
    }
}

export function loadJobRoleSetting(jobRoleId, redirect = '/', callback = undefined) {
    return function (dispatch) {
        dispatch(loading());

        JobRoleService.getJobRole(jobRoleId, function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.LOAD_JOBROLE_SETTING, redirect);
            }
            if (callback) {
                return callback(result, status, xhr);
            }
            error = checkError(result, xhr.status);

            return dispatch({
                type: types.LOAD_JOBROLE_SETTING,
                jobRole: result.data,
                error: error
            });
        });
    };
}


export function addJobRole(jobRoleDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading());
        let jobRole = mapToDto(jobRoleDto);

        JobRoleService.addJobRole(jobRole, function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.ADD_JOBROLES_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            dispatch(loadJobRolesSetting(queryString, redirect));

            return dispatch({
                type: types.ADD_JOBROLES_SETTING,
                error: error
            });
        });
    };
}

export function editJobRole(jobRoleDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading());
        let jobRole = mapToDto(jobRoleDto);

        JobRoleService.editJobRole(jobRole, function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.EDIT_JOBROLES_SETTING, redirect);
            }
            error = checkError(result, xhr.status);
            dispatch(loadJobRolesSetting(queryString, redirect));

            return dispatch({
                type: types.EDIT_JOBROLES_SETTING,
                error: error
            });
        });
    };
}

export function deleteJobRole(jobRoleId, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading());

        JobRoleService.deleteJobRole(jobRoleId, function (error, result, status, xhr) {
            if (error) {
                return catchError(xhr, dispatch, types.DELETE_JOBROLES_SETTING, redirect);
            }
            dispatch(loadJobRolesSetting(queryString, redirect));

            return dispatch({
                type: types.DELETE_JOBROLES_SETTING,
            });
        });
    };
}