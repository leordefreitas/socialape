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
admin.initializeApp();

const app = express();
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
// functions to validate some informations
const emptyString = (string) => {
  if (string.trim() === '') true;
  else false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) true;
  else false;
};
const isWhatsapp = (whatsappNumber) => {
  if (typeof(whatsappNumber) === 'number' && whatsappNumber.toString().length === 11) return true;
  else return false;
};

// creating
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    whatsapp: req.body.whatsapp
  };

  // validating content that user put
  let errorsOfValidations = {};
  
  // emails
  if (emptyString(newUser.email)) {
    errorsOfValidations.email = 'Email must be not empty'
  } else if (!isEmail(newUser.email)) {
    errorsOfValidations.email = 'This is not a email adress'
  }

  if (emptyString(newUser.password)) {
    errorsOfValidations.password = 'Password must be not empty'
  } else if (newUser.password !== newUser.confirmPassword) {
    errorsOfValidations.password = 'Password must be equal to confirm password'
  }




  // validating information
  let token = null;
  let userId = null;
  db.doc(`/users/${newUser.email}`).get()
  .then(doc => {
    if (doc.exists) {
      return res.status(400).json({email: `this email already exists`});
    } else {
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    }
  })
  .then((data) => {
    userId = data.user.uid;
    return data.user.getIdToken();
  })
  // puting user to data
  .then((idToken) => {
    token = idToken;
    const userCredentials = {
      email: newUser.email,
      name: newUser.name,
      whatsapp: newUser.whatsapp,
      createAt: new Date().toISOString(),
      id: userId
    };
    return db.doc(`/users/${newUser.email}`).set(userCredentials);
  })
  .then((nothing) => {
    return res.status(201).json({ token });
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({
      error: `something went wrong with your new user ${err.code}`
    });
  });
});

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);