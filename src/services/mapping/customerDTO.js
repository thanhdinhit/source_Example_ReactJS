import { clone } from '../../services/common';
import _ from 'lodash';
import dateHelper from '../../utils/dateHelper';


export const mapFromDtos = function (resultAPIs) {
    let customers = resultAPIs.map(x=>x.data);
    return customers;
}
export const mapFromDto = function (customer) {
    let customerDto = _.cloneDeep(customer);
    if(customerDto.contracts) {
        customerDto.contracts = _.map(customerDto.contracts, item => {
            let contract = _.cloneDeep(item)
            contract.startDate = new Date(contract.startDate);
            contract.endDate = new Date(contract.endDate);
            return contract;
        });
    }
    return customerDto;
}

export const mapToDto = function (customerDto) {
    let newCustomer = clone(customerDto)
    return newCustomer;
}

export function mapToCustomerDto(customer, photoUrl) {
    let newCustomer = _.cloneDeep(customer);
    delete newCustomer.avatar;
    newCustomer.photoUrl = photoUrl;
    return newCustomer;
}