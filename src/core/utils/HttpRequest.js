import { getHeader } from '../../utils/apiHelper';
import * as types from '../common/method.types';

function HttpRequest() { };
global.indicatorKeys = [];

HttpRequest.get = function (url, callback) {
    let method = types.GET_METHOD;
    return async(method, url, {}, callback);
};

HttpRequest.post = function (url, data, callback) {
    let method = types.POST_METHOD;
    return async(method, url, data, callback);
};

HttpRequest.postFormData = function (url, data, callback) {
    let method = types.POST_METHOD;
    return asyncFormData(method, url, data, callback);
};

HttpRequest.put = function (url, data, callback) {
    let method = types.PUT_METHOD;
    return async(method, url, data, callback);
};

HttpRequest.patch = function (url, data, callback) {
    let method = types.PATCH_METHOD;
    return async(method, url, data, callback);
};

HttpRequest.delete = function (url, data, callback) {
    let method = types.DELETE_METHOD;
    return async(method, url, data, callback);
};

function getUrl(url) {
    return API_DATA + url;
}

function async(method, url, body, callback) {
    let apiUrl = getUrl(url);
    let headers = getHeader(null, method, apiUrl, body);
    let indicatorKey = Math.random();
    global.indicatorKeys.push(indicatorKey);
    return $.ajax({
        method: method,
        contentType: 'text/json',
        url: apiUrl,
        data: method === types.GET_METHOD ? null : JSON.stringify(body),
        headers: headers,
        success: function (result, status, xhr) {
            _.remove(global.indicatorKeys, function (n) {
                return n == indicatorKey;
            });
            if (callback) {
                callback(null, result, status, xhr);
            }
        },
        error: function (err) {
            _.remove(global.indicatorKeys, function (n) {
                return n == indicatorKey;
            });
            if (callback) {
                callback(err);
            }
        }
    });
}

function asyncFormData(method, url, body, callback) {
    let apiUrl = getUrl(url);
    let headers = getHeader(null, method, apiUrl, body);
    delete headers.Accept;
    delete headers['Content-Type'];
    let indicatorKey = Math.random();
    global.indicatorKeys.push(indicatorKey);
    return $.ajax({
        method: method,
        url: apiUrl,
        data: method === types.GET_METHOD ? null : body,
        headers: headers,
        contentType: false,
        processData: false,
        success: function (result, status, xhr) {
            _.remove(global.indicatorKeys, function (n) {
                return n == indicatorKey;
            });
            if (callback) {
                callback(null, result, status, xhr);
            }
        },
        error: function (err) {
            _.remove(global.indicatorKeys, function (n) {
                return n == indicatorKey;
            });
            if (callback) {
                callback(err);
            }
        }
    });
}

export default HttpRequest;