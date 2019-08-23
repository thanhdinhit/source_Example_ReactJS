import { STATUS, WORKING_TIME_TYPE , WEEKDAYS} from '../../core/common/constants'
import RS from '../../resources/resourceManager'
export default {
    newEmployee: {
        contactDetail: {
            firstName: '',
            lastName: '',
            gender: {
                value: 'Male', label: RS.getString('MALE')
            },
            birthday: undefined,
            photoUrl: '',
            identifier: '',
            emergencyContacts: [],
            group: undefined,
            startDate: undefined,
            type: undefined,
            accessRoles: undefined,
            workingLocationType: undefined,
            location: undefined,
            isIgnoreGpsTracking: false,
            workMobile: '',
            deskPhone: '',
            email: '',
            privateMobile: '',
            homePhone: '',
            street: '',
            district: undefined,
            city: undefined,
            state: undefined,
            postCode: '',
            isRequireTimeClock: true
        },
        time: {
            workingTimeType: WORKING_TIME_TYPE.STANDARD_WORKING_TIME,
            availabilityTime: {
                mon: [{weekday: WEEKDAYS.MON, startTime: "00:00:00", endTime: "23:59:59"}],
                tue: [{weekday: WEEKDAYS.TUE, startTime: "00:00:00", endTime: "23:59:59"}],
                wed: [{weekday: WEEKDAYS.WED, startTime: "00:00:00", endTime: "23:59:59"}],
                thu: [{weekday: WEEKDAYS.THU, startTime: "00:00:00", endTime: "23:59:59"}],
                fri: [{weekday: WEEKDAYS.FRI, startTime: "00:00:00", endTime: "23:59:59"}],
                sat: [{weekday: WEEKDAYS.SAT, startTime: "00:00:00", endTime: "23:59:59"}],
                sun: [{weekday: WEEKDAYS.SUN, startTime: "00:00:00", endTime: "23:59:59"}]
            },
            workingTime: {
                mon: [],
                tue: [],
                wed: [],
                thu: [],
                fri: [],
                sat: [],
                sun: []
            }
        },
        job: {
            jobRole: undefined,
            employeeJobSkills: [],
            payRate: 0
        },
        attachment: {
            files: []
        }
    },
    overtime: {
        employee: {},
        location: {},
        manager: {},
        overtimeStatus: '',
        comment: '',
        overtimeFrom: '',
        overtimeTo: ''
    },
    requestOTEmployees: [],
    validated: {
        validatedEmailResult: STATUS.VALIDATING,
        validatedWorkingPhoneResult: STATUS.VALIDATING,
        validatedAccountResult: STATUS.VALIDATING
    },
    validatedResult: {},
    timeClock: {
        todayShifts: {},
        status: "",
        currentTime: new Date(),
        latestClockInTime: undefined,
        latestClockInOffice: {}
    },
    newOvertime: {
        employees:[]
    }
}