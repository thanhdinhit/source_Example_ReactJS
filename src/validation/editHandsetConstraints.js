import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_EMAIL_CAN_EMPTY, REGEX_PAYRATE, REGEX_PHONE, REGEX_NUMBER } from '../core/common/constants'
import _ from 'lodash';
export function getEditHandsetConstraints() {
    let today = new Date();
    let newDate = new Date();
    newDate.setDate(today.getDate() - 1);
    return {
        date: function (min, max) {
            return _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'DATE')),
                Constraints.isValidDate(min, max));
        },
        serialNumber: _.assign({}, Constraints.requiredWithMessage('E110', 'SERIAL_NUMBER')),
        imei: _.assign({}, Constraints.requiredWithMessage('E110', 'IMEI')),
        group: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'GROUP'))),
        assignee: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'ASSIGNEE'))),
    };
}