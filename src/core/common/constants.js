import RS, { Option } from '../../resources/resourceManager'
export const AVAILABILITY = {
    TIME_PER_DAY: 96,
    MIN_WIDTH_SHOW_TIME_DURATION: 100,
    MIN_WIDTH_SHOW_TIME_DURATION_VIEW: 100,
    MIN_WIDTH_SHOW_TIME_DURATION_WITH_ERROR: 120,
    MIN_WIDTH_SHOW_TIME_DURATION_VIEW_WITH_ERROR: 120,
    HOURS_PER_DAY: 24,
    MIN_DISTANCE_MINUTE: 15,
    MAX_WIDTH_PIXEL: 1056,
    MIN_WIDTH_PIXEL: 88,
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
    SUN: 'Sunday'
};

export const colorDefaultColorPicker = [
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#127fd5", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
    "#374046", "#607d8b", "#9e9e9e", "#795548", "#ff5722", "#ff9800", "#ffc107", "#ffeb3b", "#b4d444", "#a9e365"
]

export const defaultColor = '#00bcd4';

export const STATUS = {
    APPROVED: "Approved",
    PENDING: "Pending",
    DECLINED: "Declined",
    ACCEPTED: "Accepted",
    CANCELED: "Canceled",
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    UPLOAD: 'Upload',
    FAILED_TYPE_NOT_SUPPORT: 'Failed_Type_Not_Support',
    FAILED_OVERSIZE: 'Failed_Oversize',
    VALIDATING: 'Validating',
    IS_EXISTED: 'Is_Existed',
    NEARLY_EXPIRED: 'Nearly_Expired',
    EXPIRED: 'Expired',
    CLOCK_IN: 'Clock_in',
    CLOCK_OUT: 'Clock_out',
};

export const TIMESHEET_PERIOD_TYPE = {
    MONTH: 'Month',
    FORTNIGHT: 'Fortnight',
    WEEK: 'Week',
    MANUAL: 'Manual'
};

export const getSchedulePeriod = function () {
    return [
        {
            value: TIMESPAN.WEEK,
            label: RS.getString(TIMESPAN.WEEK)
        },
        {
            value: TIMESPAN.TWO_WEEKS,
            label: RS.getString(TIMESPAN.TWO_WEEKS)
        },
        {
            value: TIMESPAN.THREE_WEEKS,
            label: RS.getString(TIMESPAN.THREE_WEEKS)
        },
        {
            value: TIMESPAN.MONTH,
            label: RS.getString(TIMESPAN.MONTH)
        },
    ]
}


export const LEAVE_ACTION_TYPE = {
    APPROVE: 'APPROVE',
    DECLINE: 'DECLINE',
    CANCEL_EMPLOYEE_LEAVE: 'CANCEL_EMPLOYEE_LEAVE',
    CANCEL_MY_LEAVE: 'CANCEL_MY_LEAVE'
};

export const OVERTIME_ACTION_TYPE = {
    APPROVE: 'APPROVE',
    DECLINE: 'DECLINE',
    CANCEL_MY_OVERTIME: 'CANCEL_MY_OVERTIME',
    CANCEL_OVERTIME_REQUEST: 'CANCEL_OVERTIME_REQUEST'
};

export const ACCEPT_EXTENSIONS = [
    'doc', 'docx', '3ds', 'aac', 'ai', 'avi', 'bmp', 'cad', 'cdr', 'css',
    'dat', 'dll', 'dmp', 'esp', 'fla', 'flv', 'gif', 'html', 'indd', 'iso',
    'jpg', 'jpeg', 'js', 'midi', 'mov', 'mp3', 'mpg', 'pdf', 'php', 'png',
    'ppt', 'ps', 'psd', 'raw', 'sql', 'svg', 'tif', 'txt', 'wmv', 'xls',
    'xlsx', 'xml', 'zip'
]

export const COMPONENT_NAME = {
    TIME: 'time',
    AVAILABILITY: 'availabilityTime',
    WORKINGTIME: 'workingTime',
    WORKINGTIMETYPE: 'workingTimeType'
};

