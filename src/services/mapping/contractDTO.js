import dateHelper from '../../utils/dateHelper'
import { TIMEFORMAT, SCHEDULE_TYPE } from '../../core/common/constants';
import _ from 'lodash';

export function mapFromDto(resultAPI) {
    let contract = resultAPI.data;
    contract.endDate = new Date(contract.endDate);
    contract.startDate = new Date(contract.startDate);

    return contract;
}

export function mapFromContractSchedulesDtos(resultAPIs) {
    let rs = {
        schedules: [],
        flexibleSchedules: []
    }
    _.forEach(resultAPIs, (result, index) => {
        let item = result.data;
        item.startDate = new Date(item.startDate);
        item.endDate = new Date(item.endDate);
        item.timestamp = `${new Date().getTime()}-${index}`
        switch (item.type) {
            case SCHEDULE_TYPE.NORMAL:
                rs.schedules.push(item)
                break;
            case SCHEDULE_TYPE.FLEXIBLE:
                rs.flexibleSchedules.push(item)
                break;
        }
    });
    return rs;
}

export function mapFromContractSchedulesShift(shifts) {
    return _.map(shifts, (shift) => {
        shift = shift.data;

        let startTimeAndWeekday = dateHelper.convertTimeAndWeekdayToLocal(shift.startTime, shift.weekday);

        shift.startTime = startTimeAndWeekday.date;
        shift.endTime = new Date(shift.endTime);

        shift.weekday = startTimeAndWeekday.weekday;

        shift.startTimeString = dateHelper.formatTimeWithPattern(new Date(shift.startTime), TIMEFORMAT.WITHOUT_SECONDS);
        shift.endTimeString = dateHelper.formatTimeWithPattern(new Date(shift.endTime), TIMEFORMAT.WITHOUT_SECONDS)

        if (shift.breakFrom)
            shift.breakTimeFromString = dateHelper.formatTimeWithPattern(new Date(shift.endTime), TIMEFORMAT.WITHOUT_SECONDS)
        if (shift.breakTo)
            shift.breakTimeToString = dateHelper.formatTimeWithPattern(new Date(shift.breakTo), TIMEFORMAT.WITHOUT_SECONDS)

        let workingTime = dateHelper.subtractTime(shift.startTimeString, shift.endTimeString);
        let breakTime = dateHelper.subtractTime(shift.breakTimeFromString, shift.breakTimeToString);
        shift.regularHours = workingTime - (breakTime ? breakTime : 0);
        shift.regularHours = shift.regularHours.toFixed(2);

        _.forEach(shift.history, item => {
            item.editDate = new Date(item.editDate);
            item.effectiveDate = new Date(item.effectiveDate);
        });
        return shift;
    });

}

export function mapFromContractAttachmentDtos(resultAPIs) {
    let result = _.map(resultAPIs, (result) => {
        let item = result.data;
        return item;
    });
    return result;
}

export function mapFromContractLinkDtos(resultAPIs) {
    let result = _.map(resultAPIs, (result) => {
        let item = result.data;
        item.id = item.linkId;
        item.identifier = item.contractLinkIdentifier
        return item;
    });
    return result;
}

export function mapFromContractAppendixDtos(resultAPIs) {
    let result = _.map(resultAPIs, (result) => {
        let item = result.data;
        item.effectedDate = new Date(item.effectedDate);
        return item;
    });
    _.sortBy(result, [function (x) { return x.effectedDate.getTime() }])
    return result;
}

export function mapFromDtos(resultAPIs) {
    let contractResults = _.clone(resultAPIs);
    let contracts = [];

    contracts = _.map(contractResults, (result) => {
        result.data.endDate = new Date(result.data.endDate);
        result.data.startDate = new Date(result.data.startDate);

        return result.data;
    }, this);

    return contracts;
}

