import _ from 'lodash';
import validateJs from 'validate.js';
import moment from 'moment'
import {DATE, DATETIME } from '../core/common/constants'

validateJs.extend(validateJs.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function (value, options) {
        return moment(value, DATE.FORMAT);
    },
    // Input is a unix timestamp
    format: function (value, options) {
        var format = options.dateOnly ? DATE.FORMAT : DATETIME.FORMAT;
        return moment(value, format);
    }
});

export function validate(value, constraint) {
    let result = validateSingle(value, constraint);
    this.setState({ errorText: _.isEmpty(result) ? '' : result[0] });

    return _.isEmpty(result);
}

function parseResult(result) {
    return _.isUndefined(result) ? [] : result;
}

function validateSingle(value, constraint = {}) {
    const result = validateJs.single(value, constraint);

    return parseResult(result);
}