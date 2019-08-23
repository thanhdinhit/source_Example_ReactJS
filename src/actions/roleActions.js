import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
import { mapFromDtos, mapToDto, mapFromDto } from '../services/mapping/roleDTO';
import * as accessRightDTO from '../services/mapping/accessRightDTO';
import { browserHistory } from 'react-router';
import * as apiEndpoints from '../constants/apiEndpoints'
import * as routeConfig from '../constants/routeConfig'
import * as apiHelper from '../utils/apiHelper';
import stringUtil from '../utils/stringUtil';
import { loading } from './globalAction';
import * as RoleService from '../services/role.service';

export function loadRoles(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString)

        RoleService.searchRoles(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ROLES, redirect)
            }
            error = checkError(result, xhr.status);
            return dispatch({
                type: types.LOAD_ROLES,
                roles: mapFromDtos(result.items),
                meta: result.meta,
                error
            });
        });
    }
}

export function addRole(role, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        let dto = mapToDto(role);
        $.ajax({
            url: apiEndpoints.ROLES_POST,
            method: 'post',
            data: JSON.stringify(dto),
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.ADD_ROLE,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.ADD_ROLE, redirect)
            }
        });
    }
}


export function loadRole(roleId, redirect = '/', type = types.LOAD_ROLE_DETAIL) {
    return function (dispatch) {
        dispatch(loading())
        $.ajax({
            url: stringUtil.format(apiEndpoints.ROLES_GET_PUT_DEL, roleId),
            method: 'get',
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                let role = mapFromDto(data.data)
                return dispatch({
                    type: type,
                    role: role,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, type, redirect)
            }
        });
    }
}

export function editRole(role, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        let dto = mapToDto(role);
        $.ajax({
            url: stringUtil.format(apiEndpoints.ROLES_GET_PUT_DEL, dto.id),
            method: 'put',
            data: JSON.stringify(dto),
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                dispatch(loadRoles(queryString, redirect))
                return dispatch({
                    type: types.EDIT_ROLE,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_ROLE, redirect)
            }
        });
    }
}
export function deleteRole(roleId, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        $.ajax({
            url: stringUtil.format(apiEndpoints.ROLES_GET_PUT_DEL, roleId),
            method: 'delete',
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                dispatch(loadRoles({}, redirect))
                return dispatch({
                    type: types.DELETE_ROLE,
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.DELETE_ROLE, redirect)
            }
        });
    }
}


export function loadAllAccessRights(redirect = '/', type = types.LOAD_ACCESS_RIGHTS) {
    return function (dispatch) {
        dispatch(loading())
        $.ajax({
            url: apiEndpoints.ACCESSRIGHTS_GET,
            method: 'get',
            contentType: 'application/json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                let allAccessRights = accessRightDTO.mapFromDtos(data.items)
                return dispatch({
                    type: type,
                    allAccessRights,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, type, redirect)
            }
        });
    }
}

export function updateRoleDTO(fieldName, value) {
    return {
        type: types.UPDATE_ROLE_DTO,
        fieldName,
        value
    }
}