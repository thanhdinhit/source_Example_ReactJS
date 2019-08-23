import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_EMAIL, REGEX_PHONE, REGEX_NUMBER } from '../core/common/constants'
export function getCustomerConstraints() {
    return {
        customerName: Constraints.requiredWithMessage(RS.getString('E110', 'CUSTOMER_NAME')),
        contactName: Constraints.requiredWithMessage(RS.getString('E110', 'CONTACT_NAME')),
        position: Constraints.requiredWithMessage(RS.getString('E110', 'POSITION')),
        email: Constraints.format(REGEX_EMAIL, RS.getString('E102')),
        mobilePhone: _.assign({},Constraints.requiredWithMessage(RS.getString('E110', 'MOBILE_PHONE')),  Constraints.format(REGEX_PHONE, RS.getString('E140'))),
        telePhone: _.assign({},Constraints.requiredWithMessage(RS.getString('E110', 'TELEPHONE')), Constraints.format(REGEX_NUMBER, RS.getString('E140'))),
        billingAddress: Constraints.requiredWithMessage(RS.getString('E110', 'BILLING_ADDRESS')),
        supervisors : Constraints.requiredWithMessage(RS.getString('E110', 'MANAGED_BY'))
    };
}