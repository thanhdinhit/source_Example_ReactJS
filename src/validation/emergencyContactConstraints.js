import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_PHONE } from '../core/common/constants';

export function getEmergencyConstraints() {
    return {
        name: Constraints.requiredWithMessage(RS.getString('E110', 'CONTACT_NAME')),
        phone: _.assign({},Constraints.requiredWithMessage(RS.getString('E110', 'PHONE_NUMBER')), Constraints.format(REGEX_PHONE, RS.getString('E140')))
    };
}