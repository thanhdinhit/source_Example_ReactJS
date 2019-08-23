import initialState from '../Auth/initialState'
import * as types from '../../constants/actionTypes';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common'
import R from '../../resources/resourceManager'
import _ from 'lodash';
export default function passwordReducer(
    state = {
        payload: _.assign({}, initialState.payload),
        error: clone(initialState.error),
        forgotPassword: false,
        isValidToken: true,
        confirmPW: false
    }, action) {
    let newState;
    switch (action.type) {
        case types.CHANGEPASSWORD_SUCESS:
            newState = update(state, {
                payload: {
                    success: {
                        $set: true,
                    },
                }
            })
            return newState;
        case types.CONFIRMPASSWORD:
            newState = handleCRUDAction(state, action);
            newState.payload.success = false;
            newState = update(newState, {
                confirmPW: {
                    $set: action.confirmPassword
                }
            })
            return newState;
        case types.RESETPASSWORD:
            newState = handleCRUDAction(state, action);
            return newState;
        case types.RESET_ERROR:
            newState = update(state, {
                payload: {
                    error: {
                        $set: initialState.error
                    }
                }
            })
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                confirmPW: {
                    $set: false
                },
                payload: {
                    success: {
                        $set: false
                    },
                },
            });
            return newState;
        case types.LOADING:
            newState = update(state, {
                payload: {
                    isLoading: {
                        $set: true
                    }
                },
            });
            return newState;
        case types.CHANGEPASSWORD_FAIL:
            newState = handleCRUDAction(state, action);
            newState = update(state, {
                payload: {
                    error: {
                        $set: action.error
                    },
                }
            });
            return newState;
        default:
            return state;
    }
}
