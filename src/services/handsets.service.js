import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchHandsets = function (data, callback) {
    let path = getApiPath(API.HANDSETS_SEARCH);
    return HttpRequests.post(path, data, callback);
};

export const returnHandset = function (data, callback) {
    let path = getApiPath(API.HANDSET, { handsetId: data.id });
    return HttpRequests.put(path, data, callback);
};

export const getHandsetTypes = function (callback) {
    let path = getApiPath(API.HANDSET_TYPES);
    return HttpRequests.get(path, callback);
};

export const assignedHandset = function (handset, callback) {
    let path = getApiPath(API.HANDSET_PROFILE, { handsetId: handset.id });
    return HttpRequests.put(path, handset, callback);
};

export const loadHandsetSummary = function (data, callback) {
    let path = getApiPath(API.HANDSET_SUMMARY);
    return HttpRequests.post(path, data, callback);
}

export const loadStoreLocs = function (callback) {
    let path = getApiPath(API.STORE_LOCS);
    return HttpRequests.get(path, callback);
}

export const addHandsetType = function (data, callback) {
    let path = getApiPath(API.HANDSET_TYPES);
    return HttpRequests.post(path, data, callback);
}

export const addHandset = function (data, callback) {
    let path = getApiPath(API.HANDSETS);
    return HttpRequests.post(path, data, callback);
}

export const editHandsetType = function (handsetTypeId, data, callback) {
    let path = getApiPath(API.HANDSET_TYPE, { handsetTypeId });
    return HttpRequests.put(path, data, callback);
}

export const deleteHandset = function (handsetId, callback) {
    let path = getApiPath(API.HANDSET, { handsetId });
    return HttpRequests.delete(path, null, callback);
}

export const loadHandset = function (handsetId, callback) {
    let path = getApiPath(API.HANDSET, { handsetId });
    return HttpRequests.get(path, callback);
}

export const transferHandsets = function (data, callback) {
    let path = getApiPath(API.TRANSFER_HANDSETS);
    return HttpRequests.put(path, data, callback);
}

export const editHandset = function (handsetId, data, callback) {
    let path = getApiPath(API.HANDSET, { handsetId });
    return HttpRequests.put(path, data, callback);
}

export const assignHandsets = function (data, callback) {
    let path = getApiPath(API.ASSIGN_HANDSETS);
    return HttpRequests.put(path, data, callback);
}