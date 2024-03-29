import * as apis from './apis';

// JOBROLES
export const JOBROLES_SEARCH = API_DATA + apis.JOBROLES + '/search';
export const JOBROLES_POST = API_DATA + apis.JOBROLES;
export const JOBROLES_GET_PUT_DEL = API_DATA + apis.JOBROLES + "/{0}";

//AUTHENTICATE
export const LOGIN_POST = API_DATA + apis.LOGIN;
export const LOGOUT_POST = API_DATA + apis.LOGOUT;
export const FIRSTCHANGEPASSWORD_PUT = API_DATA + apis.FIRSTCHANGEPASSWORD;
export const CHANGEPASSWORD_PUT = API_DATA + apis.CHANGEPASSWORD;
export const RESETPASSWORD_PUT = API_DATA + apis.RESETPASSWORD;
export const CHANGEFORGETPASSWORD_PUT = API_DATA + apis.CHANGEFORGETPASSWORD;
export const FORGOTPASSWORD_POST = API_DATA + apis.FORGETPASSWORD;
export const VALIDTOKEN_POST = API_DATA + apis.VALIDTOKEN;

//EMPLOYEE
export const EMPLOYEES_SEARCH = API_DATA + apis.EMPLOYEES + '/search';
export const EMPLOYEES_POST = API_DATA + apis.EMPLOYEES;
export const EMPLOYEE_GET_PUT_DEL = API_DATA + apis.EMPLOYEES + "/{0}";

export const BASEEMPLOYEES_SEARCH = API_DATA + apis.BASEEMPLOYEES + '/search';
export const BASEEMPLOYEES_GET = API_DATA + apis.BASEEMPLOYEES;

//EMPLOYEE TYPE
export const EMPLOYEETYPES_SEARCH = API_DATA + apis.EMPLOYEETYPES + '/search';
export const EMPLOYEETYPES_GET = API_DATA + apis.EMPLOYEETYPES;

//CUSTOMER
export const CUSTOMERS_SEARCH = API_DATA + apis.CUSTOMERS + '/search';
export const CUSTOMERS_POST = API_DATA + apis.CUSTOMERS;
export const CUSTOMER_GET_PUT_DEL = API_DATA + apis.CUSTOMERS + '/{0}';

// DEPARTMENT
export const DEPARTMENTS_SEARCH = API_DATA + apis.DEPARTMENTS + '/search';
export const DEPARTMENTS_POST = API_DATA + apis.DEPARTMENTS;
export const DEPARTMENT_GET_PUT_DEL = API_DATA + apis.DEPARTMENTS + "/{0}";
export const STATES_GET = API_DATA + apis.STATES;

// DEPARTMENT TYPE
export const DEPARTMENTTYPES_POST = API_DATA + apis.DEPARTMENTTYPES;
export const DEPARTMENTTYPE_GET_PUT_DEL = API_DATA + apis.DEPARTMENTTYPES + "/{0}";
export const DEPARTMENTTYPES_GET = API_DATA + apis.DEPARTMENTTYPES;

//LOCATION
export const LOCATIONS_SEARCH = API_DATA + apis.LOCATIONS + '/search';
export const LOCATIONS_POST = API_DATA + apis.LOCATIONS;
export const LOCATION_GET_PUT_DEL = API_DATA + apis.LOCATIONS + '/{0}';

//MEMBER REPORT LEAVE
export const MEMBERREPORTS_SEARCH = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MEMBERREPORTS + '/search';

//MY LEAVE
export const MYLEAVES_SEARCH = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MYLEAVES + '/search';
export const MYLEAVE_GET_PUT_DEL = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MYLEAVES + '/{1}';
export const MYLEAVE_POST = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MYLEAVES;

export const LEAVESTATISTIC_GET = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.LEAVESTATISTIC;

//REGION
export const REGIONS_SEARCH = API_DATA + apis.REGIONS + '/search';
export const REGIONS_POST = API_DATA + apis.REGIONS;
export const REGION_GET_PUT_DEL = API_DATA + apis.REGIONS + '/{0}';

//SHIFTTEMPLATE
export const SHIFTTEMPLATES_SEARCH = API_DATA + apis.SHIFTTEMPLATES + '/search';
export const SHIFTTEMPLATES_POST = API_DATA + apis.SHIFTTEMPLATES;
export const SHIFTTEMPLATE_GET_PUT_DEL = API_DATA + apis.SHIFTTEMPLATES + '/{0}';

//LEAVEMANAGEMENT SETTING
export const LEAVECONFIGS_GET_PUT = API_DATA + apis.LEAVECONFIGS;


//MEMBER LEAVES
export const MEMBERLEAVES_SEARCH = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MEMBERLEAVES + '/search';
export const MEMBERLEAVES_PUT = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MEMBERLEAVES + '/{1}';

// SKILL SETTING
export const JOBSKILLS_SEARCH = API_DATA + apis.JOBSKILLS + '/search';
export const JOBSKILL_POST = API_DATA + apis.JOBSKILLS;
export const JOBSKILL_GET_PUT_DEL = API_DATA + apis.JOBSKILLS + '/{0}';

//APPROVE
export const APPROVES_SEARCH = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.APPROVERS;
export const APPROVE_GET_PUT_DEL = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.MYLEAVES + '/{1}';


//LEAVEBALANCE
export const LEAVEBALANCES_SEARCH = API_DATA + apis.EMPLOYEES + '/{0}/' + apis.LEAVEBALANCES;


//SHIFTTEMPLATELOCATIONS
export const SHIFTTEMPLATELOCATIONS_SEARCH = API_DATA + apis.SHIFTTEMPLATELOCATIONS + '/search';

//PLANNER SCHEDULING ASSIGNMENT
export const PLANNERSCHEDULINGASSIGNMENT_POST = API_DATA + apis.PLANNERSCHEDULINGASSIGNMENTS;

//SCHEDULE
export const SCHEDULES_SEARCH = API_DATA + apis.SCHEDULES + '/{0}/';

//USERROLE
export const USERROLES_SEARCH = API_DATA + apis.USERROLES + '/search';

//GENERAL CONFIGS
export const GENERALCONFIGS_GET = API_DATA + apis.GENERALCONFIGS;

//ROLES MANAGEMENT
export const ROLES_SEARCH = API_DATA + apis.ROLES + '/search';
export const ROLES_POST = API_DATA + apis.ROLES;
export const ROLES_GET_PUT_DEL = API_DATA + apis.ROLES + '/{0}';
export const ACCESSRIGHTS_GET = API_DATA + apis.ACCESSRIGHTS;

//OVERTIME MANAGEMENT
export const OVERTIME_RECEIVED_SEARCH = API_DATA + apis.OVERTIMES + '/me/search';
export const OVERTIME_SENT_SEARCH = API_DATA + apis.OVERTIMES + '/members/search';
export const OVERTIME_RECEIVED_PUT = API_DATA + apis.OVERTIMES + '/me/{0}';
export const OVERTIME_SENT_PUT = API_DATA + apis.OVERTIMES + '/members/{0}';
export const NEWOVERTIME_POST = API_DATA + apis.OVERTIMES;
export const OT_STATISTIC_SEARCH = API_DATA + apis.OVERTIMESTATISTIC + '/search';
export const OVERTIME_SETTING_GET = API_DATA + apis.OVERTIMECONFIGS;