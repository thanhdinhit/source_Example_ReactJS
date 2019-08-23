import * as types from '../constants/actionTypes';
import { catchError2, checkError, catchError, canvasToImage, getParams, next } from '../services/common';
import * as employeeDTO from '../services/mapping/employeeDTO';
import * as availabilityDto from '../services/mapping/availabilityDTO';
import { loading } from './globalAction';
import update from 'react-addons-update';
import { loadJobRoleSetting } from './jobRoleSettingAction'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as EmployeeService from '../services/employee.service';
import * as UploadService from '../services/upload.service';
import { STATUS } from '../core/common/constants';
// import Promise from 'bluebird'
import _ from 'lodash';
import * as handsetsDto from '../services/mapping/handsetsDTO';

export function loadAllMember(searchText) {
    // let url =  API_URL +  ROSTER + 'employees/search';
    return fetch(
        apiEndpoints.BASEEMPLOYEES_SEARCH, {
            method: 'POST',
            headers: _.assign({}, apiHelper.getHeader(), { 'Content-Type': 'application/json' }),
            body: JSON.stringify(searchText ? { fullName: '%' + searchText } : {})
        })
        .then((response) => {
            return response.json()
        }).then((data) => {
            let rs = []
            data.items.forEach(function (element) {
                element = element.data;
                element.value = element.id;
                element.label = element.fullName;
                rs.push(element);
            }, this);
            return { options: rs };
        });
}

export function validateFieldEmployee(fieldOnServer, fieldOnUI, value, redirect = '/') {
    return function (dispatch) {
        let data = {
            [fieldOnServer]: value,
        };
        EmployeeService.searchEmployees(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.VALIDATE_ACCOUNT_EMPLOYEE, redirect)
            }
            let rs = result.items.length === 0 ? STATUS.ACCEPTED : STATUS.IS_EXISTED;
            error = checkError(result, xhr.status);
            return dispatch({
                type: types.VALIDATE_FIELD_EMPLOYEE,
                validatedResult: {
                    result: rs,
                    fieldOnServer,
                    fieldOnUI,
                    value,
                },
                error
            });
        });
    }
}

export function validateTotalFieldsEmployee(fields, redirect = '/') {
    /*field = [
        {
            fieldOnServer: 'abc.xyz',
            fieldOnUI: 'abcxyz',
            value: 'a b c'
        }
    ]*/
    return function (dispatch) {
        let allTask = [];
        let finalResults = [];
        for (const field of fields) {
            let data = {
                [field.fieldOnServer]: field.value,
            };
            let callAjax = new Promise(function (resolve, reject) {
                EmployeeService.searchEmployees(data, function (error, result, status, xhr) {
                    if (error) {
                        reject(error)
                    }
                    if (result.items.length === 0) resolve(_.assign({}, field, { result: STATUS.ACCEPTED }));
                    reject(_.assign({}, field, { result: STATUS.IS_EXISTED }))
                })
            })
            let callAjaxCatchErr = callAjax
                .then(rs => finalResults.push(rs))
                .catch(e => { if (e.fieldOnServer) finalResults.push(e) })
            allTask.push(callAjaxCatchErr)
        }

        Promise.all(allTask)
            .then(function () {
                dispatch({
                    type: types.VALIDATE_TOTAL_FIELD_EMPLOYEE,
                    validatedResults: finalResults
                })
            })
    }
}

export function loadMembersOfEmployee(employeeId, queryString, redirect = '/') {
    return function (dispatch) {
        $.ajax({
            url: apiEndpoints.BASEEMPLOYEES_SEARCH,
            method: 'post',
            data: JSON.stringify({ reportTo: employeeId }),
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            success: function (data, status, xhr) {
                return dispatch({
                    type: types.LOAD_MEMBERS_OF_EMPLOYEE,
                    members: data.items,
                    meta: data.meta,
                    error: checkError(data, xhr.status)
                })
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.LOAD_MEMBERS_OF_EMPLOYEE, redirect)
            }
        });
    }
}

