import * as types from '../constants/actionTypes';
import { checkError, catchError, canvasToImage, getParams, removeUndefinedParams, next } from '../services/common';
import { mapToDto, mapFromDto, mapFromDtos } from '../services/mapping/groupDTO';
import { loading } from './globalAction';
import update from 'react-addons-update';
import * as apis from '../constants/apis';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as GroupService from '../services/group.service';
import { getUrlPath } from '../core/utils/RoutesUtils';
import { URL } from '../core/common/app.routes';

export function loadAllGroup(queryString, type = types.LOAD_ALL_GROUP, redirect = '/', ) {
    return function (dispatch) {
        let params = getParams(queryString);
        params['name'] = queryString.name ? "%" + queryString.name : undefined;
        params['state.id'] = queryString.stateIds;
        params['supervisorId'] = queryString.supervisorIds;
        params['parentId'] = queryString.parentIds;

        params = removeUndefinedParams(params);
        GroupService.searchGroups(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }

            let groups = mapFromDtos(result.items);
            return dispatch({
                type: type,
                groups,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadAllBaseGroup(redirect = '/') {
    return function (dispatch) {
        GroupService.loadAllBaseGroup(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_BASE_GROUP, redirect);
            }
            let baseGroups = mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_ALL_BASE_GROUP,
                baseGroups,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadGroup(groupId, redirect = '/', type = types.LOAD_GROUP) {
    return function (dispatch) {
        dispatch(loading());
        const params = {
            groupId
        };
        GroupService.loadGroup(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let group = mapFromDto(result.data);
            return dispatch({
                type: type,
                group,
                meta: group.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function addGroup(groupDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading());
        const group = mapToDto(groupDto);
        GroupService.addGroup(group, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.ADD_GROUP, redirect);
            }
            dispatch(loadAllGroup(queryString, redirect));
            dispatch(loadAllBaseGroup());
            return dispatch({
                type: types.ADD_GROUP
            });
        });
    }
}

export function editGroup(groupDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading());
        const group = mapToDto(groupDto);
        const params = {
            groupId: groupDto.id
        };
        GroupService.editGroup(group, params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_GROUP, redirect);
            }
            dispatch(loadAllGroup(queryString, redirect));
            dispatch(loadAllBaseGroup());
            return dispatch({
                type: types.EDIT_GROUP
            });
        });
    }
}

export function deleteGroup(groupDto, queryString, redirect = '/') {
    return function (dispatch) {
        const params = {
            groupId: groupDto.id
        };
        GroupService.deleteGroup(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_GROUP, redirect);
            }
            dispatch(loadAllGroup(queryString, redirect));
            dispatch(loadAllBaseGroup());
            return dispatch({
                type: types.DELETE_GROUP
            });
        });
    }
}


export function loadSupervisors(redirect = '/') {
    return function (dispatch) {
        GroupService.loadSupervisors(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_SUPERVISOR, redirect);
            }
            let supervisors = result.items.map(x => x.data);
            return dispatch({
                type: types.LOAD_ALL_SUPERVISOR,
                supervisors
            });
        });
    }
}

export function loadGroupSubs(groupId, redirect = '/') {
    return function (dispatch) {
        const params = {
            groupId: groupId
        };

        GroupService.loadGroupSubs(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_GROUPS_SUB, redirect);
            }

            let groupSubs = mapFromDtos(result.items);

            return dispatch({
                type: types.LOAD_GROUPS_SUB,
                groupSubs,
                error: checkError(result, xhr.status)
            });
        });
    }
}

export function loadManagedGroups(issub = false, redirect = '/') {
    return function (dispatch) {
        let params = {
            issub
        }
        GroupService.loadManagedGroups(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MANAGED_GROUPS, redirect);
            }

            let managedGroups = mapFromDtos(result.items);

            return dispatch({
                type: types.LOAD_MANAGED_GROUPS,
                managedGroups,
                error: checkError(result, xhr.status)
            });
        });
    }
}