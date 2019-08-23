import _ from 'lodash';
import dateHelper from '../../utils/dateHelper'
import { DATETIME, NOTIFICATION_STATUS, REGEX_UTC_TIME } from '../../core/common/constants';

export const mapFromDtos = function (resultAPIs) {
    let informations = [], confirmations = [];

    if (resultAPIs.length > 0) {
        _.each(resultAPIs, (item) => {
            item = mapFromDto(item.data);
            if (item.type == 'Information') {
                informations.push(item);
            } else if (item.type == 'Confirmation') {
                confirmations.push(item);
            }
        });
    }
    let totalInformation = _.size(_.filter(informations, (item) => item.status == NOTIFICATION_STATUS.UNREAD));
    let totalConfirmation = _.size(_.filter(confirmations, (item) => item.status == NOTIFICATION_STATUS.UNREAD));

    return { informations, confirmations, totalInformation, totalConfirmation };
}

export const mapFromDto = function (resultAPI) {
    let notificationDto = {};
    notificationDto = resultAPI;
    let match;
    do {
        match = REGEX_UTC_TIME.exec(notificationDto.content);
        if (match) {
            let datetime = new Date(match[0]);
            notificationDto.content = notificationDto.content.replace(match[0], dateHelper.formatTimeWithPattern(datetime, DATETIME.DATE_TIME));
        }
    } while (match);
    notificationDto.createdDate = new Date(notificationDto.createdDate);
    return notificationDto;
}

export const mapToDto = function (notificationDto) {
    let newDTO = {};
    newDTO = notificationDto;
    newDTO.createdDate = dateHelper.formatTimeWithPattern(newDTO.createdDate, DATETIME.DATE_OVERTIME);
    return newDTO;
}