export function updateEmployeeDto(fieldName, value) {
    return {
        type: types.UPDATE_EMPLOYEE_DTO,
        fieldName,
        value
    }
}

export function resetEmployeeDto() {
    return {
        type: types.RESET_EMPLOYEE_DTO,
    }
}

export function resetNewEmployeeDto() {
    return {
        type: types.RESET_NEW_EMPLOYEE_DTO,
    }
}

export function addEmployee(employeeFinalDto, redirect = '/') {
    //employeeFinalDto { employeeDto, avatar, cv}
    //step 1: define array of function
    // if no photo skip to step 2

    return function (dispatch) {
        let funcManager = [uploadAvatar, addEmployee_final];
        dispatch(loading())
        dispatch(funcManager[0](employeeFinalDto, funcManager, redirect));
    }
}

export function editEmployee(employeeFinalDto, continueIfFail = true, redirect = '/') {
    //employeeFinalDto { employeeDto, avatar, cv}
    //step 1: define array of function
    // if no photo skip to step 2

    return function (dispatch) {
        let funcManager = [uploadAvatar, editEmployee_final];
        dispatch(loading())
        dispatch(funcManager[0](employeeFinalDto, funcManager, redirect, continueIfFail));
    }
}


export function uploadAvatar(employeeFinalDto, funcManager, redirect = '/', continueIfFail) {
    //employeeFinalDto { employeeDto, avatar, cv}
    //step 1: upload photo
    // if no photo skip to step 2
    let nextFunc = next(funcManager, uploadAvatar);
    return function (dispatch) {
        dispatch(loading())
        if (!employeeFinalDto.avatar.file && nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
        else {
            var data = new FormData();
            data.append("uploadingFiles", canvasToImage(employeeFinalDto.avatar.file), employeeFinalDto.avatar.name);
            UploadService.uploadFile(data, function (error, result, status, xhr) {
                if (error) {
                    if (continueIfFail && nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
                    return catchError(error, dispatch, types.UPLOAD_AVATAR, redirect)
                }
                error = checkError(data, xhr.status);
                //update url photo and continue upload CV
                let newEmployeeFinalDto = update(employeeFinalDto, {
                    employeeDto: {
                        contactDetail: {
                            photoUrl: {
                                $set: result.items[0].data.relativeFilePath
                            }
                        }

                    }
                })
                if (nextFunc) dispatch(nextFunc(newEmployeeFinalDto, funcManager, redirect));
                return dispatch({
                    type: types.UPLOAD_AVATAR,
                    links: result.items,
                    error
                });
            })
        }
    }
}

export function uploadCV(employeeFinalDto, funcManager, redirect = '/') {

    //step 2 upload cv
    let nextFunc = next(funcManager, uploadCV);
    return function (dispatch) {
        if (!employeeFinalDto.cv && nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
        else {
            var data = new FormData();
            data.append("uploadingFiles", employeeFinalDto.cv)
            $.ajax({
                url: API_FILE,
                method: 'post',
                data: data,
                contentType: false,
                processData: false,
                headers: apiHelper.getHeader(),

                success: function (data, status, xhr) {
                    //update dto and continue
                    let newEmployeeFinalDto = update(employeeFinalDto, {
                        employeeDto: {
                            cvUrl: {
                                $set: data.items[0].name
                            }
                        }
                    })
                    if (nextFunc) dispatch(nextFunc(newEmployeeFinalDto, funcManager, redirect));
                    let error = checkError(data, xhr.status);
                    return dispatch({
                        type: types.UPLOAD_CV,
                        links: data.items,
                        error: error
                    });
                },
                error: function (xhr) {
                    if (nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
                    return catchError(xhr, dispatch, types.UPLOAD_CV, redirect)
                }
            });
        }
    }
}

export function uploadFiles(employeeFinalDto, funcManager, redirect = '/') {
    let nextFunc = next(funcManager, uploadFiles);
    return function (dispatch) {
        if (!employeeFinalDto.files[0] && nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
        else {
            var data = new FormData();
            employeeFinalDto.files.forEach(function (element, index) {
                data.append(index, element)
            }, this);
            $.ajax({
                url: API_FILE,
                method: 'post',
                data: data,
                contentType: false,
                processData: false,
                headers: apiHelper.getHeader(),

                success: function (data, status, xhr) {
                    for (let i = 0; i < data.items.length; i++) {
                        employeeFinalDto.employeeDto.employeeRequiredDocuments[i].docUrl = data.items[i].name;
                    }

                    if (nextFunc) dispatch(nextFunc(curEmp, employeeFinalDto, funcManager, redirect));
                    let error = checkError(data, xhr.status);
                    return dispatch({
                        type: types.UPLOAD_FILES,
                        links: data.items,
                        error: error
                    });
                },
                error: function (xhr) {
                    if (nextFunc) dispatch(nextFunc(curEmp, employeeFinalDto, funcManager, redirect));
                    return catchError(xhr, dispatch, types.UPLOAD_FILES, redirect)
                }
            });
        }
    }
}

export function addEmployee_final(employeeFinalDto, funcManager, redirect = '/') {
    let nextFunc = next(funcManager, addEmployee_final);
    return function (dispatch) {
        const data = employeeDTO.mapToDto(employeeFinalDto.employeeDto)
        EmployeeService.addEmployee(data, function (error, result, status, xhr) {
            if (error) {
                if (nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
                return catchError(error, dispatch, types.ADD_EMPLOYEE, redirect)
            }
            if (nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
            return dispatch({
                type: types.ADD_EMPLOYEE,
                employee: result.data,
                meta: result.meta,
                error: checkError(result, xhr.status)
            })
        });
    }
}

export function editEmployee_avatar(wrapDto, redirect = '/', ) {
    return function (dispatch) {
        var data = new FormData();
        data.append("uploadingFiles", canvasToImage(wrapDto.avatar.file), wrapDto.avatar.name)
        $.ajax({
            url: API_FILE,
            method: 'post',
            data: data,
            contentType: false,
            processData: false,
            headers: apiHelper.getHeader(),

            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                //update url photo and continue upload CV
                wrapDto.employeeDto.contactDetail.photoUrl = data.items[0].data.relativeFilePath;
                dispatch(editMyProfile(wrapDto.employeeDto, redirect));

            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.UPLOAD_AVATAR, redirect);
            }
        });
    }
}

export function login(email, password, remember, redirect = "/") {
    return function (dispatch) {
        dispatch(loginRequest());
        localStorage.setItem('keepSignedIn', remember);
        const data = {
            username: email,
            password,
            keepSignedIn: remember
        };
        UserService.login(data, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOGIN_FAIL, redirect);
            }
            if (result.data.firstLogin) {
                localStorage.setItem('firstLogin', true);
                browserHistory.push(getUrlPath(URL.FIRST_LOGIN));

                return dispatch({
                    type: types.LOGIN_FIRST,
                    dataLogin: result.data,
                    curEmp: {
                        employeeId: result.data.employeeId,
                        token: result.data.token,
                        secret: result.data.secret,
                        rights: employeeDTO.mapFromDto(result.data.accessRights)
                    },
                });
            }
            dispatch(loginSuccess(result.data, redirect, checkError(result, xhr.status)));
            return browserHistory.push(redirect);
        });
    };
}

export function editEmployee_final(employeeFinalDto, funcManager, redirect = '/') {
    return function (dispatch) {
        let nextFunc = next(funcManager, editEmployee_final);
        const data = employeeDTO.mapToDto(employeeFinalDto.employeeDto)
        const params = {
            employeeId: data.id
        }
        EmployeeService.editEmployee(data, params, function (error, result, status, xhr) {
            if (error) {
                if (nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
                return catchError(error, dispatch, types.EDIT_EMPLOYEE, redirect)
            }
            if (nextFunc) dispatch(nextFunc(employeeFinalDto, funcManager, redirect));
            let employee = employeeDTO.mapFromDto(result.data)
            if (employee.jobRole) {
                dispatch(loadJobRoleSetting(employee.jobRole.id, redirect, function (data, status, xhr) {
                    let error = checkError(data, xhr.status);
                    employee.jobRole.jobSkills = data.data.jobSkills;
                    return dispatch({
                        type: types.EDIT_EMPLOYEE,
                        employee,
                        error: checkError(result, status)
                    })
                }))
            }
            else {
                return dispatch({
                    type: types.EDIT_EMPLOYEE,
                    employee,
                    error: checkError(result, status)
                })
            }
        });
    }
}

export function deleteEmployee(employeeDto, redirect = '/') {
    return function (dispatch) {
        const params = {
            employeeId: employeeDto.id
        }
        EmployeeService.deleteEmployee(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.DELETE_EMPLOYEE, redirect)
            }
            // dispatch(loadAllEmployee(queryString, redirect))
            return dispatch({
                type: types.DELETE_EMPLOYEE,
            })
        });
    }
}

