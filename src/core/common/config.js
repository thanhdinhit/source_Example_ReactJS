export const EMPLOYEE_ATTACHFILE = {
    maxSize: 10,
    allowTypes: ['png', 'jpg', 'bmp', 'pdf', 'doc', 'docx'],
    MAX_SIZE_AVATAR_KB: 300
};
export const CUSTOMER_ATTACHFILE = {
    maxSize: 10,
    allowTypes: ['png', 'pdf', 'doc', 'docx'],
    MAX_SIZE_AVATAR_KB: 300
};

export const EMPLOYEE_IMPORT = {
    maxSize: 10,
    allowTypes: ['CSV'],
    allowNumFile: 1
}
export const TIME_CLOCK = [5, 15, 30];

export const COUNTRY = {
    VN: 'VN',
    AU: 'AU'
};

export const EMPLOYEE_GROUP_NUMBER = 3;

export const IMPORT_EMPLOYEE_TEMPLATE_URL = 'import/employee_import_template.csv';

export const LOADING_INDICATOR_STYLE = {
    app: {
        color: 'Black',
        length: 15,
        lines: 15,
        width: 3
    }
};

export const FLOAT_POINT_ROUNDING = {
    WORKING_HOURS: 1,
    REGULAR_HOURS: 2
}

export const MAX_LENGTH_INPUT = {
    EMPLOYEE_ID: 12,
    NAME: 32,
    MOBILE_PHONE: 16,
    STREET: 128,
    REASON: 128,
    EMAIL: 32,
    NOTES: 128,
    CARD_ID_NUMBER: 12,
    CONTRACT_ID: 128
};