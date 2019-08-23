import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';

export function getEmployeeTransferContraints() {
    return {
        group: Constraints.requiredWithMessage(RS.getString('E110', 'TARGET_GROUP')),
        startDate: function (min, max) {
            return _.assign({},
                Constraints.requiredWithMessage(RS.getString('E110', 'DATE')),
                Constraints.isValidDate(min, max)
            );
        },
    };
}