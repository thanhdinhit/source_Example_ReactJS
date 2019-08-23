import { handleError } from '../services/common';
import { mapFromDtos } from '../services/mapping/geographicDTO';
import * as GeographicService from '../services/geographic.service';

export function loadStates(callback) {
    GeographicService.getStates(function (error, result) {
        if (error) {
            return callback && callback(handleError(error));
        }
        let states = mapFromDtos(result.items);
        callback && callback(undefined, states);
    });
}
