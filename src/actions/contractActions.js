import * as types from '../constants/actionTypes';
import { catchError2, checkError, catchError, canvasToImage, getParams, next } from '../services/common';
import * as contractDTO from '../services/mapping/contractDTO';
import * as ContractService from '../services/contract.service';
import _ from 'lodash';

export function loadAllContract(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["identifier"] = queryString.identifier ? "%" + queryString.identifier : undefined;
        params["customerId"] = queryString.customerIds;
        params["startDate"] = queryString.startDate;
        params["endDate"] = queryString.endDate;
        params["status"] = queryString.status;
        params["scheduleMode"] = queryString.scheduleMode;
        params["ratePrice"] = queryString.ratePrice;
        params["rateType"] = queryString.rateType;

        // if (queryString.pricePerMonth != "" && queryString.pricePerMonth != null) {
        //     params["pricePerMonth"] = queryString.pricePerMonth
        // }

        params = _.omitBy(params, _.isUndefined);

        ContractService.searchContracts(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_CONTRACTS, redirect);
            }

            let contracts = contractDTO.mapFromDtos(result.items);
            return dispatch({

                type: types.LOAD_ALL_CONTRACTS,
                contracts,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    }
}

export function addContract(contract, redirect = '/') {
    return function (dispatch) {
        const contractDto = contractDTO.mapToEditDto(contract);
        ContractService.addContract(contractDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.ADD_CONTRACT, redirect);
            }
            const contract = contractDTO.mapFromDto(result);
            return dispatch({
                type: types.ADD_CONTRACT,
                contract: contract,
                error: checkError(result, status)
            });
        });
    };
}

export function loadContract(contractId, redirect = '/') {
    return function (dispatch) {
        ContractService.loadContract(contractId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_CONTRACT, redirect);
            }
            const contract = contractDTO.mapFromDto(result);
            return dispatch({
                type: types.LOAD_CONTRACT,
                contract,
                meta: result.meta
            });
        });
    };
}

export function updateContractDto(fieldName, value) {
    return {
        type: types.UPDATE_CONTRACT_DTO,
        fieldName,
        value
    };
}

export function editContract(contract, redirect = '/') {
    return function (dispatch) {
        const contractDto = contractDTO.mapToEditDto(contract);
        ContractService.editContract(contractDto.id, contractDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_CONTRACT, redirect);
            }
            const contractResult = contractDTO.mapFromDto(result);
            return dispatch({
                contract: contractResult,
                meta: result.meta,
                type: types.EDIT_CONTRACT,
                error: checkError(result, status)
            });
        });
    };
}

export function suspendContract(contract, redirect = '/') {
    return function (dispatch) {
        const contractDto = contractDTO.mapToDto(contract);
        ContractService.suspendContract(contract.id, contractDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_CONTRACT, redirect);
            }
            const contractResult = contractDTO.mapFromDto(result);
            return dispatch({
                contract: contractResult,
                meta: result.meta,
                type: types.EDIT_CONTRACT,
                error: checkError(result, status)
            });
        });
    };
}

export function terminateContract(contract, redirect = '/') {
    return function (dispatch) {
        const contractDto = contractDTO.mapToDto(contract);
        ContractService.terminateContract(contract.id, contractDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_CONTRACT, redirect);
            }
            const contractResult = contractDTO.mapFromDto(result);
            return dispatch({
                contract: contractResult,
                meta: result.meta,
                type: types.EDIT_CONTRACT,
                error: checkError(result, status)
            });
        });
    };
}

export function deleteContract(contractId, redirect = '/') {
    return function (dispatch) {
        ContractService.deleteContract(contractId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_CONTRACT, redirect);
            }
            return dispatch({
                type: types.DELETE_CONTRACT,
                error: checkError(result, status)
            });
        });
    };
}

export function resumeContract(contract, redirect = '/') {
    return function (dispatch) {
        const contractDto = contractDTO.mapToDto(contract);
        ContractService.resumeContract(contract.id, contractDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_CONTRACT, redirect);
            }
            const contractResult = contractDTO.mapFromDto(result);
            return dispatch({
                contract: contractResult,
                meta: result.meta,
                type: types.EDIT_CONTRACT,
                error: checkError(result, status)
            });
        });
    };
}

export function resetNewContractDto() {
    return {
        type: types.RESET_NEW_CONTRACT_DTO,
    };
}