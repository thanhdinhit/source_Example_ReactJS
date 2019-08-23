import * as types from '../constants/actionTypes';
import { catchError } from '../services/common';
import { mapToEmergencyContacts } from '../services/mapping/emergencyContactDTO';
import * as EmergencyContactService from '../services/emergencyContact.service';

export function getEmergencyContactsEmployee(employeeId) {
    return function (dispatch) {
        EmergencyContactService.getEmergencyContactsEmployee(employeeId, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_EMERGENCY_CONTACTS);
            }
            const data = mapToEmergencyContacts(result.items);
            return dispatch({
                type: types.GET_EMERGENCY_CONTACTS,
                data,
                meta: result.meta
            });
        });
    };
}

export function addEmergencyContactEmployee(employeeId, emergencyContact) {
    return function (dispatch) {
        EmergencyContactService.addEmergencyContactEmployee(employeeId, emergencyContact, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.ADD_EMERGENCY_CONTACT);
            }
            dispatch(getEmergencyContactsEmployee(employeeId));
            return dispatch({
                type: types.ADD_EMERGENCY_CONTACT
            });
        });
    };
}

export function deleteEmergencyContactEmployee(employeeId, emergencyContactId) {
    return function (dispatch) {
        EmergencyContactService.deleteEmergencyContactEmployee(employeeId, emergencyContactId, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_EMERGENCY_CONTACT);
            }
            dispatch(getEmergencyContactsEmployee(employeeId));
            return dispatch({
                type: types.DELETE_EMERGENCY_CONTACT
            });
        });
    };
}

export function getEmergencyContactsMyProfile() {
    return function (dispatch) {
        EmergencyContactService.getEmergencyContactsMyProfile(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_EMERGENCY_CONTACTS_PROFILE);
            }
            const data = mapToEmergencyContacts(result.items);
            return dispatch({
                type: types.GET_EMERGENCY_CONTACTS_PROFILE,
                data,
                meta: result.meta
            });
        });
    };
}

export function addEmergencyContactMyProfile(emergencyContact) {
    return function (dispatch) {
        EmergencyContactService.addEmergencyContactMyProfile(emergencyContact, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.ADD_EMERGENCY_CONTACT_PROFILE);
            }
            dispatch(getEmergencyContactsMyProfile());
            return dispatch({
                type: types.ADD_EMERGENCY_CONTACT_PROFILE
            });
        });
    };
}

export function deleteEmergencyContactMyProfile(emergencyContactId) {
    return function (dispatch) {
        EmergencyContactService.deleteEmergencyContactMyProfile(emergencyContactId, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_EMERGENCY_CONTACT_PROFILE);
            }
            dispatch(getEmergencyContactsMyProfile());
            return dispatch({
                type: types.DELETE_EMERGENCY_CONTACT_PROFILE
            });
        });
    };
}






