import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getAllGroupType = function (callback) {
    let path = getApiPath(API.GROUP_TYPES);
    return HttpRequests.get(path, callback);
}

export const addGroupType = function(data, callback){
    let path = getApiPath(API.GROUP_TYPES);
    return HttpRequests.post(path, data, callback);
}

export const editGroupType = function(data, params, callback){
    let path = getApiPath(API.GROUP_TYPE, params);
    return HttpRequests.put(path, data, callback);
}

export const deleteGroupType = function(params, callback){
    let path = getApiPath(API.GROUP_TYPE, params);
    return HttpRequests.delete(path, {}, callback);
}

export const loadGroupType = function(params, callback){
    let path = getApiPath(API.GROUP_TYPE, params);
    return HttpRequests.get(path, callback);
}