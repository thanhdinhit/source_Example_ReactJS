import { formatDate, formatDateTimesheets, formatTimeTimesheets } from '../common';
import dateHelper from '../../utils/dateHelper';
import { TIMEFORMAT, FILTER_DATE, DATETIME } from '../../core/common/constants';
import _ from 'lodash';
import moment from 'moment';

export const mapFromDtos = function (resultAPIs) {
    return _.map(resultAPIs, function (item) {
        return mapFromDto(item);
    });
};

export const mapFromEmployeeTimesheetDtos = function (resultAPIs) {
    return _.map(resultAPIs, (item) => {
        return item.data
    })
}

export const mapFromGroupTimesheetDtos = function (resultAPIs) {
    return _.map(resultAPIs, function (item) {
        return mapFromGroupTimesheetDto(item);
    });
};

export const mapFromDto = function (element) {
    let timesheet = element.data;
    if (timesheet.clockedIn) {
        timesheet.clockedIn = new Date(timesheet.clockedIn);
        timesheet.clockedInString = dateHelper.formatTimeWithPattern(timesheet.clockedIn, TIMEFORMAT.CLOCKED_IN_OUT)
    }

    timesheet.clockedOut = new Date(timesheet.clockedOut);
    timesheet.createdDate = new Date(timesheet.createdDate);

    return timesheet;
};

export const mapFromGroupTimesheetDto = function (element) {
    let timesheet = element.data;
    if (_.get(timesheet, 'group.lastSubmission')) {
        timesheet.group.lastSubmission = new Date(timesheet.group.lastSubmission);
    }
    // let parents = getParentPath(timesheet);
    // timesheet.parentName = [...parents, ''].join(' / ');

    return timesheet;
}

export const mapFromTimesheetTypeDtos = function (resultAPIs) {
    return _.map(resultAPIs, function (item) {
        return mapFromTimesheetTypeDto(item);
    });
};

export const mapFromTimesheetTypeDto = function (element) {
    let timesheet = element.data;

    return timesheet;
};

export const mapFromTimesheetSettingDto = function (element) {
    let timesheetSetting = element.data;

    return timesheetSetting;
};

export const mapFromTeamTimesheets = function (resultAPI) {
    return resultAPI;
}
export const mapToDto = function (timesheet) {
    let timesheetDto = _.cloneDeep(timesheet);
    ['clockIn', 'clockOut', 'occurredDate', 'createdDate', 'modifiedDate'].forEach(key => {
        timesheetDto[key] = dateHelper.localToUTC(timesheetDto[key]);
    });

    return timesheetDto;
};

export const mapToTimesheetDTO = function (timesheet) {
    let timesheetDto = _.cloneDeep(timesheet);
    timesheetDto.approvedHours = _.toString(timesheetDto.approvedHours);
    timesheetDto.clockIn = dateHelper.localToUTC(timesheetDto.clockIn);
    timesheetDto.clockOut = dateHelper.localToUTC(timesheetDto.clockOut);
    timesheetDto.occurredDate = dateHelper.localToUTC(timesheetDto.occurredDate);
    timesheetDto.createdDate = dateHelper.localToUTC(timesheetDto.createdDate);
    timesheetDto.modifiedDate = dateHelper.localToUTC(timesheetDto.modifiedDate);
    return timesheetDto;
};

export const mapFromDtoMyTimesheets = function (resultAPI) {
    let timesheetGroupByWeek = [];

    _.forEach(resultAPI, (item, index) => {
        item = mapFromDtoMyTimesheet(item.data);

        const indexMatchingWeek = getIndexMatching('week', item.week, timesheetGroupByWeek);

        if (indexMatchingWeek != -1) {
            const indexMatchingDate = getIndexMatching('date', item.date, timesheetGroupByWeek[indexMatchingWeek].items);
            if (indexMatchingDate != -1) {
                return timesheetGroupByWeek[indexMatchingWeek].items[indexMatchingDate].items.push(item);
            }
            return timesheetGroupByWeek[indexMatchingWeek].items.push({
                date: item.date,
                items: [item]
            });
        }
        return timesheetGroupByWeek.push({
            week: item.week,
            items: [{
                date: item.date,
                items: [item]
            }]
        });
    });

    return timesheetGroupByWeek;
};

const getIndexMatching = function (key, value, list) {
    let result = -1;
    _.some(list, (item, index) => {
        if (item[key] === value) {
            result = index;
            return true;
        }
    });
    return result;
};

