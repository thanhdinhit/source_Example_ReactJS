import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';

export function getNewLeaveConstraints() {
    return {
        leaveType: Constraints.requiredWithMessage(RS.getString('E110', 'LEAVE_TYPE')),
        startDate: function (max) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'START_DATE')),
                Constraints.isValidDate(null, max)
            );
        },
        startTime: function (max) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'START_TIME')),
                Constraints.isValidTime(null, max)
            );
        },
        endDate: function (min) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'END_DATE')),
                Constraints.isValidDate(min, null, RS.getString("E142",['END_DATE','START_DATE']))
            );
        },
        endTime: function (min) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'END_TIME')),
                Constraints.isValidTime(min, null, RS.getString("E142",['END_TIME','START_TIME']))
            );
        },
        approver: Constraints.requiredWithMessage(RS.getString('E110', 'APPROVER')),
        reason: Constraints.requiredWithMessage(RS.getString('E110', 'REASON')),
        leaveHours: function (val) {
            return Constraints.lessThan(val);
        }
    };
}