export function loadEmployee(employeeId, redirect = '/', type = types.LOAD_EMPLOYEE) {
    return function (dispatch) {
        dispatch(loading())
        const params = {
            employeeId
        }
        EmployeeService.loadEmployee(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, type, redirect)
            }
            let employee = employeeDTO.mapFromDto(result.data)
            if (employee.jobRole) {
                dispatch(loadJobRoleSetting(employee.jobRole.id, redirect, function (data, status, xhr) {
                    let error = checkError(data, xhr.status);
                    employee.jobRole.jobSkills = data.data.jobSkills;
                    return dispatch({
                        type: type,
                        employee,
                        meta: result.meta,
                        error: checkError(data, xhr.status)
                    })
                }))
            }
            else {
                return dispatch({
                    type: type,
                    employee,
                    meta: employee.meta,
                    error: checkError(employee, xhr.status)
                })
            }
        });
    }
}

export function loadAllEmployee(queryString, redirect = '/') {
    return function (dispatch) {
        let params = getParams(queryString);
        params["jobRole.id"] = queryString.jobRoleIds;
        params["group.id"] = queryString.groupIds;
        params["group.supervisorId"] = queryString.reportToIds;
        params["location.id"] = queryString.locationIds;
        params["identifier"] = queryString.identifier;
        params["gender"] = queryString.gender;
        params["street"] = queryString.street ? "%" + queryString.street : undefined;
        params["district.id"] = queryString.districtIds;
        params["city.id"] = queryString.cityIds;
        params["state.id"] = queryString.stateIds;
        params["postCode"] = queryString.postCode ? "%" + queryString.postCode : undefined;
        params["email"] = queryString.email ? "%" + queryString.email : undefined;
        params["birthday"] = queryString.birthday;
        params["workMobile"] = queryString.workingMobile ? "%" + queryString.workingMobile : undefined;
        params["privateMobile"] = queryString.privateMobile ? "%" + queryString.privateMobile : undefined;
        params["startDate"] = queryString.startDate;
        params["type.id"] = queryString.employeeTypeIds;
        params["status"] = queryString.status;
        params["userRole.id"] = queryString.userRoleIds;
        params["employeeJobSkills.jobSkill.id"] = queryString.employeeJobSkillIds;
        params["terminatedDate"] = queryString.terminatedDate;
        params["terminationReason.id"] = queryString.terminationReason;
        params["terminationType"] = queryString.terminationType;
        params["search_text"] = queryString.searchText ? "%" + queryString.searchText : undefined;

        params = _.omitBy(params, _.isUndefined);

        EmployeeService.searchEmployees(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_EMPLOYEE, redirect);
            }
            let employees = employeeDTO.mapFromDtos(result.items);

            return dispatch({
                type: types.LOAD_ALL_EMPLOYEE,
                employees,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadAllBaseEmployee(redirect = '/') {
    return function (dispatch) {
        EmployeeService.loadAllBaseEmployee(function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_ALL_BASE_EMPLOYEE, redirect);
            }
            let baseEmployees = _.map(result.items, (item) => {
                return item.data;
            });;
            return dispatch({
                type: types.LOAD_ALL_BASE_EMPLOYEE,
                baseEmployees,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

// export function deleteDocumentOnEmployee(url, employeeDto, redirect = "/") {
//     return function (dispatch) {
//         const data = {
//             relativeFilePath: url
//         };
//         UploadService.deleteFile(data, function (error, result, status, xhr) {
//             if (error) {
//                 let errorDTO = catchError2(error, types.EDIT_EMPLOYEE, redirect);
//                 return dispatch(errorDTO);
//             }
//             employeeDto.documents = employeeDto.documents.filter(x => x.docUrl != url);
//             return editEmployee_final({ employeeDto }, null, redirect);
//         })
//     }
// }

export function resetValidate() {
    return {
        type: types.RESET_VALIDATE
    }
}
export function getMembers(redirect = '/') {
    return function (dispatch) {
        EmployeeService.getMembers(function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.GET_MEMBERS, redirect);
            }
            return dispatch({
                type: types.GET_MEMBERS,
                members: result.items,
                meta: result.meta
            })
        })
    };
}

export function editEmployeeContactDetail(employeeId, contactdetail) {
    return function (dispatch) {
        const contactDetailDTO = employeeDTO.mapToContactDetailDto(contactdetail);
        EmployeeService.editEmployeeContactDetail(employeeId, contactDetailDTO, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_EMPLOYEE_CONTACT_DETAIL);
            }
            const contactDetail = employeeDTO.mapFromEmployeeContactDetailDTO(result.data);
            return dispatch({
                type: types.EDIT_EMPLOYEE_CONTACT_DETAIL,
                contactDetail,
                meta: result.meta
            })
        })
    }
}

