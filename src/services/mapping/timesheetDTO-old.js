import { formatDate, formatDateTimesheets, formatTimeTimesheets } from '../common'
import update from 'react-addons-update'
export const mapFromDto = function (resultAPI) {
    let newTimesheets = []
    if (resultAPI.length > 0) {
        resultAPI.forEach(function (element) {
            let newTimesheet = update(element, {
                dateString: {
                    $set: formatDateTimesheets(formatDate(element.date))
                },
                timeRecords: {

                }
            })
            newTimesheet.timeRecords.forEach(function (element, index, array) {
                array[index] = update(element, {
                    shiftName: {
                        $set: element.employeeTrackingTime.shiftName
                    },
                    checkInTime: {
                        $set: formatTimeTimesheets(formatDate(element.employeeTrackingTime.checkInTime))
                    },
                    checkOutTime: {
                        $set: formatTimeTimesheets(formatDate(element.employeeTrackingTime.checkOutTime))
                    }
                })
            })
            newTimesheets.push(newTimesheet)
        }, this);
    }
    return newTimesheets;
}

