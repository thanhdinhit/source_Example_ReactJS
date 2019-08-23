import * as types from '../constants/actionTypes';
import { checkError, catchError, getParams, next } from '../services/common';
import { mapToDto, mapFromDto, mapFromDtos, mapFromHandsetSummaryDTO, mapFromHandsetDTO, mapFromStoreLocDtos } from '../services/mapping/handsetsDTO';
import * as HandsetsService from '../services/handsets.service';
import _ from 'lodash';
import { HANDSET_STATUS } from '../core/common/constants';
import dateHelper from '../utils/dateHelper';

export function returnHandset(data, redirect = '/') {
    return function (dispatch) {
        let handset = mapToDto(data);
        HandsetsService.returnHandset(handset, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.RETURN_HANDSET, redirect);
            }
            return dispatch({
                type: types.RETURN_HANDSET,
                handset: result.data,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        })
    }
}

export function searchHandsets(query, redirect = '/', type = types.GET_HANDSETS) {
    return function (dispatch) {
        let params = getParams(query);
        // params['type.id'] = _.get(query, 'type.id', undefined);
        params['handsetTypeId'] = _.get(query, 'handsetTypeId', undefined);
        params['status'] = query.status;
        params['identifier'] = _.get(query, 'identifier') ? "%" + query.identifier : undefined;
        params["assignee.id"] = query.assignee;
        params["storeLoc.id"] = query.storeLocIds;
        params = _.omitBy(params, _.isUndefined);

        HandsetsService.searchHandsets(params, function (error, result) {
            if (error) {
                return catchError(error, dispatch, type);
            }
            const handsets = mapFromDtos(result.items);
            return dispatch({
                type,
                handsets,
                meta: result.meta
            });
        });
    };
}

export function getHandsetTypes() {
    return function (dispatch) {
        HandsetsService.getHandsetTypes(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.HANDSET_TYPES);
            }
            const handsetTypes = mapFromHandsetSummaryDTO(result.items);
            return dispatch({
                type: types.HANDSET_TYPES,
                handsetTypes,
                meta: result.meta
            });
        });
    };
}

export function assignHandset(handset, employeeId) {
    return function (dispatch) {
        let handsetClone = _.cloneDeep(handset);
        handsetClone.assignee = { id: employeeId };
        handsetClone.status = HANDSET_STATUS.ASSIGNED;
        handsetClone.receivedDate = dateHelper.localToUTC(handsetClone.receivedDate);
        handsetClone = mapToDto(handsetClone);

        HandsetsService.assignedHandset(handsetClone, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.ASSIGNED_HANDSET);
            }
            const handset = mapFromHandsetDTO(result.data);

            return dispatch({
                type: types.ASSIGNED_HANDSET,
                handset,
                meta: result.meta
            });
        });
    };
}

export function loadHandsetSummary(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params['type'] = queryString.handsetType ? "%" + queryString.handsetType : undefined;
        params["storeLocIds"] = queryString.storeLocIds;
        params = _.omitBy(params, _.isUndefined);
        HandsetsService.loadHandsetSummary(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_HANDSET_SUMMARY, redirect);
            }
            let handsetSummary = mapFromHandsetSummaryDTO(result.items);
            return dispatch({
                type: types.LOAD_HANDSET_SUMMARY,
                handsetSummary,
                meta: result.meta
            });
        });
    };
}

export function loadStoreLocs(redirect = '/') {
    return function (dispatch) {
        HandsetsService.loadStoreLocs(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_STORE_LOCS, redirect);
            }
            let storeLocs = mapFromStoreLocDtos(result.items);
            return dispatch({
                type: types.LOAD_STORE_LOCS,
                storeLocs
            });
        });
    };
}

export function addHandsetType(handsetType, redirect = '/') {
    return function (dispatch) {
        HandsetsService.addHandsetType(handsetType, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.RETURN_HANDSET, redirect);
            }
            return dispatch({
                type: types.RETURN_HANDSET,
                meta: result.meta
            })
        })
    }
}

export function addHandset(handset, redirect = '/') {
    return function (dispatch) {
        let params = handset;
        params['type'] = { id: _.get(handset, 'handsetType.id', undefined) };
        params['handsetType'] = undefined;
        params['receivedDate'] = dateHelper.localToUTC(handset.receivedDate);
        params = _.omitBy(params, _.isUndefined);
        HandsetsService.addHandset(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.RETURN_HANDSET, redirect);
            }
            return dispatch({
                type: types.RETURN_HANDSET,
                meta: result.meta
            });
        });
    };
}

export function editHandsetType(handsetTypeId, handsetType, redirect = '/') {
    return function (dispatch) {
        HandsetsService.editHandsetType(handsetTypeId, handsetType, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_HANDSET_TYPE, redirect);
            }
            return dispatch({
                type: types.EDIT_HANDSET_TYPE,
                meta: result.meta
            })
        })
    }
}

export function deleteHandset(handsetId, redirect = '/') {
    return function (dispatch) {
        HandsetsService.deleteHandset(handsetId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_HANDSET, redirect);
            }
            return dispatch({
                type: types.DELETE_HANDSET
            })
        })
    }
}

export function loadHandset(handsetId, redirect = '/') {
    return function (dispatch) {
        HandsetsService.loadHandset(handsetId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_HANDSET, redirect);
            }
            let handset = mapFromHandsetDTO(result.data);
            return dispatch({
                type: types.LOAD_HANDSET,
                handset
            })
        })
    }
}

export function transferHandsets(data, type = types.TRANSFER_HANDSETS) {
    return function (dispatch) {
        HandsetsService.transferHandsets(data, function (error, result) {
            if (error) {
                return catchError(error, dispatch, type);
            }
            const handsets = mapFromDtos(result.items);

            return dispatch({
                type,
                handsets,
                meta: result.meta
            });
        });
    };
}

export function editHandset(handset, type = types.EDIT_HANDSET) {
    return function (dispatch) {
        let handsetDto = mapToDto(handset);
        HandsetsService.editHandset(handsetDto.id, handsetDto, function(error, result) {
            if (error) {
                return catchError(error, dispatch, type);
            }
            let handset = mapFromHandsetDTO(result.data);
            return dispatch({
                type,
                handset
            })
        })
    }
}

export function assignHandsets(data, type = types.ASSIGNED_HANDSETS) {
    return function (dispatch) {
        HandsetsService.assignHandsets(data, function (error, result) {
            if (error) {
                return catchError(error, dispatch, type);
            }
            const handsets = mapFromDtos(result.items);

            return dispatch({
                type,
                handsets,
                meta: result.meta
            });
        });
    };
}