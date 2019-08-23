import initialState from './initialState';
import InitialStateEmployee from '../EmployeePortal/initialState'
import * as types from '../../constants/actionTypes';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common'
import R from '../../resources/resourceManager'
import _ from 'lodash';
export default function auth(
    state = {
        employeeInfo: clone(InitialStateEmployee.newEmployee),
        approvers: [],
        curEmp: clone(initialState.curEmp),
        payload: _.assign({}, initialState.payload),
        dataLogin: {},
        error: clone(initialState.error),
        forgotPassword: false,
        isValidToken: true,
        afterChangePassword: false,
        contactDetail: {}
    }, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_GENERAL_SETTING:
            newState = handleCRUDAction(state, action);;
            newState.payload.success = false;
            if (newState.payload.error.code != 0) {

            }
            else {
                if (action.generalConfig)
                    newState = update(newState, {
                        curEmp: {
                            company: {
                                $set: action.generalConfig
                            }
                        }
                    })
            }
            return newState;
        case types.CHANGE_LANGUAGE:
            newState = update(state, {
                curEmp: {
                    company: {
                        defaultLanguage: {
                            $set: action.curLanguage
                        }
                    }
                }
            })
            return newState;
        case types.SET_VISIBILITY_APPBAR:
            newState = clone(state);
            newState.payload.visibilityAppbar = action.value;
            return newState;
        case types.LOGIN:
            newState = clone(state);
            newState.employeeInfo = {};
            return newState
        case types.LOGIN_REQUEST:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: true
                    }
                }
            })
            return newState
        case types.LOGIN_FIRST:
            newState = update(state, {
                curEmp: {
                    userName: {
                        $set: action.curEmp.userName
                    },
                    employeeId: {
                        $set: action.curEmp.employeeId
                    },
                    token: {
                        $set: action.curEmp.token
                    },
                    rights: {
                        $set: action.curEmp.rights
                    }
                },
                payload: {
                    isLoading: {
                        $set: false
                    }
                },
                dataLogin: {
                    $set: action.dataLogin
                }
            })
            return newState
        case types.LOGIN_SUCCESS:
            newState = update(state, {
                curEmp: {
                    userName: {
                        $set: action.curEmp.userName
                    },
                    employeeId: {
                        $set: action.curEmp.employeeId
                    },
                    token: {
                        $set: action.curEmp.token
                    },
                    rights: {
                        $set: action.curEmp.rights
                    }
                },
                payload: {
                    isAuthenticated: {
                        $set: true
                    },
                    redirect: {
                        $set: action.payload.redirect
                    },
                    isLoading: {
                        $set: false
                    },
                    success: {
                        $set: true
                    },
                }
            });
            return newState
        case types.LOGOUT:
            newState = update(state, {
                curEmp: {
                    $set: clone(initialState.curEmp)
                },
                payload: {
                    isAuthenticated: {
                        $set: false
                    },
                    isLoading: {
                        $set: false
                    },
                    redirect: {
                        $set: '/login'
                    }
                },
                employeeInfo: {
                    $set: {}
                }

            })
            return newState;
        case types.LOGIN_FAIL:
            newState = update(state, {
                payload: {
                    isAuthenticated: {
                        $set: false
                    },
                    isLoading: {
                        $set: false
                    },
                    error: {
                        $set: action.error || state.error
                    }
                },

            })
            return newState
        case types.FORGOTPASSWORD_SUCCESS:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: false
                    },
                    success: {
                        $set: true
                    }
                },
                forgotPassword: {
                    $set: true
                }

            })
            return newState;
        case types.FORGOTPASSWORD_FAIL:
            newState = handleCRUDAction(state, action)
            newState = update(newState, {
                payload: {
                    success: {
                        $set: false
                    }
                },
                forgotPassword: {
                    $set: true
                }
            })
            return newState;
        case types.VALIDTOKEN_SUCCESS:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: false
                    },
                },
                isValidToken: {
                    $set: true
                }
            })
            return newState;
        case types.VALIDTOKEN_FAIL:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: false
                    }
                },
                isValidToken: {
                    $set: false
                }

            })
            return newState;
        case types.CHANGEPASSWORD_FAIL:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
            }
            return newState;
        case types.CHANGEFORGETPASSWORD:
            newState = handleCRUDAction(state, action)
            if (newState.payload.error.message == 'Token_Is_Expired') {
                newState.isValidToken = false;
            }

            newState.afterChangePassword = action.afterChangePassword;
            newState.contactDetail = action.contactDetail;

            return newState;

        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initialState.error
                    }
                }
            })
            return newState;
        case types.RESET_STATE:
        case types.RESET_AUTH_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    }
                },
                forgotPassword: {
                    $set: false
                }
            });
            return newState;
        case types.LOADING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: true
                    }
                },
            });
            return newState;
        case types.LOAD_PROFILE:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.employeeInfo = action.myProfile;
            return newState;
        case types.LOAD_PROFILE_TIME:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.employeeInfo.time = action.time;
            return newState;
        case types.LOAD_PROFILE_ATTACHMENT:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.employeeInfo.attachment = action.attachment;
            return newState;
        case types.LOAD_PROFILE_JOBROLE_SKILLS:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.employeeInfo.job = action.job || {};
            return newState;
        case types.LOAD_EMPLOYEE_AFTER_LOGIN_SUCCESS:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.employeeInfo = action.myProfileInfo;
            }
            return newState;
        case types.LOAD_PROFILE_CONTACTDETAIL:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.employeeInfo.contactDetail = action.contactDetail;
            }
            return newState;
        case types.EDIT_PROFILE:
            newState = handleCRUDAction(state, action);
            newState.employeeInfo = action.myProfile;
            return newState;
        case types.EDIT_PROFILE_CONTACTDETAIL:
            newState = handleCRUDAction(state, action);
            newState.employeeInfo.contactDetail = action.contactDetail;
            return newState;
        case types.GET_EMERGENCY_CONTACTS_PROFILE:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success)
                newState.employeeInfo.emergencyContacts = action.data;
            newState.payload.success = false;
            return newState;
        case types.ADD_EMERGENCY_CONTACT_PROFILE:
        case types.DELETE_EMERGENCY_CONTACT_PROFILE:
            newState = handleCRUDAction(state, action);
            return newState;
        case types.POST_WORKINGSTATUS:
        case types.LOAD_WORKINGSTATUS:
        case types.LOAD_SUBMITTER_TIMESHEETS:
        case types.LOAD_TEAM_TIMESHEETS:
        case types.ADD_EMPLOYEE:
        case types.LOAD_JOBROLES_SETTING:
        case types.ADD_SHIFTTEMPLATE_SETTING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: false
                    }
                },
            });
            return newState;
        case types.LOAD_MY_APPROVERS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.approvers = action.approvers;
                newState.payload.success = false;
            }
            return newState;
        }
        default:
            return state;
    }
}
