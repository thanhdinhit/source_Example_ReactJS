import * as types from '../constants/actionTypes';
import { catchError, checkError } from '../services/common';
import { mapFromDto, mapToDto } from '../services/mapping/userRoleSettingDto';
import { loading } from './globalAction'
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as RoleService from '../services/role.service';

export function loadUserRoleOptions(queryString, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'skills?' + query,
        const params = {
            sort_by: queryString.sort_by,
            order_by: queryString.order_by,
        };
        RoleService.searchRoles(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_USERROLES_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            let userRoles = mapFromDto(result.items)
            return dispatch({
                type: types.LOAD_USERROLES_SETTING,
                userRoles,
                error
            });
        });
    }
}