import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchJobSkills = function (data, callback) {
    let path = getApiPath(API.JOB_SKILLS_SEARCH);
    return HttpRequests.post(path, data, callback);
}