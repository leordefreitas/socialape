// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const firebase = require('firebase');

const firebaseConfig = {
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
const app = express();
admin.initializeApp();

const db = admin.firestore();

// TO GET THE DATA
app.get('/test', (req, res) => {
  db.collection('test').orderBy('date', 'desc').get()
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

// TO CREATE NEW DATA
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
  db.collection('test').add(newTest)
  .then((doc) => {
    res.json({message: `ID(${doc.id}) created with sucess`});
  })
  .catch((err) => {
    res.status(500).json({error: 'problem with the creation'});
    console.error(err);
  });
});

// TO CREATE NEW USER
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
  db.doc(`/users/${newUser.email}`).get().then(doc => {
    if(doc.exists) {
      return res.status(400).json({email: `this email already exists`});
    } else {
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.status(201).json({token});
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({
          error: `something went wrong with your new user code bellow \n${err.code}`
        });
      });
    };
  });
});

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);