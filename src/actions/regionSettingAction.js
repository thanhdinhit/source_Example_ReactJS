import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
// import settingDto from '../services/mapping/settingDto';
import { loading } from './globalAction'
import * as apis from '../constants/apis'
import { mapFromDtos } from '../services/mapping/regionDTO';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as RegionService from '../services/region.service';

export function loadRegionsSetting(queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        let params = getParams(queryString)

        RegionService.searchRegions(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_REGIONS_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            return dispatch({
                type: types.LOAD_REGIONS_SETTING,
                regions: mapFromDtos(result.items),
                meta: result.meta,
                error
            });
        });
    }
}

export function loadRegionDetail(queryString, regionId, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        $.ajax({
            url: stringUtil.format(apiEndpoints.REGION_GET_PUT_DEL, regionId),
            method: 'get',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),

            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.LOAD_REGION_DETAIL,
                    region: data.data,
                    meta: data.meta,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_REGION_DETAIL, redirect)
            }
        });
    }
}

export function addRegionsSetting(region, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        $.ajax({
            url: apiEndpoints.REGIONS_POST,
            method: 'post',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            data: JSON.stringify(region),
            success: function (data, status, xhr) {
                dispatch(loadRegionsSetting(queryString, redirect))
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.ADD_REGION_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.ADD_REGION_SETTING, redirect)
            }
        });
    }
}

export function editRegionsSetting(region, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        $.ajax({
            url: stringUtil.format(apiEndpoints.REGION_GET_PUT_DEL, regionId),
            method: 'put',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            data: JSON.stringify(region),
            success: function (data, status, xhr) {
                dispatch(loadRegionsSetting(queryString, redirect))
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.EDIT_REGION_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_REGION_SETTING, redirect)
            }
        });
    };
}

export function deleteRegionsSetting(region, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        $.ajax({
            url: stringUtil.format(apiEndpoints.REGION_GET_PUT_DEL, regionId),
            method: 'delete',
            headers: apiHelper.getHeader(),
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(region),
            success: function (data, status, xhr) {
                dispatch(loadRegionsSetting(queryString, redirect))
                return dispatch({
                    type: types.DELETE_REGION_SETTING,
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.DELETE_REGION_SETTING, redirect)
            }
        });
    };
}