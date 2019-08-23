import * as apiEndpoints from '../constants/apiEndpoints';
import * as apiHelper from '../utils/apiHelper';
import { mapFromDtos } from '../services/mapping/employeeTypeDTO'
import * as types from '../constants/actionTypes';
import { checkError, catchError } from '../services/common';
import * as EmployeeTypeService from '../services/employeeType.service';

export function loadAllEmployeeTypes() {
    return function (dispatch) {
        EmployeeTypeService.getEmployeeTypes(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_EMPLOYEE_TYPES, "/");
            }
            let employeeTypes = mapFromDtos(result.items)
            return dispatch({
                type: types.LOAD_ALL_EMPLOYEE_TYPES,
                employeeTypes,
                error: checkError(result, xhr.status)
            });
        });
    };
}