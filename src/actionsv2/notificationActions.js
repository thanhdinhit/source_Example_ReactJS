import { handleError } from '../services/common';
import { mapFromDto } from '../services/mapping/notificationDTO';
import * as NotificationService from '../services/notification.service';

export function loadNotificationDetail(notificationId, callback) {
    const params = {
        notificationId
    };
    NotificationService.loadNotificationDetail(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let notification = mapFromDto(result.data);
        callback & callback(error, notification);
    });
}