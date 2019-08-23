import objectAssign from 'object-assign';
import moment from 'moment'
import { clone } from '../../services/common';
import dateHelper from '../../utils/dateHelper';
import _ from 'lodash';
export function mapToNewOvertimeDto(overtimeDto, manager) {
    let newOvertimeDto = _.assign({}, overtimeDto)

    newOvertimeDto.overtimeFrom = dateHelper.formatUTCFromDatePicker(overtimeDto.startDate, overtimeDto.startTime);
    newOvertimeDto.overtimeTo = dateHelper.formatUTCFromDatePicker(overtimeDto.endDate, overtimeDto.endTime);
    newOvertimeDto.manager.id = manager.employeeId;
    delete newOvertimeDto.startDate;
    delete newOvertimeDto.startTime;
    delete newOvertimeDto.endDate;
    delete newOvertimeDto.endTime;
    delete newOvertimeDto.employee.status;
    return newOvertimeDto;
}
export function mapToDto(overtimeDto) {
    //format LocalTime to UTCFs
    overtimeDto.overtimeFrom = dateHelper.formatLocalDateToUTC(overtimeDto.overtimeFrom);
    overtimeDto.overtimeTo = dateHelper.formatLocalDateToUTC(overtimeDto.overtimeTo);
    return overtimeDto;
}
export function mapFromDto(resultAPI) {

}
export function mapFromConfigDto(resultAPI) {
    let rs = {}
    rs.maxOTHourPerMonth = resultAPI.overtimeConfigs.find(x => x.name == "Max overtime hours per month");
    rs.maxOTHourPerWeek = resultAPI.overtimeConfigs.find(x => x.name == "Max overtime hours per week");
    return rs;
}
export const mapFromDtos = function (resultAPI) {
    let rs = []
    resultAPI.forEach(function (element) {
        element.data.overtimeFrom = dateHelper.formatUTCToLocalDate(element.data.overtimeFrom);
        element.data.overtimeTo = dateHelper.formatUTCToLocalDate(element.data.overtimeTo);
        rs.push(element.data)
    }, this);
    return rs;
};