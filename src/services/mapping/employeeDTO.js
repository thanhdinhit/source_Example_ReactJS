import objectAssign from 'object-assign';
import moment from 'moment'
import { clone } from '../../services/common';
import * as shiftTemplateDto from './shiftTemplateSettingDto';
import * as availabilityDto from './availabilityDTO'
import dateHelper from '../../utils/dateHelper'
import _ from 'lodash';
import { COUNTRY } from '../../core/common/config';
import { LOCATION_TYPE, getWorkingLocationTypeOptions, TIMEFORMAT } from '../../core/common/constants';


export function mapToDtoRegion(region) {
    let baseRegion = {}
    baseRegion.id = region.id;
    return baseRegion;
}

export function mapToContactDetailDto(contactDetail) {
    let newContactDetail = _.clone(contactDetail);

    if (newContactDetail.birthday) {
        newContactDetail.birthday = moment(newContactDetail.birthday).format('YYYY-MM-DDT') + "00:00:00Z";
    }
    if (newContactDetail.startDate) {
        newContactDetail.startDate = dateHelper.localToUTC(newContactDetail.startDate);
    }
    if (newContactDetail.endDate) {
        newContactDetail.endDate = dateHelper.localToUTC(newContactDetail.endDate);
    }

    if (newContactDetail.gender) {
        newContactDetail.gender = newContactDetail.gender.value || newContactDetail.gender;
    }

    if (newContactDetail.location) {
        let workingLocationTypes = getWorkingLocationTypeOptions();
        if (workingLocationTypes.find(x => x.id === newContactDetail.location.id && x.id !== LOCATION_TYPE.LOCATION)) {
            newContactDetail.workingLocationType = newContactDetail.location.id;
            newContactDetail.location = undefined;
        }
        else if (!newContactDetail.location.id) {
            newContactDetail.location = undefined;
        }
    }

    if (newContactDetail.accessRoles) {
        let accessRoles = {};
        accessRoles.id = newContactDetail.accessRoles.id || newContactDetail.accessRoles[0].id;
        newContactDetail.accessRoles = [accessRoles];
    }
    delete newContactDetail.reportTo;
    return newContactDetail;
}

export function mapFromEmployeeContactDetailDTO(employeeContactDetail) {
    let contactDetail = {};
    contactDetail = _.assign({}, employeeContactDetail);

    const birthday = new Date(contactDetail.birthday);
    contactDetail.birthday = new Date(birthday.getUTCFullYear(), birthday.getUTCMonth(), birthday.getUTCDate());

    contactDetail.startDate && (contactDetail.startDate = new Date(contactDetail.startDate));
    contactDetail.endDate && (contactDetail.endDate = new Date(contactDetail.endDate));
    contactDetail.workMobile = contactDetail.workMobile;
    contactDetail.personalPhone = contactDetail.privateMobile;
    contactDetail.extensionPhone = contactDetail.deskPhone;
    if (contactDetail.accessRoles) {
        let accessRole = _.cloneDeep(contactDetail.accessRoles[0]);
        contactDetail.accessRoles = _.assign({}, accessRole);
    }
    const locationTypes = getWorkingLocationTypeOptions();
    locationTypes.forEach(function (item) {
        if (item.id === contactDetail.workingLocationType && item.id !== LOCATION_TYPE.LOCATION) {
            contactDetail.location = item;
        }
    });

    return contactDetail;
}

export function mapToDto(employeeDto) {
    let newEmployee = clone(employeeDto);

    newEmployee.contactDetail = mapToContactDetailDto(newEmployee.contactDetail)
    newEmployee.time.availabilityTime = availabilityDto.mapToDtos(newEmployee.time.availabilityTime)
    newEmployee.time.workingTime = availabilityDto.mapToDtos(newEmployee.time.workingTime)
    newEmployee.job = mapToJobDTO(newEmployee.job)

    return newEmployee;
}

export function mapFromDto(resultAPI) {
    let newEmployee = {};
    if (!resultAPI) return undefined;

    newEmployee = _.assign({}, resultAPI);
    newEmployee.contactDetail = mapFromEmployeeContactDetailDTO(newEmployee.contactDetail);
    newEmployee.job = mapFromJobDTO(newEmployee.job);

    newEmployee.time.availabilityTime = availabilityDto.mapFromDtos(newEmployee.time.availabilityTime || []);
    newEmployee.time.workingTime = availabilityDto.mapFromDtos(newEmployee.time.workingTime || []);

    return newEmployee;
}

