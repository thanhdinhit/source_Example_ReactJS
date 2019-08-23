import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState';
import update from 'react-addons-update';
import { clone, handleCRUDAction } from '../../services/common';
import _ from 'lodash';

export default function load(state = {
  meta: {},
  payload: _.clone(initGlobal.payload),
  notifications: {
    informations: [],
    confirmations: []
  },
}, action) {
  let newState;
  switch (action.type) {
    case types.LOAD_NOTIFICATIONS:
      newState = handleCRUDAction(state, action);
      if (newState.payload.success) {
        newState.payload.success = false;
        newState.notifications = action.notifications;
        newState.meta = action.meta;
      }
      return newState;
    case types.LOAD_NOTIFICATION_DETAILS:
      newState = handleCRUDAction(state, action);
      newState.payload.success = false;
      newState.notification = action.notification;
      return newState;
    case types.UPDATE_NOTIFICATION:
      newState = handleCRUDAction(state, action);
      newState.payload.success = false;
      return newState;
    case types.DELETE_NOTIFICATIONS:
      newState = handleCRUDAction(state, action);
      return newState;
    case types.RESET_STATE:
      newState = clone(state);
      newState.payload.success = false;
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