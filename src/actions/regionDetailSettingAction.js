import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
// import settingDto from '../services/mapping/settingDto';
import { loading } from './globalAction'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
export function loadRegionDetailSetting(queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'locations?' + query,
        //  url:"../apis/location.json",
        let params = getParams(queryString)
        let query = $.param(params);
        $.ajax({
            url:  apiEndpoints.EMPLOYEES_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.LOAD_REGION_DETAIL_SETTING,
                    locations: data.items,
                    meta: data.meta,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_REGION_DETAIL_SETTING, redirect)
            }
        });
    };
}

export function loadLocationsByRegionId(queryString, regionId, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'locations?' + query,
        //  url:"../apis/location.json",
        let params = getParams(queryString)
        params.regionIds = regionId

        let query = $.param(params);
        $.ajax({
            url:  apiEndpoints.LOCATIONS_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.LOAD_LOCATIONS_OF_REGIONID,
                    locations: data.items,
                    meta: data.meta,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_LOCATIONS_OF_REGIONID, redirect)
            }
        });
    };
}

export function addLocationsSetting(location, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'Locations?' + query,
        $.ajax({
            url:  apiEndpoints.LOCATIONS_POST,
            method: 'post',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            data: JSON.stringify(location),
            success: function (data, status, xhr) {
                dispatch(loadRegionDetailSetting(curEmp, queryString, redirect))
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.ADD_LOCATION_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.ADD_LOCATION_SETTING, redirect)
            }
        });
    };
}