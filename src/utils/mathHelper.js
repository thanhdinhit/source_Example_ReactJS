import StringUtils from './stringUtil';
import { AVAILABILITY } from '../core/common/constants';

class MathHelper {
  static roundNumber(numberToRound, numberOfDecimalPlaces) {
    if (numberToRound === 0) {
      return 0;
    }

    if (!numberToRound) {
      return '';
    }

    const scrubbedNumber = numberToRound.toString().replace('$', '').replace(',', '');
    return Math.round(scrubbedNumber * Math.pow(10, numberOfDecimalPlaces)) / Math.pow(10, numberOfDecimalPlaces);
  }

  static addArray(values) { // adds array of values passed.
    const total = values.reduce((previousValue, currentValue) => {
      return previousValue + parseInt(this.convertToPennies(currentValue), 10); // do math in pennies to assure accuracy.
    }, 0);

    return total / 100; // convert back into dollars
  }

  static convertToPennies(value) {
    if (value === 0) {
      return 0;
    }

    let dollarValue = parseFloat(value);
    dollarValue = this.roundNumber(dollarValue, 2); // round to 2 decimal places.
    const dollarValueContainsDecimal = (dollarValue.toString().indexOf('.') !== -1);
    return (dollarValueContainsDecimal) ? parseInt(dollarValue.toString().replace('.', ''), 10) : parseInt(dollarValue, 10) * 100;
  }
  static CheckNumberValid(number) {
    let reg = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/
    return reg.test(number);
  }

  static convertAxisToTimeString(x, min_pixel_distance, formatForAPI) {
    let timeOfMinDistance = x / min_pixel_distance;
    let hourFrom = StringUtils.convertNumberToString(parseInt(timeOfMinDistance / (60 / AVAILABILITY.MIN_DISTANCE_MINUTE)), 2);
    let minFrom = StringUtils.convertNumberToString(parseInt(timeOfMinDistance % (60 / AVAILABILITY.MIN_DISTANCE_MINUTE) * AVAILABILITY.MIN_DISTANCE_MINUTE), 2);
    if (formatForAPI) {
      return hourFrom.toString() + ':' + minFrom.toString() + ':00';
    }
    return hourFrom.toString() + ':' + minFrom.toString();
  }

  static convertAxisToTimeDuration(x, width, totalWidth) {
    let min_pixel_distance = totalWidth / AVAILABILITY.TIME_PER_DAY;

    let timeFrom = MathHelper.convertAxisToTimeString(x, min_pixel_distance);
    let timeTo = MathHelper.convertAxisToTimeString(x + width, min_pixel_distance);

    return timeFrom + ' - ' + timeTo;
  }

  static convertTimeStringToAxis(hourString, minString, min_pixel_distance) {
    let hour = parseInt(hourString) * min_pixel_distance * (60 / AVAILABILITY.MIN_DISTANCE_MINUTE);
    let min = parseInt(minString) / AVAILABILITY.MIN_DISTANCE_MINUTE * min_pixel_distance;
    return hour + min;
  }

  static convertTimeDurationToAxis(timeDuration, totalWidth) {
    let rs = { x: 0, width: 0 };
    let startTimes = timeDuration.startTime.split(':');
    let endTimes = timeDuration.endTime.split(':');
    if(endTimes[0] === '00') {
      endTimes[0] = '24'
    }
    if (endTimes[0] === '23' && endTimes[1] === '59') {
      endTimes[0] = '24';
      endTimes[1] = '00';
    }

    if (startTimes.length === 0 || endTimes === 0) return rs;

    let min_pixel_distance = totalWidth / AVAILABILITY.TIME_PER_DAY;
    rs.x = MathHelper.convertTimeStringToAxis(startTimes[0], startTimes[1], min_pixel_distance);
    let y = MathHelper.convertTimeStringToAxis(endTimes[0], endTimes[1], min_pixel_distance);
    rs.width = y - rs.x;

    return rs;
  }

  //base upon file size , calculate this to MB or KB
  static convertSizeFile(fileSize){
    const size = fileSize / (1024 * 1024);
    if(size > 1){
      return size.toFixed(2) + " MB";
    } else {
      return (size * 1024).toFixed(2) + " KB";
    }
  }

}

export default MathHelper;
