import * as types from '../constants/actionTypes';
import {
  mapFromDtoMyTimesheets,
  mapFromTeamTimesheets,
  mapToDto, mapFromDtos,
  mapFromDto,
  mapFromTimesheetTypeDtos,
  mapToTimesheetDTO,
  mapFromMyTimesheets,
  mapToTimesheetDtos,
  mapFromTimesheetSettingDto,
  mapFromGroupTimesheetDtos,
  mapToTeamTimesheetDtos,
  mapFromGroupStatusTimesheetsDtos,
  mapToApproveAllTimesheetDtos,
  mapFromCountAllPending,
  mapToTeamTimesheetHistoryDtos,
  mapFromGroupsTimesheetsHistory,
  mapTosubmittedGroupsTimesheetsHistory,
  mapFromsubmittedGroupsTimesheetsHistory
} from '../services/mapping/timesheetDTO';
import { checkError, catchError, getParams } from '../services/common';
import { browserHistory } from 'react-router';
import { loading } from './globalAction';
import * as apiHelper from '../utils/apiHelper';
import * as timesheetsService from '../services/timesheets.service';
import _ from 'lodash';
import { STATUS } from '../core/common/constants';
import { rebuildTree } from '../utils/arrayHelper';

const TIMESHEET_NAMEBASE = 'timesheet';

// export function loadEmployeeTimesheets(queryString, redirect = '/') {
//   return function (dispatch) {
//     let params = getParams(queryString);
//     params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
//     params["employee.group.id"] = queryString.groupIds;
//     params["timesheetStatus"] = queryString.status;
//     params["clockIn"] = queryString.clockIn;
//     params = _.omitBy(params, _.isUndefined);

//     timesheetsService.loadEmployeeTimesheets(params, function (error, result) {
//       if (error) {
//         return catchError(error, dispatch, types.LOAD_EMPLOYEE_TIMESHEETS, redirect);
//       }

//       const employeeTimesheets = mapFromDtos(result.items);
//       return dispatch({
//         type: types.LOAD_EMPLOYEE_TIMESHEETS,
//         employeeTimesheets,
//         meta: result.meta
//       });
//     });
//   };
// }

export function loadGroupTimesheets(queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["group.name"] = queryString.name ? "%" + queryString.name : undefined;
    params["group.id"] = queryString.groupIds;
    params["timesheetStatus"] = queryString.status;
    params["clockIn"] = queryString.clockIn;
    params = _.omitBy(params, _.isUndefined);

    timesheetsService.loadGroupTimesheets(params, function (error, result) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_GROUP_TIMESHEETS, redirect);
      }

      const groupTimesheets = mapFromGroupTimesheetDtos(result.items);
      return dispatch({
        type: types.LOAD_GROUP_TIMESHEETS,
        groupTimesheets,
        meta: result.meta
      });
    });
  };
}

export function loadTimesheetTypes() {
  return function (dispatch) {
    timesheetsService.loadTimesheetTypes(function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_TIMESHEET_TYPE);
      }
      const timesheetTypes = mapFromTimesheetTypeDtos(result.items);
      return dispatch({
        type: types.LOAD_TIMESHEET_TYPE,
        timesheetTypes
      });
    });
  };
}

export function loadTimesheetSetting() {
  return function (dispatch) {
    timesheetsService.loadTimesheetSetting(function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_TIMESHEET_SETTING);
      }
      const timesheetSetting = mapFromTimesheetSettingDto(result);
      return dispatch({
        type: types.LOAD_TIMESHEET_SETTING,
        timesheetSetting
      });
    });
  };
}

