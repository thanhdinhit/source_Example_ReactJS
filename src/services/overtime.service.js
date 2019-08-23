import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadTeamOvertime = function (data, callback) {
    let path = getApiPath(API.TEAM_OVERTIMES);
    return HttpRequests.post(path, data, callback);
};

export const searchMyOvertimes = function (data, callback) {
    let path = getApiPath(API.MY_OVERTIMES);
    return HttpRequests.post(path, data, callback);
};

export const loadMyOvertime = function (overtimeId, callback) {
    let path = getApiPath(API.MY_OVERTIME, { overtimeId });
    return HttpRequests.get(path, callback);
};

export const updateOvertime = function (overtimeId, overtimeDto, callback) {
    let path = getApiPath(API.MY_OVERTIME, { overtimeId });
    return HttpRequests.put(path, overtimeDto, callback);
};

export const submitNewOvertime = function (overtimeDto, callback) {
    let path = getApiPath(API.NEW_OVERTIME);
    return HttpRequests.post(path, overtimeDto, callback);
};

export const updateMemberOvertime = function (overtimeId, overtimeDto, callback) {
    let path = getApiPath(API.MEMBER_OVERTIME, { overtimeId });
    return HttpRequests.put(path, overtimeDto, callback);
};

export const searchOvertimeStatistic = function (data, callback) {
    let path = getApiPath(API.OVERTIME_STATISTIC);
    return HttpRequests.post(path, data, callback);
};

export const getOvertimeSetting = function (callback) {
    let path = getApiPath(API.OVERTIME_SETTING);
    return HttpRequests.get(path, callback);
};

export const getOvertimeRateSetting = function (callback) {
    let path = getApiPath(API.OVERTIME_RATE_SETTING);
    return HttpRequests.get(path, callback);
}