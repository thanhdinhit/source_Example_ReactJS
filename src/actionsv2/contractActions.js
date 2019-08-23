import { handleError } from '../services/common';
import * as ContractService from '../services/contract.service';
import { store } from '../root';
import * as contractDTO from '../services/mapping/contractDTO';
import _ from 'lodash';


export function loadContractDetail(contractId, callback) {
    ContractService.loadContractDetail(contractId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contract = contractDTO.mapFromDto(result);
        callback && callback(null, contract);
    });
}

export function loadContractSchedules(contractId, appendixId, callback) {
    let params = {
        contractId,
        appendix: appendixId || ''
    }
    params = _.omitBy(params, _.isUndefined)
    ContractService.loadContractSchedules(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractSchedules = contractDTO.mapFromContractSchedulesDtos(result.items);
        callback && callback(null, contractSchedules);
    });
}

export function loadContractFlexibleSchedules(contractId, callback) {
    ContractService.loadContractFlexibleSchedules(contractId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractFlexibleSchedules = contractDTO.mapFromContractSchedulesDtos(result.items);
        callback && callback(null, contractFlexibleSchedules);
    });
}

export function loadContractAttachments(contractId, callback) {
    ContractService.loadContractAttachments(contractId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractAttachments = contractDTO.mapFromContractAttachmentDtos(result.items);
        callback && callback(null, contractAttachments);
    });
}

export function loadContractLinks(contractId, callback) {
    ContractService.loadContractLinks(contractId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractLinks = contractDTO.mapFromContractLinkDtos(result.items);
        callback && callback(null, contractLinks);
    });
}

export function loadContractAppendix(contractId, callback) {
    ContractService.loadContractAppendix(contractId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractAppendix = contractDTO.mapFromContractAppendixDtos(result.items);
        callback && callback(null, contractAppendix);
    });
}

export function editContract(contract, callback) {
    const contractDto = contractDTO.mapToEditDto(contract);
    ContractService.editContract(contract.id, contractDto, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null)
    });
}

export function loadContractSchedulesShift(contractId, scheduleId, appendixId, callback) {
    let params = {
        contractId,
        scheduleId,
        appendix: appendixId || ''
    }
    params = _.omitBy(params, _.isUndefined)
    ContractService.loadContractSchedulesShift(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contractSchedulesShift = contractDTO.mapFromContractSchedulesShift(result.items);
        callback && callback(null, contractSchedulesShift);
    });
}

export function loadContractsByContractId(identifier, callback) {
    ContractService.searchContracts({ identifier }, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }

        let contracts = contractDTO.mapFromDtos(result.items);
        callback && callback(null, { contracts, meta: result.meta });
    });
}

export function suspendContract(contract, callback) {
    const contractDto = contractDTO.mapToDto(contract);
    ContractService.suspendContract(contract.id, contractDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const suspendContract = contractDTO.mapFromDto(result);
        callback && callback(null, suspendContract);
    });
}

export function terminateContract(contract, callback) {
    const contractDto = contractDTO.mapToDto(contract);
    ContractService.terminateContract(contract.id, contractDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const terminateContract = contractDTO.mapFromDto(result);
        callback && callback(null, terminateContract);
    });
}

export function resumeContract(contract, callback) {
    const contractDto = contractDTO.mapToDto(contract);
    ContractService.resumeContract(contract.id, contractDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const resumeContract = contractDTO.mapFromDto(result);
        callback && callback(null, resumeContract);
    });
}

export function addContract(contract, callback) {
    const contractDto = contractDTO.mapToEditDto(contract);
    ContractService.addContract(contractDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const contract = contractDTO.mapFromDto(result);
        callback && callback(null, contract);
    });
}