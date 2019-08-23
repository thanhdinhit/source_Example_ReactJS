import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadNotifications = function (data, callback) {
    let path = getApiPath(API.SEARCH_NOTIFICATIONS);
    return HttpRequests.post(path, data, callback);
}

export const loadNotificationDetail = function (params, callback) {
    let path = getApiPath(API.NOTIFICATION_DETAILS, params);
    return HttpRequests.get(path, callback);
}

export const updateNotification = function (notificationId, notificationDto, callback) {
    let path = getApiPath(API.NOTIFICATION_DETAILS, { notificationId });
    return HttpRequests.put(path, notificationDto, callback);
}

export const deleteNotification = function (notificationId, callback) {
    let path = getApiPath(API.NOTIFICATION_DETAILS, { notificationId });
    return HttpRequests.delete(path, {}, callback);
}


export const deleteNotifications = function (data, callback) {
    let path = getApiPath(API.NOTIFICATIONS);
    return HttpRequests.delete(path, data, callback);
}
