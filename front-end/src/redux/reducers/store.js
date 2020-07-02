// createStore is to create a new storage
// combineReducers is to get together more then one reduce
// applyMidleware is to get a security to the aplications
// compose ??
import { 
  createStore, 
  combineReducers, 
  applyMiddleware, 
  compose 
} from 'redux';
import thunk from 'redux-thunk';

// IMPORTING THE REDUCERS
import userReducer from './userReducer';
import uiReducer from './uiReducer';
// import dataReducer from './dataReducer';

const initialState = {};

const middleware = [thunk];

// this is the reducers to became one 
const reducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  // data: dataReducers
});

// store
// `here we create this is all in the website redux
// `the code window was take from tyhe site becouse allow us
// `to see in the devtools better what file is goin where
const store = createStore(
  reducers, 
  initialState, 
  compose(applyMiddleware(...middleware)
  , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;
