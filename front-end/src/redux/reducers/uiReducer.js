import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../reducers/types';

const initialState = {
  loading: false,
  errors: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      }  
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      }
    default:
      return state;
  } 
}