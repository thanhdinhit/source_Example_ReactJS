import dateHelper, { days } from '../../utils/dateHelper'
import { extendMoment } from 'moment-range';
import Moment from 'moment';
import colorHelper from '../../utils/colorHelper'
import { TIMEFORMAT, SCHEDULE_STATUS } from '../../core/common/constants';
const moment = extendMoment(Moment);
import _ from 'lodash';

export const getShiftUnAssignments = function (totalShiftAssignments, queryString, shiftTemplateLocations) {
    shiftUnAssignments = []
    if (shiftTemplateLocations.length > 0) {
        shiftTemplateLocations.forEach(function (shiftTemplateLocation) {
            let shiftAssignments = totalShiftAssignments.filter(x => x.shiftTemplate.id == shiftTemplateLocation.shiftTemplateId && x.location.id == shiftTemplateLocation.locationId)
        }, this);
    }
    return shiftUnAssignments;
}

export const mapFromScheduleDetail = function (resultAPIs) {
    let rs = resultAPIs;
    if (rs.startDate)
        rs.startDate = new Date(rs.startDate);
    if (rs.endDate)
        rs.endDate = new Date(rs.endDate);
    _.forEach(resultAPIs.shifts, shift => {
        shift.startTime = new Date(shift.startTime)
        shift.endTime = new Date(shift.endTime)
    })
    return rs;
}

