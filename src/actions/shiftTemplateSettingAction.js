import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
import {
    mapFromDtos,
    mapToDto
} from '../services/mapping/shiftTemplateSettingDto';
import { loading } from './globalAction';
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as shiftTemplateService from '../services/shiftTemplate.service';

export function loadShiftTemplatesSetting(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["name"] = queryString.name ? "%" + queryString.name : undefined;
        params = _.omitBy(params, _.isUndefined);

        shiftTemplateService.loadShiftTemplatesSetting(params, function (error, result) {
          if (error) {
            return catchError(error, dispatch, types.LOAD_SHIFTTEMPLATES_SETTING, redirect);
          }

          const shiftTemplates = mapFromDtos(result.items);
          return dispatch({
            type: types.LOAD_SHIFTTEMPLATES_SETTING,
            shiftTemplates,
            meta: result.meta
          });
        });
    };
}


export function addShiftTemplate(curEmp, shiftTemplateDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())

        // let url =  API_URL +  SETTING + 'shifttemplates';
        let shiftTemplate = mapToDto(shiftTemplateDto);
        $.ajax({
            url:  apiEndpoints.SHIFTTEMPLATES_POST,
            method: 'post',
            data: JSON.stringify(shiftTemplate),
            contentType: "application/json",
            headers: {
                'Authorization': 'Basic ' + curEmp.token,
                "Username": curEmp.userName,
            },
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                dispatch(loadShiftTemplatesSetting(queryString, redirect))
                return dispatch({
                    type: types.ADD_SHIFTTEMPLATE_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.ADD_SHIFTTEMPLATE_SETTING, redirect)
            }
        });
    }
}
export function editShiftTemplate(curEmp, shiftTemplateDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        // let url =  API_URL +  SETTING + 'shifttemplates/' + shiftTemplateDto.id;
        let shiftTemplate = mapToDto(shiftTemplateDto);
        $.ajax({
            url: stringUtil.format(apiEndpoints.SHIFTTEMPLATE_GET_PUT_DEL, shiftTemplateDto.id),
            method: 'put',
            data: JSON.stringify(shiftTemplate),
            contentType: "application/json",
            headers: {
                'Authorization': 'Basic ' + curEmp.token,
                "Username": curEmp.userName,
            },
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                dispatch(loadShiftTemplatesSetting(queryString, redirect))
                return dispatch({
                    type: types.EDIT_SHIFTTEMPLATES_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_SHIFTTEMPLATES_SETTING, redirect)
            }
        });
    }
}

export function deleteShiftTemplate(curEmp, shiftTemplateId, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        // let url =  API_URL +  SETTING + 'shifttemplates/' + shiftTemplateId;
        $.ajax({
            url: stringUtil.format(apiEndpoints.SHIFTTEMPLATE_GET_PUT_DEL, shiftTemplateId),
            method: 'delete',
            contentType: "application/json",
            headers: {
                'Authorization': 'Basic ' + curEmp.token,
                "Username": curEmp.userName,
            },
            success: function (data, status, xhr) {
                dispatch(loadShiftTemplatesSetting(queryString, redirect))
                return dispatch({
                    type: types.DELETE_SHIFTTEMPLATES_SETTING,
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.DELETE_SHIFTTEMPLATES_SETTING, redirect)
            }
        });
    }
}