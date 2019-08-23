import * as types from '../constants/actionTypes';
import { catchError, checkError } from '../services/common';
import { mapFromDto } from '../services/mapping/rightDTO';
import { browserHistory } from 'react-router';
import { loadMyProfileAfterLoginSuccess } from './myProfileActions';
import { loading } from './globalAction';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as routeConfig from '../constants/routeConfig';
import * as apiHelper from '../utils/apiHelper';
import stringUtil from '../utils/stringUtil';
import * as UserService from '../services/user.service';
import { getUrlPath } from '../core/utils/RoutesUtils';
import { URL } from '../core/common/app.routes';
import * as securityUtils from '../utils/securityUtils';

export function checkAuthenticate() {
    let token = localStorage.getItem('token');
    if (token) {
        return {
            type: types.LOGIN_SUCCESS
        }
    }
}

export function loadEmployeeInfo(redirect = '/') {

    return function (dispatch) {
        $.ajax({
            url: stringUtil.format(apiEndpoints.EMPLOYEE_GET_PUT_DEL, localStorage.employeeId),
            method: 'get',
            dataType: 'json',
            headers: apiHelper.getHeader(),

            contentType: "application/json",
            success: function (data, status, xhr) {
                return dispatch({
                    type: types.LOAD_EMPLOYEE,
                    employeeInfo: data.data,
                    error: checkError(data, xhr.status)
                })
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_EMPLOYEE, redirect)
            }
        });
    };
}
export function loginRequest() {
    return {
        type: types.LOGIN_REQUEST
    }
}

export function loginFail() {
    localStorage.clear();
    return {
        type: types.LOGIN_FAIL
    }
}

export function loginSuccess(data, redirect = "/", error = {}) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('language', data.userPreference.userLanguage);
    localStorage.setItem('employeeId', data.employeeId);
    localStorage.setItem('accessRights', JSON.stringify(data.accessRights));
    localStorage.setItem('firstLogin', data.firstLogin);
    localStorage.setItem('secret', data.secret);
    localStorage.setItem('userName', data.userName);
    return function (dispatch) {
        // dispatch(publicAction.loadGeneralSetting())
        if (data.employeeId && data.employeeId != "null")
            dispatch(loadMyProfileAfterLoginSuccess(data.employeeId));
        else {
            dispatch({
                type: types.LOAD_EMPLOYEE_AFTER_LOGIN_SUCCESS,
                employee: {}
            })
        }
        return dispatch({
            type: types.LOGIN_SUCCESS,
            curEmp: {
                userName: data.userName,
                employeeId: data.employeeId,
                token: data.token,
                rights: mapFromDto(data.accessRights)
            },
            payload: {
                token: data.token,
                redirect: redirect
            },
            error: error
        })
    }

}

export function logout(curEmp, redirect = '/') {
    return function (dispatch) {
        localStorage.clear();
        $.ajax({
            url: apiEndpoints.LOGOUT_POST,
            method: 'post',
            data: JSON.stringify({}),
            contentType: "application/json",
            headers: apiHelper.getHeader(curEmp),
            success: function (data, status, xhr) {
                browserHistory.push('/' + routeConfig.LOGIN)
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOGOUT, redirect)
            }
        });
        return dispatch({
            type: types.LOGOUT,
        })
    }
}

export function login(email, password, remember, redirect = "/") {
    return function (dispatch) {
        dispatch(loginRequest());
        localStorage.setItem('keepSignedIn', remember);

        let hashPassWord = securityUtils.sha256(password, email);

        const data = {
            username: email,
            password: hashPassWord,
            keepSignedIn: remember
        };
        UserService.login(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOGIN_FAIL, redirect);
            }
            if (result.data.firstLogin) {
                localStorage.setItem('firstLogin', true);
                browserHistory.push(getUrlPath(URL.FIRST_LOGIN));

                return dispatch({
                    type: types.LOGIN_FIRST,
                    dataLogin: result.data,
                    curEmp: {
                        userName: email,
                        employeeId: result.data.employeeId,
                        token: result.data.token,
                        rights: mapFromDto(result.data.accessRights)
                    },
                });
            }
            result.data.userName = email;
            dispatch(loginSuccess(result.data, redirect, checkError(result, xhr.status)));
            return browserHistory.push(redirect);
        });
    };
}


export function firstChangePassword(curEmp, dataLogin, password, isFirstLogin, redirect = "/") {
    return function (dispatch) {
        dispatch(loginRequest())
        // let url =  responseJSON.API_URL +  ROSTER + 'login'

        return $.ajax({
            url: apiEndpoints.FIRSTCHANGEPASSWORD_PUT,
            method: 'put',
            data: JSON.stringify({ newPassword: password, firstLogin: isFirstLogin }),
            contentType: "application/json",
            headers: apiHelper.getHeader(curEmp),
            success: function (data, status, xhr) {
                dispatch(loginSuccess(dataLogin, redirect, checkError(data, xhr.status)));
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.CHANGEPASSWORD_FAIL, redirect)
            }
        });
    }
}


