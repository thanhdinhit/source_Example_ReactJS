import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchJobRoles = function (data, callback) {
    let path = getApiPath(API.JOB_ROLES_SEARCH);
    return HttpRequests.post(path, data, callback);
};

export const getJobRole = function (jobRoleId, callback) {
    let path = getApiPath(API.JOB_ROLE, { jobRoleId });
    return HttpRequests.get(path, callback);
}

export const addJobRole = function (jobRole, callback) {
    let path = getApiPath(API.JOB_ROLES);
    return HttpRequests.post(path, jobRole, callback);
};

export const editJobRole = function (jobRole, callback) {
    let path = getApiPath(API.JOB_ROLE, { jobRoleId: jobRole.id });
    return HttpRequests.put(path, jobRole, callback);
};

export const deleteJobRole = function (jobRoleId, callback) {
    let path = getApiPath(API.JOB_ROLE, { jobRoleId });
    return HttpRequests.delete(path, {}, callback);
};