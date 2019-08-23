import { handleError, getParams } from "../services/common";
import * as JobRoleService from "../services/jobRole.service";
import * as jobRoleDTO from "../services/mapping/jobRoleSettingDto";

import { store } from "../root";

export function loadJobRolesSetting(queryString, callback) {
    let params = getParams(queryString);
    JobRoleService.searchJobRoles(params, function(error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let jobRoles = jobRoleDTO.mapFromDto(result.items);
        callback && callback(null, jobRoles, result.meta);
    });
}