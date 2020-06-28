// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const { 
  getAllScreams, 
  createNewScream,
  getOneScream,
  commentOnScream 
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
// get all screams
app.get('/screams', getAllScreams);
// add one scream
app.post('/scream', FBAuth, createNewScream);
// get all information about one scream
app.get('/scream/:screamId', getOneScream);
// add a comment on a scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// TODOS
// TODO delete scream
// TODO like a scream 
// TODO unlike a scream


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