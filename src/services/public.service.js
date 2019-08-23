import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadGeneralSetting  = function (callback) {
    let path = getApiPath(API.GENERAL_CONFIGS);
    return HttpRequests.get(path, callback);
};