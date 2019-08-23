import DefaultResources from './languages/en';
import StringUtil from '../utils/stringUtil';

export const Option = {
    UPPER: 'UPPER',
    LOWER: 'LOWER',
    FIRSTCAP: 'FIRSTCAP',
    CAPEACHWORD: 'CAPEACHWORD'
};

let ResourceManager = {
    data_resource_key: "data-resource",
    getResource: function () {
        return DefaultResources;
    },
    curResource: require('./languages/en').default,
    getString: function (key, param = null, option = null) {
        let Resources = this.curResource;

        if (typeof Resources != "undefined") {
            var str = Resources[key];
            if (str == null || str.length == 0)
                return this.textTranfrom(option, str);
            if (param == null) {
                return this.textTranfrom(option, str);
            } else {
                if (typeof param == 'string' || StringUtil.isNumber(param)) {
                    var paramValue = Resources[param];
                    if (paramValue == undefined || paramValue == null)
                        paramValue = param;
                    str = this.format(key, paramValue, option);
                }
                else {
                    if (Array.isArray(param) && param.length > 0) {
                        str = this.format(key, param, option);
                    }
                }
                if (str == '')
                    console.log("<ERR! Resource could not be found!>")
                return this.textTranfrom(option, str);
            }
        } else {
            return "";
        }
    },
    format: function (key, keys) {
        // return formatted values  string replace, date time, currency,...)
        var str = this.getString(key);

        if (Array.isArray(keys)) {
            var params = [];
            for (var i = 0; i < keys.length; i++) {
                var param = this.getString(keys[i]);
                if (param == null)
                    param = keys[i];
                params.push(param);
            }
            str = StringUtil.format(str, params);
        } else {
            var param = this.getString(keys);
            if (param == null)
                param = keys;
            str = StringUtil.format(str, param);
        }
        return str;
    },

    textTranfrom: function (option, str) {
        switch (option) {
            case Option.UPPER:
                return str.toUpperCase();
            case Option.LOWER:
                return str.toLowerCase();
            case Option.FIRSTCAP:
                return StringUtil.firstCapitalizeLetter(str);
            case Option.CAPEACHWORD:
                return StringUtil.capitalizeFirstLetter(str)
            default:
                return str;
        }
    },

    getResourceByStatusCode: function (statusCode) {
        //maping status from BE
    },
    formatPhone: function (phoneNumber, lang = this.curResource['LANG_KEY']) {
        return StringUtil.formatPhone(phoneNumber, lang)
    }
};

export default ResourceManager;