import { AVAILABILITY } from '../../core/common/constants';
export function mapFromDtos(resultAPIs) {
    let rs = {};

    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(function (key) {
        rs[key] = resultAPIs.filter(x => x.weekday == AVAILABILITY[key.toUpperCase()]);
    })

    return rs;
}
export function mapToDtos(availabilityDto) {
    let rs = [];
    if (availabilityDto)
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(function (key) {
            if (availabilityDto[key])
                availabilityDto[key].forEach(function (element) {
                    if(element.endTime == "00:00:00"){
                        element.endTime = "23:59:59"
                    }
                    rs.push({ weekday: AVAILABILITY[key.toUpperCase()], startTime: element.startTime, endTime: element.endTime });
                })
        })
    return rs;
}