export function editEmployeeJob(employeeId, employeeJob) {
    return function (dispatch) {
        const jobDTO = employeeDTO.mapToJobDTO(employeeJob);
        EmployeeService.editEmployeeJob(employeeId, jobDTO, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_EMPLOYEE_JOB);
            }

            let employeeJob = employeeDTO.mapFromJobDTO(result.data)
            return dispatch({
                type: types.EDIT_EMPLOYEE_JOB,
                employeeJob,
                meta: result.meta
            })
        })
    }
}
export function editEmployeeTime(employeeId, time) {
    return function (dispatch) {
        const timeDTO = {
            availabilityTime: availabilityDto.mapToDtos(time.availabilityTime),
            workingTime: availabilityDto.mapToDtos(time.workingTime),
            workingTimeType: time.workingTimeType
        };
        EmployeeService.editEmployeeTime(employeeId, timeDTO, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_EMPLOYEE_CONTACT_DETAIL);
            }
            let time = {
                availabilityTime: availabilityDto.mapFromDtos(result.data.availabilityTime || []),
                workingTime: availabilityDto.mapFromDtos(result.data.workingTime || []),
                workingTimeType: result.data.workingTimeType
            };
            return dispatch({
                type: types.EDIT_EMPLOYEE_TIME,
                time,
                meta: result.meta
            })
        })
    }
}

