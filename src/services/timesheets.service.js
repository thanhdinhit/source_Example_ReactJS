import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';
import HttpRequest from '../core/utils/HttpRequest';

export const loadEmployeeTimesheets = function (groupId, data, callback) {
    let path = getApiPath(API.TIMESHEETS_TEAM_GROUP, { groupId });
    return HttpRequests.post(path, data, callback);
};

export const loadGroupTimesheets = function (data, callback) {
    let path = getApiPath(API.TIMESHEETS_TEAM_SUMMARY);
    return HttpRequests.post(path, data, callback);
};

export const loadTimesheetTypes = function (callback) {
    let path = getApiPath(API.TIMESHEET_TYPES);
    return HttpRequests.get(path, callback);
};

export const loadTimesheetSetting = function (callback) {
    let path = getApiPath(API.TIMESHEET_SETTING);
    return HttpRequests.get(path, callback);
};

export const searchMyTimesheets = function (data, callback) {
    let path = getApiPath(API.SEARCH_MY_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};

export const searchGroupTeamTimesheetHistories = function (groupId, submitterId, data, callback) {
    let path = getApiPath(API.GROUP_TEAM_TIMESHEET_HISTORY, { groupId, submitterId });
    return HttpRequests.post(path, data, callback);
}

export const searchEmployeeTimesheetHistories = function (groupId, employeeId, data, callback) {
    let path = getApiPath(API.EMPLOYEE_TIMESHEET_HISTORY, { groupId, employeeId });
    return HttpRequests.post(path, data, callback);
}

export const loadTeamTimesheets = function (data, callback) {
    let path = getApiPath(API.MEMBER_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};

export const updateMemberTimesheet = function (timesheetId, data, callback) {
    let path = getApiPath(API.MEMBER_TIMESHEET, { timesheetId });
    return HttpRequests.put(path, data, callback);
};

export const approveTeamTimesheets = function (data, callback) {
    let path = getApiPath(API.APPROVE_MEMBER_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};

export const submitTeamTimesheets = function (data, callback) {
    let path = getApiPath(API.TIMESHEETS_TEAM_SUBMIT);
    return HttpRequest.post(path, data, callback);
};

export const getGroupTimesheetStatistic = function (callback) {
    let path = getApiPath(API.TIMESHEETS_TEAM_STATISTIC);
    return HttpRequest.get(path, callback);
}

export const getGroupStatusTimesheet = function (callback) {
    let path = getApiPath(API.SUBMIT_TEAM_TIMESHEETS);
    return HttpRequest.get(path, callback);
}

export const loadAllPendingsTimesheets = function (data, callback) {
    let path = getApiPath(API.LOAD_ALL_PENDINGS_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};

export const submitAllTeamTimesheets = function (data, callback) {
    let path = getApiPath(API.APPROVE_ALL_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};

export const loadEmployeeTimesheetHistories = function (data, callback) {
    let path = getApiPath(API.MEMBER_TIMESHEET_HISTORIES);
    return HttpRequests.post(path, data, callback);
};

export const loadMemberTimesheetHistory = function (data, callback) {
    let path = getApiPath(API.MEMBER_TIMESHEET_HISTORY);
    return HttpRequests.post(path, data, callback);
};
export const loadGroupsTimesheetsHistory = function (data, callback) {
    let path = getApiPath(API.GROUPS_TIMESHEET_HISTORY);
    return HttpRequests.post(path, data, callback);
};
export const loadsubmittedGroupsTimesheetsHistory = function (groupId, data, callback) {
    let path = getApiPath(API.LOAD_APPROVER_GROUPS_TIMESHEET_HISTORY, { groupId });
    return HttpRequests.post(path, data, callback);
};
export const approveAllTimesheets = function (data, callback) {
    let path = getApiPath(API.APPROVE_ALL_TIMESHEETS);
    return HttpRequests.post(path, data, callback);
};
export const loadMemberTimesheetDetail = function (timesheetId, callback) {
    let path = getApiPath(API.MEMBER_TIMESHEET, { timesheetId });
    return HttpRequest.get(path, callback);
}