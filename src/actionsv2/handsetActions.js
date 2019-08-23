import _ from 'lodash';
import * as types from '../constants/actionTypes';
import { checkError, catchError, getParams, next, handleError } from '../services/common';
import { mapToDto, mapFromDto, mapFromDtos, mapFromHandsetSummaryDTO, mapFromHandsetDTO, mapFromStoreLocDtos } from '../services/mapping/handsetsDTO';
import * as HandsetsService from '../services/handsets.service';
import { store } from '../root';
import { HANDSET_STATUS } from '../core/common/constants';
import dateHelper from '../utils/dateHelper';

export function loadHandsetSummary(queryString, callback) {
    let params = getParams(queryString);
    params['type'] = queryString.handsetType ? "%" + queryString.handsetType : undefined;
    params["storeLocIds"] = queryString.storeLocIds;
    params = _.omitBy(params, _.isUndefined);
    HandsetsService.loadHandsetSummary(params, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let handsetSummary = mapFromHandsetSummaryDTO(result.items);
        callback && callback(null, { handsetSummary, meta: result.meta });
    });
}

export function loadStoreLocs(callback) {
    HandsetsService.loadStoreLocs(function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let storeLocs = mapFromStoreLocDtos(result.items);
        callback && callback(null, { storeLocs })
    });
}

export function getHandsetTypes(callback) {
    HandsetsService.getHandsetTypes(function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const handsetTypes = mapFromHandsetSummaryDTO(result.items);
        callback && callback(null, { handsetTypes });
    });
}

export function searchHandsets(query, callback) {
    let params = getParams(query);
    params['handsetTypeId'] = _.get(query, 'type.id', undefined);
    params['status'] = query.status;
    params['identifier'] = _.get(query, 'identifier') ? "%" + query.identifier : undefined;
    params["assignee.id"] = query.assignee;
    params["storeLoc.id"] = query.storeLocIds;
    params = _.omitBy(params, _.isUndefined);

    HandsetsService.searchHandsets(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const handsets = mapFromDtos(result.items);
        callback && callback(null, { handsets, meta: result.meta });
    });
}

export function transferHandsets(data, callback) {
    HandsetsService.transferHandsets(data, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        return callback && callback(null);
    });
}

export function assignHandset(handset, employeeId, callback) {
    let handsetClone = _.cloneDeep(handset);
    handsetClone.assignee = { id: employeeId };
    handsetClone.status = HANDSET_STATUS.ASSIGNED;
    handsetClone = mapToDto(handsetClone);

    HandsetsService.assignedHandset(handsetClone, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const handset = mapFromHandsetDTO(result.data);
        callback && callback(null, { handset, meta: result.meta });
    });
}

export function assignHandsets(data, callback) {
    let dataClone = _.cloneDeep(data);
    dataClone.assignDate = dateHelper.localToUTC(data.assignDate);
    HandsetsService.assignHandsets(dataClone, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const handsets = mapFromDtos(result.items);
        callback && callback(null, { handsets, meta: result.meta });
    });
}

export function loadHandset(handsetId, callback) {
    HandsetsService.loadHandset(handsetId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let handset = mapFromHandsetDTO(result.data);
        callback && callback(null, handset);
    })
}

export function editHandsetType(handsetTypeId, handsetType, callback) {
    HandsetsService.editHandsetType(handsetTypeId, handsetType, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, { meta: result.meta });
    })
}

export function deleteHandset(handsetId, callback) {
    HandsetsService.deleteHandset(handsetId, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null);
    })
}

export function editHandset(handset, callback) {
    let handsetDto = mapToDto(handset);
    HandsetsService.editHandset(handsetDto.id, handsetDto, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let handset = mapFromHandsetDTO(result.data);
        callback && callback(null, handset);
    });
}

export function addHandset(handset, callback) {
    let params = handset;
    params['type'] = { id: _.get(handset, 'handsetType.id', undefined) };
    params['handsetType'] = undefined;
    params['receivedDate'] = dateHelper.localToUTC(handset.receivedDate);
    params = _.omitBy(params, _.isUndefined);
    HandsetsService.addHandset(params, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, { meta: result.meta });
    });
}

export function addHandsetType(handsetType, callback) {
    HandsetsService.addHandsetType(handsetType, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, { meta: result.meta });
    })
}
