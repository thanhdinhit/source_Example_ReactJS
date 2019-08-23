import { handleError } from '../services/common';
import * as CustomerService from '../services/customer.service';
import { store } from '../root';
import * as customerDTO from '../services/mapping/contractDTO';
import { checkError, catchError, getParams, canvasToImage } from '../services/common';

export function loadCustomers(queryString, callback) {
    let params = getParams(queryString);
    params['customerName'] = queryString.customerName ? "%" + queryString.customerName : undefined;
    params["supervisor.id"] = queryString.supervisorIds;
    params = _.omitBy(params, _.isUndefined);
    CustomerService.loadCustomers(params, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let customers = customerDTO.mapFromDtos(result.items);
        callback && callback(null, customers, result.meta);
    });
}