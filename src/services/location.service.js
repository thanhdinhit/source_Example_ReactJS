import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchLocations = function (data, callback) {
    let path = getApiPath(API.LOCATIONS_SEARCH);
    return HttpRequests.post(path, data, callback);
}

export const addLocation = function (data, callback) {
    let path = getApiPath(API.LOCATIONS);
    return HttpRequests.post(path, data, callback);
}

export const editLocation = function (locationId, data, callback) {
    let path = getApiPath(API.LOCATION, { locationId });
    return HttpRequests.put(path, data, callback);
}

export const deleteLocation = function (locationId, callback) {
    let path = getApiPath(API.LOCATION, { locationId });
    return HttpRequests.delete(path, null, callback);
}