import { SET_SCREAMS, LOADING_DATA, LIKE_SCREAM, UNLIKE_SCREAM } from './types';

const initialState = {
  screams: [],
  scream: {},
  loading: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false
      }
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }
    case LIKE_SCREAM:
      let indexLike = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
      state.screams[indexLike] = action.payload;
      return {
        ...state
      }
    case UNLIKE_SCREAM:
    let indexUnlike = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
    state.screams[indexUnlike] = action.payload;
    return {
      ...state
    }
    default:
      return  {
      ...state
      }
  }
}