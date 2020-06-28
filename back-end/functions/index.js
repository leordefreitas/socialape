// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const { 
  getAllScreams, 
  createNewScream,
  getOneScream 
} = require('./handle/screams');
const { 
  createUser,
  loginUser, 
  upLoadImage, 
  addUserDetail,
  getAuthenticatedUser
} = require('./handle/users');
const { FBAuth } = require('./util/fbAuth');

const app = express();

// SCREAM ROUTES
// get
app.get('/screams', getAllScreams);
// add
app.post('/scream', FBAuth, createNewScream);
// get all information about one scream
app.get('/scream/:screamId', getOneScream)

// TODOS
// TODO delete scream
// TODO like a scream 
// TODO unlike a scream
// TODO comment on scream


// USERS ROUTES
// create
app.post('/signup', createUser);
// login
app.post('/login', loginUser);
// upload images
app.post('/user/image', FBAuth, upLoadImage);
// add user details
app.post('/user', FBAuth, addUserDetail);
// get user
app.get('/user', FBAuth, getAuthenticatedUser);

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);