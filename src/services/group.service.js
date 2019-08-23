import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchGroups = function (data, callback) {
    let path = getApiPath(API.GROUPS_SEARCH);
    return HttpRequests.post(path, data, callback);
}

export const addGroup = function (data, callback) {
    let path = getApiPath(API.GROUPS);
    return HttpRequests.post(path, data, callback);
}

export const editGroup = function (data, params, callback) {
    let path = getApiPath(API.GROUP, params);
    return HttpRequests.put(path, data, callback);
}

export const deleteGroup = function (params, callback) {
    let path = getApiPath(API.GROUP, params);
    return HttpRequests.delete(path, {}, callback);
}

export const loadGroup = function (params, callback) {
    let path = getApiPath(API.GROUP, params);
    return HttpRequests.get(path, callback);
}

export const loadAllBaseGroup = function (callback) {
    let path = getApiPath(API.GROUPS_SEARCH);
    return HttpRequests.post(path, {}, callback);
}

export const loadSupervisors = function (callback) {
    let path = getApiPath(API.SUPERVISORS);
    return HttpRequests.get(path, callback);
}

export const loadGroupSubs = function (params, callback) {
    let path = getApiPath(API.GROUP_ASSIGN_EMPLOYEE, params);
    return HttpRequests.get(path, callback);
}

export const loadManagedGroups = function (params, callback) {
    let path = getApiPath(API.MANAGED_GROUPS,params);
    return HttpRequests.get(path, callback);
}

export const loadManageGroups = function (stringParams, callback) {
    let path = getApiPath(API.MANAGE_GROUPS) + stringParams;
    return HttpRequests.get(path, callback);
}