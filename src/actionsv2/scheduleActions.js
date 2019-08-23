import { handleError, getParams } from '../services/common';
import * as ScheduleService from '../services/schedule.service';
import { store } from '../root';
import * as scheduleDTO from '../services/mapping/scheduleDTO';
import _ from 'lodash';
import dateHelper from '../utils/dateHelper'

export function loadAllSchedules(queryString, callback) {
    let params = getParams(queryString);
    params["searchText"] = queryString.searchText;
    params["fromDate"] = queryString.fromDate ? dateHelper.localToUTC(queryString.fromDate) : undefined;
    params["toDate"] = queryString.toDate ? dateHelper.localToUTC(queryString.toDate) : undefined;
    params["contractIds"] = queryString.customer;
    params["locationIds"] = queryString.location;

    params = _.omitBy(params, _.isUndefined);

    ScheduleService.searchSchedulesStatistic(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let schedules = scheduleDTO.mapFromDtos(result.items);
        callback && callback(null, {schedules, meta: result.meta})
    });
}

export function addMultipleScheduleShift(shifts, callback) {
    let promises = [];
    _.each(shifts, (shift) => {
        let promise = new Promise((resolve) => {
            addScheduleShift(shift.scheduleId, shift, (err) => {
                if (err) {
                    resolve({ error: err, shift });
                } else {
                    resolve({ error: null, shift });
                }
            });
        });
        promises.push(promise);
    });
    Promise.all(promises).then(callback);
}

export function addScheduleShift(scheduleId, data, callback) {
    let dto = scheduleDTO.mapToScheduleShiftDto(data);
    ScheduleService.addScheduleShifts(scheduleId, dto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function deleteScheduleShift(scheduleId, shiftId, callback) {
    ScheduleService.deleteScheduleShifts(scheduleId, shiftId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function editScheduleShift(scheduleId, shiftId, shift, callback) {
    let shiftDto = scheduleDTO.mapToShiftDto(shift);
    ScheduleService.editScheduleShift(scheduleId, shiftId, shiftDto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function assignMultipleEmployees(data, callback) {
    let promises = [];
    _.each(data.employees, (employee) => {
        let item = {
            isOvertime: data.isOvertime || false,
            status: data.status,
            employee: { id: employee.id },
            payRateTypeId: data.payRateTypeId,
            comment: data.comment,
            requirementId: data.requirementId
        };
        let promise = new Promise((resolve) => {
            assignEmployee(data.scheduleId, data.scheduleShiftId, item, (err) => {
                if (err) {
                    resolve({ error: err, employee });
                } else {
                    resolve({ error: null, employee });
                }
            });
        });
        promises.push(promise);
    });
    Promise.all(promises).then(callback);
}

export function assignEmployee(scheduleId, shiftId, data, callback) {
    ScheduleService.assignEmployee(scheduleId, shiftId, data, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function notifyAssignment(scheduleId, shiftId, assignmentId, callback) {
    ScheduleService.notifyAssignment(scheduleId, shiftId, assignmentId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function notifyShift(scheduleId, shiftId, callback) {
    ScheduleService.notifyShift(scheduleId, shiftId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function removeAssignment(scheduleId, shiftId, assignmentId, callback) {
    ScheduleService.removeAssignment(scheduleId, shiftId, assignmentId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch))
        }
        callback && callback(null)
    })
}

export function removeAssignmentEmployee(scheduleId, employeeId, data, callback) {
    let dto = scheduleDTO.mapToRemoveAssignmentDto(data);
    ScheduleService.removeAssignmentEmployee(scheduleId, employeeId, dto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch))
        }
        callback && callback(null)
    })
}

export function replaceEmployeeSingleShift(scheduleId, shiftId, assignmentId, data, callback) {
    let dto = scheduleDTO.mapToReplaceDto(data);
    ScheduleService.replaceEmployeeSingleShift(scheduleId, shiftId, assignmentId, dto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null)
    });
}

export function replaceEmployeeMultipleShift(scheduleId, assignmentId, data, callback) {
    let dto = scheduleDTO.mapToReplaceDto(data);
    ScheduleService.replaceEmployeeMultipleShift(scheduleId, assignmentId, dto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null)
    });
}

export function addSchedule(schedule, callback) {
    ScheduleService.addSchedule(schedule, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, result));
        }
        callback && callback(null, result.data);
    });
}

export function notifyScheudle(scheduleId, callback) {
    ScheduleService.notifySchedule(scheduleId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function removeScheduleFromTo(scheduleId, { from, to }, callback) {
    let removeDto = scheduleDTO.mapToDtoRemoveAll({ from, to });
    ScheduleService.removeScheduleFromTo(scheduleId, removeDto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    });
}

export function copyScheduleShifts(scheduleId, data, callback) {
    let dto = scheduleDTO.mapToCopyScheduleShiftsDto(data);
    ScheduleService.copyScheduleShifts(scheduleId, dto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null)
    })
}

export function searchSchedules(queryString, callback) {
    let params = getParams(queryString);
    params["name"] = queryString;
    params["page_size"] = undefined;
    params = _.omitBy(params, _.isUndefined);

    ScheduleService.searchSchedules(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, result));
        }
        let schedules = scheduleDTO.mapFromDtos(result.items);
        callback && callback(null, schedules);
    });
}