export function editEmployeePayRate(employeeId, payRate) {
    return function (dispatch) {
        EmployeeService.editEmployeePayRate(employeeId, payRate, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.EDIT_EMPLOYEE_PAY_RATE);
            }
            return dispatch({
                type: types.EDIT_EMPLOYEE_PAY_RATE,
                payRate: result.data,
                meta: result.meta
            })
        })
    }
}

export function importEmployee(files) {
    return function (dispatch) {
        let fileDTO = { relativeFilePath: files[0].url };
        EmployeeService.importEmployee(fileDTO, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.IMPORT_EMPLOYEE);
            }
            return dispatch({
                type: types.IMPORT_EMPLOYEE,
                importResult: result.data,
                meta: result.meta
            });
        });
    };
}

export function exportEmployees(columns) {
    return function (dispatch) {
        EmployeeService.exportEmployees(columns, function (error, result) {
            if (error) {
                return catchError(error, dispatch, types.EXPORT_EMPLOYEES);
            }
            return dispatch({
                type: types.EXPORT_EMPLOYEES,
                relativeFilePath: result.data.relativeFilePath,
                meta: result.meta
            })
        });
    }
}

export function loadEmployeeHandsets(employeeId, redirect = '/') {
    return function (dispatch) {
        EmployeeService.getEmployeeHandsets(employeeId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_HANDSETS, redirect);
            }

            let handsets = handsetsDto.mapFromEmployeeHandsetDto(result.data.handsets);
            return dispatch({
                type: types.LOAD_EMPLOYEE_HANDSETS,
                handsets,
                meta: result.meta,
                error: checkError(result, xhr.status)
            });
        });
    };
}

