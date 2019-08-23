import * as types from '../../constants/actionTypes';
import typeConfig from '../../constants/typeConfig';
import initGlobal from '../Auth/initialState';
import initialState from './initialState';
import update from 'react-addons-update';
import { handleCRUDAction } from '../../services/common';
import _ from 'lodash';

export default function load(state = {
    payload: _.cloneDeep(initGlobal.payload),
    myOvertimes: [],
    newOvertime: _.cloneDeep(initialState.newOvertime),
    teamOvertimes: [],
    overtimeSetting:{},
    overtimeStatistic: []
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_TEAM_OVERTIME: {
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.teamOvertimes = action.teamOvertime;
                newState.meta = action.meta;
            }
            return newState;
        }
        case types.LOAD_MY_OVERTIMES:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.myOvertimes = action.myOvertimes;
                newState.meta = action.meta;
            }
            return newState;
        case types.LOAD_MY_OVERTIME:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.overtime = action.overtime;
            }
            return newState;
        case types.UPDATE_MY_OVERTIME:
            newState = handleCRUDAction(state, action);
            return newState;
        case types.UPDATE_OVERTIME_DTO:
            newState = update(state, {
                newOvertime: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            })
            return newState;
        case types.ADD_NEW_OVERTIME:
            newState = handleCRUDAction(state, action);
            return newState;
        case types.RESET_OVERTIME_DTO:
            newState = update(state, {
                newOvertime: {
                    $set: _.cloneDeep(initialState.newOvertime)
                }
            });
            return newState;
        case types.LOAD_OVERTIME_STATISTIC:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.overtimeStatistic = action.overtimeStatistic;
                newState.meta = action.meta;
                if(newState.newOvertime.employees.length){
                    newState.newOvertime.employees.forEach(function (employee) {
                        let employeeStatistic = action.overtimeStatistic.find(x => x.employee.id == employee.id);
                        if (employeeStatistic) {
                            employee.hours = employeeStatistic.hours;
                        }
                    }, this);
                }
            }

            return newState;
        case types.LOAD_OVERTIME_SETTING:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.overtimeSetting = action.overtimeSetting;
            }
            return newState;
        case types.UPDATE_MEMBER_OVERTIME:
            newState = handleCRUDAction(state, action);
            return newState;
        case types.RESET_STATE:
            newState = update(state, {
                payload: {
                    success: {
                        $set: false
                    },
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
        case types.LOAD_OVERTIME_STATISTIC:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.overtimeStatistic = action.overtimeStatistic;
                newState.meta = action.meta;
            }
            return newState;
        case types.LOAD_OVERTIME_SETTING:
            newState = handleCRUDAction(state, action);
            if (newState.payload.success) {
                newState.payload.success = false;
                newState.overtimeSetting = action.overtimeSetting;
            }
            return newState;
        default:
            return state;
    }
}
