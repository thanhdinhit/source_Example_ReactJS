import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';

export function getNewOvertimeConstraints() {
    return {
        customerName: Constraints.requiredWithMessage(RS.getString('E110', 'CUSTOMER_NAME')),
        contractID: Constraints.requiredWithMessage(RS.getString('E110', 'CONTRACT_ID')),
        location: Constraints.requiredWithMessage(RS.getString('E110', 'LOCATION')),
        payRate: Constraints.requiredWithMessage(RS.getString('E110', 'PAY_RATE')),
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
                Constraints.isValidDate(min, null)
            );
        },
        endTime: function (min) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'END_TIME')),
                Constraints.isValidTime(min, null)
            );
        },
  
    };
}