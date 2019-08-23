import { TIMEFORMAT } from '../core/common/constants';
import dateHelper from '../utils/dateHelper';

let constraints = {
    equality: function (field) {
        return {
            equality: field
        };
    },

    inclusion: function (val) {
        return {
            inclusion: {
                within: [val]
            }
        };
    },

    exclusion: function (vals, message) {
        return {
            exclusion: {
                within: vals,
                message
            }
        };
    },

    required: {
        presence: true
    },

    requiredWithMessage: function (message) {
        return {
            presence: {
                message
            }
        };
    },

    format: function (pattern, message) {
        return {
            format: {
                pattern: pattern,
                message: message
            }
        };
    },

    email: {
        email: true
    },

    emailWithMessage: function (message) {
        return {
            email: {
                message: message
            }
        }
    },

    length: function (min = 3, max = 255, message) {
        return {
            length: {
                minimum: min,
                maximum: max,
                message
            }
        };
    },

    isInteger: function (min = 0) {
        return {
            numericality: {
                onlyInteger: true,
                greaterThanOrEqualTo: min
            }
        };
    },

    isNumeric: function (min = 0, message) {
        return {
            numericality: {
                greaterThanOrEqualTo: min,
                message: message
            },
        };
    },

    datetime: {
        datetime: true
    },

    dateWithMessage: function (message) {

        return {
            datetime: {
                message: message,
            },
        }
    },

    minmax: function (min, max) {
        return {
            numericality: {
                greaterThanOrEqualTo: min,
                lessThanOrEqualTo: max
            }
        };
    },

    greaterThanAndLessThan: function (min, max) {
        return {
            numericality: {
                greaterThan: min,
                lessThan: max
            }
        };
    },

    greaterThan: function (val) {
        return {
            numericality: {
                greaterThan: val
            }
        };
    },

    greaterThanOrEqualTo: function (val) {
        return {
            numericality: {
                greaterThanOrEqualTo: val
            }
        };
    },

    lessThan: function (val) {
        return {
            numericality: {
                lessThan: val
            }
        };
    },

    notAllowValue: function (val) {
        return {
            exclusion: {
                within: [val]
            }
        };
    },

    equalTo: function (val) {
        return {
            numericality: {
                equalTo: val
            }
        };
    },

    isValidDate: function (earliest, latest, tooEarlyMessage, tooLateMessage) {
        let constraint = {
            datetime: {}
        };
        if (earliest) {
            constraint.datetime.earliest = earliest;
        }

        if (latest) {
            constraint.datetime.latest = latest;
        }

        if (tooEarlyMessage) {
            if (tooLateMessage) {
                constraint.datetime.tooEarly = tooEarlyMessage;
                constraint.datetime.tooLate = tooLateMessage;
            } else {
                constraint.datetime.message = tooEarlyMessage;
            }
        }

        return constraint;
    },

    isValidTime: function (earliest, latest, message) {
        let constraint = {
            datetime: {}
        };
        if (earliest) {
            constraint.datetime.earliest = earliest;
            if (message) {
                constraint.datetime.message = message
            }
            else {
                constraint.datetime.message =
                    `must be no earlier than ${dateHelper.formatTimeWithPattern(earliest, TIMEFORMAT.TIME_PICKER)}`;
            }

        }
        if (latest) {
            constraint.datetime.latest = latest;
            if (message) {
                constraint.datetime.message = message
            }
            else {
                constraint.datetime.message =
                    `must be no later  than ${dateHelper.formatTimeWithPattern(latest, TIMEFORMAT.TIME_PICKER)}`;
            }

        }
        return constraint;
    }
};

export default constraints;