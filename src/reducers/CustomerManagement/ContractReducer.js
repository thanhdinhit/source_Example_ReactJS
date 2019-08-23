import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import _ from 'lodash';

export default function load(state = {
    payload: clone(initGlobal.payload),
    newContract: _.assign({}, initialState.newContract),
    contracts: [],
    contract: _.assign({}, initialState.newContract),
    meta: {}
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_ALL_CONTRACTS: {
            newState = handleCRUDAction(state, action);
            newState.contracts = action.contracts;
            newState.meta = action.meta;
            newState.payload.success = false;

            return newState;
        }
        case types.ADD_CONTRACT:
            newState = handleCRUDAction(state, action)
            newState.contract = action.contract;
            return newState;
        case types.LOAD_CONTRACT: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.contract = action.contract;
            }
            return newState;
        }
        case types.EDIT_CONTRACT: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.contract = action.contract;
            }
            return newState;
        }
        case types.DELETE_CONTRACT: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.isDeleteContractSuccess = true;
            }
            return newState;
        }
        case types.UPDATE_CONTRACT_DTO:
            newState = update(state, {
                newContract: {
                    [action.fieldName]: {
                        $set: action.value
                    }
                }
            });
            return newState;
        case types.RESET_NEW_CONTRACT_DTO:
            newState = update(state, {
                newContract: {
                    $set: _.cloneDeep(initialState.newContract)
                }
            });
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                newContract: {
                    $set: clone(initialState.newContract)
                },
                contracts: {
                    $set: clone(initialState.contracts)
                },
                payload: {
                    success: {
                        $set: false
                    },
                },
                isDeleteContractSuccess: {
                    $set: false
                }
            });
            return newState;
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
        default:
            return state;
    }
}
