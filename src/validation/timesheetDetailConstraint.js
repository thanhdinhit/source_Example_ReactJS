import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';

export function getTimesheetDetailConstraints() {
    return {
        customer: Constraints.requiredWithMessage(RS.getString('E110', 'CUSTOMER')),
        schedule: Constraints.requiredWithMessage(RS.getString('E110', 'SCHEDULE')),
        location: Constraints.requiredWithMessage(RS.getString('E110', 'LOCATION')),
        type: Constraints.requiredWithMessage(RS.getString('E110', 'TYPE')),
        approvedHour: Constraints.requiredWithMessage(RS.getString('E110', 'APPROVED_HOURS')),
        approvedMinute: Constraints.requiredWithMessage(RS.getString('E110', 'APPROVED_MINUTE')),
        comment: Constraints.requiredWithMessage(RS.getString('E110', 'COMMENT'))
    };
}