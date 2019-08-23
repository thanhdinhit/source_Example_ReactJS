import dateHelper from '../../utils/dateHelper'
import moment from 'moment'
import _ from 'lodash';
import {TIMEFORMAT} from '../../core/common/constants'

export const mapFromDtos = function (resultAPIs) {
    return _.map(resultAPIs, (item) => {
        let data = item.data;
        _.each(data.shiftTimes, (time) => {
            let workingTime = dateHelper.subtractTime(time.startTime, time.endTime);
            let breakTime = dateHelper.subtractTime(time.breakTimeFrom, time.breakTimeTo);
            time.regularHours = workingTime - (breakTime ? breakTime : 0);
            time.startTime = new Date(time.startTime);
            time.endTime = new Date(time.endTime);
            time.startTimeString = dateHelper.formatTimeWithPattern(time.startTime, TIMEFORMAT.WITHOUT_SECONDS);
            time.endTimeString = dateHelper.formatTimeWithPattern(time.endTime, TIMEFORMAT.WITHOUT_SECONDS);
            if (time.breakTimeFrom) {
                time.breakTimeFrom = new Date(time.breakTimeFrom);
                time.breakTimeFromString = dateHelper.formatTimeWithPattern(time.breakTimeFrom, TIMEFORMAT.WITHOUT_SECONDS);
            }
            if (time.breakTimeTo) {
                time.breakTimeTo = new Date(time.breakTimeTo);
                time.breakTimeToString = dateHelper.formatTimeWithPattern(time.breakTimeTo, TIMEFORMAT.WITHOUT_SECONDS);
            }
        });

        return data;
    });
}

export const mapToDto = function (shiftTemplateDto) {
    let newShiftTemplate = {}
    newShiftTemplate.monday = false,
        newShiftTemplate.tuesday = false,
        newShiftTemplate.wednesday = false,
        newShiftTemplate.thursday = false,
        newShiftTemplate.friday = false,
        newShiftTemplate.saturday = false,
        newShiftTemplate.sunday = false,


    newShiftTemplate = _.assign(newShiftTemplate, shiftTemplateDto)
    if (newShiftTemplate.endTime > newShiftTemplate.startTime) {
        newShiftTemplate.startTime = new Date(2000, 1, 15, newShiftTemplate.startTime.getHours(), newShiftTemplate.startTime.getMinutes(), 0);
        newShiftTemplate.endTime = new Date(2000, 1, 16, newShiftTemplate.endTime.getHours(), newShiftTemplate.endTime.getMinutes(), 0);
    }
    else {
        newShiftTemplate.startTime = new Date(2000, 1, 15, newShiftTemplate.startTime.getHours(), newShiftTemplate.startTime.getMinutes(), 0);
        newShiftTemplate.endTime = new Date(2000, 1, 15, newShiftTemplate.endTime.getHours(), newShiftTemplate.endTime.getMinutes(), 0);
    }
    newShiftTemplate.startTime = moment.utc(newShiftTemplate.startTime).format();
    newShiftTemplate.endTime = moment.utc(newShiftTemplate.endTime).format();
    return newShiftTemplate;
}