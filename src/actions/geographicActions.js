import * as types from '../constants/actionTypes';
import { checkError, catchError, canvasToImage, getParams, removeUndefinedParams, next } from '../services/common';
import { mapToDto, mapFromDto, mapFromDtos } from '../services/mapping/geographicDTO';
import update from 'react-addons-update';
import * as apis from '../constants/apis';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as GeographicService from '../services/geographic.service';
import { getUrlPath } from '../core/utils/RoutesUtils';
import { URL } from '../core/common/app.routes';

export function loadCities(queryString, redirect = '/') {
    return function (dispatch) {
        GeographicService.loadCities(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_CITIES, redirect);
            }
            let cities = mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_CITIES,
                cities,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadDistricts(queryString, redirect = '/') {
    return function (dispatch) {
        GeographicService.loadDistricts(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_CITIES, redirect);
            }
            let districts = mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_DISTRICTS,
                districts,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadStates(redirect = '/') {
    return function (dispatch) {
        GeographicService.getStates( function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_STATE, redirect);
            }
            let states = mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_ALL_STATE,
                states,
                meta: states.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

