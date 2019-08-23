import Constraints from './common.constraints';
import RS from '../resources/resourceManager';

export function getGroupConstraints() {
    return {
        name: Constraints.requiredWithMessage(RS.getString('E110', 'NAME')),
        type: Constraints.requiredWithMessage(RS.getString('E126', 'DEPARTMENT_TYPE')),
        parent: Constraints.requiredWithMessage(RS.getString('E126', 'PARENT')),
        state: Constraints.requiredWithMessage(RS.getString('E126', 'COUNTRY_STATE'))
    };
}