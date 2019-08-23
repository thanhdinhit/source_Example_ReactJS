import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getTerminations = function (employeeId, callback) {
    let path = getApiPath(API.TERMINATIONS, { employeeId });
    return HttpRequests.get(path, callback);
};

export const termination = function (employeeId, terminations, callback) {
    let path = getApiPath(API.TERMINATIONS, { employeeId });
    return HttpRequests.post(path, terminations, callback);
};

export const getTerminationReason = function (callback) {
    let path = getApiPath(API.TERMINATION_REASON);
    return HttpRequests.get(path, callback);
};

export const rejoin = function (employeeId, rejoin, callback) {
    let path = getApiPath(API.REJOIN, { employeeId });
    return HttpRequests.post(path, rejoin, callback);
};