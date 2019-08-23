import _ from 'lodash';
import { LOCATION_PHYSIC_TYPE } from "../../core/common/constants";

export function mapFromDtos(resultAPIs) {
    let rs = [];
    if (resultAPIs.length > 0) {
        resultAPIs.forEach(function (element) {
            rs.push(mapFromDto(element.data))
        }, this);
    }
    return rs;
}
export function mapFromDto(resultAPI) {
    let rs = {};
    if (resultAPI) {
        switch (resultAPI.type) {
            case LOCATION_PHYSIC_TYPE.BUILDING:
                resultAPI.center = new google.maps.LatLng({ lat: Number(resultAPI.latitudeCenter), lng: Number(resultAPI.longitudeCenter) });
                break;
            case LOCATION_PHYSIC_TYPE.FENCE:
                let paths = [...resultAPI.areaCoordinates];
                paths.sort(function (a, b) {
                    return a.pathIndex - b.pathIndex
                })
                paths.forEach(function (element, index) {
                    paths[index] = new google.maps.LatLng({ lat: element.latitude, lng: element.longitude })
                }, this);
                resultAPI.paths = paths;
                resultAPI.center = getCenterPolygon(paths);

                break;
        }
        // resultAPI.type = { label: resultAPI.type, value: resultAPI.type }
        rs = { ...resultAPI }
    }
    return rs
}
function getCenterPolygon(paths) {
    let bounds = new google.maps.LatLngBounds();

    paths.forEach(function (element) {
        bounds.extend(element)
    }, this);
    return bounds.getCenter();
}

export function mapToDto(location) {
    location.areaCoordinates = [];
    switch (location.type) {
        case LOCATION_PHYSIC_TYPE.FENCE:
            location.paths.forEach(function (element, index) {
                location.areaCoordinates[index] = {}
                location.areaCoordinates[index].latitude = element.lat();
                location.areaCoordinates[index].longitude = element.lng();
                location.areaCoordinates[index].pathIndex = index;
                location.areaCoordinates[index].locationId = location.id;
            }, this);
            break;
        case LOCATION_PHYSIC_TYPE.BUILDING:
            break;
    }
    return location;
}