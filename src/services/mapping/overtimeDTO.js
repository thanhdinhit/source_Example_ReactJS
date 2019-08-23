import _ from 'lodash';
import dateHelper from '../../utils/dateHelper'
import { DATETIME } from '../../core/common/constants';

export const mapFromDtos = function (resultAPIs) {
    return _.map(resultAPIs, function (item) {
        return mapFromOvertimeDTO(item);
    });
};

export const mapFromOvertimeDTO = function (element) {
    let overtime = element.data;
    overtime.overtimeFrom = new Date(overtime.overtimeFrom);
    overtime.overtimeTo = new Date(overtime.overtimeTo);
    overtime.overtimeFromString = dateHelper.formatTimeWithPattern(overtime.overtimeFrom, DATETIME.DATE_OVERTIME);
    overtime.overtimeToString = dateHelper.formatTimeWithPattern(overtime.overtimeTo, DATETIME.DATE_OVERTIME);

    return overtime;
};

export const mapToOvertimeDTO = function (element) {
    let overtimeDto = _.cloneDeep(element);

    delete overtimeDto['overtimeFromString'];
    delete overtimeDto['overtimeToString'];
    overtimeDto.overtimeFrom = dateHelper.localToUTC(overtimeDto.overtimeFrom);
    overtimeDto.overtimeTo = dateHelper.localToUTC(overtimeDto.overtimeTo);
    overtimeDto.contract = _.get(overtimeDto, 'contract.id');
    return overtimeDto;
};

export const mapFromStatisticDtos = function (resultAPIs) {
    let overtimes = [];
    resultAPIs.forEach(function (element) {
        let overtime = mapFromStatisticDto(element);
        overtimes.push(overtime);
    }, this);
    return overtimes;
};

export const mapFromStatisticDto = function (element) {
    let overtime = element.data;
    return overtime;
};

export const mapFromOvertimeRateSetting = function (resultAPIs) {
    return _.map(resultAPIs, (item) => item.data);
}