export const TOASTR = {
    TIMEOUT_SUCCESS: 2000,
    TIMEOUT_ERROR: 5000
};

export const APPLICATION_SETTING = {
    PERSONAL_SETTINGS: 'personal_settings',
    GENERAL_SETTINGS: 'general_settings',
    LEAVE_MANAGEMENT: 'leave_management',
    EMPLOYEE_MANAGEMENT: 'employee_management',
    SCHEDULE: 'schedule',
    ATTENDANCE: 'attendance',
    ALARM: 'alarm',
    DUREES: 'durees',
    GEO_FENNCING: 'geofencing',
    REPORT: 'report'
};

export const EMPLOYEE_TABS = {
    CONTACT_DETAILS: 0,
    AVAILABILITY_WORKING_TIME: 1,
    JOBROLE_AND_PAY_RATE: 2,
    ATTACHMENT: 3,
    EMERGENCY_CONTACT: 4,
    HANDSETS: 5,
    TERMINATION: 6,
    EMPLOYEE_TRANSFER: 7
};

export const CONTRACT_TABS = {
    GENERAL_INFORMATION: 0,
    CONTENT: 1,
    PREVIEW: 2
};
export const CONTRACT_RATE_TYPE = {
    PER_MONTH: 'Per_Month',
    PER_HOUR: 'Per_Hour'
}
export const getContractRateTypeOptions = function () {
    return [
        {
            value: CONTRACT_RATE_TYPE.PER_MONTH,
            label: RS.getString(CONTRACT_RATE_TYPE.PER_MONTH)
        },
        {
            value: CONTRACT_RATE_TYPE.PER_HOUR,
            label: RS.getString(CONTRACT_RATE_TYPE.PER_HOUR)
        }
    ]
}

export const DATE = {
    FORMAT: 'DD/MM/YYYY',
}
export const DATETIME = {
    MONTH_AND_DATE: 'MMM DD',
    DATE: 'MMM DD, YYYY',
    DATE_TIME: 'DD/MM/YYYY HH:mm',
    FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATE_LEAVE: 'MMM DD, YYYY hh:mm A',
    DATE_OVERTIME: 'DD/MM/YYYY HH:mm',
    DATE_TIMESHEET: 'DD/MM/YYYY HH:mm',
    DATE_CONTRACT: 'MMM DD, YYYY',
    DATE_SHIFT_VIEW: 'MMM DD',
    DATE_NOTIFICATION: 'DD/MM/YYYY hh:mm A',
    DATE_TIMESHEET: 'MMM DD, YYYY hh:mm A',
    DAY_OF_MONTH: 'DD',
    DAY_OF_WEEK_LONG: 'dddd',
};

export const TIMEFORMAT = {
    WITH_SECONDS: "HH:mm:ss",
    WITHOUT_SECONDS: "HH:mm",
    CLOCKED_OUT: "DD/MM/YYYY hh:mm A",
    DATE_WITH_WEEKDAY: "dddd, DD/MM/YYYY",
    TIME_PICKER: "HH:mm",
    OVERTIME: 'MMM DD, YYYY HH:mm',
    END_START_TIME: 'MMM DD, YYYY',
    TIMESHEET: 'MMM DD, hh:mm a',
    GROUP_TIMESHEET: 'MMM DD, YYYY HH:mm ',
    DAY_OF_WEEK: 'ddd',
    DAY_OF_WEEK_LONG: 'dddd',
    SUBMIT_TIMESHEET: 'ddd, MMM DD YYYY',
    CONTRACT_DATETIME: 'MMM DD, YYYY',
    SCHEDULE_COPY: '(MMM DD, YYYY)',
    DATE_TEAM_TIMESHEET: 'ddd, MMM DD',
    CLOCKED_IN_OUT: 'HH:mm A',
    CLOCKED_OUT_OVER: 'HH:mm A (ddd, MMM DD)'
};

export const FILTER_DATE = {
    FORMAT: 'YYYY-MM-DD'
}

