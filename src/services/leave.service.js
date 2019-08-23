import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchMyLeaves = function (data, callback) {
    let path = getApiPath(API.MY_LEAVES);
    return HttpRequests.post(path, data, callback);
};

export const searchEmployeeLeaves = function (data, callback) {
    let path = getApiPath(API.EMPLOYEE_LEAVES);
    return HttpRequests.post(path, data, callback);
};

export const loadLeaveTypes = function (callback) {
    let path = getApiPath(API.LEAVETYPES_CONFIG);
    return HttpRequests.get(path, callback);
}

export const loadLeave = function (leaveId, callback) {
    let path = getApiPath(API.LEAVE_DETAIL, { leaveId });
    return HttpRequests.get(path, callback);
};

export const updateLeave = function (leaveId, leaveDto, callback) {
    let path = getApiPath(API.LEAVE_DETAIL, { leaveId });
    return HttpRequests.put(path, leaveDto, callback);
};

export const calculateHours = function (leave, callback) {
    let path = getApiPath(API.CALCULATE_HOURS);
    return HttpRequests.post(path, leave, callback);
};

export const submitNewMyleave = function (leaveDto, callback) {
    let path = getApiPath(API.MY_LEAVE);
    return HttpRequests.post(path, leaveDto, callback);
};

export const getMyLeaveBalances = function (callback) {
    let path = getApiPath(API.MY_LEAVE_BALANCES);
    return HttpRequests.get(path, callback);
};

export const loadEmployeeLeaveBalances = function (data, callback) {
    let path = getApiPath(API.EMPLOYEE_LEAVE_BALANCES);
    return HttpRequests.post(path, data, callback);
};

export const updateEmployeeLeave = function (leaveId, leaveDto, callback) {
    let path = getApiPath(API.MEMBER_LEAVE, { leaveId });
    return HttpRequests.put(path, leaveDto, callback);
};

export const loadEmployeeLeave = function (leaveId, callback) {
    let path = getApiPath(API.MEMBER_LEAVE, { leaveId });
    return HttpRequests.get(path, callback);
};