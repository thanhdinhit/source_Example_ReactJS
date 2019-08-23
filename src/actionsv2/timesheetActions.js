
import { handleError, getParams } from '../services/common';
import * as timesheetsService from '../services/timesheets.service';
import * as timesheetDTO from '../services/mapping/timesheetDTO';
import _ from 'lodash';
import { store } from '../root';


export function loadGroupTimesheets(queryString, callback) {
  let params = getParams(queryString);
  params["group.name"] = queryString.name ? "%" + queryString.name : undefined;
  params["group.id"] = queryString.groupIds;
  params["timesheetStatus"] = queryString.status;
  params["clockIn"] = queryString.clockIn;
  params = _.omitBy(params, _.isUndefined);

  timesheetsService.loadGroupTimesheets(params, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let groupTimesheets = timesheetDTO.mapFromGroupTimesheetDtos(result.items);
    callback && callback(null, groupTimesheets);
  });
}

export function getGroupTimesheetStatistic(callback) {
  timesheetsService.getGroupTimesheetStatistic(function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const groupStatusTimesheets = timesheetDTO.mapFromGroupTimesheetStatisticsDtos(result.items);
    callback && callback(null, groupStatusTimesheets);
  });
}

export function searchMyTimesheets(queryString, callback) {
  let params = _.omitBy(queryString, _.isUndefined);

  timesheetsService.searchMyTimesheets(params, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let timesheets = timesheetDTO.mapFromDtoMyTimesheets(result.items);
    callback && callback(null, timesheets);
  });
}

export function loadTimesheetSetting(callback) {
  timesheetsService.loadTimesheetSetting(function (error, result, status, xhr) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const timesheetSetting = timesheetDTO.mapFromTimesheetSettingDto(result);
    callback && callback(null, timesheetSetting);
  });
}

export function submitTeamTimesheet(teamTimesheets, callback) {
  const teamTimesheetDtos = timesheetDTO.mapToTeamTimesheetDtos(teamTimesheets);
  timesheetsService.submitTeamTimesheets(teamTimesheetDtos, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    callback && callback(null);

  });
}

export function loadEmployeeTimesheets(groupId, queryString, callback) {
  let params = getParams(queryString);
  params["group.id"] = groupId;
  params["employee.fullName"] = queryString.name ? '%' + queryString.name + '%' : queryString.name;
  params["status"] = queryString.status;
  params["clockIn"] = queryString.clockIn;
  params = _.omitBy(params, _.isUndefined);

  timesheetsService.loadEmployeeTimesheets(groupId, params, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const employeeTimesheets = timesheetDTO.mapFromGroupTimesheetDtos(result.items);
    callback && callback(null, employeeTimesheets);
  });
}

export function loadTimesheetTypes(callback) {
  timesheetsService.loadTimesheetTypes(function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let timesheetTypes = timesheetDTO.mapFromTimesheetTypeDtos(result.items);
    callback && callback(null, timesheetTypes);
  });
}

export function searchGroupTeamTimesheetHistories(queryString, callback) {
  let data = getParams(queryString);
  let { groupId, submitterId } = queryString;
  data["employeeName"] = queryString.name || undefined;
  data["submitOn"] = queryString.submitDate;
  data = _.omitBy(data, _.isUndefined);

  timesheetsService.searchGroupTeamTimesheetHistories(groupId, submitterId, data, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let timesheets = timesheetDTO.mapFromGroupTeamTimesheetHistory(result.items);
    callback && callback(null, timesheets);
  });
}

export function loadGroupsTimesheetsHistory(queryString, callback) {
  let params = getParams(queryString);
  params["groupIds"] = queryString.groupIds;
  params["fromDate"] = queryString.fromDate;
  params["toDate"] = queryString.toDate;
  params = _.omitBy(params, _.isUndefined);
  timesheetsService.loadGroupsTimesheetsHistory(params, function (error, result, status, xhr) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const groupsTimesheetsHistory = timesheetDTO.mapFromGroupsTimesheetsHistory(result.items);
    callback && callback(null, groupsTimesheetsHistory);
  });
}

export function searchEmployeeTimesheetHistories(queryString, callback) {
  let data = getParams(queryString);
  let { groupId, employeeId } = queryString;
  data["submitOn"] = queryString.submitDate;
  data = _.omitBy(data, _.isUndefined);

  timesheetsService.searchEmployeeTimesheetHistories(groupId, employeeId, data, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let timesheets = { employeeId, timesheets: timesheetDTO.mapFromDtoMyTimesheets(result.items) };
    callback && callback(null, timesheets);
  });
}

export function loadTimesheetOfEmployee(employeeId, queryString, callback) {
  let params = getParams(queryString);
  params["clockIn"] = queryString.clockIn;
  params['employee.id'] = employeeId;
  params["status"] = queryString.status;

  params = _.omitBy(params, _.isUndefined);
  timesheetsService.loadTeamTimesheets(params, function (error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    const timesheetsOfEmployee = { employeeId, timesheets: timesheetDTO.mapFromDtoMyTimesheets(result.items) };
    callback && callback(null, timesheetsOfEmployee);
  });
}

export function loadsubmittedGroupsTimesheetsHistory(groupId, queryString, callback) {
  let params = getParams(queryString);
  params["fromDate"] = queryString.timeSliderWidgetOption.from;
  params["toDate"] = queryString.timeSliderWidgetOption.to;
  params = _.omitBy(params, _.isUndefined);
  timesheetsService.loadsubmittedGroupsTimesheetsHistory(groupId, params, function (err, result, status, xhr) {
    if (err) {
      return callback && callback(handleError(err, store.dispatch));
    }
    const submittedGroupsTimesheetsHistory = timesheetDTO.mapFromsubmittedGroupsTimesheetsHistory(groupId, result.items);
    callback && callback(null, submittedGroupsTimesheetsHistory)
  });
}

export function approveTimesheet(approveTimesheetId, callback) {
  const idTimesheets = [];
  idTimesheets.push(approveTimesheetId);

  timesheetsService.approveTeamTimesheets({ idTimesheets }, function (err, result, status, xhr) {
    if (err) {
      return callback && callback(handleError(err, store.dispatch));
    }
    callback && callback(null, result.data)
  });
}

export function approveAllTimesheets(queryString, callback) {
  let params = {};
  params["groupId"] = queryString.groupId;
  params["idTimesheets"] = queryString.timesheetIds;
  params["startDate"] = queryString.startDate;
  params["endDate"] = queryString.endDate;
  params = _.omitBy(params, _.isUndefined);
  params = timesheetDTO.mapToApproveAllTimesheetDtos(params);
  timesheetsService.approveAllTimesheets(params, function (err, result, status, xhr) {
    if (err) {
      return callback && callback(handleError(err, store.dispatch));
    }
    callback && callback(null, result.data)
  });
}

export function loadMemberTimesheetDetail(timesheetId, callback) {
  timesheetsService.loadMemberTimesheetDetail(timesheetId, function (err, result, status) {
    if (err) {
      return callback && callback(handleError(err, store.dispatch));
    }
    const timesheet = timesheetDTO.mapFromDto(result);
    callback && callback(null, timesheet);
  })
}

export function updateMemberTimesheet(timesheetId, timesheet, callback) {
  timesheetsService.updateMemberTimesheet(timesheetId, timesheet, function (error, result, status, xhr) {
    if (error) {
      return callback && callback(handleError(err, store.dispatch));
    }
    const timesheet = timesheetDTO.mapFromDto(result);
    callback && callback(null, timesheet);
  });
}