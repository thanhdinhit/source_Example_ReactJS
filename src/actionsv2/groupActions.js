import { handleError, encodeURL, getParams, removeUndefinedParams } from '../services/common';
import { mapFromDtos } from '../services/mapping/groupDTO';
import * as GroupService from '../services/group.service';

export function loadManagedGroups(issub, callback) {
    let stringParms = { issub: issub };
    GroupService.loadManagedGroups(stringParms, function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let managedGroups = _.map(result.items, (item) => { return item.data });
        callback && callback(undefined, managedGroups);
    });
}

export function loadAllGroup(queryString, callback) {
    let params = getParams(queryString);
    params['name'] = queryString.name ? "%" + queryString.name : undefined;
    params['state.id'] = queryString.stateIds;
    params['supervisorId'] = queryString.supervisorIds;
    params['parentId'] = queryString.parentIds;
    params = removeUndefinedParams(params);
    GroupService.searchGroups(params, (error, result) => {
        if (error) {
            return callback && callback(handleError(error));
        }
        let groups = mapFromDtos(result.items);
        callback && callback(undefined, groups);
    });
}

export function loadGroup(groupId, callback) {
    GroupService.loadGroup({ groupId }, function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        callback && callback(undefined, result.data);
    });
}

export function loadSupervisors(callback) {
    GroupService.loadSupervisors(function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let supervisors = result.items.map(x => x.data);
        callback && callback(undefined, supervisors);
    });
}

export function deleteGroup(groupId, callback) {
    const params = {
        groupId: groupId
    };
    GroupService.deleteGroup(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        callback && callback(undefined, result.data);
    });
}

export function loadAllBaseGroup(callback) {
    GroupService.loadAllBaseGroup(function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let baseGroups = mapFromDtos(result.items);
        callback && callback(undefined, baseGroups);
    });
}