export function loadSubmitterTimesheets(token, userName, queryString, redirect = '/') {
  return function (dispatch) {
    // "../apis/myRequests.json"
    dispatch(loading())
    let params = {
      status: '',
      page_size: queryString.pageSize,
      page: queryString.page + 1
    };
    let query = $.param(params);
    let newEndDate = new Date(queryString.endDate);
    newEndDate.setDate(newEndDate.getDate() + 1);
    newEndDate.setMilliseconds(newEndDate.getMilliseconds() - 1)
    query += '&start_date=' + queryString.startDate.toJSON() + '&end_date=' + newEndDate.toJSON();
    // let url =  API_URL +  ROSTER + 'timesheets?' + query;
    $.ajax({
      url: API_DATA + 'timesheets?' + query,
      method: 'get',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      success: function (data, status, xhr) {
        let newData = mapFromMyTimesheets(data.items);
        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.LOAD_SUBMITTER_TIMESHEETS,
          myTimesheets: newData,
          meta: data.meta,
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.LOAD_SUBMITTER_TIMESHEETS, redirect)
      }


    });
  };
}

export function loadTeamTimesheets(token, userName, queryString, redirect = '/') {
  return function (dispatch) {
    dispatch(loading());
    // "../apis/teamTimesheets.json",
    let params = {
      status: '',
      page_size: queryString.page_size,
      page: queryString.page + 1,
      sort_by: queryString.sort_by.toLowerCase(),
      order_by: queryString.order_by == 1 ? 'asc' : 'desc',
    };
    let query = $.param(params);
    query += '&start_date=' + queryString.startDate.toJSON() + '&end_date=' + queryString.endDate.toJSON();
    query += '&employee_ids=' + queryString.filter.join()
    // let url =  API_URL +  ROSTER + 'requestedtimesheets?' + query
    $.ajax({
      url: API_DATA + 'requestedtimesheets?' + query,
      method: 'get',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      success: function (data, status, xhr) {
        let newData = mapFromTeamTimesheets(data.items);
        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.LOAD_TEAM_TIMESHEETS,
          teamTimesheets: newData,
          meta: data.meta,
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.LOAD_TEAM_TIMESHEETS, redirect)
      }
    });
  };
}


export function loadTeamTimesheetsDetail(token, userName, queryString, employeeDetail, redirect = '/') {
  return function (dispatch) {
    // "../apis/myRequests.json"
    dispatch(loading());
    let params = {
      status: '',
      page_size: queryString.page_size,
      page: queryString.pageDetail + 1
    };
    let query = $.param(params);
    let newEndDate = new Date(queryString.endDate);
    newEndDate.setDate(newEndDate.getDate() + 1);
    newEndDate.setMilliseconds(newEndDate.getMilliseconds() - 1)
    query += '&start_date=' + queryString.startDate.toJSON() + '&end_date=' + newEndDate.toJSON();
    // let url =  API_URL +  ROSTER + 'requestedtimesheets/' + employeeDetail + '?' + query;
    $.ajax({
      url: API_DATA + 'requestedtimesheets/' + employeeDetail + '?' + query,
      method: 'get',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      success: function (data, status, xhr) {
        let newData = mapFromDtoMyTimesheets(data.items);
        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.LOAD_SUBMITTER_TIMESHEETS,
          memberTimesheets: newData,
          meta: data.meta,
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.LOAD_SUBMITTER_TIMESHEETS, redirect)
      }
    });
  };
}


export function addTimesheet(timesheetDto) {
  return function (dispatch) {
    // let url =  API_URL +  ROSTER + TIMESHEET_NAMEBASE
    let timesheetData = mapToDto(timesheetDto)
    $.ajax({
      url: API_DATA + TIMESHEET_NAMEBASE,
      method: 'post',
      dataType: 'json',
      crossDomain: true,
      data: JSON.stringify(timesheetData),
      contentType: "application/json",
      success: function (data, status, xhr) {
        return dispatch({
          type: types.ADD_EDIT_TIMESHEET,
          error: checkError(data, xhr.status)
        })
      },
      error: function (xhr) {
        let reponseText = undefined;
        try {
          reponseText = JSON.parse(xhr.responseText)
          return dispatch({
            type: types.ADD_EDIT_TIMESHEET,
            error: checkError(reponseText, xhr.status)
          })
        } catch (err) {
          let error = {}
          error.exception = true;
          error.message = 'Server error';
          return dispatch({
            type: types.ADD_EDIT_TIMESHEET,
            error: error
          })
        }
      }
    });
  };
}

