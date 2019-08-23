import _ from 'lodash';

import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_PAYRATE } from '../core/common/constants';

export function getPayRateContraint() {
    return {
        regular: _.assign({}, Constraints.isNumeric(0, RS.getString('E133')), Constraints.format(REGEX_PAYRATE, RS.getString('E133'))),
    };
}