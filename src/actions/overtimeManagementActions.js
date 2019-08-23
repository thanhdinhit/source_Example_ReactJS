import * as types from '../constants/actionTypes';
import { checkError, catchError, catchError2, getParams, next } from '../services/common';
import { mapToDto, mapFromDto, mapFromDtos, mapToNewOvertimeDto, mapFromConfigDto } from '../services/mapping/overtimeManagementDTO';
import { loading } from './globalAction';
import update from 'react-addons-update';
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import toastr from 'toastr';
import RS from '../../src/resources/resourceManager';
import moment from 'moment';
export function loadAllReceivedRequests(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params.overtimeFrom = queryString.startDate
        params.overtimeTo = queryString.endDate
        params["location.id"] = queryString.locationIds
        params.overtimeStatus = queryString.status;
        $.ajax({
            url: apiEndpoints.OVERTIME_RECEIVED_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.LOAD_ALL_RECEIVED_REQUESTS,
                    receivedRequests: rs,
                    metaReceived: data.meta,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_ALL_RECEIVED_REQUESTS, redirect);
            }
        });
    };
}

export function loadAllSentRequests(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params.overtimeFrom = queryString.startDate
        params.overtimeTo = queryString.endDate
        params["location.id"] = queryString.locationIds
        params.overtimeStatus = queryString.status;

        $.ajax({
            url: apiEndpoints.OVERTIME_SENT_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.LOAD_ALL_SENT_REQUESTS,
                    sentRequests: rs,
                    metaSent: data.meta,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_ALL_SENT_REQUESTS, redirect);
            }
        });
    };
}

export function editOvertimeReceivedRequest(overtimeDto, queryString, redirect = '/') {
    return function (dispatch) {
        let data = mapToDto(overtimeDto)
        $.ajax({
            url: stringUtil.format(apiEndpoints.OVERTIME_RECEIVED_PUT, overtimeDto.id),
            method: 'put',
            data: JSON.stringify(data),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                dispatch(loadAllReceivedRequests(queryString))
                return dispatch({
                    type: types.EDIT_OVERTIME,
                    error: checkError(data, xhr.status)
                })
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_OVERTIME, redirect)
            }
        });
    }
}

export function editOvertimeSentRequest(overtimeDto, queryString, redirect = '/') {
    return function (dispatch) {
        let data = mapToDto(overtimeDto)
        $.ajax({
            url: stringUtil.format(apiEndpoints.OVERTIME_SENT_PUT, overtimeDto.id),
            method: 'put',
            data: JSON.stringify(data),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                dispatch(loadAllSentRequests(queryString))
                return dispatch({
                    type: types.EDIT_OVERTIME,
                    error: checkError(data, xhr.status)
                })
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_OVERTIME, redirect)
            }
        });
    }
}


export function addNewOvertime(newOvertimeDto, manager, redirect = '/') {
    return function (dispatch) {
        let dto = mapToNewOvertimeDto(newOvertimeDto, manager);
        $.ajax({
            url: apiEndpoints.NEWOVERTIME_POST,
            method: 'post',
            data: JSON.stringify(dto),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                return dispatch({
                    type: types.ADD_NEW_OVERTIME,
                    requestEmployeeOT: dto.employee,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                let returnDTO = catchError2(xhr, types.ADD_NEW_OVERTIME, redirect);
                returnDTO.requestEmployeeOT = dto.employee
                toastr.error(RS.getString('EMPLOYEE_HAVE_ID') + dto.employee.id + ' ' + RS.getString('FAILED'), 'Error')
                return dispatch(returnDTO)
            }
        })
    }
}

export function loadOTStatistic(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["location"] = queryString.locationIds
        params["jobRole"] = queryString.jobRoleIds
        params.hours = queryString.hours
        if (queryString.startDate) {
            params.overtimeFrom = ">=" + queryString.startDate;
        }
        if (queryString.endDate) {
            params.overtimeTo = "<=" + queryString.endDate;
        }
        $.ajax({
            url: apiEndpoints.OT_STATISTIC_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.LOAD_OT_STATISTIC,
                    otStatistic: rs,
                    metaStatistic: data.meta,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_OT_STATISTIC, redirect);
            }
        });
    };
}


export function loadOTStatisticInMonth(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        let firstDay = moment().startOf('month').format();
        let lastDay = moment().endOf('month').format();
        params.overtimeFrom = ">=" + moment.utc(firstDay).format();
        params.overtimeTo = "<=" + moment.utc(lastDay).format();
        params["region"] = queryString.workingRegionIds
        params["jobRole"] = queryString.jobRoleIds
        $.ajax({
            url: apiEndpoints.OT_STATISTIC_SEARCH,
            method: 'post',
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let rs = mapFromDtos(data.items)
                return dispatch({
                    type: types.LOAD_OT_STATISTIC,
                    otStatistic: rs,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_OT_STATISTIC, redirect);
            }
        });
    };
}

export function loadOvertimeSetting(redirect = '/') {
    return function (dispatch) {
        $.ajax({
            url: apiEndpoints.OVERTIME_SETTING_GET,
            method: 'get',
            dataType: 'json',
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                let rs = mapFromConfigDto(data.data)

                return dispatch({
                    type: types.LOAD_OVERTIME_SETTING,
                    overtimeSetting: rs,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_OVERTIME_SETTING, redirect);
            }
        });
    };
}



export function updateOvertimeDto(fieldName, value) {
    return {
        type: types.UPDATE_OVERTIME_DTO,
        fieldName,
        value
    }
}

export function updateRequestOTEmployees(requestOTEmployees) {
    return {
        type: types.UPDATE_REQUEST_OTEMPLOYEES,
        requestOTEmployees
    }
}