export function loadTimesheet(employeeId, timesheetId) {
  return function (dispatch) {
    $.ajax({
      url: API_DATA + 'employees/' + employeeId + '/timesheet/' + timesheetId,
      method: 'get',
      dataType: 'json',
      success: function (data, status, xhr) {
        let error = checkError(data, xhr.status);
        let newData = mapFromDtoMyTimesheets(data.data)
        return dispatch({
          type: types.LOAD_TIMESHEET,
          addEditTimesheet: newData,
          error: error
        })
      },
      error: function (xhr) {
        let reponseText = undefined;
        try {
          reponseText = JSON.parse(xhr.responseText)
          return dispatch({
            type: types.LOAD_TIMESHEET,
            error: checkError(reponseText, xhr.status)
          })
        } catch (err) {
          let error = {}
          error.exception = true;
          error.message = 'Server error';
          return dispatch({
            type: types.LOAD_TIMESHEET,
            error: error
          })
        }
      }
    });
  };
}


export function editTimesheet(token, userName, timesheetDto, queryString, redirect = '/') {
  return function (dispatch) {
    // let url =  API_URL +  ROSTER + 'requestedtimesheets/' + timesheetDto.id;
    let timesheetData = mapToDto(timesheetDto);
    $.ajax({
      url: API_DATA + 'requestedtimesheets/' + timesheetDto.id,
      method: 'put',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      data: JSON.stringify(timesheetData),
      contentType: "application/json",
      success: function (data, status, xhr) {
        dispatch(loadTeamTimesheetsDetail(token, userName, queryString, timesheetDto.employeeId, redirect))
        return dispatch({
          type: types.EDIT_TIMESHEET,
          error: checkError(data, xhr.status)
        })
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.EDIT_TIMESHEET, redirect)
      }
    });
  };
}
export function deleteTimesheet(token, userName, timesheetDto, queryString, redirect = '/') {
  return function (dispatch) {
    // let url =  API_URL +  ROSTER + 'requestedtimesheets/' + timesheetDto.id;
    $.ajax({
      url: API_DATA + 'requestedtimesheets/' + timesheetDto.id,
      method: 'delete',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      contentType: "application/json",
      success: function (data, status, xhr) {
        dispatch(loadTeamTimesheetsDetail(token, userName, queryString, timesheetDto.employeeId, redirect))
        return dispatch({
          type: types.DELETE_TIMESHEET,
          error: checkError(data, xhr.status)
        })
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.DELETE_TIMESHEET, redirect)
      }
    });
  };
}
export function updateDtoTimesheet(fieldName, value) {
  return {
    type: types.UPDATE_DTO_TIMESHEET,
    fieldName,
    value
  }
}

export function updatePayLoadTimesheet(fieldName, value) {
  return {
    type: types.UPDATE_PAYLOAD_TIMESHEET,
    fieldName,
    value
  }
}

export function getWorkingStatus(token, userName, redirect = '/') {
  return function (dispatch) {
    dispatch(loading());
    // let url =  API_URL +  ROSTER + 'employeetracking';
    $.ajax({
      url: API_DATA + 'employeetracking',
      method: 'get',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      success: function (data, status, xhr) {

        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.LOAD_WORKINGSTATUS,
          workingStatus: data.data,
          meta: data.meta,
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.LOAD_WORKINGSTATUS, redirect)
      }
    });
  };
}

export function postWorkingStatus(token, userName, workingDto, redirect = '/') {
  return function (dispatch) {
    dispatch(loading());
    // let url =  API_URL +  ROSTER + 'employeetracking';
    $.ajax({
      url: API_DATA + 'employeetracking',
      method: 'post',
      dataType: 'json',
      data: JSON.stringify(workingDto),
      contentType: "application/json",
      headers: {
        'Authorization': 'Basic ' + token,
        "Username": userName,
      },
      success: function (data, status, xhr) {

        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.POST_WORKINGSTATUS,
          workingStatus: data.data,
          meta: data.meta,
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.POST_WORKINGSTATUS, redirect)
      }
    });
  };
}

