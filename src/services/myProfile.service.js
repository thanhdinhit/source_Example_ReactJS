import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';


export const editMyProfile = function (data, callback) {
    let path = getApiPath(API.MY_PROFILE);
    return HttpRequests.put(path, data, callback);
}
export const editMyProfileContactDetail = function (data, callback) {
    let path = getApiPath(API.MY_PROFILE_CONTACTDETAIL);
    return HttpRequests.put(path, data, callback);
}
export const loadMyProfile = function (callback) {
    let path = getApiPath(API.MY_PROFILE);
    return HttpRequests.get(path, callback);
}
export const loadMyProfileTime = function (callback) {
    let path = getApiPath(API.MY_PROFILE_TIME);
    return HttpRequests.get(path, callback);
}
export const loadMyProfileAttachment = function (callback) {
    let path = getApiPath(API.MY_PROFILE_ATTACHMENT);
    return HttpRequests.get(path, callback);
}
export const loadMyProfileJobRoleSkills = function (callback) {
    let path = getApiPath(API.MY_PROFILE_JOBROLE_SKILLS);
    return HttpRequests.get(path, callback);
}
export const loadMyProfileContactDetail = function (callback) {
    let path = getApiPath(API.MY_PROFILE_CONTACTDETAIL);
    return HttpRequests.get(path, callback);
};
export const loadMyProfileUser = function (employeeId, callback) {
    let path = getApiPath(API.MY_PROFILE_USER, { employeeId });
    return HttpRequests.get(path, callback);
};
export const getMyApprovers = function (callback) {
    let path = getApiPath(API.MY_APPROVERS);
    return HttpRequests.get(path, callback);
};