export const mapFromScheduleShifts = function (resultAPIs, schedule, queryString) {
    let scheduleShiftView = { data: [], status: { error: 0, missing: 0, toBeNofity: 0, pending: 0, assigned: 0 } };
    let employeeSchedules = [];
    let assigned = [];
    resultAPIs.forEach(element => {
        element = element.data;
        element.endTime = new Date(element.endTime);
        element.startTime = new Date(element.startTime);
        employeeSchedules.push(element);
    });

    employeeSchedules = _.sortBy(employeeSchedules, 'startTime');

    let scheduleGroups = [_.get(schedule.schedule, 'group.id'), ..._.map(schedule.scheduleSubGroups, 'id')];
    let managedGroups = _.map(schedule.managedGroups, 'id')

    let from = moment(queryString.from).startOf("isoWeek");
    let to = moment(queryString.to);
    let daysDiff = Math.round(to.diff(from, 'd', true));
    let range = moment().range(queryString.from, queryString.to)
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < daysDiff; i++) {
        let day = { data: [] };
        let date = moment(from).add(i, 'd');
        let hasAssignment = false;

        if (range.contains(date)) {
            if ((new Date(date)).getTime() < today.getTime()) {
                day.viewMode = true;
            }

            let shifts = _.filter(employeeSchedules, (item) => moment(item.startTime).isSame(date, 'date'));

            _.each(shifts, (shift) => {
                let jobMissing = [];
                let jobTobeRemoves = [];
                let status = '';
                let statusDetails = {
                    error: false,
                    toBeNofity: false,
                    missingResource: false
                };
                let workingTime = dateHelper.subtractTime(shift.startTime, shift.endTime);
                let breakTime = dateHelper.subtractTime(shift.breakFrom, shift.breakTo);
                shift.regularHours = workingTime - (breakTime ? breakTime : 0);
                shift.regularHours = shift.regularHours.toFixed(2);
                shift.requires = shift.requirements;
                shift.assignments = []

                _.each(shift.requirements, (requirement) => {

                    // calculate job missing
                    let numberMissing = requirement.number - requirement.assignments.length;
                    if (numberMissing > 0) {
                        jobMissing.push({
                            jobRole: requirement.jobRole,
                            number: numberMissing,
                            requirementId: requirement.id
                        });
                        scheduleShiftView.status.missing += numberMissing;
                    }
                    else if (numberMissing < 0) {
                        jobTobeRemoves.push({
                            jobRole: requirement.jobRole,
                            number: - numberMissing
                        })
                    }

                    //flat assignments to shift
                    shift.assignments.push(...requirement.assignments)
                });

                _.each(shift.assignments, assignment => {
                    let isAssigneeFromOtherGroup = false, isReplacementFromOtherGroup = false;
                    if (assignment.replacement) {
                        assignment.replacement.replaceFrom = new Date(assignment.replacement.replaceFrom);
                        assignment.replacement.replaceTo = new Date(assignment.replacement.replaceTo);
                    }
                    if (assignment.replacement && assignment.replacement.employee) {
                        isReplacementFromOtherGroup =
                            !_.includes(scheduleGroups, assignment.replacement.employee.group.id) &&
                            !_.includes(managedGroups, assignment.replacement.employee.group.id);
                    }

                    if (assignment.status === SCHEDULE_STATUS.TO_BE_NOTIFY) {
                        scheduleShiftView.status.toBeNofity++;
                    }
                    if (assignment.status === SCHEDULE_STATUS.NOTIFIED && assignment.isOvertime == true) {
                        scheduleShiftView.status.pending++;
                    }
                    if (assignment.error != null) {
                        scheduleShiftView.status.error++;
                    }
                    if (assignment.employee) {
                        assigned.push(assignment.employee);
                        if (assignment.replacement) {
                            assigned.push(assignment.replacement.employee);
                        }
                    }
                    if (assignment.leave) {
                        assignment.leave.leaveFrom = new Date(assignment.leave.leaveFrom);
                        assignment.leave.leaveTo = new Date(assignment.leave.leaveTo);
                    }

                    isAssigneeFromOtherGroup =
                        !_.includes(scheduleGroups, assignment.employee.group.id) &&
                        !_.includes(managedGroups, assignment.employee.group.id);
                    assignment.isFromOtherGroup = isAssigneeFromOtherGroup || isReplacementFromOtherGroup;

                })

                // calculate shift status
                statusDetails.error = !!_.find(shift.assignments, (assignment) => assignment.error);
                statusDetails.toBeNofity = !!_.find(shift.assignments, (assignment) => assignment.status == SCHEDULE_STATUS.TO_BE_NOTIFY);
                statusDetails.missingResource = !_.isEmpty(jobMissing);

                status = _.find(['error', 'toBeNofity', 'missingResource'], (item) => statusDetails[item]);
                status = jobTobeRemoves.length > 0 ? 'error' : status;
                status = status || 'notified';

                //calculate number error
                if (jobTobeRemoves.length)
                    scheduleShiftView.status.error++;

                if (!!shift.assignments.length) hasAssignment = true;

                day.data.push({ data: shift, jobMissing, jobTobeRemoves, status });
            });
        }
        else {
            day.viewMode = true;
            day.invisible = true;
        }

        day.date = date.toDate();
        day.hasAssignment = hasAssignment;

        scheduleShiftView.data.push(day);
    }

    assigned = _.unionBy(assigned, 'id');
    scheduleShiftView.status.assigned = assigned.length;

    return { scheduleShiftView };
}

