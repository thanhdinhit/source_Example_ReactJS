import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_PAYRATE } from '../core/common/constants'
import _ from 'lodash';
export function getContractConstraints() {
    let today = new Date();
    let newDate = new Date();
    newDate.setDate(today.getDate()-1);
    return {
        customer: Constraints.requiredWithMessage(RS.getString('E110', 'CUSTOMER')),
        identifier: Constraints.requiredWithMessage(RS.getString('E110', 'CONTRACT_ID')),
        startDate: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'START_DATE'))),
        endDate: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'END_DATE'), Constraints.isValidDate(today,null,RS.getString("E142",['START_DATE','TODAY']))), Constraints.isValidDate(newDate, null, RS.getString("E142", ['END_DATE', 'START_DATE']))),
        contractValue: _.assign({}, Constraints.isNumeric(), Constraints.format(REGEX_PAYRATE, RS.getString('E133'))),
        shiftStartTime: Constraints.requiredWithMessage(RS.getString('E110', 'START_TIME')),
        shiftEndTime: Constraints.requiredWithMessage(RS.getString('E110', 'END_TIME')),
        shiftBreakTimeFrom: Constraints.requiredWithMessage(RS.getString('E110', 'START_TIME')),
        shiftBreakTimeTo: Constraints.requiredWithMessage(RS.getString('E110', 'END_TIME')),
    };
}