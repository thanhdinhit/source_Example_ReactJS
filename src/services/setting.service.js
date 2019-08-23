import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getAvailability = function (callback) {
    let path = getApiPath(API.AVAILABILITY_SETTING);
    return HttpRequests.get(path, callback);
}

export const getWorkingTime = function (callback) {
    let path = getApiPath(API.WORKING_TIME_SETTING);
    return HttpRequests.get(path, callback);
}

export const loadPayRateSetting = function (callback) {
    let path = getApiPath(API.PAY_RATE_SETTING);
    return HttpRequests.get(path, callback);
};