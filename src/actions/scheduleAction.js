import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
import * as scheduleDTO from '../services/mapping/scheduleDTO';
import * as groupDTO from '../services/mapping/groupDTO';
import * as shiftTemplateLocationDTO from '../services/mapping/shiftTemplateLocationDTO';
import { loading } from './globalAction';
import * as apis from '../constants/apis';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as ScheduleService from '../services/schedule.service';
import * as GroupService from '../services/group.service';
import _ from 'lodash';
import Promise from 'bluebird';
import dateHelper from '../utils/dateHelper';
import moment from 'moment';

export function resetScheduleShiftViewState() {
    return {
        type: types.RESET_SCHEDULE_SHIFTVIEW_STATE,
    };
}
export function loadAllSchedules(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["name"] = queryString.searchText ? "%" + queryString.searchText : undefined;
        params["fromDate"] = queryString.fromDate ? dateHelper.localToUTC(queryString.fromDate) : undefined;
        params["toDate"] = queryString.toDate ? dateHelper.localToUTC(queryString.toDate) : undefined;
        params["contractIds"] = queryString.customer;
        params["locationIds"] = queryString.location;

        params = _.omitBy(params, _.isUndefined);

        ScheduleService.searchSchedulesStatistic(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_SCHEDULES, redirect);
            }
            let schedules = scheduleDTO.mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_SCHEDULES,
                schedules,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadSchedule(scheduleId, queryEmployeeSchedules, redirect = '/', type = types.LOAD_SCHEDULE) {
    //set queryEmployeeSchedules = null if only need load schedule detail
    //else set queryEmployeeSchedules = { from: , to: }
    return function (dispatch) {
        const params = {
            scheduleId
        }
        ScheduleService.loadSchedule(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect)
            }

            let schedule = scheduleDTO.mapFromScheduleDetail(result.data);
            let contractGroup = schedule.group;

            const subParams = {
                groupId: schedule.group.id
            };

            let loadScheduleSubGroups = new Promise(function (resolve, reject) {
                ScheduleService.loadScheduleSubGroups(subParams, function (subError, subResult, subStatus, subXhr) {
                    if (subError) {
                        reject(subError);
                    }

                    let groupSubs = groupDTO.mapFromDtos(subResult.items);
                    resolve(groupSubs);
                });
            });

            let loadManagedGroups = new Promise(function (resolve, reject) {
                GroupService.loadManagedGroups({ issub: true }, function (manageError, manageResult, manageStatus, manageXhr) {
                    if (manageError) {
                        reject(manageError);
                    }

                    let managedGroups = groupDTO.mapFromDtos(manageResult.items);
                    resolve(managedGroups);
                });
            });

            Promise.all([loadScheduleSubGroups, loadManagedGroups])
                .spread((subGroups, managedGroups) => {
                    dispatch({ type: types.LOAD_SCHEDULE_GROUPS_SUB, subGroups });
                    dispatch({ type: types.LOAD_MANAGED_GROUPS, managedGroups });

                    if (queryEmployeeSchedules) {
                        queryEmployeeSchedules.scheduleId = scheduleId;

                        let mappingData = {
                            schedule: schedule,
                            scheduleSubGroups: subGroups,
                            managedGroups: managedGroups
                        };

                        dispatch(loadEmployeSchedules(queryEmployeeSchedules, mappingData, redirect));

                        return dispatch({
                            type,
                            schedule,
                            contractGroup
                        })
                    }
                    else {
                        return dispatch({
                            type,
                            schedule
                        })
                    }
                });
        })
    }
}

export function loadEmployeSchedules(queryString, mappingData, redirect = "/", type = types.LOAD_EMPLOYEE_SCHEDULES) {
    return function (dispatch) {
        const params = {
            fromDate: dateHelper.localToUTC(queryString.from),
            toDate: dateHelper.localToUTC(queryString.to)
        }
        ScheduleService.loadEmployeeSchedules(queryString.scheduleId, params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect)
            }

            let employeeSchedules = scheduleDTO.mapFromScheduleShifts(result.items, mappingData, queryString);
            return dispatch({
                type,
                employeeSchedules
            })
        })
    }
}

export function loadMySchedule(queryString, redirect = "/", type = types.LOAD_MY_SCHEDULES) {
    return function (dispatch) {
        const params = {
            fromDate: dateHelper.localToUTC(queryString.from),
            toDate: dateHelper.localToUTC(queryString.to)
        };
        ScheduleService.loadMySchedule(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect)
            }

            let mySchedule = scheduleDTO.mapFromMyScheduleDtos(result.items, { from: queryString.from, to: queryString.to });

            return dispatch({
                type,
                mySchedule
            });
        })
    }
}