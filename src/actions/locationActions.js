import * as types from '../constants/actionTypes';
import { mapFromDto, mapFromDtos, mapToDto } from '../services/mapping/locationDTO'
import { catchError, checkError, getParams } from '../services/common';
// import settingDto from '../services/mapping/settingDto';
import { loading } from './globalAction';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as LocationService from '../services/location.service';

export function loadLocations(queryString, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'regions?' + query,
        //  url:"../apis/region.json",
        let params = getParams(queryString)
        params["name"] = queryString.name ? "%" + queryString.name : undefined;
        params = _.omitBy(params, _.isUndefined);

        LocationService.searchLocations(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_LOCATIONS_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            let locations = mapFromDtos(result.items)
            return dispatch({
                type: types.LOAD_LOCATIONS_SETTING,
                locations,
                meta: result.meta,
                error
            });
        })

    }
}

export function loadLocationsByRegionId(queryString, regionId, redirect = '/') {
    return function (dispatch) {
        // dispatch(loading())
        //   url:  API_URL +  SETTING + 'locations?' + query,
        //  url:"../apis/location.json",
        const params = getParams(queryString)
        params.regionId = regionId

        LocationService.searchLocations(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_LOCATIONS_OF_REGIONID, redirect)
            }
            error = checkError(result, xhr.status);
            let locations = mapFromDtos(result.items)
            return dispatch({
                type: types.LOAD_LOCATIONS_OF_REGIONID,
                locations,
                meta: result.meta,
                error
            });
        })
    };
}


export function loadLocation(queryString, locationId, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'locations?' + query,
        //  url:"../apis/location.json",
        $.ajax({
            url: stringUtil.format(apiEndpoints.LOCATION_GET_PUT_DEL, locationId),
            method: 'get',
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                let rs = mapFromDto(data.data)
                return dispatch({
                    type: types.LOAD_LOCATION_SETTING,
                    location: rs,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_LOCATION_SETTING, redirect)
            }
        });
    };
}

export function addLocation(location, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        let locationDto = mapToDto(location)

        LocationService.addLocation(locationDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.ADD_LOCATION_SETTING, redirect)
            }
            let rs = mapFromDto(result.data);
            return dispatch({
                type: types.ADD_LOCATION_SETTING,
                location: rs
            });
        })
    };
}

export function editLocation(locationId, location, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        let locationDto = mapToDto(location)

        LocationService.editLocation(locationId, locationDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_LOCATION_SETTING, redirect)
            }
            let rs = mapFromDto(result.data);
            return dispatch({
                type: types.EDIT_LOCATION_SETTING,
                location: rs
            });
        })
    };
}

export function deleteLocation(locationId, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'Regions?' + query,
        LocationService.deleteLocation(locationId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_LOCATION_SETTING, redirect)
            }
            return dispatch({
                type: types.DELETE_LOCATION_SETTING,
            });
        })

    };
}

export function updateLocationDto(fieldName, value) {
    return {
        type: types.UPDATE_LOCATION_DTO,
        fieldName,
        value
    }
}

export function updateFullLocationDto(dto) {
    return {
        type: types.UPDATE_FULL_LOCATION_DTO,
        dto
    }
}
