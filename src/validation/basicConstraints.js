import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_EMAIL_CAN_EMPTY, REGEX_PAYRATE, REGEX_PHONE, REGEX_NUMBER } from '../core/common/constants'
import _ from 'lodash';
export function getBasicConstraints() {
    let today = new Date();
    let newDate = new Date();
    newDate.setDate(today.getDate()-1);
    return {
        firstName: Constraints.requiredWithMessage(RS.getString('E110', 'FIRST_NAME')),
        lastName: Constraints.requiredWithMessage(RS.getString('E110', 'LAST_NAME')),
        address: Constraints.requiredWithMessage(RS.getString('E110', 'ADDRESS')),
        email: Constraints.format(REGEX_EMAIL_CAN_EMPTY, RS.getString('E102')),
        birthday: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'BIRTH_DAY')),
            Constraints.isValidDate(null, new Date())),
        expiredCertificate: _.assign({}, Constraints.dateWithMessage(RS.getString('E103')),
            Constraints.requiredWithMessage(RS.getString('E103'))),
        group: Constraints.requiredWithMessage(RS.getString('E110', 'GROUP')),
        type: Constraints.requiredWithMessage(RS.getString('E110', 'EMPLOYEE_TYPE')),
        location: Constraints.requiredWithMessage(RS.getString('E110', 'LOCATION')),
        accessRoles: Constraints.requiredWithMessage(RS.getString('E110', 'USER_ROLE')),
        jobRole: Constraints.requiredWithMessage(RS.getString('E132', 'JOBROLE')),
        terminatedDate: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'TERMINATED_DATE'))),
        terminationType: Constraints.requiredWithMessage(RS.getString('E110', 'TYPE')),
        terminationReason: Constraints.requiredWithMessage(RS.getString('E110', 'REASON')),
        terminationComment: Constraints.requiredWithMessage(RS.getString('E110', 'COMMENT')),
        rejoinedDate: Constraints.requiredWithMessage(RS.getString('E110', 'REJOINED_DATE')),
        phone: Constraints.format(REGEX_PHONE, RS.getString('E140')),
        deskPhone: Constraints.format(REGEX_NUMBER, RS.getString('E140')),
        cardIdNumber: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110','ID_CARD')), Constraints.format(REGEX_NUMBER,RS.getString('E141')))
    };
}