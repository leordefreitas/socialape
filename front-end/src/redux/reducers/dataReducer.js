import { POST_SCREAM, SET_SCREAMS, LOADING_DATA, LIKE_SCREAM, UNLIKE_SCREAM, DELETE_SCREAM, SET_SCREAM } from './types';

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
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload
      }
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }
    case LIKE_SCREAM:
      let indexLike = state.screams.findIndex(scream => scream.id === action.payload.id);
      state.screams[indexLike] = action.payload;
      return {
        ...state
      }
    case UNLIKE_SCREAM:
    let indexUnlike = state.screams.findIndex(scream => scream.id === action.payload.id);
    state.screams[indexUnlike] = action.payload;
      return {
        ...state
      }
    case DELETE_SCREAM:
      let indexDelete = state.screams.findIndex(scream => scream.id === action.payload)
      state.screams.splice(indexDelete, 1)
      return {
        ...state
      }
    case POST_SCREAM:
      return {
        ...state,
        screams: [
          action.payload,
          ...state.screams
        ]
      }
    default:
      return  {
      ...state
      }
  }
}