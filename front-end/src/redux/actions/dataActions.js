import { SET_SCREAMS, LOADING_DATA, UNLIKE_SCREAM, LIKE_SCREAM } from '../reducers/types';
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