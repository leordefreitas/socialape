// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const { getProduct, createProduct } = require('./handle/products');
const { createUser, loginUser, upLoadImage } = require('./handle/users');
const { FBAuth } = require('./util/fbAuth');

const app = express();

// PRODUCTS ROUTES
// get
app.get('/products', getProduct);
// add
app.post('/products', FBAuth, createProduct);

// USERS ROUTES
// create
app.post('/signup', createUser);
// login
app.post('/login', loginUser);
// upload images
app.post('/user/image', FBAuth, upLoadImage);

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);