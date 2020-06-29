// SEPARETING ADMIN FROM THE MAIN SCRIPT
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebaseAdmin/malumodas-admin.json')),
  storageBucket: "gs://malumodas-aaaeb.appspot.com/"
});

const db = admin.firestore();

module.exports = { admin, db };