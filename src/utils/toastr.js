import toastr from 'toastr';
import {TOASTR} from '../core/common/constants';

export function success(mess, title){
    toastr.success(mess, title, { timeOut: TOASTR.TIMEOUT_SUCCESS })
}

export function error(mess, title){
    toastr.error(mess, title, { timeOut: TOASTR.TIMEOUT_ERROR })
}
