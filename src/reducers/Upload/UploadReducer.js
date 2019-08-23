import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import typeConfig from '../../constants/typeConfig';
export default function load(state = {
    files: [],
    payload: clone(initGlobal.payload),
}, action) {
    let newState;
    switch (action.type) {
        case types.DELETE_FILE:
            newState = clone(handleCRUDAction(state, action))
            if(newState.payload.error.code == 0){
                let files = newState.files.filter(x => x.name != action.fileName)
                newState.files = files;
            }
            return newState;
        case types.UPLOAD_FILES:
            newState = clone(handleCRUDAction(state, action))
            let file = newState.files.find(x => x.name == action.file.name)
            if (newState.payload.error.code == 0) {
                if (file) {
                    file.status = typeConfig.Status.COMPLETED;
                    file.url = action.file.relativeFilePath;
                }
            }
            else {
                if (file) {
                    file.status = typeConfig.Status.FAILED;
                }
            }
            return newState;
        case types.UPDATE_FILES_DTO:
            newState = update(state, {
                files: {
                    $set: action.files
                }
            })
            return newState;
        case types.IMPORT_EMPLOYEE:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.importResult = action.importResult;
            }
            return newState;
        case types.RESET_STATE_DIALOG_ATTACH_FILE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    },
                },
                files: {
                    $set: []
                },
                importResult: {
                    $set: null
                }
            });
            return newState;
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    }
                }
            })
            return newState;
        default: return state;
    }
}