export function loadMyTimeSheets(queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["clockIn"] = queryString.clockIn;
    params["timesheetStatus"] = queryString.status;
    params = _.omitBy(params, _.isUndefined);

    timesheetsService.loadMyTimeSheets(params, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_MY_TIMESHEETS, redirect);
      }
      const myTimesheets = mapFromDtoMyTimesheets(result.items);
      return dispatch({
        type: types.LOAD_MY_TIMESHEETS,
        myTimesheets
      });
    });
  };
}

export function loadTimesheetOfEmployee(employeeId, queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["clockIn"] = queryString.clockIn;
    params['employeeId'] = employeeId;
    params["status"] = queryString.status;

    params = _.omitBy(params, _.isUndefined);
    timesheetsService.loadTeamTimesheets(params, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_TIMESHEETS_EMPLOYEE, redirect);
      }
      const timesheetsOfEmployee = { employeeId, timesheets: mapFromDtoMyTimesheets(result.items) };
      return dispatch({
        type: types.LOAD_TIMESHEETS_EMPLOYEE,
        timesheetsOfEmployee
      });
    });
  };
}

export function approveTimesheets(employeeTimesheet, redirect = '/') {
  return function (dispatch) {
    const timesheetDtos = mapToTimesheetDtos(employeeTimesheet);
    const idTimesheets = [];
    _.forEach(timesheetDtos, (timesheet) => {
      if (timesheet.timesheetStatus === STATUS.PENDING) {
        idTimesheets.push(timesheet.id);
      }
    });
    timesheetsService.approveTeamTimesheets({ idTimesheets }, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.APPROVE_TIMESHEETS, redirect);
      }
      return dispatch({
        type: types.APPROVE_TIMESHEETS,
        countErrorTimesheet: result.data.countErrorTimesheet
      });
    });
  };
}

export function submitTeamTimesheet(teamTimesheets, redirect = '/') {
  return function (dispatch) {
    const teamTimesheetDtos = mapToTeamTimesheetDtos(teamTimesheets);
    timesheetsService.submitTeamTimesheets(teamTimesheetDtos, function (err, result, status, xhr) {
      if (err) {
        return catchError(err, dispatch, types.SUBMIT_TEAM_TIMESHEETS, redirect);
      }
      if (teamTimesheets.length == 1) {
        if (result.items.length && result.items[0].data.existingPending) {
          return dispatch({
            type: types.SUBMIT_TEAM_TIMESHEETS,
            submitTeamTimesheets: result.items,
            error: {
              code: 1,
              message: 'P144'
            }
          })
        }
      }
      return dispatch({
        type: types.SUBMIT_TEAM_TIMESHEETS,
        submitTeamTimesheets: result.items
      })
    })
  }
}

export function loadAllPendingsTimesheets(employeeTimesheet, groupId, redirect = '/') {
  return function (dispatch) {
    const countAllPending = mapToApproveAllTimesheetDtos(employeeTimesheet, groupId);
    timesheetsService.loadAllPendingsTimesheets(countAllPending, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_ALL_PENDINGS_TIMESHEETS, redirect);
      }
      const countAllPending = mapFromCountAllPending(result)
      return dispatch({
        type: types.LOAD_ALL_PENDINGS_TIMESHEETS,
        countAllPending
      });
    });
  };
}