export function changePassword(passwordDTO, redirect = "/") {
    return function (dispatch) {
        dispatch(loginRequest())
        // let url =  responseJSON.API_URL +  ROSTER + 'login'

        return $.ajax({
            url: apiEndpoints.CHANGEPASSWORD_PUT,
            method: 'put',
            data: JSON.stringify(passwordDTO),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                return dispatch({
                    type: types.CHANGEPASSWORD_SUCESS
                })
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.CHANGEPASSWORD_FAIL, redirect)
            }
        });
    }
}


export function resetPassword(employeeId, redirect = "") {
    return function (dispatch) {
        const data = employeeId
        UserService.resetPassword(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.RESETPASSWORD, redirect)
            }
            return dispatch({
                type: types.RESETPASSWORD,
                redirect
            })
        })
    }
}

export function confirmPassword(dto) {
    return function (dispatch) {
        const data = { password: securityUtils.sha256(dto.password, dto.userName) };
        UserService.confirmPassword(data, function (error, result, status, xhr) {
            if (error) {
                return dispatch({
                    type: types.CONFIRMPASSWORD,
                    confirmPassword: false,
                    error: checkError(error.responseJSON, error.status)
                })
            }
            return dispatch({
                type: types.CONFIRMPASSWORD,
                confirmPassword: true
            })
        })
    }
}

export function forgotPassword(email, redirect = "/") {
    return function (dispatch) {
        dispatch(loading());

        return $.ajax({
            url: apiEndpoints.FORGOTPASSWORD_POST,
            method: 'post',
            data: JSON.stringify({ email }),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                dispatch({
                    type: types.FORGOTPASSWORD_SUCCESS
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.FORGOTPASSWORD_FAIL, redirect)
            }
        });
    }
}


export function checkValidToken(token, redirect = "/") {
    return function (dispatch) {
        dispatch(loading())
        // let url =  responseJSON.API_URL +  ROSTER + 'login'

        return $.ajax({
            url: apiEndpoints.VALIDTOKEN_POST,
            method: 'post',
            data: {},
            contentType: "application/json",
            headers: { 'Authorization': 'Bearer ' + token },
            success: function (data, status, xhr) {
                dispatch({
                    type: types.VALIDTOKEN_SUCCESS
                });
            },
            error: function (xhr) {
                let responseText = undefined
                try {
                    responseText = JSON.parse(xhr.responseText)
                    return dispatch({
                        type: types.VALIDTOKEN_FAIL,
                        error: checkError(responseText, xhr.status)
                    })
                }
                catch (err) {
                    let error = {}
                    if (xhr.status == 401) {
                        // error.exception = true;
                        // error.message = 'Unauthorized'
                        error = undefined;
                    }
                    else {
                        error.exception = true;
                        error.message = 'Server error'
                    }
                    return dispatch({
                        type: types.VALIDTOKEN_FAIL,
                        error: error
                    })
                }
            }
        });
    }
}


export function changeForgetPassword(token, newPassword, redirect = "/", type = types.CHANGEFORGETPASSWORD) {
    return function (dispatch) {
        dispatch(loading());

        return $.ajax({
            url: apiEndpoints.CHANGEFORGETPASSWORD_PUT,
            method: 'put',
            data: JSON.stringify({ newPassword }),
            contentType: "application/json",
            headers: { 'Authorization': 'Bearer ' + token },
            success: function (data, status, xhr) {
                // dispatch(loginSuccess(data.data, redirect, checkError(data, xhr.status)));
                return dispatch({
                    type: types.CHANGEFORGETPASSWORD,
                    afterChangePassword: true,
                    contactDetail: data.data,
                    error: checkError(data, xhr.status)
                });
            },
            error: function (xhr) {
                let responseText = undefined
                try {
                    responseText = JSON.parse(xhr.responseText)
                    return dispatch({
                        type: types.CHANGEFORGETPASSWORD,
                        error: checkError(responseText, xhr.status)
                    })
                }
                catch (err) {
                    let error = {}
                    if (xhr.status == 401) {
                        // error.exception = true;
                        // error.message = 'Unauthorized'
                        error = undefined;
                    }
                    else {
                        error.exception = true;
                        error.message = 'Server error'
                    }
                    return dispatch({
                        type: types.CHANGEFORGETPASSWORD,
                        error: error
                    })
                }
            }
        });
    }
}