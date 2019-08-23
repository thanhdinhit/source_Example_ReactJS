import initGlobal from '../Auth/initialState';
import { clone } from '../../services/common';
export default {
    leaveSettings: {
        leaveType: [],
        remindType: [],
        escalateType: [],
        truncateType: [],
        sick: [],
        longServiceLeave: []
    },
    location:{
        type:{value:'Building', label:'Building'}
    },
    leaveSetting: {
        isSubmit: false,
        annualDay: '',
        othersDay: '',
        leaveWithoutPaidDay: '',
        timeInLieuDay: '',
        studyDay: '',
        specialDay: '',
        maternityDay: '',
        sickWithCertificateDay: '',
        sickWithoutCertificateDay: '',
        longServiceLeaveDay: '',
        longServiceLeaveYear: '',
        longServiceLeaveIncreaseDays: '',
        remindAfterSubmitDay: '',
        remindBeforeStartLeaveDay: '',
        truncate: '',
        notifyBefore: '',
        escalateAfterSubmitDay: '',
        escalateBeforeStartLeaveDay: '',
        enableAnnual: false,
        enableOthers: false,
        enableLeaveWithoutPaid: false,
        enableTimeInLieu: false,
        enableStudy: false,
        enableSpecial: false,
        enableSick: false,
        enableMaternity: false,
        enableLongServiceLeave: false,
        remindAfterSubmit: true,
        remindBeforeStartLeave: false,
        escalateAfterSubmit: true,
        escalateBeforeStartLeave: false
    },
    payload: {
        success: false,
        isLoading: false,
        error: {
            status: 0,
            code: 0,
            message: '',
            exception: false
        }
    }
}