export function getGroupTimesheetStatistic(redirect = '/') {
  return function (dispatch) {
    timesheetsService.getGroupTimesheetStatistic(function (err, result, status, xhr) {
      if (err) {
        return catchError(err, dispatch, types.LOAD_GROUP_STATUS_TIMESHEETS, redirect);
      }
      const groupStatusTimesheets = mapFromGroupStatusTimesheetsDtos(result.items);
      return dispatch({
        type: types.LOAD_GROUP_STATUS_TIMESHEETS,
        groupStatusTimesheets
      });
    });
  };
}
export function approveAllTimesheets(employeeTimesheet, groupId, redirect = '/') {
  return function (dispatch) {
    const timesheetDtos = mapToApproveAllTimesheetDtos(employeeTimesheet, groupId);
    timesheetsService.submitAllTeamTimesheets(timesheetDtos, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.APPROVE_ALL_TIMESHEETS, redirect);
      }
      return dispatch({
        type: types.APPROVE_ALL_TIMESHEETS,
        countErrorTimesheet: result.data.countErrorTimesheet
      });
    });
  };
}

export function loadEmployeeTimesheetHistories(queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["employee.fullName"] = queryString.name ? "%" + queryString.name : undefined;
    params["groupId"] = queryString.groupId;
    params["submitterId"] = queryString.submitterId;
    params["submitDate"] = queryString.submitDate;
    params = _.omitBy(params, _.isUndefined);

    timesheetsService.loadEmployeeTimesheetHistories(params, function (error, result) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_EMPLOYEE_TIMESHEET_HISTORIES, redirect);
      }

      const employeeTimesheetHistories = mapFromGroupTimesheetDtos(result.items);
      return dispatch({
        type: types.LOAD_EMPLOYEE_TIMESHEET_HISTORIES,
        employeeTimesheetHistories,
        meta: result.meta
      });
    });
  };
}

export function loadTimesheetHistoryOfEmployee(employeeId, queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params['employeeId'] = employeeId;
    params["groupId"] = queryString.groupId;
    params['submitterId'] = queryString.submitterId;
    params["submitDate"] = queryString.submitDate;

    params = _.omitBy(params, _.isUndefined);
    timesheetsService.loadMemberTimesheetHistory(params, function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_TIMESHEET_HISTORY_EMPLOYEE, redirect);
      }
      const timesheetHistoryOfEmployee = { employeeId, timesheets: mapFromDtoMyTimesheets(result.items) };
      return dispatch({
        type: types.LOAD_TIMESHEET_HISTORY_EMPLOYEE,
        timesheetHistoryOfEmployee
      });
    });
  };
}

export function loadGroupsTimesheetsHistory(queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["groupIds"] = queryString.groupIds;
    params["fromDate"] = queryString.fromDate;
    params["toDate"] = queryString.toDate;
    params = _.omitBy(params, _.isUndefined);
    timesheetsService.loadGroupsTimesheetsHistory(params, function (err, result, status, xhr) {
      if (err) {
        return catchError(err, dispatch, types.LOAD_GROUP_TIMESHEETS_HISTORY, redirect);
      }
      const groupsTimesheetsHistory = mapFromGroupsTimesheetsHistory(result.items);
      return dispatch({
        type: types.LOAD_GROUP_TIMESHEETS_HISTORY,
        groupsTimesheetsHistory,
        meta: result.meta
      });
    });
  };
}

export function loadsubmittedGroupsTimesheetsHistory(groupId, queryString, redirect = '/') {
  return function (dispatch) {
    let params = getParams(queryString);
    params["fromDate"] = queryString.timeSliderWidgetOption.from;
    params["toDate"] = queryString.timeSliderWidgetOption.to;
    params = _.omitBy(params, _.isUndefined);
    timesheetsService.loadsubmittedGroupsTimesheetsHistory(groupId, params, function (err, result, status, xhr) {
      if (err) {
        return catchError(err, dispatch, types.LOAD_APPROVER_GROUP_TIMESHEETS_HISTORY, redirect);
      }
      const submittedGroupsTimesheetsHistory = mapFromsubmittedGroupsTimesheetsHistory(groupId, result.items)
      return dispatch({
        type: types.LOAD_APPROVER_GROUP_TIMESHEETS_HISTORY,
        submittedGroupsTimesheetsHistory
      });
    });
  };
}
