import _ from 'lodash';
import { browserHistory } from 'react-router';
import { getUrlPath } from '../core/utils/RoutesUtils';
import * as types from '../core/common/method.types';
import * as securityUtils from './securityUtils';

export function getHeader(curEmp, method, url, body) {
    let header = {}, token, secret;
    if (curEmp) {
        token = curEmp.token;
        secret = curEmp.secret;
    } else {
        token = localStorage.token || null;
        secret = localStorage.secret || null;
    }
    if (token) {
        header = getSecurityHeaders(method, url, body, token, secret);
    }

    header['Accept'] = 'application/json';
    header['Content-Type'] = 'application/json';
    header['Authorization'] = 'Bearer ' + token;

    return header;
}

export function getQueryStringListParams(arr) {
    let query = undefined;
    if (arr && arr.length) {
        query = '(' + arr.join(',') + ')';
    }
    return query;
}

export function convertNumbersToQueryString(data, isNumber) {
    let queryString = '';
    if (!data || !data.value1) {
        return queryString;
    }
    if (isNumber) {
        if (data.operator1.label == '=') {
            queryString += data.value1;
        }
    } else {
        queryString += data.operator1.label + data.value1;
    }

    if (!data.oneField && data.value2) {
        queryString += (data.andor == 'and' ? '&&' : '||');
        queryString += data.operator2.label + data.value2;
    }
    return queryString;
}

export function convertQueryStringToList(str, isNumber = true) {
    if (!str) {
        return undefined;
    }
    str = str.slice(1, -1)
    return isNumber ? _.map(_.split(str, ','), _.parseInt) : _.split(str, ',');
}

export function handleFilterParamsChange(objURL, queryString) {
    browserHistory.replace(getUrlPath(objURL) + encodeParams(queryString));
}

export function encodeParams(queryString) {
    let paramsString = _.map(_.keys(_.omitBy(queryString, _.isUndefined)), (key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(queryString[key]);
    }).join('&');
    return paramsString ? '?' + paramsString : '';
}

//for Security for Headers based upon body
function getSecurityHeaders(method, url, body, token, secret) {
    let nonce = securityUtils.generateNonce();
    let timestamp = securityUtils.generateTimestamp();

    // let singnature = securityUtils.generateSignature(method + (method === types.GET_METHOD ? "" : JSON.stringify(body)),
    //     token + nonce + timestamp + secret,
    //     timestamp,
    //     true);
    let singnature = securityUtils.generateSignature(method, url, timestamp, nonce, body, token, secret);
    return {
        Signature: singnature,
        Timestamp: timestamp,
        Nonce: nonce
    };
}
