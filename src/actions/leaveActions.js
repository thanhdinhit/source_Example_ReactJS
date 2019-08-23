import * as types from '../constants/actionTypes';
import * as leaveDTO from '../services/mapping/leaveDTO';
import * as LeaveService from '../services/leave.service';
import { checkError, catchError, getParams } from '../services/common';

export function loadMyLeaves(queryString, redirect = '/') {
    return function (dispatch) {
        // "../apis/myRequests.json"
        let params = getParams(queryString)

        LeaveService.searchMyLeaves(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MY_LEAVES, redirect);
            }
            let myLeaves = leaveDTO.mapfromDto(result.items)
            return dispatch({
                type: types.LOAD_MY_LEAVES,
                myLeaves,
                meta: result.meta
            });
        });
    };
}

export function loadEmployeeLeaves(queryString, redirect = '/') {
    return function (dispatch) {
        // "../apis/myRequests.json"
        let params = getParams(queryString)
        params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
        params["employee.jobRole.id"] = queryString.jobRoleIds;
        params["leaveStatus"] = queryString.leaveStatus;
        params["leaveFrom"] = queryString.startDate;
        params["leaveTo"] = queryString.endDate;
        params["leaveType.id"] = queryString.leaveType;
        params = _.omitBy(params, _.isUndefined);
        LeaveService.searchEmployeeLeaves(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_LEAVES, redirect);
            }
            let employeeLeaves = leaveDTO.mapfromDto(result.items)
            return dispatch({
                type: types.LOAD_EMPLOYEE_LEAVES,
                employeeLeaves,
                meta: result.meta
            })
        })
    };
}

export function loadLeaveTypes() {
    return function (dispatch) {
        LeaveService.loadLeaveTypes(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_LEAVETYPES);
            }
            let leaveTypes = result.items.map(i => i.data);
            return dispatch({
                type: types.LOAD_ALL_LEAVETYPES,
                leaveTypes,
            })
        })
    }
}
export function loadLeave(leaveId, redirect = '/') {
    return function (dispatch) {
        LeaveService.loadLeave(leaveId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_LEAVE, redirect);
            }
            const leave = leaveDTO.mapFromLeaveDTO(result);
            return dispatch({
                type: types.LOAD_LEAVE,
                leave,
                meta: result.meta
            });
        });
    };
}

export function updateLeave(leaveId, leave, redirect = '/') {
    return function (dispatch) {
        const leaveDto = leaveDTO.mapToLeaveDTO(leave);
        LeaveService.updateLeave(leaveId, leaveDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_LEAVE, redirect);
            }
            const leave = leaveDTO.mapFromLeaveDTO(result);
            return dispatch({
                type: types.UPDATE_LEAVE,
                leave,
                meta: result.meta
            });
        });
    };
}

export function calculateHours(leave, redirect = '/') {
    return function (dispatch) {
        const leaveDto = leaveDTO.mapToLeaveHoursDTO(leave);
        LeaveService.calculateHours(leaveDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.CALCULATE_LEAVE_HOURS, redirect);
            }
            return dispatch({
                type: types.CALCULATE_LEAVE_HOURS,
                leaveHours: result.data.leaveHours,
                error: checkError(result, status)
            });
        });
    };
}

export function submitNewMyLeave(leave, redirect = '/') {
    return function (dispatch) {
        const leaveDto = leaveDTO.mapToLeaveDTO(leave);
        LeaveService.submitNewMyleave(leaveDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.SUBMIT_MY_LEAVE, redirect);
            }
            const leave = leaveDTO.mapFromLeaveDTO(result);
            return dispatch({
                type: types.SUBMIT_MY_LEAVE,
                leave,
                error: checkError(result, status)
            });
        });
    };
}

export function getMyLeaveBalances(redirect = '/') {
    return function (dispatch) {
        LeaveService.getMyLeaveBalances(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MY_LEAVE_BALANCES, redirect);
            }
            const leaveBalances = leaveDTO.mapFromLeaveBalancesDTO(result.items);
            return dispatch({
                type: types.LOAD_MY_LEAVE_BALANCES,
                leaveBalances,
                error: checkError(result, status)
            });
        });
    };
}

export function loadEmployeeLeaveBalances(queryString, redirect = "/"){
    return function (dispatch){
        let params = getParams(queryString);
        params['group'] = queryString.groupIds;
        params['name'] = queryString.name ? "%" + queryString.name : undefined;
        params = _.omitBy(params, _.isUndefined);
        LeaveService.loadEmployeeLeaveBalances(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_LEAVE_BALANCES, redirect);
            }
            let employeeLeaveBalances = result.items.map(i => i.data);
            return dispatch({
                type: types.LOAD_EMPLOYEE_LEAVE_BALANCES,
                employeeLeaveBalances,
                meta: result.meta
            })
        })
    }
}

export function updateEmployeeLeave(leaveId, leave, redirect = '/') {
    return function (dispatch) {
        const leaveDto = leaveDTO.mapToLeaveDTO(leave);
        LeaveService.updateEmployeeLeave(leaveId, leaveDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_LEAVE, redirect);
            }
            const leave = leaveDTO.mapFromLeaveDTO(result);
            return dispatch({
                type: types.UPDATE_LEAVE,
                leave,
                meta: result.meta
            });
        });
    };
}

export function loadEmployeeLeave(leaveId, redirect = '/') {
    return function (dispatch) {
        LeaveService.loadEmployeeLeave(leaveId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_LEAVE, redirect);
            }
            const leave = leaveDTO.mapFromLeaveDTO(result);
            return dispatch({
                type: types.LOAD_LEAVE,
                leave,
                meta: result.meta
            });
        });
    };
}