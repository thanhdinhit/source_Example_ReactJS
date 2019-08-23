import Constraints from './common.constraints';
import RS from '../resources/resourceManager';

export function getJobRoleConstraints() {
    return {
        name: Constraints.requiredWithMessage(RS.getString('E110', 'JOBROLE')),
        jobSkills: Constraints.requiredWithMessage(RS.getString('E126', 'SKILLS')),
        color: Constraints.requiredWithMessage(RS.getString('E126', 'COLOR'))
    };
}