export const getGenderOptions = function () {
    return [
        { value: 'Male', label: RS.getString('MALE') },
        { value: 'Female', label: RS.getString('FEMALE') },
        { value: 'Other', label: RS.getString('UNSPECIFIED') }
    ]
}

export const WAITING_TIME = 500;

export const WAITING_TIME_LOAD_STATE = 5000;

export const WATING_TIME_SEARCH = 600;

export const EXPIRED_TIME_TIMESHEET_DATA = 300000; // 5 minutes

export const PAGE_SIZE_DEFAULT = 5;

export const PAGE_SIZE_MORE = 10;

export const YEAR_LIMIT_DELTA = 100;

export const AVAILABILITY_FORMAT = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
}

export const REGEX_EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

export const REGEX_EMAIL_CAN_EMPTY = /^$|([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?)/

export const REGEX_PAYRATE = /^[^.]*$|^[+-]?(\d*\.)?\d+$/;

export const REGEX_PASSWORD = /^[a-z0-9]+$/;

export const REGEX_TIME_PICKER = /^$|(^(0[0-9]|1[0-9]|2[0-3]|[1-9]):([0-5][0-9]|[1-9])$)/;

export const REGEX_PHONE = /^$|^[(]?[\+]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{0,10}$/;

export const REGEX_NUMBER = /^\d+$|^$/;

export const REGEX_RADIUS = /^\d*\.?\d+$/;

export const REGEX_LAT_LNG = /^[+-]?(\d*\.)?\d+$/

export const REGEX_IMAGE = /^image/;

export const REGEX_UTC_TIME = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;

export const FIXNUMBER_PAYRATE = 6;

export const AVATAR_SIZE_LIMIT = 300 //300KB

export const WORKING_TIME_TYPE = {
    STANDARD_WORKING_TIME: 'Standard_working_time',
    DEPEND_ON_SHIFTS: 'Depend_on_shifts',
    CUSTOMIZE: 'Customize',
};

export const getWorkingTimeTypeOptions = function () {
    return [
        { value: WORKING_TIME_TYPE.STANDARD_WORKING_TIME, label: RS.getString('STANDARD_WORKING_TIME') },
        { value: WORKING_TIME_TYPE.DEPEND_ON_SHIFTS, label: RS.getString('DEPEND_ON_SHIFTS') },
        { value: WORKING_TIME_TYPE.CUSTOMIZE, label: RS.getString('CUSTOMIZE_WORKING_TIME') }
    ];
};

export const LOCATION_TYPE = {
    LOCATION: 'Location',
    FIELD_SERVICE: 'Field_service',
    DEPEND_ON_SHIFTS: 'Depend_on_shifts'
}

export const getWorkingLocationTypeOptions = function () {
    return [
        // Move 'location' list from here to databases
        // { id: LOCATION_TYPE.FIELD_SERVICE, name: RS.getString("FIELD_SERVICE") },
        // { id: LOCATION_TYPE.DEPEND_ON_SHIFTS, name: RS.getString("DEPEND_ON_SHIFTS") },
        // { id: LOCATION_TYPE.LOCATION, name: '' }
    ];
};

export const TERMINATION_TYPE = {
    TERMINATION: 'Termination',
    RESIGNATION: 'Resignation'
};

export const getTerminationType = function () {
    return [
        { value: TERMINATION_TYPE.TERMINATION, label: RS.getString('STATUS_TERMINATION') },
        { value: TERMINATION_TYPE.RESIGNATION, label: RS.getString('STATUS_RESIGNATION') }
    ]
};

export const EMPLOYEE_STATUS = {
    ACTIVE: 'Active',
    TERMINATED: 'Terminated'
};

export const KEY_CODE = {
    ENTER: 13
};

export const DEFAULT_MONTH_NOTIFY = 1;

export const getStatusOptions = function () {
    return [
        { value: EMPLOYEE_STATUS.ACTIVE, label: RS.getString("STATUS_ACTIVE") },
        { value: EMPLOYEE_STATUS.TERMINATED, label: RS.getString("STATUS_TERMINATED") }
    ]
};

export const HANDSET_TYPE_ALL = 'HANDSET_TYPE_ALL';

export const IMPORT = 'Import';
export const EXPORT = 'Export';

export const EMPLOYEE_COLUMNS = {
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    GENDER: 'Gender',
    EMPLOYEE_ID: 'Identifier',
    STREET: 'Street',
    STATE: 'State',
    CITY: 'City',
    POST_CODE: 'Postcode',
    EMAIL: 'Email',
    BIRTH_DAY: 'Birthday',
    WORK_MOBILE: 'Work Mobile',
    PRIVATE_MOBILE: 'Private Mobile',
    START_DATE: 'Start Date',
    EMPLOYEE_TYPE: 'Employee Type',
    STATUS: 'Status',
    JOB_ROLE: 'Job Role',
    GROUP: 'Group',
    WORKING_LOCATION: 'Working Location',
    USER_ROLE: 'User Role',
    TERMINATED_DATE: 'Terminated Date'
};

export const EMPLOYEE_LEAVES_TAB = {
    REQUEST_LIST: 0,
    LEAVE_BALANCE: 1
};

export const TIMESPAN = {
    WEEK: 'WEEK',
    MONTH: 'MONTH',
    ONE_WEEK: 'ONE_WEEK',
    ONE_MONTH: 'ONE_MONTH',
    TWO_WEEKS: 'TWO_WEEKS',
    THREE_WEEKS: 'THREE_WEEKS',
    FOUR_WEEKS: 'FOUR_WEEKS',
    FROM_LAST_SUBMISSION: 'FROM_LAST_SUBMISSION',
    FORTNIGHT: 'FORTNIGHT',
    MANUAL: 'MANUAL',
    LAST_MONTH: 'LAST_MONTH',
    LAST_FORTNIGHT: 'LAST_FORTNIGHT',
    LAST_WEEK: 'LAST_WEEK'
};

export const EMPLOYEE_OVERTIMES_TAB = {
    TEAM_OVERTIME: 0,
    STATISTIC: 1,
    MY_OVERTIME: 2
};

export const getOvertimeStatusOptions = function () {
    return [
        { value: STATUS.PENDING, label: RS.getString('STATUS_PENDING') },
        { value: STATUS.DECLINED, label: RS.getString('STATUS_DECLINED') },
        { value: STATUS.ACCEPTED, label: RS.getString('STATUS_ACCEPTED') },
        { value: STATUS.CANCELED, label: RS.getString('STATUS_CANCELED') }
    ]
}

export const OVERTIME_LEVELS = {
    OVERLOAD: 100,
    WARNING_2: 75,
    WARNING_1: 50,
}

export const getTimesheetStatusOptions = function () {
    return [
        { value: STATUS.PENDING, label: RS.getString("STATUS_PENDING") },
        { value: STATUS.APPROVED, label: RS.getString("STATUS_APPROVED") }
    ]
};

export const ACTIONS_CRUD = {
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
}

export const DATA_CONSTANT = {
    LEAVE: {
        SPECIAL_LEAVE: 'Special Leave',
        SICK_LEAVE: 'Sick Leave'
    }
};

export const dateTimeOperatorOptions = [
    { value: 1, label: '=' },
    { value: 2, label: '!=' },
    { value: 3, label: '>' },
    { value: 4, label: '>=' },
    { value: 5, label: '<' },
    { value: 6, label: '<=' }
];

export const QUERY_STRING = {
    PAGE_SIZE: 50
};

export const LEAVE_TYPES = {
    ANNUAL_LEAVE: 'Annual Leave',
    SICK_LEAVE: 'Sick Leave',
    SICK_LEAVE_WITH_CERTIFICATE: 'Sick Leave With Certificate',
    LONG_LEAVE_SERVICE: 'Long Leave Service',
    SPECIAL_LEAVE: 'Special Leave'
};

export const CONTRACT_STATUS = {
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
    COMPLETED: 'Completed',
    TERMINATED: 'Terminated'
};

export const SCHEDULE_MODE = {
    AUTO: 'Auto',
    MANUAL: 'Manual'
};

export const WEEKDAYS = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
    SUN: 'Sunday'
};

export const ENUM_SCHEDULE_TEMPLATE = {
    TEMPLATE_ONE: 'Template_one',
    TEMPLATE_TWO: 'Template_two',
    TEMPLATE_THREE: 'Template_three',
    TEMPLATE_FOUR: 'Template_four',
    TEMPLATE_CUSTOMIZE: 'Customize'
};

export const SCHEDULE_TEMPLATES = [
    {
        id: ENUM_SCHEDULE_TEMPLATE.TEMPLATE_ONE,
        name: 'TEMPLATE_ONE',
        weekdays: {
            mon: { type: 1 },
            tue: { type: 1 },
            wed: { type: 1 },
            thu: { type: 1 },
            fri: { type: 1 },
            sat: { type: 1 },
            sun: { type: 1 }
        }
    },
    {
        id: ENUM_SCHEDULE_TEMPLATE.TEMPLATE_TWO,
        name: 'TEMPLATE_TWO',
        weekdays: {
            mon: { type: 1 },
            tue: { type: 1 },
            wed: { type: 1 },
            thu: { type: 1 },
            fri: { type: 1 },
            sat: { type: 2 },
            sun: { type: 2 }
        }
    },
    {
        id: ENUM_SCHEDULE_TEMPLATE.TEMPLATE_THREE,
        name: 'TEMPLATE_THREE',
        weekdays: {
            mon: { type: 1 },
            tue: { type: 1 },
            wed: { type: 1 },
            thu: { type: 1 },
            fri: { type: 1 },
            sat: { type: 2 },
            sun: { type: 3 }
        }
    },
    {
        id: ENUM_SCHEDULE_TEMPLATE.TEMPLATE_FOUR,
        name: 'TEMPLATE_FOUR',
        weekdays: {
            mon: { type: 1 },
            tue: { type: 1 },
            wed: { type: 1 },
            thu: { type: 1 },
            fri: { type: 1 },
            sat: { type: 1 },
            sun: { type: 2 }
        }
    }
];

export const CUSTOMIZE_SCHEDULE_TEMPLATE = {
    id: ENUM_SCHEDULE_TEMPLATE.TEMPLATE_CUSTOMIZE,
    name: 'TEMPLATE_CUSTOMIZE',
    weekdays: {
        mon: { type: 1 },
        tue: { type: 2 },
        wed: { type: 3 },
        thu: { type: 4 },
        fri: { type: 5 },
        sat: { type: 6 },
        sun: { type: 7 }
    }
};

export const SCHEDULE_STATUS = {
    INITIAL: 'Initial',
    DONE: 'Done',
    INPROGRESS: 'Inprogress',
    PENDING_CHANGES: 'Pending Changes',
    ERROR: 'Error',
    MISSING_RESOURCE: 'Missing Resource',
    UNPUBLISHED: 'Unpublish',
    PUBLISHED: 'Publish',
    TO_BE_NOTIFY: 'ToBeNotify',
    NOTIFIED: 'Notified'
};

export const ERROR_SCHEDULE_STATUS = {
    LEAVE: 'Leave'
};

export const MY_SCHEDULE_STATUS = {
    MOVE_BOTTOM: 'bottom',
    MOVE_LEFT: 'left',
    SIZE_ARROW: 10,
    MORE_LEFT: 16
}

export const LOADING_INDICATOR = {
    APP_LOADING_INDICATOR: 'app-loading-indicator',
    ELEMENT_LOADING_INDICATOR: 'element-loading-indicator'
}

export const MODE_PAGE = {
    VIEW: 'view',
    EDIT: 'edit',
    NEW: 'new'
};

export const BACK_TO_URL = 'back-to-url';
export const THINGS_COME_TO = 'things-come-to';

export const USER_ROLES = {
    EMPLOYEE: 'Employee',
    MANAGER: 'Manager',
    ADMIN: 'Admin'
};

export const CONTRACT_ACTIONS = {
    SUSPEND: 'Suspend',
    TERMINATE: 'Terminate'
};

export const NOTIFICATION_TYPE = {
    INFORMATION: 'Information',
    CONFIRMATION: 'Confirmation'
};

export const NOTIFICATION_STATUS = {
    READ: 'Read',
    UNREAD: 'UnRead'
};

export const LOCATION_MODE = {
    WITHOUT_MAP: 'Without_map',
    WITH_MAP: 'With_map'
}

export const SCHEDULE_OPTION_VALUE = {
    NEXT_30_DAYS: 'Next_30_days',
    NEXT_60_DAYS: 'Next_60_days',
    NEXT_90_DAYS: 'Next_90_days'
}

export const getSchedulesDateRangeOptions = function () {
    return [
        { value: SCHEDULE_OPTION_VALUE.NEXT_30_DAYS, label: RS.getString("NEXT_30_DAYS") },
        { value: SCHEDULE_OPTION_VALUE.NEXT_60_DAYS, label: RS.getString("NEXT_60_DAYS") },
        { value: SCHEDULE_OPTION_VALUE.NEXT_90_DAYS, label: RS.getString("NEXT_90_DAYS") }
    ]
};

export const NOTIFICATION_FEATURE = {
    OVERTIME: 'Overtime',
    LEAVE: 'Leave'
}

export const LOCATION_PHYSIC_TYPE = {
    BUILDING: 'Building',
    FENCE: 'Fence'
}

export const getGeofenceType = function () {
    return [
        { value: LOCATION_PHYSIC_TYPE.BUILDING, label: RS.getString("CIRCLE") },
        { value: LOCATION_PHYSIC_TYPE.FENCE, label: RS.getString("CUSTOM_SHAPE") }
    ]
}

export const HANDSET_STATUS = {
    IN_STOCK: 'In_stock',
    ASSIGNED: 'Assigned',
    LOST: 'Lost',
    FAULTY: 'Faulty',
    DISPOSED: 'Disposed',
    SENT_FOR_REPAIRING: 'Sent_for_repairing'
};

export const getHandsetStatusOptions = function () {
    return [
        { value: HANDSET_STATUS.IN_STOCK, label: RS.getString("HANDSET_IN_STOCK") },
        { value: HANDSET_STATUS.ASSIGNED, label: RS.getString("HANDSET_ASSIGNED") },
        { value: HANDSET_STATUS.LOST, label: RS.getString("HANDSET_LOST") },
        { value: HANDSET_STATUS.FAULTY, label: RS.getString("HANDSET_FAULTY") },
        { value: HANDSET_STATUS.DISPOSED, label: RS.getString("HANDSET_DISPOSED") },
        { value: HANDSET_STATUS.SENT_FOR_REPAIRING, label: RS.getString("HANDSET_SENT_FOR_REPAIRING") }
    ];
};

export const TIMESHEET_TYPE = {
    UNKNOWN: 'Unknown',
    LEAVE: 'Leave'
}

export const SHIFT_MODE = {
    NEW_SHIFT: 1,
    VIEW_SHIFT: 2,
    EDIT_SHIFT: 3
}

export const DAYS_OF_WEEK = 7;

export const REPLACE_OPTIONS = {
    SELECTED_SHIFT_ONLY: 1,
    FOR_THE_PARTIAL_SHIFT: 2,
    IN_DATE_RANGE: 3,
    ALL: 4
};

export const locationOption = function(){
    return [
        {id: 'flexible', name: RS.getString("FLEXIBLE_LOCATION")}
    ];
}

export const SCHEDULE_TYPE = {
    NORMAL: 'Normal',
    INDEPEND_ON_CONTRACT:  "Independ_on_contract",
    FLEXIBLE: 'Flexible',
    NO_LOCATION_NO_CONTRACT: 'No_location_no_contract'
}

export const RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
}

export const MAX_ASSIGN_EMPLOYEE = 1024;