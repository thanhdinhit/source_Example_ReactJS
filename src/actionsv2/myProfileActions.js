import { handleError, getParams } from "../services/common";
import * as MyProfileService from "../services/myProfile.service";
import * as myProfileDTO from "../services/mapping/myProfileDTO";

import { store } from "../root";

export function loadApprovers(callback) {
  MyProfileService.getMyApprovers(function(error, result) {
    if (error) {
      return callback && callback(handleError(error, store.dispatch));
    }
    let approvers = myProfileDTO.mapFromApproversDTO(result.items);
    callback && callback(null, approvers);
  });
}
