import { handleError, getParams } from "../services/common";
import * as LeaveService from "../services/leave.service";
import * as leaveDTO from "../services/mapping/leaveDTO";

import { store } from "../root";

export function loadMyLeaves(queryString, callback) {
  let params = getParams(queryString);
  LeaveService.searchMyLeaves(params, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let myLeaves = leaveDTO.mapfromDto(result.items);
    callback && callback(null, myLeaves, result.meta);
  });
}

export function loadLeave(leaveId, callback) {
  LeaveService.loadLeave(leaveId, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leave = leaveDTO.mapFromLeaveDTO(result);
    callback && callback(null, leave);
  });
}

export function updateLeave(leaveId, leave, callback) {
  let leaveDto = leaveDTO.mapToLeaveDTO(leave);
  LeaveService.updateLeave(leaveId, leaveDto, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const leave = leaveDTO.mapFromLeaveDTO(result);
    callback && callback(null, leave);
  });
}

export function loadMyLeaveBalances(callback) {
  LeaveService.getMyLeaveBalances(function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leaveBalances = leaveDTO.mapFromLeaveBalancesDTO(result.items);
    callback && callback(null, leaveBalances);
  });
}

export function calculateHours(leave, callback) {
  let leaveDto = leaveDTO.mapToLeaveHoursDTO(leave);
  LeaveService.calculateHours(leaveDto, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    callback && callback(null, result.data.leaveHours);
  });
}

export function submitNewMyLeave(leave, callback) {
  let leaveDto = leaveDTO.mapToLeaveDTO(leave);
  LeaveService.submitNewMyleave(leaveDto, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leave = leaveDTO.mapFromLeaveDTO(result);
    callback && callback(null, leave);
  });
}

export function loadEmployeeLeaves(queryString, callback) {
  let params = getParams(queryString)
  params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
  params["employee.jobRole.id"] = queryString.jobRoleIds;
  params["leaveStatus"] = queryString.leaveStatus;
  params["leaveFrom"] = queryString.startDate;
  params["leaveTo"] = queryString.endDate;
  params["leaveType.id"] = queryString.leaveType;
  params = _.omitBy(params, _.isUndefined);
  LeaveService.searchEmployeeLeaves(params, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let employeeLeaves = leaveDTO.mapfromDto(result.items)
    callback && callback(null, employeeLeaves, result.meta);
  });
}

export function loadEmployeeLeave(leaveId, callback) {
  LeaveService.loadEmployeeLeave(leaveId, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leave = leaveDTO.mapFromLeaveDTO(result);
    callback && callback(null, leave);
  });
}

export function loadLeaveTypes(callback) {
  LeaveService.loadLeaveTypes(function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leaveTypes = result.items.map(i => i.data);
    callback && callback(null, leaveTypes);
  });
}

export function updateEmployeeLeave(leaveId, leave, callback) {
  let leaveDto = leaveDTO.mapToLeaveDTO(leave);
  LeaveService.updateEmployeeLeave(leaveId, leaveDto, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let leave = leaveDTO.mapFromLeaveDTO(result);
    callback && callback(null, leave);
  });
}

export function loadEmployeeLeaveBalances(queryString, callback) {
  let params = getParams(queryString)
  params['group'] = queryString.groupIds;
  params['name'] = queryString.name ? "%" + queryString.name : undefined;
  params = _.omitBy(params, _.isUndefined);
  LeaveService.loadEmployeeLeaveBalances(params, function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let employeeLeaveBalances = result.items.map(i => i.data);
    callback && callback(null, employeeLeaveBalances, result.meta);
  });
}