// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase');
const { getProduct, createProduct } = require('./handle/products');
const { createUser, loginUser } = require('./handle/users');

const app = express();

// PRODUCTS ROUTES
// get
app.get('/products', getProduct);
// add
app.post('/products', createProduct);

// USERS ROUTES
// create
app.post('/signup', createUser);
// login
app.post('/login', loginUser);

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);