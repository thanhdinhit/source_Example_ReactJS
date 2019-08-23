import _ from 'lodash';
import * as settingService from '../services/setting.service';
import { handleError } from '../services/common';
import { store } from "../root";

export function loadPayRateSetting(callback) {
    settingService.loadPayRateSetting(function (error, result) {
        if (error) {
            return callback && callback(handleError(error, store.dispatch));
        }
        const payRateSetting = _.map(result.items, (item) => {
            return item.data;
        });
        callback && callback(error, payRateSetting);
    });
}
