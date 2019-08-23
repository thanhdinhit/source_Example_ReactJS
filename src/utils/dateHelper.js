import { formatDate } from '../services/common';
import Moment from 'moment';
import _ from 'lodash';
import { extendMoment } from 'moment-range';
import { STATUS, FILTER_DATE, TIMESPAN, DATETIME, dateTimeOperatorOptions } from '../core/common/constants';

const moment = extendMoment(Moment);

export default class DateHelper {
  // See tests for desired format.
  static getFormattedDateTime(date = new Date()) {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${this.padLeadingZero(date.getMinutes())}:${this.padLeadingZero(date.getSeconds())}`;
  }

  static padLeadingZero(value) {
    return value > 9 ? value : `0${value}`;
  }

  static handleFormatDate(date) {
    var newDate = new Date(date)
    return ("0" + newDate.getMonth() + 1).slice(-2) + "/" + ("0" + (newDate.getDate())).slice(-2) + "/" + (newDate.getFullYear());
  }
  static handleFormatDateAsian(date) {
    var newDate = new Date(date)
    return ("0" + newDate.getDate()).slice(-2) + "/" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "/" + (newDate.getFullYear());
  }
  static differenceDate(dateFrom, dateTo) {
    return Math.round(Math.abs(formatDate(dateFrom) - formatDate(dateTo)) / (1000 * 3600))
  }
  static formatDate(timeUTC) {
    if (timeUTC)
      return new Date(timeUTC);
    return undefined;
  }
  static formatExpiredDate(date) {
    var today = moment(new Date());
    var startDate = moment(new Date(date)).add(1, 'day');
    var newDate = moment.duration(today.diff(startDate)).asMonths()
    let status = ''
    // if (newDate >= -1 && newDate < 0)
    //   status = STATUS.NEARLY_EXPIRED
    if (newDate > 0)
      status = STATUS.EXPIRED
    return status;
  }

  static convertTime(stringTime) {
    // string time like "00:00:00"
    let arr = stringTime.split(":");
    let hour = parseInt(arr[0]);
    let min = parseInt(arr[1]);
    let localDate = new Date(Date.UTC(1992, 12, 1, hour, min, 0));
    return localDate;

  }
  static getStringTime(date) {
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();;
    let mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let rs = '';
    rs = hours + ':' + mins
    return rs;
  }
  static formatTime(time) {
    let min = time.getMinutes();
    if (min < 15)
      min = 0;
    else if (15 <= min && min < 45)
      min = 30
    else if (45 <= min && min <= 59) {
      min = 0;
      time.setTime(time.getTime() + 60 * 60 * 1000);
    }
    time.setMinutes(min)
    time.setSeconds(0);
    return time;
  }
  static getDateFromRangeDate(from, to) {
    let days = [];
    for (let i = from; i <= to; i.setDate(i.getDate() + 1)) {
      days.push(new Date(i))
    }
    return days;
  }
  static formatUTCFromDatePicker(dateString, timeString) {
    let date = moment(dateString).local().format('DD/MM/YYYY');
    let time = moment(timeString).local().format('hh: mm A');
    let datetimeUTC = this.formatLocalDateToUTC(date + " " + time);

    return datetimeUTC;
  }

  static formatUTCToLocalDate(dateString) {
    let date = moment(dateString).local().format('DD/MM/YYYY hh:mm A');
    //let date = new Date(dateString);
    // let formatHours = date.getHours() > 12 ? ("0" + (date.getHours() - 12)).slice(-2) : ("0" + date.getHours()).slice(-2);
    // let typeDate = date.getHours() > 12 ? "PM" : "AM"
    // date = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + " "
    //   + formatHours + ":" + date.getMinutes() + "0" + " " + typeDate;
    return date;
  }
  static formatLocalDateToUTC(dateString) {
    let arrDate = dateString.split("/");
    dateString = arrDate[1] + "/" + arrDate[0] + "/" + arrDate[2];
    let date = new Date(dateString);
    //date = moment(date).format('MM/DD/YYYY h:mm A');
    let utcDate = moment.utc(date).format();
    return utcDate;
  }
  static localToUTC(date) {
    return moment.utc(date).format();
  }
  static formatTimeWithPattern(time, pattern) {
    if (time instanceof Date)
      return moment(time).format(pattern);
    return time;
  }
  static formatTimeWithPatternNoCheck(time, pattern) {
    return moment(time).format(pattern);
  }
  static formatPatternToTime(dateString, pattern) {
    return moment(dateString, pattern).toDate();
  }

  static getStartOfWeek(date) {
    return moment(date).startOf('isoWeek');
  }

  static getStartOfMonth(date) {
    return moment(date).startOf('month');
  }

  //Default date rage
  static getDateRange(startDate = new Date(), timespan = TIMESPAN.MONTH) {
    let from, to;

    switch (timespan) {
      case TIMESPAN.FROM_LAST_SUBMISSION:
        from = moment(startDate);
        to = new Date()
        to.setHours(23, 59)
        break;
      case TIMESPAN.WEEK:
      case TIMESPAN.ONE_WEEK:
        from = this.getStartOfWeek(startDate);
        to = moment(from).add(6, 'd').endOf('d');

        break;
      case TIMESPAN.LAST_WEEK:
        from = this.getStartOfWeek(startDate).subtract(1, 'w');
        to = moment(from).subtract(6, 'd');
        break;
      case TIMESPAN.TWO_WEEKS:
      case TIMESPAN.FORTNIGHT:
        from = this.getStartOfWeek(startDate);
        to = moment(from).add(13, 'd').endOf('d');
        break;
      case TIMESPAN.LAST_FORTNIGHT:
        from = this.getStartOfWeek(startDate).subtract(2, 'w');
        to = moment(from).add(13, 'd');
        break;
      case TIMESPAN.THREE_WEEKS:
        from = this.getStartOfWeek(startDate);
        to = moment(from).add(20, 'd').endOf('d');
        break;
      case TIMESPAN.MONTH:
        from = this.getStartOfMonth(startDate);
        to = moment(from).add(1, 'M').subtract(1, 'd').endOf('d');
        break;
      case TIMESPAN.LAST_MONTH:
        from = this.getStartOfMonth(startDate).subtract(1, 'M');
        to = moment(from).add(1, 'M').subtract(1, 'd');
        break;
      case TIMESPAN.MANUAL:
        from = moment(startDate);
        to = moment(from).add(6, 'd').endOf('d');
        break;
      default:
        break;
    }
    return { from: new Date(from), to: new Date(to) };
  }

  static convertDateRangeToQueryString(data) {
    let queryString;
    if (!data) {
      return queryString;
    }
    let range = {
      value1: data.from,
      value2: data.to,
      andor: 'and',
      operator1: {
        label: '>='
      },
      operator2: {
        label: '<='
      }
    };
    return DateHelper.convertDateToQueryString(range);
  }

  static convertDateToQueryString(data) {
    let queryString;
    if (!data || !data.value1) {
      return queryString;
    }
    queryString = 'DATE';
    queryString += data.operator1.label + "'" + moment(data.value1).format(FILTER_DATE.FORMAT) + "'";
    if (!data.oneField && data.value2) {
      queryString += (data.andor == 'and' ? '&&' : '||');
      queryString += data.operator2.label + "'" + moment(data.value2).format(FILTER_DATE.FORMAT) + "'";
    }
    return queryString;
  }

  static getCurMonth() {
    return moment().format('MMMM');
  }

  static convertDateTimeToQueryString(from, to) {
    from = new Date(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), from.getUTCHours(), from.getUTCMinutes())
    to = new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), to.getUTCHours(), to.getUTCMinutes())
    from = DateHelper.formatTimeWithPattern(from, DATETIME.FORMAT);
    to = DateHelper.formatTimeWithPattern(to, DATETIME.FORMAT);
    return "DATE<='" + to + "'&&>='" + from + "'";
  }
  static getWeekNumber(date = new Date()) {
    return moment(date).isoWeek();
  }

  static convertStringToSingleDateTime(str) {
    let regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/;
    let date = undefined;
    if (regex.test(str)) {
      let result = regex.exec(str);
      date = moment(result[1]).toDate();
    }
    return date;
  }

  static convertDateTimeStringToDate(str) {
    let regex = /DATE<=('\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')&&>=('\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')/;
    let dateObj = {};
    if (regex.test(str)) {
      dateObj.hasDate = true;
      let result = regex.exec(str);
      dateObj.from = moment(result[2].slice(1, -1)).toDate();
      dateObj.to = moment(result[1].slice(1, -1)).toDate();
      return dateObj;
    }
    return undefined;
  }

  static convertQueryStringToDate(str) {
    let regex = /DATE([!=<>]{1,2})('\d{4}-\d{2}-\d{2}')(([|&]{2})([!=<>]{1,2})('\d{4}-\d{2}-\d{2}'))?/;
    let dateObj = { andor: 'and' };
    if (regex.test(str)) {
      let result = regex.exec(str);
      let operator1 = _.find(dateTimeOperatorOptions, (op) => op.label == result[1]);
      if (operator1) {
        dateObj.oneField = true;
        dateObj.operator1 = operator1;
        dateObj.value1 = moment(result[2].slice(1, -1)).toDate();
      }
      if (result[4] == '||') {
        dateObj.andor = 'or';
      }
      let operator2 = _.find(dateTimeOperatorOptions, (op) => op.label == result[5]);
      if (operator2) {
        dateObj.oneField = false;
        dateObj.operator2 = operator2;
        dateObj.value2 = moment(result[6].slice(1, -1)).toDate();
      }
      return dateObj;
    }
    return undefined;
  }

  static convertQueryStringToDateRange(str) {
    let regex = /DATE<=('\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')&&>=('\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')/;
    let regex2 = / /;
    let dateObj = {};
    if (regex.test(str)) {
      let result = regex.exec(str);
      dateObj.from = moment(result[2].slice(1, -1).replace(regex2, 'T') + 'Z').toDate();
      dateObj.to = moment(result[1].slice(1, -1).replace(regex2, 'T') + 'Z').toDate();
      return dateObj;
    }
    return undefined;
  }

  static subtractTime(startTime, endTime) {
    let regex = /(\d{2}):(\d{2})/;
    let result;
    if (regex.test(startTime) && regex.test(endTime)) {
      let start = regex.exec(startTime);
      let end = regex.exec(endTime);
      let startTimeResult = parseInt(start[1]) + parseInt(start[2]) / 60;
      let endTimeResult = parseInt(end[1]) + parseInt(end[2]) / 60;
      result = endTimeResult > startTimeResult ? endTimeResult - startTimeResult : 24 - startTimeResult + endTimeResult;
    }
    return result;
  }

  static generateDays(start, end) {
    if ((start.getTime() > end.getTime()) || (!start || !end)) {
      return [];
    }
    let days = [];
    const range = moment.range(start, end).diff('days');
    for (let i = 0; i <= range; i++) {
      days.push(new Date(moment(start).add(i, 'd')));
    }
    return days;
  }
  static generateDateRanges(start, end, duration) {
    if ((!start || !end) || !duration || (start.getTime() > end.getTime())) {
      return [];
    }

    let startOfweek = moment(start).startOf('isoWeek');
    let endOfWeek = moment(end).endOf('isoWeek');

    let range = moment.range(startOfweek, endOfWeek).diff('days');
    let ranges = [];
    let addedDays = duration - 1;
    for (let i = 0; i < range; i += duration) {
      ranges.push({
        start: startOfweek,
        end: moment(startOfweek).add(addedDays, 'd')
      });
      startOfweek = moment(startOfweek).add(duration, 'd');
    }
    return ranges;
  }
  static generateDateRangesExceptRange(start, end, range, duration) {
    if ((!start || !end) || !duration || (start.getTime() > end.getTime())) {
      return [];
    }
    let rangeBefore = [], rangeAfter = [];

    let startOfWeek = moment(range.start).subtract(duration, 'd');
    let diff = moment.range(start, range.start).diff('days');
    for (let i = diff - duration; i >= 0; i -= duration) {
      rangeBefore.push({
        start: startOfWeek,
        end: moment(startOfWeek).add(duration - 1, 'd')
      });
      startOfWeek = moment(startOfWeek).subtract(duration, 'd');
    }

    diff = moment.range(range.end, end).diff('days');
    startOfWeek = moment(range.start).add(duration, 'd');
    for (let i = 0; i <= diff - duration; i += duration) {
      rangeAfter.push({
        start: startOfWeek,
        end: moment(startOfWeek).add(duration - 1, 'd')
      });
      startOfWeek = moment(startOfWeek).add(duration, 'd');
    }
    //-----------------------

    return [..._.reverse(rangeBefore), ...rangeAfter];
  }

  static filterRanges(ranges, min, max) {
    if (!ranges.length) {
      return [];
    }
    let indexOfStart = -1, indexOfEnd = -1;
    _.some(ranges, (range, index) => {
      if (new Date(range.start).getTime() >= min.getTime()) {
        indexOfStart = index;
        return true;
      }
    });
    for (let i = ranges.length - 1; i >= 0; i--) {
      if (new Date(ranges[i].end).getTime() <= max.getTime()) {
        indexOfEnd = i;
        break;
      }
    }

    if (indexOfStart == -1 || indexOfEnd == -1) {
      return [];
    }
    return _.slice(ranges, indexOfStart, indexOfEnd + 1);
  }
  static isEqualDate(day1, day2) {
    if (!day1 || !day2) {
      return false;
    }
    let day1Clone = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate(), 0, 0, 0, 0);
    let day2Clone = new Date(day2.getFullYear(), day2.getMonth(), day2.getDate(), 0, 0, 0, 0);
    return day1Clone.getTime() == day2Clone.getTime();
  }

  static isEqualDateString(dayString1, dayString2) {
    if (!day1 || !day2) {
      return false;
    }
    let day1 = moment(dayString1).format("dd/MM/yyyy");
    let day2 = moment(dayString2).format("dd/MM/yyyy");
    return day1 == day2;
  }

  static getTimeOfOnlyDate(dateTime) {
    if (!dateTime) return undefined;
    let date = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 0, 0, 0, 0);
    return date.getTime();
  }

  static addDay(from, duration) {
    let to = moment(from).add(duration, 'd');
    return to.toDate();
  }

  static isTimeInsideRange(range, value) {
    let regex = /(\d{2}):(\d{2})/;
    let result;
    if (regex.test(range.from) && regex.test(range.to) && regex.test(value)) {
      let from = regex.exec(range.from);
      let to = regex.exec(range.to);
      let time = regex.exec(value);

      let numFrom = parseInt(from[1]) + parseInt(from[2]) / 60;
      let numTo = parseInt(to[1]) + parseInt(to[2]) / 60;
      let numTime = parseInt(time[1]) + parseInt(time[2]) / 60;

      result = numFrom < numTo ? (numFrom <= numTime && numTime <= numTo) : (numFrom <= numTime || numTime <= numTo);
    }
    return result;
  }

  static isDurationInsideRange(outer, inner) {
    let regex = /(\d{2}):(\d{2})/;
    let result;
    if (regex.test(outer.from) && regex.test(outer.to) && regex.test(inner.from) && regex.test(inner.to)) {
      let outerFrom = regex.exec(outer.from);
      let outerTo = regex.exec(outer.to);
      let innerFrom = regex.exec(inner.from);
      let innerTo = regex.exec(inner.to);

      let numOuterFrom = parseInt(outerFrom[1]) + parseInt(outerFrom[2]) / 60;
      let numOuterTo = parseInt(outerTo[1]) + parseInt(outerTo[2]) / 60;
      let numInnerFrom = parseInt(innerFrom[1]) + parseInt(innerFrom[2]) / 60;
      let numInnerTo = parseInt(innerTo[1]) + parseInt(innerTo[2]) / 60;

      if (numOuterFrom < numOuterTo) {
        result = numOuterFrom <= numInnerFrom && numInnerFrom < numInnerTo && numInnerTo <= numOuterTo;
      } else {
        if (numInnerFrom < numInnerTo) {
          result = numOuterFrom <= numInnerFrom || numInnerTo <= numOuterTo;
        } else {
          result = numOuterFrom <= numInnerFrom && numInnerTo <= numOuterTo;
        }
      }
    }
    return result;
  }
  static convertTimeAndWeekdayToUTC(date, weekday) {
    let rs = {
      date, weekday
    }
    let indexWeekday = fullDays.findIndex(x => x == weekday);

    rs.date = new Date(moment().day(indexWeekday).hour(rs.date.getHours()).minute(rs.date.getMinutes()).second(rs.date.getSeconds()));

    let weekdayUTC = moment(new Date(rs.date.getUTCFullYear(), rs.date.getUTCMonth(), rs.date.getUTCDate(), rs.date.getUTCHours(), rs.date.getUTCMinutes(), 0, 0)).day();
    rs.weekday = fullDays[weekdayUTC]
    rs.date = this.localToUTC(date)
    return rs;
  }
  static convertTimeAndWeekdayToLocal(date, weekday) {
    let rs = {
      date, weekday
    }
    rs.date = new Date(date);

    let indexWeekday = fullDays.findIndex(x => x == weekday);
    rs.date = new Date(moment().day(indexWeekday).hour(rs.date.getUTCHours()).minute(rs.date.getUTCMinutes()).second(0));
    rs.date = new Date(Date.UTC(rs.date.getFullYear(), rs.date.getMonth(), rs.date.getDate(), rs.date.getHours(), rs.date.getMinutes()))
    let weekdayLocal = moment(rs.date).day();
    rs.weekday = fullDays[weekdayLocal]
    rs.date = new Date(date);
    return rs;
  }
}

export const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']