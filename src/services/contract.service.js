import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const searchContracts = function (data, callback) {
    let path = getApiPath(API.CONTRACTS_SEARCH);

    return HttpRequests.post(path, data, callback);
};

export const addContract = function (data, callback) {
    let path = getApiPath(API.NEW_CONTRACT);

    return HttpRequests.post(path, data, callback);
};

export const loadContractDetail = function (contractId, callback) {
    let path = getApiPath(API.CONTRACT_DETAIL, { contractId });
    return HttpRequests.get(path, callback);
};

export const loadContractSchedules = function (params, callback) {
    let path = getApiPath(API.CONTRACT_SCHEDULES, params);
    return HttpRequests.get(path, callback);
};

export const loadContractFlexibleSchedules = function (contractId, callback) {
    let path = getApiPath(API.CONTRACT_FLEXIBLE_SCHEDULES, { contractId });
    return HttpRequests.get(path, callback);
};

export const loadContractAttachments = function (contractId, callback) {
    let path = getApiPath(API.CONTRACT_ATTACHMENTS, { contractId });
    return HttpRequests.get(path, callback);
};

export const loadContractLinks = function (contractId, callback) {
    let path = getApiPath(API.CONTRACT_LINKS, { contractId });
    return HttpRequests.get(path, callback);
};

export const loadContractAppendix = function (contractId, callback) {
    let path = getApiPath(API.CONTRACT_APPENDIX, { contractId });
    return HttpRequests.get(path, callback);
};

export const editContract = function (contractId, data, callback) {
    let path = getApiPath(API.CONTRACT_EDIT, { contractId });
    return HttpRequests.put(path, data, callback);
};

export const suspendContract = function (contractId, data, callback) {
    let path = getApiPath(API.SUSPEND_CONTRACT, { contractId });
    return HttpRequests.put(path, data, callback);
};

export const terminateContract = function (contractId, data, callback) {
    let path = getApiPath(API.TERMINATE_CONTRACT, { contractId });
    return HttpRequests.put(path, data, callback);
};

export const deleteContract = function (contractId, callback) {
    let path = getApiPath(API.DELETE_CONTRACT, { contractId });
    return HttpRequests.delete(path, null, callback);
};

export const resumeContract = function (contractId, data, callback) {
    let path = getApiPath(API.RESUME_CONTRACT, { contractId });
    return HttpRequests.put(path, data, callback);
};

export const loadContractSchedulesShift = function (params, callback) {
    let path = getApiPath(API.CONTRACT_SCHEDULES_SHIFT, params);
    return HttpRequests.get(path, callback);
};