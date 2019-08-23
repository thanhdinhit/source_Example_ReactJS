import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_PASSWORD } from '../core/common/constants'
import _ from 'lodash';
export function getPasswordConstraints() {
    return {
        curPass: Constraints.requiredWithMessage(RS.getString('E127')),
        confirmPass: Constraints.requiredWithMessage(RS.getString('E128')),
        password: _.assign({}, Constraints.requiredWithMessage(RS.getString('E117')),
            Constraints.length(6, 255, RS.getString('E119')),
            Constraints.format(REGEX_PASSWORD, RS.getString('E118')))
    };
}