import * as types from '../constants/actionTypes';
import { catchError, catchError2, checkError, canvasToImage } from '../services/common';
import * as apiHelper from '../utils/apiHelper';
import * as UploadService from '../services/upload.service';


export function uploadAvatar(curEmp, avatar, redirect = '/') {
    return function (dispatch) {
        var data = new FormData();
        data.append('avatar', canvasToImage(avatar), 'abc.png');

        $.ajax({
            url: API_FILE,
            method: 'post',
            data: data,
            contentType: false,
            processData: false,
            headers: apiHelper.getHeader(),

            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.UPLOAD_AVATAR,
                    links: data.items,
                    error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.UPLOAD_AVATAR, redirect)
            }
        });
    }
}

export function uploadCv(curEmp, cv, redirect = '/') {
    return function (dispatch) {
        var data = new FormData();
        data.append("cv", cv)
        $.ajax({
            url: API_FILE,
            method: 'post',
            data: data,
            contentType: false,
            processData: false,
            headers: apiHelper.getHeader(),

            success: function (data, status, xhr) {
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.UPLOAD_CV,
                    links: data.items,
                    error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.UPLOAD_CV, redirect)
            }
        });
    }
}

export function uploadFile(file, redirect = '/') {
    return function (dispatch) {
        var data = new FormData();
        data.append('uploadingFiles', file, file.name);

        UploadService.uploadFile(data, function (error, result, status, xhr) {
            if (error) {
                let errorDTO = catchError2(error, types.UPLOAD_FILES, redirect);
                errorDTO.file = { name: file.name };
                return dispatch(errorDTO);
            }
            error = checkError(result, xhr.status);
            let fileDTO = { name: file.name, relativeFilePath: result.items[0].data.relativeFilePath };
            return dispatch({
                type: types.UPLOAD_FILES,
                file: fileDTO,
                error
            });
        });
    };
}


export function deleteFile(fileName, redirect = '/') {
    return function (dispatch) {
        const data = {
            relativeFilePath: fileName
        };
        UploadService.deleteFile(data, function (error, result, status, xhr) {
            if (error) {
                let errorDTO = catchError2(error, types.DELETE_FILE, redirect);
                errorDTO.fileName = fileName;
                return dispatch(errorDTO);
            }
            error = checkError(result, xhr.status);
            return dispatch({
                type: types.DELETE_FILE,
                fileName,
                error
            });
        })
    }
}

export function updateFilesDTO(files) {
    return {
        type: types.UPDATE_FILES_DTO,
        files: files
    }
}

export function resetState(files) {
    return {
        type: types.RESET_STATE_DIALOG_ATTACH_FILE,
    }
}

