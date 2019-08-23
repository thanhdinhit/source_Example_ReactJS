import * as types from '../../constants/actionTypes';
import initGlobal from '../Auth/initialState'
import { clone, handleCRUDAction } from '../../services/common'
import initialState from './initialState'
import update from 'react-addons-update'
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = {
    cities: [],
    districts: [],
    states: [],
    meta: {}
}, action) {
    let newState;
    switch (action.type) {
        case types.LOAD_CITIES:
            newState = update(state, {
                cities: {
                    $set: action.cities
                }
            })
            return newState;
        case types.LOAD_DISTRICTS:
            newState = update(state, {
                districts: {
                    $set: action.districts
                }
            })
            return newState;
        case types.LOAD_ALL_STATE:
            newState = update(state, {
                states: {
                    $set: action.states
                }
            })
            return newState;
        default:
            return state;
    }
}
