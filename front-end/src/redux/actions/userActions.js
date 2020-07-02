// ACTIONS EXPLICATIONS
// it is the triggers that is activeted by the types
import { 
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  SET_UNAUTHENTICATED, 
  LOADING_USER 
} from '../reducers/types';
import axios from 'axios';

// LOGIN USER
// dispacth is use to get the asyncronous of this function
// so i can have acess more informations
export const loginUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post('/login', newUserData)
      .then(res => {
        // console.log(res.data);
        setAuthorizationsHeader(res.data.token);
        dispatch(getUserData());
        // this type is only to clean any errors the code may have
        dispatch({ type: CLEAR_ERRORS });
        // this is to move into thata direction
        history.push('/');
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          // this the usual to user when put some err
          payload: err.response.data
        })
      })
};

// LOGOUT THE USER
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIToken');
  // to delete a header that i wannna
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};


// GET USER DATA
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios.get('/user')
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      })
    })
    .catch(err => console.error(err));
};

// SIGNUP
export const signupUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post('/signup', userData)
      .then(res => {
        // console.log(res.data);
        setAuthorizationsHeader(res.data.token);
        dispatch(getUserData());
        // this type is only to clean any errors the code may have
        dispatch({ type: CLEAR_ERRORS });
        // this is to move into thata direction
        history.push('/');
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          // this the usual to user when put some err
          payload: err.response.data
        })
      })

    };
    
// FUCTION TO SET THE TOKEN
// this is to put the token locally becousa when
// update the page the token is the same
const setAuthorizationsHeader = (token) => {
  const FBIToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIToken);
  // this axios here is to put the Bearer inside the authorization header
  axios.defaults.headers.common['Authorization'] = FBIToken;
};
    
