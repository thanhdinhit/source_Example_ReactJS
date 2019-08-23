import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import { clone, handleCRUDAction } from '../../services/common';
import update from 'react-addons-update';
import _ from 'lodash';

export default function load(state = {
    handsets: [],
    handset: {},
    handsetTypes: [],
    payload: clone(initGlobal.payload),
    handsetsSearch: [],
    dialogHandsets: [],
    handsetSummary: [],
    storeLocs: [],
    meta: {}
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_EMPLOYEE_HANDSETS:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.handsets = action.handsets;
            }
            return newState;
        case types.RETURN_HANDSET: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.GET_HANDSETS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.handsetsSearch = action.handsets;
                newState.meta = action.meta;
            }
            return newState;
        }
        case types.GET_DIALOG_HANDSETS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.dialogHandsets = action.handsets;
                newState.dialogHandsetsMeta = action.meta;
            }
            return newState;
        }
        case types.HANDSET_TYPES: {
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.handsetTypes = action.handsetTypes;
            return newState;
        }
        case types.ASSIGNED_HANDSET: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.TRANSFER_HANDSETS: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.ASSIGNED_HANDSETS: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.LOAD_HANDSET_SUMMARY: {
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.meta = action.meta;
            newState.handsetSummary = action.handsetSummary;
            return newState;
        }
        case types.LOAD_STORE_LOCS: {
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState.storeLocs = action.storeLocs;
            return newState;
        }
        case types.EDIT_HANDSET_TYPE: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.DELETE_HANDSET: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.LOAD_HANDSET: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.handset = action.handset;
            }
            return newState;
        }
        case types.EDIT_HANDSET: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.handset = action.handset;
            }
            return newState;
        }
        case types.RESET_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    },
                },
                handsets: {
                    $set: []
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
            });
            return newState;

        default:
            return state;
    }
}
