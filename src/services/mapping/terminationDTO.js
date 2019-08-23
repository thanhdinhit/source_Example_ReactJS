import dateHelper from '../../utils/dateHelper';
import { DATETIME } from '../../core/common/constants';
import _ from 'lodash';

export function mapToTerminationReason(terminationReason) {
    return terminationReason.map(function (item) {
        return item.data;
    });
}

export function mapToRejoinDTO(rejoinedDate) {
    return {
        rejoinDate: dateHelper.localToUTC(rejoinedDate)
    };
}

export function mapFromTerminations(terminations) {
    return _.map(terminations, function (item) {
        if (item.data) {
            ['startDate', 'terminatedDate'].forEach(function (key) {
                item.data[key] = dateHelper.formatTimeWithPattern(new Date(item.data[key]), DATETIME.DATE);
            });
        }
        return item;
    });
}

export function mapToTerminationDTO(termination) {
    ['startDate', 'terminatedDate'].forEach(function (key) {
        termination[key] = dateHelper.localToUTC(termination[key]);
    });
    return termination;
}