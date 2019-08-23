import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import _ from 'lodash';
export function getMyProfileConstraints() {
    return {
        email: _.assign({}, Constraints.requiredWithMessage(RS.getString('E110', 'EMAIL')), Constraints.emailWithMessage(RS.getString('E102'))),
    };
}