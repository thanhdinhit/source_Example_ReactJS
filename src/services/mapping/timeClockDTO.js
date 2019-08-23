import moment from 'moment'
import dateHelper from '../../utils/dateHelper'
import _ from 'lodash';


export function mapToDto(timeClockDto) {
    let rs = _.cloneDeep(timeClockDto)

    return rs;
}

export function mapFromDto(resultAPI) {
    let rs = resultAPI;
    rs.currentTime = new Date(rs.currentTime);
    if (rs.todayShifts.length) {
        rs.todayShifts.map((element) => {
            element.endTime = new Date(element.endTime)
            element.startTime = new Date(element.startTime)
        })
    }
    if (rs.latestTime) {
        rs.latestTime = new Date(rs.latestTime)
    }
    return rs;
}