import { handleError, checkError, getParams } from '../services/common';
import * as EmployeeService from '../services/employee.service';
import { store } from '../root';
import * as employeeDTO from '../services/mapping/employeeDTO';
import _ from 'lodash';

export function searchAssignmentAvailability(queryString, callback) {
    let params = _.omitBy(queryString, _.isUndefined);

    EmployeeService.searchAssignmentAvailability(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let employees = employeeDTO.mapFromEmployeeAvailabilityDtos(result.items);
        callback && callback(null, employees);
    });
}

export function searchReplacementAvailability(queryString, callback) {
    let params = _.omitBy(queryString, _.isUndefined);

    EmployeeService.searchReplacementAvailability(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let employees = employeeDTO.mapFromEmployeeAvailabilityDtos(result.items);
        callback && callback(null, employees);
    });
}

export function searchResourcePool(queryString, callback) {
    let params = _.omitBy(queryString, _.isUndefined);

    EmployeeService.searchResourcePool(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let employees = employeeDTO.mapFromEmployeeAvailabilityDtos(result.items);
        callback && callback(null, employees);
    });
}

export function loadEmployee(employeeId, callback) {
    EmployeeService.loadEmployee({ employeeId }, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let employee = employeeDTO.mapFromDto(result.data);
        callback && callback(null, employee);
    });
}

export function loadAllEmployee(queryString, callback) {
    let params = getParams(queryString);
    params["jobRole.id"] = queryString.jobRoleIds;
    params["group.id"] = queryString.groupIds;
    params["group.supervisorId"] = queryString.reportToIds;
    params["location.id"] = queryString.locationIds;
    params["identifier"] = queryString.identifier;
    params["gender"] = queryString.gender;
    params["street"] = queryString.street ? "%" + queryString.street : undefined;
    params["district.id"] = queryString.districtIds;
    params["city.id"] = queryString.cityIds;
    params["state.id"] = queryString.stateIds;
    params["postCode"] = queryString.postCode ? "%" + queryString.postCode : undefined;
    params["email"] = queryString.email ? "%" + queryString.email : undefined;
    params["birthday"] = queryString.birthday;
    params["workMobile"] = queryString.workingMobile ? "%" + queryString.workingMobile : undefined;
    params["privateMobile"] = queryString.privateMobile ? "%" + queryString.privateMobile : undefined;
    params["startDate"] = queryString.startDate;
    params["type.id"] = queryString.employeeTypeIds;
    params["status"] = queryString.status;
    params["userRole.id"] = queryString.userRoleIds;
    params["employeeJobSkills.jobSkill.id"] = queryString.employeeJobSkillIds;
    params["terminatedDate"] = queryString.terminatedDate;
    params["terminationReason.id"] = queryString.terminationReason;
    params["terminationType"] = queryString.terminationType;
    params["search_text"] = queryString.searchText ? "%" + queryString.searchText : undefined;

    params = _.omitBy(params, _.isUndefined);

    EmployeeService.searchEmployees(params, function (error, result, status, xhr) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let employees = employeeDTO.mapFromDtos(result.items);
        callback && callback(null, { employees, meta: result.meta })
    });
}

export function transferEmployee(employeeId, transferInfo, callback) {
    const employeeTransferDTO = employeeDTO.mapToEmployeeTransferDTO(transferInfo);
    EmployeeService.transferEmployee(employeeId, employeeTransferDTO, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, result.data);
    });
}

export function editEmployeeOrganization(groupInf, callback) {
    EmployeeService.editEmployeeOrganization(groupInf.id, groupInf, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, result.data);
    });
}

export function addNewEmployeeOrganization(groupInf, callback) {
    EmployeeService.addNewEmployeeOrganization(groupInf, function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        callback && callback(null, result.data);
    });
}

export function loadAllBaseEmployee(callback) {
    EmployeeService.loadAllBaseEmployee(function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        let baseEmployees = _.map(result.items, (item) => {
            return item.data;
        });
        callback && callback(null, baseEmployees);
    });
}
