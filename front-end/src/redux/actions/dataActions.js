import { 
  SET_SCREAMS, 
  LOADING_DATA, 
  UNLIKE_SCREAM, 
  LIKE_SCREAM, 
  DELETE_SCREAM, 
  POST_SCREAM, 
  LOADING_UI, 
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_SCREAM,
  STOP_LOADING_UI
} from '../reducers/types';
import  axios from 'axios';

// get all screams
export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios.get('/screams')
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data
      })
    })
    .catch(err => console.error(err))
};

// get one scream
export const getScream = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data
      })
      dispatch({ type: STOP_LOADING_UI })
    })
    .catch(err => console.error(err))
};

// post scream
export const postScream = (newScreamData) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios.post('/scream', newScreamData)
  .then(res => {
    dispatch({
      type: POST_SCREAM,
      payload: res.data
    })
    dispatch({ type: CLEAR_ERRORS })
  })
  // here just becouse they have the handle errors in our
  // back-end so when give me an error in the bac-end i can
  // use in here so that becouse this
  .catch(err => {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    })
  })
};

// like
export const likeScream = (screamId) => (dispatch) => {
  axios.get(`/scream/${screamId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data
      })
    })
    .catch(err => console.error(err))
};

// unlike
export const unlikeScream = (screamId) => (dispatch) => {
  axios.get(`/scream/${screamId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data
      })
    })
    .catch(err => console.error(err))
};

// delete Scream
export const deleteScream = (screamId) => (dispatch) => {
  axios.delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({
        type: DELETE_SCREAM,
        payload: screamId
      })
    })
    .catch(err => console.error(err));
};

// clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS })
};