import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getPersonalSettings = function (callback) {
    const path = getApiPath(API.COMMONS_PERSONAL_SETTINGS);
    return HttpRequests.get(path, callback);
};

export const getDelegateLeave = function (callback) {
    const path = getApiPath(API.DELEGATE_LEAVE);
    return HttpRequests.get(path, callback);
};

export const getDelegateTimeClock = function (callback) {
    const path = getApiPath(API.DELEGATE_TIME_CLOCK);
    return HttpRequests.get(path, callback);
};

export const getDelegateOvertime = function (callback) {
    const path = getApiPath(API.DELEGATE_OVERTIME);
    return HttpRequests.get(path, callback);
};

export const editCommonsPersonalSettings = function (data, callback) {
    const path = getApiPath(API.COMMONS_PERSONAL_SETTINGS);
    return HttpRequests.put(path, data, callback);
};

export const editDelegateLeave = function (id, data, callback) {
    const path = getApiPath(API.EDIT_DELEGATE_LEAVE, { id });
    return HttpRequests.put(path, data, callback);
};

export const editDelegateTimeClock = function (id, data, callback) {
    const path = getApiPath(API.EDIT_DELEGATE_TIME_CLOCK, { id });
    return HttpRequests.put(path, data, callback);
};

export const editDelegateOvertime = function (data, callback) {
    const path = getApiPath(API.DELEGATE_OVERTIME);
    return HttpRequests.put(path, data, callback);
};