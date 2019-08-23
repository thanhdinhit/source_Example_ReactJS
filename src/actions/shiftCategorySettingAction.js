import * as types from '../constants/actionTypes';
import { catchError, checkError } from '../services/common';
// import settingDto from '../services/mapping/settingDto';
import * as apis from '../constants/apis'
import * as apiHelper from '../utils/apiHelper';
export function loadShiftCategoriesSetting(curEmp, queryString, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'shiftcategories?' + query,
        let params = {
            sort_by: queryString.sort_by,
            order_by: queryString.order_by,
        };
        let query = $.param(params);
        $.ajax({
            url: "../apis/shiftCategories.json",
            method: 'get',
            headers: {
                'Authorization': 'Basic ' + curEmp.token,
                "Username": curEmp.userName,
            },
            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.LOAD_SHIFTCATEGORIES_SETTING,
                    shiftCategories: data.items,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_SHIFTCATEGORIES_SETTING, redirect)
            }
        });
    }
}