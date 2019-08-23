
import { mapFromDtos } from '../services/mapping/locationDTO'
import { handleError, getParams } from '../services/common';
import * as LocationService from '../services/location.service';
import _ from 'lodash';

export function loadLocations(queryString, callback) {
    let params = getParams(queryString)
    params["name"] = queryString.name ? "%" + queryString.name : undefined;
    params = _.omitBy(params, _.isUndefined);
    LocationService.searchLocations(params, function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let locations = mapFromDtos(result.items);
        callback && callback(undefined, locations);
    });
}