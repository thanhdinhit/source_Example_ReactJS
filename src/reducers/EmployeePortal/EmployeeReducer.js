import * as types from '../../constants/actionTypes';
import typeConfig from '../../constants/typeConfig';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import { loadJobRoleSetting } from '../../actions/jobRoleSettingAction';
import { STATUS } from '../../core/common/constants';
import _ from 'lodash';
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = {
    curEmp: clone(initGlobal.curEmp),
    employees: [],
    baseEmployees: [],
    newEmployee: _.assign({}, initialState.newEmployee),
    employee: _.assign({}, initialState.newEmployee),
    originEmployee: _.assign({}, initialState.newEmployee),
    membersOfEmployee: [],
    meta: {},
    metaOTManagement: {
        metaReceived: {},
        metaSent: {},
        metaStatistic: {}
    },

    validatedResult: {},
    avatarName: '',
    payload: clone(initGlobal.payload),
    overtime: clone(initialState.overtime),
    requestOTEmployees: initialState.requestOTEmployees,
    overtimeSetting: {},
    otStatistic: [],
    employeeTypes: [],
    availabilitySetting: _.clone(initialState.newEmployee.time.availabilityTime),
    workingTimeSetting: _.clone(initialState.newEmployee.time.workingTime),
    emergencyContacts: [],
    employeeTransfers: [],
    employeesToAssign: []
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_AVAILABILITY_SETTING:
            newState = handleCRUDAction(state, action);
            newState.availabilitySetting = action.availabilitySetting;
            newState.payload.success = false;
            return newState;
        case types.LOAD_WORKINGTIME_SETTING:
            newState = handleCRUDAction(state, action);
            newState.workingTimeSetting = action.workingTimeSetting;
            newState.payload.success = false;
            return newState;
        case types.LOAD_USERROLES_SETTING:
            newState = _.cloneDeep(state);
            let defaultRole = undefined;
            if (!newState.newEmployee.contactDetail.accessRoles) {
                if (action.userRoles && action.userRoles.length > 0) {
                    defaultRole = action.userRoles.find(x => x.isDefault);
                    if (defaultRole) {
                        defaultRole.value = defaultRole.id;
                        defaultRole.label = defaultRole.name;
                        newState.newEmployee.contactDetail.accessRoles = defaultRole;
                    }
                }
            }
            return newState;
        case types.LOAD_MEMBERS_OF_EMPLOYEE:
            newState = update(state, {
                membersOfEmployee: {
                    $set: action.members
                },
                meta: {
                    $set: action.meta
                }
            });
            return newState;
        case types.LOAD_ALL_RECEIVED_REQUESTS:
            newState = handleCRUDAction(state, action);
            newState.receivedRequests = action.receivedRequests;
            newState = update(newState, {
                metaOTManagement: {
                    metaReceived: {
                        $set: action.metaReceived
                    }
                }
            });
            // newState.metaOTManagement.metaReceived = action.metaReceived;
            newState.payload.success = false;
            return newState;
        case types.LOAD_ALL_SENT_REQUESTS:
            newState = handleCRUDAction(state, action);
            newState.sentRequests = action.sentRequests;
            newState = update(newState, {
                metaOTManagement: {
                    metaSent: {
                        $set: action.metaSent
                    }
                }
            });
            newState.payload.success = false;
            return newState;
        case types.LOAD_OT_STATISTIC:
            newState = handleCRUDAction(state, action);
            newState.otStatistic = action.otStatistic;
            newState.payload.success = false;
            newState = update(newState, {
                metaOTManagement: {
                    metaStatistic: {
                        $set: action.metaStatistic
                    }
                }
            });
            return newState;
        case types.LOAD_OVERTIME_SETTING:
            newState = handleCRUDAction(state, action);
            newState.overtimeSetting = action.overtimeSetting;
            newState.payload.success = false;
            return newState;
        case types.EDIT_OVERTIME:
            return handleCRUDAction(state, action);
        case types.LOAD_ALL_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            newState.employees = action.employees;
            newState.meta = action.meta;
            newState.payload.success = false;
            return newState;
        case types.LOAD_ALL_BASE_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            newState.baseEmployees = action.baseEmployees;
            newState.meta = action.meta;
            newState.payload.success = false;
            return newState;
        case types.VALIDATE_FIELD_EMPLOYEE:
            newState = update(state, {
                validatedResult: {
                    [action.validatedResult.fieldOnServer]: {
                        $set: action.validatedResult
                    }
                }
            });
            return newState;
        case types.VALIDATE_TOTAL_FIELD_EMPLOYEE:
            let validatedResult = _.cloneDeep(state.validatedResult);
            if (action.validatedResults.length) {
                for (let rs of action.validatedResults) {
                    validatedResult[rs.fieldOnServer] = rs;
                }
            }
            newState = update(state, {
                validatedResult: {
                    $set: validatedResult
                }
            });
            return newState;
        case types.ADD_EMPLOYEE:
            newState = handleCRUDAction(state, action)
            newState.employee = action.employee;
            return newState;

        case types.EDIT_EMPLOYEE_CONTACT_DETAIL: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employee.contactDetail = action.contactDetail;
            }
            return newState;
        }

        case types.EDIT_EMPLOYEE_JOB: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employee.job = action.employeeJob;
            }
            return newState;
        }

        case types.EDIT_EMPLOYEE_TIME: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employee.time = action.time;
            }
            return newState;
        }

        case types.EDIT_EMPLOYEE_PAY_RATE: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employee.payRate = action.payRate;
            }
            return newState;
        }

        case types.EDIT_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            if (action.employee)
                newState.employee = action.employee;
            return newState;
        case types.DELETE_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            if (!action.error) {
                //this is temporary solution, need disscuss more...
                newState.payload.success = "deleted";
            }
            return newState;
        case types.LOAD_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.employee = action.employee;
            newState.originEmployee = action.employee;
            return newState;

        case types.UPLOAD_AVATAR:
            if (action.error && action.error.code != 0 || action.error.exception) {
                newState = update(state, {
                    payload: {
                        error: {
                            $set: action.error
                        }
                    }
                })
                return newState;
            }
            newState = update(state, {
                newEmployee: {
                    contactDetail: {
                        photoUrl: {
                            $set: action.links[0].name
                        }
                    }
                }
            });
            return newState;
        case types.UPDATE_EMPLOYEE_DTO:
            newState = update(state, {
                newEmployee: {
                    [action.fieldName]: {
                        $set: action.value
                    }
                }
            });
            return newState;
        case types.RESET_EMPLOYEE_DTO:
            newState = update(state, {
                employee: {
                    $set: _.cloneDeep(initialState.newEmployee)
                }
            });
            return newState;
        case types.RESET_NEW_EMPLOYEE_DTO:
            newState = update(state, {
                newEmployee: {
                    $set: _.cloneDeep(initialState.newEmployee)
                }
            });
            return newState;
        case types.RESET_VALIDATE:
            newState = update(state, {
                validatedResult: { $set: {} }
            })
            return newState;

        case types.UPDATE_OVERTIME_DTO:
            newState = update(state, {
                overtime: {
                    [action.fieldName]: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.UPDATE_REQUEST_OTEMPLOYEES:
            newState = update(state, {
                requestOTEmployees: {
                    $set: action.requestOTEmployees
                },
                payload: {
                    success: {
                        $set: false
                    }
                }
            })
            return newState;
        case types.LOAD_ALL_EMPLOYEE_TYPES:
            newState = handleCRUDAction(state, action)
            newState.employeeTypes = action.employeeTypes;
            newState.payload.success = false;
            return newState;
        case types.GET_EMERGENCY_CONTACTS: {
            newState = handleCRUDAction(state, action);
            newState.emergencyContacts = action.data;
            newState.payload.success = false;
            return newState;
        }

        case types.ADD_EMERGENCY_CONTACT: {
            newState = handleCRUDAction(state, action);
            return newState;
        }

        case types.DELETE_EMERGENCY_CONTACT: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.REJOIN: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.newEmployee = update(action.employee, {
                    startDate: {
                        $set: action.rejoinedDate
                    }
                })
            }
            newState.payload.success = false;
            return newState;
        }
        case types.LOAD_EMPLOYEE_TRANSFERS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employeeTransfers = action.transfers;
                newState.payload.success = false;
            }
            return newState;
        }
        case types.TRANSFER_EMPLOYEE: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.RESET_STATE:
            newState = update(state, {
                overtime: {
                    $set: clone(initialState.overtime)
                },
                requestOTEmployees: {
                    $set: []
                },
                payload: {
                    success: {
                        $set: false
                    },
                },
                newEmployee: {
                    $set: _.assign({}, initialState.newEmployee)
                }
            });
            return newState;
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    }
                }
            });
            return newState;
        case types.LOAD_SKILLS_SETTING:
        case types.LOAD_SHIFTTEMPLATES_SETTING:
        case types.LOAD_REGIONS_SETTING:
        case types.LOAD_JOBROLES_SETTING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: false
                    }
                }
            });
            return newState;
        case types.LOADING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: true
                    }
                }
            });
            return newState;
        case types.LOAD_EMPLOYEE_ASSIGN: {
            newState = handleCRUDAction(state, action);            
            newState.employeesToAssign = action.employeesToAssign;
            return newState;
        }
        default:
            return state;
    }
}