export const mapFromDtoMyTimesheet = function (timesheetDto) {
    if (timesheetDto.clockedIn) {
        timesheetDto.clockedIn = new Date(timesheetDto.clockedIn);
        timesheetDto.clockedInString = dateHelper.formatTimeWithPattern(timesheetDto.clockedIn, TIMEFORMAT.CLOCKED_IN_OUT)
    }
    if (timesheetDto.clockedOut) {
        timesheetDto.clockedOut = new Date(timesheetDto.clockedOut)
        if (dateHelper.isEqualDate(timesheetDto.clockedOut, timesheetDto.clockedIn)) {
            timesheetDto.clockedOutString = dateHelper.formatTimeWithPattern(timesheetDto.clockedOut, TIMEFORMAT.CLOCKED_IN_OUT)
        } else {
            timesheetDto.clockedOutString = dateHelper.formatTimeWithPattern(timesheetDto.clockedOut, TIMEFORMAT.CLOCKED_OUT_OVER)
        }
    }
    if (timesheetDto.createdDate) {
        timesheetDto.createdDate = new Date(timesheetDto.createdDate)
    }

    timesheetDto.dayOfWeek = dateHelper.formatTimeWithPattern(timesheetDto.createdDate, TIMEFORMAT.DATE_TEAM_TIMESHEET);
    timesheetDto.date = dateHelper.formatTimeWithPattern(timesheetDto.createdDate, FILTER_DATE.FORMAT);
    timesheetDto.week = dateHelper.getWeekNumber(timesheetDto.createdDate);
    return timesheetDto;
};

export const mapToTimesheetDtos = function (timesheetByWeek) {
    const timesheets = [];
    _.forEach(timesheetByWeek, week => {
        _.forEach(week.items, day => {
            _.forEach(day.items, timesheet => {
                timesheets.push(mapToDto(timesheet));
            });
        });
    });
    return timesheets;
}

export const mapToTeamTimesheetDtos = function (teamTimesheets) {
    const teamTimesheetDtos = _.map(teamTimesheets, team => {
        team.startDate = dateHelper.localToUTC(team.startDate);
        team.endDate = dateHelper.localToUTC(team.endDate);
        return team;
    });
    return teamTimesheetDtos;
};

export const mapToTeamTimesheetHistoryDtos = function (groupstimesheetsHistory) {
    const groupsTimesheetHistoryDtos = _.map(groupstimesheetsHistory, team => {
        return {
            groupId: team.id,
            fromDate: dateHelper.localToUTC(team.fromDate),
            toDate: dateHelper.localToUTC(team.toDate)
        };
    });
    return groupsTimesheetHistoryDtos;
};

export const mapFromGroupTimesheetStatisticsDtos = function (groupTimesheetStatisticsDtos) {
    let currentDate = new Date();
    let groupStatusTimesheets = _.map(groupTimesheetStatisticsDtos, dto => {
        let groupStatistic = dto.data;

        if (groupStatistic.submitTo) {
            groupStatistic.submitTo = new Date(groupStatistic.submitTo);
        }
        if (groupStatistic.groupTimesheetStatistic.group.lastSubmission) {
            groupStatistic.groupTimesheetStatistic.group.lastSubmission = new Date(groupStatistic.groupTimesheetStatistic.group.lastSubmission);
        }
        groupStatistic = { ...groupStatistic, ...groupStatistic.groupTimesheetStatistic.group };
        delete groupStatistic.groupTimesheetStatistic.group;
        return groupStatistic;
    });
    groupStatusTimesheets.forEach(group => {
        group.parents = getParents(group, groupStatusTimesheets);
        group.notAllowSubmit = (group.submitTo ? group.submitTo.getTime() >= currentDate.getTime() : !group.lastSubmission);
        group.timesheetDisabled = (group.existingPending || group.existingLeave || group.existingOvertime);
        group.checked = true
    });
    return groupStatusTimesheets;
};

const getParents = function (group, groups) {
    let parents = [];
    if (group) {
        if (group.parent) {
            let parent = _.find(groups, x => x.id == group.parent.id)
            if (parent) {
                return [...getParents(parent, groups), parent.name]
            }
            else {
                return [group.parent.name]
            }

        } else {
            return []
        }
    }
    else {
        return []
    }
}

export const mapToApproveAllTimesheetDtos = function (employeeTimesheet) {
    let timesheets = {};
    timesheets.groupId = employeeTimesheet.groupId;
    timesheets.idTimesheets = employeeTimesheet.idTimesheets;
    timesheets.startDate = dateHelper.localToUTC(employeeTimesheet.startDate);
    timesheets.endDate = dateHelper.localToUTC(employeeTimesheet.endDate);
    return timesheets;
}

export const mapFromCountAllPending = function (countPending) {
    let countAllPending = {};
    countAllPending.countPendings = countPending.data.countPendings;
    return countAllPending;
}

export const mapFromGroupsTimesheetsHistory = function (groupsTimesheetsHistory) {
    let data = []
    _.map(groupsTimesheetsHistory, group => {
        let groupClone = _.cloneDeep(group.data);
        if (groupClone) {
            data.push(groupClone);
        }
    });
    return data;
};

export const mapFromsubmittedGroupsTimesheetsHistory = function (groupId, data) {
    let newData = []
    _.map(data, group => {
        let groupClone = _.cloneDeep(group.data);
        if (groupClone) {
            groupClone.submitOn = new Date(groupClone.submitOn);
            groupClone.groupId = groupId;
            newData.push(groupClone);
        }
    })
    return newData;
}

export const mapFromGroupTeamTimesheetHistory = function (resultAPIs) {
    return _.map(resultAPIs, (item) => {
        item = item.data;
        return item;
    })
}

