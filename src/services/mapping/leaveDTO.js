import _ from 'lodash';
import dateHelper from '../../utils/dateHelper'
import { DATETIME } from '../../core/common/constants';

export const mapfromDto = function (resultAPIs) {
    let newLeaves = [];
    resultAPIs.forEach(function (element) {
        let leave = mapFromLeaveDTO(element);
        newLeaves.push(leave);
    }, this);
    return newLeaves;
};

export function mapToDto(leave) {
    let rs = {}
    rs = _.assign(leave, {})

    delete rs.leaveFromString;
    delete rs.leaveToString;

    return rs;
}

export const mapFromLeaveDTO = function (element) {
    let leave = element.data;
    leave.leaveFrom = new Date(leave.leaveFrom);
    leave.leaveTo = new Date(leave.leaveTo);
    leave.leaveFromString = dateHelper.formatTimeWithPattern(leave.leaveFrom, DATETIME.DATE_LEAVE);
    leave.leaveToString = dateHelper.formatTimeWithPattern(leave.leaveTo, DATETIME.DATE_LEAVE);

    const leaveStart = leave.leaveFromString.split(" ");
    const leaveEnd = leave.leaveToString.split(" ");

    leave.startTime = leaveStart[1];
    leave.endTime = leaveStart[1];
    leave.startDate = leaveStart[0];
    leave.endDate = leaveEnd[0];

    return leave;
};

export const mapToLeaveDTO = function (leave) {
    let leaveDto = _.cloneDeep(leave);
    delete leaveDto['leaveFromString'];
    delete leaveDto['leaveToString'];
    delete leaveDto['startTime'];
    delete leaveDto['endTime'];
    delete leaveDto['startDate'];
    delete leaveDto['endDate'];
    leaveDto.leaveFrom = dateHelper.localToUTC(leaveDto.leaveFrom);
    leaveDto.leaveTo = dateHelper.localToUTC(leaveDto.leaveTo);

    return leaveDto;
};

export const mapToLeaveHoursDTO = function (leave) {
    ['leaveFrom', 'leaveTo'].forEach(function (item) {
        leave[item] = dateHelper.localToUTC(leave[item]);
    });

    return leave;
};

export const mapFromLeaveBalancesDTO = function (leaveBalancesDTO) {
    return _.map(leaveBalancesDTO, function (item) {
        return item.data;
    });
};