export function loadEmployeeTransfers(employeeId, redirect = '/') {
    return function (dispatch) {
        EmployeeService.getEmployeeTransfers(employeeId, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_TRANSFERS, redirect);
            }

            let transfers = employeeDTO.mapFromEmployeeTransfersDTO(result.items);
            return dispatch({
                type: types.LOAD_EMPLOYEE_TRANSFERS,
                transfers,
                meta: result.meta,
                error: checkError(result, xhr.status)
            })
        })
    }
}

export function transferEmployee(employeeId, transferInfo, redirect = '/') {
    return function (dispatch) {
        const employeeTransferDTO = employeeDTO.mapToEmployeeTransferDTO(transferInfo);
        EmployeeService.transferEmployee(employeeId, employeeTransferDTO, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.TRANSFER_EMPLOYEE, redirect);
            }
            return dispatch({
                type: types.TRANSFER_EMPLOYEE,
                meta: result.meta,
                error: checkError(result, xhr.status)
            })
        })
    }
}

export function loadEmployeeAssigns(queryString, redirect = '/') {
    return function (dispatch) {
        let params = {};
        params['scheduleShiftId'] = queryString.scheduleShiftId;
        params["jobRole.id"] = queryString.jobRoleId;
        params["group.id"] = queryString.groupIds;
        params["fullName"] = queryString.searchText ? "%" + queryString.searchText : undefined;

        params = _.omitBy(params, _.isUndefined);

        EmployeeService.loadEmployeeAssigns(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_EMPLOYEE_ASSIGN, redirect);
            }

            let employeesToAssign = employeeDTO.mapToEmployeeAssignDTO(result.items);

            return dispatch({
                type: types.LOAD_EMPLOYEE_ASSIGN,
                employeesToAssign,
                error: checkError(result, xhr.status)
            });
        })
    }
}

export function editEmployeeOrganization(groupInf, redirect = '/') {
    return function (dispatch) {
        EmployeeService.editEmployeeOrganization(groupInf.id, groupInf, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.ADD_EDIT_GROUP_ORGANIZATION, redirect);
            }
            return dispatch({
                type: types.ADD_EDIT_GROUP_ORGANIZATION,
                data: result.data,
                error: checkError(result, xhr.status)
            })
        })
    }
}

export function addNewEmployeeOrganization(groupInf, redirect = '/') {
    return function (dispatch) {
        EmployeeService.addNewEmployeeOrganization(groupInf, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.ADD_EDIT_GROUP_ORGANIZATION, redirect);
            }
            return dispatch({
                type: types.ADD_EDIT_GROUP_ORGANIZATION,
                data: result.data,
                error: checkError(result, xhr.status)
            })
        })
    }
}
