import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchEmployees = function (data, callback) {
    let path = getApiPath(API.EMPLOYEES_SEARCH);
    return HttpRequests.post(path, data, callback);
};
export const addEmployee = function (data, callback) {
    let path = getApiPath(API.EMPLOYEES);
    return HttpRequests.post(path, data, callback);
};
export const editEmployee = function (data, params, callback) {
    let path = getApiPath(API.EMPLOYEE_GET_PUT_DEL, params);
    return HttpRequests.put(path, data, callback);
};
export const deleteEmployee = function (params, callback) {
    let path = getApiPath(API.EMPLOYEE_GET_PUT_DEL, params);
    return HttpRequests.delete(path, {}, callback);
};
export const loadEmployee = function (params, callback) {
    let path = getApiPath(API.EMPLOYEE_GET_PUT_DEL, params);
    return HttpRequests.get(path, callback);
};
export const loadAllBaseEmployee = function (callback) {
    let path = getApiPath(API.EMPLOYEES_BASE);
    return HttpRequests.get(path, callback);
};

export const getMembers = function (callback) {
    let path = getApiPath(API.MEMBERS);
    return HttpRequests.get(path, callback);
};

export const editEmployeeContactDetail = function (employeeId, contactDetails, callback) {
    let path = getApiPath(API.EMPLOYEE_CONTACT_DETAILS, { employeeId });
    return HttpRequests.put(path, contactDetails, callback);
};

export const editEmployeeJob = function (employeeId, jobDTO, callback) {
    let path = getApiPath(API.EMPLOYEE_JOB, { employeeId });
    return HttpRequests.put(path, jobDTO, callback);
};
export const editEmployeeTime = function (employeeId, time, callback) {
    let path = getApiPath(API.EMPLOYEE_TIME, { employeeId });
    return HttpRequests.put(path, time, callback);
};
export const editEmployeePayRate = function (employeeId, payRate, callback) {
    let path = getApiPath(API.EMPLOYEE_PAY_RATE, { employeeId });
    return HttpRequests.put(path, payRate, callback);
};

export const importEmployee = function (data, callback) {
    let path = getApiPath(API.IMPORT_EMPLOYEE);
    return HttpRequests.post(path, data, callback);
};

export const exportEmployees = function (columns, callback) {
    let path = getApiPath(API.EXPORT_EMPLOYEES);
    return HttpRequests.post(path, columns, callback);
};

export const getEmployeeHandsets = function (employeeId, callback) {
    let path = getApiPath(API.EMPLOYEE_HANDSETS, { employeeId });
    return HttpRequests.get(path, callback);
};

export const getEmployeeTransfers = function (employeeId, callback) {
    let path = getApiPath(API.EMPLOYEE_TRANSFERS, { employeeId });
    return HttpRequests.get(path, callback);
};

export const transferEmployee = function (employeeId, transferInfo, callback) {
    let path = getApiPath(API.EMPLOYEE_TRANSFERS, { employeeId });
    return HttpRequests.post(path, transferInfo, callback);
}

export const loadEmployeeAssigns = function (data, callback) {
    let path = getApiPath(API.EMPLOYEE_ASSIGN_MENTS_SEARCH);
    return HttpRequests.post(path, data, callback);
}

export const editEmployeeOrganization = function (groupId, data, callback) {
    let path = getApiPath(API.EDIT_GROUP_ORGANIZATION, {groupId});
    return HttpRequests.put(path, data, callback);
}

export const addNewEmployeeOrganization = function (data, callback) {
    let path = getApiPath(API.ADD_NEW_GROUP_ORGANIZATION);
    return HttpRequests.post(path, data, callback);
}

export const searchAssignmentAvailability = function (data, callback) {
    let path = getApiPath(API.SEARCH_ASSIGNMENT_AVAILABILITY);
    return HttpRequests.post(path, data, callback);
}

export const searchReplacementAvailability = function (data, callback) {
    let path = getApiPath(API.SEARCH_REPLACEMENT_AVAILABILITY);
    return HttpRequests.post(path, data, callback);
}

export const searchResourcePool = function (data, callback) {
    let path = getApiPath(API.SEARCH_RESOURCE_POOL, data);
    return HttpRequests.get(path, callback);
}