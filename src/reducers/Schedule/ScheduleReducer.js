import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState'
import initialState from './initialState'
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import _ from 'lodash';
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = {
  scheduleEmployeeView: [],
  scheduleShiftView: _.cloneDeep(initialState.scheduleShiftView),
  schedules: [],
  meta: {},
  payload: _.clone(initGlobal.payload),
  schedule: _.clone(initialState.schedule),
  contractGroup: {},
  mySchedule: {}
}, action) {
  let newState;
  switch (action.type) {
    case types.LOAD_SCHEDULE:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.schedule = action.schedule;
        newState.contractGroup = action.contractGroup;
      }
      return newState;
    case types.LOAD_SCHEDULES:
      newState = handleCRUDAction(state, action);
      if(newState.payload.success){
        newState.payload.success = false;
        newState.schedules = action.schedules;
        newState.meta = action.meta;
      }
      return newState;
    case types.LOAD_EMPLOYEE_SCHEDULES:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.scheduleShiftView = action.employeeSchedules.scheduleShiftView;
        newState.scheduleEmployeeView = action.employeeSchedules.scheduleEmployeeView;
      }
      return newState;
    case types.LOAD_MY_SCHEDULES:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.mySchedule = action.mySchedule;
      }
      return newState;
    case types.LOAD_SCHEDULE_GROUPS_SUB: {
      newState = handleCRUDAction(state, action);
      newState.payload.success = false;
      newState.scheduleSubGroups = action.subGroups;
      return newState;
    }
    case types.RESET_STATE:
    case types.RESET_SCHEDULE_STATE:
      newState = update(state, {
        payload: {
          success: {
            $set: false
          },
        }
      });
      return newState;
    case types.RESET_SCHEDULE_SHIFTVIEW_STATE:
      newState = update(state, {
        scheduleShiftView: {
          $set: _.cloneDeep(initialState.scheduleShiftView)
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
    case types.LOADING:
      newState = update(state, {
        payload: {
          isLoading: {
            $set: true
          }
        }
      })
      return newState;

    default:
      return state;
  }
}
