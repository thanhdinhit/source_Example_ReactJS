import { ACCEPT_EXTENSIONS } from '../core/common/constants';

export const getExtension = function (name) {
    if (name) {
        let arr = name.split('/');
        arr = arr[arr.length - 1].split('.');
        if (arr.length < 2) {
            return 'unk.svg';
        }
        const extension = arr[arr.length - 1].toLowerCase();
        if (ACCEPT_EXTENSIONS.find(x => x === extension))
            return extension + '.svg';
    }
    return 'unk.svg';
};

export const getName = function (name) {
    if (name) {
        let arr = name.split('/');
        return arr[arr.length - 1];
    }
    return '';
};