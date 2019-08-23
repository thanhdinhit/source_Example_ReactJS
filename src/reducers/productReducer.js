import {LOAD_PRODUCT, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT} from '../constants/actionTypes';

import objectAssign from 'object-assign';


// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// and update values on the copy.
export default function load(state = { products: [] }, action) {

  switch (action.type) {
    case LOAD_PRODUCT:
      return objectAssign({}, state, {
        products: action.products,
        category: action.category
      });
    case ADD_PRODUCT:
      return objectAssign({}, state, {
        products: action.products,
        category: action.category
      });
    case EDIT_PRODUCT:
      return objectAssign({}, state, {
        products: action.products,
        category: action.category
      });
    case DELETE_PRODUCT:
      return objectAssign({}, state, {
        products: action.products,
        category: action.category
      });
    default:
      return state;
  }
}
