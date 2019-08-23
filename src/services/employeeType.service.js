import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getEmployeeTypes = function(callback){
    let path = getApiPath(API.EMPLOYEE_TYPES);
    return HttpRequests.get(path, callback);
}