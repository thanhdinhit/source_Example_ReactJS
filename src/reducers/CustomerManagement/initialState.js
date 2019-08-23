import { CONTRACT_RATE_TYPE } from '../../core/common/constants'
export default {
    newContract: {
        customer: {},
        identifier: '',
        group: {},
        rateType: CONTRACT_RATE_TYPE.PER_MONTH,
        ratePrice: 0,
        startDate: undefined,
        endDate: undefined,
        status: undefined,
        attachments: [],
        links: [],
        schedules: [],
        flexibleSchedules: []
    },
    contracts: []
}