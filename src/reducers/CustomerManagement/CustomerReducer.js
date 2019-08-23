import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { handleCRUDAction } from '../../services/common';
import _ from 'lodash';

export default function load(state = {
    payload: _.cloneDeep(initGlobal.payload),
    meta: {},
    customers: [],
    customer:{},
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_ALL_CUSTOMER: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.customers = action.customers;
                newState.meta = action.meta;
            }
            return newState;
        }
        case types.LOAD_CUSTOMER: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.customer = action.customer;
                newState.meta = action.meta;
            }
            return newState;
        }
        case types.DELETE_CUSTOMER: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.ADD_CUSTOMER: {
            newState = handleCRUDAction(state, action);
            return newState;
        }
        case types.EDIT_CUSTOMER: {
            newState = handleCRUDAction(state, action);
            newState.customer = action.customer;
            return newState;
        }
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initGlobal.error
                    },
                    errors: {
                        $set: []
                    }
                }
            });
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    }
                }
            });
            return newState;
        default:
            return state;
    }
}
