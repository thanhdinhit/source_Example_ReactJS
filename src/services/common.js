import { browserHistory } from 'react-router';
import { loginFail } from '../actions/authenticateActions';
import update from 'react-addons-update'
import toastr from 'toastr';
import { URL } from './../core/common/app.routes';
import { getUrlPath } from './../core/utils/RoutesUtils';
import _ from 'lodash'
export const formatDate = function (timeUTC) {
    if (timeUTC)
        return new Date(timeUTC);
    return undefined;
};
let months = new Array(12);
months[0] = "Jan";
months[1] = "Feb";
months[2] = "Mar";
months[3] = "Apr";
months[4] = "May";
months[5] = "Jun";
months[6] = "Jul";
months[7] = "Aug";
months[8] = "Sep";
months[9] = "Oct";
months[10] = "Nov";
months[11] = "Dec";

export const formatDateLeave = function (date) {
    let min = date.getMinutes() == '0' ? '00' : date.getMinutes();
    return date.getHours() + ':' + min + ' ' + (months[date.getMonth()]) + ' ' + date.getDate() + ', ' + date.getFullYear();
};
export const formatDateTimesheets = function (date) {
    return (months[date.getMonth()]) + ' ' + date.getDate() + ', ' + date.getFullYear();
};

export const formatTimeTimesheets = function (date) {
    if (date) {
        let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        return hours + ':' + min
    }
    else return undefined
};

export const clone = function (obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}

export function post(url, data) {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
}

export function checkError(data, status) {
    let error = {
        code: 0,
        message: '',
        exception: false
    }
    if (data) {
        if (data == null && data.items == null) {
            error.code = 1000
            error.message = 'PAGE_NOT_FOUND'
        }
        if (data.errors && data.errors.length > 0) {
            error.code = data.errors[0].code;
            error.message = data.errors[0].message;

        }
        if (data.error) {
            error.code = data.error.code;
            error.message = data.error.message;
        }
    }

    error.status = status;
    return error;

}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function catchError(xhr, dispatch, type, redirect) {
    let responseText = undefined
    try {
        responseText = JSON.parse(xhr.responseText)
        if (xhr.status == 401) {
            dispatch(loginFail())
            browserHistory.push(`/login?next=${redirect}`)
        }

        return dispatch({
            type: type,
            error: checkError(responseText, xhr.status)
        })
    }
    catch (err) {
        let error = {}
        if (xhr && xhr.status == 401) {
            // error.exception = true;
            // error.message = 'Unauthorized'
            error = undefined;
            toastr.error("You have no permission for this action")
            dispatch(loginFail())
            browserHistory.push(`/login?next=${redirect}`)
        }
        else {
            error.exception = true;
            error.message = 'Server error'
        }
        if (xhr && xhr.readyState == 0) {
            error.exception = true;
            error.message = 'No connection to server'
        }
        return dispatch({
            type: type,
            error: error
        })
    }
}


export function catchError2(xhr, type, redirect) {
    let responseText = undefined
    try {
        responseText = JSON.parse(xhr.responseText)
        if (xhr.status == 401) {
            // dispatch(loginFail())
        }

        return {
            type: type,
            error: checkError(responseText, xhr.status)
        }
    }
    catch (err) {
        let error = {}
        if (xhr.status == 401) {
            // error.exception = true;
            // error.message = 'Unauthorized'
            error = undefined;
            toastr.error("You have no permission for this action")
            // dispatch(loginFail())
        }
        else {
            error.exception = true;
            error.message = 'Server error'
        }
        if (xhr.readyState == 0) {
            error.exception = true;
            error.message = 'No connection to server'
        }
        return {
            type: type,
            error: error
        }
    }
}

export function handleError(xhr, dispatch) {
    let responseText = undefined
    try {
        responseText = JSON.parse(xhr.responseText)
        if (xhr.status == 401) {
            dispatch(loginFail())
        }

        return checkError(responseText, xhr.status)
    }
    catch (err) {
        let error = {}
        if (xhr.status == 401) {
            // error.exception = true;
            // error.message = 'Unauthorized'
            error = undefined;
            toastr.error("You have no permission for this action")
            dispatch(loginFail())
        }
        else {
            error.exception = true;
            error.message = 'Server error'
        }
        if (xhr.readyState == 0) {
            error.exception = true;
            error.message = 'No connection to server'
        }
        return error
    }
}

export function handleCRUDAction(state, action) {
    let newState = {};
    if (action.error && action.error.code != 0 || (action.error && action.error.exception)) {
        newState = update(state, {
            payload: {
                isLoading: {
                    $set: false
                },
                error: {
                    $set: action.error
                },
            },
        });
        return newState;
    }
    if (action.errors && action.errors.length > 0) {
        newState = update(state, {
            payload: {
                isLoading: {
                    $set: false
                },
                errors: {
                    $set: action.errors
                },
            },
        });
        return newState;
    }
    newState = _.cloneDeep(state);
    newState = update(newState, {
        payload: {
            success: {
                $set: true
            },
            redirect: {
                $set: action.redirect
            },
            isLoading: {
                $set: false
            }
        }


    })
    return newState;
}

export function validateEmail(email) {
    let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return regexEmail.test(email)
}

//http://icodingclub.blogspot.com/2014/10/html5-ajax-file-upload-image-or-html5.html
export const canvasToImage = function (canvas) {
    let type = canvas.split(',')[0].split(';')[0].split(':')[1]
    let name = 'ava.' + type.split('/')[1];

    var byteString = atob(canvas.split(",")[1]),
        ab = new ArrayBuffer(byteString.length),
        ia = new Uint8Array(ab),
        i;

    for (i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: type });
}

export const defaultOptionToastr = function (toastr) {
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.preventDuplicates = false;
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.closeButton = true;
    toastr.options.closeHtml = '<button type="button" class="toast-close-button" role="button"></button>';
    toastr.options.showDuration = 100;

}
export const getParams = function (params) {
    let apiParams = {};
    apiParams.order_by = params.order_by;
    apiParams.is_desc = params.is_desc;
    apiParams.page_size = params.page_size || -1;
    apiParams.page = params.page;

    return apiParams;
}

export const removeUndefinedParams = function (params) {
    let apiParams = clone(params);
    for (let fieldName in apiParams) {
        if (params.hasOwnProperty(fieldName) && apiParams[fieldName] === undefined) {
            delete apiParams[fieldName];
        }
    }
    return apiParams;
}

export const authorization = function (rights, curEmp, component, redirect = '/') {
    if (rights.length > 0) {
        let hasPermission = true;
        rights.forEach(function (element) {
            if (!curEmp.rights.find(x => x == element)) {
                hasPermission = false;
            }

        }, this);
        if (hasPermission)
            return component;
        else {
            browserHistory.push('/' + getUrlPath(URL.NOT_PERMISSION));
            return null;
        }
    }
    else return component;
}

export const next = function (funcManager, curFunc) {
    if (!curFunc || !funcManager) return undefined;
    let index = funcManager.indexOf(curFunc);
    if (index == funcManager.length - 1 || index < 0) {
        return undefined;
    }
    else {
        return funcManager[index + 1];
    }
}

export const encodeURL = function (queryString) {
    let paramsString = _.map(_.keys(_.omitBy(queryString, _.isUndefined)), (key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(queryString[key]);
    }).join('&');
    return "?" + paramsString;
}