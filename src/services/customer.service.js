import HttpRequests from '../core/utils/HttpRequest';
import { getApiPath } from '../core/utils/RoutesUtils';
import { API } from '../core/common/app.routes';

export const loadCustomers = function (data, callback) {
    let path = getApiPath(API.CUSTOMERS);
    return HttpRequests.post(path, data, callback);
};

export const loadCustomersDetail = function (customerId, data, callback) {
    let path = getApiPath(API.CUSTOMERS_DETAIL, {customerId} );
    return HttpRequests.get(path, data, callback);
};

export const deleteCustomer = function (customerId, callback) {
    let path = getApiPath(API.CUSTOMERS_DETAIL, { customerId });
    return HttpRequests.delete(path, null, callback);
};

export const addCustomer = function (customer, callback) {
    let path = getApiPath(API.NEW_CUSTOMER);
    return HttpRequests.post(path, customer, callback);
};

export const editCustomer = function (data, params, callback) {
    let path = getApiPath(API.CUSTOMERS_DETAIL, params);
    return HttpRequests.put(path, data, callback);
};