export function mapToDto(contractDto) {
    let newContract = _.cloneDeep(contractDto);
    newContract.startDate = dateHelper.localToUTC(newContract.startDate);
    newContract.endDate = newContract.endDate.setHours(23, 59, 0, 0);
    newContract.endDate = dateHelper.localToUTC(newContract.endDate);
    if (newContract.suspendDate) {
        newContract.suspendDate = dateHelper.localToUTC(newContract.suspendDate);
    }
    if (newContract.terminateDate) {
        newContract.terminateDate = dateHelper.localToUTC(newContract.terminateDate);
    }
    if (newContract.appendixEffectDate) {
        newContract.appendixEffectDate = dateHelper.localToUTC(newContract.appendixEffectDate);
    }
    delete newContract.schedules;
    delete newContract.flexibleSchedules;

    return newContract;
}

export function mapToEditDto(contractDto) {
    let newContract = _.cloneDeep(contractDto);
    newContract.startDate = newContract.startDate ? dateHelper.localToUTC(newContract.startDate) : null;
    if (newContract.endDate) {
        newContract.endDate = newContract.endDate.setHours(23, 59, 0, 0);
        newContract.endDate = dateHelper.localToUTC(newContract.endDate);
    }
    if (newContract.suspendDate) {
        newContract.suspendDate = dateHelper.localToUTC(newContract.suspendDate);
    }
    if (newContract.terminateDate) {
        newContract.terminateDate = dateHelper.localToUTC(newContract.terminateDate);
    }
    if (newContract.appendixEffectDate) {
        newContract.appendixEffectDate = dateHelper.localToUTC(newContract.appendixEffectDate);
    }
    _.each(newContract.schedules, (item, index) => {
        item.startDate = dateHelper.localToUTC(item.startDate);
        item.endDate = item.endDate.setHours(23, 59, 0, 0);
        item.endDate = dateHelper.localToUTC(item.endDate);
        
        // item.shiftTemplate = newContract.shiftTemplate;
        _.each(item.shifts, (shift) => {
            // _.each(shift.require, (require) => {
            //     delete require['id'];
            //     delete require['name'];
            // })
            let timeAndWeekdayUTC = dateHelper.convertTimeAndWeekdayToUTC(shift.startTime, shift.weekday);
            shift.startTime = timeAndWeekdayUTC.date;
            shift.endTime = dateHelper.localToUTC(shift.endTime);
            shift.weekday = timeAndWeekdayUTC.weekday;

            shift.breakTimeFrom = shift.breakTimeFrom ? dateHelper.localToUTC(shift.breakTimeFrom) : null;
            shift.breakTimeTo = shift.breakTimeTo ? dateHelper.localToUTC(shift.breakTimeTo) : null;


            _.forEach(shift.history, item => {
                item.editDate = dateHelper.localToUTC(item.editDate);
                item.effectiveDate = dateHelper.localToUTC(item.effectiveDate);
            });
        });
        newContract.schedules[index] = { schedule: item, shifts: item.shifts }
        delete newContract.schedules[index].schedule.shifts;
    });
    _.each(newContract.flexibleSchedules, (item, index) => {
        item.startDate = dateHelper.localToUTC(item.startDate);
        item.endDate = item.endDate.setHours(23, 59, 0, 0);
        item.endDate = dateHelper.localToUTC(item.endDate);
        _.each(item.shifts, (shift) => {
            shift.startTime = dateHelper.localToUTC(shift.startTime);
            shift.endTime = dateHelper.localToUTC(shift.endTime);
            _.forEach(shift.history, item => {
                item.editDate = dateHelper.localToUTC(item.editDate);
                item.effectiveDate = dateHelper.localToUTC(item.effectiveDate);
            });
        });
        newContract.flexibleSchedules[index] = { schedule: item, shifts: item.shifts }
        delete newContract.flexibleSchedules[index].schedule.shifts;
    });
    _.each(newContract.links, (item, index) => {
        if(item.linkId != null)
            newContract.links[index] = { linkId: item.linkId }
        else newContract.links[index] = { linkId: item.id}
        if (newContract.id) {
            newContract.links[index].contractId = newContract.links.linkId;
        }

    });

    newContract.schedules.push(...newContract.flexibleSchedules)
    delete newContract.flexibleSchedules;


    newContract = { contract: { ...newContract }, schedules: newContract.schedules };
    delete newContract.contract.schedules;

    return newContract;
}