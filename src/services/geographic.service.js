import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadCities = function (callback) {
    let path = getApiPath(API.CITIES);
    return HttpRequests.get(path, callback);
}

export const loadDistricts = function (callback) {
    let path = getApiPath(API.DISTRICTS);
    return HttpRequests.get(path, callback);
}

export const getStates = function (callback) {
    let path = getApiPath(API.STATES);
    return HttpRequests.get(path, callback);
}
