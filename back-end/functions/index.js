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
app.get('/products', (req, res) => {
  db.collection('products').orderBy('date', 'desc').get()
  .then((doc) => {
    let productsArray = [];
    doc.forEach((docToPush) => {
      productsArray.push({
        id: docToPush.id,
        type: docToPush.data().type,
        material: docToPush.data().material,
        color: docToPush.data().color,
        size: docToPush.data().size,
        createAt: docToPush.data().date
      });
    });
    return res.json(productsArray);
  })
  .catch((err) => console.error(err));
});

// TO CREATE NEW DATA
app.post('/products', (req, res) => {
  // method to just post
  if(req.method !== 'POST') {
    res.status(400).json({error: 'Only can be POST method'})
  };
  // creating
  const newProduct = {
    type: req.body.type,
    material: req.body.material,
    color: req.body.color,
    size: req.body.size,
    createAt: new Date().toISOString()
  };
  // posting
  db.collection('products').add(newProduct)
  .then((doc) => {
    res.json({message: `ID(${doc.id}) created with sucess`});
  })
  .catch((err) => {
    res.status(500).json({error: 'Problem with the creation'});
    console.error(err);
  });
});

// TO CREATE NEW USER
// functions to validate some informations
const emptyString = (string) => {
  if (string.trim() === '') return true;
  else return false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};
const isWhatsapp = (whatsappNumber) => {
  if (whatsappNumber.toString().length === 11) return true;
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
  // password
  if (emptyString(newUser.password)) {
    errorsOfValidations.password = 'Password must be not empty'
  } else if (newUser.password !== newUser.confirmPassword) {
    errorsOfValidations.password = 'Password must be equal to confirm password'
  }
  // whatsapp
  if (emptyString(newUser.whatsapp)) {
    errorsOfValidations.whatsapp = 'Whatsapp must be not empty'
  } else if (!isWhatsapp(newUser.whatsapp)) {
    errorsOfValidations.whatsapp = 'Whatsapp need 11 numbers'
  }
  // name
  if (emptyString(newUser.name)) {
    errorsOfValidations.name = 'Name must be not empty'
  }
  // errorsOfValidations
  if (Object.keys(errorsOfValidations).length > 0) res.status(400).json(errorsOfValidations);

// validating information
  let token = null;
  let userId = null;
  db.doc(`/users/${newUser.email}`).get()
  .then(doc => {
    if (doc.exists) {
      return res.status(400).json({email: `This email already exists`});
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
  .then(() => {
    return res.status(201).json({ token });
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({
      error: `Something went wrong with your new user, ${err.code}`
    });
  });
});

// TO LOGING
app.post('/login', (req, res) => {
  const userToLogin = {
    email: req.body.email,
    password: req.body.password
  };

  // validating errors
  let errorsOfLogin = {};
  if (emptyString(userToLogin.email)) return errorsOfLogin.email = 'Must not be empty';
  if (emptyString(userToLogin.password)) return errorsOfLogin.password = 'Must not be empty';
  if(Object.keys(errorsOfLogin).length > 0) return res.status(400).json(errorsOfLogin);

  // actually logining
  firebase.auth().signInWithEmailAndPassword(userToLogin.email, userToLogin.password)
  .then(data => {
    return data.user.getIdToken();
  })
  .then(token => {
    return res.json({token})
  })
  .catch(err => {
    return res.status(500).json({err})
  })
});


// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);