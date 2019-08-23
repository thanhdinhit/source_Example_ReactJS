import * as types from '../constants/actionTypes';
import { catchError2, checkError, catchError, canvasToImage, getParams, next } from '../services/common';
import { mapToDto, mapFromDto, mapToContactDetailDto, mapFromApproversDTO } from '../services/mapping/myProfileDTO';
import * as availabilityDTO from '../services/mapping/availabilityDTO';
import * as employeeDto from '../services/mapping/employeeDTO';
import { loading } from './globalAction';
import update from 'react-addons-update';
import { loadJobRoleSetting } from './jobRoleSettingAction';
import * as apis from '../constants/apis';
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as MyProfileService from '../services/myProfile.service';
import * as UploadService from '../services/upload.service';
import * as EmployeeService from '../services/employee.service';


export function loadMyProfile(redirect = '/', type = types.LOAD_PROFILE) {
    return function (dispatch) {
        MyProfileService.loadMyProfile(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let myProfile = mapFromDto(result.data);
            if (myProfile.employeeJobRoles) {
                dispatch(loadJobRoleSetting(myProfile.employeeJobRoles.id, redirect, function (data, status, xhr) {
                    let error = checkError(data, xhr.status);
                    myProfile.employeeJobRoles.jobSkills = data.data.jobSkills;
                    return dispatch({
                        type: type,
                        myProfile,
                        meta: result.meta,
                        error: checkError(data, xhr.status)
                    });
                }));
            }
            else {
                return dispatch({
                    type: type,
                    myProfile,
                    meta: myProfile.meta,
                    error: checkError(myProfile, xhr.status)
                });
            }
        });
    }
}

export function loadMyProfileTime(redirect = '/', type = types.LOAD_PROFILE_TIME) {
    return function (dispatch) {
        MyProfileService.loadMyProfileTime(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let time = {
                availabilityTime: availabilityDTO.mapFromDtos(result.data.availabilityTime || []),
                workingTime: availabilityDTO.mapFromDtos(result.data.workingTime||[]),
                workingTimeType: result.data.workingTimeType
            };
            return dispatch({
                type: type,
                time,
                error: checkError(time, xhr.status)
            });
        });
    }
}

export function loadMyProfileAttachment(redirect = '/', type = types.LOAD_PROFILE_ATTACHMENT) {
    return function (dispatch) {
        MyProfileService.loadMyProfileAttachment(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let attachment = result.data;
            return dispatch({
                type: type,
                attachment,
                error: checkError(attachment, xhr.status)
            });
        });
    }
}

export function loadMyProfileJobRoleSkills(redirect = '/', type = types.LOAD_PROFILE_JOBROLE_SKILLS) {
    return function (dispatch) {
        MyProfileService.loadMyProfileJobRoleSkills(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let job = result.data;
            return dispatch({
                type: type,
                job,
                error: checkError(job, xhr.status)
            });
        });
    }
}

export function loadMyProfileContactDetail(redirect = '/', type = types.LOAD_PROFILE_CONTACTDETAIL) {
    return function (dispatch) {
        MyProfileService.loadMyProfileContactDetail(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect);
            }
            let contactDetail = employeeDto.mapFromEmployeeContactDetailDTO(result.data);
            return dispatch({
                type: type,
                contactDetail,
                error: checkError(contactDetail, xhr.status)
            });
        });
    }
}

export function loadMyProfileAfterLoginSuccess(employeeId, redirect = '/') {
    return function (dispatch) {
        EmployeeService.loadEmployee({employeeId}, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_AFTER_LOGIN_SUCCESS, redirect);
            }
            let myProfileInfo = employeeDto.mapFromDto(result.data);
            return dispatch({
                type: types.LOAD_EMPLOYEE_AFTER_LOGIN_SUCCESS,
                myProfileInfo,
                meta: result.meta,
            });
        });
    }
}

export function editMyProfile(MyProfileDto, redirect = '/') {
    return function (dispatch) {
        const data = mapToDto(MyProfileDto)
        MyProfileService.editMyProfile(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_PROFILE, redirect);
            }
            let myProfile = mapFromDto(result.data);
            return dispatch({
                type: types.EDIT_PROFILE,
                myProfile,
                error: checkError(result, status)
            });
        });
    }
}

export function editMyProfileContactDetail(myProfileContactDetailDto, redirect = '/') {
    return function (dispatch) {
        let data = mapToContactDetailDto(myProfileContactDetailDto)
        MyProfileService.editMyProfileContactDetail(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_PROFILE_CONTACTDETAIL, redirect);
            }
            let contactDetail = employeeDto.mapFromEmployeeContactDetailDTO(result.data);
            return dispatch({
                type: types.EDIT_PROFILE_CONTACTDETAIL,
                contactDetail,
                error: checkError(result, status)
            });
        });
    }
}

export function deleteEmergencyContact(MyProfileDto, redirect = '/') {
    return function (dispatch) {
        const data = mapToDto(MyProfileDto)
        MyProfileService.editMyProfile(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_PROFILE, redirect);
            }
            let myProfile = mapFromDto(result.data);
            return dispatch({
                type: types.EDIT_PROFILE,
                myProfile,
                error: checkError(result, status)
            });
        });
    }
}

export function uploadAvatar(wrapDto, redirect = '/') {
    return function (dispatch) {
        var data = new FormData();
        data.append("uploadingFiles", canvasToImage(wrapDto.avatar.file), wrapDto.avatar.name);
        UploadService.uploadFile(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.UPLOAD_AVATAR, redirect);
            }
            error = checkError(result, xhr.status);
            //update url photo and continue upload CV
            wrapDto.contactDetail.photoUrl = result.items[0].data.relativeFilePath;
            dispatch(editMyProfileContactDetail(wrapDto.contactDetail, redirect));
        });
    }
}

export function updateMyProfileDto(fieldName, value) {
    return {
        type: types.UPDATE_EMPLOYEE_DTO,
        fieldName,
        value
    };
}

export function getApprovers(redirect = '/') {
    return function (dispatch) {
        MyProfileService.getMyApprovers(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_MY_APPROVERS, redirect);
            }
            const approvers = mapFromApproversDTO(result.items);
            return dispatch({
                type: types.LOAD_MY_APPROVERS,
                approvers,
                error: checkError(result, status)
            });
        });
    };
}