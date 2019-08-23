import * as types from '../constants/actionTypes';
import * as customerDTO from '../services/mapping/customerDTO';
import * as CustomerService from '../services/customer.service';
import * as UploadService from '../services/upload.service';
import { checkError, catchError, getParams, canvasToImage } from '../services/common';
import _ from 'lodash';

export function loadCustomers(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params['customerName'] = queryString.customerName ? "%" + queryString.customerName : undefined;
        params["supervisor.id"] = queryString.supervisorIds;
        params = _.omitBy(params, _.isUndefined);
        CustomerService.loadCustomers(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_CUSTOMER, redirect);
            }
            let customers = customerDTO.mapFromDtos(result.items);
            return dispatch({
                type: types.LOAD_ALL_CUSTOMER,
                customers,
                meta: result.meta
            });
        });
    };
}

export function loadCustomerDetail(customerId, redirect = '/') {
    return function (dispatch) {
        CustomerService.loadCustomersDetail(customerId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_CUSTOMER, redirect);
            }
            let customer = customerDTO.mapFromDto(result.data);
            return dispatch({
                type: types.LOAD_CUSTOMER,
                customer,
                meta: result.meta
            });
        });
    };
}

export function deleteCustomer(customerId, redirect = '/'){
    return function (dispatch) {
        CustomerService.deleteCustomer(customerId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_CUSTOMER, redirect);
            }
            return dispatch({
                type: types.DELETE_CUSTOMER
            });
        });
    };
}

export function addCustomer(customer, redirect = '/') {
    return function (dispatch) {
        if (_.isUndefined(customer.avatar)) {
            addCustomerDto(dispatch, customer ,'', redirect);
        } else {
            var data = new FormData();
            data.append("uploadingFiles", canvasToImage(customer.avatar));
            UploadService.uploadFile(data, function (error, result, status, xhr) {
                if (error) {
                    return catchError(error, dispatch, types.ADD_CUSTOMER, redirect);
                }
                addCustomerDto(dispatch, customer, result.items[0].data.relativeFilePath);
            });
        }
    }
}

function addCustomerDto(dispatch, customer, photoUrl, redirect = '/') {
    let customerData = customerDTO.mapToCustomerDto(customer, photoUrl);
    CustomerService.addCustomer(customerData, function (error, result, status, xhr) {
        if (error) {
            return catchError(error, dispatch, types.ADD_CUSTOMER, redirect);
        }
        return dispatch({
            type: types.ADD_CUSTOMER
        });
    });
}

export function editCustomer(customer, redirect = '/') {
    return function (dispatch) {
        let params = {
            customerId: customer.id
        };

        CustomerService.editCustomer(customer, params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_CUSTOMER, redirect);
            }
            return dispatch({
                type: types.EDIT_CUSTOMER,
                customer : result.data
            });
        });
    };
}

export function changeAvatar(avatar, customer, redirect = '/') {
    return function (dispatch) {
        var data = new FormData();
        data.append("uploadingFiles", canvasToImage(avatar));
        UploadService.uploadFile(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.CHANGE_CUSTOMER_AVATAR, redirect);
            }
            let cloneDeepCustomer = _.cloneDeep(customer);
            cloneDeepCustomer.photoUrl =  result.items[0].data.relativeFilePath
            let params = {
                customerId: cloneDeepCustomer.id
            };
            CustomerService.editCustomer(cloneDeepCustomer, params, function (error, result, status, xhr) {
                if (error) {
                    return catchError(error, dispatch, types.EDIT_CUSTOMER, redirect);
                }
                return dispatch({
                    type: types.EDIT_CUSTOMER,
                    customer : result.data
                });
            });
        });
    }
}