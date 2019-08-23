import Constraints from './common.constraints';
import RS from '../resources/resourceManager';

export function getNewScheduleConstraints() {
    return {
        scheduleName: Constraints.requiredWithMessage(RS.getString('E110', 'SCHEDULE_NAME')),
        location: Constraints.requiredWithMessage(RS.getString('E110', 'LOCATION')),
    };
}