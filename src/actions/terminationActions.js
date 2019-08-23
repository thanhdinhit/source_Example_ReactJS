import * as types from '../constants/actionTypes';
import { catchError } from '../services/common';
import { mapToTerminationReason, mapFromTerminations, mapToTerminationDTO, mapToRejoinDTO } from '../services/mapping/terminationDTO';
import { mapFromDto } from '../services/mapping/employeeDTO';
import * as TerminationService from '../services/termination.service';
import { loadEmployee } from './employeeActions';

export function getTerminations(employeeId) {
    return function (dispatch) {
        TerminationService.getTerminations(employeeId, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_TERMINATIONS);
            }
            const data = mapFromTerminations(result.items);
            return dispatch({
                type: types.GET_TERMINATIONS,
                data,
                meta: result.meta
            });
        });
    };
}

export function termination(employeeId, terminations) {
    return function (dispatch) {
        terminations = mapToTerminationDTO(terminations)
        TerminationService.termination(employeeId, terminations, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.TERMINATION);
            }

            dispatch(loadEmployee(employeeId));
            return dispatch({
                type: types.TERMINATION
            });
        });
    };
}

export function getTerminationReason() {
    return function (dispatch) {
        TerminationService.getTerminationReason(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_TERMINATION_REASON);
            }

            let data = mapToTerminationReason(result.items);
            return dispatch({
                type: types.GET_TERMINATION_REASON,
                data
            });
        });
    };
}

export function rejoin(employeeId, rejoinedDate) {
    return function (dispatch) {
        let rejoin = mapToRejoinDTO(rejoinedDate);
        TerminationService.rejoin(employeeId, rejoin, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.REJOIN);
            }

            let employee = mapFromDto(result.data);
            dispatch({
                type: types.LOAD_EMPLOYEE,
                employee,
                meta: result.meta
            });
            return dispatch({
                type: types.REJOIN,
                rejoinedDate,
                employee
            });
        });
    };
}