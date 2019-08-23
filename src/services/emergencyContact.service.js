import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const getEmergencyContactsEmployee = function (employeeId, callback) {
    let path = getApiPath(API.EMERGENCY_CONTACTS_EMPLOYEE, { employeeId });
    return HttpRequests.get(path, callback);
};

export const addEmergencyContactEmployee = function (employeeId, emergencyContacts, callback) {
    let path = getApiPath(API.EMERGENCY_CONTACTS_EMPLOYEE, { employeeId });
    return HttpRequests.post(path, emergencyContacts, callback);
};

export const deleteEmergencyContactEmployee = function (employeeId, callback) {
    let path = getApiPath(API.EMERGENCY_CONTACTS_EMPLOYEE, { employeeId });
    return HttpRequests.delete(path, null, callback);
};

export const getEmergencyContactsMyProfile = function (callback) {
    let path = getApiPath(API.MY_PROFILE_EMERGENCY_CONTACTS);
    return HttpRequests.get(path, callback);
};

export const addEmergencyContactMyProfile = function (emergencyContact, callback) {
    let path = getApiPath(API.MY_PROFILE_EMERGENCY_CONTACTS);
    return HttpRequests.post(path, emergencyContact, callback);
};

export const deleteEmergencyContactMyProfile = function (emergencyContactId, callback) {
    let path = getApiPath(API.EMERGENCY_CONTACT_PROFILE, { emergencyContactId });
    return HttpRequests.delete(path, null, callback);
};