import Constraints from './common.constraints';
import RS from '../resources/resourceManager';
import { REGEX_NUMBER } from '../core/common/constants';
import { constants } from 'os';

export function getHandsetsConstraints() {
    return {
        handsetsReturnDate: Constraints.requiredWithMessage(RS.getString('E110', 'DATE')),
        handsetAssignDate: Constraints.requiredWithMessage(RS.getString('E110', 'DATE')),
        handsetType: Constraints.requiredWithMessage(RS.getString('E110','HANDSET_TYPE')),
        handsetId: Constraints.requiredWithMessage(RS.getString('E110','HANDSET_ID')),
        imei: Constraints.requiredWithMessage(RS.getString('E110','IMEI')),
        serialNumber: Constraints.requiredWithMessage(RS.getString('E110','SERIAL_NUMBER')),
        receivedDate: Constraints.requiredWithMessage(RS.getString('E110','RECEIVED_DATE')),
        unitPrice: Constraints.format(REGEX_NUMBER, RS.getString('E141')),
        assignee: Constraints.requiredWithMessage(RS.getString('E110', 'ASSIGNEE')),
        group: Constraints.requiredWithMessage(RS.getString('E110', 'GROUP'))
    };
}