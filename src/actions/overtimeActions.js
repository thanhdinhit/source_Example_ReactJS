import _ from 'lodash';
import * as types from '../constants/actionTypes';
import * as overtimeDTO from '../services/mapping/overtimeDTO';
import * as OvertimeService from '../services/overtime.service';
import { checkError, catchError, getParams } from '../services/common';
import Promise from 'bluebird';

export function loadMyOvertimes(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["overtimeStatus"] = queryString.overtimeStatus;
        params = _.omitBy(params, _.isUndefined);

        OvertimeService.searchMyOvertimes(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MY_OVERTIMES, redirect);
            }
            let myOvertimes = overtimeDTO.mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_MY_OVERTIMES,
                myOvertimes,
                meta: result.meta
            });
        });
    };
}

export function loadMyOvertime(overtimeId, redirect = '/') {
    return function (dispatch) {
        OvertimeService.loadMyOvertime(overtimeId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MY_OVERTIME, redirect);
            }
            const overtime = overtimeDTO.mapFromOvertimeDTO(result);
            return dispatch({
                type: types.LOAD_MY_OVERTIME,
                overtime
            });
        });
    };
}

export function updateOvertime(overtimeId, overtime, redirect = '/') {
    return function (dispatch) {
        const overtimeDto = overtimeDTO.mapToOvertimeDTO(overtime);
        OvertimeService.updateOvertime(overtimeId, overtimeDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_MY_OVERTIME, redirect);
            }
            const overtime = overtimeDTO.mapFromOvertimeDTO(result);
            return dispatch({
                type: types.UPDATE_MY_OVERTIME,
                overtime
            });
        });
    };
}

export function updateNewOvertime(field, value) {
    return {
        type: types.UPDATE_OVERTIME_DTO,
        field,
        value
    }
}

export function resetOvertimeDto() {
    return {
        type: types.RESET_OVERTIME_DTO,
    }
}

export function submitNewOvertimes(overtime, redirect = '/') {
    return function (dispatch) {
        let allTask = [];
        let errors = [];
        for (const employeeDTO of overtime.employees) {
            let employee = _.cloneDeep(employeeDTO);
            let newOvertime = _.assign(overtime, { employee });
            newOvertime = overtimeDTO.mapToOvertimeDTO(newOvertime)
            let callAjax = new Promise(function (resolve, reject) {
                OvertimeService.submitNewOvertime(newOvertime, function (error, result, status, xhr) {
                    if (error) {
                        reject({ error })
                    }
                    resolve(employee);
                })
            })
            let callAjaxCatchErr = callAjax
                .then(rs => { })
                .catch(e => { errors.push(e) })
            allTask.push(callAjaxCatchErr)
        }

        return Promise.all(allTask)
            .then(function () {
                console.log("errors", errors)
                return dispatch({
                    type: types.ADD_NEW_OVERTIME
                })
            })
    }

}

export function loadTeamOverTime(queryString, redirect = '/') {
    return function (dispatch) {
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
                return catchError(error, dispatch, types.LOAD_TEAM_OVERTIME, redirect);
            }
            const teamOvertime = overtimeDTO.mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_TEAM_OVERTIME,
                teamOvertime,
                meta: result.meta
            });
        });
    };
}

export function updateMemberOvertime(overtimeId, overtime, redirect = '/') {
    return function (dispatch) {
        const overtimeDto = overtimeDTO.mapToOvertimeDTO(overtime);
        OvertimeService.updateMemberOvertime(overtimeId, overtimeDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_MEMBER_OVERTIME, redirect);
            }
            const overtime = overtimeDTO.mapFromOvertimeDTO(result);
            return dispatch({
                type: types.UPDATE_MEMBER_OVERTIME,
                overtime
            });
        });
    };
}

export function loadOvertimeStatistic(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
        params["employee.jobRole.id"] = queryString.jobRoleIds;
        params["employee.group.id"] = queryString.groupIds;
        params["hours"] = queryString.hours;
        params["overtimeFrom"] = queryString.overtimeFrom; //"DATE<=’2018-01-01’&&>=’2017-01-01’"
        params = _.omitBy(params, _.isUndefined);

        OvertimeService.searchOvertimeStatistic(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_OVERTIME_STATISTIC, redirect);
            }
            let overtimeStatistic = overtimeDTO.mapFromStatisticDtos(result.items);
            return dispatch({
                type: types.LOAD_OVERTIME_STATISTIC,
                overtimeStatistic,
                meta: result.meta
            });
        });
    };
}

export function loadOvertimeSetting() {
    return function (dispatch) {
        OvertimeService.getOvertimeSetting(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_OVERTIME_SETTING);
            }
            return dispatch({
                type: types.LOAD_OVERTIME_SETTING,
                overtimeSetting: result.data,
                meta: result.meta
            });
        });
    };
}

