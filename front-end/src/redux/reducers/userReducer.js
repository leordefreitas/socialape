import { LOADING_USER, SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from '../reducers/types';

// REDUCER
// here is where we have acess to the information that the site
// have so become more easy to acess that
const initialState = {
  loading: false,
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: []
};

// here the state is make the initialstate constant and the action
// is the type that will use this reduce
export default function(state = initialState, action) {
  // this is use to get the type and use it
  switch(action.type) {
    case LOADING_USER:
      return {
        ...state,
        loading: true
      }
    case SET_AUTHENTICATED:
      return {
        // when we do this like ...state we is call all the object
        // and we can change what we want to
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    default:
      // every thing i do insede this array is a state so
      // when i change i need to return the state
      return state;
  }
};