import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getCurrentStatus = function (callback) {
    let path = getApiPath(API.TIMECLOCK);
    return HttpRequests.get(path, callback);
}

export const clockTime = function(data, callback){
    let path = getApiPath(API.TIMECLOCK);
    return HttpRequests.post(path, data, callback)
}


