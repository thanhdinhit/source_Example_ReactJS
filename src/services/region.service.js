import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchRegions = function (data, callback) {
    let path = getApiPath(API.REGIONS_SEARCH);
    return HttpRequests.post(path, data, callback);
}