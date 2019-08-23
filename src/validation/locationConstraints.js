import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_LAT_LNG, REGEX_RADIUS } from '../core/common/constants'

export function getLocationConstraints() {
    return {
        locationName: Constraints.requiredWithMessage(RS.getString('E110', 'LOCATION_NAME')),
        address: Constraints.requiredWithMessage(RS.getString('E110', 'ADDRESS')),
        latlng: Constraints.format(REGEX_LAT_LNG, RS.getString('E133')),
        radius: Constraints.format(REGEX_RADIUS, RS.getString('E133')),
    };
}