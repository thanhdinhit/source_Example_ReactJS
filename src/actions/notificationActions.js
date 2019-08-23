import * as types from '../constants/actionTypes';
import { checkError, catchError, getParams, removeUndefinedParams } from '../services/common';
import { mapFromDtos, mapFromDto, mapToDto } from '../services/mapping/notificationDTO';
import * as NotificationService from '../services/notification.service';
import { getUrlPath } from '../core/utils/RoutesUtils';
import { URL } from '../core/common/app.routes';

export function loadNotifications(queryString, type = types.LOAD_NOTIFICATIONS, redirect = '/' ) {
    return function (dispatch) {
        let params = getParams(queryString);
        params.employeeId = queryString.employeeId;
        params = removeUndefinedParams(params);

        NotificationService.loadNotifications(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }

            let notifications = mapFromDtos(result.items);
            return dispatch({
                type: type,
                notifications,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadNotificationDetail(notificationId, redirect = '/', type = types.LOAD_NOTIFICATION_DETAILS) {
    return function (dispatch) {
        const params = {
            notificationId
        };
        NotificationService.loadNotificationDetail(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let notification = mapFromDto(result.data);
            return dispatch({
                type: type,
                notification,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function updateNotification(notificationId, notification, redirect = '/') {
    return function (dispatch) {
        const notificationDto = mapToDto(notification);
        NotificationService.updateNotification(notificationId, notificationDto, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_NOTIFICATION, redirect);
            }
            const notification = mapFromDto(result);
            return dispatch({
                type: types.UPDATE_NOTIFICATION,
                notification
            });
        });
    };
}

export function deleteNotification(notificationId, redirect = '/') {
    return function (dispatch) {
        NotificationService.deleteNotification(notificationId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPDATE_NOTIFICATION, redirect);
            }
            return dispatch({
                type: types.UPDATE_NOTIFICATION,
            });
        });
    };
}


export function deleteNotifications(data, redirect = '/') {
    return function (dispatch) {
        let datas = {};
        datas.ids = data;
        NotificationService.deleteNotifications(datas, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_NOTIFICATIONS, redirect);
            }
            return dispatch({
                type: types.DELETE_NOTIFICATIONS,
            });
        });
    };
}