export const mapFromDtosToVisualView = function (resultAPIs, queryString, shiftTemplates) {
    let rs = {}
    rs.startDate = new Date(queryString.startDate);
    rs.endDate = new Date(queryString.endDate);
    rs.dateRange = dateHelper.getDateFromRangeDate(rs.startDate, rs.endDate)

    rs.shiftTemplates = []
    shiftTemplates.forEach(function (shiftTemplate, index) {
        shiftTemplate.color = colorHelper.color[index]
        rs.shiftTemplates.push(shiftTemplate)
    }, this);


    rs.dailyShiftAssignments = []
    resultAPIs.forEach(function (shiftAssignment) {
        shiftAssignment.shiftDate = new Date(shiftAssignment.shiftDate);

        if (!rs.dailyShiftAssignments.length) {
            let dailyShiftAssignment = {}
            dailyShiftAssignment.date = shiftAssignment.shiftDate;
            dailyShiftAssignment.shiftTemplateAssignments = []

            let shiftTemplateAssignment = {};
            shiftTemplateAssignment.shiftTemplate = shiftAssignment.shiftTemplate;
            shiftTemplateAssignment.shiftAssignments = []

            shiftTemplateAssignment.shiftAssignments.push(shiftAssignment);
            dailyShiftAssignment.shiftTemplateAssignments.push(shiftTemplateAssignment);
            rs.dailyShiftAssignments.push(dailyShiftAssignment);
        }
        else {
            let dailyShiftAssignment = rs.dailyShiftAssignments.find(x => x.date.valueOf() == shiftAssignment.shiftDate.valueOf())
            if (dailyShiftAssignment) {
                let shiftTemplateAssignment = dailyShiftAssignment.shiftTemplateAssignments.find(x => x.shiftTemplate.id == shiftAssignment.shiftTemplate.id);
                if (shiftTemplateAssignment) {
                    shiftTemplateAssignment.shiftAssignments.push(shiftAssignment);
                }
                else {
                    shiftTemplateAssignment = {}
                    shiftTemplateAssignment.shiftTemplate = shiftAssignment.shiftTemplate;
                    shiftTemplateAssignment.shiftAssignments = [];
                    shiftTemplateAssignment.shiftAssignments.push(shiftAssignment);
                    dailyShiftAssignment.shiftTemplateAssignments.push(shiftTemplateAssignment);
                }
            }
            else {
                dailyShiftAssignment = {}
                dailyShiftAssignment.date = shiftAssignment.shiftDate;
                dailyShiftAssignment.shiftTemplateAssignments = []

                let shiftTemplateAssignment = {};
                shiftTemplateAssignment.shiftTemplate = shiftAssignment.shiftTemplate;
                shiftTemplateAssignment.shiftAssignments = []

                shiftTemplateAssignment.shiftAssignments.push(shiftAssignment);
                dailyShiftAssignment.shiftTemplateAssignments.push(shiftTemplateAssignment);
                rs.dailyShiftAssignments.push(dailyShiftAssignment);
            }
        }

    }, this);


    return rs;
}

export const mapToDto = function (jobRoleDto) {
    return jobRoleDto;
}

export const mapToDtoRemoveAll = function ({ from, to }) {
    let removeAll = {};
    removeAll.fromDate = from ? dateHelper.localToUTC(from) : undefined;
    if (from && from.getTime() < (new Date()).getTime()) {
        removeAll.from = dateHelper.localToUTC(new Date());
    }
    removeAll.toDate = to ? dateHelper.localToUTC(to) : undefined;
    return removeAll;
};

export const mapFromDtos = function (resultAPIs) {
    return _.map(resultAPIs, item => {
        item = item.data;
        _.forEach(['startDate', 'endDate'], field => {
            if (item[field])
                item[field] = new Date(item[field]);
        });
        return item;
    });
};

export const mapToCopyScheduleDto = function (copySchedule) {
    copySchedule.sourceFrom = dateHelper.localToUTC(copySchedule.sourceFrom);
    copySchedule.sourceTo = dateHelper.localToUTC(copySchedule.sourceTo);
    _.forEach(copySchedule.destinations, item => {
        item.destinationFrom = dateHelper.localToUTC(item.destinationFrom);
        item.destinationTo = dateHelper.localToUTC(item.destinationTo);
    });
    return copySchedule;
};

export const mapToRemoveAssignmentDto = function (removeAssignmentDto) {
    if (removeAssignmentDto.from) {
        removeAssignmentDto.fromDate = dateHelper.localToUTC(removeAssignmentDto.from);
    }
    if (removeAssignmentDto.to) {
        removeAssignmentDto.toDate = dateHelper.localToUTC(removeAssignmentDto.to);
    }
    delete removeAssignmentDto.from;
    delete removeAssignmentDto.to;
    return removeAssignmentDto;
}

