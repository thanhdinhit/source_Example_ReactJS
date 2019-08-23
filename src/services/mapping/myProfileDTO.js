import { clone } from '../../services/common';
import * as availabilityDto from './availabilityDTO';
import dateHelper from '../../utils/dateHelper'
import _ from 'lodash';
import moment from 'moment';
import { LOCATION_TYPE, getWorkingLocationTypeOptions } from '../../core/common/constants';

export function mapToDto(MyProfileDto) {
    let myProfile = clone(MyProfileDto)
    myProfile.time.availabilityTime = availabilityDto.mapToDtos(MyProfileDto.time.availabilityTime || [])
    myProfile.time.workingTime = availabilityDto.mapToDtos(MyProfileDto.time.workingTime || [])
    delete myProfile.reportToChecked
    delete myProfile.employeeDocuments // tam thoi delete de test api
    return myProfile;
}


export function mapFromDto(resultAPI) {
    let myProfile = {}
    if (!resultAPI) return undefined;
    myProfile = _.assign(resultAPI);
    myProfile.time.availabilityTime = availabilityDto.mapFromDtos(resultAPI.time.availabilityTime || [])
    myProfile.time.workingTime = availabilityDto.mapFromDtos(resultAPI.time.workingTime || [])
    if (myProfile.startDate)
        myProfile.startDate = new Date(myProfile.startDate);
    if (myProfile.birthday) {
        let utcDay = new Date(myProfile.birthday);
        myProfile.birthday = new Date(utcDay.getUTCFullYear(), utcDay.getUTCMonth(), utcDay.getUTCDate());
    }
    if (myProfile.jobRoles && myProfile.jobRoles.length) {
        let jobRole = myProfile.jobRoles[0]
        jobRole.label = jobRole.name;
        jobRole.value = jobRole.value;
        myProfile.jobRoles = jobRole;
    }
    else {
        myProfile.jobRoles = undefined;
    }
    if (myProfile.preferRegions && myProfile.preferRegions.length > 0) {
        let newRegions = []
        myProfile.preferRegions.forEach(function (region) {
            region.label = region.name;
            region.value = region.id
            newRegions.push(region)
        }, this);
        myProfile.preferRegions = newRegions;
    }
    if (myProfile.extendRegions && myProfile.extendRegions.length > 0) {
        let newRegions = []
        myProfile.extendRegions.forEach(function (region) {
            region.label = region.name;
            region.value = region.id
            newRegions.push(region)
        }, this);
        myProfile.extendRegions = newRegions;
    }
    myProfile.typeString = myProfile.type;
    myProfile.reportToString = myProfile.reportTo;
    myProfile.departmentString = myProfile.department;
    return myProfile;
}

export function mapToContactDetailDto(contactDetail) {
    let newContactDetail = _.clone(contactDetail);
    if (newContactDetail.birthday) {
        newContactDetail.birthday = moment(newContactDetail.birthday).format('YYYY-MM-DDT') + "00:00:00Z";
    }
    if (newContactDetail.startDate) {
        newContactDetail.startDate = dateHelper.localToUTC(newContactDetail.startDate);
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
    return newContactDetail;
}

export function mapFromApproversDTO(approversDTO) {
    return _.map(approversDTO, function (item) {
        return item.data;
    });
}