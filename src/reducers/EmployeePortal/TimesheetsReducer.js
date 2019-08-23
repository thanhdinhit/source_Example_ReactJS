import * as types from '../../constants/actionTypes';
import _ from 'lodash';
import initGlobal from '../Auth/initialState'
import { clone, handleCRUDAction } from '../../services/common'
import initialState from './initialState'
import update from 'react-addons-update'
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function timesheetReducer(state = {
  workingStatus: {},
  myTimesheets: [],
  memberTimesheets: [],
  teamTimesheets: [],
  addEditTimesheet: clone(initialState.addEditTimesheet),
  success: false,
  meta: {},
  metaDetail: {},
  employeeInfo: {},
  payload: _.cloneDeep(initGlobal.payload),
  members: [],
  employeeTimesheets: [],
  timesheetsOfEmployee: {},
  countErrorTimesheet: 0,
  groupStatusTimesheets: [],
  countAllPending: 0
}, action) {
  let newState;
  switch (action.type) {
    case types.LOAD_EMPLOYEE_TIMESHEETS:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.employeeTimesheets = action.employeeTimesheets;
        newState.meta = action.meta;
      }
      return newState;
    case types.LOAD_GROUP_TIMESHEETS:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.groupTimesheets = action.groupTimesheets;
        newState.meta = action.meta;
      }
      return newState;
    case types.LOAD_TIMESHEET_TYPE:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.timesheetTypes = action.timesheetTypes;
      }
      return newState;
    case types.LOAD_TIMESHEET_SETTING:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.timesheetSetting = action.timesheetSetting;
      }
      return newState;
    case types.LOAD_TIMESHEETS_EMPLOYEE: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.timesheetsOfEmployee = action.timesheetsOfEmployee;
      }
      return newState;
    }
    case types.LOAD_TIMESHEET_SETTING:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.timesheetSetting = action.timesheetSetting;
      }
      return newState;
    case types.LOAD_GROUP_TIMESHEETS:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.groupTimesheets = action.groupTimesheets;
        newState.meta = action.meta;
      }
      return newState;
    case types.UPDATE_TIMESHEET: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.timesheet = action.timesheet;
      }
      return newState;
    }
    case types.LOAD_GROUP_STATUS_TIMESHEETS: {
      // groupStatusTimesheets
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.groupStatusTimesheets = action.groupStatusTimesheets;
      }
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
    case types.LOAD_SUBMITTER_TIMESHEETS:
      newState = clone(state);
      if (action.error && action.error.code != 0 || action.error.exception) {
        newState.error = action.error;
        return newState;
      }
      newState.myTimesheets = action.myTimesheets;
      newState.memberTimesheets = action.memberTimesheets;
      newState.metaDetail = action.meta;
      newState.error = clone(initGlobal.error);
      return newState;
    case types.LOAD_TEAM_TIMESHEETS:
      newState = clone(state);
      if (action.error && action.error.code != 0 || action.error.exception) {
        newState.error = action.error;
        return newState;
      }
      newState.teamTimesheets = action.teamTimesheets;
      newState.meta = action.meta;
      newState.error = clone(initGlobal.error);
      return newState;
    case types.UPDATE_DTO_TIMESHEET:
      newState = clone(state);
      newState.addEditTimesheet[action.fieldName] = action.value;
      if (action.fieldName == "success") {
        let employeeId = newState.addEditTimesheet.employeeId;
        newState.addEditTimesheet = clone(initialState.addEditTimesheet)
        newState.addEditTimesheet.employeeId = employeeId;
      }
      return newState
    case types.UPDATE_PAYLOAD_TIMESHEET:
      // newState = update(state,{
      //   payLoad:{
      //     $set: state.payLoad
      //   }
      // });
      newState = clone(state);
      newState.payload[action.fieldName] = action.value;
      return newState;
    case types.LOAD_TIMESHEET:
      newState = clone(state);
      if (action.error && action.error.code != 0 || action.error.exception) {
        newState.error = action.error;
        return newState;
      }
      newState.addEditTimesheet = action.addEditTimesheet;
      newState.error = clone(initGlobal.error);
      return newState;
    case types.ADD_EDIT_TIMESHEET:
      newState = clone(state);
      if (action.error && action.error.code == 0 && !action.error.exception)
        newState.addEditTimesheet.success = true;
      newState.error = action.error;
      return newState;
    case types.LOAD_WORKINGSTATUS:
      newState = update(state, {
        workingStatus: {
          $set: action.workingStatus
        }
      });
      return newState;
    case types.POST_WORKINGSTATUS:
      newState = update(state, {
        workingStatus: {
          $set: action.workingStatus
        },
        success: {
          $set: action.error && action.error.code == 0 && !action.error.exception
        },
        error: {
          $set: action.error
        }
      });
      return newState;
    case types.LOAD_EMPLOYEE:
      newState = update(state, {
        employeeInfo: {
          $set: action.employeeInfo
        },
        error: {
          $set: action.error
        }
      });
      return newState;
    case types.LOAD_ALL_EMPLOYEE:
      newState = update(state, {
        members: {
          $set: action.members
        },
        error: {
          $set: action.error
        }
      });
      return newState;
    case types.EDIT_TIMESHEET:
      newState = update(state, {
        success: {
          $set: action.error && action.error.code == 0 && !action.error.exception
        },
      });
      return newState;
    case types.DELETE_TIMESHEET:
      newState = update(state, {
        success: {
          $set: action.error && action.error.code == 0 && !action.error.exception
        },
      });
      return newState;
    case types.LOAD_MY_TIMESHEETS: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.myTimesheets = action.myTimesheets;
      }
      return newState;
    }
    case types.APPROVE_TIMESHEETS: {
      newState = handleCRUDAction(state, action);
      newState.countErrorTimesheet = action.countErrorTimesheet;
      if (newState.countErrorTimesheet) {
        newState.payload.success = false;
      }
      return newState;
    }
    case types.LOAD_ALL_PENDINGS_TIMESHEETS: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.countAllPending = action.countAllPending.countPendings;
      }
      return newState;
    }
    case types.APPROVE_ALL_TIMESHEETS: {
      newState = handleCRUDAction(state, action);
      newState.countErrorTimesheet = action.countErrorTimesheet;
      if (newState.countErrorTimesheet > 0) {
        newState.payload.success = false;
      }
      return newState;
    }
    case types.SUBMIT_TEAM_TIMESHEETS: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.submitTeamTimesheets = action.submitTeamTimesheets;
      }
      return newState;
    }
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.employeeTimesheetHistories = action.employeeTimesheetHistories;
        newState.meta = action.meta;
      }
      return newState;
    case types.LOAD_TIMESHEET_HISTORY_EMPLOYEE:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
      }
      return newState;
    case types.LOAD_GROUP_TIMESHEETS_HISTORY: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.groupsTimesheetsHistory = action.groupsTimesheetsHistory;
      }
      return newState;
    }
    case types.LOAD_APPROVER_GROUP_TIMESHEETS_HISTORY: {
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.submittedGroupsTimesheetsHistory = action.submittedGroupsTimesheetsHistory;
      }
      return newState;
    }
    case types.RESET_STATE:
      newState = update(state, {
        countErrorTimesheet: {
          $set: 0
        },
        groupTimesheets: {
          $set: []
        },
        groupStatusTimesheets: {
          $set: []
        }
      });
      return newState;
    case types.RESET_SUCCESS:
      newState = update(state, {
        payload: {
          success: {
            $set: false
          },
        }
      });
      return newState;
    default:
      return state;
  }
}