export const mapFromDtos = function (resultAPI) {
    let newEmployees = [];
    resultAPI.forEach(function (element) {
        element = element.data;
        element.models = (element.device ? element.device.model : "");
        element.devideId = (element.device ? element.device.deviceId : "");
        if (element.shiftTemplates) {
            element.shiftTemplates.forEach(function (index) {
                index.endTime = new Date(index.endTime);
                index.startTime = new Date(index.startTime);
            }, this);
        }
        if (element.reportTo && element.reportTo.id) {
            element.reportTo.name = element.reportTo.firstName + " " + (element.reportTo.lastName || "");
        }
        if (element.contactDetail.birthday) {
            let utcDay = new Date(element.contactDetail.birthday);
            element.contactDetail.birthday = new Date(utcDay.getFullYear(), utcDay.getMonth(), utcDay.getDate());
        }
        if (element.contactDetail.startDate) {
            element.contactDetail.startDate = new Date(element.contactDetail.startDate);
        }
        if (element.contactDetail.endDate) {
            element.contactDetail.endDate = new Date(element.contactDetail.endDate);
        }
        if (element.joinDate) {
            element.joinDate = new Date(element.joinDate);
        }
        if (element.contactDetail) {
            let str = [];
            switch (LOCALIZE.COUNTRY) {
                case COUNTRY.AU:
                    const fieldaddressAU = ['city', 'postCode', 'state', 'street'];
                    for (let field of fieldaddressAU) {
                        if (element.contactDetail[field]) {
                            if (field == 'postCode' || field == 'street') {
                                str.push(element.contactDetail[field]);
                            }
                            str.push(element.contactDetail[field].name);
                        }
                    }
                    let address = str.filter(x => x != undefined);
                    element.contactDetail.address = address.join(', '); break;
                case COUNTRY.VN:
                    const fieldaddressVN = ['city', 'district', 'street'];
                    for (let field of fieldaddressVN) {
                        if (element.contactDetail[field]) {
                            if (field == 'street') {
                                str.push(element.contactDetail[field]);
                            }
                            str.push(element.contactDetail[field].name);
                        }
                    }
                    address = str.filter(x => x != undefined);
                    element.contactDetail.address = address.join(', '); break;
            }
        }
        if (element.job && element.job.employeeJobSkills) {
            let isWarning = undefined
            _.forEach(element.job.employeeJobSkills, (item) => {
                if (item.required)
                    if (item.jobSkill.requireCertificate && item.certificates.length || 0) {
                        _.map(item.certificates, (n) => {
                            if (new Date(n.expiredDate).getTime() < (new Date()).getTime())
                                isWarning = 'E135'
                        });
                    }
                    else if (item.jobSkill.requireCertificate && item.certificates.length == 0) {
                        isWarning = 'E134'
                    }
            });
            element.isWarning = isWarning;
        }
        newEmployees.push(element);
    }, this);

    return newEmployees;
};

export function mapFromContactDetailDto(resultAPI) {
    let rs = {}
    rs = _.clone(resultAPI)
    if (rs.workingLocationType != LOCATION_TYPE.LOCATION) {
        let location = _.find(getWorkingLocationTypeOptions(), (type) => type.id == rs.workingLocationType);
        rs.location = { name: location ? location.name : '' };
    }
    return rs;
}

export function mapToJobDTO(employeeJob) {
    let job = _.cloneDeep(employeeJob);

    if (job.employeeJobSkills) {
        job.employeeJobSkills.map(employeejobSkill => {
            if (employeejobSkill.certificates && employeejobSkill.certificates.length) {
                employeejobSkill.certificates.map(x => {
                    if (x.expiredDate) {
                        x.expiredDate = dateHelper.localToUTC(x.expiredDate);
                    }
                });
            }
        });
    }
    return job;
}

export function mapFromJobDTO(employeeJobDTO) {
    let job = _.cloneDeep(employeeJobDTO);

    if (job.employeeJobSkills) {
        job.employeeJobSkills.map(employeejobSkill => {
            if (employeejobSkill.certificates && employeejobSkill.certificates.length) {
                employeejobSkill.certificates.map(x => {
                    if (x.expiredDate) {
                        x.expiredDate = new Date(x.expiredDate);
                    }
                });
            }
        });
    }
    return job;
}

export function mapFromEmployeeTransfersDTO(employeeTransfersDTO) {
    let transfers = _.map(employeeTransfersDTO, function (item) {
        let transfer = _.cloneDeep(item.data);
        transfer.startDate = new Date(transfer.startDate);
        return transfer;
    });

    return transfers;
}

export function mapToEmployeeTransferDTO(employeeTransfer) {
    let employeeTransferDTO = { group: {} };
    employeeTransferDTO.group.id = employeeTransfer.group.id;
    employeeTransferDTO.startDate = dateHelper.localToUTC(employeeTransfer.startDate);
    employeeTransferDTO.notes = employeeTransfer.notes;

    return employeeTransferDTO;
}

export function mapToEmployeeAssignDTO(employees) {
    return _.map(employees, function (employee, index) {
        employee.data.shifts.map((shift) => {
            shift.endTime = dateHelper.formatTimeWithPattern(new Date(shift.endTime), TIMEFORMAT.WITHOUT_SECONDS);
            shift.startTime = dateHelper.formatTimeWithPattern(new Date(shift.startTime), TIMEFORMAT.WITHOUT_SECONDS);
        })
        return employee.data;
    });
}

export function mapFromEmployeeAvailabilityDtos(resultAPIs) {
    return _.map(resultAPIs, function (item) {
        item = item.data;
        _.each(item.shiftsOnThisDay, (shift) => {
            shift.startTime = new Date(shift.startTime);
            shift.endTime = new Date(shift.endTime);
            shift.startTimeString = dateHelper.formatTimeWithPattern(shift.startTime, TIMEFORMAT.WITHOUT_SECONDS);
            shift.endTimeString = dateHelper.formatTimeWithPattern(shift.endTime, TIMEFORMAT.WITHOUT_SECONDS);
        });

        return item;
    });
}