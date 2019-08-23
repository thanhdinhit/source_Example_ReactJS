export const API = {
    GENERAL_CONFIGS: {
        path: 'generalconfigs'
    },
    LOGIN: {
        path: 'security/login'
    },

    RESET_PASSWORD: {
        path: 'resetpassword'
    },

    CONFIRM_PASSWORD: {
        path: 'confirmpassword'
    },

    FIRST_CHANGE_PASSWORD: {
        path: 'firstchangepassword'
    },

    EMPLOYEE_SETTING: {
        path: 'employeesetting'
    },

    SETTING: {
        path: 'setting'
    },

    AVAILABILITY_SETTING: {
        path: 'availability',
        parent: 'SETTING'
    },

    WORKING_TIME_SETTING: {
        path: 'workingtime',
        parent: 'SETTING'
    },

    PAY_RATE_SETTING: {
        path: 'payratesetting',
    },

    EMPLOYEES_SEARCH: {
        path: 'search',
        parent: 'EMPLOYEES'
    },

    EMPLOYEES: {
        path: 'employees'
    },

    EMPLOYEE_GET_PUT_DEL: {
        path: 'employees/:employeeId'
    },

    EMPLOYEES_BASE: {
        path: 'base',
        parent: 'EMPLOYEES'
    },

    EMPLOYEE_ASSIGN_MENTS_SEARCH: {
        path: 'employeeassignments/search'
    },

    ASSIGN_EMPLOYEE_SCHEDULE: {
        path: 'schedules/:scheduleId/shifts/:shiftId/assignments'
    },

    MY_PROFILE: {
        path: 'myprofile'
    },
    MY_PROFILE_TIME: {
        parent: 'MY_PROFILE',
        path: 'time'
    },
    MY_PROFILE_ATTACHMENT: {
        parent: 'MY_PROFILE',
        path: 'attachments'
    },
    MY_PROFILE_JOBROLE_SKILLS: {
        parent: 'MY_PROFILE',
        path: 'job'
    },
    MY_PROFILE_CONTACTDETAIL: {
        parent: 'MY_PROFILE',
        path: 'contactdetails'
    },
    MY_PROFILE_USER: {
        path: 'employees/base/:employeeId'
    },
    MY_PROFILE_EMERGENCY_CONTACTS: {
        parent: 'MY_PROFILE',
        path: 'emergencycontacts'
    },
    EMERGENCY_CONTACT_PROFILE: {
        path: ':emergencyContactId',
        parent: 'MY_PROFILE_EMERGENCY_CONTACTS'
    },

    JOB_ROLES: {
        path: 'jobroles'
    },

    JOB_ROLE: {
        path: ':jobRoleId',
        parent: 'JOB_ROLES'
    },

    JOB_ROLES_SEARCH: {
        path: 'search',
        parent: 'JOB_ROLES'
    },

    ROLES: {
        path: 'roles'
    },

    ROLES_SEARCH: {
        path: 'search',
        parent: 'ROLES'
    },

    REGIONS: {
        path: 'regions'
    },

    REGIONS_SEARCH: {
        path: 'search',
        parent: 'REGIONS'
    },

    EMPLOYEE_TYPES: {
        path: 'employeetypes'
    },

    GROUPS_SEARCH: {
        path: 'search',
        parent: 'GROUPS'
    },
    GROUPS: {
        path: 'groups'
    },
    GROUP: {
        parent: 'GROUPS',
        path: ':groupId'
    },
    SUPERVISORS: {
        path: 'supervisors'
    },

    GROUP_TYPES: {
        path: 'grouptypes'
    },
    GROUP_TYPE: {
        parent: 'GROUP_TYPES',
        path: ':groupTypeId'
    },

    GROUP_ASSIGN_EMPLOYEE: {
        path: 'groups/:groupId/sub' //todo update
    },

    MANAGED_GROUPS: {
        parent: 'GROUPS',
        path: 'manage'
    },

    MANAGE_GROUPS: {
        parent: 'GROUPS',
        path: 'manageGroup'
    },

    STATES: {
        path: 'states'
    },

    JOB_SKILLS: {
        path: 'jobskills'
    },

    JOB_SKILLS_SEARCH: {
        path: 'search',
        parent: 'JOB_SKILLS'
    },

    LOCATIONS: {
        path: 'locations'
    },

    LOCATIONS_SEARCH: {
        path: 'search',
        parent: 'LOCATIONS'
    },

    LOCATION: {
        path: 'locations/:locationId'
    },

    FILES: {
        path: 'files'
    },

    PERSONAL_SETTINGS: {
        path: 'personalsettings'
    },

    COMMONS_PERSONAL_SETTINGS: {
        path: 'commons',
        parent: 'PERSONAL_SETTINGS'
    },

    DELEGATE_LEAVE: {
        path: 'delegate/leave',
        parent: 'PERSONAL_SETTINGS'
    },

    EDIT_DELEGATE_LEAVE: {
        path: ':id',
        parent: 'DELEGATE_LEAVE'
    },

    DELEGATE_TIME_CLOCK: {
        path: 'delegate/timeclock',
        parent: 'PERSONAL_SETTINGS'
    },

    EDIT_DELEGATE_TIME_CLOCK: {
        path: ':id',
        parent: 'DELEGATE_TIME_CLOCK'
    },

    DELEGATE_OVERTIME: {
        path: 'delegate/overtime',
        parent: 'PERSONAL_SETTINGS'
    },

    MEMBERS: {
        path: 'members'
    },

    FILE: {
        path: ':fileUrl',
        parent: 'FILES'
    },

    TERMINATIONS: {
        path: 'terminations',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },

    TERMINATION_REASON: {
        path: 'setting/terminationreasons',
    },

    REJOIN: {
        path: 'rejoins',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },

    CITIES: {
        path: 'cities'
    },
    DISTRICTS: {
        path: 'districts'
    },

    EMERGENCY_CONTACTS_EMPLOYEE: {
        path: 'emergencycontacts',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },

    EMERGENCY_CONTACT_EMPLOYEE: {
        path: ':emergencyContactId',
        parent: 'EMERGENCY_CONTACTS_EMPLOYEE'
    },
    EMPLOYEE_CONTACT_DETAILS: {
        path: 'contactdetails',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },
    EMPLOYEE_JOB: {
        path: 'job',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },
    EMPLOYEE_TIME: {
        path: 'time',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },
    EMPLOYEE_PAY_RATE: {
        path: 'payrate',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },

    TIMECLOCK: {
        path: 'timeclock'
    },

    IMPORT_EMPLOYEE: {
        path: 'import',
        parent: 'EMPLOYEES'
    },
    EXPORT_EMPLOYEES: {
        path: 'export',
        parent: 'EMPLOYEES'
    },

    //--Handset--//

    HANDSET_MYPROFILE: {
        path: 'myprofile/handsets'
    },
    HANDSETS: {
        path: 'handsets'
    },
    HANDSETS_SEARCH: {
        path: 'search',
        parent: 'HANDSETS'
    },
    HANDSET_TYPES: {
        path: 'handsettypes'
    },
    HANDSET_TYPE: {
        path: ':handsetTypeId',
        parent: 'HANDSET_TYPES'
    },
    HANDSET: {
        path: ':handsetId',
        parent: 'HANDSETS'
    },
    HANDSET_PROFILE: {
        path: ':handsetId',
        parent: 'HANDSET_MYPROFILE'
    },
    TRANSFER_HANDSETS: {
        path: 'transfers',
        parent: 'HANDSETS'
    },
    ASSIGN_HANDSETS: {
        path: 'assigns',
        parent: 'HANDSETS'
    },
    EMPLOYEE_HANDSETS: {
        path: 'handsets',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },
    HANDSET_SUMMARY: {
        path: 'handsetsummary/search'
    },
    STORE_LOCS: {
        path: 'storelocs'
    },
    EMPLOYEE_TRANSFERS: {
        path: 'transfers',
        parent: 'EMPLOYEE_GET_PUT_DEL'
    },

    //leave
    LEAVES: {
        path: 'leaves'
    },

    MY_LEAVES: {
        path: 'me/search',
        parent: 'LEAVES'
    },

    EMPLOYEE_LEAVES: {
        path: 'members/search',
        parent: 'LEAVES'
    },

    CONFIG_LEAVE: {
        path: 'configs',
        parent: 'LEAVES'
    },

    LEAVETYPES_CONFIG: {
        path: 'leavetypes',
        parent: 'SETTING'
    },

    MY_LEAVE: {
        path: 'me',
        parent: 'LEAVES'
    },

    LEAVE_DETAIL: {
        path: ':leaveId',
        parent: 'MY_LEAVE'
    },

    MY_APPROVERS: {
        path: 'approvers'
    },

    CALCULATE_HOURS: {
        path: 'calculatehours',
        parent: 'MY_LEAVE'
    },

    MY_LEAVE_BALANCES: {
        path: 'balances',
        parent: 'MY_LEAVE'
    },
    EMPLOYEE_LEAVE_BALANCES: {
        path: 'members/balances/search',
        parent: 'LEAVES'
    },

    MEMBER_LEAVE: {
        path: 'members/:leaveId',
        parent: 'LEAVES'
    },
    //overtime
    OVERTIMES: {
        path: 'overtimes'
    },
    TEAM_OVERTIMES: {
        path: 'members/search',
        parent: 'OVERTIMES'
    },
    MY_OVERTIMES: {
        path: 'me/search',
        parent: 'OVERTIMES'
    },
    MY_OVERTIME: {
        path: 'me/:overtimeId',
        parent: 'OVERTIMES'
    },
    NEW_OVERTIME: {
        path: 'members',
        parent: 'OVERTIMES'
    },
    MEMBER_OVERTIME: {
        path: 'members/:overtimeId',
        parent: 'OVERTIMES'
    },
    OVERTIME_STATISTIC: {
        path: 'overtimestatistic/search'
    },
    OVERTIME_SETTING: {
        path: 'overtimesetting'
    },
    OVERTIME_RATE_SETTING: {
        path: 'payratesetting'
    },

    //TimeSheets
    TIMESHEETS: {
        path: 'timesheets'
    },
    TIMESHEET_HISTORIES: {
        path: 'timesheethistories'
    },
    SEARCH_MY_TIMESHEETS: {
        path: 'mytimesheets/search'
    },
    TIMESHEETS_TEAM: {
        path: 'team',
        parent: 'TIMESHEETS'
    },
    TIMESHEETS_MEMBER: {
        path: 'members',
        parent: 'TIMESHEETS'
    },
    TIMESHEETS_TEAM_SUMMARY: {
        path: 'statistic/groups/search',
        parent: 'TIMESHEETS_MEMBER'
    },
    TIMESHEETS_TEAM_SUBMIT: {
        path: 'submitters',
        parent: 'TIMESHEETS_MEMBER'
    },
    TIMESHEETS_TEAM_GROUP: {
        path: 'statistic/search',
        parent: 'TIMESHEETS_MEMBER'
    },
    GROUP_TEAM_TIMESHEET_HISTORY: {
        path: 'groups/:groupId/submitters/:submitterId/find',
        parent: 'TIMESHEET_HISTORIES'
    },
    EMPLOYEE_TIMESHEET_HISTORY: {
        path: 'groups/:groupId/employees/:employeeId/find',
        parent: 'TIMESHEET_HISTORIES'
    },
    TIMESHEET_TYPES: {
        path: 'timesheettypes'
    },
    MEMBER_TIMESHEETS: {
        path: 'members/search',
        parent: 'TIMESHEETS'
    },
    MEMBER_TIMESHEET: {
        path: 'members/:timesheetId',
        parent: 'TIMESHEETS'
    },
    APPROVE_MEMBER_TIMESHEETS: {
        path: 'members/approve',
        parent: 'TIMESHEETS'
    },
    SUBMIT_TEAM_TIMESHEETS: {
        path: 'members/submit',
        parent: 'TIMESHEETS'
    },
    TIMESHEETS_TEAM_STATISTIC: {
        path: 'submitters',
        parent: 'TIMESHEETS_MEMBER'
    },
    LOAD_ALL_PENDINGS_TIMESHEETS: {
        path: 'members/approve/check',
        parent: 'TIMESHEETS'
    },
    APPROVE_ALL_TIMESHEETS: {
        path: 'members/approve',
        parent: 'TIMESHEETS'
    },
    TIMESHEET_SETTING: {
        path: 'timesheetsetting'
    },
    MEMBER_TIMESHEET_HISTORIES: {
        path: 'timesheethistories/groups/submit'
    },
    MEMBER_TIMESHEET_HISTORY: {
        path: 'timesheethistories/groups/employees'
    },
    GROUPS_TIMESHEET_HISTORY: {
        path: 'timesheethistories/groups/search',
    },
    LOAD_APPROVER_GROUPS_TIMESHEET_HISTORY: {
        path: 'timesheethistories/groups/:groupId/find'
    },
    //customer
    CUSTOMERS: {
        path: 'customers/search'
    },

    CUSTOMERS_DETAIL: {
        path: 'customers/:customerId'
    },

    NEW_CUSTOMER: {
        path: 'customers'
    },

    CONTRACTS: {
        path: 'contracts'
    },

    NEW_CONTRACT: {
        path: 'created',
        parent: 'CONTRACTS'
    },

    CONTRACTS_SEARCH: {
        path: 'contracts/search'
    },

    CONTRACT_DETAIL: {
        path: ':contractId',
        parent: 'CONTRACTS'
    },

    CONTRACT_EDIT: {
        path: ':contractId/update',
        parent: 'CONTRACTS'
    },

    CONTRACT_SCHEDULES: {
        path: 'schedules',
        parent: 'CONTRACT_DETAIL'
    },

    CONTRACT_FLEXIBLE_SCHEDULES: {
        path: 'flexibleschedules',
        parent: 'CONTRACT_DETAIL'
    },

    CONTRACT_ATTACHMENTS: {
        path: 'attachments',
        parent: 'CONTRACT_DETAIL'
    },

    CONTRACT_LINKS: {
        path: 'links',
        parent: 'CONTRACT_DETAIL'
    },

    CONTRACT_APPENDIX: {
        path: 'appendix',
        parent: 'CONTRACT_DETAIL'
    },

    SUSPEND_CONTRACT: {
        path: ':contractId/suspend',
        parent: 'CONTRACTS'
    },

    TERMINATE_CONTRACT: {
        path: ':contractId/terminate',
        parent: 'CONTRACTS'
    },

    DELETE_CONTRACT: {
        path: ':contractId',
        parent: 'CONTRACTS'
    },

    RESUME_CONTRACT: {
        path: ':contractId/resume',
        parent: 'CONTRACTS'
    },

    CONTRACT_SCHEDULES_SHIFT: {
        path: ':contractId/schedules/:scheduleId/shifts/find',
        parent: 'CONTRACTS'
    },

    // Shift template
    SHIFT_TEMPLATE: {
        path: 'shifttemplates'
    },


    //Schedule


    SCHEDULES: {
        path: 'schedules'
    },
    SCHEDULE_STATISTIC: {
        path: 'statistic',
        parent: "SCHEDULES"
    },
    SCHEDULE: {
        path: ':scheduleId',
        parent: 'SCHEDULES'
    },
    SCHEDULE_SHIFTS: {
        path: 'generatedshifts',
        parent: "SCHEDULE"
    },
    SCHEDULE_ASSIGNMENTS:{
        path: 'assignments',
        parent: 'SCHEDULE'
    },
    SCHEDULE_ASSIGNMENT: {
        path: ':assignmentId',
        parent: 'SCHEDULE_ASSIGNMENTS'
    },
    SCHEDULE_SHIFTS_SEARCH: {
        path: 'find',
        parent: "SCHEDULE_SHIFTS"
    },
    SCHEDULE_SHIFT: {
        path: ':shiftId',
        parent: "SCHEDULE_SHIFTS"
    },
    SCHEDULE_SHIFT_ASSIGNMENTS: {
        path: 'assignments',
        parent: "SCHEDULE_SHIFT"
    },
    SCHEDULE_SHIFT_ASSIGNMENT: {
        path: ':assignmentId',
        parent: "SCHEDULE_SHIFT_ASSIGNMENTS"
    },
    SCHEDULE_EMPLOYEES: {
        path: 'employees',
        parent: "SCHEDULE"
    },
    SCHEDULE_EMPLOYEE: {
        path: ':employeeId',
        parent: "SCHEDULE_EMPLOYEES"
    },
    SCHEDULE_EMPLOYEE_REMOVE: {
        path: 'schedules/:scheduleId/employees/:employeeId/remove',
    },
    SCHEDULE_PUBLISH:{
        path: 'publish',
        parent: 'SCHEDULE'
    },
    MYSCHEDULES_SEARCH: {
        path: 'myschedules/search'
    },
    SCHEDULE_ASSIGNMENT_NOTIFY: {
        path: 'schedules/:scheduleId/generatedshifts/:shiftId/assignments/:assignmentId/notify',
        // parent: 'SCHEDULE_ASSIGNMENT'
    },
    SCHEDULE_NOTIFY: {
        path: 'notify',
        parent: 'SCHEDULE'
    },
    SCHEDULE_SHIFT_NOTIFY: {
        path: 'notify',
        parent: 'SCHEDULE_SHIFT'
    },
    SCHEDULE_SHIFT_ASSIGNMENT_REPLACE:{
        path: 'replace',
        parent: 'SCHEDULE_SHIFT_ASSIGNMENT'
    },
    SCHEDULE_ASSIGNMENT_REPLACE: {
        path: 'replace',
        parent: 'SCHEDULE_ASSIGNMENT'
    },
    SCHEDULE_ASSIGNMENTS_REMOVE: {
        path: 'remove',
        parent: 'SCHEDULE_ASSIGNMENTS'
    },
    SCHEDULE_SHIFTS_COPY: {
        path: 'copy',
        parent: 'SCHEDULE_SHIFTS'
    },
    SCHEDULES_SEARCH: {
        path: 'search',
        parent: 'SCHEDULES'
    },
    SEARCH_ASSIGNMENT_AVAILABILITY: {
        path: 'employees/searchassignmentavailability'
    },
    SEARCH_REPLACEMENT_AVAILABILITY: {
        path: 'employees/searchreplacementavailability'
    },
    SEARCH_RESOURCE_POOL: {
        path: 'employees/searchresourcepool'
    },

    // organization
    EDIT_GROUP_ORGANIZATION: {
        path: 'groups/:groupId',
    },
    ADD_NEW_GROUP_ORGANIZATION: {
        path: 'groups'
    },

    SEARCH_NOTIFICATIONS: {
        path: 'notifications/search'
    },
    NOTIFICATION_DETAILS: {
        path: 'notifications/:notificationId'
    },
    NOTIFICATIONS: {
        path: 'notifications'
    }
};

