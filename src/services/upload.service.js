import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const uploadFile = function (data, callback) {
    let path = getApiPath(API.FILES);
    return HttpRequests.postFormData(path, data, callback);
}

export const deleteFile = function (data, callback) {
    let path = getApiPath(API.FILES);
    return HttpRequests.delete(path, data, callback);
}