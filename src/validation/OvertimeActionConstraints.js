import Constraints from './common.constraints';
import RS from '../resources/resourceManager';

export function getOvertimeActionConstraints() {
    return {
        reason: Constraints.requiredWithMessage(RS.getString('E110', 'REASON'))
    };
}