export const URL = {
    FIRST_LOGIN: {
        path: 'firstlogin'
    },

    APP: {
        path: '/app'
    },

    PAGE_NOT_FOUND: {
        path: '/page-not-found'
    },

    MY_PROFILE: {
        path: 'my-profile',
        parent: 'APP'
    },

    /**
     * -------------------------Start Employees Portal-----------------------------
    */

    // Employees
    EMPLOYEES: {
        path: 'employee-portal/employees',
        parent: 'APP'
    },
    EMPLOYEE: {
        path: 'employee-portal/employees/detail/:employeeId',
        parent: 'APP'
    },

    NEW_EMPLOYEE: {
        path: 'employee-portal/employees/new',
        parent: 'APP'
    },

    // Leave
    MY_BALANCE: {
        path: 'employee-portal/my-balance',
        parent: 'APP'
    },

    //leave
    // NEW_LEAVE: {
    //     path: 'employee-portal/leave/my-leaves/new',
    //     parent: 'APP'
    // },
    MY_LEAVES: {
        path: 'employee-portal/leave/my-leaves',
        parent: 'APP'
    },
    MEMBER_LEAVE: {
        path: 'employee-portal/leave/member-leaves',
        parent: 'APP'
    },
    TEAM_LEAVES: {
        path: 'employee-portal/leave/team-leaves',
        parent: 'APP'
    },

    //Overtime
    OVERTIME: {
        path: 'employee-portal/overtime',
        parent: 'APP'
    },

    NEW_OVERTIME: {
        path: 'employee-portal/overtime/new',
        parent: 'APP'
    },

    //Organization
    ORGANIZATION: {
        path: 'employee-portal/employee-organization',
        parent: 'APP'
    },

    //timesheet
    MY_TIMESHEETS: {
        path: 'employee-portal/timesheet/my-timesheets',
        parent: 'APP'
    },

    GROUP_TIMESHEETS: {
        path: 'employee-portal/timesheet/group-timesheets',
        parent: 'APP'
    },

    GROUP_TIMESHEETS_DETAIL: {
        path: 'employee-portal/timesheet/group-timesheets/detail/:groupId',
        parent: 'APP'
    },

    GROUP_TIMESHEET_HISTORY_DETAIL: {
        path: 'employee-portal/timesheet/group-timesheet-history/detail/:groupId',
        parent: 'APP'
    },
    TIMESHEETS_HISTORY: {
        path: 'employee-portal/timesheet/group-timesheets-history',
        parent: 'APP'
    },



    // EMPLOYEE_TIMESHEETS: {
    //     path: 'employee-timesheets/:timesheetId',
    //     parent: 'APP'
    // },

    /**
     * -------------------------End Employees Portal-----------------------------
    */

    /**
     * -------------------------Start Customer Portal-----------------------------
    */

    CUSTOMERS: {
        path: 'customer-portal/customers',
        parent: 'APP'
    },

    NEW_CUSTOMER: {
        path: 'customer-portal/customers/new',
        parent: 'APP'
    },

    CUSTOMERS_DETAIL: {
        path: 'customer-portal/customers/detail/:customerId',
        parent: 'APP'
    },

    CONTRACTS: {
        path: 'customer-portal/contracts',
        parent: 'APP'
    },

    CONTRACT: {
        path: 'customer-portal/contracts/detail/:contractId',
        parent: 'APP'
    },

    CONTRACT_APPENDIX: {
        path: 'customer-portal/contracts/detail/:contractId/appendix/:appendixId',
        parent: 'APP'
    },

    NEW_CONTRACT: {
        path: 'customer-portal/contracts/new',
        parent: 'APP'
    },

    /**
     * -------------------------End Customer Portal-----------------------------
    */

    /**
     * -------------------------Start Schedule-----------------------------
    */

    SCHEDULES: {
        path: 'schedule/schedules',
        parent: 'APP'
    },

    SCHEDULE: {
        path: 'schedule/schedules/:scheduleId',
        parent: 'APP'
    },

    MY_SCHEDULE: {
        path: 'schedule/my-schedule',
        parent: 'APP'
    },

    /**
     * -------------------------End Schedule-----------------------------
    */

    /**
     * -------------------------Start Notifications-----------------------------
    */

    NOTIFICATIONS: {
        path: 'notifications',
        parent: 'APP'
    },
    NOTIFICATION_DETAILS: {
        path: 'notifications/:notificationId',
        parent: 'APP'
    },

    /**
     * -------------------------End Notifications-----------------------------
    */


    /**
    * -------------------------Start Location Services-----------------------------
    */

    LOCATION: {
        path: 'location-control/location',
        parent: 'APP'
    },

    HANDSET_SUMMARY: {
        path: 'location-control/handset-summary',
        parent: 'APP'
    },

    HANDSETS: {
        path: 'location-control/handsets',
        parent: 'APP'
    },
    MY_PROFILE_HANDSETS: {
        path: 'location-control/myprofile/handsets',
        parent: 'APP'
    },
    HANDSET_DETAIL: {
        path: 'location-control/handsets/detail/:handsetId',
        parent: 'APP'
    },

    EDIT_HANDSET: {
        path: 'location-control/handsets/edit/:handsetId',
        parent: 'APP'
    },

    /**
     * -------------------------End Location Services-----------------------------
    */
    MEMBER_LEAVE_REPORT: {
        path: 'member-reports',
        parent: 'APP'
    },

    SKILL_MANAGEMENT: {
        path: 'skill-management',
        parent: 'APP'
    },

    JOBROLE_MANAGEMENT: {
        path: 'jobrole-management',
        parent: 'APP'
    },

    GROUPS: {
        path: 'groups'
    },

    GROUP: {
        parent: 'GROUPS',
        path: ':groupId'
    },

    ROLES: {
        path: 'roles',
        parent: 'APP'
    },

    APPLICATION_SETTING: {
        path: 'application-setting',
        parent: 'APP'
    },

    PERSONAL_SETTINGS: {
        path: 'personal-settings',
        parent: 'APPLICATION_SETTING'
    },

    GENERAL_SETTINGS: {
        path: 'general-settings',
        parent: 'APPLICATION_SETTING'
    },

    EMPLOYEE_MANAGEMENT: {
        path: 'employee-management',
        parent: 'APPLICATION_SETTING'
    },
    LEAVE_MANAGEMENT: {
        path: 'leave-management',
        parent: 'APPLICATION_SETTING'
    },

    REJOIN_EMPLOYEE: {
        path: 'rejoin-employee',
        parent: 'APP'
    },

    NOT_PERMISSION: {
        path: 'not-permission-page',
    }
};