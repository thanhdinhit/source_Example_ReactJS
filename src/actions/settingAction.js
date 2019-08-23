import _ from 'lodash';
import * as types from '../constants/actionTypes';
import { catchError, checkError } from '../services/common';
import settingDto from '../services/mapping/settingDto';
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
import * as settingService from '../services/setting.service';

// example of a thunk using the redux-thunk middleware
export function loadLeaveSetting(curEmp, queryString, redirect = '/') {
  return function (dispatch) {
    $.ajax({
      url: API_DATA + queryString,
      method: 'get',
      headers: {
        'Authorization': 'Basic ' + curEmp.token,
        "Username": curEmp.userName,
      },
      success: function (data, status, xhr) {
        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.LOAD_LEAVE_SETTING,
          leaveSettings: settingDto.mapFromLeaveSettingDto(data.items),
          error: error
        });
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.LOAD_LEAVE_SETTING, redirect)

      }
    });
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
  };
}


export function updateLeaveSetting(curEmp, queryString, data, redirect = '/') {
  return function (dispatch) {
    let mapToDto = settingDto.mapToLeaveSettingDto(data);
    $.ajax({
      url: API_DATA + queryString,
      method: 'put',
      dataType: 'json',
      data: JSON.stringify(mapToDto),
      contentType: "application/json",
      headers: {
        'Authorization': 'Basic ' + curEmp.token,
        "Username": curEmp.userName,
      },
      success: function (data, status, xhr) {
        let error = checkError(data, xhr.status);
        return dispatch({
          type: types.UPDATE_LEAVE_SETTING,
          error: error
        })
      },
      error: function (xhr) {
        return catchError(xhr, dispatch, types.UPDATE_LEAVE_SETTING, redirect)

      }
    });
  };
}

export function updateSetting(element) {
  return {
    type: types.UPDATE_SETTING,
    element,
  }
}

export function loadPayRateSetting(redirect = '/') {
  return function (dispatch) {
    settingService.loadPayRateSetting(function (error, result) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_PAY_RATE_SETTING, redirect);
      }
      const payRateSetting = _.map(result.items, (item) => {
        return item.data;
      });
      return dispatch({
        type: types.LOAD_PAY_RATE_SETTING,
        payRateSetting
      });
    });
  };
}
