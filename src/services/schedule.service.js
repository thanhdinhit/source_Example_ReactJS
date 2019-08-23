import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';
import HttpRequest from '../core/utils/HttpRequest';

export const searchSchedulesStatistic = function (data, callback) {
    let path = getApiPath(API.SCHEDULE_STATISTIC);
    return HttpRequests.post(path, data, callback);
};

export const loadSchedule = function (params, callback) {
    let path = getApiPath(API.SCHEDULE, params);
    return HttpRequests.get(path, callback);
};

export const loadEmployeeSchedules = function (scheduleId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFTS_SEARCH, { scheduleId });
    return HttpRequests.post(path, data, callback);
};

export const assignEmployee = function (scheduleId, shiftId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFT_ASSIGNMENTS, { scheduleId, shiftId });
    return HttpRequests.post(path, data, callback);
};

export const loadMySchedule = function (data, callback) {
    let path = getApiPath(API.MYSCHEDULES_SEARCH);
    return HttpRequests.post(path, data, callback);
};

export const loadScheduleSubGroups = function (params, callback) {
    let path = getApiPath(API.GROUP_ASSIGN_EMPLOYEE, params);
    return HttpRequests.get(path, callback);
};

export const addScheduleShifts = function (scheduleId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFTS, { scheduleId });
    return HttpRequest.post(path, data, callback);
};

export const deleteScheduleShifts = function (scheduleId, shiftId, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFT, { scheduleId, shiftId });
    return HttpRequest.delete(path, {}, callback);
};

export const editScheduleShift = function (scheduleId, shiftId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFT, { scheduleId, shiftId });
    return HttpRequest.put(path, data, callback);
};

export const notifyAssignment = function (scheduleId, shiftId, assignmentId, callback) {
    let path = getApiPath(API.SCHEDULE_ASSIGNMENT_NOTIFY, { scheduleId, shiftId, assignmentId });
    return HttpRequest.patch(path, {}, callback);
};

export const notifySchedule = function (scheduleId, callback) {
    let path = getApiPath(API.SCHEDULE_NOTIFY, { scheduleId });
    return HttpRequest.patch(path, {}, callback);
};

export const notifyShift = function (scheduleId, shiftId, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFT_NOTIFY, { scheduleId, shiftId });
    return HttpRequest.patch(path, {}, callback);
};

export const removeAssignmentEmployee = function (scheduleId, employeeId, data, callback) {
    let path = getApiPath(API.SCHEDULE_EMPLOYEE_REMOVE, { scheduleId, employeeId });
    return HttpRequest.delete(path, data, callback);
}

export const removeAssignment = function (scheduleId, shiftId, assignmentId, cb) {
    let path = getApiPath(API.SCHEDULE_SHIFT_ASSIGNMENT, { scheduleId, shiftId, assignmentId });
    return HttpRequest.delete(path, {}, cb)
};

export const removeScheduleFromTo = function (scheduleId, query, callback) {
    let path = getApiPath(API.SCHEDULE_ASSIGNMENTS_REMOVE, { scheduleId });
    return HttpRequest.delete(path, query, callback);
};

export const replaceEmployeeSingleShift = function (scheduleId, shiftId, assignmentId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFT_ASSIGNMENT_REPLACE, { scheduleId, shiftId, assignmentId });
    return HttpRequest.patch(path, data, callback);
}

export const replaceEmployeeMultipleShift = function (scheduleId, assignmentId, data, callback) {
    let path = getApiPath(API.SCHEDULE_ASSIGNMENT_REPLACE, { scheduleId, assignmentId });
    return HttpRequest.patch(path, data, callback);
}

export const copyScheduleShifts = function (scheduleId, data, callback) {
    let path = getApiPath(API.SCHEDULE_SHIFTS_COPY, { scheduleId });
    return HttpRequest.post(path, data, callback);
}

export const addSchedule = function (data, callback) {
    let path = getApiPath(API.SCHEDULES);
    return HttpRequest.post(path, data, callback);
};

export const searchSchedules = function (data, callback) {
    let path = getApiPath(API.SCHEDULES_SEARCH);
    return HttpRequests.post(path, data, callback);
};