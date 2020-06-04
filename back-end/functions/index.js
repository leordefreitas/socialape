// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// to get information for firebase
exports.getTest = functions.https.onRequest((req, res) => {
  admin.firestore().collection('test').get()
  .then((doc) => {
    let testArray = [];
    doc.forEach((docToPush) => {
      testArray.push(docToPush.data());
    });
    return res.json(testArray);
  })
  .catch((err) => console.error(err));
});

// to create data
exports.createTest = functions.https.onRequest((req, res) => {

  // method just post
  if(req.method !== 'POST') {
    res.status(400).json({error: 'only can be (POST) method'})
  };

// creating
  const newTest = {
    name: req.body.name,
    body: req.body.body,
    date: admin.firestore.Timestamp.fromDate(new Date())
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