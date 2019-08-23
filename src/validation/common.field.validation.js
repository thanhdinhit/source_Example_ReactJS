import Regex from './common.regex';
import _ from 'lodash';
import Constraints from './common.constraints';

const Required = Constraints.required;
const usernameRegex = Constraints.format(Regex.username);

const fieldValidations = {
    username: _.assign({}, usernameRegex, Required),
    date: Required,
    dateRange: function (min, max, tooEarlyMessage, tooLateMessage) {
        return _.assign({}, Constraints.isValidDate(min, max, tooEarlyMessage, tooLateMessage));
    },
    unique: function (restriction, message) {
        return _.assign({}, Constraints.exclusion(restriction, message));
    },
    fieldRequired: Required,
};

export default fieldValidations;