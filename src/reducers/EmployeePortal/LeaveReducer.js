import * as types from '../../constants/actionTypes';
import typeConfig from '../../constants/typeConfig';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { handleCRUDAction } from '../../services/common';
import _ from 'lodash';

export default function load(state = {
    newLeave: {},
    employeeLeaves: [],
    myLeaves: [],
    payload: _.cloneDeep(initGlobal.payload),
    leaveTypes: [],
    leave: {},
    leaveHours: 0,
    leaveBalances: [],
    employeeLeaveBalances: [],
    meta:{}
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_MY_LEAVES:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.myLeaves = action.myLeaves;
                newState.meta = action.meta;
            }
            return newState;
        case types.LOAD_EMPLOYEE_LEAVES:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.employeeLeaves = action.employeeLeaves;
                newState.meta = action.meta;
            }
            return newState;
        case types.LOAD_ALL_LEAVETYPES:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.leaveTypes = action.leaveTypes;
            }
            return newState;
        case types.LOAD_LEAVE: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.leave = action.leave;
            }
            return newState;
        }
        case types.UPDATE_LEAVE: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.leave = action.leave;
            }
            return newState;
        }
        case types.LOAD_EMPLOYEE_LEAVE_BALANCES: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.employeeLeaveBalances = action.employeeLeaveBalances;
                newState.meta = action.meta;
                newState.payload.success = false;
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
                leaveHours: {
                    $set: 0
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
        case types.CALCULATE_LEAVE_HOURS: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.leaveHours = action.leaveHours;
                newState.payload.success = false;
            }
            return newState;
        }
        case types.SUBMIT_MY_LEAVE: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.leave = action.leave;
            }
            return newState;
        }
        case types.LOAD_MY_LEAVE_BALANCES: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.leaveBalances = action.leaveBalances;
                newState.payload.success = false;
            }
            return newState;
        }
        default:
            return state;
    }
}

