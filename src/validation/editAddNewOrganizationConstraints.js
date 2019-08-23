import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';

export function getEditAddNewOrganizationConstraints() {
    return {
        name: Constraints.requiredWithMessage(RS.getString('E110', 'NAME')),
        groups: Constraints.requiredWithMessage(RS.getString('E110', 'PARENT_GROUP')),
        states: Constraints.requiredWithMessage(RS.getString('E110', 'STATE')),
        managedBy: Constraints.requiredWithMessage(RS.getString('E110', 'MANAGED_BY')),
    };
}