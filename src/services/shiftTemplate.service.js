import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadShiftTemplatesSetting = function (data, callback) {
    let path = getApiPath(API.SHIFT_TEMPLATE);
    return HttpRequests.get(path, callback);
};