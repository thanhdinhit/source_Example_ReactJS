
var StringUtil = {
    ENTER: '\r\n',
    __decimal_char: ',',
    /*
    replaceAll(value, strFind, strReplace) {
        var str = value;
        while (str.indexOf(strFind) >= 0) {
            str = str.replace(strFind, strReplace);
        }
        return str;
    },
    */
    trim(s) {
        if (s == null || s == undefined)
            return;
        s = s.trim();
        var i, sRetVal = "";
        i = s.length - 1;
        while (i >= 0 && (s.charAt(i) == ' ' || s.charAt(i) == '\t' || s.charAt(i) == '\r' || s.charAt(i) == '\n'))
            i--;
        s = s.substring(0, i + 1);
        i = 0;
        while (i < s.length && (s.charAt(i) == ' ' || s.charAt(i) == '\t' || s.charAt(i) == '\r' || s.charAt(i) == '\n'))
            i++;
        return s.substring(i);
    },
    isEmpty: function (str) {
        return (str == undefined || str == null || str == "" || str == 'null');
    },
    isNullOrEmpty: function (str) {
        return (str == null || str == "" || str == undefined);
    },
    isNumber: function (a) {
        //var re = new RegExp("^\\d+$|\\d*" + this.__decimal_char + "\\d+");
        //return re.test(a);
        if (a == null || a.length == 0)
            return false;
        else
            return (!isNaN(a));
    },
    format: function (p1 = null, p2 = null, p3 = null, p4 = null, p5 = null, p6 = null) {
        var formatted = arguments[0];
        if (StringUtil.isNullOrEmpty(formatted))
            return "";
        if (arguments.length > 1 && Array.isArray(arguments[1])) {
            var params = arguments[1];
            for (var i = 0; i < params.length; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                formatted = formatted.replace(regexp, params[i]);
            }
        } else {
            for (var i = 1; i < arguments.length; i++) {
                var regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
                formatted = formatted.replace(regexp, arguments[i]);
            }
        }
        return formatted;
    },
    formatPhoneVN: function (phoneNumber) {
        let formatedPhone = "(+84) "

        phoneNumber = StringUtil.removePhoneFormat(phoneNumber);
        if (phoneNumber.substring(0, 1) == "0") {
            phoneNumber = phoneNumber.substr(1)
        }
        let VINumber = phoneNumber.match(/(\d{3})(\d{2})(\d{4,6})/);
        if (VINumber)
            formatedPhone += VINumber[1] + " " + VINumber[2] + " " + VINumber[3];

        return formatedPhone;
    },
    formatPhoneAU: function (phoneNumber) {
        let formatedPhone = "(+61) "

        phoneNumber = StringUtil.removePhoneFormat(phoneNumber);
        if (phoneNumber.substring(0, 1) == "0") {
            phoneNumber = phoneNumber.substr(1)
        }
        let AUNumber = phoneNumber.match(/(\d{3})(\d{3})(\d{3,6})/);
        if (AUNumber)
            formatedPhone += AUNumber[1] + " " + AUNumber[2] + " " + AUNumber[3];

        return formatedPhone;
    },
    formatPhone: function (phoneNumber) {
        if (!phoneNumber)
            return phoneNumber;
        // reformat phone number
        // (555) 123-4567 or +1 (555) 123-4567
        var formatedPhone = phoneNumber;
        phoneNumber = StringUtil.removePhoneFormat(phoneNumber);
        return this["formatPhone" + LOCALIZE.COUNTRY](phoneNumber);
    },
    removePhoneFormat: function (phone) {
        if (phone) {
            phone = phone.replace(/\+84|\+61/g, "")
            phone = phone.replace(/\+|\-|\.|\(|\)/g, "")
            return phone = this.replaceAll(phone, " ", "");

        } else {
            return phone
        }
    },
    replaceAll: function (str, token, newToken, ignoreCase = false) {
        var _token;
        var i = -1;

        if (typeof token === "string") {

            if (ignoreCase) {

                _token = token.toLowerCase();

                while ((
                    i = str.toLowerCase().indexOf(
                        token, i >= 0 ? i + newToken.length : 0
                    )) !== -1
                ) {
                    str = str.substring(0, i) +
                        newToken +
                        str.substring(i + token.length);
                }

            } else {
                return str.split(token).join(newToken);
            }

        }
        return str;
    },
    capitalizeFirstLetter: function (string) {
        var pieces = string.split(" ");
        for (var i = 0; i < pieces.length; i++) {
            pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].slice(1);
        }
        return pieces.join(" ");
    },
    firstCapitalizeLetter: function (string) {
        var pieces = string.toLowerCase().split(" ");
        pieces[0] = pieces[0].charAt(0).toUpperCase() + pieces[0].slice(1);
        return pieces.join(" ");
    },

    convertNumberToString: function (number, length) {
        let string = number.toString();

        if (string.length < length) {
            let dif = length - string.length;
            for (let i = 0; i < dif; i++) {
                string = '0' + string;
            }
        }

        return string;
    }
}

export default StringUtil;