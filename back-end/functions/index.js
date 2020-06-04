// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

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

// exporting by express
exports.api = functions.https.onRequest(app);