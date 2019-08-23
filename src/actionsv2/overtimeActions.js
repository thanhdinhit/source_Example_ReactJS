import { handleError, getParams } from '../services/common';
import * as OvertimeService from '../services/overtime.service';
import { store } from '../root';
import * as overtimeDTO from '../services/mapping/overtimeDTO';

export function getOvertimeRateSetting(callback) {
    OvertimeService.getOvertimeRateSetting(function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let dto = overtimeDTO.mapFromOvertimeRateSetting(result.items);
        callback && callback(null, dto);
    });
}

export function loadTeamOverTime(queryString, callback) {
    let params = getParams(queryString);
    params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
    params['payRate.id'] = queryString.payRateIds;
    params["location.id"] = queryString.locationIds;
    params["overtimeStatus"] = queryString.overtimeStatus;
    params["overtimeFrom"] = queryString.startDate;
    params["overtimeTo"] = queryString.endDate;
    params = _.omitBy(params, _.isUndefined);

    OvertimeService.loadTeamOvertime(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const teamOvertime = overtimeDTO.mapFromDtos(result.items);
        callback && callback(null, teamOvertime);
    });
}

export function updateMemberOvertime(overtimeId, overtime, callback) {
    const overtimeDto = overtimeDTO.mapToOvertimeDTO(overtime);
    OvertimeService.updateMemberOvertime(overtimeId, overtimeDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const overtime = overtimeDTO.mapFromOvertimeDTO(result);
        callback && callback(null, overtime);
    });
}