export const mapFromMyScheduleDtos = function (resultAPIs, queryString) {
    let result = []

    _.each(resultAPIs, (element) => {
        let item = element.data;
        item.shiftDate = new Date(item.startTime);
        item.endTime = dateHelper.formatTimeWithPattern(new Date(item.endTime), TIMEFORMAT.WITHOUT_SECONDS);
        item.startTime = dateHelper.formatTimeWithPattern(new Date(item.startTime), TIMEFORMAT.WITHOUT_SECONDS);
        result.push(item);

    });

    let data = [], dates = [];
    let from = moment(queryString.from);
    let to = moment(queryString.to);
    let daysDiff = Math.round(to.diff(from, 'd', true));

    let groupByLocation = _.groupBy(result, 'location.id');

    _.each(groupByLocation, (value, key) => {
        let location = _.get(value, '[0].location');
        let shifts = [];
        for (let i = 0; i < daysDiff; i++) {
            let date = moment(queryString.from).add(i, 'd');
            let dayShifts = _.filter(value, x => moment(x.shiftDate).isSame(date, 'date'));
            _.each(dayShifts, (item) => {
                if (item.leave) {
                    item.leave.leaveFrom = new Date(item.leave.leaveFrom);
                    item.leave.leaveFromInHour = dateHelper.formatTimeWithPattern(item.leave.leaveFrom, TIMEFORMAT.WITHOUT_SECONDS);
                    item.leave.leaveTo = new Date(item.leave.leaveTo);
                    item.leave.leaveToInHour = dateHelper.formatTimeWithPattern(item.leave.leaveTo, TIMEFORMAT.WITHOUT_SECONDS);
                }
            });
            shifts.push({
                date: date.toDate(),
                data: dayShifts
            });
        }
        data.push({ location, data: shifts });
    });

    for (let i = 0; i < daysDiff; i++) {
        let date = moment(queryString.from).add(i, 'd');
        dates.push(date.toDate());
    }

    return { dates, data };
}

export const mapToScheduleShiftDto = function (shift) {
    let {
        scheduleId,
        startTime,
        endTime,
        breakTimeFrom,
        breakTimeTo,
        requires,
        color
    } = shift;
    let shiftDto = {
        scheduleId,
        startTime,
        endTime,
        breakFrom: breakTimeFrom,
        breakTo: breakTimeTo,
        color
    };
    _.each(['startTime', 'endTime', 'breakFrom', 'breakTo'], (field) => {
        shiftDto[field] = shiftDto[field] ? dateHelper.localToUTC(shiftDto[field]) : null;
    });
    shiftDto.requirements = _.map(requires, (item) => {
        return {
            jobRole: { id: item.jobRole.id },
            number: item.number
        };
    })
    return shiftDto;
}

export const mapToShiftDto = function (shift) {
    let shiftDto = _.assign({}, shift);
    if (shift.endTime.getTime() <= shift.startTime.getTime()) {
        shift.endTime = shift.startTime.setDate(shift.startTime.getDate() + 1);
    }
    _.forEach(['breakFrom', 'breakTo', 'endTime', 'startTime'], field => {
        if (shift[field])
            shiftDto[field] = dateHelper.localToUTC(shift[field]);
    });
    shiftDto.requirements = shiftDto.requires;
    delete shiftDto.requires;

    return shiftDto;
}

export const mapToReplaceDto = function (data) {
    data.fromDate = data.from ? dateHelper.localToUTC(data.from) : null;
    data.toDate = data.to ? dateHelper.localToUTC(data.to) : null;
    delete data.from;
    delete data.to;
    return data;
}

export const mapToCopyScheduleShiftsDto = function (data) {
    data.source = _.map(data.source, source => {
        source.fromDate = dateHelper.localToUTC(source.from);
        source.toDate = dateHelper.localToUTC(source.to);
        delete source.from
        delete source.to
        return source;
    })

    data.destination = _.map(data.destination, item => {
        item.fromDate = dateHelper.localToUTC(item.from);
        item.toDate = dateHelper.localToUTC(item.to);
        delete item.from
        delete item.to
        return item;
    })

    return data;
}