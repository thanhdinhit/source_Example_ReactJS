import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';
import HttpRequest from '../core/utils/HttpRequest';

export const login = function (data, callback) {
    let path = getApiPath(API.LOGIN);
    return HttpRequests.post(path, data, callback);
}

export const resetPassword = function (data, callback) {
    let path = getApiPath(API.RESET_PASSWORD);
    return HttpRequests.put(path, data, callback)
}

export const confirmPassword = function (data, callback) {
    let path = getApiPath(API.CONFIRM_PASSWORD);
    return HttpRequests.post(path, data, callback)
};

export const firstChangePassword = function (data, callback) {
    let path = getApiPath(API.FIRST_CHANGE_PASSWORD);
    return HttpRequest.put(path, data, callback);
};



