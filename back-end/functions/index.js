// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// firebase library
const firebase = require('firebase');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBuGAluHUpfjwbU1iZmrC2GEAt6KWJpqBY",
  authDomain: "malumodas-aaaeb.firebaseapp.com",
  databaseURL: "https://malumodas-aaaeb.firebaseio.com",
  projectId: "malumodas-aaaeb",
  storageBucket: "malumodas-aaaeb.appspot.com",
  messagingSenderId: "836282117124",
  appId: "1:836282117124:web:3c94325883ac6910995951",
  measurementId: "G-D2X2V98ZP0"
};

firebase.initializeApp(firebaseConfig);

// express library
const express = require('express');
const app = express();

// to get information for firebase
app.get('/test', (req, res) => {
  admin.firestore().collection('test').orderBy('date', 'desc').get()
  .then((doc) => {
    let testArray = [];
    doc.forEach((docToPush) => {
      testArray.push({
        id: docToPush.id,
        name: docToPush.data().name,
        body: docToPush.data().body,
        date: docToPush.data().date
      });
    });
    return res.json(testArray);
  })
  .catch((err) => console.error(err));
});

// to create data
app.post('/test', (req, res) => {
  // method to just post
  if(req.method !== 'POST') {
    res.status(400).json({error: 'only can be (POST) method'})
  };
  // creating
  const newTest = {
    name: req.body.name,
    body: req.body.body,
    date: new Date().toISOString()
  };
  // posting
  admin.firestore().collection('test').add(newTest)
  .then((doc) => {
    res.json({message: `ID(${doc.id}) created with sucess`});
  })
  .catch((err) => {
    res.status(500).json({error: 'problem with the creation'});
    console.error(err);
  });
});

// to create new user
// creating
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    whatsapp: req.body.whatsapp
  };
  // validating information
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then(doc => {
    return res.status(201).json({message: `ID ${doc.user.uid} create with sucess!`})
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({
      error: `${err.code} something went wrong with the creation of the user`
    });
  });
});

// exporting by express
exports.api = functions.https.onRequest(app);