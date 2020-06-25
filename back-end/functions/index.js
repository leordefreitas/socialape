// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const { getAllScreams, createNewScream } = require('./handle/screams');
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
app.get('/products', getAllScreams);
// add
app.post('/products', FBAuth, createNewScream);



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